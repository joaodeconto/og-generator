import { execSync } from 'node:child_process';

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
