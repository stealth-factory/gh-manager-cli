import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const workflow = readFileSync(join(root, '.github/workflows/release.yml'), 'utf8');
const directories: string[] = [];
const names = ['gh-manager-cli-linux-x64', 'gh-manager-cli-macos-x64', 'gh-manager-cli-windows-x64.exe'];
function block(name: string) {
  const start = workflow.indexOf(`      - name: ${name}\n`);
  if (start < 0) throw new Error(`Missing step: ${name}`);
  const next = workflow.indexOf('      - name:', start + 1);
  const lines = workflow.slice(start, next < 0 ? undefined : next).split('        run: |\n')[1].split('\n');
  const script: string[] = [];
  for (const line of lines) {
    if (line.startsWith('          ')) script.push(line.slice(10));
    else if (!line.trim()) script.push('');
    else break;
  }
  return script.join('\n');
}
function fixture(overrides: Record<string, string> = {}) {
  const cwd = mkdtempSync(join(tmpdir(), 'gmc-github-release-'));
  directories.push(cwd);
  mkdirSync(join(cwd, 'bin'));
  writeFileSync(join(cwd, 'release_notes.md'), 'Release notes');
  for (const name of names) {
    const directory = join(cwd, 'binaries', name.replace(/\.exe$/, ''));
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, name), 'binary');
  }
  writeFileSync(join(cwd, 'bin', 'gh'), `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
fs.appendFileSync('calls.jsonl', JSON.stringify(args) + '\\n');
const state = fs.existsSync('release.json') ? JSON.parse(fs.readFileSync('release.json')) : null;
if (args[1] === 'view') {
  if (!state) process.exit(1);
  console.log(args.includes('--jq') ? String(state.isDraft) : JSON.stringify(state));
} else if (args[1] === 'create') {
  fs.writeFileSync('release.json', JSON.stringify({ isDraft: args.includes('--draft'), assets: [] }));
} else if (args[1] === 'upload') {
  if (!state.isDraft || process.env.FAIL_UPLOAD === '1') process.exit(7);
  state.assets = args.slice(3).filter(a => a !== '--clobber').map(file => ({ name: require('node:path').basename(file), size: fs.statSync(file).size }));
  if (process.env.OMIT_ASSET === '1') state.assets.pop();
  fs.writeFileSync('release.json', JSON.stringify(state));
} else if (args[1] === 'edit') {
  if (state.assets.length !== 3) process.exit(8);
  state.isDraft = false;
  fs.writeFileSync('release.json', JSON.stringify(state));
} else process.exit(99);
`, { mode: 0o755 });
  const env = { ...process.env, PATH: `${join(cwd, 'bin')}:${process.env.PATH}`, VERSION: '1.53.3', ...overrides };
  return {
    cwd,
    run: (name: string) => spawnSync('bash', ['-e', '-o', 'pipefail', '-c', block(name)], { cwd, env, encoding: 'utf8' }),
    state: () => JSON.parse(readFileSync(join(cwd, 'release.json'), 'utf8')) as { isDraft: boolean; assets: { name: string; size: number }[] },
    calls: () => readFileSync(join(cwd, 'calls.jsonl'), 'utf8'),
  };
}
afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('immutable GitHub release distribution (GMC-57)', () => {
  it('creates a draft, uploads all binaries, then publishes the complete release', () => {
    const f = fixture();
    expect(f.run('Create GitHub Release').status).toBe(0);
    expect(f.state().isDraft).toBe(true);
    expect(f.run('Upload binaries to release').status).toBe(0);
    expect(f.state().isDraft).toBe(true);
    expect(f.run('Publish GitHub Release').status).toBe(0);
    expect(f.state()).toEqual({ isDraft: false, assets: names.map(name => ({ name, size: 6 })) });
  });

  it('fails on upload errors and leaves the release as a draft', () => {
    const f = fixture({ FAIL_UPLOAD: '1' });
    f.run('Create GitHub Release');
    expect(f.run('Upload binaries to release').status).toBe(7);
    expect(f.state().isDraft).toBe(true);
    expect(f.calls()).not.toContain('"edit"');
  });

  it('rejects a missing local binary before attempting uploads', () => {
    const f = fixture();
    f.run('Create GitHub Release');
    rmSync(join(f.cwd, 'binaries', names[0], names[0]));
    expect(f.run('Upload binaries to release').status).toBe(1);
    expect(f.calls()).not.toContain('"upload"');
  });

  it('does not publish when an expected uploaded asset is absent', () => {
    const f = fixture({ OMIT_ASSET: '1' });
    f.run('Create GitHub Release');
    f.run('Upload binaries to release');
    expect(f.run('Publish GitHub Release').status).toBe(1);
    expect(f.state().isDraft).toBe(true);
  });

  it('allows a complete published release to be retried without changing immutable assets', () => {
    const f = fixture();
    for (const step of ['Create GitHub Release', 'Upload binaries to release', 'Publish GitHub Release']) expect(f.run(step).status).toBe(0);
    writeFileSync(join(f.cwd, 'calls.jsonl'), '');
    for (const step of ['Create GitHub Release', 'Upload binaries to release', 'Publish GitHub Release']) expect(f.run(step).status).toBe(0);
    expect(f.calls()).not.toMatch(/"(create|upload|edit)"/);
  });

  it('refuses a tag that does not match the manifest before touching a release', () => {
    const f = fixture({ GITHUB_REF_NAME: 'v9.9.9' });
    writeFileSync(join(f.cwd, 'package.json'), '{"version":"1.53.3"}\n');
    writeFileSync(join(f.cwd, 'release.json'), JSON.stringify({ isDraft: true, assets: [] }));
    const result = f.run('Get version and changelog');
    expect(result.status).not.toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toContain('tag v9.9.9 but package.json says 1.53.3');
    expect(f.state().isDraft).toBe(true);
    expect(existsSync(join(f.cwd, 'calls.jsonl'))).toBe(false);
  });

  it('records the manifest version when the tag matches', () => {
    const f = fixture({ GITHUB_REF_NAME: 'v1.53.3', GITHUB_OUTPUT: 'github-output' });
    writeFileSync(join(f.cwd, 'package.json'), '{"version":"1.53.3"}\n');
    writeFileSync(join(f.cwd, 'CHANGELOG.md'), '## [1.53.3]\n\n- a fix\n');
    expect(f.run('Get version and changelog').status).toBe(0);
    expect(readFileSync(join(f.cwd, 'github-output'), 'utf8')).toContain('version=1.53.3');
    expect(readFileSync(join(f.cwd, 'release_notes.md'), 'utf8')).toContain('## [1.53.3]');
  });

  it('rejects an existing published release whose assets are incomplete', () => {
    const f = fixture();
    writeFileSync(join(f.cwd, 'release.json'), JSON.stringify({ isDraft: false, assets: [] }));
    expect(f.run('Upload binaries to release').status).toBe(0);
    expect(f.run('Publish GitHub Release').status).toBe(1);
    expect(f.calls()).not.toMatch(/"(upload|edit)"/);
  });
});
