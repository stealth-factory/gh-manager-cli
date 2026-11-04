# AGENTS.md - gh-manager-cli Project Memory & Instructions

## Project Overview

**gh-manager-cli** is an interactive CLI tool built with Ink (React for terminals) that helps users manage GitHub repositories. This project provides a terminal-based UI for browsing, searching, and managing personal GitHub repos with real-time API integration.

- Canonical npm package: `gh-manager-cli` (public).
- GitHub repository: `stealth-factory/gh-manager-cli`.
- Homebrew tap: `stealth-factory/homebrew-tap`, installed as `stealth-factory/tap` with its explicit repository URL.
- Executable and application config/cache/log paths: `gh-manager-cli`.
- npmjs publishes the application directly as `gh-manager-cli`. GitHub Packages uses `@stealth-factory/gh-manager-cli`; the publish step temporarily changes the manifest name and registry, then restores both.
- GitHub releases are created as drafts, receive all three binaries, and publish only after asset verification. Upload failures must fail the job. Existing published immutable releases are verified without modifying assets. Homebrew downloads retry for npm propagation and fail before tap mutation if the archive remains unavailable.
- Downstream release/publication jobs check out the triggering `github.sha` to match the binary build. Missing tap credentials and rejected formula pushes must fail the job, rather than report a successful deployment.
- Releases are pooled, in the opscope shape. `.github/workflows/release-pr.yml` batches conventional commits since the last tag into one `release` pull request (git-cliff, `cliff.toml`). Merging it is the release. `.github/workflows/tag-release.yml` tags that version, and `.github/workflows/release.yml` publishes only from the `v*` tag. A merge to `main` does not publish.
- The release pull request, the tag push, and the Homebrew tap push mint the org GitHub App (`vars.RELEASE_APP_CLIENT_ID`, `secrets.RELEASE_APP_PRIVATE_KEY`) with `actions/create-github-app-token` pinned to `64ab729a6294000f5aa4a4bc0b73d1f32bc45510` (v3.3.0). `altabella` has been removed from this repository, so those jobs do not fall back to `secrets.GH_TOKEN`. The tag is pushed with the App token so the tag push starts `release.yml`. GitHub release asset uploads stay on `GITHUB_TOKEN`. The tap token is scoped to `stealth-factory/homebrew-tap` with contents write only. The release pull request token may also write pull requests in this repository.
- npmjs releases use OIDC trusted publishing (`id-token: write`) for the unscoped package, with a token-free npm config and npm 11.19.0. Do not add `NPM_TOKEN` or `NODE_AUTH_TOKEN` to this job. The npm package needs a trusted publisher for `stealth-factory/gh-manager-cli`, workflow `release.yml`. GitHub Packages still uses its separate `GITHUB_TOKEN` authentication. The App has no Packages permission.

### Current Status: Active Development
- ✅ Core repository listing functionality
- ✅ GitHub GraphQL API integration with Apollo Client caching
- ✅ Interactive terminal UI with Ink
- ✅ OAuth and PAT authentication with secure storage
- ✅ Background fetch-all (whole account cached after first page)
- ✅ Repository management (delete, archive, visibility change)
- ✅ GitHub Enterprise support with Internal visibility
- ✅ Organization switching and context management
- ✅ Fork synchronization with upstream
- ✅ Semantic release automation and CI/CD workflows
- ✅ Automated changelog generation and PR title management
- ✅ Bulk Select mode with bulk star, archive/unarchive, visibility, delete, and transfer operations
- ✅ `RepoRow` memoized with `React.memo` + `arePropsEqual` (SWR-358) — only 2 rows re-render per cursor move
- 🔧 Automated test suite expansion (ongoing)
- 🔧 Cross-terminal rendering optimization

**For current version and recent changes, see [CHANGELOG.md](./CHANGELOG.md)**

## Repository Structure

