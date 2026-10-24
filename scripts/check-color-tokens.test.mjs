import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanText } from './check-color-tokens.mjs';

const scan = (text, file = 'src/unknown.css') => scanText(text, file);

const RANK_FILE = 'features/profit-sharing/dashboard/ProfitDashboard.css';
const HERO_FILE = 'features/auth/pages/LoginPage.css';

test('hex colours are reported', () => {
  const { found } = scan('.a {\n  color: #333;\n}');
  assert.equal(found.length, 1);
  assert.equal(found[0].line, 2);
  assert.equal(found[0].literal, '#333');
});

test('rgb / rgba / hsl are reported', () => {
  const { found } = scan('a { background: rgba(0, 0, 0, 0.5); }\nb { color: hsl(1 2% 3%); }');
  assert.deepEqual(
    found.map((row) => row.literal),
    ['rgba(0, 0, 0, 0.5)', 'hsl(1 2% 3%)']
  );
});

test('css variables are not reported', () => {
  assert.equal(scan('a { color: var(--ant-color-text); }').found.length, 0);
});

test('color-mix over a variable is not reported', () => {
  const line =
    'a { box-shadow: 0 8px 20px color-mix(in srgb, var(--ant-color-primary) 20%, transparent); }';
  assert.equal(scan(line).found.length, 0);
});

test('a literal next to a variable is still reported', () => {
  const { found } = scan(
    'a { background: linear-gradient(135deg, #fff 0%, var(--ant-color-bg-container) 100%); }'
  );
  assert.equal(found.length, 1);
  assert.equal(found[0].literal, '#fff');
});

test('a hex in a comment is not a colour', () => {
  assert.equal(scan('// PR #321 修过一次\nconst a = 1;').found.length, 0);
});

test('allowlisted values in an allowlisted file are exempt', () => {
  const { found, exempted } = scan(`.profit-rank-1 { background: #f59e0b; }`, RANK_FILE);
  assert.equal(found.length, 0);
  assert.equal(exempted.length, 1);
});

test('a new colour in an allowlisted file is still reported', () => {
  const { found } = scan('.profit-rank-1 { background: #123456; }', RANK_FILE);
  assert.equal(found.length, 1);
  assert.equal(found[0].literal, '#123456');
});

test('allow: all exempts the whole file', () => {
  const { found, exempted } = scan('.hero { background: #07101e; color: rgba(1, 2, 3, 0.4); }', HERO_FILE);
  assert.equal(found.length, 0);
  assert.equal(exempted.length, 2);
});
