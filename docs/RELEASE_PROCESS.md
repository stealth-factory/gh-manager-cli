# Release Process

Releases come from [stealth-factory/gh-manager-cli](https://github.com/stealth-factory/gh-manager-cli), using `.github/workflows/release.yml` and the semantic-release configuration in `package.json`.

## Published Packages and Commands

| Destination | Package or repository | User command |
|---|---|---|
| npm | `gh-manager-cli` | `npx gh-manager-cli@latest` |
| GitHub Packages | `@stealth-factory/gh-manager-cli` | Requires GitHub registry configuration |
| Homebrew | `stealth-factory/homebrew-tap` | `brew install stealth-factory/tap/gh-manager-cli` |
| Standalone binaries | GitHub Releases | Platform-specific `gh-manager-cli-*` executable |

The executable remains `gh-manager-cli`. Configuration, preferences, cache, and log paths retain the application name, regardless of npm scope.

## Phase 1: Version and npm Publication

On a non-release commit pushed to `main`, semantic-release:

1. Analyses conventional commits since the last release.
2. Calculates the release version.
3. Updates `package.json` and the generated `CHANGELOG.md`.
4. Commits the release metadata as `chore(release): X.Y.Z` and creates a tag.
5. Publishes the full application as `gh-manager-cli` publicly on npm.

The npmjs publication uses OIDC trusted publishing with `id-token: write`, a token-free npm configuration, and npm 11.19.0. No stored npm publishing secret is used. Configure the npm package's trusted publisher for `stealth-factory/gh-manager-cli`, workflow `release.yml`; see [npm Trusted Publishing](NPM_TRUSTED_PUBLISHING.md).

Do not manually bump the version or edit `CHANGELOG.md`. `feat:` triggers a minor release; `fix:` and `perf:` trigger patch releases; a breaking-change marker triggers a major release. Documentation and maintenance commits alone do not normally trigger publication.

## Phase 2: Binaries, GitHub Packages, and Homebrew

The release metadata commit triggers the second phase:

1. Build Linux, macOS, and Windows binaries using the pinned `@yao-pkg/pkg` and `node22` targets.
2. Create a draft GitHub release from the generated changelog, upload all three binaries, verify the assets, then publish the complete release.
3. Build the application and publish the scoped package to GitHub Packages.
4. Download the unscoped tarball from the public npm registry, hash it, and update `Formula/gh-manager-cli.rb` in `stealth-factory/homebrew-tap`.

The GitHub Packages step temporarily changes the manifest name to `@stealth-factory/gh-manager-cli` and its registry to GitHub Packages, then restores the unscoped npmjs manifest even on failure. It uses a separate authentication configuration. Homebrew uses the published npmjs archive, rather than a local `npm pack` checksum.

Downstream release and publication jobs check out the triggering commit (`github.sha`), matching the binary build. They do not read a newer version from `main` while a release is running. A missing tap token or rejected formula push fails the deployment job; a retry with no formula changes succeeds without another commit. Homebrew retries npm downloads for up to six minutes while the public registry propagates a newly published version.

The release commit is pushed with the org GitHub App token, so it starts the phase 2 `push` workflow. A push authenticated only with the default `GITHUB_TOKEN` does not trigger another push workflow. The `semantic-release` job skips commits whose message starts with `chore(release):`, so that push does not cut another version.

## Credentials After the Repository Transfer

- npmjs: configure an OIDC trusted publisher on `gh-manager-cli`. The workflow does not use `NPM_TOKEN`.
- Org GitHub App: `vars.RELEASE_APP_CLIENT_ID` and `secrets.RELEASE_APP_PRIVATE_KEY`. The `semantic-release` job mints a contents write token for this repository. The tap step mints a separate contents write token for `stealth-factory/homebrew-tap` only. `altabella` has been removed from this repository, so neither job falls back to `secrets.GH_TOKEN` or `github.token`.
- GitHub release assets: `create-release` uses `GITHUB_TOKEN`. This repository does not run a workflow on `release` or tag pushes.
- `GITHUB_TOKEN`: the `publish-extras` job requests `packages: write` for GitHub Packages. The App has no Packages permission.
- Delete this repository's `GH_TOKEN` Actions secret if it is still present. Revoke the `altabella` PAT only after every other repository has moved.

See [npm Package Name and Ownership](NPM_SCOPE_MIGRATION.md) for migration history and verification.

## Manual Trigger and Recovery

Use GitHub Actions → **Release Pipeline** → **Run workflow**. Semantic-release still requires releasable commits; a manual trigger does not force a version bump.

For an interrupted second phase, retry the failed workflow and inspect the job conditions. Upload failures leave a draft for recovery. An already published release is checked for all three non-empty binary assets and is not modified; a published immutable release with missing assets requires a new patch release.

Do not run `npm version` to force a release. For tap repair, use [HOMEBREW.md](HOMEBREW.md).

## Validation

Before merging release changes:

```bash
FORCE_COLOR=1 pnpm test
pnpm typecheck
pnpm build
npm pack --dry-run
```

A passing local check proves the artifacts can be prepared; confirm registry versions, GitHub release assets, and the tap formula separately after publication.
