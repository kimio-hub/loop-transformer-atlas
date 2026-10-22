# Loop Transformer Atlas · 全部精选目录

**快照：2026-10-22**。由 `catalog.json` 生成。注意：评级是编辑给出的学习优先级，不是客观的学术质量分数。

## Paper · 67 条

### 基础与理论

- **S** [Reasoning with Latent Thoughts: On the Power of Looped Transformers](https://arxiv.org/abs/2502.17416) (2025) — 从理论和合成推理实验理解 latent compute 的价值。
- **S** [Looped Transformers are Better at Learning Learning Algorithms](https://proceedings.iclr.cc/paper_files/paper/2024/hash/b8402301e7f06bdc97a31bfaa653dc32-Abstract-Conference.html) (2024) — 把 Looped Transformer 与 ICL 内部优化联系起来。
- **S** [Looped Transformers as Programmable Computers](https://proceedings.mlr.press/v202/giannou23a.html) (2023) — 解释循环为何有机会把参数复用变成复杂计算程序。
- **S** [Universal Transformers](https://arxiv.org/abs/1807.03819) (2018) — 核心架构出发点：固定层堆叠与跨深度重复计算的区别。
- **A** [Learning to Extrapolate in Depth with Looped Transformers](https://arxiv.org/abs/2610.14456) (2026) — 这是反驳「多循环必然更好」的非常直接的理论材料。
- **A** [When Does Recurrence Become an Algorithm? Convergence Selection in Weight-Tied Looped Transformers](https://arxiv.org/abs/2607.20594) (2026) — 适合作为算法泛化与表征机制的因果诊断范式。
- **A** [To CoT or To Loop? A Formal Comparison Between Chain-of-Thought and Looped Transformers](https://arxiv.org/abs/2505.19245) (2025) — 梳理「生成更长 CoT」和「加深隐藏计算」并非等价。
- **A** [Looped Transformers for Length Generalization](https://arxiv.org/abs/2409.15647) (2024) — 研究「训练短、测试长」必须阅读。
- **A** [PonderNet: Learning to Ponder](https://arxiv.org/abs/2107.05407) (2021) — 补足 ACT 到现代 adaptive-depth / halting 路线的训练思想，适合读 MoR 前预习。
- **A** [Deep Equilibrium Models](https://arxiv.org/abs/1909.01377) (2019) — 学习 h*=F(h*)、Jacobian、固定点训练方法。
- **A** [Adaptive Computation Time for Recurrent Neural Networks](https://arxiv.org/abs/1603.08983) (2016) — 理解 halting/pondering 及其训练难题。
- **B** [On Expressive Power of Looped Transformers: Theoretical Analysis and Enhancement via Timestep Encoding](https://arxiv.org/abs/2410.01405) (2024) — 回答循环共享权重会带来哪些表达能力约束。
- **B** [ALBERT: A Lite BERT for Self-supervised Learning of Language Representations](https://arxiv.org/abs/1909.11942) (2019) — 有助于区分「权重共享」与「自适应推理深度」。
- **B** [Neural GPUs Learn Algorithms](https://arxiv.org/abs/1511.08228) (2016) — 从历史源头理解：为什么共享权重、增加计算步数可能更擅长算法任务。

### 架构与预训练

- **S** [Training-Free Looped Transformers](https://arxiv.org/abs/2605.23872) (2026) — 理解为什么直接多调用一次层会退化，而 damped refinement 可行。
- **S** [Towards Looped Models Done Right, Part I: Topology, Input Injection, Recurrent-State Design](https://arxiv.org/abs/2610.23036) (2026) — 最适合系统理解什么架构设计真正起作用。
- **S** [Looping Beyond Twice: A Scalable Recipe for Looped Mixture-of-Experts](https://arxiv.org/abs/2610.01153) (2026) — 揭示限制多次循环的两件事：表示漂移和专家路由塌缩。
- **S** [From Growing to Looping: A Unified View of Iterative Computation in LLMs](https://proceedings.mlr.press/v306/kapl26a.html) (2026) — 不是照着论文堆一个新的 Loop 结构，而是解释为什么深度增长与循环可能具有相似的迭代计算功能。
- **S** [Scaling up Test-Time Compute with Latent Reasoning: A Recurrent Depth Approach](https://arxiv.org/abs/2502.05171) (2025) — 理解 recurrent block、随机深度训练、测试时增加循环次数。
- **S** [Scaling Latent Reasoning via Looped Language Models](https://arxiv.org/abs/2510.25741) (2025) — 理解 loop-native 预训练、知识操纵和多深度出口的实际效果。
- **S** [MoEUT: Mixture-of-Experts Universal Transformers](https://arxiv.org/abs/2405.16039) (2024) — 现代 Looped MoE 热潮的重要早期连接点：如何兼顾共享权重的参数效率和模型容量。
- **A** [Loop the Loopies!](https://arxiv.org/abs/2607.16051) (2026) — 与 Huginn / Ouro 对照阅读，形成架构消融视角。
- **A** [Allocating Recurrent Compute in Looped Language Models](https://arxiv.org/abs/2608.18230) (2026) — 适合优化硬件瓶颈与结构搜索。
- **A** [How to Loop MoE: Flatten the Experts, Untie the Attention](https://arxiv.org/abs/2609.35751) (2026) — 看「专家权重共享」和「注意力权重共享」的不同作用。
- **A** [LoopCoder-v2: Only Loop Once for Efficient Test-Time Computation Scaling](https://arxiv.org/abs/2606.18023) (2026) — 对 coding LLM 和「循环次数是不是越多越好」很有参考价值。
- **A** [Relaxed Recursive Transformers: Effective Parameter Sharing with Layer-wise LoRA](https://arxiv.org/abs/2410.20672) (2025) — 适合研究存量 checkpoint 改造、层绑定和低秩特化。
- **A** [Teaching Pretrained Language Models to Think Deeper with Retrofitted Recurrence](https://arxiv.org/abs/2511.07384) (2025) — 非常适合只有现成 checkpoint、不想从头预训练的研究。

### 动态计算与训练

- **S** [Closing the Loop: Practical Training Recipes for Looped Language Models](https://arxiv.org/abs/2610.00673) (2026) — 如果计划亲自训小模型，这是优先读的工程型论文。
- **S** [Stabilizing Extrapolation in Looped Transformers via Learned Stochastic Stopping](https://arxiv.org/abs/2606.29983) (2026) — 理解「何时停止」不仅是推理策略，也是训练归纳偏置。
- **S** [Mixture-of-Recursions: Learning Dynamic Recursive Depths for Adaptive Token-Level Computation](https://arxiv.org/abs/2507.10524) (2025) — 看懂稀疏激活 token、动态深度分配和 KV 复用。
- **A** [Skip a Layer or Loop It? Learning Program-of-Layers in LLMs](https://arxiv.org/abs/2606.06574) (2026) — 适合延伸到动态路由、编译执行图、模型层调用策略。
- **A** [Prioritize the Process, Not Just the Outcome: Rewarding Latent Thought Trajectories Improves Reasoning in Looped Language Models](https://arxiv.org/abs/2602.10520) (2026) — 如果关心 Loop + RL / process reward，这篇重要。
- **A** [LoopRPT: Reinforcement Pre-Training for Looped Language Models](https://arxiv.org/abs/2603.19714) (2026) — 研究如何给无文字思维链的循环模型提供训练反馈。

### 部署与推理系统

- **S** [The Surprising Effectiveness of Shared Memory in Looped Transformers](https://arxiv.org/abs/2610.02383) (2026) — 非常适合做 KV Cache 优化与架构设计。
- **S** [LoopSpec: Pipelined Self-Speculative Decoding for Looped Transformers](https://arxiv.org/abs/2609.17184) (2026) — Loop 的多深度出口天然提供 speculative decoding 信号。
- **S** [Decoding Looped Transformers Better for (Almost) Free](https://arxiv.org/abs/2610.02185) (2026) — 把中间轨迹从训练副产品转化成提升解码质量的资源。
- **S** [Parallel Loop Transformer for Efficient Test-Time Computation Scaling](https://arxiv.org/abs/2510.24824) (2025) — 分析为什么循环不一定需要完全串行地跑完每一轮。
- **A** [Memory-Efficient Looped Transformer: Decoupling Compute from Memory in Looped Language Models](https://arxiv.org/abs/2605.07721) (2026) — 帮助理解反复算 block 为什么不意味着必须重复存每轮 KV。
- **A** [FlashLoop: Fast and Memory-Efficient Looped Transformers via Lazy Updates](https://arxiv.org/abs/2609.29812) (2026) — 真正讨论 end-to-end 速度，而不只是参数压缩。
- **A** [LoopAhead: Speculating Ahead for Faster Decoding in Looped Language Models](https://arxiv.org/abs/2610.21594) (2026) — 与 LoopSpec 对照看流水线调度和多 token 预猜的收益。

### 稳定性与 Scaling

- **S** [Towards Looped Models Done Right, Part II: Rethinking at Fixed Points](https://arxiv.org/abs/2610.06833) (2026) — 将训练稳定性、推理速度、KV Cache 和 RL 放到同一框架。
- **S** [Scaling Laws for Looped Mixture of Experts](https://arxiv.org/abs/2609.40316) (2026) — 做大模型架构与训练预算研究最值得读的 2026 年新论文之一。
- **S** [Parcae: Scaling Laws For Stable Looped Language Models](https://arxiv.org/abs/2604.12946) (2026) — 如果关心为什么 K 大会 loss spike 或隐状态发散，这是最重要的论文之一。
- **S** [How Much Is One Recurrence Worth? Iso-Depth Scaling Laws for Looped Language Models](https://arxiv.org/abs/2604.21106) (2026) — 防止把少参数误认为训练算力最优，是必读的反面约束证据。
- **S** [Fixed-Point Reasoners: Stable and Adaptive Deep Looped Transformers](https://arxiv.org/abs/2606.18206) (2026) — 适合研究 adaptive halting 和状态收敛诊断。
- **S** [Think Shallow, Solve Deep: Controlling Recurrent Dynamics for Reliable Test-Time Depth](https://arxiv.org/abs/2608.18222) (2026) — 直面「测试 K > 训练 K 时何时有帮助」的问题。
- **S** [How Model Growth, Recursion, and Boundary Operators Influence Scaling Exponents](https://arxiv.org/abs/2609.19107) (2026) — 为计算深度提供与参数量、数据量并列的实证分析框架，并对比权重共享与非共享增长。
- **A** [Loop-$\mu$P: Residual Scaling and Hyperparameter Transfer in Looped Transformers](https://arxiv.org/abs/2606.18524) (2026) — 有助于设计从小尺度迁移到大 K 的训练超参。
- **A** [SCORE: Replacing Layer Stacking with Contractive Recurrent Depth](https://arxiv.org/abs/2603.10544) (2026) — 从 contraction 的角度建立 loop 的理论安全边界。
- **A** [Simply Stabilizing the Loop via Fully Looped Transformer](https://arxiv.org/abs/2605.18797) (2026) — 值得用作 loop 深度与稳定性的消融 baseline。
- **A** [DeepLoop: Depth Scaling for Looped Transformers](https://arxiv.org/abs/2607.13491) (2026) — 对尝试 8、16、32 次循环的实验有实用价值。
- **A** [Solve the Loop: Attractor Models for Language and Reasoning](https://arxiv.org/abs/2605.12466) (2026) — 连接 Deep Equilibrium、attractor 与 recurrent-depth。

### 机制与评测

- **A** [Looped Transformers as Optimizers](https://arxiv.org/abs/2609.37379) (2026) — 将内部思考和优化动力学的概念联系起来。
- **A** [Shared Weights, Selected Computations: How Looped Transformers Route What Each Loop Does](https://arxiv.org/abs/2609.39892) (2026) — 理解共享参数并不意味着每轮做完全相同的事。
- **A** [Beyond the Training Horizon: Mechanisms and Limits of Length Generalization in Looped Transformers](https://arxiv.org/abs/2609.33144) (2026) — 适合研究真正的状态传播与看似成功的任务启发式之间的区别。
- **A** [On the Chain-of-Thought Monitorability of Looped Language Models](https://arxiv.org/abs/2610.02741) (2026) — 学习如何审视 latent reasoning 可解释性与安全争议。
- **B** [LayerNorm as Implicit Gain Control in Looped Transformers](https://arxiv.org/abs/2607.10681) (2026) — 给稳定化技巧提供动力系统解释。
- **B** [Looped Transformers under the Jacobian Lens: Does the Global Workspace Survive Recurrence?](https://arxiv.org/abs/2609.01924) (2026) — 有兴趣做机制可解释性可以读。
- **B** [Loop, Think, & Generalize: Implicit Reasoning in Recurrent-Depth Transformers](https://arxiv.org/abs/2604.07822) (2026) — 有助于设计对 recurrence 真正敏感的泛化 benchmark。

### 推理与适配

- **S** [Bridging the Gap Between Latent and Explicit Reasoning with Looped Transformers](https://arxiv.org/abs/2606.31779) (2026) — 非常适合研究 latent CoT 与显式 CoT 的效果差距。

### 多模态与关联

- **A** [Looped Diffusion Transformer](https://arxiv.org/abs/2609.40305) (2026) — 清晰区分 loop-depth 与 diffusion 的 denoising steps。
- **A** [LiFT: Loop Flow Transformers](https://arxiv.org/abs/2610.05538) (2026) — 研究 loop 与 flow matching、连续深度条件的融合。
- **A** [Hierarchical Reasoning Model](https://arxiv.org/abs/2506.21734) (2025) — 对照平坦循环、分层循环与状态更新频率。
- **A** [Less is More: Recursive Reasoning with Tiny Networks](https://arxiv.org/abs/2510.04871) (2025) — 与 HRM 对照理解简单递归是否足以替代复杂层级设计。
- **A** [Efficient Parallel Samplers for Recurrent-Depth Models and Their Connection to Diffusion Language Models](https://arxiv.org/abs/2510.14961) (2025) — 适合你关心的 Looped Transformer 与 dLLM 关系。
- **A** [Training Large Language Models to Reason in a Continuous Latent Space](https://arxiv.org/abs/2412.06769) (2024) — 与 loop 对照理解「隐状态思考」不一定需要深度权重共享。
- **B** [Recurrent Looped Transformer](https://arxiv.org/abs/2610.07591) (2026) — 有助于辨析「跨深度循环」与「跨 token 状态反馈」。

## Blog · 8 条

### 架构与预训练

- **S** [Towards Looped Models Done Right — Part I: Topology, Input Injection, Recurrent-State Design](https://huskydoge.github.io/husky-blog/posts/recursive_models/towards-looped-models-done-right/) (2026) — 中文读者读完两篇 Huginn/Ouro 后，非常推荐以此作为体系化综合材料。
- **S** [Looped-GPT: Looping During Pre-training improves Generalization](https://sanyalsunny111.github.io/posts/2026-01-15-post1-looped-gpt/) (2026) — 最好入手的动手实验资料。

### 动态计算与训练

- **S** [Loop-Model FLOPs and Memory in an Ablation Chain](https://huskydoge.github.io/husky-blog/posts/recursive_models/loop-cost/) (2026) — 做 loop 训练的读者最值得细读的工程博客。

### 稳定性与 Scaling

- **A** [Exact Input Writes Improve Stable Looped Language Models](https://huskydoge.github.io/husky-blog/posts/recursive_models/improve-parcae/) (2026) — 看如何从动力系统方程推导可验证的训练改进。
- **A** [Computational depth is all you need: Towards 10^7-layer neural nets](https://qlabs.sh/research/depth/) (2026) — 值得理解前沿研究为何重新重视 depth scaling；文章含明确的模型与 scaling 实验及引文。

### 基础与理论

- **A** [GPT-6 Astra, Looped Transformers, and Hidden Reasoning](https://magazine.sebastianraschka.com/p/gpt-6-astra-looped-transformers-and) (2026) — 适合从现代语言模型视角建立直观认识。
- **B** [Looped Transformers, or Recurrent Depth Models](https://alituncgenc.com/en/posts/looped-transformers-recurrent-depth-models/) (2026) — 适合在读正式论文前先建立直观概念，并获得常见讨论的背景。
- **B** [Adaptive Computation Time (ACT) in Neural Networks [3/3]](https://moocaholic.medium.com/adaptive-computation-time-act-in-neural-networks-3-3-99452b2eff18) (2020) — 先读完 Universal Transformer 再读这篇会很顺畅。

## Project · 7 条

### 架构与预训练

- **S** [xLLM-Loop: Official Code for Towards Looped Models Done Right](https://github.com/ifm-ai/xllm-loop) (2026) — 真正想复现或做科研实验时优先看这里：同一训练框架内控制拓扑、输入注入和深度策略。
- **S** [Scaling Latent Reasoning via Looped Language Models — Official Project](https://ouro-llm.github.io/) (2025) — 希望实际下载和测试 Ouro 的人应该从这里开始。

### 稳定性与 Scaling

- **A** [How Much Is One Recurrence Worth? — Project Site](https://kschwethelm.github.io/looped-lm-scaling/) (2026) — 直观理解共享循环与独立参数容量的训练算力权衡。

### 机制与评测

- **A** [Awesome Loop Models](https://github.com/huskydoge/Awesome-Loop-Models) (2026) — 做二次研究检索的重要入口。

### 基础与理论

- **A** [Looped Language Models: A Survey and Meta-Analysis of Recurrent-Depth Transformers](https://github.com/ArminAzizi98/looped-lm-survey) (2026) — 深度研究前利用其索引查漏，并留意对照实验是否可比。
- **A** [Awesome Loop Transformer — Chinese Deep-Dive Reports & Translations](https://github.com/asimfish/awesome_loop_transformer) (2026) — 读英文 Paper 之前快速补背景、核对概念特别方便；也可用来查找本精选站暂未收录的细分文章。
- **B** [Awesome Loop Transformers — Bilingual Reading Atlas](https://github.com/Mrkkew/Awesome-Loop-Transformers) (2026) — 适合作为交叉核验与覆盖补充入口。
