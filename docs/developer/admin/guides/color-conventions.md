# Admin 颜色指定规则（草案，待审定）

> 状态：**草案**，只定规则，不含任何代码改动。规则审定之后，才会按 [整改清单](./color-audit.md) 动手。
> 范围：`apps/admin` 里所有 TSX 和 CSS。技术基础：`antd@6.1.4`，亮 / 暗主题由 `ThemeProvider` 切换。
> 文中凡是写「实测」的，都是在本项目的页面里读取真实运行值得到的，不是推测。

---

## 0. 先读这一页

### 一句话

**antd 颜色的名字描述的是「含义」，不是「颜色」。** `colorWarning` 的意思是「警告」，不是「黄色」。你写下哪个名字，就是在对读者、对主题声明这个含义。

### 写任何颜色之前，按顺序问三个问题

```
问题 1：antd 官方组件有没有现成的属性能表达这个含义？
        例如 <Text type="danger">、<Alert type="warning">、<Button danger>、<Badge status="success">
        ├─ 有 → 用它，不写任何颜色。到此结束。
        └─ 没有 → 问题 2

问题 2：这个颜色在这里承担什么任务？
        ├─ 表达含义（好坏、可交互）            → 问题 3（A / B 类）
        ├─ 区分并列的东西（并列的卡片、系列、类型）→ 问题 3（D 类）
        └─ 没有任务（例如给静态数字涂主色来“突出”）→ 不写颜色，用默认。到此结束。

问题 3：它属于哪一类？（见第 2 节，共 5 类）
        A 状态   B 交互   C 中性层级   D 分类 / 图表   E 固定品牌色
        → 按该类的写法来，TSX 和 CSS 的具体写法见第 3 节
```

### TSX 与 CSS 的写法，各一句话

- **CSS**：写 `var(--ant-color-xxx)`。
- **TSX**：写 `token.colorXxx`（来自 `theme.useToken()`），只在颜色要随数据变化时才写进 TSX；静态颜色一律放 CSS 类里。
- 两边用的是**同一套名字**，只是写法不同：`token.colorTextSecondary` ⇔ `var(--ant-color-text-secondary)`（驼峰换成短横线，前面加 `--ant-`）。

### 三条红线

1. 不手写色值（`#fff`、`rgb()`、`rgba()`），第 2 节 E 类除外。
2. 不为了「好看」借用状态色（success / warning / error）。
3. 不用没有数字的色板名（`token.purple`、`var(--ant-purple)`），它在暗色下不会变。

---

## 1. 需要知道的背景（读完就能理解规则为什么这样定）

### 1.1 antd 的颜色分三层

```
种子色（几个基础颜色，如蓝 #1677ff）
   ↓ 算法（亮色算法 / 暗色算法）
token（一批有名字的颜色，如 colorPrimary、colorTextSecondary、colorWarningBg）
   ↓ 自动生成
CSS 变量（--ant-color-primary、--ant-color-text-secondary、--ant-color-warning-bg）
```

- 切换亮 / 暗主题时，antd 重新算一遍 token，所有 token 和 CSS 变量**一起变**。所以只要写的是 token 名，就自动适配主题；写死的色值不会变。
- token 名字和 CSS 变量名一一对应：把驼峰拆成短横线，前面加 `--ant-`。
  `colorWarningBg` → `--ant-color-warning-bg`；`blue6` → `--ant-blue-6`；`boxShadowTertiary` → `--ant-box-shadow-tertiary`。

### 1.2 为什么要「按含义选」，而不是「按颜色选」

假设某天品牌方要求把警告色改成橙红。如果「单月最高收入」这个数字用了 `colorWarning`（只是想要黄色），它会跟着变成橙红，读者会以为这个数字出了问题。反过来，如果它根本没写颜色，就什么都不会发生。**写下的每个语义 token，都是一份将来要负责的承诺。**

### 1.3 CSS 变量在哪里能用（实测）

antd 的 CSS 变量**不是**定义在 `html` 或 `body` 上，而是定义在 antd 组件根元素（带 `css-var-…` 这个类名的元素）上，再被子元素继承。实测：`html`、`body`、`#root` 上读不到 `--ant-…`，`.ant-layout` 上能读到。

规则含义：

