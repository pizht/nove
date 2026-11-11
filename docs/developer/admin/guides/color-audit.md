# Admin 颜色整改清单（草案，等规则审定后执行）

> 本文是 [颜色指定规则](./color-conventions.md) 的配套清单：规则定下来之前**不执行**。
> 清单里提到的「图表色板」「文字工具类」等基础设施，以规则文档为准。
> 注意：清单里个别写法（如把 `gold-9` 换成 `--ant-color-warning-text`）是旧版思路，以规则文档第 5 节为准；执行前会按最终规则重新核对一遍。

## 一、审计结果

范围：`apps/admin/src` 内全部 `token.color*`（共 222 处）、色板直取 `token.purple` / `cyan` / `red7` / `cyan7`（共 25 处）、CSS 中 82 处状态 / 色板变量。已逐处阅读上下文。
未单独列出的：中性层级 token（`colorText*` / `colorBg*` / `colorBorder*`）本身语义正确，仅有「可改用官方组件」的简化空间（见 6.5）。

### 1 语义用错：必须改

| 位置 | 现状 | 问题 | 整改 |
| --- | --- | --- | --- |
| `profit-sharing/dashboard/ProfitDashboard.tsx` 8 张 KPI 卡 | 数值与图标用 `colorPrimary` / `colorSuccess` / `colorWarning` / `purple` | 「单月最高收入」「月均发薪」等不是状态；`colorWarning` 仅因为想要黄色（分类色，不是警告） | 颜色统一改为 D 类色相：蓝 / 绿 / 金 / 紫；TSX 里删除 `valueStyle` 与图标颜色，改用 `classNames.content` 挂类，色值写在 CSS（规则文档第 7 节例 1）；标题 span 的覆盖删除（`Statistic` 自带） |
| `ProfitDashboard.css` `.profit-kpi-card-{blue,green,amber,purple,red}` | 五种渐变底色 | 用状态色之外的色板，但色标混用 `blue-2` 等且类名为 `amber` | **保留**。类名改为色相名（`blue` / `green` / `gold` / `purple` / `red`）；渐变 `<hue>-1 → bg-container`，边框 `<hue>-3`，数值 `<hue>-6` |
| `MonthlyOperationsView.tsx` KPI（约 10 处）+ `colors` 数组 `[primary, success, warning, purple, cyan]` | 分类数据用状态色 | 分类色冒充状态色 | KPI 同上改为 D 类色相（「扣除」那张用固定指派的 `red`）；`colors` 数组改取图表色板 |
| `SingleMemberDrilldownView.tsx` 图表系列、图例 `Badge`、tooltip、表格列 | 提成=success，奖金=warning，扣除=error，津贴=cyan，底薪=purple | 提成、奖金、津贴、底薪是分类，不是状态 | 这四类改取图表色板，表格里保持中性；**「扣除」固定使用 `red6`**（不是状态，不用 `colorError`），表格、图、图例、tooltip 四处一致（决策 D1） |
| `payslips/PayslipList.tsx:373` 与 `:392` | 链接按钮用 `purple` / `colorSuccess` | 操作按钮不是状态 | 删除颜色，用默认 link 按钮 |
| `payslips/PayslipList.tsx:432` | 应发合计 `colorPrimary` | 静态数值强调 | `<Text strong>` |
| `rules/RuleList.css` 三个 `rule-action-btn-*` | 计算 / 停用 = warning，启用 = success | 动作按钮不是状态 | 删除 CSS 与 `className`；「计算」「启用」用默认 link 按钮；**「停用」用 `danger`**（决策 D2） |
| `rules/RuleList.tsx:479`、`RuleForm.tsx:799`、`OrderRefundManagement.tsx:555`、`RoleManagement.tsx:1248`、`DataRulePreviewModal.tsx:112` | 静态文字用 `colorPrimary` | primary 是交互色，不是强调色 | 改 `<Text strong>` 或删除颜色 |
| `OrderBenefitModal.tsx:158 / 193 / 344` | `colorPrimary` / `colorPrimaryActive` | `Active` 是按下态 token，被当作文字强调色 | 全部删除 |
| `DataRulePreviewModal.tsx:189` | `PlayCircleOutlined` 用 success | 装饰图标 | 删除颜色 |
| `RotateApiKeyModal.tsx:44` | `⚠️` + `colorError` 文字 | 「只显示一次」是警告而非错误；且手拼 | `<Alert type="warning" showIcon>` |
| `CreateApiKeyModal.tsx:99 / 107` | 手绘成功图标；key 展示框用 primary 底 | 成功态应用官方组件；primary 底属装饰 | `<Result status="success">`；展示框用 `colorFillTertiary`（与 Rotate 弹窗一致） |
| `drive/components/DriveDetailModal.css` 文件类型图标 | folder / archive = warning，video / pdf = error，image = success | 文件类型是分类，不是状态 | 改为色板预设（`--ant-gold-*` 等）；**渐变保留**，两端取同一色板的 `1` → `3` |
| `drive/components/DrivePermissionModal.css` `.is-folder` / `.is-role` / `.is-dept` | warning / success 底色 | 主体类型是分类 | 同上，改色板预设 |
| `drive/pages/DrivePage.css:110` | 文件夹图标用 warning | 同上 | 同上 |
| `reports/components/ReportSubject.css` | 平台用户 = warning，组织 = success | 同上 | 同上 |
| `governance/permissions/components/DataRulePreviewModal.css:12` | 结果面板 success 底 | 不是成功状态，只是「结果区」 | 改中性 `colorFillQuaternary` |
| `dashboard/DashboardPage.css:151` | hover 变 `--ant-geekblue` | 非主题色的色板直取 | 删除，或改为 `--ant-color-primary` |
| `shared/components/MarkdownViewer/MarkdownViewer.css:91` | `--ant-magenta` | 装饰 | 删除 |
| `settings/organization-info/OrganizationInfoPage.css:52`、`account/profile/ProfilePage.css:18`、`auth/oauth/OAuthConsentPage.css`（渐变与 `cyan-8`） | 装饰渐变 | 色相无信息量 | 若保留品牌底色渐变，用 `colorPrimaryBg` → `colorBgContainer`；去掉 `cyan-8`、`geekblue-1` 之类的额外色相 |

