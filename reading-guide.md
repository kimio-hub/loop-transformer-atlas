# Loop Transformer：精选论文学习导图与研究判断

**编辑快照：2026 年 10 月 22 日。** 以下是从文献中筛选“必须读、为什么读”的导览，而非领域完整清单。每篇都链接作者或会议的公开原文，论文报告的数字与结论并非本站独立复现。

## 1. 领域定义：什么算 Looped Transformer？

最核心的定义是：**同一次前向传播里，对 token 的中间表示反复应用某个共享权重的 Transformer 层/模块/层组，从而让计算深度大于物理存储的深度。**

传统堆叠网络形式为 `h_(k+1) = F_(k)(h_k)`，每一层一般有自己的权重；Looped 的基本形式则为 `h_(k+1) = F_θ(h_k, x, k)`，同一组参数 `θ` 会跨深度重复使用。实际架构通常还包括输入注入、预处理层、尾部层、可变停止机制，不能只用一行公式概括训练细节。

需要排除四种常见混淆： (1) LLM 在多轮工具调用后循环，并不是循环层；(2) 输出多个 CoT token 会增加串行计算，但不等同于内部重复共享层；(3) Diffusion 迭代去噪默认也不是 Looped Transformer，除非同一个去噪步骤内部还复用网络 block；(4) HRM、TRM、Coconut 等属于相关的递归或隐式推理方向，架构定义不一定重合。

## 2. 十四篇高优先级精读

