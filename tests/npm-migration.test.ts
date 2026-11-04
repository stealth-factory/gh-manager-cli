import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const canonical = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
  name: string; bin: Record<string, string>; main: string; files: string[];
  dependencies: Record<string, string>; publishConfig: { access: string; registry: string };
  repository: { url: string };
};

describe('unscoped npm publication (GMC-56)', () => {
  it('publishes the application directly under the short command name', () => {
    expect(canonical.name).toBe('gh-manager-cli');
    expect(canonical.bin).toEqual({ 'gh-manager-cli': 'dist/index.js' });
    expect(canonical.main).toBe('dist/index.js');
    expect(canonical.files).toContain('dist/');
    expect(canonical.dependencies).not.toHaveProperty('@stealth-factory/gh-manager-cli');
    expect(canonical.repository.url).toBe('https://github.com/stealth-factory/gh-manager-cli.git');
    expect(canonical.publishConfig.access).toBe('public');
  });

  it('uses the exact official registry URL trusted publishing compares', () => {
    // npm's OIDC path accepts only this spelling, including the trailing slash.
    expect(canonical.publishConfig.registry).toBe('https://registry.npmjs.org/');
  });

  it('publishes only the main package rather than invoking the retired scoped launcher flow', () => {
    const workflow = readFileSync(join(root, '.github/workflows/release.yml'), 'utf8');
    expect(workflow).toContain('npm publish --access public --provenance');
    expect(workflow).not.toContain('./scripts/release-legacy-package.js');
    expect(canonical).not.toHaveProperty('release');
  });
});