- 页面内容里的 CSS（包括弹窗、抽屉、下拉里的内容，它们也在 antd 组件里）可以放心用 `var(--ant-…)`。
- **不要**在 `html`、`body`、`#root`、或任何不在 antd 组件里面的元素上使用 `var(--ant-…)`，读不到。需要全局默认色时，像现在 `index.css` 那样挂在 `.ant-layout` 上。
- 如果某段内容被渲染到 antd 之外（例如第三方库自己挂到 `body` 的浮层），那里不能用 `--ant-…`，需要时通过组件的 props 或 `ConfigProvider` 解决。

### 1.4 暗色下：「带数字」的色板才会变（实测）

antd 的预设色板（蓝、紫、青、金、绿、红……）有两种写法，行为不同：

| 写法 | 例子 | 亮色 | 暗色 | 结论 |
| --- | --- | --- | --- | --- |
| 不带数字（种子色） | `token.blue` / `--ant-blue` | `#1677FF` | `#1677FF` | **不变，禁用** |
| 带数字（色阶 1–10） | `token.blue6` / `--ant-blue-6` | `#1677ff` | `#1668dc` | **会变，可用** |

现在代码里有 22 处 `token.purple` / `token.cyan` 这类不带数字的写法，在暗色下颜色没有被调整。这是规则 5.3 要杜绝的。

### 1.5 antd 色阶 1–10 各是什么

同一个颜色的 10 个色阶，亮暗各有一套。本项目只需要记住下面三个编号（实测，亮暗两套都成立）：

| 色阶 | 用途 | 对应的状态 token（实测，亮暗成立） |
| --- | --- | --- |
| 1 | 淡底色 | `colorXxxBg` = 色阶 1 |
| 3 | 边框 | `colorXxxBorder` = 色阶 3 |
| 6 | 主色（图标、填充、线条） | `colorXxx` = 色阶 6 |

其余编号（2、4、5、7 ……）是 antd 给悬停、按下等交互态用的，我们不直接使用。

所以「分类色」要做一个带底色的小块时，直接用同样的配方：**底 1、边 3、前景 6**。例如 `--ant-gold-1` / `--ant-gold-3` / `--ant-gold-6`，它和 antd 自己的警告块是同一种结构，亮暗都成立。

### 1.6 选哪一层的 token

antd 的 token 实际分三层，名字越往下越「具体」：

| 层 | 是什么 | 例子 |
| --- | --- | --- |
| Seed（种子） | 算法的**输入** | 不带数字的 `blue`、`purple`，以及 `colorTextBase`、`colorBgBase` |
| Map（映射） | 算法的**产出**，随亮暗主题变化 | `colorTextSecondary`、`colorPrimaryBg`、`colorBorderSecondary`、带数字的 `blue6` |
| Alias（别名） | 在 Map 之上，为某个具体场景起的名字 | `colorTextDescription`、`colorSplit`、`colorTextLightSolid`、`boxShadow` |

**选择原则：**

1. **不直接用 Seed 层。** 它是输入，不保证随主题变化（1.4 的实测就是这一层的表现）。
2. **同一个角色只用一个名字，并与 antd 原生同角色的元素保持一致。** 具体用哪个，以第 2 节 C 类的表格为准，不在同义的几个名字之间随意混用。例如「说明文字」用 `colorTextDescription`（`Text type="secondary"`、`Statistic` 标题用的就是它），「分割线」用 `colorSplit`（`Divider`、`Modal` 等用的就是它）。

---

## 2. 五类颜色

每类都回答四件事：它是什么、怎么判断是不是它、TSX 和 CSS 怎么写、什么不能做。

### A. 状态色：表达「好 / 需注意 / 坏」

**是什么**：对一个结果、状态、风险的评价。

**判断它是 A 类，必须同时满足两条：**

1. 读者看到这个颜色，会得出好、需注意或坏的判断；
2. 这个判断**由数据或状态决定**，不是写代码的人挑的。

满足的例子：`待发金额 > 0` 时标 warning、`0` 时标 success；失败的行标 error；被拒绝（DENY）标 error。
不满足的例子：「单月最高收入」常亮 warning（它不是警告）；「订单提成」画成 success 绿（它不是成功）；「文件夹」图标用 warning 黄（它不是警告）。

**三种语义怎么分：**

| 语义 | 用在 | 例子 |
| --- | --- | --- |
| success | 已完成、已通过、正常 | 已结清、已启用、校验通过 |
| warning | 待处理、需留意、还可挽回 | 待结算、即将过期、密钥只显示一次 |
| error | 已失败、被拒绝、不可逆 | 失败、拒绝、删除 |

