import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

function readRepoFile(relativePath: string): string {
  return readFileSync(join(repoRoot, relativePath), 'utf8');
}

/**
 * Minimum releases that clear the undici advisories Dependabot tried to
 * apply in run 41643320021. 6.29.1 is the newest 6.x @actions/http-client
 * accepts; 7.30.1 is the newest 7.x semantic-release and pkg-fetch accept.
 */
const PATCHED: Record<number, readonly [number, number]> = {
  6: [29, 1],
  7: [30, 1],
  8: [12, 2],
};

function isPatched(version: string): boolean {
  const [major, minor, patch] = version.split('.').map(Number);
  const floor = PATCHED[major];
  if (!floor) return false;
  const [floorMinor, floorPatch] = floor;
  return minor > floorMinor || (minor === floorMinor && patch >= floorPatch);
}

const PNPM8_OVERRIDES = {
  '@actions/http-client>undici': '6.29.1',
  '@semantic-release/github>undici': '7.30.1',
  '@yao-pkg/pkg-fetch>undici': '7.30.1',
} as const;

describe('transitive undici security pin', () => {
  const lockfile = readRepoFile('pnpm-lock.yaml');
  const workspace = readRepoFile('pnpm-workspace.yaml');
  const pkg = JSON.parse(readRepoFile('package.json')) as {
    pnpm?: { overrides?: Record<string, string> };
  };
  const resolved = [...new Set(
    [...lockfile.matchAll(/^  undici@(\d+\.\d+\.\d+):/gm)].map(match => match[1]),
  )].sort();

  it('resolves only patched undici releases', () => {
    expect(resolved.length).toBeGreaterThan(0);
    expect(resolved.every(isPatched)).toBe(true);
    expect(lockfile).not.toMatch(/undici@6\.28\.0:/);
    expect(lockfile).not.toMatch(/undici: 6\.28\.0/);
    expect(lockfile).not.toMatch(/undici@7\.29\.0:/);
    expect(lockfile).not.toMatch(/undici: 7\.29\.0/);
  });

  it('overrides each parent that pulls undici, so a fresh install cannot drift back', () => {
    // Release jobs run pnpm 8, which applies package.json pnpm.overrides and
    // ignores overrides in pnpm-workspace.yaml. Keep both in sync.
    expect(pkg.pnpm?.overrides).toEqual(PNPM8_OVERRIDES);
    for (const [parent, version] of Object.entries(PNPM8_OVERRIDES)) {
      expect(workspace).toContain(`"${parent}": "${version}"`);
    }
  });
});
