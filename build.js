import { execSync } from 'child_process';
import { performance } from 'perf_hooks';

// ANSI colors
const c = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const args = process.argv.slice(2);
const isCheckMode = args.includes('--check');
const modeLabel = isCheckMode ? 'Check' : 'Build';

const steps = [
  { name: 'Type Check', command: 'tsc --noEmit --pretty', executable: true },
  { name: 'Lint', command: 'eslint . --ext .ts', executable: true },
  { name: 'Format Check', command: 'prettier --check .', executable: true },
  { name: 'Tests', command: 'NODE_ENV=testing vitest run', executable: true },
  { name: 'Build', command: 'tsup', executable: !isCheckMode },
];

let success = true;
const results = [];

if (isCheckMode) {
  console.log(`\n${c.yellow}${c.bold}Checking build compatibility...${c.reset}\n`);
} else {
  console.log(`\n${c.yellow}${c.bold}Starting build process...${c.reset}\n`);
}

for (const step of steps) {
  if (!step.executable) {
    continue;
  }

  const startTime = performance.now();
  console.log(`${c.cyan}Running: ${step.name}${c.reset}`);
  console.log(`  Command: ${step.command}\n`);

  try {
    execSync(step.command, { stdio: 'inherit', encoding: 'utf-8' });

    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log(`\n${c.green}OK${c.reset} ${step.name} (${duration}s)\n`);
    results.push({ step: step.name, status: 'success', duration });
  } catch (error) {
    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
    console.error(`\n${c.red}FAILED${c.reset} ${step.name} (${duration}s)\n`);
    results.push({ step: step.name, status: 'failed', duration });
    success = false;
    break;
  }
}

console.log('\n' + '='.repeat(50));
console.log(`${c.yellow}${c.bold}${modeLabel} Summary${c.reset}`);
console.log('='.repeat(50) + '\n');

results.forEach((r) => {
  const indicator = r.status === 'success' ? `${c.green}OK${c.reset}` : `${c.red}FAIL${c.reset}`;

  console.log(`${indicator}  ${r.step.padEnd(20)} ${r.duration}s`);
});

const totalTime = results.reduce((sum, r) => sum + parseFloat(r.duration), 0).toFixed(2);

console.log('\n' + '-'.repeat(50));
console.log(`${c.blue}Total time:${c.reset} ${totalTime}s`);
console.log('='.repeat(50) + '\n');

if (success) {
  console.log(`${c.green}${c.bold}${modeLabel} completed successfully!${c.reset}\n`);
  if (isCheckMode) {
    console.log(`${c.green}${c.bold}Code Ready to build!${c.reset}\n`);
  }
  process.exit(0);
} else {
  console.log(`${c.red}${c.bold}${modeLabel} failed!${c.reset}\n`);
  process.exit(1);
}