「提示信息（info）」不单独定规则，直接用 `Alert type="info"` 或 `Tag color="processing"`。当前主题没有自定义种子色，`colorInfo` 与 `colorPrimary` 同色（实测均为 `#1677ff`），没有额外价值。

**各个变体什么时候用（以 success 为例，warning、error 同理）：**

| 角色 | TSX | CSS |
| --- | --- | --- |
| 图标、圆点、线条、填充 | `token.colorSuccess` | `var(--ant-color-success)` |
| 淡底色块 | `token.colorSuccessBg` | `var(--ant-color-success-bg)` |
| 色块边框 | `token.colorSuccessBorder` | `var(--ant-color-success-border)` |
| 色块里的正文 | **不用状态色，用中性色**（`colorText`，默认即可） | 同左 |

底色块 = 淡底 + 边框 + 状态色图标 + 中性正文，这正是 antd `Alert` 自己的结构。**需要这种块时，直接用 `Alert`，不要手写。**

> 不要用 `Hover` / `Active` / `TextHover` / `TextActive` 变体来表示静态颜色，它们是给交互状态用的，由 antd 组件自己使用。

**注意**：「扣除」金额**不是**状态（它不是失败，也不是被拒绝），不使用 error，见 D 类。

### B. 交互色：表达「可以点 / 当前选中」

**是什么**：`colorPrimary` 系列。它的含义是「这里有交互」或「这是当前项」，**不是「这个很重要」**。

**可以用的场景**：链接、选中的行或选项、当前的菜单或 Tab、焦点、悬停高亮、主按钮。

| 角色 | TSX | CSS |
| --- | --- | --- |
| 链接文字 | `token.colorLink` | `var(--ant-color-link)` |
| 选中 / 当前的主色 | `token.colorPrimary` | `var(--ant-color-primary)` |
| 选中的淡底 | `token.colorPrimaryBg` | `var(--ant-color-primary-bg)` |
| 选中的边框 | `token.colorPrimaryBorder` | `var(--ant-color-primary-border)` |

**不能做**：给一个静态数字、静态标题涂 `colorPrimary` 来「突出」。突出用 `<Text strong>`（加粗）。图标前缀默认不上色，跟随文字。
`colorPrimaryHover` / `colorPrimaryActive` 是按下和悬停态，不能当静态颜色用。

### C. 中性色：表达「信息的主次」和「容器的层次」

**是什么**：文字深浅、背景、填充、分割线。这类颜色没有语义，只表达层级。**每个角色只有一个正确的名字**：

| 角色 | TSX | CSS | 说明 |
| --- | --- | --- | --- |
| 正文 | （默认，不用写） | （默认，不用写） | `colorText` |
| 次要文字 | `token.colorTextSecondary` | `var(--ant-color-text-secondary)` | 说明、辅助标签 |
| 说明 / 备注文字 | `token.colorTextDescription` | `var(--ant-color-text-description)` | 时间、备注、附加说明；与 `Text type="secondary"`、`Statistic` 标题同色 |
| 空值 / 弱提示 | `token.colorTextQuaternary` | `var(--ant-color-text-quaternary)` | 「-」 |
| 实心色块上的文字 | `token.colorTextLightSolid` | `var(--ant-color-text-light-solid)` | 放在主色、深色实心块上的白字。不要写 `#fff` / `colorWhite` |
| 页面底 | `token.colorBgLayout` | `var(--ant-color-bg-layout)` | |
| 卡片、面板底 | `token.colorBgContainer` | `var(--ant-color-bg-container)` | |
| 浮层底（弹层、悬浮条） | `token.colorBgElevated` | `var(--ant-color-bg-elevated)` | |
| 弱填充（代码块、区块底） | `token.colorFillQuaternary` / `colorFillTertiary` | `var(--ant-color-fill-quaternary)` / `…-tertiary` | 从弱到强：Quaternary < Tertiary < Secondary |
| 分割线 | `token.colorSplit` | `var(--ant-color-split)` | 内容区里的分隔线；透明色，放在有色背景上也自然融入 |
| 容器轮廓 | `token.colorBorderSecondary` | `var(--ant-color-border-secondary)` | 卡片、标签页等容器的外边框；实色 |
| 控件边框 | `token.colorBorder` | `var(--ant-color-border)` | 输入框等需要明显边界的 |
| 阴影 | `token.boxShadowTertiary` 等 | `var(--ant-box-shadow-tertiary)` 等 | 三档：`boxShadow`（浮层）、`Secondary`、`Tertiary`（卡片） |

