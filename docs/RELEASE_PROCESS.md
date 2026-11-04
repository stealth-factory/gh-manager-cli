# Release Process

Releases come from [stealth-factory/gh-manager-cli](https://github.com/stealth-factory/gh-manager-cli). Publication is pooled, in the same shape as opscope: merges to `main` accumulate, a standing release pull request is the decision to cut a version, and `.github/workflows/release.yml` publishes only from the tag that pull request creates.

## Published Packages and Commands

| Destination | Package or repository | User command |
|---|---|---|
| npm | `gh-manager-cli` | `npx gh-manager-cli@latest` |
| GitHub Packages | `@stealth-factory/gh-manager-cli` | Requires GitHub registry configuration |
| Homebrew | `stealth-factory/homebrew-tap` | `brew install stealth-factory/tap/gh-manager-cli` |
| Standalone binaries | GitHub Releases | Platform-specific `gh-manager-cli-*` executable |

The executable remains `gh-manager-cli`. Configuration, preferences, cache, and log paths retain the application name, regardless of npm scope.

## What a merge to main does

`.github/workflows/release-pr.yml` runs on every push to `main`. git-cliff reads conventional commits since the last tag (`cliff.toml`).

`feat:` is a minor bump. `fix:` and `perf:` are patch bumps. A breaking change is a major bump, whether it is marked with `!` in the subject or with a `BREAKING CHANGE:` / `BREAKING-CHANGE:` footer. `revert:` is included. Documentation and maintenance commits do not open a release by themselves; they are listed in the changelog of the next real release. git-cliff would otherwise bump the patch for any commit, so the workflow ignores a range that has none of those releasable commits.

When there is something to release, the workflow prepends a changelog section, bumps `package.json`, and opens or updates one pull request from the `release` branch. That branch is force-pushed. Do not commit to it. The changelog text comes from the conventional commits on `main`. To change a line, change that commit message; do not edit `CHANGELOG.md` by hand. A manual run is accepted only from `main`; a dispatch from another branch does not rewrite `release`. Merging the pull request is the release. Until then nothing is tagged or published.

Do not manually bump the version or edit `CHANGELOG.md`. The historical sections were written by semantic-release; new sections are prepended by git-cliff and are not a rewrite of that history.

## What merging the release pull request does

`.github/workflows/tag-release.yml` runs on the push to `main`. It pushes an annotated `vX.Y.Z` tag only when that commit is the merge of the `release` pull request and `package.json` names a version that has no tag yet. The tag push starts publication. Any other push, including one that changes `package.json`, is left untagged. A version that is already tagged is left alone.

## What the tag publishes

`.github/workflows/release.yml` runs on `v*` tags, and on a manual dispatch. Dispatching a branch builds binaries and does not publish. Dispatching the tag retries publication. The npm, GitHub release, and Homebrew jobs run only when the ref is a tag, and only after the Linux, macOS, and Windows binaries have built.

The workflow checks the tag against `package.json` before npm publish and before the GitHub release is created or changed. A mismatched tag fails both, so a draft for the manifest version is left alone. It does not edit the manifest.

1. Build Linux, macOS, and Windows binaries with the pinned `@yao-pkg/pkg` and `node22` targets.
2. Publish `gh-manager-cli` to npmjs with OIDC trusted publishing (`id-token: write`), a token-free npm configuration, and npm 11.19.0. A version already on npm is skipped. No `NPM_TOKEN` or `NODE_AUTH_TOKEN` is set on this job. Configure the trusted publisher for `stealth-factory/gh-manager-cli`, workflow filename `release.yml`; see [npm Trusted Publishing](NPM_TRUSTED_PUBLISHING.md).
3. Create a draft GitHub release from the changelog section for that version, upload all three binaries, verify the assets, then publish the release. Upload failures fail the job and leave the draft. An already published release is checked and not modified.
4. Publish `@stealth-factory/gh-manager-cli` to GitHub Packages with `GITHUB_TOKEN`. The step temporarily changes the manifest name and registry, then restores both, including when publish fails.
5. Download the unscoped tarball from the public npm registry, hash it, and update `Formula/gh-manager-cli.rb` in `stealth-factory/homebrew-tap`.

Homebrew uses that published archive, not a local `npm pack` checksum. Downloads retry for up to six minutes while the registry propagates. If the archive is still missing, the job stops before it clones or edits the tap. A missing App token or a rejected formula push fails the job. A retry whose formula already matches succeeds without another commit.

The binary build, the GitHub release, the npm publish, and the tap update all check out the triggering commit (`github.sha`).

## Credentials

- npmjs: an OIDC trusted publisher on `gh-manager-cli`. The workflow does not use `NPM_TOKEN`.
- Org GitHub App: `vars.RELEASE_APP_CLIENT_ID` and `secrets.RELEASE_APP_PRIVATE_KEY`, minted with `actions/create-github-app-token` pinned to `64ab729a6294000f5aa4a4bc0b73d1f32bc45510` (v3.3.0). The release pull request token can write contents and pull requests in this repository. The tag token can write contents, so the tag push starts `release.yml`. The tap token can write contents only in `stealth-factory/homebrew-tap`. `altabella` has been removed from this repository, so these jobs do not fall back to `secrets.GH_TOKEN`.
- GitHub release assets stay on `GITHUB_TOKEN`. The App has no Packages permission; GitHub Packages uses `GITHUB_TOKEN` as well.
- Delete this repository's `GH_TOKEN` Actions secret if it is still present. Revoke the `altabella` PAT only after every other repository has moved.

See [npm Package Name and Ownership](NPM_SCOPE_MIGRATION.md) for migration history and verification.

## Manual Trigger and Recovery

Actions → **release-pr** → **Run workflow** refreshes the release pull request without waiting for a merge. It still requires a releasable commit; it does not force a version.

Actions → **Release Pipeline** → **Run workflow**, with the branch set to the tag, retries a tag that already exists. Upload failures leave a draft. An already published release with all three binaries is left unchanged. A published release that is missing an asset needs a new patch release. npm and the tap skip work that is already done.

Do not run `npm version` to force a release. For tap repair, use [HOMEBREW.md](HOMEBREW.md).

## Validation

Before merging release changes:

```bash
FORCE_COLOR=1 pnpm test
pnpm typecheck
pnpm build
npm pack --dry-run
```

A passing local check proves the artefacts can be prepared; confirm registry versions, GitHub release assets, and the tap formula separately after publication.