```
gh-manager-cli/
├── src/
│   ├── index.tsx              # CLI entry, error boundaries, renders App
│   ├── types.ts               # Shared TypeScript type definitions
│   ├── ambient.d.ts           # Ambient module declarations
│   ├── ui/
│   │   ├── App.tsx            # Token bootstrap and routing
│   │   ├── OrgSwitcher.tsx    # Organisation switcher
│   │   ├── views/
│   │   │   └── RepoList.tsx   # Repository list view: filters/sort/modal state + render tree
│   │   ├── hooks/            # RepoList logic extracted into focused hooks (GMC-28/GMC-39):
│   │   │   ├── useTheme.ts          # Colour-theme hook (GMC-22)
│   │   │   ├── useVirtualList.ts    # Windowing memo around the cursor
│   │   │   ├── useListLayout.ts     # Terminal-width + list-height derivation (footer collapse GMC-50)
│   │   │   ├── useForkEnrichment.ts # Batched fork ahead/behind enrichment effect (SWR-362)
│   │   │   ├── useRefreshTick.ts    # Whole-minute tick for relative dates (SWR-377)
│   │   │   ├── useBulkSelect.ts     # Bulk Select mode + selection map + helpers
│   │   │   ├── useRepoData.ts       # Core data layer: list/starred state, fetchPage,
│   │   │   │                        #   rate limits, PAGE_SIZE, initial context fetch (GMC-39),
│   │   │   │                        #   fetch-generation guard against stale pages (GMC-43)
│   │   │   └── useRepoListInput.ts  # The whole keyboard dispatcher (useInput) (GMC-39)
│   │   └── components/
│   │       ├── auth/          # Auth method selector, OAuth progress
│   │       ├── repo/          # RepoRow, RepoListHeader, FilterInput,
│   │       │                  #   RepoListFooter (help footer), RepoListContent (list body)
│   │       ├── modals/        # All action/confirmation modals + bulk modals
│   │       └── common/        # Shared presentational bits (SlowSpinner, …)
│   ├── services/
│   │   ├── github/            # GitHub API service, split by concern (GMC-28):
│   │   │   ├── index.ts       #   barrel — preserves `services/github` imports
│   │   │   ├── client.ts      #   Octokit + persisted Apollo client (singleton)
│   │   │   ├── queries.ts     #   read queries + RepoNode normalisation
│   │   │   ├── mutations.ts   #   star/archive/visibility/rename mutations
│   │   │   ├── rest.ts        #   REST ops (delete, create, transfer, sync, rate limits)
│   │   │   ├── cache.ts       #   Apollo cache reads/updates/eviction + inspection
│   │   │   └── enrichment.ts  #   batched fork ahead/behind enrichment
│   │   ├── apolloMeta.ts      # Apollo cache TTL/meta helpers
│   │   └── oauth.ts           # OAuth device-flow implementation
│   ├── config/
│   │   ├── config.ts          # Read/write config and token management
│   │   ├── constants.ts       # Shared constants
│   │   └── themes.ts          # Colour-theme definitions (GMC-22)
│   └── lib/
│       ├── utils.ts           # truncate/formatDate/computeWindow/filters
│       ├── fuzzySearch.ts     # Local fuzzy search over the cached set (SWR-361)
│       ├── session.ts         # Session usage tracking
│       └── logger.ts          # File logger
├── tests/                     # Vitest + ink-testing-library, mirrors src/
├── dist/                      # Built output (gitignored)
├── package.json               # NPM package config
├── cliff.toml                 # git-cliff changelog and version bump rules
├── tsconfig.json              # TypeScript configuration
├── tsup.config.ts             # Build configuration (shebang-preserved ESM)
├── CHANGELOG.md               # Generated changelog (git-cliff; older sections are semantic-release)
├── README.md                  # User documentation
├── LICENSE                    # MIT License
├── AGENTS.md                  # This file - project memory/instructions
├── .gitignore                 # Git ignore patterns
└── .github/
    ├── workflows/
    │   ├── release-pr.yml # Standing pooled release pull request
    │   ├── tag-release.yml    # Tag the merged release pull request
    │   ├── release.yml        # Publish from the tag only
    │   └── pr-title-manager.yml     # PR title automation
    └── scripts/
        └── normalize-pr-title.js    # PR title normalization logic
```

> **`services/github` module map (GMC-28):** the service is a directory with a
> barrel `index.ts`, so `import { … } from '../../services/github'` keeps
> working. `makeApolloClient` and its singleton live only in `client.ts` so the
> persisted Apollo instance stays a true singleton across modules. When adding a
> GitHub call, place it by concern (query / mutation / rest / cache / enrichment)
> rather than growing one file.

## Core Features

### Main Script (`src/index.tsx`)
- **Language:** TypeScript with React/Ink
- **Dependencies:** 
  - `@octokit/graphql` for GitHub API
  - `ink` (React-based TUI)
  - `chalk` for terminal colors
  - `ink-spinner` for loading states
  - `ink-text-input` for user input
  - `env-paths` for cross-platform config storage
