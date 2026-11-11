# Admin 颜色规则（供 AI Agent 执行）

> 适用：`apps/admin` 内所有 TSX / CSS，基于 `antd@6.1.4`。
> 本文只列规则，不含理由与示例。理由与背景见 [color-conventions.md](./color-conventions.md)。
> 状态：规则已定稿，尚未落地；整改范围见 [color-audit.md](./color-audit.md)。

## 1. 决策流程（每写一处颜色，按顺序执行）

1. antd 官方组件有表达该含义的原生属性 → 使用原生属性，不写颜色，结束（对照表见第 6 节）。
2. 判断该颜色在此处的任务：
   - 表达好 / 需注意 / 坏 → A 类。
   - 表达可交互 / 当前选中 → B 类。
   - 表达信息主次或容器层次 → C 类。
   - 区分并列的东西（并列卡片、图表系列、类型） → D 类。
   - 必须保持原样的品牌色 → E 类。
   - 没有任务（例如给静态数字涂主色以“突出”） → 不写颜色，结束。
3. 按第 2 节对应类别的规则取值。
4. 按第 3 节决定写在 CSS 还是 TSX。
5. 用第 7 节清单自查。

## 2. 五类颜色

### A 状态色

使用条件：同时满足 (1) 读者据此得出好 / 需注意 / 坏的判断；(2) 该判断由数据或状态决定。不满足则不得使用。

| 语义 | 适用 |
| --- | --- |
| success | 已完成、已通过、正常 |
| warning | 待处理、需留意、还可挽回 |
| error | 已失败、被拒绝、不可逆 |
| info | 提示、进行中 |

| 角色 | TSX | CSS |
| --- | --- | --- |
| 图标、圆点、线条、填充 | `token.colorSuccess` / `colorWarning` / `colorError` / `colorInfo` | `var(--ant-color-success)` / `-warning` / `-error` / `-info` |
| 淡底色块 | `token.colorXxxBg` | `var(--ant-color-xxx-bg)` |
| 色块边框 | `token.colorXxxBorder` | `var(--ant-color-xxx-border)` |

- 状态色块内的正文使用默认中性色，不使用状态色。
- 需要状态色块时使用 `Alert`，不手写。
- 不使用 `Hover` / `Active` / `Text` / `TextHover` / `TextActive` 变体表示静态颜色。
- `colorInfo` 同样必须满足上述使用条件，不得当作“另一种蓝”。优先使用官方组件（`Alert type="info"`、`Tag color="processing"`、`Badge status="processing"`，它们渲染的就是 `colorInfo`）；仅当手写元素需要与这些原生 info 外观一致时才使用 `colorInfo` / `colorInfoBg` / `colorInfoBorder`。不使用 `colorPrimary` 表达 info。
- 条件着色由数据驱动，写在 TSX。

### B 交互色

适用：链接、选中的行或选项、当前菜单或 Tab、焦点、悬停高亮、主按钮。

| 角色 | TSX | CSS |
| --- | --- | --- |
| 链接文字 | `token.colorLink` | `var(--ant-color-link)` |
| 选中 / 当前 | `token.colorPrimary` | `var(--ant-color-primary)` |
| 选中的淡底 | `token.colorPrimaryBg` | `var(--ant-color-primary-bg)` |
| 选中的边框 | `token.colorPrimaryBorder` | `var(--ant-color-primary-border)` |

- 不对静态数字、静态标题使用 `colorPrimary`。强调使用 `<Text strong>`。
- 不使用 `colorPrimaryHover` / `colorPrimaryActive` 表示静态颜色。
- 图标前缀不单独上色，跟随文字颜色。

### C 中性色

每个角色只使用下表列出的名字。

| 角色 | TSX | CSS |
| --- | --- | --- |
| 正文 | 不写（默认） | 不写（默认） |
| 次要内容（比正文浅，仍属内容） | `token.colorTextSecondary` | `var(--ant-color-text-secondary)` |
| 说明 / 备注 / 时间文字 | `token.colorTextDescription` | `var(--ant-color-text-description)` |
| 空值 / 弱提示（如“-”） | `token.colorTextQuaternary` | `var(--ant-color-text-quaternary)` |
| 实心色块上的文字 | `token.colorTextLightSolid` | `var(--ant-color-text-light-solid)` |
| 页面底 | `token.colorBgLayout` | `var(--ant-color-bg-layout)` |
| 卡片、面板底 | `token.colorBgContainer` | `var(--ant-color-bg-container)` |
| 浮层底 | `token.colorBgElevated` | `var(--ant-color-bg-elevated)` |
| 弱填充 | `token.colorFillQuaternary` / `colorFillTertiary` / `colorFillSecondary`（由弱到强） | `var(--ant-color-fill-quaternary)` / `-tertiary` / `-secondary` |
| 内容区分割线 | `token.colorSplit` | `var(--ant-color-split)` |
| 容器外轮廓（卡片、标签页） | `token.colorBorderSecondary` | `var(--ant-color-border-secondary)` |
| 控件边框 | `token.colorBorder` | `var(--ant-color-border)` |
| 阴影 | `token.boxShadow` / `boxShadowSecondary` / `boxShadowTertiary` | `var(--ant-box-shadow)` / `-secondary` / `-tertiary` |

