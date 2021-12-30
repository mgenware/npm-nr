import * as assert from 'assert';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

function splitString(str: string): string[] {
  return str.split(/\r?\n/);
}

function checkStrings(a: string[], b: string[]) {
  assert.deepStrictEqual(a, b);
}

async function t(args: string, expected: string, hasError?: boolean): Promise<void> {
  try {
    let cmd = 'node "./dist/main.js" testPrintArgs';
    if (args) {
      cmd += ` ${args}`;
    }
    const output = await execAsync(cmd);
    const outputString = output.stdout;
    // Split output into lines to avoid newline difference among different platforms.
    // Skip the 2 lines (which are an empty line followed by `npm-nr@<version> r`).
    const actualLines = splitString(outputString).slice(2);
    checkStrings(actualLines, splitString(expected));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (hasError) {
      // Split output into lines to avoid newline difference among different platforms.
      checkStrings(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        splitString(typeof err.stdout === 'string' ? err.stdout : ''),
        splitString(expected),
      );
    } else {
      throw err;
    }
  }
}

it('No args', async () => {
  await t(
    '',
    `> node ./dist_tests/printArgs.js

[]
`,
  );
});

it('Args', async () => {
  await t(
    '--a b -c d --e',
    `> node ./dist_tests/printArgs.js "--a" "b" "-c" "d" "--e"

[ '--a', 'b', '-c', 'd', '--e' ]
`,
  );
});