**不能做**：
- 自己给禁用控件上色。禁用态由 antd 组件处理。
- 把 `Text type="secondary"` 和 `colorTextSecondary` 当成同一个颜色。**不是**：`Text type="secondary"` 渲染的是 `colorTextDescription`（实测亮色约 45% 黑，比 `colorTextSecondary` 的 65% 浅一档），`Statistic` 标题也是它。要的是这一档，就写 `colorTextDescription` 或 `Text type="secondary"`；要的是比正文浅、但仍属于内容的一档，才写 `colorTextSecondary`。

### D. 分类色与图表色：表达「这是不同的一类」，没有好坏

**是什么**：用来**区分并列的东西**，没有好坏之分。例如图表的不同系列、文件类型图标、成员类型头像、对象类型标签，以及**并列的指标卡**（每张卡一种色相，方便一眼分辨）。

**取色顺序（先语义，后色板）：**

1. 先问有没有**语义真正吻合**的 token。吻合才用（例如「被拒绝」→ `colorError`）。**不能因为颜色相近就用。**
2. 没有吻合的，用 `@ant-design/colors` 的色板，保证全站一致。
3. 色板**必须通过 antd 主题取，且带色阶数字**：

| | TSX | CSS |
| --- | --- | --- |
| 主色 | `token.blue6` | `var(--ant-blue-6)` |
| 淡底 | `token.blue1` | `var(--ant-blue-1)` |
| 边框 | `token.blue3` | `var(--ant-blue-3)` |

**为什么不直接 `import` `@ant-design/colors`**：直接得到的是写死的亮色值，暗色下不会变；它也不是 admin 的直接依赖（现在只是 antd 的传递依赖）。`token.blue6` / `--ant-blue-6` 本来就是这个库生成的，并且随亮暗主题切换（实测：`--ant-blue-6` 亮 `#1677ff`、暗 `#1668dc`）。

**图表色板（antd 预设色去掉 red，共 12 种，按下面顺序轮流使用）：**

```
blue → purple → cyan → green → magenta → pink
→ orange → yellow → volcano → geekblue → lime → gold
```

顺序沿用 antd `PresetColors`（只去掉 red），所以 `<Tag color="blue">` 和图表用的是同一套颜色。取法：第 n 个系列取第 n 种，用完从头再来；取值统一写成 `<名字>6`（TSX：`token.purple6`，CSS：`var(--ant-purple-6)`）。

- **红色不进入轮流**：`red` 留给两件事，状态色 `colorError`，以及固定指派给「扣除」的 `red6`。
- **分类色和状态色是两套名字，不能互相替换**：`green6` 是「绿色」，`colorSuccess` 是「成功」；`gold6` / `orange6` 是颜色，`colorWarning` 是「警告」。
  - 在默认主题下，二者的**数值并不总是不同**：实测暗色下 `--ant-green-6` 与 `--ant-color-success` 同为 `#49aa19`，`--ant-gold-6` 与 `--ant-color-warning` 同为 `#d89614`（红则不同：`#d32029` 对 `#dc4446`）。
  - 所以不能用「看起来一样」来判断可以互换。判断依据只有含义：表示成功就写 `colorSuccess`；只是区分类别就写 `green6`。将来主题调整了状态色，`colorSuccess` 应该跟着变，而分类色不该变。
  - 读者可能把一个绿色系列误读成「成功」，这是数值相同带来的真实风险。降低风险的办法：同一个视图里已经出现真正的状态色时，该视图的轮流取色优先避开 green / orange / gold 一类（登记为固定指派即可）。
- **固定指派的概念先占位**：有些概念需要稳定的颜色，例如「扣除」固定用 `red6`。这类固定指派集中登记在一个文件里（见第 6 节），同一张图里轮流取色时**跳过已被固定指派的颜色**。
- 文件夹图标用黄色是通用习惯，从色板取（`gold6`），**不用 `colorWarning`**。
- **同一个概念在全站同一个颜色**：例如「订单提成」在趋势图、明细表、图例、tooltip 里都是同一个色板位置，统一定义，不在各组件里各写各的。

**带底色的分类小块（如文件类型图标）**：底 `1`、边 `3`、前景 `6`（见 1.5）。

```css
/* ✅ 文件夹图标：分类色 gold，不是 warning */
.drive-file-icon.is-folder {
  color: var(--ant-gold-6);
  background: var(--ant-gold-1);
  border: 1px solid var(--ant-gold-3);
}
```

