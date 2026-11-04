# Development

This page provides information for developers who want to contribute to or modify gh-manager-cli.

## Stack

- **UI:** `ink`, `ink-text-input`, `ink-spinner`
- **API:** `@octokit/graphql`, Apollo Client
- **Config paths:** `env-paths`
- **Language:** TypeScript
- **Build:** `tsup` (ESM output with shebang)

## Scripts

```bash
pnpm build          # build to dist/
pnpm build:binaries # build cross-platform binaries to ./binaries/
pnpm dev            # watch mode
pnpm start          # run normally
pnpm start:debug    # run with debug mode enabled
pnpm start:dev      # run with 5 repos per page and debug mode
pnpm test           # run the test suite (Vitest)
```

## Release Process

Releases are pooled. A merge to `main` does not publish.

### Release pull request

`.github/workflows/release-pr.yml` reads conventional commits since the last tag:

- `feat:` → minor bump
- `fix:` and `perf:` → patch bump
- a breaking marker → major bump

When one of those is present, it updates a standing pull request: `package.json`, a prepended changelog section, and no tag. Documentation and maintenance commits wait for the next real change.

### Tag and publication

Merging that pull request tags `vX.Y.Z`. `.github/workflows/release.yml` then:

1. Builds binaries for Linux, macOS, and Windows.
2. Publishes `gh-manager-cli` publicly on npm using OIDC.
3. Creates a draft GitHub release, uploads the three binaries, and publishes it only after they are all present.
4. Publishes `@stealth-factory/gh-manager-cli` to GitHub Packages.
5. Updates the formula in `stealth-factory/homebrew-tap` from the published unscoped npm tarball.

### Release Configuration and Migration

Do not run `npm version` or manually edit `CHANGELOG.md`. Dispatch **Release Pipeline** on the tag when a retry is needed, and inspect each job's result.

See [Release Process](../docs/RELEASE_PROCESS.md), [npm Package Name and Ownership](../docs/NPM_SCOPE_MIGRATION.md), and [Homebrew](../docs/HOMEBREW.md) for publishing permissions, package naming, and tap updates.

## Environment Variables

- `REPOS_PER_FETCH`: repositories to fetch per page (1-100, default: 30)
- `GH_MANAGER_DEBUG=1`: enables debug mode with performance metrics, detailed errors, and console logging
- `GH_TOKEN`: GitHub Personal Access Token (alternative to OAuth)
- `NO_COLOR`: disable coloured output in terminal

See [Apollo Cache (Performance)](Apollo-Cache.md) for caching-related variables (`APOLLO_TTL_MS`) and [Logging](Logging.md) for debug logging behaviour.

## Project Layout

- `src/index.tsx` — CLI entry, flag parsing, error handling, end-of-session summary
- `src/types.ts` — shared types
- `src/ui/App.tsx` — token bootstrap, renders `RepoList`
- `src/ui/views/` — `RepoList.tsx` (main list UI, key handling, modal management)
- `src/ui/OrgSwitcher.tsx` — organisation switching component
- `src/ui/hooks/` — `useTheme` and other shared hooks
- `src/ui/components/` — modular components:
  - `modals/` — Delete, Archive, Sync, Info, Logout, Rename, Transfer, CopyUrl, CreateRepo, ChangeVisibility, Visibility, Sort, SortDirection, ArchiveFilter, Star, Unstar, OpenInBrowser, and the Bulk\* modals plus `bulkActions.ts`
  - `repo/` — RepoRow (memoised with React.memo), FilterInput, RepoListHeader
  - `auth/` — AuthMethodSelector, OAuthProgress
  - `common/` — SlowSpinner and shared UI elements
- `src/services/` — `github/` (client, queries, mutations, REST operations, cache, and enrichment), `oauth.ts` (device-flow auth), `apolloMeta.ts` (Apollo cache management)
- `src/config/` — `config.ts` (token read/write and UI preferences), `constants.ts`, `themes.ts` (colour themes)
- `src/lib/` — `logger.ts` (structured logging with rotation), `utils.ts` (truncate, formatDate), `session.ts` (usage tracking + summary), `fuzzySearch.ts` (fuse.js search)
- `viewlogs.sh` — utility script for viewing logs

## Related Pages

- [Apollo Cache (Performance)](Apollo-Cache.md) — caching, debug mode, and cache configuration
- [Logging](Logging.md) — log locations, rotation, and what is recorded
- [Testing](Testing.md) — testing documentation
- [Troubleshooting](Troubleshooting.md) — diagnosing common issues
