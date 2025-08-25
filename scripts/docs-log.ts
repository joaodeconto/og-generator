import { writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const date = new Date().toISOString().slice(0, 10);
mkdirSync(`docs/log`, { recursive: true });
const summary = execSync('git log -1 --pretty=%B').toString().trim();
const body = `# ${date}\n\n## Summary\n- ${summary}\n\n## Changed\n- (add details)\n`;
writeFileSync(`docs/log/${date}.md`, body, { flag: 'a' });