### E. 固定品牌色：必须保持原样的颜色

**是什么**：不应随主题变化的颜色，例如飞书、企业微信的品牌色，或登录页这种有意固定为深色的视觉面。

**规则**：
- 十六进制只允许出现在这里。
- 集中定义在一个常量文件，并注明来源，不要在多个文件里各抄一份（现在 `AVATAR_COLORS` 抄了 3 份）。
- 固定色不会适配暗色，每一处都要手动确认暗色下看得清。
- 登录页整页是固定深色主视觉，保持现状，不纳入本规则。
- 头像底色、发言人颜色这类「区分个体」的颜色**不是品牌色**，属于 D 类，取图表色板。

---

## 3. 在 TSX 和 CSS 里怎么落笔

### 3.1 先决定写在哪里

| 情形 | 写在哪里 |
| --- | --- |
| 颜色固定不变（大多数情况） | **CSS 类**，用 `var(--ant-…)` |
| 颜色随数据变化（条件着色、按系列取色） | **TSX**，用 `token.xxx` |
| 用在 SVG 里的 `fill` / `stroke` | 固定的放 CSS 类；随数据变的在 TSX 用 `token.xxx` |

**不要为了一个静态颜色，在组件里新增 `theme.useToken()`。** 先看 CSS 类能不能解决。

### 3.2 常用场景对照表

| 想表达的 | CSS 写法 | TSX 写法 |
| --- | --- | --- |
| 说明文字（浅一档，同 `Text type="secondary"`） | `color: var(--ant-color-text-description)` | 优先 `<Text type="secondary">`；否则 `token.colorTextDescription` |
| 次要内容（比正文浅，但仍是内容） | `color: var(--ant-color-text-secondary)` | `token.colorTextSecondary` |
| 失败行底色 | `background: var(--ant-color-error-bg)` | `token.colorErrorBg` |
| 条件状态文字（待发 > 0 为 warning） | （数据驱动，不放 CSS） | `color: n > 0 ? token.colorWarning : token.colorSuccess` |
| 选中行背景 | `background: var(--ant-color-primary-bg)` | `token.colorPrimaryBg` |
| 卡片 | `background: var(--ant-color-bg-container); border: 1px solid var(--ant-color-border-secondary)` | `token.colorBgContainer` / `token.colorBorderSecondary` |
| 分类色块 | `var(--ant-purple-1)` / `-3` / `-6` | `token.purple1` / `purple3` / `purple6` |
| 图表系列色 | 固定系列：CSS 类 | `useChartPalette()`（第 6 节） |
| 半透明叠色 | `color-mix(in srgb, var(--ant-color-primary) 10%, transparent)` | `` `color-mix(in srgb, ${token.colorPrimary} 10%, transparent)` `` |

### 3.3 半透明和混色

- 一律用 `color-mix(in srgb, <颜色> N%, transparent)`。
- **不要**写 `rgba()`，也**不要**在十六进制后面拼两位透明度。
- 能用现成的淡色 token（`Bg`、`Fill*`）就不要混色。

### 3.4 SVG（图表）

- 坐标轴、网格：C 类，`colorSplit`（线）、`colorTextDescription`（刻度文字）。
- 悬停高亮：B 类，`colorPrimary`。
- 系列填充 / 线条：D 类，图表色板。
- 渐变的 `stopColor` 同样只能用 token，不写色值。

### 3.5 渐变、阴影、装饰

- **渐变允许使用**，但对颜色的来源有要求：
  - 色标只能是下面三种组合之一：
    1. 同一个色板的不同色阶，如 `gold-1` → `gold-3`（D 类）；
    2. 中性 token 之间，如 `colorBgContainer` → `colorBgLayout`（C 类）；
    3. 主色淡底渐隐到容器底，如 `colorPrimaryBg` → `colorBgContainer`（B 与 C 搭配，用作品牌底色）。
  - 以上都可以配合 `color-mix` 调整比例。
  - 不手写色值，不用 `rgba()`，不把状态色用作装饰渐变。
  - 「渐变」只是形式，**这块颜色该不该有，仍然先过第 0 节问题 2**。并列的 KPI 卡各取一种色相，任务是「区分并列项」，属于 D 类，可以带渐变（做法见第 7 节例 1）。
- 阴影用 `boxShadow*` token，不手写 `color-mix(... colorText ...)`。

### 3.6 覆盖 antd 自己的颜色

