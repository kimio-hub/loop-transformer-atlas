# LOOP / ATLAS — Loop Transformer 精选研究站

> 截至 **2026-10-22** 的静态策展快照。围绕 Looped / Recurrent-Depth / Weight-Tied Transformer 的论文、技术博客、作者实验记录和开源代码，提供中文解读与适合初学者、进阶者、研究人员的阅读路线。

## 直接打开

**双击 `index.html` 即可使用**。网站是无依赖、完全自包含的静态页面：资料与交互代码全部嵌在 HTML 中，无需 Python、Node、登录、服务器或网络请求来显示目录。跳转原文需要网络连接。

当前目录有 **82 条**：67 篇论文、8 篇技术长文、7 个项目和资源入口。网站包括：

- 实时搜索中文、英文标题、作者、研究主题和关键词
- 内容类型、主题、核心/前史/相邻方向、阅读等级 S/A/B 筛选
- 按推荐权重、新旧时间、标题排序
- 三条递进式阅读路线（快速入门、架构训练、前沿研究）
- 每篇中文简介、入选理由和边界/阅读提醒
- 本地收藏、仅看收藏、导出 Markdown 书单、导出完整 JSON
- 调节循环次数的简单交互式结构示意
- 深色响应式 UI；手机可浏览

## 免费发布到公共互联网

### GitHub Pages

1. 在 GitHub 新建公开仓库，例如 `loop-transformer-atlas`。
2. 把本目录的站点与文档文件上传到仓库根目录（包括 `index.html`、`catalog.json`、`README.md`、`.nojekyll` 和 `.github/ISSUE_TEMPLATE/`）。
3. 打开仓库 **Settings → Pages**，在 Build and deployment 中选择 **Deploy from a branch**，分支选 **main**，目录选 **/(root)**，保存。
4. 部署成功后，Pages 页面会显示网站地址，通常形如 `https://你的用户名.github.io/loop-transformer-atlas/`。

也可将 `index.html` 直接上传 Netlify / Cloudflare Pages 等静态托管。当前文件里未加入评论系统、访问统计或自动更新服务；如果后续希望社区贡献，可以通过 GitHub Issues/PR 审稿后更新 JSON。

## 更新论文库

条目数据维护在 **`catalog.json`**；页面由 `site_template.html` + `build_site.py` 生成：

```bash
python build_site.py
```

这个命令在本目录重新生成 `index.html`。需要修改站点视觉或交互时编辑 `site_template.html`，维护内容时只编辑 `catalog.json`。生成器不需要第三方 Python 包。

### 一条数据的字段

```json
{
  "id": "1807.03819",
  "title": "Universal Transformers",
  "short": "Universal Transformer",
  "year": 2018,
  "month": "2018-07",
  "kind": "paper",
  "scope": "core",
  "tier": "S",
  "topic": "基础与理论",
  "author": "Dehghani et al.",
  "desc": "简短的中文摘要",
  "why": "为什么值得读",
  "caveat": "实验局限、范围与阅读提醒",
  "url": "https://arxiv.org/abs/1807.03819",
  "arxiv": "1807.03819",
  "code": "",
  "project": "",
  "tags": ["weight-sharing", "adaptive-depth"]
}
```

`kind` 取 `paper`、`blog` 或 `project`；`scope` 取 `core`（同一前向传播内跨虚拟深度重复共享计算）、`foundation`（历史前身）或 `adjacent`（相关但不完全符合严格定义的方向）。`tier`：`S` = 精读优先，`A` = 延伸阅读，`B` = 补充背景。**评级是本站编辑建议，不是科学上的客观论文质量分数。**

## 策展逻辑

我们用以下问题判断资源是否值得入选：

1. **不可替代性**：是否开创架构、分析框架，或产生关键的可复现实验？
2. **对照质量**：是否明确区分参数量、训练 FLOPs、推理 FLOPs、token 预算、吞吐/延迟、KV Cache？
3. **失败边界**：是否讨论循环深度外推、训练不稳定、状态收敛、任务分布之外的失败模式？
4. **实用程度**：是否有真实的训练代码、checkpoint、可靠的复现材料？
5. **解释深度**：技术博客是否有原始实验、推导或深入分析，而非只转述论文摘要？

以下几类比较**不可直接当成同一命题**：

- 相同模型参数数下，循环和普通层堆叠哪个更好？
- 相同预训练 FLOPs 下，循环和普通层堆叠哪个更好？
- 相同解码计算量/吞吐约束下哪个更好？
- 不改变物理层数，只在推理时增加 Loop，何时改进、何时退化？
- 推理时参数复用能否降低 KV Cache 等内存，是否必须修改缓存策略？

本站强调 **Looped Transformer ≠ 所有 latent reasoning ≠ diffusion sampling ≠ agent 循环调用**。相邻研究仅用于理解机制、算法联系或实验对照。

## 参考资料与大规模索引

检索与交叉检查时重点参考：

- [Looped Language Models: Survey & Meta-analysis（557 篇索引）](https://github.com/ArminAzizi98/looped-lm-survey)
- [Awesome Loop Models（动态数据库、分类、比较范式）](https://github.com/huskydoge/Awesome-Loop-Models)
- [Awesome Loop Transformers（双语研究图谱）](https://github.com/Mrkkew/Awesome-Loop-Transformers)
- [Awesome Loop Transformer（中文深读、译文与幻灯片）](https://github.com/asimfish/awesome_loop_transformer)
- [Ouro 官方项目页及 follow-ups](https://ouro-llm.github.io/)
- [IFM 官方 xLLM-Loop 代码](https://github.com/ifm-ai/xllm-loop)

`reading-guide.md` 包括建议精读论文、研究争议以及后续维护方向。`bibliography.md` 是从 JSON 生成的全部资源 Markdown 目录。

## 边界与使用声明

这是一份经过筛选的**研究导读快照，不是全网完备索引**。2026 年新论文更新快，未收录不代表没有研究价值。摘要与推荐理由由编辑撰写，实验结论主要基于原作者公开论文，**不等于本站独立复现与证实**。外链及原论文版权归各自作者/发布方所有。收藏数据保存在浏览器本地存储中；当浏览器不允许本地存储时，收藏仅在当前打开期间有效。本站不向服务器上传任何浏览行为。

## 开放贡献与公开发布

详细部署说明见 [`PUBLISH.md`](PUBLISH.md)；研究内容贡献规范见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。社区可以通过预置 GitHub Issue 表单推荐论文或报告目录错误。