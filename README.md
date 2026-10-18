# CaraFloa Content

CaraFloa 的独立公开内容仓库，负责维护文章、站点内容配置和图片资源。

站点仓库会在构建时读取本仓库，并将目录同步到：

```text
articles/ -> src/content/
config/   -> src/config/
images/   -> public/images/
```

## 目录结构

```text
.
├── articles/       # Markdown 文章
├── config/         # 站点栏目、菜单、页面和站点信息配置
├── images/         # 站点图片、图标和文章资源
└── .github/
    └── workflows/
        └── notify-site.yml  # 内容更新后触发站点部署
```

## 创建文章

文章使用 Markdown 编写，放在 `articles/` 下对应的栏目目录中。

Frontmatter 示例：

```yaml
---
id: example-article
section: tech-news
period: p1
title: 一篇示例文章
summary: 文章摘要
tags:
  - Astro
  - 前端
publishedAt: 2026-10-18T12:00:00+08:00
---

文章正文。
```

## 发布内容

将本仓库推送到 GitHub 后，在 CaraFloa 站点的构建平台中配置：

```text
CONTENT_REPOSITORY=<GitHub 用户名>/<仓库名>
CONTENT_REF=main
```

内容仓库更新后，需要触发站点重新构建。Netlify 可以使用 Build Hook，
其他构建平台可以使用对应的 webhook 或手动重新部署功能。

## 自动触发 Netlify 部署

仓库中的 [`notify-site.yml`](./.github/workflows/notify-site.yml) 会在 `main`
分支有新提交时调用 Netlify Build Hook。

配置步骤：

1. 在 Netlify 项目的 **Project configuration → Build & deploy → Build hooks** 中创建
   一个 Build Hook。
2. 复制 Build Hook URL。
3. 在本仓库的 **Settings → Secrets and variables → Actions → Secrets** 中新增：

   ```text
   NETLIFY_BUILD_HOOK_URL=<Netlify Build Hook URL>
   ```

4. 推送到 `main`，GitHub Actions 会自动触发 Netlify 构建。

Build Hook URL 只应保存在 GitHub Actions Secret 中，不要写入公开文件。

如果站点使用 Vercel，在 Vercel 项目的 **Settings → Git → Deploy Hooks** 中创建
Deploy Hook，然后在本仓库配置：

```text
VERCEL_DEPLOY_HOOK_URL=<Vercel Deploy Hook URL>
```

内容仓库的 Action 会自动识别已配置的 Netlify 或 Vercel URL，并触发对应平台构建。
至少配置其中一个，不要把 URL 直接写入仓库文件。

## License

内容仓库中的文章、配置和图片资源沿用站点项目的
[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)，
除非单个文件另有明确声明。