### 2 语义正确：保留（部分可简化）

| 位置 | 判断 |
| --- | --- |
| 各处 `<Tag color="success" \| "warning" \| "error" \| "processing" \| "default">` 状态映射（Task、Member、Identity、RecordList 等） | 正确，已是官方写法 |
| `PayslipList.tsx:442` 待发金额 `>0 ? warning : success`；`SingleMemberDrilldownView.tsx:182 / 186` 待发 warning / 已结清 success | 条件式状态，正确 |
| `CreateApiKeyModal`、`DataRulePreviewModal:195` 的「已复制」success | 操作成功反馈，语义对；后者可改用 `Text copyable` |
| `DrivePermissionModal.tsx:408 / 537 / 542` DENY = error，ALLOW = success | 权限判定结果，语义成立，**但实现需改**：现在选中 DENY 是蓝底白字（`buttonStyle="solid"` 的选中底色是 primary），与「拒绝」冲突。改法见决策 D3 |
| `SecurityPage.css:51` 登录失败行 error 底 | 正确 |
| `IntegrationsManagement.css:40` 已配置圆点 success | 正确（可改 `Badge status`） |
| `DataRuleBuilder.css:320`、`IntegrationsManagement.css:325` 警告提示块 | 语义对，但文字色 `gold-9` / `gold-8` 应改为 `--ant-color-warning-text`；整块可改 `Alert` |
| `MinuteDetail.css:225`（`.minute-inline-error`） | 语义对，文字 `red-7` → `--ant-color-error-text` |
| `TaskManagement.tsx:498` `lastError` 用 `red7` | 语义对，改 `<Text type="danger">` |
| `Topbar.tsx:74` 退出确认的 `colorWarning` 图标 | 语义对，但与 `Modal.confirm` 默认图标相同，删掉 `icon` 参数即可 |
| 悬停 / 选中的 `colorPrimary` / `colorPrimaryBg`（图表 hover、选中行） | 交互态，正确 |
| `DrivePermissionModal.tsx:399` 信息图标用 `colorPrimary` | 装饰，直接去掉颜色（决策 D4：不需要引入 `colorInfo`） |

### 3 固定色常量（第 ⑤ 类）：保留但收拢

