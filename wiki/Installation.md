# Installation

The various ways to install and run gh-manager-cli, from package managers to standalone binaries.

The canonical npm package is `gh-manager-cli`, maintained by Stealth Factory. The executable remains `gh-manager-cli`.

## Homebrew (macOS/Linux)

```
brew tap stealth-factory/tap https://github.com/stealth-factory/homebrew-tap
brew install stealth-factory/tap/gh-manager-cli
```

The tap is hosted at [stealth-factory/homebrew-tap](https://github.com/stealth-factory/homebrew-tap); use the explicit URL to keep the familiar `tap` alias for this repository.

If you previously installed from `wiiiimm/tap`, switch with:

```bash
brew uninstall gh-manager-cli
brew untap wiiiimm/tap
brew tap stealth-factory/tap https://github.com/stealth-factory/homebrew-tap
brew install stealth-factory/tap/gh-manager-cli
```

Your saved authentication, preferences, and cache use the same application paths after reinstalling.

## APT (Linux amd64)

The signed Stealth Factory apt repository publishes `gh-manager-cli` for Linux amd64 with glibc 2.35 or newer. There is no arm64 package. npm remains available if you already use Node.

Add the repository, then install the package. The key is downloaded into a private directory from `mktemp -d`, so another user cannot replace it between the fingerprint check and `sudo install`. Compare the key's primary fingerprints with the set announced by Stealth Factory before you trust it. `Signed-By` limits this key to this source. Do not use `apt-key`, `trusted=yes`, or turn signature checks off.

```sh
sudo apt install ca-certificates curl gnupg
keydir=$(mktemp -d)
trap 'rm -rf "$keydir"' EXIT
curl --fail --show-error --silent --location \
  https://stealth-factory.github.io/apt-repo/stealth-factory.asc \
  --output "$keydir/stealth-factory.asc"
gpg --show-keys --with-fingerprint "$keydir/stealth-factory.asc"
gpg --show-keys --with-colons "$keydir/stealth-factory.asc" \
  | awk -F: '$1 == "pub" { primary=1; next } primary && $1 == "fpr" { print $10; primary=0 }'
# Compare the complete set of primary fingerprints with the announced set.
# Reject a missing fingerprint and any extra primary key. Stop if they differ.
sudo install -d -m 0755 /etc/apt/keyrings
sudo install -m 0644 "$keydir/stealth-factory.asc" /etc/apt/keyrings/stealth-factory.asc
printf '%s\n' 'deb [arch=amd64 signed-by=/etc/apt/keyrings/stealth-factory.asc] https://stealth-factory.github.io/apt-repo stable main' \
  | sudo tee /etc/apt/sources.list.d/stealth-factory.list
sudo apt update
sudo apt install gh-manager-cli
gh-manager-cli --version
```

The package installs one executable at `/usr/bin/gh-manager-cli`. The readme, changelog, and licence are under `/usr/share/doc/gh-manager-cli`. Settings in `~/.config/gh-manager-cli` are not removed with the package.

Upgrade with `sudo apt update && sudo apt upgrade`. Remove the package with `sudo apt remove gh-manager-cli`. Remove the source only when you no longer want updates for any application from this repository:

```sh
sudo rm /etc/apt/sources.list.d/stealth-factory.list
sudo rm /etc/apt/keyrings/stealth-factory.asc
sudo apt update
```

## NPX (Recommended — No Installation Required)

```
npx gh-manager-cli@latest
```

The unscoped package contains the application directly.

## NPM Global Install

```
npm install -g gh-manager-cli@latest
gh-manager-cli
```

If you installed the scoped package during the migration, switch back with:

```bash
npm uninstall -g @stealth-factory/gh-manager-cli
npm install -g gh-manager-cli@latest
gh-manager-cli
```

The previously published scoped version remains available, but new npm releases use `gh-manager-cli`.

## Pre-built Binaries (No Node.js Required)

Download standalone executables from [GitHub Releases](https://github.com/stealth-factory/gh-manager-cli/releases):

- **Linux:** `gh-manager-cli-linux-x64`
- **macOS:** `gh-manager-cli-macos-x64`
- **Windows:** `gh-manager-cli-windows-x64.exe`

Make the binary executable (Linux/macOS):

```
chmod +x gh-manager-cli-*
./gh-manager-cli-*
```

## From Source

**Prerequisites:** Node.js 22.12+, pnpm.

Install and build:

```
git clone https://github.com/stealth-factory/gh-manager-cli.git
cd gh-manager-cli
pnpm install
pnpm build
```

Run locally:

```
node dist/index.js
# Or add to PATH for dev
pnpm link
gh-manager-cli
```

On first run, you'll be prompted to authenticate with GitHub (OAuth recommended). See [Token & Security](Token-and-Security.md).

## Related Pages

- [Usage](Usage.md)
- [Features](Features.md)
- [Token & Security](Token-and-Security.md)
