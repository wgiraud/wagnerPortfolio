import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const now = new Date();
const builtAt = now.toISOString();
const buildId = builtAt.replace(/[-:TZ.]/g, '');
let sha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || '';
if (!sha) {
  try {
    sha = execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    // A Git checkout is not required to generate a build.
  }
}
const commit = /^[a-f0-9]{7,64}$/i.test(sha) ? sha.slice(0, 7) : 'local';
const label = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short', hour12: false
}).format(now);
const info = { version: buildId + '-' + commit, builtAt, label, commit };
const output = fileURLToPath(new URL('../src/app/core/generated/build-info.ts', import.meta.url));
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, '// Generated automatically; do not edit.\nexport const BUILD_INFO = ' + JSON.stringify(info, null, 2) + ' as const;\n', 'utf8');
console.log('Build:', info.version);
