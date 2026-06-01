const input = document.getElementById("app-url");
const saveBtn = document.getElementById("save-btn");
const savedLabel = document.getElementById("saved");

chrome.storage.local.get("app_url").then(({ app_url }) => {
  input.value = app_url || "";
});

saveBtn.addEventListener("click", async () => {
  const url = input.value.trim().replace(/\/$/, "");
  if (!url) return;
  await chrome.storage.local.set({ app_url: url });
  savedLabel.style.display = "inline";
  setTimeout(() => { savedLabel.style.display = "none"; }, 2000);
});
