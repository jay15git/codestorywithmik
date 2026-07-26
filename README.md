# codestorywithMIK — Interview DS & Algo Solutions

A calm, searchable website for browsing interview data structures and algorithms solutions from [jay15git/codestoryoriginal](https://github.com/jay15git/codestoryoriginal) (fork of [MAZHARMIK/Interview_DS_Algo](https://github.com/MAZHARMIK/Interview_DS_Algo), MIT licensed).

## Features

- Topic and subtopic browsing
- 1,400+ solution pages with C++ / Java tabs
- Company tag filters
- Cmd+K search
- Syntax-highlighted code
- Auto-sync from your fork on a schedule

## Local development

```bash
pnpm install
pnpm run sync-content   # clones fork + builds generated/content-index.json
pnpm dev
```

`sync-content` reads from `content/upstream` if the submodule is initialized, otherwise clones into `.cache/upstream`.

### Optional: git submodule

```bash
git submodule add https://github.com/jay15git/codestoryoriginal.git content/upstream
git submodule update --init --recursive
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set environment variables:
   - `CRON_SECRET` — random string (cron auth)
   - `VERCEL_DEPLOY_HOOK_URL` — from Vercel → Project Settings → Deploy Hooks
4. Deploy

Every build runs `pnpm run sync-content` first, pulling the latest solutions from your fork.

### Auto-update flow

```text
MAZHARMIK/Interview_DS_Algo
        ↓ (every 6h, optional workflow)
jay15git/codestoryoriginal  ← your fork
        ↓ (hourly cron on Vercel)
codestorywithmik site rebuild
```

1. **Fork sync** (optional): add `FORK_SYNC_TOKEN` (PAT with `repo` scope on your fork) to this repo’s GitHub secrets. The workflow `.github/workflows/sync-fork-upstream.yml` merges upstream `master` into your fork every 6 hours.
2. **Site sync**: Vercel cron hits `/api/cron/sync` hourly. If the fork’s latest commit SHA differs from the last built SHA, it triggers a deploy hook rebuild.

### Manual deploy

Run the **Manual deploy** workflow in GitHub Actions (requires `VERCEL_DEPLOY_HOOK_URL` secret), or:

```bash
curl -X POST "$VERCEL_DEPLOY_HOOK_URL"
```

## Content source

| Repo | Role |
|------|------|
| `jay15git/codestoryoriginal` | Content fork (cloned at build) |
| `MAZHARMIK/Interview_DS_Algo` | Original upstream (MIT) |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm run sync-content` | Sync solutions from fork |
| `pnpm build` | Sync + production build |
| `pnpm typecheck` | TypeScript check |
