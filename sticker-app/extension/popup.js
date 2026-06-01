const grid = document.getElementById("grid");
const status = document.getElementById("status");
const selectRow = document.getElementById("select-row");
const selectAll = document.getElementById("select-all");
const countLabel = document.getElementById("count-label");
const importBtn = document.getElementById("import-btn");
const clearBtn = document.getElementById("clear-btn");

let allUrls = [];
const selected = new Set();

function updateUI() {
  const n = selected.size;
  countLabel.textContent = `${n} selected`;
  importBtn.disabled = n === 0;
  importBtn.textContent = n > 0 ? `Import ${n} sticker${n !== 1 ? "s" : ""} to WhatsApp` : "Import to WhatsApp";
  selectAll.checked = selected.size === allUrls.length && allUrls.length > 0;
  selectAll.indeterminate = selected.size > 0 && selected.size < allUrls.length;
}

function buildGrid(urls) {
  allUrls = urls;
  grid.innerHTML = "";
  selected.clear();
  urls.forEach((url) => {
    selected.add(url);
    const cell = document.createElement("div");
    cell.className = "sticker-cell selected";
    cell.dataset.url = url;
    cell.innerHTML = `
      <img src="${url}" alt="" loading="lazy" />
      <span class="check">
        <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
    `;
    cell.addEventListener("click", () => {
      if (selected.has(url)) {
        selected.delete(url);
        cell.classList.remove("selected");
      } else {
        selected.add(url);
        cell.classList.add("selected");
      }
      updateUI();
    });
    grid.appendChild(cell);
  });
  updateUI();
}

selectAll.addEventListener("change", () => {
  for (const cell of grid.querySelectorAll(".sticker-cell")) {
    const url = cell.dataset.url;
    if (selectAll.checked) {
      selected.add(url);
      cell.classList.add("selected");
    } else {
      selected.delete(url);
      cell.classList.remove("selected");
    }
  }
  updateUI();
});

importBtn.addEventListener("click", async () => {
  if (selected.size === 0) return;
  const { app_url: appUrl = "http://localhost:3000" } = await chrome.storage.local.get("app_url");
  const payload = btoa(JSON.stringify([...selected]));
  chrome.tabs.create({ url: `${appUrl}/import?s=${payload}` });
});

clearBtn.addEventListener("click", async () => {
  await chrome.storage.session.remove(["stickers", "ts"]);
  allUrls = [];
  selected.clear();
  grid.innerHTML = "";
  status.textContent = "Stickers cleared. Open TikTok's sticker drawer to capture new ones.";
  selectRow.style.display = "none";
  clearBtn.style.display = "none";
  importBtn.disabled = true;
});

async function init() {
  const { stickers = [], ts } = await chrome.storage.session.get(["stickers", "ts"]);
  if (stickers.length === 0) return;

  const age = ts ? Math.round((Date.now() - ts) / 60000) : null;
  status.textContent = `${stickers.length} sticker${stickers.length !== 1 ? "s" : ""} captured${age !== null ? ` (${age} min ago)` : ""}. Select the ones you want to import.`;
  selectRow.style.display = "flex";
  clearBtn.style.display = "block";
  buildGrid(stickers);
}

init();
