#!/usr/bin/env node
/**
 * 色彩闸门：禁止在 Admin 源码里新增颜色字面量。
 *
 * 颜色必须来自 Ant Design 的 CSS 变量（var(--ant-*)），或由变量组合而成，
 * 例如 color-mix(in srgb, var(--ant-color-primary) 20%, transparent)。
 * 这样以后加主题时才有唯一真源可换。
 *
 * 现存例外写在下面的 ALLOW 里，不散落到源码中：放宽规则必须改这个文件，
 * 于是每次例外都会出现在 diff 里。allow 给 'all' 表示整文件豁免（品牌资产），
 * 给数组表示只放行这几个具体色值——同文件里再出现别的色值一样会失败。
 *
 * 用法：node scripts/check-color-tokens.mjs [--verbose]
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'apps', 'admin', 'src');

const SOURCE_EXT = /\.(css|tsx?)$/;
const SKIP_FILE = /\.(test|spec)\.tsx?$/;
const SKIP_DIR = new Set(['node_modules', 'dist', 'coverage']);

/** 十六进制、rgb()/rgba()、hsl()/hsla() 都算字面量。 */
const LITERAL = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)/g;

const AVATAR_PALETTE = ['#3370ff', '#00a870', '#ff8800', '#7b61ff', '#e65050', '#14a9a0'];

/** 迁移阶段确认过的例外。新增条目请写清理由。 */
const ALLOW = {
  // 登录页左侧品牌卡面：刻意恒暗，不随主题变化
  'features/auth/pages/LoginPage.css': { allow: 'all', reason: '品牌恒暗卡面' },
  'features/auth/pages/LoginPage.tsx': {
    allow: ['#38bdf8', '#60a5fa', '#2dd4bf'],
    reason: '品牌卡面连接线渐变',
  },
  // 外部平台品牌本色
  'features/organization/platform-users/PlatformUserManagement.tsx': {
    allow: ['#3370ff', '#07c160', '#ff6a00', '#2d8cff', '#464eb8', '#00bceb', '#00a4ff', '#8f959e'],
    reason: '平台品牌本色',
  },
  // 实色底 + 白字，深浅主题下都成立
  'features/organization/components/PersonAvatar.tsx': { allow: AVATAR_PALETTE, reason: '头像色板' },
  'features/organization/members/RoleManagement.tsx': { allow: AVATAR_PALETTE, reason: '头像色板' },
  'features/organization/members/OrgMemberManagement.tsx': {
    allow: AVATAR_PALETTE,
    reason: '头像色板',
  },
  'features/minutes/pages/MinuteDetail.tsx': {
    allow: ['#4263b5', '#087f8c', '#8752a1', '#b56527', '#27805b', '#b34f72'],
    reason: '演讲人色板',
  },
  // 金/银/铜/灰四档名次徽标：antd 没有对应色阶，且徽标上是白字
  'features/profit-sharing/dashboard/ProfitDashboard.css': {
    allow: ['#f59e0b', '#94a3b8', '#d97706', '#cbd5e1'],
    reason: '名次徽标配色',
  },
};

const isAllowed = (file, literal) => {
  const rule = ALLOW[file];
  if (!rule) return false;
  if (rule.allow === 'all') return true;
  return rule.allow.includes(literal.toLowerCase());
};

/** 注释里的十六进制串（例如 PR 号 `#321`）不是颜色。 */
const stripComments = (line) => line.replace(/\/\*.*?\*\//g, ' ').replace(/\/\/.*$/, ' ');

export function scanText(text, filename = '<memory>') {
  const found = [];
  const exempted = [];

  text.split('\n').forEach((line, index) => {
    const literals = [...stripComments(line).matchAll(LITERAL)].map((m) => m[0]);
    if (!literals.length) return;

    for (const literal of literals) {
      const row = { file: filename, line: index + 1, literal, snippet: line.trim().slice(0, 100) };
      (isAllowed(filename, literal) ? exempted : found).push(row);
    }
  });

  return { found, exempted };
}

export function collectFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIR.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectFiles(full, acc);
      continue;
    }
    if (SOURCE_EXT.test(entry) && !SKIP_FILE.test(entry)) acc.push(full);
  }
  return acc;
}

export function check(root = SRC) {
  const violations = [];
  const exempted = [];
  const files = collectFiles(root);

  for (const file of files) {
    const rel = relative(SRC, file).split(sep).join('/');
    const { found, exempted: ex } = scanText(readFileSync(file, 'utf8'), rel);
    violations.push(...found);
    exempted.push(...ex);
  }

  return { violations, exempted, fileCount: files.length };
}

function main() {
  const { violations, exempted, fileCount } = check();

  if (process.argv.includes('--verbose')) {
    for (const row of exempted) console.log(`  exempt  ${row.file}:${row.line}  ${row.literal}`);
  }

  if (violations.length) {
    console.error(`\n✗ 发现 ${violations.length} 处颜色字面量（扫了 ${fileCount} 个文件）：\n`);
    for (const row of violations) {
      console.error(`  apps/admin/src/${row.file}:${row.line}`);
      console.error(`      ${row.literal}    ${row.snippet}`);
    }
    console.error(
      '\n颜色请改用 Ant Design 变量，例如 var(--ant-color-text-secondary)。' +
        '\n确有例外时，把具体色值和理由加进 scripts/check-color-tokens.mjs 的 ALLOW 表。\n'
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `✓ 无新增颜色字面量（扫了 ${fileCount} 个文件，豁免 ${exempted.length} 处已登记的例外）`
  );
}

if (process.argv[1] && process.argv[1].endsWith('check-color-tokens.mjs')) {
  main();
}
