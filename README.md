<img src="docs/assets/logo-horizontal.png" alt="gh-manager-cli logo" width="400" />

# gh-manager-cli

[![npm version](https://img.shields.io/npm/v/gh-manager-cli.svg)](https://www.npmjs.com/package/gh-manager-cli)
[![GitHub release](https://img.shields.io/github/release/stealth-factory/gh-manager-cli.svg)](https://github.com/stealth-factory/gh-manager-cli/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/gh-manager-cli.svg)](https://nodejs.org)
[![GitHub Stars](https://img.shields.io/github/stars/stealth-factory/gh-manager-cli.svg)](https://github.com/stealth-factory/gh-manager-cli/stargazers)
[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-%E2%9D%A4-pink)](https://github.com/sponsors/wiiiimm)
[![Context Engineered with Claude Opus 4.1](https://img.shields.io/badge/Context%20Engineered%20with-Claude%20Opus%204.1-blue)](https://www.anthropic.com)
[![Context Engineered with Codex GPT-5](https://img.shields.io/badge/Context%20Engineered%20with-Codex%20GPT--5-green)](https://openai.com)

Interactive terminal app to browse and manage your GitHub repositories. Built with Ink (React for CLIs) and the GitHub GraphQL API.

Maintained by [Stealth Factory](https://github.com/stealth-factory). The npm package is `gh-manager-cli`; the installed command is `gh-manager-cli`.

🌐 **Website:** [gh-manager-cli.dev](https://gh-manager-cli.dev) · 📦 **npm:** [gh-manager-cli](https://www.npmjs.com/package/gh-manager-cli) · 📜 **Changelog:** [CHANGELOG.md](./CHANGELOG.md)

## 🧹 Clean Up Your GitHub Account in Minutes

**Stop clicking through GitHub's slow web interface.** Managing dozens of repos on github.com means endless page loads, multiple clicks per action, and no keyboard shortcuts. `gh-manager-cli` replaces all of that with fast, keyboard-first terminal commands:

- **Whole account loaded in the background** — browse, filter, and fuzzy-search everything instantly
- **Single keypress for any action** — archive, delete, rename, transfer, change visibility, sync forks
- **Bulk operations** — act on many repos at once
- **Instant updates** — no page reloads

<p align="center">
  <img src="docs/app-demo.gif" alt="Interactive demo of gh-manager-cli" width="900" />
  <br />
  <em>Fast, keyboard-first GitHub repo management from your terminal</em>
 </p>

## Quick Start

```bash
# Run with npx (no install)
npx gh-manager-cli@latest
```

The npm package contains the application directly. See [Installation](wiki/Installation.md) for apt, global npm, Homebrew, and standalone binary options.

On first run, you'll be prompted to authenticate with GitHub (OAuth recommended). See [Token & Security](wiki/Token-and-Security.md).

## Documentation

Full docs live in the [wiki](wiki/README.md):

| Getting Started | Features & Usage | Development |
|-----------------|------------------|-------------|
| [📥 Installation](wiki/Installation.md) | [🔍 Features](wiki/Features.md) | [🛠️ Development](wiki/Development.md) |
| [🔑 Token & Security](wiki/Token-and-Security.md) | [⌨️ Usage & Controls](wiki/Usage.md) | [🧪 Testing](wiki/Testing.md) |
| [❓ Troubleshooting](wiki/Troubleshooting.md) | [🗄️ Apollo Cache](wiki/Apollo-Cache.md) · [📝 Logging](wiki/Logging.md) | [📜 Changelog](./CHANGELOG.md) |

## Screenshots

<div align="center">
  <img src="docs/demo_repo_listing.png" alt="Repository listing with metadata" width="31%" />
  <img src="docs/demo_login.png" alt="GitHub token authentication flow" width="31%" />
  <img src="docs/demo_delete_confirmation.png" alt="Two-step delete confirmation" width="31%" />
  <br />
  <sub>Listing • Auth • Delete confirmation</sub>
</div>

## Highlights

- **Authentication** — GitHub OAuth (recommended) or Personal Access Token, stored with `0600` perms
- **Background fetch-all** — your entire account cached after the first page, so filter/sort/search are instant
- **Fuzzy search** (`/`) — instant, typo-tolerant, no network calls (powered by [fuse.js](https://www.fusejs.io/))
- **View filters** (`V`) — visibility, archive, and fork filters in one modal
- **Repository actions** — info, open, rename, transfer, copy URL, delete, archive, change visibility, star, sync fork
- **Bulk Select mode** (`B`) — star, archive, change visibility, delete, and transfer many repos at once
- **Organisation & Enterprise support** — switch contexts (`W`), Internal visibility, ENT badge
- **Fork ahead/behind tracking**, **colour themes** (`Shift+T`), **display density** (`T`), **collapsible key hints** (`H`), and **rate-limit monitoring**

See the [Features](wiki/Features.md) and [Usage & Controls](wiki/Usage.md) pages for the full list and every keybinding.

## Installation

```bash
# Homebrew (macOS/Linux)
brew tap stealth-factory/tap https://github.com/stealth-factory/homebrew-tap && brew install stealth-factory/tap/gh-manager-cli

# apt (Linux amd64)
sudo apt install ca-certificates curl gnupg
curl --fail --show-error --silent --location \
  https://stealth-factory.github.io/apt-repo/stealth-factory.asc \
  --output /tmp/stealth-factory.asc
gpg --show-keys --with-fingerprint /tmp/stealth-factory.asc
# Compare the complete set of primary fingerprints with the set announced by
# Stealth Factory. Do not install the key if they differ.
sudo install -d -m 0755 /etc/apt/keyrings
sudo install -m 0644 /tmp/stealth-factory.asc /etc/apt/keyrings/stealth-factory.asc
printf '%s\n' 'deb [arch=amd64 signed-by=/etc/apt/keyrings/stealth-factory.asc] https://stealth-factory.github.io/apt-repo stable main' \
  | sudo tee /etc/apt/sources.list.d/stealth-factory.list
sudo apt update
sudo apt install gh-manager-cli

# npm global install
npm install -g gh-manager-cli@latest
gh-manager-cli
```

Pre-built binaries (no Node.js required) and build-from-source instructions are on the [Installation](wiki/Installation.md) page.

## Contributing & Feature Requests

Got an idea or hit a bug? **[Open an issue](https://github.com/stealth-factory/gh-manager-cli/issues/new/choose)** — feature requests and bug reports are very welcome.

- 💡 **Feature requests / bugs** → [GitHub Issues](https://github.com/stealth-factory/gh-manager-cli/issues)
- 📜 **What's shipped recently** → [CHANGELOG.md](./CHANGELOG.md)
- 🛠️ **Want to contribute code?** → [CONTRIBUTING.md](./CONTRIBUTING.md) and the [Development](wiki/Development.md) guide

## Support & Sponsorship

If you find gh-manager-cli useful, consider supporting its development:

💖 **[GitHub Sponsors](https://github.com/sponsors/wiiiimm)** — support directly through GitHub
☕ **[Buy Me a Coffee](https://buymeacoffee.com/wiiiimm)** — one-time coffee donations

Your support helps maintain and improve this project. Thank you! 🙏

## License

MIT
