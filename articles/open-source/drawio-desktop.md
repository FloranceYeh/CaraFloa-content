---
title: "drawio-desktop：离线画图工具的桌面版，以及它被当作正经工程的做法"
section: "open-source"
id: "drawio-desktop"
period: "p2"
summary: "介绍 jgraph/drawio-desktop：GPLv3 的离线图表桌面应用，能画什么、装哪种包、授权边界在哪；进阶部分再拆它的子模块分层、隔离式安全模型与分通道更新。"
publishedAt: "2026-10-26T09:00:00+08:00"
tags: ["Electron", "GPLv3", "桌面应用"]
---

# drawio-desktop：离线画图工具的桌面版

画流程图这件事，大多数人的路径是「打开浏览器 → 登录某个在线白板 → 画完导出」。而 [drawio-desktop](https://github.com/jgraph/drawio-desktop) 走的是另一条：**装一个本地应用，不登录、不联网、文件留在自己磁盘上**。

它是 diagrams.net（也就是 draw.io）的官方桌面版，由 JGraph 团队自己维护，仓库 2017 年建立，如今 63,642 star、5,792 fork，许可证 GPL-3.0，2026-10-23 发布 v32.6.1。

## 一、它到底是什么

一句话：**把 draw.io 的编辑器完整搬到本地，并用桌面应用的权限把文件读写、导出、打印、批量处理这些事做得比浏览器更彻底。**

它和网页版共用同一套编辑内核——同样的图形库、同样的 XML 存储格式（`.drawio` / 未压缩 XML）、同样的快捷键习惯。你在网页版画的东西可以在桌面版直接打开，反过来也一样。差别全在「桌面」这两个字带来的能力：

| 维度 | 网页版 | 桌面版 |
| --- | --- | --- |
| 网络 | 需要加载页面，可接云端存储 | 全程离线，默认不联网 |
| 文件 | 靠浏览器下载 / 上传 | 原生打开、另存、文件关联、外部修改自动重载 |
| 导出 | 单个导出 | 支持命令行批量导出，可脚本化 |
| 打印 | 受浏览器打印限制 | 独立打印参数配置 |
| 数据 | 视部署与配置而定 | 无遥测，图表不出本机 |

## 二、能画什么

覆盖面基本等同于「工程图表的通用集合」：

- **流程图与业务流程**：流程图、跨职能流程图、BPMN
- **软件与系统设计**：UML（类图、时序图、状态图、用例图）、ER 图、架构图、网络拓扑
- **云与基础设施**：AWS / Azure / GCP / Kubernetes / 阿里云等成套图标库
- **其他**：组织架构图、思维导图、平面布局、电路与工程符号

几个实际好用的细节：

1. **形状库可开关**。默认只加载基础图形，需要云厂商图标时再按需启用，避免侧边栏被塞满。
2. **图层与多页**。一张 `.drawio` 文件里可以放多个页面、多个图层，适合把「总览 + 局部放大」放在同一个文件里维护。
3. **模板库**。新建时能从模板起步，不必从空白画布开始。
4. **文本即图形**。所有图元本质是带样式的 XML 节点，意味着可以用脚本生成、可以用 Git diff、可以在 CI 里做校验——这点对「架构图也要进版本库」的团队很关键。
5. **多格式导出**：PNG、SVG、PDF、JPEG、HTML，以及保留可编辑性的 XML；SVG 导出可选内嵌字体或转路径，PDF 导出支持多页与压缩选项。

> [!TIP]
> 如果你的架构图需要跟着代码一起 review，把 `.drawio` 源文件提交进仓库、导出 SVG 作为展示产物，是最省事的一套组合——源文件 diff 可读，产物不依赖打开工具。

## 三、怎么装：按你的权限选包

这块比多数 Electron 应用想得细。同一个版本会同时发布多种形态，选错了会遇到「装不上」或「更新方式不符预期」：

**Windows**

- `draw.io-<ver>-windows-installer.exe`：NSIS 安装包，装进 `Program Files`，**需要管理员权限**，注册文件关联
- `draw.io-<ver>.msi`：MSI 包，**装在用户目录、不需要管理员权限**，适合受限账户
- `draw.io-<ver>-windows.zip`：绿色版，解压即用，不注册文件关联
- ARM64 另有两个原生包（安装版 / 免安装版），面向 Windows 11 ARM64 设备

**macOS**

- Universal `.dmg`，Intel 与 Apple Silicon 通用

**Linux**

- `.deb` / `.rpm` 走包管理器，`.AppImage` 单文件免安装
- 另有 Snap、Flatpak，以及 Microsoft Store 的 APPX 版本

一个容易踩的坑：自 31.4.2 起 AppImage 改用静态 runtime，不再依赖已 EOL 的 `libfuse2`，因此与旧版 AppImageLauncher 2.2.0 不兼容，启动会报 `fuse: memory allocation failed`。装了 AppImageLauncher 的话需要升到 3.0（当前为 beta），或者干脆卸掉——运行 AppImage 并不需要它。

## 四、授权与商业边界

- **GPL-3.0**：不改代码、接受「as-is」，任何用途都可以免费用；但二次分发有传染性，闭源商用集成要谨慎。
- **不提供合同性支持**。README 写得很直接：支持按合理商业约束提供，全部通过仓库公开进行，付费用户也没有私有工单。
- **桌面版与商业版是两条线**。为 Confluence / Jira 购买 draw.io 商业授权，并不包含桌面版的技术支持。
- **功能上不做「默认联网」**。维护者在文档里明确表态：桌面版的首要目标是安全与隔离，任何需要默认开启外部连接的需求一律不做。

## 五、和另外几个选择的对比

| 工具 | 形态 | 优势 | 代价 |
| --- | --- | --- | --- |
| drawio-desktop | 本地应用 | 离线、格式通用、图形库最全 | 界面偏「企业级」，不够轻快 |
| 网页版 draw.io | 浏览器 | 零安装、可协作 | 依赖网络，受浏览器文件权限限制 |
| Excalidraw | 浏览器 / 本地 | 手绘风格、上手极快 | 严谨工程图形支持弱 |
| Mermaid | 文本代码 | 可进 Git、可自动生成 | 布局控制力有限，复杂图难精修 |
| Visio | 商业桌面 | 与 Office 生态打通 | 授权成本、跨平台弱 |

选择逻辑其实很清楚：**图形要精确、要离线、要能进版本库 → drawio；图要快、要好看、要随手分享 → Excalidraw；图由代码生成、追求可持续维护 → Mermaid。**

---

# 进阶：工程实现剖析

以下内容面向想了解「一个 Electron 应用可以做到多细」的读者。日常使用可以跳过。

## 六、分层：子模块承载内容，外壳只管边界

仓库根目录的 `drawio/` 是一个 **git submodule**，指向编辑内核所在的 [`jgraph/drawio`](https://github.com/jgraph/drawio)；桌面端自身只保留 `src/main` 下的主进程代码与打包配置。

```bash
# 必须递归克隆，否则 drawio/ 是空目录
git clone --recursive https://github.com/jgraph/drawio-desktop.git
npm install
npm start        # electron .
npm run sync     # node ./sync.cjs，同步子模块到指定版本
```

这个分层的价值在于**责任归属清晰**：编辑器功能跟着 Web 版走，桌面端只回答「窗口怎么开、文件怎么写、更新怎么发」这类问题。

主进程也没有堆成单一巨石文件。`src/main/electron.js` 之外，周边被切成一组职责单一的模块：

| 模块 | 职责 |
| --- | --- |
| `args.js` | 命令行参数解析（约 14 KB，导出 / 打印相关） |
| `config-paths.js` | 安装目录与用户数据目录的配置解析 |
| `window-bounds.js` | 窗口位置与尺寸持久化 |
| `update-mode.js` / `update-channel.js` | 更新模式与通道判定 |
| `file-watcher.js` / `backup-file.js` | 文件变更监听与崩溃备份 |
| `export-files.js` / `print-options.js` | 批量导出与打印参数 |
| `electron-preload.js` | 预加载脚本，只暴露受限接口 |

配套的是 `node --test` 原生测试，覆盖 CLI 参数、MSI 工程生成、窗口边界、更新通道 / 模式、导出、文件监听、配置路径、打印参数、URL 参数等——**测的是外壳的行为，不是编辑器的行为**，边界划得很克制。

## 七、安全模型：默认与外网断开

- 网页侧 **CSP 禁止远程加载 JavaScript**，所有 JS 自包含；
- **不上报任何图表数据，也不上报任何使用统计**；
- 唯一的出网行为是更新检查：每天向 github.com 查一次版本，二进制从 GitHub 名下的 S3 桶下载；
- 图内引用的外部图片 / 字体仍会按需加载（否则渲染不出来），README 明确提示这只暴露 IP 等元数据，不传图表内容。

对集中部署或内网环境，更新检查可以直接掐掉：

```bash
DRAWIO_DISABLE_UPDATE=true ./draw.io    # 彻底关闭更新检查
./draw.io --disable-update               # 同上，命令行开关

DRAWIO_NO_SILENT_UPDATE=true ./draw.io   # 关掉静默，下载前先问
```

> [!IMPORTANT]
> 「谁能静默更新、谁必须手动」也是刻意设计的：安装形态决定了更新通道，而不是所有渠道共用一条更新路径。

| 形态 | 更新方式 |
| --- | --- |
| Windows NSIS / macOS / AppImage | 后台下载，退出时或手动重启安装 |
| MSI / zip / ARM64 免安装 / deb / rpm | 提示新版本，跳转发布页，自行安装 |
| Microsoft Store / Snap / Flatpak | 由商店负责，应用不检查更新 |

## 八、最新版本：一次纯粹的供应链响应

v32.6.1（2026-10-23）的主因只有一条：**升级到 Electron 44.9.3**，用于消化 eMudhra 中间证书被攻破带来的缓解措施。同版本另修两处行为：草稿删除失败时窗口不再卡在「Discard Changes」对话框；`checkFileContent` 开始接受 GIF 与 MP4 数据，使动图与页面动画导出可用。

没有新功能，纯粹跟着上游依赖的安全节奏走。对一个桌面端来说，这种「只有依赖变更的版本」恰恰是健康信号。

## 参考

- 仓库：[github.com/jgraph/drawio-desktop](https://github.com/jgraph/drawio-desktop)
- 最新发布：[v32.6.1](https://github.com/jgraph/drawio-desktop/releases/tag/v32.6.1)
- 上游编辑器：[github.com/jgraph/drawio](https://github.com/jgraph/drawio)
- 官方站点：[diagrams.net](https://www.diagrams.net)
- AppImageLauncher 相关问题：[issue #2538](https://github.com/jgraph/drawio-desktop/issues/2538)
- Electron 安全清单：[electronjs.org/docs/latest/tutorial/security](https://www.electronjs.org/docs/latest/tutorial/security)
