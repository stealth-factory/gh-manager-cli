# npm Package Name and Stealth Factory Ownership

The main npm package is [`gh-manager-cli`](https://www.npmjs.com/package/gh-manager-cli), matching the installed executable and the short command:

```bash
npx gh-manager-cli@latest
```

The GitHub repository is [stealth-factory/gh-manager-cli](https://github.com/stealth-factory/gh-manager-cli), and the Homebrew tap is [stealth-factory/homebrew-tap](https://github.com/stealth-factory/homebrew-tap). GitHub organisation ownership does not require an npm scope.

## Migration History

The repository briefly prepared npmjs publication as `@stealth-factory/gh-manager-cli`, with the unscoped package acting as a compatibility launcher. The scoped package was initially published, but the release strategy now publishes the full application under `gh-manager-cli` again, matching Opscope's unscoped npm distribution model.

Previously published scoped versions remain available on npm. New automated npmjs releases update only `gh-manager-cli`; they do not maintain a same-version scoped npmjs mirror. GitHub Packages still publishes `@stealth-factory/gh-manager-cli`, because that registry requires a scope.

Existing `npx gh-manager-cli` and global unscoped installations keep their package name. Users who installed the scoped package can switch back using [Installation](../wiki/Installation.md). Saved tokens, UI preferences, cache, and logs retain the existing application paths.

## Publishing and Verification

The package already exists, so a bootstrap publish is unnecessary. Configure its trusted publisher for `stealth-factory/gh-manager-cli`, workflow `release.yml`, no environment, and direct publishing. See [npm Trusted Publishing](NPM_TRUSTED_PUBLISHING.md).

The release pull request uses existing tags and conventional commits to calculate the next release. Do not overwrite an existing npm version, manually bump `package.json`, or edit the generated `CHANGELOG.md`. Publication happens from the tag, not from the merge that prepared it.

After the workflow succeeds:

```bash
npm view gh-manager-cli version repository.url --registry=https://registry.npmjs.org/
npx gh-manager-cli@latest --version
```

Verify GitHub release binaries and the Homebrew formula separately. The formula must use the unscoped npmjs tarball and the checksum of that published archive. See [Release Process](RELEASE_PROCESS.md) and [Homebrew](HOMEBREW.md).
