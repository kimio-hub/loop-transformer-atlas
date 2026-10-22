# Loop Transformer Atlas · 第二轮深度研究报告

> 截止 2026-10-22；这是研究导航和证据地图，不是系统综述的穷尽版。原始论文报告的指标并不代表本站独立复现。优先引用原始论文；少量作者博客用作工程复现参考。

## 一、这个领域究竟在研究什么？

沿**模型深度**使用同一个参数化 Transformer 更新规则，形式上记作 `h^(k+1) = F_θ(h^k, x, k)`。与堆叠 K 个参数互不相同的层不同，looping 复用 F 的参数，但不自动省掉 K 次前向 FLOPs。

至少要分清四个互相关联但不等价的方向：

1. **权重共享的固定深度**：Universal Transformer、ALBERT 等。训练和推理通常都按固定次数展开。
2. **可变深度 / latent test-time compute**：Huginn、Ouro、MoR、LoopFormer；训练深度分布与测试额外深度的泛化是独立问题。
3. **固定点 / 迭代优化**：DEQ、Done Right II、固定点动力学；收敛存在、不丢信息、有用的推理能力是三个不同命题。
4. **扩散与多步生成**：DLM 的外层 denoising time，与模型内部的 recurrent depth 可以嵌套。LoopMDM 与 ALoDLM 研究两种尺度的耦合；它们不是说标准 AR looped LM 等同于 diffusion LM。

## 二、研究证据矩阵：为什么有的论文说循环有用，有的却说无用？

