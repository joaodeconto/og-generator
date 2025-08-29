import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const baseRef = process.env.BASE_REF ? `origin/${process.env.BASE_REF}` : 'origin/main';
let diff: string[] = [];
try {
  diff = execSync(`git diff --name-only ${baseRef} 2>/dev/null`).toString().trim().split('\n').filter(Boolean);
} catch {
  diff = execSync('git diff --name-only HEAD~1').toString().trim().split('\n').filter(Boolean);
}

const codeTouched = diff.some((p) => /^(app|components|lib|state|workers)\//.test(p));
const docsTouched = diff.some((p) => /^docs\/log\//.test(p)) || diff.includes('docs/dev_doc.md') || diff.includes('README.md');

if (codeTouched && !docsTouched) {
  console.error('Docs guard: Code changed but docs/log or dev_doc/README not updated.');
  process.exit(1);
}

// Additionally verify that README lists environment variables referenced in lib/env.ts
try {
  const envTs = readFileSync('lib/env.ts', 'utf8');
  // Capture keys declared in the z.object({ ... }) schema
  const keyMatches = Array.from(envTs.matchAll(/\b([A-Z][A-Z0-9_]+)\s*:\s*z\./g));
  const keys = Array.from(new Set(keyMatches.map((m) => m[1])));
  if (keys.length) {
    const readme = readFileSync('README.md', 'utf8');
    const missing = keys.filter((k) => !readme.includes(k));
    if (missing.length) {
      console.error('Docs guard: README is missing env var docs for:', missing.join(', '));
      process.exit(1);
    }
  }
} catch (err) {
  // If env.ts is missing, skip this check (not applicable to this repo)
}