- **Build:** tsup with esbuild

### Key Features
- OAuth and PAT authentication: prompt → validate → persist (0600 perms on POSIX)
- List personal and organization repos with metadata (name, description, stars, forks, etc.)
- Full keyboard navigation with extensive shortcuts
- Background fetch-all: whole account loaded into the persisted cache after the first page
- Fuzzy search (local, over full cached set) with fuse.js — instant, no network calls in search path
- Repository actions: delete, archive/unarchive, change visibility, sync forks
- Organization and Enterprise GitHub support
- Modal-based UI for sorting, filtering, and actions
- Persistent UI preferences (sort, density, visibility filter, fork tracking, colour theme, footer collapse)
- Real-time rate limit monitoring for GraphQL and REST APIs

### Planned Enhancements
The project has no formal roadmap or task board — feature work is driven by user requests on [GitHub Issues](https://github.com/stealth-factory/gh-manager-cli/issues). See the [wiki Roadmap & Feature Requests](./wiki/Roadmap.md) page for ideas under consideration, and [CHANGELOG.md](./CHANGELOG.md) for what's already shipped. Ideas occasionally explored:
- Optional OS keychain support (via `keytar`)
- Language filter and indicators
- Additional sort fields and CLI flags

## Configuration & Token Storage

- Reads token from `process.env.GITHUB_TOKEN` or `process.env.GH_TOKEN` first.
- Fallback to config file: created on first successful validation.
- Config path via `env-paths('gh-manager-cli').config`:
  - macOS: `~/Library/Preferences/gh-manager-cli/config.json`
  - Linux: `~/.config/gh-manager-cli/config.json`
  - Windows: `%APPDATA%\gh-manager-cli\config.json`
- Permissions:
  - POSIX: `chmod 600` after writing file.
- Shape:
  ```json
  { "token": "<pat>", "tokenVersion": 1 }
  ```
- PAT scopes:
  - For listing all personal repos including private: classic PAT with `repo` scope (read is sufficient).
  - If only public repos are needed, a token with public-repo read may suffice, but `repo` is recommended.

## GitHub API Details

- GraphQL query against `viewer.repositories` with `ownerAffiliations: OWNER` and `orderBy: UPDATED_AT DESC`.
- Page size: **30 per request** (default; configurable 1-100 via `REPOS_PER_FETCH`). Lowered from 100 in GMC-40 — a 100-repo first page with the inline open PR/issue counts (SWR-357) ran ~8-10s and intermittently tripped GitHub's gateway timeout (HTTP 502/504); 30 keeps the first page ~3s (with headroom for slower networks) and the rest still streams in via background fetch-all.
- **Single pagination model — background fetch-all:** the first page renders immediately, then a background loop fetches every remaining page until `hasNextPage` is false, appending into the persisted cache. There is no scroll-position prefetch trigger for the owned/starred lists; the load is continuous and driven by the effect re-running as the list grows.
- **Fetch-generation guard (GMC-43):** `useRepoData` keeps a generation counter per list (owned + starred). Every fresh load (org/scope switch, manual refresh, sort change) bumps it; a page request started under an older generation discards its response entirely — items, cursors, counts, error, and the loading-flag resets. The context-switch effect also drops `endCursor`/`hasNextPage` synchronously. Without this, an in-flight background page from the previous context appended foreign rows into the new list and overwrote the cursor, making the background loop walk two cursor chains at once (duplicated rows, loaded count > totalCount, garbled Ink render). Any new loader added to `useRepoData` must capture the generation before its `await` and check it before every state write.
- Because the full set is cached, **sorting is client-side** (`filteredAndSorted`) with no server refetch on sort change; archive/visibility (private) filtering is also client-side.
- On each page fetch, also read `totalCount` to reflect newly created repos and to show background-load progress (`loaded/total`).
- Selected fields: name/nameWithOwner/description/visibility/isPrivate/isFork/isArchived/stargazerCount/forkCount/primaryLanguage/updatedAt/pushedAt/diskUsage, plus `parent { nameWithOwner }` and `defaultBranchRef { name }`.
- **Light bulk query (SWR-360):** the list/search queries intentionally do NOT fetch per-repo commit history (`history.totalCount`). Computing that for each repo and its parent across 100 repos/page exceeds GitHub's per-query budget and returns HTTP 502. Fork `parent { nameWithOwner }` is still fetched so the "Fork of X" label always shows.
- **Fork ahead/behind enrichment (SWR-362):** after the background fetch-all completes, a separate effect (`useEffect` gated on `!loading && !loadingMore && !hasNextPage`) enriches forks-only with commit counts. It uses `enrichForksWithAheadBehind` which builds a batched aliased GraphQL query (`fork_N: node(id:)` + `parent_N: repository(owner,name)`) capped at 5 forks per request (10 history queries). Results are merged directly into `items` state. A 200ms delay between batches throttles rate-limit consumption. Already-enriched IDs are tracked in `enrichmentDoneRef` to avoid re-fetching. Both `(N ahead)` and `(N behind)` are displayed in `RepoRow` and the sync confirmation modal.
- **Open PR/Issue counts (SWR-357):** every list/search/starred query fetches `openPullRequests: pullRequests(states: OPEN) { totalCount }` and `openIssues: issues(states: OPEN) { totalCount }` inline, always on (no toggle, no enrichment pass). `totalCount`-only connections add ~0 node cost under GitHub's GraphQL cost formula, so a 100-repo page stays at cost ~1 — unlike `history.totalCount` (SWR-360), these indexed counts are cheap enough to fold into the main page fetches. Responses are normalised via `normalizeRepoNode` which flattens `{ totalCount: N }` → `RepoNode.openPullRequests` / `openIssues` (plain numbers) so renderers and threshold colouring see a flat shape. Rendered inline on every `RepoRow` (line 2) and behind the `L` keybinding's chooser modal.

## Controls

- Up/Down: move selection
- PageUp/PageDown: jump ±10
- `Ctrl+G`: jump to top
- `G`: jump to bottom
- `/`: fuzzy search mode (instant, typo-tolerant, no minimum length; searches name/owner/description/language over the full cached set; Esc cancels)
- `S`: sort modal (updated, pushed, name, stars)
- `D`: toggle sort direction
- `T`: toggle display density (compact/cozy/comfy)
- `Shift+T`: cycle colour theme (Default → Ocean → Forest → Monochrome); persists across restarts
- `F`: toggle fork commit tracking (ahead/behind enrichment — unrelated to the fork view filter)
- `V`: View Filters modal — a single grouped modal with three sections: **Visibility** (All / Public / Private[/Internal for enterprise]), **Archive** (All / Unarchived / Archived), and **Fork** (All / Forks only / Non-forks only). Move between groups with ↑↓, change a group's value live with ←→ (radio-style), then `Enter` (or `Y`/Apply) to apply and close, `Esc`/`C` to cancel. Any combination can be set in one session; selections persist across restarts but reset to **All** on organisation or scope (own ↔ starred) switch. The Visibility group is hidden in stars mode; Archive and Fork remain available there. Replaces the old separate `V` visibility and `A` archive modals — `A` is no longer bound to a filter.
- `W`: organisation switcher
- Enter or `O`: open selected repo in browser; for forks shows a chooser (This repository / Parent/upstream, Esc cancels)
- `L`: open the selected repo's PRs or Issues list — chooser modal (Pull Requests / Issues, Esc/C cancels). Counts are rendered inline on every row from the same fields (SWR-357)
- `P`: on a fork — jump cursor to the parent repo if it is already loaded; otherwise fetches the parent repo and shows it in the Info modal
- `I`: repository info modal
- `K`: cache inspection
- `Ctrl+N`: create a new repository in the current context (prompts for name with the personal/organisation slug shown in front; `Tab` cycles visibility; GitHub errors surfaced inline). Disabled in starred mode.
- `Shift+M`: transfer (move) selected repo to another owner. Opens a destination picker (personal account + organisations the token can see) with a manual-entry fallback for owners the token can't list, then requires typing a randomly generated verification code — like delete — followed by a final confirmation step; GitHub errors surfaced inline; transferred repo is removed from the list. Disabled in starred mode.
- `Del` or `Backspace`: delete selected repo (two-stage confirmation)
- `Ctrl+A`: archive/unarchive selected repo
- `Ctrl+V`: change repository visibility
- `Ctrl+F`: sync fork with upstream (shows ahead/behind counts)
- `Ctrl+S`: star/unstar selected repo
- `Ctrl+L`: logout (returns to Authentication Required)
- `Shift+S`: toggle between own repos and starred repos (personal context only)
  - Footer hint shows `Shift+S Starred` in normal mode and `Shift+S My Repos` in starred mode; hidden in org context
- `R`: refresh list (purges cache)
- `H`: toggle the help footer between a single line of important keys (including `H More keys`) and the full reminder set; persists across restarts. Default is collapsed so the list has more room.
- `Q`: quit (Esc cancels an open modal or exits search mode; does not quit)

### Bulk Select Mode

- `B`: enter/exit Bulk Select mode (exits and clears selection)
- `Esc`: exit bulk select mode (clears selection)

**Within bulk select mode** (every other shortcut is disabled; only navigation + the keys below work):

- `Space`: toggle selection on the cursor row
- `X`: unselect all (clears selection, stays in bulk select mode)
- `Ctrl+S`: bulk star/unstar the selected repos
- `Ctrl+A`: bulk archive/unarchive the selected repos
- `Ctrl+V`: bulk visibility update for the selected repos
- `Shift+M`: bulk transfer (move) the selected repos to another owner/org
- `Del` / `Backspace`: bulk delete the selected repos
- Navigation (arrows, PageUp/Down, `Ctrl+G`, `G`) still works
- `H`: toggle the help footer (same as outside bulk mode)

Bulk actions reuse the same global shortcuts as single-repo mode and require at least one selected repo. There is no separate action-picker modal.

**Bulk operation flow:**

0. Intent/target (only when needed, before review):
   - Star and archive are toggles. If all selected repos share the same state, the opposite state is applied directly. If the selection is mixed, an intent modal asks the explicit target (e.g. "Archive all" vs "Unarchive all", "Star all" vs "Unstar all").
   - Visibility always shows a target picker (Public / Private / Internal — Internal only for enterprise orgs).
1. Review list (Confirmation 1) — scrollable list of all selected repos; `Space` to unselect; Tab/Enter to proceed. Dismisses on Esc/Cancel or when the list empties.
2. Destination owner (Transfer only) — after review, opens a destination picker (personal account + organisations the token can see) with a manual-entry fallback; the chosen destination must differ from the current owner.
3. Count prompt (Confirmation 2) — "About to {action} {N} repos" (transfer also shows "to {owner}"); Cancel/Proceed, Esc cancels.
4. Delete and Transfer only — a separate verification-code modal (type a 4-character code).
5. Sequential execution with per-repo progress; partial-failure reporting at the end.
6. Selection cleared and bulk select mode exits on completion. Transferred repos are removed from the list.

**Persistence:** Selections survive search and filter/sort changes (stored as full node objects by id). Cleared on org/scope switch and stars mode toggle.

### Modal UX Convention (preferred)
- Left/Right: move focus between buttons (e.g., Delete, Cancel)
- Enter: run the currently focused button’s action
- `Y`: confirm (applies to any confirmation action)
- `C`: cancel (preferred); `Esc` also cancels

## Setup & Usage

Prereqs:
- Node.js >= 22.12.0
- pnpm

Install deps and build:

```bash
pnpm install
pnpm build
```

Run the CLI:

```bash
node dist/index.js
# or add to PATH (dev):
pnpm link # then run: gh-manager-cli
```

First run prompts for a PAT if not provided via env vars. The token is validated by a quick `viewer { login }` request; on success it’s stored in the config file with restricted permissions.

## Troubleshooting

- Invalid token:
  - Re-run and enter a valid PAT (recommended scope: `repo`).
- Rate-limited:
  - Wait or reduce page size; future enhancement will show rate-limit details.
- Network errors:
  - Check connectivity and retry with `r`.

## Security Notes

- The PAT is stored in plaintext in the user config directory with 0600 perms (POSIX). Consider revoking tokens when no longer needed.
- A future enhancement may integrate `keytar` to use the OS keychain for secrets.

## Scripts

- `pnpm build` — build to `dist/`
- `pnpm dev` — watch mode
- `pnpm start` — run `node dist/index.js`

## Packaging

- `package.json` defines `bin: { "gh-manager-cli": "dist/index.js" }`.
- For local dev: `pnpm link` exposes `gh-manager-cli` on PATH.
- For publish: the tagged release workflow publishes the application publicly as `gh-manager-cli`. Do not manually bump versions. See [scope migration](./docs/NPM_SCOPE_MIGRATION.md) and [release process](./docs/RELEASE_PROCESS.md).
- **Standalone binaries:** `pnpm build:binaries` uses `@yao-pkg/pkg@6.20.0` (the maintained fork of the archived `vercel/pkg`) and emits `node22-*` targets. The CLI itself requires Node >=22.12.0 (`engines.node`) because Ink 7 and Vite 8 do. Building binaries also requires **Node.js 22.12 or later**: `@yao-pkg/pkg@6.20.0` / pkg-fetch v3.6 no longer ships `node20-*-win-x64`, so the script and the release workflow's binary job must run on Node 22+.

## Development Workflow

### Version Management
- **Format:** Semantic versioning (MAJOR.MINOR.PATCH)
- **Automation:** git-cliff, via the release pull request, handles version bumping. `tag-release.yml` creates the tag. `release.yml` publishes that tag.
- **Release process:** Merges to `main` update a standing release pull request. Merging that pull request tags and publishes. A merge by itself does not publish.
- **Change tracking:** All releases documented in [CHANGELOG.md](./CHANGELOG.md)
- **Do NOT manually edit [CHANGELOG.md](./CHANGELOG.md):** `.github/workflows/release-pr.yml` prepends it with git-cliff from conventional commits since the last tag. Do not regenerate the file; the sections from before this change were written by semantic-release and are kept. To influence the next section, write a well-formed conventional commit / PR title. When a feature branch conflicts with `main` on CHANGELOG.md, resolve by taking `main`'s version. The `release` branch is force-pushed; do not edit the changelog there.

### Code Standards
- **TypeScript:** Strict mode with comprehensive type definitions
- **React/Ink:** Functional components with hooks
- **Terminal colours:** Use chalk for pre-colouring to avoid nested Text issues
- **Error handling:** Try-catch blocks for API calls and network operations
- **Language:** British English for all user-facing text (e.g., organisation, authorisation, colour)
- **No `any`:** GraphQL response paths use dedicated response interfaces (e.g. `ViewerLoginResponse`, `OrgReposResponse`). Error catch clauses use `catch (e: unknown)` with narrowing via `(e instanceof Error ? e.message : null) || fallback`. For logger calls, `context?: unknown` is the correct type. Dynamic chalk property access uses `(chalk as unknown as Record<string, ChalkInstance | undefined>)[key]`. The one permitted `any` is `persistCache(... as any)` which is a workaround for an incomplete third-party type definition in `apollo3-cache-persist`.

### Testing Protocol
1. **Terminal Testing:** Test in multiple terminals (iTerm2, Terminal.app, Termius)
2. **API Testing:** Mock data for offline development
3. **UI Testing:** Various window sizes and content lengths
4. **Build Testing:** Ensure production build works correctly

### Automated Tests (REQUIRED)
- **Runner:** Vitest + `ink-testing-library`. Run with `pnpm test` (CI) or `pnpm test:watch` (dev). Tests live in `tests/`, mirroring `src/` (e.g. modal tests in `tests/ui/`).
- **Every new feature ships with new test cases.** Adding or changing a feature without adding/updating tests is incomplete work — the same PR that introduces behaviour must cover it. At minimum, a new component/modal needs: a render test, a happy-path action test, and a guard/edge-case test. A bug fix needs a test that fails before the fix and passes after.
- **Every async action modal MUST ignore input while the request is in flight, and MUST have a test that proves it.** For modals that own their loading state, guard the `useInput` handler with a **synchronous ref**, not the state flag: keep a `const xingRef = useRef(false)`, flip `xingRef.current = true` at the very top of the confirm handler (before `setXing(true)`), reset it in the `catch`, and gate input with `if (xingRef.current) return;`. A ref updates immediately and is read *live* through the input closure, so a key arriving in the **same tick** as submit — before React re-renders — is still ignored; a state-based guard races that window. The `setXing` state still drives the spinner UI. Modals whose loading flag is a **parent prop** (Star/Unstar/ChangeVisibility) instead gate on the prop (`if (isXing) return;`) and on any `TextInput` `onSubmit`. Then assert that keypresses during the in-flight state call neither `onCancel` nor the action again (see `tests/ui/ArchiveModal.test.tsx` → `ignores input while archiving is in progress`, and the matching tests for Delete/Transfer/Rename/Sync/Create/Star/Unstar/ChangeVisibility). The ref-guard idea came from PR #65.
- **Driving `useInput` in tests:** mock `ink`'s `useInput` (`vi.fn()`) and capture the callback. With the synchronous ref guard above, the in-flight assertion can fire the ignored keys in the **same tick** as the trigger (no flush) — that is the point of the ref. You still need `await new Promise(r => setTimeout(r, 0))` to flush a re-render whenever a *later* step depends on refreshed state or a refreshed closure (e.g. a `TextInput` `onChange` that must be visible to the next Enter, or a mount effect). Never capture the callback by value into a helper; read the latest via a getter.
- **Driving `ink-text-input` in tests:** the real component enables raw mode and throws under the test stdin, so stub it. To simulate typing, capture its props via `vi.hoisted` and call `onChange`/`onSubmit` directly. For modals that generate a random verification code (Delete, Transfer), `vi.spyOn(Math, 'random').mockReturnValue(0)` makes the code deterministically `AAAA`, and flush once after `render()` so the mount effect generates it.
- **British English** in any user-facing strings asserted by tests, matching the app.

## Git Management

### Branch Strategy
- **main:** Production-ready code only
- **Feature branches:** For new features and major changes

### Linear Issue Linking (REQUIRED)
Every change should trace back to a Linear issue. To guarantee GitHub ↔ Linear auto-linking:
- **Branch name MUST include the Linear issue ID**, e.g. `feature/swr-360-background-fetch-all` (`<type>/swr-<id>-<slug>`).
- **PR title MUST include the Linear issue ID**, e.g. `feat: background fetch-all pagination with light bulk query (SWR-360)`.
- If no Linear issue exists for the work yet, **create one first**, then name the branch and PR with its ID.
- This is what links the PR back to the Linear issue and surfaces progress there — do not open a PR without the ID in both places.

### Commit Message Format
**REQUIRED:** All commits MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

**Examples:**
- `feat: add repository filtering by language`
- `fix: resolve spacing issues in terminal rendering`
- `docs: update installation instructions`
- `chore: update dependencies`
- `refactor: simplify RepoList component logic`

**Important:** Every commit message MUST use semantic format to ensure proper versioning and changelog generation.

### Automated Release Process
1. **PR Creation:** Titles automatically formatted to conventional commits
2. **Main Branch Push:** Updates the standing release pull request when the commits since the last tag include a releasable change (`feat`, `fix`, `perf`, `revert`, a `!` subject, or a `BREAKING CHANGE:` / `BREAKING-CHANGE:` footer)
3. **Version Calculation:** git-cliff from those commits (`feat` = minor, `fix` and `perf` = patch, breaking = major)
4. **CHANGELOG.md:** Prepended on the release pull request
5. **Release decision:** Merging the release pull request tags `vX.Y.Z`
6. **Publication:** The tag runs `release.yml`: draft GitHub Release with verified binaries, npm OIDC, GitHub Packages, and the Homebrew tap (see [Release Process](./docs/RELEASE_PROCESS.md))

## Known Issues & Solutions

### Terminal Rendering Differences
- **Issue:** Spacing and line rendering varies between SSH (Termius) and native macOS Terminal
- **Cause:** Different ANSI escape sequence handling and Yoga layout engine interpretations
- **Current Solution:** Using chalk to pre-color strings before passing to single Text component
- **Ongoing:** Testing various spacing approaches (Box with minHeight, empty components)

### Key Code Patterns
```tsx
// Pre-color strings to avoid nested Text rendering issues
const coloredName = chalk.bold.cyan(repo.name);
const coloredDescription = chalk.gray(repo.description || 'No description');
const fullText = `${coloredName}\n${coloredDescription}\n${metadataLine}`;

// Use Box with minHeight for consistent spacing
<Box minHeight={2}>{/* Empty spacer */}</Box>
```

### Performance: RepoRow memoization (SWR-358)
`RepoRow` is wrapped in `React.memo` with a custom `arePropsEqual` that compares
`repo` (by reference), `selected`, `dim`, `forkTracking`, `starsMode`,
`multiSelectMode`, `isChecked`, `spacingLines`, `maxWidth`, `index`, and `theme`.
On each cursor move only the previously-selected and newly-selected rows
re-render; all others are skipped. In Bulk Select mode, toggling a row's
selection re-renders only that row (its `isChecked` flips).

Chalk formatting is also wrapped in `useMemo` keyed on the same inputs so the
string-building work is only repeated when a relevant prop actually changes.

**Keep `arePropsEqual` AND the `useMemo` dependency array in sync** whenever you
add a new prop to `RepoRow` that affects rendering — otherwise memoization will
serve a stale row. Both currently include the Bulk Select props
(`multiSelectMode`, `isChecked`) added in SWR-353.

## Common Tasks

### Adding New Features
1. Create feature branch
2. Update relevant components in `src/`
3. **Add/extend automated tests for the new behaviour** (`tests/`) — required, not optional (see Automated Tests above)
4. Test across different terminals
5. Update TypeScript types if needed
6. Run `pnpm test` and ensure it passes
7. Commit with conventional message
8. Create PR (title will be auto-formatted)

### Task Tracking
- There is no `TODOs.md`; planned work is tracked via [GitHub Issues](https://github.com/stealth-factory/gh-manager-cli/issues) and shipped work via [CHANGELOG.md](./CHANGELOG.md) (prepended by git-cliff on the release pull request).
- User-facing documentation lives in `wiki/`; keep the README concise and point to the relevant wiki pages.
- The README's “Contributing & Feature Requests” section directs users to open issues for ideas and bugs.

### Bug Fixes
1. Identify issue and create test case
2. Fix in relevant source file
3. Test fix across multiple terminals
4. Commit and push (version bumping and releases are automated)

### Updating Dependencies
```bash
pnpm update              # Update all to latest compatible
pnpm add package@latest  # Update specific package
pnpm build              # Ensure build still works
```

## Known Limitations

- **Terminal Compatibility:** Rendering differences between terminal emulators
- **Windows Support:** Untested, may have path/color issues
- **Large Repositories:** Performance with 1000+ repos needs optimization
- **Offline Mode:** No caching, requires internet connection

## Future Considerations

- **Repository Actions:** Clone, create, delete repos from CLI
- **Issue Management:** View and create issues
- **PR Management:** List and review pull requests
- **Caching:** Offline support with local data cache
- **Themes:** Customizable color schemes
- **Config Profiles:** Multiple GitHub account support

## Agent Guidelines

When working on this project:

1. **Always test changes** in multiple terminals before considering complete
2. **Always add automated tests for new features/fixes** - required in the same change; never ship behaviour without `tests/` coverage (see Automated Tests)
3. **Use chalk for colors** instead of Ink's color props to avoid nesting issues
4. **Follow TypeScript strictly** - no any types without justification
5. **ALWAYS use semantic commit messages** - This is REQUIRED for every commit
6. **Update this file** when adding major features or changing architecture
7. **Consider terminal constraints** - not all ANSI features work everywhere
8. **Keep it fast** - terminal UIs should feel instant

### Commit Requirements
Every single commit MUST follow semantic format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation only
- `style:` for formatting, missing semicolons, etc.
- `refactor:` for code changes that neither fix bugs nor add features
- `perf:` for performance improvements
- `test:` for adding missing tests
- `build:` for changes to build system or dependencies
- `ci:` for CI configuration changes
- `chore:` for other changes that don't modify src or test files
- `revert:` for reverting previous commits

---

## Cursor Cloud specific instructions

Single-package Ink CLI — no local servers, databases, or Docker. All commands run from the repo root.

### Standard commands

See `package.json` scripts and the **Setup & Usage** / **Scripts** sections above:

| Task | Command |
|------|---------|
| Install deps | `pnpm install` |
| Build | `pnpm build` |
| Typecheck (no ESLint in repo) | `pnpm typecheck` |
| Test | `pnpm test` |
| Dev (watch rebuild) | `pnpm dev` — run built output in another terminal with `pnpm start` |
| Run | `pnpm start` or `node dist/index.js` |

### Cloud VM gotchas

- **`NO_COLOR=1` is set in the Cloud Agent environment**, which disables chalk ANSI output. Two `BulkReviewModal` tests assert highlight escape codes and fail without `FORCE_COLOR=1`. Run tests as: `FORCE_COLOR=1 pnpm test`.
- **The CLI requires a real TTY** (Ink raw mode). Piping or backgrounding `node dist/index.js` fails with "Raw mode is not supported". Use a **tmux** session for interactive runs or smoke tests (see `test-app.sh` pattern, but prefer tmux over `&` in background).
- **Live GitHub API** is optional for automated tests (Vitest mocks Octokit). For manual E2E, set `GITHUB_TOKEN` or `GH_TOKEN` with `repo` scope, or complete OAuth in the auth chooser.
- **`pnpm install` may warn about ignored esbuild build scripts**; `pnpm build` still succeeds in practice.

---

**📋 For version history and release notes, see [CHANGELOG.md](./CHANGELOG.md)**

*This file contains project architecture and development guidelines. Dynamic information like versions and changes are tracked automatically in CHANGELOG.md.*
