import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'drafts');
const localDir = path.join(root, '.local-drafts');
const envPath = path.join(root, '.env');
const meta = {
  service: 'urn:adobe:aue:config:service',
  connection: 'urn:adobe:aue:system:aemconnection',
  reload: 'urn:adobe:aue:reload',
  token: 'urn:adobe:aue:config:token',
};

function readEnv(contents) {
  return Object.fromEntries(contents.split(/\r?\n/)
    .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
    .filter(Boolean)
    .map(([, key, value]) => [key, value.replace(/^(['"])(.*)\1$/, '$2')]));
}

async function prepareDrafts() {
  const env = readEnv(await fs.readFile(envPath, 'utf8'));
  await fs.rm(localDir, { recursive: true, force: true });
  await fs.cp(sourceDir, localDir, { recursive: true });

  const indexPath = path.join(localDir, 'index.html');
  let html = await fs.readFile(indexPath, 'utf8');
  Object.entries(meta).forEach(([key, name]) => {
    const value = key === 'connection'
      ? `aem:${env.AUE_META_SERVER || ''}`
      : env[`AUE_META_${key.toUpperCase()}`];
    const tag = `<meta name="${name}" content="${value || ''}">`;
    const pattern = new RegExp(`<meta\\s+name=["']${name.replaceAll(':', '\\:')}["'][^>]*>`, 'i');
    html = pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
  });
  await fs.writeFile(indexPath, html);
}

await prepareDrafts();
const cli = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(cli, [
  '-y', '@adobe/aem-cli', 'up',
  '--html-folder', '.local-drafts',
  '--html-mount', '/',
  '--no-open', '--forward-browser-logs',
  '--tls-cert', 'certs/server.crt',
  '--tls-key', 'certs/server.key',
  ...process.argv.slice(2),
], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});