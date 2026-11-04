import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { NAME, checksumLine, pack, stage } from '../debian/package.js';
import { notify, payload } from '../debian/notify-apt.js';

const directories: string[] = [];
const hasDpkg = spawnSync('dpkg-deb', ['--version'], { encoding: 'utf8' }).status === 0;

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'gmc-deb-'));
  directories.push(root);
  const bin = join(root, 'bin');
  mkdirSync(bin);
  writeFileSync(join(root, 'README.md'), 'readme\n');
  writeFileSync(join(root, 'CHANGELOG.md'), 'changelog\n');
  writeFileSync(join(root, 'LICENSE'), 'licence\n');
  const elf = Buffer.alloc(64);
  elf.write('7f454c460201', 'hex');
  elf.writeUInt16LE(62, 18);
  writeFileSync(join(bin, NAME), elf, { mode: 0o755 });
  return root;
}

function walk(dir: string, prefix = ''): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) found.push(...walk(join(dir, entry.name), relative));
    else found.push(relative);
  }
  return found;
}

afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('Debian package layout', () => {
  it('installs one executable at usr/bin and docs only under usr/share/doc', () => {
    const root = fixture();
    const out = join(root, 'out');
    stage('1.2.3', join(root, 'bin'), out, root);
    expect(readdirSync(join(out, 'usr/bin'))).toEqual([NAME]);
    expect(statSync(join(out, 'usr/bin', NAME)).mode & 0o111).not.toBe(0);
    expect(readdirSync(join(out, 'usr/share/doc', NAME)).sort()).toEqual(['CHANGELOG.md', 'README.md', 'copyright']);
    const data = walk(join(out, 'usr')).sort();
    expect(data).toEqual([
      `bin/${NAME}`,
      `share/doc/${NAME}/CHANGELOG.md`,
      `share/doc/${NAME}/README.md`,
      `share/doc/${NAME}/copyright`,
    ]);
    const controlNames = readdirSync(join(out, 'DEBIAN')).sort();
    expect(controlNames).toEqual(['control', 'md5sums']);
    const control = readFileSync(join(out, 'DEBIAN/control'), 'utf8');
    expect(control).toMatch(/^Package: gh-manager-cli\nVersion: 1\.2\.3\n/);
    expect(control).toMatch(/Architecture: amd64\n[\s\S]*Depends: libc6 \(>= 2\.35\), libgcc-s1/);
    expect(control).toContain('organisation');
    expect(() => stage('1.2.3', join(root, 'bin'), out, root)).toThrow(/EEXIST/);
  });

  it('rejects a missing, symlinked, foreign, or non-executable binary and an unstable version', () => {
    const root = fixture();
    const bin = join(root, 'bin');
    const out = join(root, 'out');
    const file = join(bin, NAME);
    for (const version of ['dev', 'v1.2.3', '1.2.3\n', '1.2.3-rc.1']) {
      expect(() => stage(version, bin, out, root)).toThrow(/stable release/);
    }
    const arm = Buffer.alloc(64);
    arm.write('7f454c460201', 'hex');
    arm.writeUInt16LE(183, 18);
    writeFileSync(file, arm, { mode: 0o755 });
    expect(() => stage('1.2.3', bin, out, root)).toThrow(/ELF64/);
    writeFileSync(file, '#!/bin/sh\n', { mode: 0o755 });
    expect(() => stage('1.2.3', bin, out, root)).toThrow(/ELF64/);
    writeFileSync(file, Buffer.alloc(64), { mode: 0o644 });
    expect(() => stage('1.2.3', bin, out, root)).toThrow(/ELF64/);
    rmSync(file);
    expect(() => stage('1.2.3', bin, out, root)).toThrow(/ENOENT/);
    const elf = Buffer.alloc(64);
    elf.write('7f454c460201', 'hex');
    elf.writeUInt16LE(62, 18);
    writeFileSync(join(root, 'real'), elf, { mode: 0o755 });
    spawnSync('ln', ['-s', join(root, 'real'), file]);
    expect(() => stage('1.2.3', bin, out, root)).toThrow(/ELF64/);
  });

  it('writes the checksum as sha256, two spaces, and the filename', () => {
    const root = fixture();
    const file = join(root, 'archive.bin');
    writeFileSync(file, 'package-bytes');
    const line = checksumLine(file, 'gh-manager-cli_1.2.3_amd64.deb');
    const hash = createHash('sha256').update('package-bytes').digest('hex');
    expect(line).toBe(`${hash}  gh-manager-cli_1.2.3_amd64.deb\n`);
  });

  it.skipIf(!hasDpkg)('builds a deb whose data archive is only the executable and the docs', () => {
    const root = fixture();
    const tree = join(root, 'tree');
    stage('1.2.3', join(root, 'bin'), tree, root);
    const deb = pack(tree, join(root, 'dist'), '1.2.3');
    const listing = execFileSync('dpkg-deb', ['-c', deb], { encoding: 'utf8' });
    const paths = listing.trim().split('\n').map((line) => line.slice(line.lastIndexOf(' ') + 1));
    expect(paths.filter((path) => !path.endsWith('/')).sort()).toEqual([
      './usr/bin/gh-manager-cli',
      './usr/share/doc/gh-manager-cli/CHANGELOG.md',
      './usr/share/doc/gh-manager-cli/README.md',
      './usr/share/doc/gh-manager-cli/copyright',
    ]);
    const control = execFileSync('dpkg-deb', ['--ctrl-tarfile', deb]);
    const members = execFileSync('tar', ['-t'], { input: control, encoding: 'utf8' }).trim().split('\n').sort();
    expect(members.filter((member) => member !== './').sort()).toEqual(['./control', './md5sums']);
    const checksum = readFileSync(`${deb}.sha256`, 'utf8');
    expect(checksum).toBe(checksumLine(deb, 'gh-manager-cli_1.2.3_amd64.deb'));
  });
});

