const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.compute-build');
const publicRoot = path.join(output, 'public');
fs.mkdirSync(publicRoot, { recursive: true });
for (const directory of ['assets', 'wp-content']) {
  fs.cpSync(path.join(root, directory), path.join(publicRoot, directory), {
    recursive: true, filter: source => !source.endsWith('.md'),
  });
}
for (const file of ['index.html', 'post-2338.css']) {
  if (fs.existsSync(path.join(root, file))) fs.copyFileSync(path.join(root, file), path.join(publicRoot, file));
}
execFileSync('bun', ['build', 'hosting/server.mts', '--target=bun', '--outfile', '.compute-build/server.mjs'], { cwd: root, stdio: 'inherit', windowsHide: true });
console.log('Compute build contains only the public homepage assets and bundled server.');