| 想做的 | 正确做法 | 不要这样 |
| --- | --- | --- |
| 改某个 antd 组件的颜色表现（如单选选中底色） | 在组件外包 `ConfigProvider`，设置 `theme.components.<组件>` 的组件 token | 用 CSS 选择器 `.ant-radio-button-…` 加 `!important` |
| 给 antd 组件内部的某一部分上色（如 Statistic 数值） | antd 6 的 `classNames` / `styles`（语义化插槽），挂自己的类，颜色写在 CSS | 用 `.ant-statistic-content` 之类的内部选择器 |
| 改全站主题（主色、圆角） | 只在 `ThemeProvider` 里改 | 在页面里改 |
| 颜色用 `!important` | 不用。需要它通常说明应该用官方组件的原生属性 | |

### 3.7 允许的特殊值

CSS 里 `transparent`、`inherit`、`currentColor` 可以用。**颜色关键字**（`red`、`green`、`gray`、`white`）和任何色值不可以。

---

## 4. 官方组件优先

写颜色之前先查这张表。**用了原生属性，就不要再写颜色。**

| 想表达 | 官方写法 | 不要这样 |
| --- | --- | --- |
| 次要 / 成功 / 警告 / 错误文字 | `<Text type="secondary">`、`type="success"`、`"warning"`、`"danger"` | `<span style=color: …>` |
| 警示 / 提示块 | `<Alert type="warning" showIcon>`（`success` / `info` / `error` 同理） | 手写底色 `div` 加图标 |
| 操作成功页 | `<Result status="success">` | 手绘大对勾加 `colorSuccess` |
| 状态标签 | `<Tag color="success">`（`warning` / `error` / `processing` / `default`） | 手写底色文字色 |
| 状态圆点 | `<Badge status="success">`（`warning` / `error` / `processing`） | `<Badge color={token.colorSuccess}>` |
| 进度条状态 | `<Progress status="success">` / `"exception"` | `strokeColor={token.colorSuccess}` |
| 危险 / 破坏性按钮 | `<Button danger>` 或 `color="danger"` | `style=color: colorError` |
| 带颜色的按钮 | `color="primary"` / `"danger"` / 预设色名 + `variant` | `style=color: …` |
| 虚线「添加」按钮 | `<Button color="primary" variant="dashed">` | 手写 `colorPrimary` + `colorPrimaryBorder` |
| 确认弹窗的警告图标 | `Modal.confirm` 默认图标，不传 `icon` | 自己传带颜色的图标 |
| 统计数值 | `<Statistic>` 默认；不要覆盖 `title` 的颜色；数值要带色相时，用 `classNames.content` 挂类，在 CSS 里定色（见第 7 节例 1） | `valueStyle`（antd 6 已废弃）、标题 `span` 上色 |
| 统计数值确需着色 | `styles.content`（`valueStyle` 在 antd 6 已废弃） | `valueStyle` |
| 复制按钮的「已复制」 | `<Text copyable>` | 自己切换对勾和 `colorSuccess` |
| 区分类别的标签 | `<Tag color="blue">`（预设色名，取自色板，自动适配主题） | `<Tag color="#3370ff">` |
| 头像 | `<Avatar>`，底色取图表色板 | 手写圆形色块 |
| 单选的选中带语义色 | `ConfigProvider` 设置 `Radio.buttonSolidCheckedBg` 等组件 token | `colorTextLightSolid` 手写 |

---

## 5. 禁止清单（逐条可检查）

每条都能在代码评审时直接对照。

**5.1 不手写色值。**
❌ `color: '#fff'`、`background: rgba(0,0,0,.05)`、`color: red`
✅ `var(--ant-color-text-light-solid)`、`var(--ant-color-fill-quaternary)`、状态色 token
（E 类固定色与登录页除外。）

**5.2 不用状态色表达非状态。**
❌ 「订单提成」用 `colorSuccess`、「奖金」用 `colorWarning`、文件夹用 `--ant-color-warning`
✅ 分类色走 D 类色板（`gold6` 等）

**5.3 不用不带数字的色板名（Seed 层，见 1.6）。**
❌ `token.purple`、`var(--ant-geekblue)`、`var(--ant-cyan)`
✅ `token.purple6`、`var(--ant-geekblue-6)`、`var(--ant-cyan-6)`

**5.4 不用主色做静态强调。**
❌ `<strong style=color: colorPrimary>12 条</strong>`
✅ `<Text strong>12 条</Text>`