| 研究问题 | 精选阅读 | 阅读价值 |
|---|---|---|
| 早期机制 | [Universal Transformers](https://arxiv.org/abs/1807.03819)（2018） | 跨深度复用与自适应步骤的历史原点。 |
| 表达能力 | [Looped Transformers as Programmable Computers](https://proceedings.mlr.press/v202/giannou23a.html)（2023） | 反复计算可以实现怎样的算法行为。 |
| 学习算法 | [Looped Transformers are Better at Learning Learning Algorithms](https://proceedings.iclr.cc/paper_files/paper/2024/hash/b8402301e7f06bdc97a31bfaa653dc32-Abstract-Conference.html)（2024） | 循环作为算法归纳偏置的直接实验证据。 |
| Looped MoE 的早期路线 | [MoEUT](https://arxiv.org/abs/2405.16039)（2024） | 如何在权重共享下维持容量及条件计算。 |
| 大规模预训练 | [Huginn](https://arxiv.org/abs/2502.05171)（2025） | recurrent depth 的原生训练以及推理时额外计算。 |
| 自适应深度 | [Mixture-of-Recursions](https://arxiv.org/abs/2507.10524)（2025） | token 级动态分配 Loop 预算。 |
| 原生 Looped LLM | [Ouro](https://arxiv.org/abs/2510.25741)（2025） | 工程上更完整的模型系列与实验基准。 |
| 增深与循环统一 | [From Growing to Looping](https://proceedings.mlr.press/v306/kapl26a.html)（2026） | 两种迭代计算路线可能对应哪些机制。 |
| 理论对照 | [Iso-Depth Scaling Laws](https://arxiv.org/abs/2604.21106)（2026） | 区分参数复用收益与同训练 FLOPs 下的实际表现。 |
| 稳定性与 scaling | [Parcae](https://arxiv.org/abs/2604.12946)（2026） | 训练动力系统、循环缩放与稳定化。 |
| 架构设计 | [Towards Looped Models Done Right I](https://arxiv.org/abs/2610.23036)（2026） | 分离 topology、input injection 与递归状态设计的对照研究。 |
| Fixed-point 策略 | [Towards Looped Models Done Right II](https://arxiv.org/abs/2610.06833)（2026） | 迭代收敛、循环捷径与缓存资源。 |
| 训练配方 | [Closing the Loop](https://arxiv.org/abs/2610.00673)（2026） | 研究实际可用的优化与监督方案。 |
| 系统部署 | [LoopSpec](https://arxiv.org/abs/2609.17184)（2026） | 循环中间输出的自推测解码与吞吐。 |

## 3. 这三组问题值得分别做研究

### A. Loop 的优势到底来自哪里？

**最重要的警示是：参数量小不等于在等算力下强。** [Iso-Depth](https://arxiv.org/abs/2604.21106) 在它的模型与训练设置下报告：共享循环有容量收益，但不达到重复层完全等价的收益；同样训练预算下循环表现可能不如独立参数层。相比之下，[Done Right I](https://arxiv.org/abs/2610.23036) 通过分离架构因素与 MoE 对照得出某些 recurrent-depth 布局确实能在特定任务具备优势。二者并不矛盾：实验约束、架构设计、比较对象与任务各不相同。

建议实验：在严格控制 token、训练 FLOPs、独立参数规模、逻辑深度、推理成本的矩阵里测量困惑度、任务能力和成本；不要只做“1B Looped 对 4B Dense”。

### B. 深度外推为什么时好时坏？

Loop 有机会把多步计算学成一种迭代算法，也可能让隐状态逐渐偏离训练分布。可沿着收敛动态、固定点、随机停止、输入注入、残差尺度、条件停止门分别做对照。建议读 [Fixed-Point Reasoners](https://arxiv.org/abs/2606.18206)、[Learned Stochastic Stopping](https://arxiv.org/abs/2606.29983)、[Think Shallow, Solve Deep](https://arxiv.org/abs/2608.18222)。

研究机会：不能只把 `R_train=4 → R_test=16` 跑起来就称为 Test-Time Scaling；还应报告在哪些任务难度、输入长度和循环区间开始退化。

### C. “便宜的推理”到底便宜了什么？

权重共享可降低常驻权重的内存，但每次增加循环通常仍需要计算。KV Cache、不同循环的 memory state、pass 间并行、流水、早停都会影响真实延迟与吞吐。建议并读 [Shared Memory](https://arxiv.org/abs/2610.02383)、[LoopSpec](https://arxiv.org/abs/2609.17184)、[LoopCD](https://arxiv.org/abs/2610.02185)。

研究机会：在实际解码服务中控制 context length、batch、硬件、KV 内存，绘制质量—延迟—吞吐—显存 Pareto 前沿。

## 4. 技术博客：按“能否帮助读者真的理解”筛选

- **强烈推荐：** [Towards Looped Models Done Right 长文](https://huskydoge.github.io/husky-blog/posts/recursive_models/towards-looped-models-done-right/) —— 原作者的控制实验和设计理由。
- **强烈推荐：** [Loop-Model FLOPs and Memory](https://huskydoge.github.io/husky-blog/posts/recursive_models/loop-cost/) —— 理解训练开销，不会被参数量表象误导。
- **强烈推荐入门动手：** [Looped-GPT 教程](https://sanyalsunny111.github.io/posts/2026-01-15-post1-looped-gpt/) —— 小规模实现路径。
- **值得从大图景出发：** [Computational Depth is All You Need](https://qlabs.sh/research/depth/) —— 实际计算深度与 scaling 的研究愿景。注意它不只讨论权重共享 Loops，包含远期外推。
- **架构综述：** [Sebastian Raschka: Looped Transformers](https://magazine.sebastianraschka.com/p/gpt-6-astra-looped-transformers-and) —— 容易读懂，但需要把闭源模型推测与公开论文证据分开。
- **工具与复现：** [xLLM-Loop 官方仓库](https://github.com/ifm-ai/xllm-loop) —— 在较一致训练框架下进行架构消融与 checkpoint 复现。

## 5. 如何长期维护这个站

建议每周从 arXiv 的关键词（`"looped transformer"`、`"recurrent depth"`、`"weight-tied transformer"`、`"looped language model"`、`"adaptive recursion"`）、[Ouro follow-up](https://ouro-llm.github.io/)、[Awesome Loop Models](https://github.com/huskydoge/Awesome-Loop-Models) 以及 [557-paper Survey](https://github.com/ArminAzizi98/looped-lm-survey) 收集候选；先审核严格架构边界，再分析 paper 对比条件，最后给出 80–120 字的入选理由和限制。不要让论文摘要自动决定 S 评级。

若想把本站发展成长期公共项目，最佳增量不是无限增加论文，而是每周发布一篇 **Research Note**：解释一个具体研究问题，列出互相支持与互相矛盾的原始证据、复现风险、必要的公平对照，以及自己的下一步实验。