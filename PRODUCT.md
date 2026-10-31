# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router), React 19, Tailwind 4, generated axios client from `doc/api.yml` (this repository; the API lives in huocode-bot/huocode).

## Users

Developers, tech leads and reviewers who want to know, in under a minute, which files of a public Java repository deserve attention first: before a refactor, an onboarding, a code review, or when evaluating an open-source dependency.

## Product Purpose

HuoCode maps hotspots in a public GitHub repository: files that are both complex (worst-method cyclomatic complexity) and changing a lot (line churn over the last 500 commits). Paste a URL, get a shareable report. Success: the user finds the file to look at first without reading any methodology.

## Positioning

Free, instant, zero-setup hotspot map (the CodeScene method) with gitingest/gitdiagram-level simplicity: one field, one result, a permanent link. Honest by design: scores are relative within the repository, never "this file is bad".

## Constraints

- Backend returns only numbers and enum codes; every sentence is built client-side, in English.
- No jargon on screen (cached, jobId, polling, rate limit, percentile, API, Turnstile).
- No letter grades, no pass/fail wording, no mention of plans or payments.
- Quadrant colors are flat and categorical; test files violet `#A371F7`; unanalyzed files hatched grey, never shown as low risk.
- Java only in v1; other files are listed, never scored.
- Below 15 analyzable files: no score, no quadrants.

## Brand commitments

- Logo: rose ember gradient mark (`#E0503A` → `#F08AA6`), rounded-bar geometry; wordmark "Code" in aubergine `#2B1B30` on light, `#F4ECEF` on dark (rebranded 2026-10-31, PR #11).
- Name: HuoCode (火, fire).
- Owner wants a design with a feminine touch: elegant and refined, beautiful while staying a professional dev tool; light theme.
- Typeface: Hanken Grotesk for all UI text (owner rejected Bodoni as unreadable); Red Hat Mono for paths and figures.