- 不使用 `colorTextTertiary`、`colorWhite`、`colorTextBase`、`colorBgBase`。
- `Text type="secondary"` 渲染的是 `colorTextDescription`，不是 `colorTextSecondary`。需要“说明文字”档位时用 `Text type="secondary"` 或 `colorTextDescription`；需要“次要内容”档位时用 `colorTextSecondary`。两者不得互相机械替换。
- 不自行给禁用控件上色。
- 阴影不得手写 `color-mix` 或 `rgba`。

### D 分类色

取值顺序：

1. 存在语义真正吻合的 token 才使用该 token。不得因颜色相近而使用。
2. 否则使用 antd 色板（`@ant-design/colors` 生成，经 antd 主题暴露）。

色板取值规则：

- 必须带色阶数字。TSX：`token.<名字><数字>`；CSS：`var(--ant-<名字>-<数字>)`。
- 禁止不带数字的写法（`token.blue`、`var(--ant-blue)`）。
- 禁止直接 `import` `@ant-design/colors`。
- 主色用色阶 `6`，淡底用 `1`，边框用 `3`。带底色的分类小块 = 底 `1` + 边 `3` + 前景 `6`。
- 图表系列、图例、tooltip、表格中同一概念使用同一颜色。

轮流顺序（12 色，不含 red）：

```
blue → purple → cyan → green → magenta → pink → orange → yellow → volcano → geekblue → lime → gold
```

- 第 n 个系列取第 n 种，用完从头循环。
- `red` 不进入轮流。
- 固定指派：「扣除」使用 `red6`（TSX `token.red6`，CSS `var(--ant-red-6)`）。固定指派的颜色在同一视图的轮流中跳过。
- 固定指派登记在同一个文件中，不在组件中各自定义。
- 分类色不得用状态 token 代替，状态色不得用分类色代替，即使二者数值相同。`green*` / `gold*` / `orange*` 为分类色，`colorSuccess` / `colorWarning` 为状态色。
- 文件夹等“黄色”分类使用 `gold`，不使用 `colorWarning`。
- 并列的指标卡每张一种色相：渐变 `<色相>-1` → `colorBgContainer`，边框 `<色相>-3`，数值 `<色相>-6`；CSS 类名使用色相名。
- 头像底色、发言人颜色等“区分个体”的颜色属于 D 类，取轮流色板。

### E 固定品牌色

- 十六进制只允许出现在：第三方品牌色映射、登录页固定深色视觉面。
- 集中定义在同一个常量文件，注明来源；不得在多个文件重复定义。
- 登录页保持现状，不纳入本规则。

## 3. CSS 与 TSX 的写法

### 3.1 名字对应

- TSX 使用 `theme.useToken()` 返回的 `token.xxx`（驼峰）。
- CSS 使用 `var(--ant-xxx)`：驼峰拆成短横线，前缀 `--ant-`。数字前加短横线（`blue6` → `--ant-blue-6`）。

### 3.2 写在哪里

| 情形 | 位置 |
| --- | --- |
| 颜色固定不变 | CSS 类 |
| 颜色随数据变化（条件着色、按系列取色） | TSX，使用 `token.xxx` |
| SVG `fill` / `stroke` / `stopColor` | 固定的写 CSS 类；随数据变的在 TSX 用 `token.xxx` |

- 不为静态颜色新增 `theme.useToken()`。
- 文字灰度类颜色优先使用 CSS 类（工具类见第 8 节）。

### 3.3 CSS 变量的可用范围

- `--ant-*` 只在 antd 组件的子树内可用（弹窗、抽屉、下拉内容同样可用）。
- 不在 `html`、`body`、`#root` 及 antd 组件之外的元素上使用 `--ant-*`。全局默认色挂在 `.ant-layout` 上。

### 3.4 混色与透明

- 使用 `color-mix(in srgb, <颜色> N%, transparent)`。
- 不使用 `rgba()`、`rgb()`、`hsl()`，不在十六进制后拼透明度。
- 有现成淡色 token（`Bg`、`Fill*`）时不混色。

### 3.5 渐变

渐变色标只能是以下组合之一：

1. 同一色板的不同色阶（如 `gold-1` → `gold-3`）。
2. 中性 token 之间。
3. `colorPrimaryBg` → `colorBgContainer`。

- 允许配合 `color-mix`。
- 不手写色值，不使用状态色做装饰渐变。

### 3.6 SVG 图表

- 坐标轴、网格线：`colorSplit`；刻度文字：`colorTextDescription`。
- 悬停高亮：`colorPrimary`。
- 系列填充 / 线条：D 类色板。

### 3.7 覆盖 antd 样式

- 改某个 antd 组件自身的颜色：在组件外包 `ConfigProvider`，设置 `theme.components.<组件>` 组件 token。
- 给 antd 组件内部某部分上色：使用 antd 6 的 `classNames` / `styles` 插槽，类名写自己的，颜色写在 CSS。
- 改全站主题：只在 `ThemeProvider` 修改。
- 不使用 antd 内部选择器（如 `.ant-statistic-content`）改色。
- 不使用 `!important` 改色。

