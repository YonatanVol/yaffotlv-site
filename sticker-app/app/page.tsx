import Link from "next/link";
import { Button } from "@/components/ui/button";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "StickerPack";

const steps = [
  {
    title: "Paste a TikTok link",
    body: "Drop in a public TikTok video URL. We pull the sticker replies from its comments — or upload your own images.",
  },
  {
    title: "Pick your stickers",
    body: "We convert each one to a WhatsApp-ready 512×512 WebP. Choose 3–30 for your pack.",
  },
  {
    title: "Install on WhatsApp",
    body: "Download a .wastickers file on Android, or grab individual stickers with our iOS guide.",
  },
];

const faqs = [
  {
    q: "Do I need to log into TikTok?",
    a: "No. We only read publicly available comment stickers. If a video can't be read automatically, you can upload the sticker images manually.",
  },
  {
    q: "Does it work on iPhone?",
    a: "Yes — iOS can't open .wastickers directly, so we give you each sticker as a WebP plus a short guide to import them via the free Sticker.ly app.",
  },
  {
    q: "What does it cost?",
    a: "Free covers 5 sticker conversions per month. Pro is $4.99/month for up to 300 conversions and priority processing.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Nav */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold tracking-tight">{appName}</span>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/login" className="font-medium text-slate-600 hover:text-slate-900">
            Log in
          </Link>
          <Link href="/signup">
            <Button>Get started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Turn TikTok stickers into WhatsApp packs
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
          Paste a TikTok video and get a ready-to-install WhatsApp sticker pack
          in seconds. No TikTok login required.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/signup">
            <Button className="px-6 py-3 text-base">Try it free</Button>
          </Link>
          <Link href="#pricing">
            <Button variant="secondary" className="px-6 py-3 text-base">
              See pricing
            </Button>
          </Link>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          5 free stickers every month — no credit card needed.
        </p>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-bold">Simple pricing</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-8">
              <h3 className="font-semibold">Free</h3>
              <p className="mt-2 text-3xl font-bold">$0</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li>5 sticker conversions / month</li>
                <li>Unlimited pack downloads</li>
                <li>TikTok extraction + manual upload</li>
              </ul>
              <Link href="/signup" className="mt-8 block">
                <Button variant="secondary" className="w-full">
                  Start free
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-indigo-600 p-8">
              <h3 className="font-semibold text-indigo-600">Pro</h3>
              <p className="mt-2 text-3xl font-bold">
                $4.99
                <span className="text-base font-normal text-slate-500">/mo</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li>Up to 300 conversions / month</li>
                <li>Priority processing</li>
                <li>Everything in Free</li>
              </ul>
              <Link href="/signup" className="mt-8 block">
                <Button className="w-full">Go Pro</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-center text-2xl font-bold">FAQ</h2>
          <dl className="mt-10 space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl bg-white p-6 shadow-sm">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-2 text-sm text-slate-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
        {appName} · Not affiliated with TikTok or WhatsApp. You are responsible
        for the content you convert.
      </footer>
    </main>
  );
}