describe('APT dispatch payload', () => {
  const env = {
    GITHUB_REPOSITORY: 'stealth-factory/gh-manager-cli',
    GITHUB_REF_NAME: 'v1.2.3',
    GITHUB_SHA: 'a'.repeat(40),
    GH_TOKEN: 'non-secret-fixture',
  };

  it('carries only the allowlisted repository, tag, and commit', () => {
    let call: unknown[] | undefined;
    notify(env, ((...args: unknown[]) => {
      call = args;
    }) as typeof execFileSync);
    expect(call).toBeDefined();
    const [command, args, options] = call as [string, string[], { input: string }];
    expect(command).toBe('gh');
    expect(args).toEqual(['api', '--method', 'POST', 'repos/stealth-factory/apt-repo/dispatches', '--input', '-']);
    expect(JSON.parse(options.input)).toEqual(payload(env.GITHUB_REPOSITORY, env.GITHUB_REF_NAME, env.GITHUB_SHA));
    expect(options.input.includes(env.GH_TOKEN)).toBe(false);
    expect(JSON.parse(options.input)).toEqual({
      event_type: 'gh-manager-cli-release',
      client_payload: {
        repository: 'stealth-factory/gh-manager-cli',
        tag: 'v1.2.3',
        commit: 'a'.repeat(40),
      },
    });
  });

  it('rejects another repository, an unstable tag, a short commit, and a missing token', () => {
    for (const tag of ['dev', '1.2.3', 'v1.2.3-rc.1', 'v1.2.3\n']) {
      expect(() => payload(env.GITHUB_REPOSITORY, tag, env.GITHUB_SHA)).toThrow();
    }
    expect(() => payload('stealth-factory/opscope', 'v1.2.3', env.GITHUB_SHA)).toThrow(/release source/);
    expect(() => payload(env.GITHUB_REPOSITORY, 'v1.2.3', 'main')).toThrow(/commit SHA/);
    expect(() => notify({ ...env, GH_TOKEN: '' })).toThrow(/unavailable/);
  });
});
