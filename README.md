# Loop Atlas

一个专注于 **Looped / Recurrent-Depth Transformer** 的中文阅读与研究导航站。

**网站：** https://kimio-hub.github.io/loop-transformer-atlas/

保留原有 111 条资源（91 篇论文、11 篇博客、9 个项目/索引），以精选导读和学习路线帮助读者建立理解，而不只是收集链接。当前资料快照与两轮重点内容核对日期均为 **2026-10-22**。本项目不声称覆盖全网。

## V3 · 第二轮深度研究

[完整研究报告（比较标准、冲突证据、系统成本、Diffusion 关系和复现实验）](RESEARCH-DEEP-DIVE.md)

2026-10-22 新增 24 篇 Paper、3 篇博客、2 个项目入口；重点围绕 Looped MoE 的公平对照、动态计算、KV cache、量化、固定点失效和不同循环深度的安全性。41 条导读标注核对范围；其余资源保持待逐篇复核。

## V2 的变化

- 浅色编辑式布局，另可切换深色模式；桌面、平板、手机响应式适配。
- 独立的发现页、资料库、学习路线、概念与方法、个人书架。
- 41 条重点阅读导览：阅读问题、先修知识、阅读重点、结论边界、关联阅读和核对来源。
- 3 条学习路线，共 20 个有序阅读步骤，支持本地已读进度。
- 按类型、研究主题、关键词、关联方向和导读状态筛选，支持时间与推荐排序。
- 保留旧版收藏存储键；支持本地书架、Markdown 导出、单篇分享链接和 `/` 搜索快捷键。

核对摘要或原文，不等于独立复现实验。其余条目仍保留原有摘要，详情页会标注本轮尚未逐项复核。原目录的 S/A/B 仅为推荐排序参考，不再显示为论文质量评分。

## 文件结构

```text
index.html                # 线上入口（从模板复制生成）
site_template.html        # 页面壳；编辑后运行构建脚本
assets/site.css           # 样式与响应式布局
assets/site.js            # 原生 JavaScript 交互
catalog.json              # 原始资源目录
editorial.json            # 重点导读、来源记录与学习路线
build_site.py             # 数据校验、生成入口、导出独立 HTML
tests/test_browser.py     # 可选的离线浏览器交互测试
bibliography.md           # 初版 Markdown 目录快照（历史资料）
RESEARCH-DEEP-DIVE.md      # 第二轮调研：机制/预算/证据/实验
reading-guide.md          # 初版研究导读
CONTRIBUTING.md            # 社区投稿规范
PUBLISH.md                # 发布方法
```

本站不依赖 npm、前端框架、外部字体或 CDN，不包含追踪脚本。书架与阅读进度仅保存在读者的浏览器。

## 本地运行

需要 Python 3.10 或更高版本：

```bash
python build_site.py --check
python -m http.server 8000
```

浏览器打开 `http://localhost:8000/`。直接双击源码的 `index.html` 时，浏览器可能阻止读取 JSON；请使用 HTTP 服务或下面的独立版本。

模板更新后运行：

```bash
python build_site.py
```

生成一个可直接打开、无需网络的独立 HTML：

```bash
python build_site.py --standalone dist/loop-atlas.html
```

该文件内嵌目录、导读、样式和脚本；外部论文链接仍需联网。不要把生成的独立文件作为日常编辑源。

## 维护内容

在 `catalog.json` 中维护资源及原始链接，在 `editorial.json` 中维护中文导读与路线，避免把目录硬编码进页面。

新增条目应有唯一 `id`，并正确填写 `kind`（`paper` / `blog` / `project`）与 `scope`（`core` / `foundation` / `adjacent`）。重点导读必须提供 `source`、`checked` 和 `review`，如实说明实际核对范围，不能把“摘要核对”写成“全文精读”或“已复现”。

修改后运行 `python build_site.py --check` 检查重复 ID、失效的内部引用、必要字段和链接格式。这个检查**不联网验证外部链接是否可访问**。旧的 `bibliography.md` 和 `reading-guide.md` 是初版快照，不会由 V2 构建脚本自动更新。

## 浏览器测试

安装可选开发依赖 Playwright 及其 Chromium 浏览器后运行：

```bash
python tests/test_browser.py
```

测试使用真实的独立 HTML，但在离线 `about:blank` 环境中模拟本地存储与剪贴板。它覆盖界面与交互，不等于公网部署验收；报告和截图写入 `.qa/`。

本轮离线检查覆盖搜索、筛选、导出、收藏恢复、学习进度、模态框、主题，以及 360–1440px 的多种视口。上线后仍建议在实际浏览器确认分享链接、缓存刷新和本地存储行为。

## 发布

GitHub Pages 保持 **Deploy from a branch → main → /(root)**。详见 [PUBLISH.md](PUBLISH.md)。

推荐资料或纠错可以使用仓库的 Issue 表单。所有原论文、博客与项目的版权归原作者；本站仅提供链接和原创导读。未经作者许可，不镜像全文或重新分发权重。
