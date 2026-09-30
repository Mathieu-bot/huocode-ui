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

The app reads `NEXT_PUBLIC_HUO_API_URL`. It defaults to the preproduction
instance; point it elsewhere with a `.env.local`.

```bash
NEXT_PUBLIC_HUO_API_URL=https://preprod.example.com
```

The API's `huocode.cors.allowed-origins` must list this app's origin, or the
browser blocks every request. It is disabled when unset.

## Scripts

| Script           | What it does                            |
| ---------------- | --------------------------------------- |
| `pnpm dev`       | Dev server                              |
| `pnpm build`     | Production build                        |
| `pnpm lint`      | ESLint, including the 200-line file cap |
| `pnpm typecheck` | `tsc --noEmit`, after `next typegen`    |
| `pnpm format`    | Prettier, write                         |

## Conventions

Commits are [Conventional Commits](https://www.conventionalcommits.org/), and
every commit body explains the _why_. Pull requests use the template in
`.github/PULL_REQUEST_TEMPLATE.md` and cover one feature.

Source files stay under 200 lines of code. ESLint enforces this via
`max-lines`, so a build fails rather than a review catching it later. Split by
responsibility, and pull async work into custom hooks under `src/hooks/`.

`src/api-client/` is generated from the API contract and is exempt from both
the line cap and formatting.
