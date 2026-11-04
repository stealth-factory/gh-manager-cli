# Contributing to gh-manager-cli

We welcome contributions to gh-manager-cli! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Guidelines](#issue-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)

## Code of Conduct

This project adheres to a code of conduct adapted from the [Contributor Covenant](https://www.contributor-covenant.org/). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork [stealth-factory/gh-manager-cli](https://github.com/stealth-factory/gh-manager-cli) on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Create a branch for your changes
5. Make your changes
6. Test your changes
7. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 22.12 or higher
- pnpm (recommended) or npm
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/gh-manager-cli.git
cd gh-manager-cli

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run the CLI
node dist/index.js
# or link for development
pnpm link
gh-manager-cli
```

### Project Structure

- `src/` - Source code
  - `ui/` - React/Ink UI components
  - `github.ts` - GitHub API integration
  - `config.ts` - Configuration management
  - `types.ts` - TypeScript type definitions
- `dist/` - Built output (gitignored)
- `.github/` - GitHub Actions workflows
- `AGENTS.md` - Project architecture and development guide
- `wiki/` - User and developer documentation
- `CHANGELOG.md` - Generated release history (shipped features)

## Making Changes

### Branch Naming

Include the Linear issue ID in branch names and PR titles (create an issue first if needed):
- `feat/gmc-123-add-repository-actions` - New features
- `fix/gmc-123-sorting-bug` - Bug fixes
- `docs/gmc-123-update-readme` - Documentation changes
- `refactor/gmc-123-github-client` - Code refactoring

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning and changelog generation:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `build` - Build system changes
- `ci` - CI/CD changes
- `chore` - Other changes

**Examples:**
```
feat: add repository deletion with confirmation modal
fix: resolve terminal rendering issues in SSH environments
docs: update installation instructions
refactor: extract GitHub API client to separate module
```

## Submitting Changes

### Before Submitting

1. **Test thoroughly** - Ensure your changes work across different terminals
2. **Update documentation** - Update AGENTS.md if changing architecture, and the relevant `wiki/` pages for user-facing changes
3. **Follow code standards** - Ensure TypeScript strict mode compliance
4. **Test terminal compatibility** - Verify in multiple terminal apps

### Pull Request Process

1. **Create a clear title** - Will be auto-formatted to conventional commits
2. **Describe your changes** - Explain what and why
3. **Reference issues** - Link to related issues if applicable
4. **Update tests** - Add or update tests for new functionality
5. **Check CI** - Ensure all automated checks pass

## Coding Standards

### TypeScript

- Use strict TypeScript - no `any` types without justification
- Provide comprehensive type definitions
- Use functional components with hooks for React/Ink
- Follow existing code patterns and conventions

### UI/UX Guidelines

- **Terminal compatibility** - Test in multiple terminal emulators
- **Color usage** - Use chalk for pre-coloring to avoid nested Text issues
- **Performance** - Keep terminal UIs fast and responsive
- **Accessibility** - Ensure keyboard navigation works intuitively

### Key Technical Constraints

- **Ink rendering** - Use Box components for layout, avoid nested Text
- **Terminal differences** - Account for SSH vs native terminal rendering
- **Virtualization** - Consider performance with large repository lists
- **API limits** - Respect GitHub rate limits and provide clear feedback

## Testing

### Manual Testing Checklist

- [ ] Test in multiple terminals (iTerm2, Terminal.app, SSH/Termius)
- [ ] Test with different window sizes
- [ ] Test with large numbers of repositories
- [ ] Test API error scenarios (network issues, invalid tokens)
- [ ] Test keyboard navigation thoroughly
- [ ] Verify sorting works correctly
- [ ] Test filtering functionality

### Automated Testing

Every feature or bug fix requires automated coverage in the same change. Run `FORCE_COLOR=1 pnpm test`, `pnpm typecheck`, and `pnpm build` before submitting. Vitest and ink-testing-library cover utility functions, mocked GitHub API operations, and UI behaviour. See [AGENTS.md](AGENTS.md) for input and async modal test conventions.

## Documentation

### When to Update Documentation

- **AGENTS.md** - For architectural changes or new development patterns
- **README.md** - For user-facing changes or installation updates
- **wiki/** - For detailed feature, usage, and development documentation
- **CONTRIBUTING.md** - For process or guideline changes

### Documentation Standards

- Keep README concise, point to the detailed docs in `wiki/`
- Use AGENTS.md for comprehensive technical documentation
- Track shipped work via `CHANGELOG.md`; planned work is driven by [GitHub Issues](https://github.com/stealth-factory/gh-manager-cli/issues)
- Include code examples where helpful

## Issue Guidelines

### Reporting Bugs

Include:
- Operating system and terminal app
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Error messages or screenshots

### Feature Requests

Include:
- Use case and motivation
- Proposed solution or behavior
- Alternative solutions considered
- Impact on existing functionality

### Questions

- Check AGENTS.md and README.md first
- Search existing issues
- Provide context about what you're trying to achieve

## Pull Request Guidelines

### PR Checklist

- [ ] Branch is up to date with main
- [ ] Commit messages follow conventional format
- [ ] Code follows TypeScript strict mode
- [ ] Changes tested in multiple terminals
- [ ] Documentation updated if needed (AGENTS.md / `wiki/`)
- [ ] No merge conflicts

### Review Process

1. **Automated checks** - CI must pass
2. **Manual review** - Code quality and architecture
3. **Testing** - Functionality verification
4. **Documentation** - Completeness check
5. **Merge** - Squash merge with conventional commit title

## Development Workflow

### Local Development

```bash
# Start development mode with auto-rebuild
pnpm dev

# Build for production
pnpm build

# Test the built CLI
node dist/index.js

# Link for global testing
pnpm link
gh-manager-cli
```

### Release Process

Releases are pooled:
1. Merge to main. That updates a release pull request when the commits warrant a version; it does not publish.
2. Merging the release pull request tags the version.
3. The tag publishes `gh-manager-cli` on npm using OIDC, attaches the three binaries to a GitHub release, and updates GitHub Packages and `stealth-factory/homebrew-tap`.
4. CHANGELOG.md is prepended on the release pull request. Do not edit it by hand.

See [Release Process](docs/RELEASE_PROCESS.md) and [npm Package Name and Ownership](docs/NPM_SCOPE_MIGRATION.md).

### Getting Help

- Check [AGENTS.md](./AGENTS.md) for technical details
- Browse the [wiki](./wiki/README.md) for feature, usage, and development docs
- Open an issue for questions, discussions, or feature requests
- Review existing issues and pull requests

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- AGENTS.md for architectural contributions

Thank you for contributing to gh-manager-cli! 🚀