**5.5 不用交互态 token 当静态色。**
❌ `colorPrimaryActive`、`colorPrimaryHover`、`colorXxxTextHover`
✅ 静态用 `colorPrimary`（且要满足 B 类条件）

**5.6 不用状态色的「Text」变体写正文。**
❌ 在 warning 底色块里用 `--ant-color-warning-text` 或 `--ant-gold-9` 写正文
✅ 正文用默认中性色；或直接用 `Alert`

**5.7 不拿图表系列当状态。**
❌ 图表第 2 个系列用 `colorWarning`
✅ 图表色板第 2 位

**5.8 渐变的色标必须符合 3.5 的三种组合。**
❌ `linear-gradient(135deg, #fff7e6, #ffe7ba)`（手写色值）；`linear-gradient(var(--ant-color-warning-bg), var(--ant-green-2))`（状态色混色板）
✅ `linear-gradient(135deg, var(--ant-gold-1), var(--ant-gold-3))`（同一色板）

**5.9 不在 antd 之外使用 `--ant-…`。**
❌ 在 `body { color: var(--ant-color-text) }`
✅ 挂在 `.ant-layout` 上

**5.10 不用 `!important` 改颜色。**
❌ `.x { color: var(--ant-color-warning) !important }`
✅ 去掉；如果去不掉，检查是不是该用官方组件的原生属性

**5.11 不重复定义同一件事。**
❌ 3 个文件各抄一份 `AVATAR_COLORS`
✅ 集中一个出处

---

## 6. 需要配套新增的基础设施（审定后实施）

规则要能被遵守，需要这几样「现成的东西」：

1. **图表色板** `src/shared/theme/chartPalette.ts`：导出 `useChartPalette()`，返回按固定顺序的 12 色（`blue6 → purple6 → cyan6 → green6 → magenta6 → pink6 → orange6 → yellow6 → volcano6 → geekblue6 → lime6 → gold6`），并登记固定指派（如 扣除 → `red6`），提供按概念取色的 `getSeriesColor(key)`，保证「同一概念同一颜色」。
2. **固定色常量文件** `src/shared/theme/brand-colors.ts`：E 类的十六进制全部放这里，附来源注释。
3. **文字层级工具类**（`src/index.css`）：`.text-secondary`、`.text-description`、`.text-quaternary`，对应 `var(--ant-color-text-*)`，让只需要文字灰度的组件不必引入 `useToken`。
4. **（可选）自动检查**：
   - `stylelint`：禁止十六进制色值、`rgb()` / `rgba()`、颜色关键字、不带数字的 `--ant-<色板名>`。
   - `eslint`：禁止 `style` 中的色值字面量，禁止 `token.purple` 这类不带数字的色板 token。
   这样规则里最容易犯的几条，不靠人眼也能拦住。

---

## 7. 例子：同一个问题，按规则怎么改

### 例 1：开头提到的「单月最高收入」

这张卡想要黄色。黄色的任务是「让这张卡区别于旁边的蓝、绿、紫卡」，属于 D 类，用 `gold`，**不用 `colorWarning`**。

```tsx
// ❌ 之前：黄色是分类，却声明了「警告」；颜色散落在三个地方
<Card className="profit-kpi-card profit-kpi-card-amber">
  <Statistic
    title={<span style={{ color: token.colorTextSecondary, fontSize: 13 }}>单月最高收入纪录</span>}
    value={overall.maxMonthlyGross / 100}
    prefix={<RiseOutlined style={{ color: token.colorWarning }} />}
    valueStyle={{ color: token.colorWarning, fontWeight: 700 }}
  />
</Card>

// ✅ 之后：TSX 里不再有颜色，色相只在 CSS 的一个类里决定
<Card className="profit-kpi-card profit-kpi-card-gold">
  <Statistic
    title="单月最高收入纪录"
    value={overall.maxMonthlyGross / 100}
    prefix={<RiseOutlined />}
    classNames={{ content: 'profit-kpi-value' }}
  />
</Card>
```

```css
/* 色相 = D 类：底 1、边 3、前景 6（见 1.5）；渐变色标取自同一色板和容器底（3.5） */
.profit-kpi-card-gold {
  background: linear-gradient(135deg, var(--ant-gold-1) 0%, var(--ant-color-bg-container) 100%);
  border-color: var(--ant-gold-3);
}
.profit-kpi-card-gold .profit-kpi-value {
  color: var(--ant-gold-6);
  font-weight: 700;
}
```

