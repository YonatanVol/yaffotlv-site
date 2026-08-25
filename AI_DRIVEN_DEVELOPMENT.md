# AI-Driven Development — the 12 steps

How work gets done in this repo. Most of it was already being followed implicitly;
this writes it down so it survives across sessions and people.

The point of all twelve is one thing: **an AI can produce a lot of plausible code
very fast, so the process has to be built around proving it right and leaving a
trail of why.** Speed comes from the model. Trust has to come from here.

Each step says what it produces and how you know it's finished.

---

## 1 — Frame the ask

Restate the request in a paragraph, in your own words, and name what is
explicitly **out** of scope. If two readings of the request lead to different
work, that's a question (step 3), not a guess.
**Done when:** the restatement would satisfy the person who asked.

## 2 — Recon, read-only

Read before writing. Map the code that already exists, find the helpers,
patterns and conventions to reuse. No edits in this step — the repo's earlier
"Phase 0" entries in [CHANGES.md](CHANGES.md) are this step done well.
**Done when:** you can name the files you'll touch and the existing code you'll
reuse instead of rewriting.

## 3 — Surface the unknowns

Ask the blocking questions **before** building, not after. Anything that needs
the owner's judgement gets marked `⏳ NEEDS YOU` in [DECISIONS.md](DECISIONS.md)
and waits. Everything that *doesn't* depend on the answer carries on.
**Done when:** nothing is left that would make you throw work away if the answer
went the other way.

## 4 — Plan

Files to touch, the approach, the risks, what could go wrong. Short enough to
scan, specific enough to execute.
**Done when:** someone else could follow it.

## 5 — Record the judgement calls

Every non-obvious choice becomes a `D-XX.n` record in
[DECISIONS.md](DECISIONS.md) — `**Decided:**` / `**Why:**` — written when the
call is made, not reconstructed afterwards. Record the ones you *didn't* take
too, and why.
**Done when:** a reader in six months won't have to re-litigate the choice.

## 6 — Build the pure core first

Separate the logic from the I/O. The part that decides things should be callable
without a network, a database, or a browser — [`lib/music/match.ts`](lib/music/match.ts)
is the reference example, and [`lib/pricing.ts`](lib/pricing.ts) before it.
**Done when:** the interesting logic has no imports you'd need to mock.

## 7 — Test the core

`node --test` via `npm test`, against real-world inputs — the messy ones, not the
tidy ones. Pin the behaviour that would be expensive to get wrong quietly.
**Done when:** a plausible regression would fail a test, not reach production.

## 8 — Wire the edges

Routes and UI: validate every input (`zod`), gate auth, type the errors so the
caller can act on them. Secrets come only from [`lib/env.ts`](lib/env.ts), which
throws rather than falling back to an insecure default.
**Done when:** a malformed or hostile request gets a clear status, not a stack
trace or a silent default.

## 9 — Verify, and say what you ran

`npm test`, `npx tsc --noEmit`, `npm run lint` (distinguish new problems from
pre-existing ones), `npm run build`, and an actual run of the actual flow against
a dev server. Real output, not assumptions.
**Done when:** you can state each result plainly, including anything that failed.

## 10 — Log it

A [CHANGES.md](CHANGES.md) entry at the top: what changed and **why**, with links
to the files. Written for someone who wasn't here.
**Done when:** the entry explains the change without the diff.

## 11 — Ship

Own branch, a commit message that carries the reasoning rather than a summary of
the diff, a PR that includes its own verification section and the env/setup steps
a human still has to do.
**Done when:** the PR could be reviewed by someone with no context from the
conversation that produced it.

## 12 — Close the loop

Answer the review — fix what's valid, and push back with evidence on what isn't;
a review comment is a claim to check, not an order to obey. Keep the branch
merged with `main`. Drive CI green.
**Done when:** it's merged. Not when the code was written.

---

## The rule underneath all of them

**Never report something as working that you haven't seen work.** If a step was
skipped, say so. If a test fails, show it. If you're unsure, say that instead of
hedging — an honest "I didn't verify this" is worth more than a confident summary
that turns out to be wrong.
