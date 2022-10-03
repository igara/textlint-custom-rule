import path from 'path';
import process from 'process';
import TextLintTester from 'textlint-tester';

import rule from '../src/index';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const validTSX = fs.readFileSync(
  path.join(process.cwd(), './test/inputs/valid.tsx'),
  { encoding: 'utf-8' }
);
const invalidTSX = fs.readFileSync(
  path.join(process.cwd(), './test/inputs/invalid.tsx'),
  { encoding: 'utf-8' }
);

const tester = new TextLintTester();

tester.run('rule', rule, {
  valid: [
    {
      text: validTSX,
    },
  ],
  invalid: [
    {
      text: invalidTSX,
      errors: [
        {
          message: `下さい -> ください`,
        },
        {
          message: `\\. -> 。`,
        },
      ],
    },
  ],
});
