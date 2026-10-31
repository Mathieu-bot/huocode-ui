# HuoCode UI

Web client for the HuoCode API. Paste a public GitHub URL, and the app maps
where the risk sits in the codebase.

The API lives in [`huocode-bot/huocode`](https://github.com/huocode-bot/huocode).
`doc/api.yml` there is the contract this client is generated from — it is not
hand-maintained here.

## Getting started

```bash
pnpm install
pnpm dev
```

Configure it with a `.env.local`:

| Variable                         | What it is                                                                |
| -------------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_HUO_API_URL`        | HuoCode API base URL. Defaults to the preproduction instance.             |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key for the challenge before a new analysis.    |
| `NEXT_PUBLIC_SITE_URL`           | Public origin of this app, used for canonical and social links. Optional. |

The API's `huocode.cors.allowed-origins` must list this app's origin
(`http://localhost:3000` in development), or the browser blocks every request.

## Routes

| Route                                     | What it shows                                    |
| ----------------------------------------- | ------------------------------------------------ |
| `/`                                       | Landing page: paste a repository                 |
| `/analyze/{owner}/{repo}?job=`            | Analysis in progress                             |
| `/report/{owner}/{repo}?tab=&view=#file=` | Report, with its tab, map view and selected file |
| `/{owner}/{repo}`                         | Shortcut that redirects to the report            |
| `/how-it-works`                           | How the score is computed                        |

## Architecture

```
src/
  app/                 Next routes only: thin pages that compose features
  features/
    landing/           hero, repository field, examples
    analysis/          /analyze flow: quick and long analyses, failures, verification
    report/
      shell/           report loading states, header, sticky tabs, shared context
      file-detail/     the file panel shared by Map and Files
      overview/        score tape, group matrix, start here, caveats
      map/             treemap and scatter (layout.ts holds the pure maths)
      files/           explorer (filters.ts holds the pure filtering)
      model.ts         pure helpers over the API report shape
      copy.ts          report wording shared by the tabs
    how-it-works/      methodology page
  shared/              ui primitives, layout, generic hooks and helpers (never imports a feature)
  api/                 thin wrappers over the generated client
  api-client/          generated from doc/api.yml, never edited by hand
  styles/tokens.css    design tokens; contrast pairs checked by scripts/contrast.mjs
tests/                 mirrors src/
```

Rules, enforced by ESLint where possible:

- A feature is a folder with `components/`, optional `hooks/`, a `copy.ts` for every sentence it shows, and pure helpers next to them. Inside a feature, import with relative paths.
- Features meet only through their `index.ts` (`@/features/report`); `shared/` never imports a feature; routes in `app/` import features, never the reverse.
- No user-facing string in a component: wording lives in `copy.ts` files and only interpolates numbers the API sent. No jargon on screen (percentile, API, cached…).
- Logic that can be pure is pure and tested under `tests/` with the real `tests/fixtures/javapoet.json` response. Async work lives in hooks.
- Source files stay under 200 lines (`max-lines`).
- Colours come from `tokens.css`; a new text-on-colour pair is added to `scripts/contrast.mjs`.
- `pnpm verify` runs format, lint, typecheck, tests, contrast and build; it must pass before every commit.

## Scripts

| Script           | What it does                            |
| ---------------- | --------------------------------------- |
| `pnpm dev`       | Dev server                              |
| `pnpm build`     | Production build                        |
| `pnpm lint`      | ESLint, including the 200-line file cap |
| `pnpm typecheck` | `tsc --noEmit`, after `next typegen`    |
| `pnpm format`    | Prettier, write                         |

## Conventions

Commits are [Conventional Commits](https://www.conventionalcommits.org/), with
a subject line only. Pull requests use the template in
`.github/PULL_REQUEST_TEMPLATE.md` and cover one feature.

Source files stay under 200 lines of code. ESLint enforces this via
`max-lines`, so a build fails rather than a review catching it later. Split by
responsibility, and pull async work into custom hooks under `src/hooks/`.

`src/api-client/` is generated from the API contract and is exempt from both
the line cap and formatting.