| 位置 | 建议 |
| --- | --- |
| `PlatformUserManagement.tsx` 平台品牌色 | 保留（第三方品牌），集中到常量文件并注明来源 |
| `PersonAvatar.tsx`、`RoleManagement.tsx`、`OrgMemberManagement.tsx` 的 `AVATAR_COLORS` | 3 处重复，合并为一份；改取图表色板 |
| `MinuteDetail.tsx` `SPEAKER_COLORS` | 同上，且需要暗色下确认对比度 |
| `ProfitDashboard.css` `.profit-rank-1..3`（金 / 银 / 铜） | 奖牌色，保留；若要主题化改用 `--ant-gold-6` 等 |
| `LoginPage.css` / `LoginPage.tsx` | 登录页是有意固定的深色视觉面，保留，不纳入主题 |

### 4 数量概览

| 类别 | 处数（约） |
| --- | --- |
| 状态 token 在 TSX 中 | 44（`success` 19 / `warning` 17 / `error` 8），其中条件式 / 真语义约 10，其余为装饰或分类误用（人工逐处判定，数字为估算） |
| `colorPrimary` 在 TSX 中 | 33，真正的交互态约 10，其余为静态强调 |
| 色板直取（`token.purple` / `cyan` / `red7` / `cyan7`） | 25，除 `red7`（错误文字）外均属分类或装饰 |
| CSS 状态 / 色板变量 | 82，分类误用与装饰约 50 |

### 5 可用官方写法简化（非错误，属收益项）

- **按角色对齐 antd 原生（已确认）**：`colorTextTertiary`（44 处）逐处改为 `colorTextDescription`；`colorBorderSecondary`（11 处）逐处判断，内容区里的分隔线改 `colorSplit`，卡片等容器的外边框保持 `colorBorderSecondary`；CSS 中 `--ant-color-text-tertiary`（54 处）、`--ant-color-border-secondary`（100 处）同理。
- 59 处已用 `Text type="secondary"`，另有约 50 处手写 `colorTextSecondary`。**注意不能机械替换**：`Text type="secondary"` 是更浅一档的「说明文字」（`colorTextDescription`），逐处判断是「说明」还是「次要内容」。
- `Card bordered={false}`（31 处）与 `Statistic valueStyle`（18 处）在 antd 6 已废弃，改 `variant="borderless"` / `styles.content`。这与颜色无关，但整改 KPI 卡时顺带处理。
- `RuleForm.tsx:1257` 手写 `color-mix` 阴影 → `token.boxShadow*`。

### 6 非官方写法是否能换成官方组件

结论：项目整体已经大量使用官方组件（`Tag` 41 个文件、`Alert` 23、`Card` 12、`Empty` 11、`Segmented` 7，`Timeline` / `Progress` / `Descriptions` / `Result` 也已在用），**真正需要替换的不多**，集中在下面几类。

| 现状 | 官方替代 | 对颜色设定的好处 | 工作量 |
| --- | --- | --- | --- |
| `minute-inline-error` / `minute-inline-note`（`MinuteDetail`）、`integrations-test-warning`（`AliyunSmsFields`）、`data-rule-summary-warnings`（`DataRuleBuilder`）：手写 `div` / `p` 加底色文字色 | `Alert type="error" / "info" / "warning"` | 底色、边框、文字、图标全部由 antd 提供，对应 CSS 可整段删除，不用再手选 `gold-8` 之类色阶 | 小，4 处 |
| `RotateApiKeyModal` 手拼 `⚠️` + 红字 | `Alert type="warning" showIcon` | 同上 | 小 |
| `CreateApiKeyModal` 手绘成功图标 | `Result status="success"` | 同上 | 小 |
| `DashboardPage` 的 `StatCard`（`dashboard-stat-card` 系列 CSS） | `Statistic`（外包 `Card`） | 数值、标题颜色自带；hover 变色之类可直接删 | 小 |
| ProfitDashboard / MonthlyOperations 的 KPI 卡 | 保持 `Card` + `Statistic`，颜色改由 CSS 类决定 | TSX 不再出现颜色 | 小，已在 6.1 |
| `RuleList` 三个动作按钮 CSS | `Button type="link"`，停用加 `danger` | 删除 CSS | 小，已在 6.1 |
| `RuleForm` 虚线「添加」按钮手写颜色 | `Button color="primary" variant="dashed"` | 不再手写 `colorPrimary` / `colorPrimaryBorder` | 小 |
| 大量 `<span style=color: colorTextSecondary>` | 属于「说明」的换 `Typography.Text type="secondary"`；属于「次要内容」的保留 `colorTextSecondary` | 不再需要 `useToken`（仅限换掉的部分） | 机械替换，约 50 处 |
| 手写 `integrations-menu-label .is-configured` 圆点 | `Badge status="success"` | 同上 | 小 |
| 文件类型 / 主体类型图标块（`drive-detail-icon`、`drive-perm-grant-avatar`、`report-subject` 头像、`dashboard-org-avatar`） | `Avatar`（已在项目中使用）加图标，颜色取图表色板 | 与分类色统一出口，不再各自写渐变 | 中，约 5 组 CSS |
| `DrivePermissionModal` 的 ALLOW / DENY 单选 | 仍用 `Radio.Button`，改用组件 token（见 D3） | 去掉文字色 hack | 小 |
| `Topbar` 退出确认的自定义警告图标 | `Modal.confirm` 默认图标 | 删除 | 小 |
| **手绘 SVG 图表**（`SingleMemberDrilldownView` 约 210 行、`MultiMemberCompareView` 约 130 行，含手写坐标轴、渐变、悬停逻辑） | antd 官方图表库 `@ant-design/plots` | 色板、暗色、坐标轴颜色由图表主题接管，不再手写 `fill` / `stroke`，也不需要图表色板的 SVG 部分 | **大**，需新增依赖，见下 |