要点：标题不覆盖颜色（`Statistic` 自带）；图标跟随文字颜色，不单独上色；数值通过 antd 6 的 `classNames.content` 挂一个自己的类，在 CSS 里定颜色，不用已废弃的 `valueStyle`。其余三张卡同理，色相分别为 `blue`、`green`、`purple`，「扣除」那张是固定指派的 `red`。

### 例 2：「待发」金额（真语义，保留）

```tsx
// ✅ 条件由数据决定，读者能据此判断 → A 类
color: pending > 0 ? token.colorWarning : token.colorSuccess
```

### 例 3：规则列表里的「停用」按钮

```tsx
// ❌ 之前：靠 CSS 类给动作按钮涂 warning
<Button type="link" className="rule-action-btn-disable">停用</Button>

// ✅ 之后：官方属性
<Button type="link" danger>停用</Button>
```

### 例 4：图表第 2 个系列

```tsx
// ❌ 之前：奖金 = warning 黄
<rect style={{ fill: token.colorWarning }} />

// ✅ 之后：色板第 2 位（并且图例、tooltip 用同一个来源）
const palette = useChartPalette();
<rect style={{ fill: palette[1] }} />
```

### 例 5：权限单选 DENY / ALLOW

```tsx
// ❌ 之前：选中 DENY 是蓝底白字，与「拒绝」语义冲突
<Radio.Button value="DENY">
  <span style={{ color: effect === 'DENY' ? token.colorTextLightSolid : token.colorError }}>…</span>
</Radio.Button>

// ✅ 之后：用组件 token 让「选中」本身带语义色
<ConfigProvider theme={{ components: { Radio: {
  buttonSolidCheckedBg: token.colorError,
  buttonSolidCheckedHoverBg: token.colorErrorHover,
  buttonSolidCheckedActiveBg: token.colorErrorActive,
} } }}>
  <Radio.Button value="DENY">…</Radio.Button>
</ConfigProvider>
```

---

## 8. 每次新增或修改颜色时的自查清单

提交之前，对每一处颜色回答：

1. 官方组件有现成属性吗？有就用，不写颜色。
2. 这个颜色承担什么任务？表达含义、区分并列项，或者没有任务（没有任务就删掉）。
3. 它是 A 到 E 的哪一类？PR 描述里一句话写明。
4. 用的是这一类规定的名字吗？状态色只用于真状态；分类色是**带数字**的色板。
5. 没有色值、没有颜色关键字、没有 `!important`？渐变的色标符合 3.5？
6. 静态颜色在 CSS 里，数据驱动的颜色才在 TSX 里？
7. 切到暗色看过一眼吗？

---

## 9. 已确认事项

已确认（由你拍板）：

1. 图表色板：12 色轮流（antd 预设色去掉 red），「扣除」固定指派 `red6`。
2. 并列的 KPI 卡保留色相与渐变，属于 D 类（区分并列项），用色板而不是状态色。
3. `colorTextLightSolid` 保留，不改成 `colorWhite`；token 层级只保留「不用 Seed、同一角色只用一个名字」两条。
4. 渐变允许，色标必须符合 3.5 的三种组合（5.8）。
5. 分类色（`green6`、`gold6` 等）与状态色（`colorSuccess`、`colorWarning`）按含义区分，不因数值相同而互换（2.D）。
6. TSX 用 `token.xxx`，CSS 用 `var(--ant-xxx)`。
7. 状态块的正文用中性色，与 `Alert` 一致。
8. **备注文字与分割线按角色对齐 antd 原生**：说明 / 备注 / 时间文字用 `colorTextDescription`，内容区分割线用 `colorSplit`，容器外轮廓用 `colorBorderSecondary`，`colorTextTertiary` 不再使用。依据：这几个名字是 antd 给「说明文字」「分割线」「容器边框」三个角色起的名字，原生组件各自统一用它们（`colorTextDescription` 16 个组件、`colorSplit` 19 个、`colorBorderSecondary` 4 个、`colorTextTertiary` 仅 3 个）；`colorSplit` 是透明色，放在有色背景上会融入，`colorBorderSecondary` 是实色。
   - 因此 1.6 的原则是「同一个角色只用一个名字，并与 antd 原生同角色的元素保持一致」。
   - 注意：`Text type="secondary"` 是「说明文字」这一档（`colorTextDescription`，约 45% 黑），不是 `colorTextSecondary`（约 65% 黑）。现有约 50 处手写 `colorTextSecondary` 不能机械替换，要逐处判断是「说明」还是「次要内容」。

当前没有仍待确认的事项。
