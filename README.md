# LeetSeek

LeetSeek is a browser-first library for studying LeetCode data-structure and algorithm solutions. It indexes solutions from [jay15git/LeetCode](https://github.com/jay15git/LeetCode), a fork of [walkccc/LeetCode](https://github.com/walkccc/LeetCode) (MIT), and enriches them with community company-interview data.

## What it includes

- 3,500+ indexed solution pages with available C++, Java, Python, SQL, and TypeScript code
- Browse and filter problems by topic, company, difficulty, language, solved state, and saved tags
- Topic, company, interview-pattern, and curated study-plan views
- Blind 75, NeetCode 150, and NeetCode 250 plans, resolved against the current catalog
- Company prep packs ranked by reported interview frequency
- Daily problem and deterministic seven-problem weekly set
- Random unsolved problem picker
- Related problems, context-aware previous/next navigation, and solution-page keyboard shortcuts
- Cmd+K search for titles, problem IDs, difficulties, and companies
- Per-browser progress, stars, custom tags, default language, sound, dark mode, and hidden-solution preference
- Shareable language URLs through `?lang=`
- Syntax-highlighted code, reduced-motion support, keyboard navigation, and responsive layouts
- Installable web-app metadata with favicon, Apple touch icon, and PWA manifest

Progress and preferences remain in the current browser. LeetSeek has no account, server-side user data, or automatic backup.

## Routes

| Route                  | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `/`                    | Catalog overview, study plans, topics, and random problem picker |
| `/problems`            | Full searchable and filterable problem catalog                   |
| `/topics/[topic]`      | Problems grouped by LeetCode topic                               |
| `/companies`           | Company index, sortable by name or reported frequency            |
| `/companies/[company]` | Company-tagged problems and prep packs                           |
| `/plans`               | Curated interview study plans                                    |
| `/plans/[slug]`        | A plan with local progress                                       |
| `/patterns`            | Interview patterns mapped to topic tags                          |
| `/patterns/[slug]`     | Problems for one pattern, easy to hard                           |
| `/daily`               | Daily problem and weekly set                                     |
| `/solutions/[slug]`    | Solution, code tabs, related problems, and study controls        |
| `/settings`            | Local study preferences                                          |

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- Shiki syntax highlighting
- Base UI, Framer Motion, and Cuelume interaction feedback

## Local development

Requirements: Node.js 20.9+ and pnpm.

```bash
pnpm install
pnpm sync-content
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

`sync-content` clones or updates the solutions fork, fetches LeetCode metadata and company tags, and generates the catalog. It uses `content/upstream` when that submodule exists; otherwise it uses `.cache/upstream`.

### Optional submodule

```bash
git submodule add https://github.com/jay15git/LeetCode.git content/upstream
git submodule update --init --recursive
```

## Commands

| Command             | Description                                     |
| ------------------- | ----------------------------------------------- |
| `pnpm dev`          | Start local development server                  |
| `pnpm sync-content` | Refresh source content and generated indexes    |
| `pnpm build`        | Refresh content and create production build     |
| `pnpm start`        | Run production server after build               |
| `pnpm test`         | Run content, preference, storage, and tag tests |
| `pnpm typecheck`    | Run TypeScript checks                           |
| `pnpm lint`         | Run ESLint                                      |
| `pnpm format`       | Format TypeScript and TSX files                 |

## Deployment

Deploy on [Vercel](https://vercel.com) by importing this repository. Each build runs `pnpm sync-content` before `next build`, so the deployed catalog reflects the current source data.

For optional upstream automation, `.github/workflows/sync-fork-upstream.yml` updates `jay15git/LeetCode` from `walkccc/LeetCode` every six hours. Configure these GitHub secrets on the repository that runs the workflow:

- `FORK_SYNC_TOKEN`: token with access to push to the solutions fork
- `VERCEL_DEPLOY_HOOK_URL`: optional Vercel deploy-hook URL; triggers a rebuild after a successful fork update

You can also trigger `.github/workflows/manual-deploy.yml` manually with `VERCEL_DEPLOY_HOOK_URL` configured.

## Content sources

| Source                                                                                                                            | Role                                                      |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [jay15git/LeetCode](https://github.com/jay15git/LeetCode)                                                                         | Solution source cloned during content sync                |
| [walkccc/LeetCode](https://github.com/walkccc/LeetCode)                                                                           | Original solution repository, licensed MIT                |
| [snehasishroy/leetcode-companywise-interview-questions](https://github.com/snehasishroy/leetcode-companywise-interview-questions) | Community company tags and reported interview frequencies |
