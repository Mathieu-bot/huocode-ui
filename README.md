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
