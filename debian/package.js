import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Builds gh-manager-cli_X.Y.Z_amd64.deb from the tagged Linux x64 binary.
// One executable, installed at /usr/bin. Documentation stays under
// /usr/share/doc/gh-manager-cli. No maintainer scripts.

export const NAME = 'gh-manager-cli';
const MIN_GLIBC = '2.35';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function stableVersion(version) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error(`Expected stable release version: ${version}`);
  }
}

function assertAmd64Executable(file) {
  const stat = lstatSync(file);
  const bytes = readFileSync(file);
  if (!stat.isFile() || !(stat.mode & 0o111) || bytes.length < 20 ||
      bytes.subarray(0, 4).toString('hex') !== '7f454c46' ||
      bytes[4] !== 2 || bytes[5] !== 1 || bytes.readUInt16LE(18) !== 62) {
    throw new Error(`${NAME} must be an executable ELF64 little-endian amd64 file`);
  }
  return bytes;
}

export function stage(version, binaries, destination, repo = ROOT) {
  stableVersion(version);
  const bytes = assertAmd64Executable(join(binaries, NAME));
  mkdirSync(destination); // Never reuse a tree with stale files.
  const put = (name, contents, mode = 0o644) => {
    const target = join(destination, name);
    mkdirSync(dirname(target), { recursive: true, mode: 0o755 });
    writeFileSync(target, contents, { mode });
  };
  put(`usr/bin/${NAME}`, bytes, 0o755);
  for (const name of ['README.md', 'CHANGELOG.md']) {
    put(`usr/share/doc/${NAME}/${name}`, readFileSync(join(repo, name)));
  }
  put(`usr/share/doc/${NAME}/copyright`, readFileSync(join(repo, 'LICENSE')));
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(join(destination, dir), { withFileTypes: true })) {
      const name = posix.join(dir, entry.name);
      if (entry.isDirectory()) walk(name);
      else files.push(name);
    }
  };
  walk('usr');
  const size = Math.ceil(files.reduce((total, file) => total + statSync(join(destination, file)).size, 0) / 1024);
  put('DEBIAN/control', [
    `Package: ${NAME}`,
    `Version: ${version}`,
    'Section: devel',
    'Priority: optional',
    'Architecture: amd64',
    'Maintainer: William Li <email@wiiiimm.codes>',
    `Depends: libc6 (>= ${MIN_GLIBC}), libgcc-s1`,
    `Installed-Size: ${size}`,
    'Homepage: https://github.com/stealth-factory/gh-manager-cli',
    'Description: terminal UI for browsing and managing GitHub repositories',
    ' Browse, search, and manage personal and organisation repositories',
    ' from the terminal. No Node.js runtime is required.',
    '',
  ].join('\n'));
  put('DEBIAN/md5sums', files.sort().map((file) =>
    `${createHash('md5').update(readFileSync(join(destination, file))).digest('hex')}  ${file}\n`).join(''));
}

// `<sha256>  <filename>\n` — two spaces, the format apt-repo compares exactly.
export function checksumLine(file, name) {
  const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
  return `${hash}  ${name}\n`;
}

export function pack(tree, output, version) {
  stableVersion(version);
  if (process.platform !== 'linux') throw new Error('Build Debian packages on Linux');
  mkdirSync(output, { recursive: true });
  const name = `${NAME}_${version}_amd64.deb`;
  const file = resolve(output, name);
  if (existsSync(file)) throw new Error(`Refusing to overwrite ${file}`);
  const epoch = execFileSync('git', ['show', '-s', '--format=%ct', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
  execFileSync('dpkg-deb', ['--root-owner-group', '-Zxz', '--build', tree, file], {
    stdio: 'inherit',
    env: { ...process.env, SOURCE_DATE_EPOCH: epoch },
  });
  writeFileSync(`${file}.sha256`, checksumLine(file, name));
  return file;
}

export function build(version, binaries, output) {
  stableVersion(version);
  if (process.platform !== 'linux') throw new Error('Build Debian packages on Linux');
  const manifest = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
  if (version !== manifest) throw new Error('Package version must match package.json');
  const reported = execFileSync(join(resolve(binaries), NAME), ['--version'], { encoding: 'utf8' }).trim();
  if (reported !== version) throw new Error(`Inconsistent release stamp: ${reported}`);
  const temp = mkdtempSync(join(tmpdir(), `${NAME}-deb-`));
  try {
    const tree = join(temp, 'root');
    stage(version, binaries, tree);
    return pack(tree, output, version);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.length !== 5) throw new Error('Usage: node debian/package.js X.Y.Z BINARY_DIR OUTPUT_DIR');
  build(process.argv[2], process.argv[3], process.argv[4]);
}
