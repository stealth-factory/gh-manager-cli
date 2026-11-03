import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const workflow = readFileSync(join(root, '.github/workflows/release.yml'), 'utf8');
const directories: string[] = [];

// Execute the actual workflow's shell blocks offline. Their env expressions
// are outside the run blocks; the fixture supplies those values explicitly.
// `job` is required when two jobs share a step name, such as Git identity.
function jobBody(job: string): string {
  const header = `\n  ${job}:\n`;
  const start = workflow.indexOf(header);
  if (start === -1) throw new Error(`Missing workflow job: ${job}`);
  const bodyStart = start + header.length;
  const next = workflow.slice(bodyStart).search(/\n  [a-z0-9-]+:\n/);
  return next === -1 ? workflow.slice(bodyStart) : workflow.slice(bodyStart, bodyStart + next);
}

function runBlock(name: string, job?: string) {
  const source = job ? jobBody(job) : workflow;
  const start = source.indexOf(`      - name: ${name}\n`);
  if (start === -1) throw new Error(`Missing workflow step: ${job ? `${job} / ` : ''}${name}`);
  const next = source.indexOf('      - name:', start + 1);
  const step = source.slice(start, next === -1 ? undefined : next);
  const block = step.split('        run: |\n')[1];
  if (!block) throw new Error(`Missing run block: ${job ? `${job} / ` : ''}${name}`);
  return block.split('\n').map(line => line.startsWith('          ') ? line.slice(10) : line).join('\n');
}

function fixture(overrides: Record<string, string> = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'gmc-release-workflow-'));
  directories.push(directory);
  const bin = join(directory, 'bin');
  mkdirSync(bin);
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { version: string };
  pkg.version = '1.54.0';
  const original = `${JSON.stringify(pkg, null, 2)}\n`;
  writeFileSync(join(directory, 'package.json'), original);
  mkdirSync(join(directory, 'scripts'));
  for (const name of ['brew-sha.sh', 'update-homebrew-formula.js']) {
    copyFileSync(join(root, 'scripts', name), join(directory, 'scripts', name));
  }
  writeFileSync(join(directory, 'source-formula.rb'), `class GhManagerCli < Formula\n  homepage "https://github.com/wiiiimm/gh-manager-cli"\n  url "https://registry.npmjs.org/gh-manager-cli/-/gh-manager-cli-1.53.1.tgz"\n  sha256 "${'0'.repeat(64)}"\nend\n`);

  writeFileSync(join(bin, 'npm'), `#!/usr/bin/env node
import fs from 'node:fs';
const args = process.argv.slice(2);
fs.appendFileSync('npm-calls.jsonl', JSON.stringify(args) + '\\n');
if (args[0] === 'view') process.exit(process.env.MOCK_PACKAGE_EXISTS === '1' ? 0 : 1);
if (args[0] === 'install') {
  fs.copyFileSync(process.env.NPM_CONFIG_USERCONFIG, 'npm-install-config');
  process.exit(process.env.MOCK_NPM_INSTALL_FAILURE === '1' ? 8 : 0);
} else if (args[0] === '--version') {
  console.log(process.env.MOCK_NPM_VERSION || '11.19.0');
} else if (args[0] === 'pack') {
  fs.writeFileSync('archive.tgz', 'packed archive');
  console.log(JSON.stringify([{ filename: 'archive.tgz' }]));
} else if (args[0] === 'publish') {
  fs.copyFileSync('package.json', 'published-package.json');
  fs.writeFileSync('publish-auth-config-path', process.env.NPM_CONFIG_USERCONFIG);
  process.exit(process.env.MOCK_PUBLISH_FAILURE === '1' ? 7 : 0);
} else process.exit(99);
`, { mode: 0o755 });
  writeFileSync(join(bin, 'curl'), `#!/usr/bin/env node
import fs from 'node:fs';
const args = process.argv.slice(2);
if (args.slice(0, 8).join(' ') !== '--retry 24 --retry-delay 15 --retry-max-time 360 --retry-all-errors -fsSL' || args[8] !== 'https://registry.npmjs.org/gh-manager-cli/-/gh-manager-cli-1.54.0.tgz') process.exit(99);
if (process.env.MOCK_HTTP_ERROR === '1') process.exit(22);
fs.writeFileSync(args[10], 'published archive');
`, { mode: 0o755 });
  writeFileSync(join(bin, 'gh'), `#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const args = process.argv.slice(2);
fs.appendFileSync(path.join(process.env.MOCK_ROOT, 'gh-calls.jsonl'), JSON.stringify(args) + '\\n');
if (process.env.MOCK_GH_FAILURE === '1') process.exit(1);
if (args[0] === 'api' && args[2] === '--jq' && args[3] === '.id' && /^\\/users\\/.+\\[bot\\]$/.test(args[1])) {
  console.log(process.env.MOCK_BOT_ID || '4242');
  process.exit(0);
}
process.exit(99);
`, { mode: 0o755 });
  writeFileSync(join(bin, 'git'), `#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const args = process.argv.slice(2);
fs.appendFileSync(path.join(process.env.MOCK_ROOT, 'git-calls.jsonl'), JSON.stringify(args) + '\\n');
if (args[0] === 'clone') {
  fs.mkdirSync('tap-repo/Formula', { recursive: true });
  fs.copyFileSync('source-formula.rb', 'tap-repo/Formula/gh-manager-cli.rb');
} else if (args[0] === 'diff') process.exit(process.env.MOCK_NO_CHANGES === '1' ? 0 : 1);
else if (args[0] === 'push' && process.env.MOCK_PUSH_FAILURE === '1') process.exit(9);
`, { mode: 0o755 });
  const env = {
    ...process.env,
    PATH: `${bin}:${dirname(process.execPath)}:${process.env.PATH}`,
    MOCK_ROOT: directory,
    NODE_AUTH_TOKEN: 'offline-package-token',
    GITHUB_TOKEN: 'offline-tap-token',
    VERSION: '1.54.0',
    RUNNER_TEMP: directory,
    GITHUB_ENV: join(directory, 'github-env'),
    NPM_CONFIG_USERCONFIG: join(directory, 'setup-node.npmrc'),
    ...overrides,
  };
  writeFileSync(env.NPM_CONFIG_USERCONFIG, '//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}\n');
  return {
    directory,
    original,
    run: (name: string, job?: string) => spawnSync('bash', ['-e', '-o', 'pipefail', '-c', runBlock(name, job)], { cwd: directory, env, encoding: 'utf8' }),
  };
}

afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('deployment workflow (GMC-54)', () => {
  it('checks out the same triggering commit for binaries, release metadata, and publication', () => {
    const refs = [...workflow.matchAll(/^          ref: (.+)$/gm)].map(match => match[1]);
    expect(refs).toEqual(['${{ github.sha }}', '${{ github.sha }}']);
  });

  it.each(['0', '1'])('publishes to the new GitHub scope and restores npmjs config even on failure=%s', failure => {
    const f = fixture({ MOCK_PUBLISH_FAILURE: failure });
    const result = f.run('Publish to GitHub Packages');
    expect(result.status).toBe(failure === '1' ? 7 : 0);
    const published = JSON.parse(readFileSync(join(f.directory, 'published-package.json'), 'utf8')) as {
      name: string; publishConfig: { registry: string }; repository: { url: string };
    };
    expect(published.name).toBe('@stealth-factory/gh-manager-cli');
    expect(published.publishConfig.registry).toBe('https://npm.pkg.github.com');
    expect(published.repository.url).toBe('https://github.com/stealth-factory/gh-manager-cli.git');
    expect(readFileSync(join(f.directory, 'package.json'), 'utf8')).toBe(f.original);
    const authConfig = readFileSync(join(f.directory, 'publish-auth-config-path'), 'utf8');
    expect(existsSync(authConfig)).toBe(false);
    const calls = readFileSync(join(f.directory, 'npm-calls.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line) as string[]);
    expect(calls[0]).toEqual(['view', '@stealth-factory/gh-manager-cli@1.54.0', '--registry=https://npm.pkg.github.com']);
    expect(calls[2]).toEqual(['publish', 'archive.tgz', '--registry=https://npm.pkg.github.com']);
  });

  it('skips an already published GitHub version without changing the npmjs manifest', () => {
    const f = fixture({ MOCK_PACKAGE_EXISTS: '1' });
    expect(f.run('Publish to GitHub Packages').status).toBe(0);
    expect(readFileSync(join(f.directory, 'package.json'), 'utf8')).toBe(f.original);
    expect(readFileSync(join(f.directory, 'npm-calls.jsonl'), 'utf8').trim().split('\n')).toHaveLength(1);
  });

  it('updates the transferred tap from the unscoped archive and pushes the formula', () => {
    const f = fixture();
    expect(f.run('Update Homebrew Tap').status).toBe(0);
    const formula = readFileSync(join(f.directory, 'tap-repo/Formula/gh-manager-cli.rb'), 'utf8');
    expect(formula).toContain('/gh-manager-cli/-/gh-manager-cli-1.54.0.tgz');
    expect(formula).toContain(createHash('sha256').update('published archive').digest('hex'));
    const calls = readFileSync(join(f.directory, 'git-calls.jsonl'), 'utf8');
    expect(calls).toContain('@github.com/stealth-factory/homebrew-tap.git');
    expect(calls).toContain('["push","origin","main"]');
  });

  it('fails deployment when the transferred tap rejects the push', () => {
    const f = fixture({ MOCK_PUSH_FAILURE: '1' });
    expect(f.run('Update Homebrew Tap').status).toBe(9);
  });

  it('fails deployment when the required cross-repository token is missing', () => {
    const f = fixture({ GITHUB_TOKEN: '' });
    const result = f.run('Update Homebrew Tap');
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('::error::Homebrew tap update requires the org GitHub App token');
    expect(existsSync(join(f.directory, 'git-calls.jsonl'))).toBe(false);
  });

  it('stops before cloning the tap when the npm archive remains unavailable', () => {
    const f = fixture({ MOCK_HTTP_ERROR: '1' });
    expect(f.run('Update Homebrew Tap').status).not.toBe(0);
    expect(existsSync(join(f.directory, 'git-calls.jsonl'))).toBe(false);
  });

  it('allows a retry with no formula changes without committing or pushing', () => {
    const f = fixture({ MOCK_NO_CHANGES: '1' });
    expect(f.run('Update Homebrew Tap').status).toBe(0);
    const calls = readFileSync(join(f.directory, 'git-calls.jsonl'), 'utf8');
    expect(calls).not.toContain('["commit"');
    expect(calls).not.toContain('["push"');
  });
});

describe('npm OIDC release workflow (GMC-55)', () => {
  it('grants OIDC permission and removes stored npm credentials from the npmjs job', () => {
    const npmjsJob = workflow.split('\n  build:')[0];
    expect(npmjsJob).toContain('      id-token: write');
    expect(npmjsJob).toContain('          package-manager-cache: false');
    expect(npmjsJob).not.toContain('secrets.NPM_TOKEN');
    expect(npmjsJob).not.toMatch(/^\s+(NPM_TOKEN|NODE_AUTH_TOKEN):/m);
    // Release commits use the org App token. altabella no longer has access here.
    expect(npmjsJob).toContain('uses: actions/create-github-app-token@64ab729a6294000f5aa4a4bc0b73d1f32bc45510 # v3.3.0');
    expect(npmjsJob).toContain('GH_TOKEN: ${{ steps.app.outputs.token }}');
    expect(npmjsJob).not.toContain('secrets.GH_TOKEN');
    expect(npmjsJob).not.toContain('github.token');
    expect(workflow).toContain('NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}');
  });

  it('replaces setup-node authentication with a token-free config before installing a compatible npm', () => {
    const f = fixture();
    expect(f.run('Setup npm trusted publishing').status).toBe(0);
    const config = join(f.directory, 'npm-oidc.npmrc');
    expect(readFileSync(config, 'utf8')).toBe('registry=https://registry.npmjs.org/\n');
    // The installer already uses the clean config; later steps inherit it via GITHUB_ENV.
    expect(readFileSync(join(f.directory, 'npm-install-config'), 'utf8')).not.toContain('_authToken');
    expect(readFileSync(join(f.directory, 'github-env'), 'utf8')).toBe(`NPM_CONFIG_USERCONFIG=${config}\n`);
    const calls = readFileSync(join(f.directory, 'npm-calls.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line) as string[]);
    expect(calls).toEqual([['install', '--global', 'npm@11.19.0'], ['--version']]);
    expect(workflow.indexOf('- name: Setup npm trusted publishing')).toBeLessThan(workflow.indexOf('- name: Install dependencies'));
  });

  it('stops the release setup if the compatible npm installation fails', () => {
    const f = fixture({ MOCK_NPM_INSTALL_FAILURE: '1' });
    expect(f.run('Setup npm trusted publishing').status).toBe(8);
    expect(readFileSync(join(f.directory, 'npm-calls.jsonl'), 'utf8')).not.toContain('--version');
  });

  it('rejects an unexpected npm version instead of attempting an unsupported publish', () => {
    const f = fixture({ MOCK_NPM_VERSION: '10.9.3' });
    expect(f.run('Setup npm trusted publishing').status).toBe(1);
  });
});

describe('org GitHub App token', () => {
  it('does not fall back to the removed altabella PAT or github.token', () => {
    const lines = workflow.split('\n').filter(line => line.includes('secrets.GH_TOKEN') || line.includes('secrets.RELEASE_TOKEN') || line.includes('github.token'));
    expect(lines).toEqual([]);
  });

  it('mints a contents token for this repo and a separate contents token for the tap', () => {
    const pins = workflow.match(/uses: actions\/create-github-app-token@64ab729a6294000f5aa4a4bc0b73d1f32bc45510 # v3\.3\.0/g);
    expect(pins).toHaveLength(2);
    expect(workflow).not.toContain('permission-pull-requests');
    expect(workflow).not.toContain('permission-issues');
    expect(workflow).not.toContain('permission-workflows');
    expect(workflow).not.toContain('permission-actions');
    expect(workflow).not.toContain('permission-deployments');

    const semanticJob = workflow.split('\n  build:')[0];
    expect(semanticJob).not.toContain('repositories:');
    expect(semanticJob).not.toContain('owner:');
    expect(semanticJob).toContain('permission-contents: write');

    const releaseJob = workflow.split('\n  create-release:')[1].split('\n  publish-extras:')[0];
    expect(releaseJob).not.toContain('secrets.GH_TOKEN');
    expect(releaseJob).not.toContain('create-github-app-token');
    expect(releaseJob).toContain('GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}');

    const tapJob = workflow.split('\n  publish-extras:')[1];
    expect(tapJob).toContain('owner: stealth-factory');
    expect(tapJob).toContain('repositories: homebrew-tap');
    expect(tapJob).toContain('GITHUB_TOKEN: ${{ steps.app.outputs.token }}');
    expect(tapJob).not.toContain('github-actions[bot]');
    expect(tapJob).toContain('git commit -m "chore: update gh-manager-cli to ${VERSION}"');
    expect(semanticJob).toContain("if: steps.app.outputs.token != ''");
    expect(tapJob).toContain("if: steps.app.outputs.token != ''");
  });

  it('sets the semantic-release author from the App bot lookup', () => {
    const f = fixture({ SLUG: 'stealth-factory-ci', MOCK_BOT_ID: '4242' });
    const result = f.run('Git identity', 'semantic-release');
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    const ghCalls = readFileSync(join(f.directory, 'gh-calls.jsonl'), 'utf8');
    expect(ghCalls).toContain('"/users/stealth-factory-ci[bot]"');
    const gitCalls = readFileSync(join(f.directory, 'git-calls.jsonl'), 'utf8');
    expect(gitCalls).toContain('["config","user.name","stealth-factory-ci[bot]"]');
    expect(gitCalls).toContain('["config","user.email","4242+stealth-factory-ci[bot]@users.noreply.github.com"]');
    expect(gitCalls).not.toContain('"--global"');
    expect(readFileSync(join(f.directory, 'github-env'), 'utf8')).toBe(
      'GIT_AUTHOR_NAME=stealth-factory-ci[bot]\n' +
      'GIT_AUTHOR_EMAIL=4242+stealth-factory-ci[bot]@users.noreply.github.com\n' +
      'GIT_COMMITTER_NAME=stealth-factory-ci[bot]\n' +
      'GIT_COMMITTER_EMAIL=4242+stealth-factory-ci[bot]@users.noreply.github.com\n',
    );
  });

  it('sets the tap committer from the App bot lookup, globally for the clone', () => {
    const f = fixture({ SLUG: 'stealth-factory-ci', MOCK_BOT_ID: '4242' });
    expect(f.run('Git identity', 'publish-extras').status).toBe(0);
    const ghCalls = readFileSync(join(f.directory, 'gh-calls.jsonl'), 'utf8');
    expect(ghCalls).toContain('"/users/stealth-factory-ci[bot]"');
    const gitCalls = readFileSync(join(f.directory, 'git-calls.jsonl'), 'utf8');
    expect(gitCalls).toContain('["config","--global","user.name","stealth-factory-ci[bot]"]');
    expect(gitCalls).toContain('["config","--global","user.email","4242+stealth-factory-ci[bot]@users.noreply.github.com"]');
    expect(existsSync(join(f.directory, 'github-env'))).toBe(false);
  });

  it('stops the release identity when the App bot lookup fails', () => {
    const f = fixture({ SLUG: 'stealth-factory-ci', MOCK_GH_FAILURE: '1' });
    expect(f.run('Git identity', 'semantic-release').status).not.toBe(0);
    expect(existsSync(join(f.directory, 'github-env'))).toBe(false);
  });

  it('pushes the tap with the App token and does not fall back to github-actions[bot]', () => {
    const f = fixture({ GITHUB_TOKEN: 'app-token' });
    expect(f.run('Update Homebrew Tap', 'publish-extras').status).toBe(0);
    const calls = readFileSync(join(f.directory, 'git-calls.jsonl'), 'utf8');
    expect(calls).not.toContain('github-actions[bot]');
    expect(calls).toContain('x-access-token:app-token@github.com/stealth-factory/homebrew-tap.git');
    expect(existsSync(join(f.directory, 'gh-calls.jsonl'))).toBe(false);
  });
});