**关于图表的取舍**：antd 本体没有图表组件，官方图表是另一个包 `@ant-design/plots`（基于 G2），项目目前未依赖。替换后能删掉约 340 行手写 SVG 和悬停状态管理，颜色问题随之消失；代价是新增依赖和打包体积，以及现有交互（悬停联动表格行、tooltip 样式）需要用图表库重新实现。因为这是新依赖和较大改动，**建议不放进这次颜色整改**，作为独立任务单独评估；颜色整改时手绘图表先改用图表色板即可。

不建议替换的：登录页的自绘视觉（固定深色主视觉）、`profit-rank-badge` 奖牌（官方没有对应组件）。


## 二、已确认的决策

| 编号 | 议题 | 结论 |
| --- | --- | --- |
| D1 | 金额是否着色 | 不考虑国际化，不再讨论红绿习惯差异。按语义判断：**扣除 = 固定指派 `red6`（分类色，不是状态）**；提成、奖金、津贴、底薪是分类，用图表色板；待发 > 0 用 `colorWarning`，已结清用 `colorSuccess`。同一概念在表格、图表、图例、tooltip 中颜色一致。 |
| D2 | 「停用」按钮 | 用 `danger`；「计算」「启用」不着色。 |
| D3 | 权限 DENY / ALLOW 单选 | 语义优先：选中 ALLOW 为 success 底，选中 DENY 为 error 底，未选中保持中性。用 `ConfigProvider` 为每个 `Radio.Button` 设置组件 token，去掉 `colorTextLightSolid` 手写文字色。 |
| D4 | `colorInfo` | **不需要**。主题目前只切换算法、没有自定义种子色，`colorInfo` 与 `colorPrimary` 同为默认蓝，没有视觉差异，现有代码也只有一处图标可能用到。需要「提示」语义时用 `Alert type="info"` / `Tag color="processing"`；将来若自定义品牌主色再评估。 |
| D5 | 图表色板 | 已调整：antd 预设色去掉 red，共 12 色按顺序轮流；固定指派的概念（如扣除 → `red6`）先占位。 |
| D6 | 分类色来源 | 先找语义吻合的 token；没有再用 `@ant-design/colors` 色板，但通过 `token.blue6` / `--ant-blue-6` 取（见 3.4），保证随主题切换。 |

## 三、实施顺序

1. 新增图表色板（取自 `token.<色板>6`）与文字工具类（第 7 节），不改页面。
2. 按 6.1 的表逐文件整改，每个 feature 一个提交，提交类型 `refactor(admin)`。
3. 6.2 / 6.3 的小改动随对应文件一并处理。
4. 暗色下人工过一遍：Profit 仪表盘、Drive 弹窗、报表主体、API Key 弹窗。
5. 运行 `pnpm lint:admin`、`pnpm test:admin`、`pnpm build:admin`。