### 3.8 允许的非 token 值

CSS 中 `transparent`、`inherit`、`currentColor` 允许使用。颜色关键字（`red`、`white` 等）与任何色值不允许（E 类除外）。

## 4. token 层级

- 不使用 Seed 层 token：不带数字的预设色（`blue`、`purple` 等）、`colorTextBase`、`colorBgBase`。
- 同一角色只使用第 2 节表中的名字，并与 antd 原生同角色元素保持一致。

## 5. 状态色与分类色对照（避免误用）

| 想表达 | 使用 | 不使用 |
| --- | --- | --- |
| 待结算、待处理 | `colorWarning`（条件着色） | `gold6` |
| 已结清、已完成 | `colorSuccess`（条件着色） | `green6` |
| 失败、被拒绝 | `colorError` | `red6` |
| 提示、进行中 | `colorInfo`（优先官方组件） | `colorPrimary`、`blue6` |
| 扣除金额 | `red6` | `colorError` |
| 订单提成、奖金、津贴、底薪等分类 | D 类色板 | 任何状态 token |
| 文件类型、成员类型、对象类型 | D 类色板 | 任何状态 token |

## 6. 官方组件优先

| 想表达 | 使用 |
| --- | --- |
| 次要 / 成功 / 警告 / 错误文字 | `Text type="secondary"` / `"success"` / `"warning"` / `"danger"` |
| 警示、提示块 | `Alert`（`type` 取 success / info / warning / error，带 `showIcon`） |
| 操作成功页 | `Result status="success"` |
| 状态标签 | `Tag color="success"` / `"warning"` / `"error"` / `"processing"` / `"default"` |
| 区分类别的标签 | `Tag color="<预设色名>"` |
| 状态圆点 | `Badge status="success"` / `"warning"` / `"error"` / `"processing"` |
| 进度条状态 | `Progress status="success"` / `"exception"` |
| 危险 / 破坏性按钮（含“停用”） | `Button danger` 或 `color="danger"` |
| 描边 / 虚线强调按钮 | `Button color="primary" variant="dashed"` 等 |
| 确认弹窗的警告图标 | `Modal.confirm` 默认图标，不传 `icon` |
| 复制后的“已复制”反馈 | `Text copyable` |
| 统计标题 | `Statistic` 自带，不覆盖颜色 |
| 统计数值带色相 | `classNames.content` 挂类，颜色写 CSS；不使用 `valueStyle` |
| 单选选中态带语义色 | `ConfigProvider` 设置 `Radio` 的 `buttonSolidCheckedBg` / `buttonSolidCheckedHoverBg` / `buttonSolidCheckedActiveBg` |
| 头像 | `Avatar`，底色取 D 类色板 |
| 卡片无边框 | `Card variant="borderless"`（不使用已废弃的 `bordered`） |

- 操作按钮（计算、启用、发薪等）不着色，使用默认样式。
- 使用 `colorTextDescription` 或 `Text type="secondary"` 之前，先确认目标档位（见第 2 节 C 类）。

## 7. 提交前自查

- [ ] 没有 `#xxxxxx`、`rgb()`、`rgba()`、`hsl()`、颜色关键字（E 类与登录页除外）。
- [ ] 没有不带数字的预设色名（`token.purple`、`var(--ant-cyan)` 等）。
- [ ] 状态 token 只出现在由数据 / 状态决定的位置。
- [ ] 分类、图表、卡片色相使用带数字的色板，而非状态 token。
- [ ] `colorPrimary` 没有用于静态强调。
- [ ] 中性色使用的是第 2 节 C 类表中的名字；没有 `colorTextTertiary`、`colorWhite`。
- [ ] 能用官方组件原生属性的地方没有手写颜色。
- [ ] 静态颜色在 CSS，数据驱动的颜色在 TSX。
- [ ] 没有在 antd 之外的元素使用 `--ant-*`。
- [ ] 没有用 `!important` 改色，没有使用 antd 内部选择器改色。
- [ ] 渐变色标符合 3.5。
- [ ] 同一概念在表格、图表、图例、tooltip 中颜色一致。
- [ ] PR 描述注明每处新增颜色所属类别（A–E）。
- [ ] 已切换暗色主题目视检查。

## 8. 配套基础设施（待创建；创建前不得在组件内自行替代）

| 文件 / 位置 | 内容 |
| --- | --- |
| `src/shared/theme/chartPalette.ts` | `useChartPalette()` 返回第 2 节 D 类的 12 色（`<名字>6`）；登记固定指派（如 扣除 → `red6`）；`getSeriesColor(key)` 按概念取色 |
| `src/shared/theme/brand-colors.ts` | E 类全部十六进制常量，附来源注释 |
| `src/index.css` | 工具类 `.text-secondary`、`.text-description`、`.text-quaternary`，分别对应 `var(--ant-color-text-secondary)`、`var(--ant-color-text-description)`、`var(--ant-color-text-quaternary)` |