| 比较条件 | 核心问题 | 代表工作 | 解释限制 |
| --- | --- | --- | --- |
| 固定训练 FLOPs / 有效深度 | 权重共享代替独立层值不值 | [Iso-Depth](https://arxiv.org/abs/2604.21106) | 报告的一次重复“等价指数”约 0.46 属于特定训练网格及拟合，不能直接移植到 MoE |
| 同总参数、激活层 / 每 token FLOPs | 稀疏路由能否让循环内部更灵活 | [LoopMoE](https://arxiv.org/abs/2606.04438) | 与 dense-loop 实验并非同一模型族 |
| 同 FLOPs、参数、KV Cache | 混杂因素控制后是否仍有 gain | [SMELT](https://arxiv.org/abs/2609.01343) | 6.8–18% 是作者报告的 compute-optimal 训练成本，不能直接当解码延迟 |
| 固定训练数据与大小 | 能否随测试深度提升任务能力 | [Huginn](https://arxiv.org/abs/2502.05171)、[Ouro](https://arxiv.org/abs/2510.25741) | 额外 loop 既可能增益也可能退化，取决训练轨迹与任务 |
| 同 token 分布与 serving 配置 | 动态深度节省能否转成端到端吞吐 | [Depth Batching](https://arxiv.org/abs/2608.09444) | 必须包括 prelude/coda、调度、缓存的真实成本 |
| 相同量化位宽与校准预算 | 是否所有循环都看到同等量化误差 | [Quantizing Looped](https://arxiv.org/abs/2609.30820) | 校准质量、模型精度与吞吐必须分开报告 |

**核心结论：** 参数效率、训练计算效率、测试时算力-精度曲线、显存占用、实测延迟是不同指标。论文中的“loop wins”需要注明它在哪个轴上 wins。

## 三、前沿研究的六个真正分歧

### 1. 参数共享是不是一个容量瓶颈？
Iso-Depth 对比展示普通 dense loop 的训练计算劣势；[Sparse Layers are Critical](https://arxiv.org/abs/2605.09165)、[LoopMoE](https://arxiv.org/abs/2606.04438) 与 [SMELT](https://arxiv.org/abs/2609.01343) 显示路由专家与循环行为差异化可能缓解这个问题。合理假设不是“loop 本身更强”，而是“结构允许低参数存储成本，同时每一步能执行不相同的有效计算”。应测专家重叠度、每轮 activation 相似度、容量和训练成本。

### 2. 为什么测试时“多想几轮”会有害？
[What Makes Recurrence Effective](https://arxiv.org/abs/2609.36636) 将 factual knowledge 和 reasoning 指标拆开；[Right Direction, Wrong Step](https://arxiv.org/abs/2609.16665) 从有限步长的过冲角度解释一类失败。[Stability and Generalization](https://arxiv.org/abs/2604.15259) 与 [Dynamical Phase Selection](https://arxiv.org/abs/2608.26556) 说明固定点收敛、可用性与更新轨迹的稳定性并非一回事。

**实验建议**：按训练循环数上下扫描 r；同时测 PPL、facts、推理正确率、每轮 residual norm/Jacobian proxy、预测熵和 confidence；给出 per-example 而不止 aggregate 曲线。

### 3. 自适应停止究竟学到了什么？
[Think-at-Hard](https://arxiv.org/abs/2511.08577)、[ANIRA](https://arxiv.org/abs/2602.08864)、[Adaptive Depth Diagnosing Gates](https://arxiv.org/abs/2607.20519) 表明应拆分：难度预测、轨迹监督、停止决策、长度外推。难 token 被分配更多计算，不代表算法泛化，也不保证判定门有效。

### 4. 隐空间更新是不是一条 CoT？
[Latent Chain-of-Thought?](https://arxiv.org/abs/2507.02199) 的 probing 限制了过度解释。不能从“中间状态变化”推导“存在类似文字的隐藏推理链”。有用的评估包括：线性读出、反事实干预、state swap、深度特征归因、局部可控性，以及相比显式 CoT 的计算成本。Loop Transformer 可以具有迭代计算，但不应被自动描述成 DLLM 或显式 CoT 替代。

### 5. 真实硬件上的效率从哪里来？
[Continuous Depth Batching](https://arxiv.org/abs/2608.09444) 优化调度；[Looped Latent Attention](https://arxiv.org/abs/2607.15456) 优化跨 loop KV；[WaveFront](https://arxiv.org/abs/2609.23033) 重排 speculative decoding；[Quantizing Looped](https://arxiv.org/abs/2609.30820) 分析校准盲区。即使参数共享，loop activations、KV、batch fragmentation 和回传内存仍可能让部署成本增加。报告显存峰值、tokens/s、TTFT、TPOT、p50/p95 latency、batch size、context length、硬件与精度。

### 6. 安全/过程评测能否跨深度迁移？
[Safe at One Loop, Risky at Another](https://arxiv.org/abs/2610.10625) 检验同一提示词跨循环深度的拒答、攻击成功与对齐迁移。训练深度的安全表现不能直接推出未训练深度的表现。对齐与深度自适应共同设计值得研究，但需要风险分层、误报率和正确性一起报告。

## 四、Diffusion 与 Loop Transformer：概念图

- **AR + loop**：每个输出 token 之前，隐藏状态重复更新 K 次，随后发射一个 token。
- **DLM**：一个带 mask/noise 的 token 集合沿 denoising steps 更新；每一步可能调用一次普通 Transformer。
- **Looped DLM**：每个 denoising step 的网络内部又进行 K 次共享层调用；对应 [LoopMDM](https://arxiv.org/abs/2605.26106)、[ALoDLM](https://arxiv.org/abs/2610.04198)。
- **二者相似点**：反复迭代状态、可按预算调整计算、可能存在收敛/稳定性问题。
- **不等价之处**：监督目标、噪声条件、token commitment、采样次序、因果 mask 与 KV 机制都可能不同。

## 五、按研究价值重排的学习路线

**路线 A · 架构与本质（入门→进阶）**：Universal Transformers → Huginn → Ouro → Towards Done Right I → SMELT。

**路线 B · Scaling / 训练机制**：Iso-Depth → Sparse Layers → LoopMoE → What Makes Recurrence Effective → LoopFormer → LoopMTP。

**路线 C · 真实部署**：Huginn/Ouro serving → Continuous Depth Batching → Looped Latent Attention → WaveFront → Quantizing Looped。

**路线 D · 理论与可解释性**：Looped as Programmable Computers → DEQ → Power Method Proof → Right Direction Wrong Step → Latent Chain-of-Thought?。

**路线 E · 与 dLLM 接轨**：Coconut（关联）→ Parallel Samplers and DLM Connection → LoopMDM → ALoDLM。

## 六、可做出可靠结论的四个实验设计

1. **Iso-budget 复现实验**：固定数据与 tokenizer；设计 dense stack、dense loop、MoE stack、MoE loop 四组；分别作 iso-params、iso-train-FLOPs、iso-inference-FLOPs 和 iso-KV 曲线。负面结果同样收录。
2. **Depth OOD / 退化审计**：训练时 r∈{2,4,8}，测试 r∈{1,…,16}；记录同一道题的 reasoning 与 facts 的曲线及残差/Jacobian proxy；固定解码预算。
3. **Halting 策略比较**：固定同一训练好的 checkpoint，对照恒定深度、熵阈值、confidence margin、单独预测器与 oracle depth；把预测器自身开销算进去；控制每个样本的整体 FLOPs。
4. **Serving + KV**：同任务同正确率，测普通 KV、跨 loop 压缩、动态 batch 和 wavefront，报告 token/s、p95、显存与吞吐/延迟 Pareto frontier；系统增益不可与模型能力增益混为一谈。

## 七、这轮资源审计与站点维护记录

- 对照 [Looped Language Models Survey](https://github.com/ArminAzizi98/looped-lm-survey) 的 557 条 core-index 作为召回池；它横跨视觉、语音、控制、应用、邻近方法，并不代表全是严格意义上的 Looped Transformer。
- 新增 24 篇论文、3 篇技术博客、2 个项目入口；保留原 82 条，合计 111 条。
- 对新增重点论文补来源、适用范围、先修、阅读重点、限制与关联阅读；重点导读从 14 增至 41 篇，重新安排学习路线。
- 纠正图像扩散 backbone 不能默认算作自回归 looped LM 的范围分类。
- 本轮使用论文在线摘要/HTML 及作者博客逐项确认核心结论，但**未对全部 111 条做逐页原文/代码复现审计**。站点是精选策展，不声称全网完备。
- **数据质量未解决项**：必须继续抽查旧目录 arXiv 标识、版本、作者、博客 URL；新增资料也应在未来做完整 benchmark table 逐项人工核验。部分新论文具有作者自报的强结果，本站不把它升级成跨机构共识。

## 八、推荐持续研究来源

[Survey 的 Core 论文索引](https://github.com/ArminAzizi98/looped-lm-survey/blob/main/data/core_papers.csv) · [Survey 的 Claim Ledger](https://github.com/ArminAzizi98/looped-lm-survey/blob/main/data/claims_ledger.csv) · [Awesome Loop Models](https://github.com/huskydoge/Awesome-Loop-Models)

**最后强调**：最值得成为本站独特价值的内容不是“更多、更快上新”，而是“每一篇结论的对照预算、失败条件、可复现证据”。把这些做成可索引的结构化研究卡片，才有望超越普通 Awesome List。
