#!/usr/bin/env node
import spawn from './spawn.js';

const processArgs = process.argv.slice(2);
const script = processArgs[0];
const args = processArgs.slice(1);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await spawn(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    script ? ['run', script, '--', ...args] : ['run'],
  );
})();
