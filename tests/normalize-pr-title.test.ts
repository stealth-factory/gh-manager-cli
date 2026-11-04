import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

type TitleResult = { newTitle: string; changed: boolean };

function normalise(script: string, title: string): TitleResult {
  if (script.endsWith('.cjs')) {
    const loaded = require(join(root, script)) as { processPRTitle: (current: string) => TitleResult };
    return loaded.processPRTitle(title);
  }
  const result = spawnSync(process.execPath, [join(root, script), title], { encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout) as TitleResult;
}

describe.each([
  '.github/scripts/normalize-pr-title.cjs',
  '.github/scripts/normalize-pr-title.js',
])('%s', (script) => {
  it('leaves a release title unchanged', () => {
    expect(normalise(script, 'release: v1.2.3')).toEqual({
      newTitle: 'release: v1.2.3',
      changed: false,
      reason: 'already_valid',
    });
  });

  it('lowercases a release title', () => {
    expect(normalise(script, 'Release: V1.2.3')).toMatchObject({
      newTitle: 'release: v1.2.3',
      changed: true,
    });
  });
});
