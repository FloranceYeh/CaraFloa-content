---
title: "CaraFloa 上线一周：45 次提交，和一个没说出口的承诺"
section: "special"
id: "carafloa-week-one"
period: "p1"
summary: "复盘 CaraFloa 上线首周的 45 次提交：从框架骨架、视觉与信息架构，到内容与代码解耦、评论系统接入，以及一个数据惨淡但承诺未变的第一周。"
publishedAt: "2026-10-24T09:00:00+08:00"
tags: ["Astro", "Waline", "站点建设"]
---

# CaraFloa 上线一周

2026-10-18 上午九点，`special/p0`《CaraFloa 开发至今》推上内容仓库，站点正式对外。到今天，整整一周。

这一周没有增长曲线可以炫耀。有的只是一条不算好看的提交序列：**45 次提交**，跨 7 个有动作的日子，从 10-13 的骨架收尾一直到 10-22 的 `overflow: hidden` 补丁。这一篇不复盘情怀，只复盘这 45 次提交到底改了什么。

## 一、提交曲线

| 日期 | 提交数 | 主要动作 |
| --- | ---: | --- |
| 10-13 | 1 | `finish framework`，工程骨架收尾 |
| 10-14 | 4 | 首页可配置分区、页面导航、主题色控制、排期文章渲染 |
| 10-15 | 4 | Markdown 渲染、文章页渲染与客户端导航重构、滚轮滚动 |
| 10-17 | 21 | 视觉体系与信息架构集中落地 |
| 10-18 | 6 | 外部内容仓库、标签与归档筛选、README 与 GPLv3、Vercel 部署 |
| 10-21 | 3 | GFM 支持、正文排版、开发期外链路由 |
| 10-22 | 6 | 评论页与 Waline、时区构建、`now.json` 清理、容器溢出修复 |

按提交类型分：`feat` 28 次、`fix` 8 次（另有 3 次未规范化的修复）、`style` 5 次、`docs` 1 次。

10-17 那天占了全周近一半的提交量——那是一次性的设计冲刺，把站点从“能跑”推到“能看”。

## 二、三个阶段

### 阶段一：骨架（10-13 ~ 10-15）

先解决“能不能跑”。首页分区做成可配置项，而不是写死在模板里；文章列表与详情页的渲染路径拆开，客户端导航重写一遍，把整页刷新换成局部替换；文章卡片、翻页、滚轮滚动逐个修。这一阶段的提交大多不好看，但决定了后面所有改动的成本。

### 阶段二：视觉与信息架构（10-17）

一天 21 次提交，节奏几乎是“改一版、看一眼、再改一版”：

- 明暗主题切换与品牌色拆分
- 可搜索的文章归档、归档筛选与日期显示
- About / Links 页面、404 页面与动态 Logo
- RSS 输出、模板化站点数据
- 响应式布局、移动端间距与控件、页面边缘与圆角处理

### 阶段三：解耦与社区（10-18 ~ 10-22）

这是这一周真正的架构动作：**把内容从代码仓库里剥出来**。站点只管渲染，正文走独立的内容仓库，构建时拉取。

```text
FloranceYeh/CaraFloa            # 站点：Astro 源码、布局、样式
FloranceYeh/CaraFloa-content    # 内容：articles/<section>/<id>.md
        │
        └── push → 触发构建 → 静态产物部署
```

于是日常写作不再触碰源码仓库，一次 `git push` 到内容仓库就等于一次发布。顺手还补了 GFM（表格、任务列表、删除线）与 `remark-github-blockquote-alert`，让长文能排得下结构。

最后一天补齐了社区层：评论页独立成页、相机移动逻辑重构成可复用的视角控制、Waline 接入、构建时区统一到 `Asia/Shanghai`，并清掉了失效的 `now.json`。

> [!NOTE]
> 一周里 `fix` 类提交有 11 次，其中 3 次关于移动端滚动与布局。响应式不是一次性工作，是被一次次真实打开页面顶回来的。

## 三、第一周的账

坦率一点：数据惨淡。GitHub 上 1 个 star、0 fork，站点访问量基本可以用个位数描述，评论区开口说话的人也没有。

这不奇怪。一个没有推广、没有 SEO 积累、没有社交分发的静态站，第一周的合理期望值就是零。内容站的价值从来不在第一周兑现。

但有一件事在第一周兑现了：**排期没有断**。

- 10-18 `special/p0` 上线特辑
- 10-19 `open-source/folia-major`（周一）
- 10-21 `deep-dive/rust-refactor-wave`（周三）
- 10-22 `challenge/case-in-point`（周四）

栏目、周期、发布时间、双端同步——说好的那套流水线，一周里一天没落下。数据是结果，承诺是选择。我是个给出承诺就不轻易食言的人，第一周如此，后面也一样。

> [!TIP]
> 下一周的计划：把评论区的通知打通、补上文章内的目录锚点、开始整理 RSS 的全文输出。更新节奏不变：周一开源速递、周三深度议题、周四极客挑战、周五科技前沿、周日本周特辑。

## 参考

- 站点源码：[github.com/FloranceYeh/CaraFloa](https://github.com/FloranceYeh/CaraFloa)
- 内容仓库：[github.com/FloranceYeh/CaraFloa-content](https://github.com/FloranceYeh/CaraFloa-content)
- 线上站点：[cara-floa.vercel.app](https://cara-floa.vercel.app)
- 提交记录：[commits/main](https://github.com/FloranceYeh/CaraFloa/commits/main)
- Astro 文档：[docs.astro.build](https://docs.astro.build/)
- GFM 规范：[github.github.com/gfm](https://github.github.com/gfm/)
