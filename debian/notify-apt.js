import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { stableVersion } from './package.js';

// Tells stealth-factory/apt-repo that a release exists. The payload is only
// the source, tag, and commit. apt-repo accepts `gh-manager-cli-release`
// for stealth-factory/gh-manager-cli.

const REPOSITORY = 'stealth-factory/gh-manager-cli';

export function payload(repository, tag, commit) {
  if (repository !== REPOSITORY) throw new Error('Unexpected release source');
  if (typeof tag !== 'string' || !tag.startsWith('v')) throw new Error('Expected vX.Y.Z tag');
  stableVersion(tag.slice(1));
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error('Expected exact release commit SHA');
  return { event_type: 'gh-manager-cli-release', client_payload: { repository, tag, commit } };
}

export function notify(env = process.env, execute = execFileSync) {
  const body = payload(env.GITHUB_REPOSITORY, env.GITHUB_REF_NAME, env.GITHUB_SHA);
  if (!env.GH_TOKEN) throw new Error('Bot token GH_TOKEN / RELEASE_TOKEN is unavailable');
  // repository_dispatch needs Contents write on apt-repo, not Actions write.
  execute('gh', ['api', '--method', 'POST', 'repos/stealth-factory/apt-repo/dispatches', '--input', '-'], {
    input: JSON.stringify(body),
    stdio: ['pipe', 'inherit', 'inherit'],
    env,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) notify();
