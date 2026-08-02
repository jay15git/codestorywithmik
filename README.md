# LeetSeek — LeetCode DS & Algo

A searchable website for browsing LeetCode data structures and algorithms solutions from [walkccc/LeetCode](https://github.com/walkccc/LeetCode) (MIT), with company tags from community CSV data.

## Features

- Browse by LeetCode topic tags (multi-home — problems appear under every tag)
- 3,500+ solution pages with C++, Java, Python, SQL, and TypeScript tabs when available
- Company tag filters (enriched from LeetCode company-wise CSV data)
- Local progress: solved / starred (stored in the browser)
- Personal markdown notes per problem (browser-only)
- Random unsolved problem from home, topic, or company lists
- Company prep packs (Top 25 / 50 / 75 by interview frequency)
- Companies index sortable by interview frequency
- Pattern study pages (Easy → Hard within a pattern)
- Daily problem + weekly set (deterministic, no account)
- Blind mode on solution pages
- Related problems on each solution page
- Prev / next navigation within topic or company lists (arrow keys)
- Keyboard study shortcuts (`j`/`k` lists, `s`/`d`/`b` on solutions)
- Cmd+K search (`#121`, difficulty chips, `@company`, fuzzy titles)
- Multi-filter URLs (topic, company, difficulty, language, status)
- Remembered code language + shareable `?lang=` links
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
git submodule add https://github.com/jay15git/LeetCode.git content/upstream
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
walkccc/LeetCode
        ↓ (every 6h, optional workflow)
jay15git/LeetCode  ← your fork
        ↓ (hourly cron on Vercel)
LeetSeek site rebuild
```

1. **Fork sync** (optional): add `FORK_SYNC_TOKEN` (PAT with `repo` scope on your fork) to this repo’s GitHub secrets. The workflow `.github/workflows/sync-fork-upstream.yml` merges upstream `main` into your fork every 6 hours.
2. **Site sync**: Vercel cron hits `/api/cron/sync` hourly. If the fork’s latest commit SHA differs from the last built SHA, it triggers a deploy hook rebuild.

### Manual deploy

Run the **Manual deploy** workflow in GitHub Actions (requires `VERCEL_DEPLOY_HOOK_URL` secret), or:

```bash
curl -X POST "$VERCEL_DEPLOY_HOOK_URL"
```

## Content sources

| Repo | Role |
|------|------|
| `jay15git/LeetCode` | Solutions fork (cloned at build) |
| `walkccc/LeetCode` | Original upstream (MIT) |
| `snehasishroy/leetcode-companywise-interview-questions` | Company tag CSVs |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm run sync-content` | Sync solutions from fork |
| `pnpm build` | Sync + production build |
| `pnpm typecheck` | TypeScript check |
