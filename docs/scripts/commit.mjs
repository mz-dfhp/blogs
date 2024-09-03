import { execSync } from 'node:child_process'

execSync('git add .');
execSync('git commit -m "feat: update"');
execSync('git push');
