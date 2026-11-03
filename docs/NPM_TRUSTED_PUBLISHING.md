# npm Trusted Publishing

The npmjs release job in `.github/workflows/release.yml` publishes the application directly as `gh-manager-cli` using GitHub Actions OIDC. It does not use a stored `NPM_TOKEN`. Release commits and Homebrew tap pushes mint the org GitHub App token (`RELEASE_APP_CLIENT_ID` / `RELEASE_APP_PRIVATE_KEY`). `altabella` has been removed from this repository, so those steps do not use `secrets.GH_TOKEN`. The separate GitHub Packages job uses `GITHUB_TOKEN`.

## Configure the npm Package

Open **Settings → Trusted publishing** for [`gh-manager-cli`](https://www.npmjs.com/package/gh-manager-cli) and add a **GitHub Actions** trusted publisher:

| Field | Value |
|---|---|
| Organisation or user | `stealth-factory` |
| Repository | `gh-manager-cli` |
| Workflow filename | `release.yml` |
| Environment | Leave empty; the release job does not use a GitHub environment |
| Allowed actions | Enable direct publishing with `npm publish` |

The workflow filename is not the display name “Release Pipeline” and does not include `.github/workflows/`. A publisher pointing at `wiiiimm/gh-manager-cli` does not authorise the transferred repository. Opscope's publisher does not authorise this package either: npm trust is configured per package and repository.

The unscoped package already exists, so no initial bootstrap publication is needed. New releases do not publish the scoped npmjs package or a compatibility launcher. GitHub Packages remains scoped, using a separate registry and authentication.

New trusted publisher connections must complete their first successful publish within two days. If a connection expires, recreate it before releasing. See the [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/) for current requirements.

## Workflow Behaviour

- The npmjs job requests `id-token: write` on a GitHub-hosted Ubuntu runner.
- Node 22 and pinned npm 11.19.0 support trusted publishing. Semantic-release's npm plugin supports OIDC.
- Keep `publishConfig.registry` exactly `https://registry.npmjs.org/`, including the trailing slash: the installed npm plugin uses an exact comparison to select OIDC.
- A dedicated, token-free npm configuration replaces setup-node's authentication placeholder before dependencies are installed and releases run. The job does not reference `NPM_TOKEN` or `NODE_AUTH_TOKEN` secrets.
- Public packages published from this public repository through OIDC receive npm's automatic provenance attestations.

The GitHub App token authenticates against GitHub, not npmjs. Unscoped naming does not bypass npm's package-side trusted-publisher configuration.

## Verify and Recover

After a successful run, verify:

```bash
npm view gh-manager-cli version repository.url --registry=https://registry.npmjs.org/
npx gh-manager-cli@latest --version
```

If OIDC exchange fails, check the package's publisher, exact owner/repository/workflow values, direct publishing permission, connection expiry, and the job's `id-token: write` permission. A later `ENONPMTOKEN` or `EINVALIDNPMTOKEN` can be a fallback error after OIDC was rejected; it does not mean CI needs a stored npm token.

An npm OIDC 404 does not by itself prove the public package is absent. Check both public package availability and the authenticated trust settings before choosing a remedy.

The npm trust CLI can inspect the current package from this checkout:

```bash
npm trust list --json
```

npm requires account 2FA for this operation. Complete its interactive authentication locally, or inspect the package's settings on npmjs.com.

Do not manually bump versions or edit `CHANGELOG.md`. Semantic-release calculates the next version from conventional commits. See [Release Process](RELEASE_PROCESS.md).
