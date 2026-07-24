"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { MathBlock, InlineMath } from "@/components/math-block";
import { CodeBlock } from "@/components/code-block";
import { blogPosts } from "@/lib/blog-data";
import { BASE_PATH } from "@/lib/base-path";

// 可折叠卡片组件 — 与第一篇保持一致
function CollapsibleCard({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mt-6 mb-4 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-left"
      >
        <span className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</span>
        <svg
          className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
          transition: "grid-template-rows 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.25s ease-out",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="p-5 pt-0 text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const post = blogPosts.find((p) => p.slug === "vae-2-color")!;
const seriesPosts = blogPosts
  .filter((p) => p.series?.name.zh === post.series?.name.zh && p.published)
  .sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));

// ══════════════════════════════════════════════════════════════
// 双语内容定义
// ══════════════════════════════════════════════════════════════
const content = {
  zh: {
    // ── 动机 ──
    h2_motivation: "为什么要做彩色？",
    motivation_p1: "第一篇文章中，我们用 VAE 生成了灰度手写数字——784 个像素，每像素只有一个灰度值。现实中绝大多数图片都是彩色的：红绿灯、医疗影像、自然风光——色彩本身携带了重要信息。",
    motivation_p2: "从灰度到彩色的跨越看似简单（1 通道变 3 通道），实际上引发了一连串新问题：<strong>模型架构怎么改？损失函数还适用吗？怎么让模型学会画正确的颜色？</strong>",
    motivation_p3: "这篇文章记录了在灰度 VAE 基础上扩展彩色生成的全过程——包括一次意料之外的失败、根因分析、以及最终带来的优化工具箱升级。",

    // ── 架构升级 ──
    h2_arch: "架构升级：从灰度到彩色",
    arch_overview: "从第一篇的灰度 VAE 到这里，架构层面有四处关键改动。下图是改动前后对照：",

    // 对照表
    arch_compare: "第一篇灰度 VAE vs 本篇彩色 VAE 架构对照",
    arch_thead_dim: "维度",
    arch_thead_gray: "第一篇（灰度）",
    arch_thead_color: "本篇（彩色）",
    arch_thead_reason: "原因",
    arch_row_input: "输入通道",
    arch_row_input_gray: "1（灰度）",
    arch_row_input_color: "3（RGB）",
    arch_row_input_reason: "彩色图需要 R/G/B 三个独立通道",
    arch_row_conv: "卷积层数",
    arch_row_conv_gray: "2 层",
    arch_row_conv_color: "3 层",
    arch_row_conv_reason: "2 层 → 7×7 特征图不够深，3 层 → 4×4 让单点覆盖更大感受野",
    arch_row_latent: "潜在空间维度",
    arch_row_latent_gray: "4",
    arch_row_latent_color: "16",
    arch_row_latent_reason: "2352 像素用 4 个数压缩（588:1）太狠，16 给更多表达空间",
    arch_row_loss: "重建损失",
    arch_row_loss_gray: "MSE × 784",
    arch_row_loss_color: "BCE（sum/batch）",
    arch_row_loss_reason: "BCE 对边界像素梯度更尖锐，避免 MSE 的「灰度雾」",

    h3_model: "模型改动详解",
    model_p1: "编码器和解码器都从 2 层卷积升级到 3 层，并适配了 3 通道输入/输出：",

    model_enc_title: "Encoder（3 层卷积 · 无标签条件版）",
    model_enc_path: "空间压缩路径：",
    model_enc_path_detail: "28×28 → 14×14 → 7×7 → 4×4",
    model_enc_chan: "通道变化：",
    model_enc_chan_detail: "3 → 32 → 64 → 128（每降一次分辨率，通道翻倍）",
    model_enc_fc: "展平后维度：",
    model_enc_fc_detail: "128 通道 × 4 × 4 = <strong>2048</strong> 维，接入 fc_mu 和 fc_logvar，各输出 16 维",

    model_dec_title: "Decoder（3 层转置卷积 · 无标签条件版）",
    model_dec_path: "空间放大路径：",
    model_dec_path_detail: "4×4 → 7×7 → 14×14 → 28×28",
    model_dec_odd: "⚠️ 关键细节：第一层反卷积用 <code>output_padding=0</code>，从 4 放大到 7 而非 8。因为编码器在 stride=2 下采样时，7 是奇数——PyTorch 的 Conv2d 取 floor，7÷2=3.5→3，加 padding 后输出为 ⌊(3+2×1−3)/2⌋+1 = 4。解码器必须逆向还原到 7，否则 7→8 会导致尺寸不匹配。",
    model_dec_output: "最终 Sigmoid 输出：",

    model_latent_note: "注意：当前代码仓库（vae_color/model.py）中模型已经包含了 CVAE 的标签嵌入层。上面展示的是实验 #1~#3 使用的纯 VAE 版本——无标签条件，3 层卷积，16 维潜在空间。标签嵌入是下一篇的主题。",

    h3_data: "数据改动：ColoredMNIST",
    data_p1: "MNIST 是灰度数据集，每张图只有一个亮度通道。要让它变成彩色，核心思路是：<code>img.repeat(3, 1, 1)</code> 把单通道扩展为 3 通道，然后乘上一个颜色向量 <code>[R, G, B]</code>。",
    data_p2: "关键问题是<strong>颜色从哪来</strong>。下面会讲到，这个选择直接决定了实验的成败。",
    data_code_title: "ColoredMNIST 数据集包装类",

    // ── 染色问题 ──
    h2_coloring: "染色问题：一次失败的调试过程",
    coloring_p1: "这是整个项目最有价值的一次「失败」。说它失败，因为模型确实跑通了、loss 也正常收敛；说它有价值，因为最终的输出完全不是我们想要的。",

    h3_random: "实验 #1：随机染色（2026-06-28 · 3 分钟 · val_loss = 302.23）",
    random_p1: "最初的想法很直觉：给每张 MNIST 图片乘一个随机颜色系数（0.3~1.0 之间的三个随机数），生成「五颜六色」的数字。变体越多，模型学到的颜色能力应该越强——至少我们是这么想的。",
    random_formula: "colored_img = gray_img.repeat(3, 1, 1) ∗ [R, G, B]（三个随机数）",
    random_p2: "训练跑了 100 轮，一切正常——loss 从 640 降到 302，KL 稳定在 5~7，早停也没触发。打开生成的图片，<strong>全是灰度</strong>——所有数字的 R≈G≈B。模型自适应地「学会」了忽略颜色。",

    h3_root: "根因分析：颜色信号太弱",
    root_p1: "为什么模型选择忽略颜色？不是 bug，是<strong>最优解</strong>。让我们算一笔账：",
    root_li1: "MNIST 数字的<strong>笔画像素只占图片的 ~15%</strong>——剩下 85% 是纯黑背景",
    root_li2: "输出灰度（R=G=B=某个值）vs 正确彩色的 BCE 差异：每像素仅 ~0.14",
    root_li3: "颜色信号占总 loss 的 <strong>~0.6%</strong>——模型在形状上多费一点力，loss 降得更多",
    root_conclusion: "模型不是「画不对」，而是「算过账后觉得不值得」。加大颜色系数范围只是让颜色更鲜艳，没改变「颜色是噪声」的本质——同一张图的不同 epoch 随机染色不同，颜色的每次出现都在告诉模型「这个信息不可靠」。",

    h3_fix: "实验 #2：按类染色（2026-06-28 · 3 分钟 · val_loss = 252.35 · ↓16.5%）",
    fix_p1: "解决思路很简单：<strong>把颜色绑定到数字类别</strong>。0~9 各分配一种固定鲜明的颜色：",
    fix_table_head: "数字 → 颜色对照",
    fix_p2: "颜色一绑定到类别，立即变成语义信号：画红色的不可能是 3，画蓝色的不可能是 7。模型必须准确区分 R/G/B 三个通道，画出正确的颜色组合。",
    fix_p3: "改动极小（dataset 包装类中一行：<code>colored_img = img.repeat(3, 1, 1) * CLASS_COLORS[label]</code>），但效果立竿见影：val_loss 从 302 降到 252（↓16.5%），颜色成功输出，重建质量同步提升。",

    // ── 优化工具箱 ──
    h2_optimization: "优化工具箱：从「跑通」到「跑好」",
    optimize_p1: "在修复染色问题的同时，我们对训练过程做了一整套优化。这些改进彼此独立，可以单独使用，也可以组合。下面逐一说明每项改进「解决了什么问题」和「为什么这样设计」。",

    h3_bce: "BCE 替代 MSE",
    bce_p1: "第一篇中我们用 MSE 做重建损失。MSE 的缺点在生成任务中很明显：当一个边缘像素有时黑有时白时，MSE 的最优输出是 0.5（灰色）——这就是「灰度雾」效应。",
    bce_p2: "BCE（Binary Cross Entropy）的梯度在 0.5 处最大，明确「惩罚」模糊不清。loss 从 <code>mse_loss(reduction='mean') * 2352</code> 改为 <code>bce_loss(reduction='sum') / batch_size</code>——不需要手动乘系数，BCE 的 sum/batch 天然在几十量级，和 KL 散度自动平衡。",
    bce_code_title: "BCE 重建损失",

    h3_beta: "β 系数与 KL 预热",
    beta_p1: "VAE 的训练本质上是一场拔河：<strong>重建损失想把每张图的 z 拉开（越散重建越准），KL 散度想把所有 z 挤到标准高斯周围（越聚生成越好）。</strong>",
    beta_p2: "引入 <strong>β 系数</strong>来控制这场拔河的权重。β < 1 偏向重建质量，β > 1 偏向生成效果。对于彩色 MNIST 这种相对简单的数据，β = 0.05（重建:KL = 20:1）效果最好——先保证能画清楚，再谈生成能力。",
    beta_formula: "L = L_recon + β × D_KL",
    beta_p3: "但 β 不能直接用在训练初期。epoch 0 的 KL 散度可能达到数千（随机初始化的 fc_logvar 输出大正值 → exp 爆炸），如果此时 β=0.05，KL 梯度仍是 recon 的几十倍。",
    beta_p4: "<strong>KL 预热（warm-up）</strong>解决这个问题：前 20 轮 kl_weight 从 0 线性增长到 β。编码器前 20 轮只关心重建，不受 KL 约束；第 21 轮起逐步引入 KL，在已有编码能力上微调，而非推倒重来。",

    h3_scheduler: "余弦退火学习率",
    scheduler_p1: "固定学习率的问题是后期「刹不住车」。参数接近最优时梯度很小，但 lr × 小梯度仍可能跨过谷底→对面坡→下一轮跨回来→无限震荡。",
    scheduler_p2: "余弦退火（CosineAnnealingLR）让学习率从 0.001 平滑降到 1e-5：前期大步赶路，后期小碎步踩准。T_max 设为 epoch 总数，eta_min 设一个很小的底值。",

    h3_clip: "自适应梯度裁剪",
    clip_p1: "梯度裁剪用于防止梯度爆炸。但固定阈值有一个矛盾：训练前期梯度大（5~10），阈值设 1 会砍掉 80% 的有效步长，拖慢训练；后期梯度小（0.1~0.5），阈值设 10 等于没有保护。",
    clip_p2: "自适应方案：维护一个梯度范数的<strong>指数移动平均（EMA）</strong>，只有当当前梯度超过历史均值的 5 倍时才裁剪。前期均值大，阈值自动放宽；后期均值小，阈值自动收紧。",
    clip_code_title: "自适应梯度裁剪",

    h3_early: "早停 + 验证集",
    early_p1: "第一篇中我们用了全部 6 万张 MNIST 训练，打印的是训练 loss——永远在下降，看不出是否过拟合。",
    early_p2: "改进：把数据分成 5 万训练 + 1 万验证。验证集不参与训练，每轮用来独立评估。当 val_loss 连续 10 轮不创新低时自动停止，保存的是 val_loss 最低那轮的权重。",
    early_p3: "不过在这个场景下，早停从未触发——所有 3 个实验都跑满了 100 轮。这说明模型还没有明显过拟合，但收益递减很严重（epoch 50 后的改善微乎其微）。",

    // ── 实验总览 ──
    h2_experiments: "实验总览",
    experiments_p1: "下面是本篇涉及的 3 个实验的完整对比。所有实验都在服务器 GPU 上运行，每次约 3 分钟，100 个 epoch。",
    exp_table_title: "本篇实验对比",
    exp_th_exp: "实验",
    exp_th_key: "关键配置",
    exp_th_val: "最佳 val_loss",
    exp_th_color: "染色",
    exp_th_note: "说明",
    exp1_key: "latent=8, β=0.1, 随机染色",
    exp1_note: "全灰度输出，染色失败",
    exp2_key: "latent=8, β=0.1, 按类染色",
    exp2_note: "染色成功，较 #1 ↓16.5%",
    exp3_key: "latent=16, β=0.05, 按类染色",
    exp3_note: "再降 10.9%，最佳精度",

    experiments_p2: "三次实验的 loss 下降路径：",
    exp_trend_h3: "Loss 下降趋势",
    exp_trend_1: "实验 #1→#2（改染色方式）：val_loss 302 → 252，下降 16.5%。这是最大的一跳——不是改模型、不是调参数，而是修正了数据的构造方式。",
    exp_trend_2: "实验 #2→#3（改架构参数）：val_loss 252 → 225，下降 10.9%。latent_size 8→16 给模型更大的隐空间，β 0.1→0.05 让模型更偏重建精度。",
    exp_trend_3: "共同特征：~95% 的学习发生在 KL 预热期（前 20 轮）。预热结束后，后 70 轮的改善不到 6 个 loss 点。",

    experiments_p3: "这些实验数据的完整记录在 <a href='https://github.com/Muanyan-mjq/The_simple_vae' target='_blank' rel='noopener noreferrer' class='text-indigo-600 dark:text-indigo-400 hover:underline'>GitHub 仓库</a> 的 <code>EXPERIMENT_LOG.md</code> 和 <code>CHANGELOG.md</code> 中，包括每轮 loss 数值、收敛曲线分析等细节。",

    // ── 训练代码全貌 ──
    h2_train: "训练代码全貌",
    train_p1: "包含了上述所有优化的完整训练循环：",
    train_code_title: "训练脚本（train.py 核心逻辑）",
    train_params: "最终的超参数配置：",
    train_param_list: "batch_size=256, num_epochs=100, lr=0.001→1e-5, latent_size=16, β=0.05, warmup_epochs=20, patience=10",

    // ── 总结 ──
    h2_summary: "总结与回顾",
    summary_p1: "这篇文章不是「调了几个参数 loss 降了多少」的流水账。核心收获有三个层面：",

    summary_h3_debug: "调试方法论：从现象到根因",
    summary_debug_p1: "当模型输出不符合预期时，最容易犯的错误是盲目改参数。实验 #1 的灰度输出，根因不是「网络太浅」或「学习率太大」——根因是<strong>数据构造方式让颜色信号弱到模型选择了忽略</strong>。改模型架构解决不了这个问题，改染色方式才能。",
    summary_debug_p2: "养成习惯：先分析 <strong>loss 在罚什么</strong>，再动手改。这里一个像素的颜色差异只有 0.14 BCE，而整个 batch 的形状重建损失有几百。模型的最优策略当然是「忽略那 0.14，全力优化那几百」。",

    summary_h3_toolkit: "工程化训练：从脚本到实验",
    summary_toolkit_p1: "第一篇的训练代码是「能跑就行」——全数据训练、固定学习率、无验证、无早停。这一篇引入了一整套工程实践：train/val 分集、早停、学习率调度、梯度裁剪。这些不是 VAE 特有的，是任何深度学习训练的基础设施。",
    summary_toolkit_p2: "其中最有价值的单项改进是<strong>自适应梯度裁剪</strong>——固定阈值在训练前期和后期取值差两个数量级，要找一个一刀切的值根本不可能。EMA 自适应阈值省去了反复试阈值的麻烦。",

    summary_h3_beta: "β 的哲学：一场精心控制的拔河",
    summary_beta_p1: "β 系数是这篇实验中最微妙的参数。0.1 时重建还行但 KL 太松、生成质量一般；0.05 时重建最好但 KL 更松；0.01 时 KL 几乎消失、latent 空间失去约束。没有「最优 β」——它只代表你在「画得清楚」和「画得多样」之间的站队。",
    summary_beta_p2: "KL 预热是 β 的必要配套。训练初期 encoder 输出混乱，直接引入 KL 会让它学会「输出 0，装作标准高斯」——这就是后验坍缩（posterior collapse）。预热给了 encoder 先用重建学习内容，再慢慢被 KL 规整的机会。",

    summary_h3_next: "下一步：条件生成 CVAE",
    summary_next_p1: "现在的 VAE 只能随机生成——你没法说「给我画一个红色的 5」，它可能画出蓝色的 7。下一篇将在模型中加入<strong>标签条件</strong>，让 encoder 和 decoder 都「知道」当前是什么数字。这就是 CVAE（Conditional VAE）——从随机生成到可控生成的关键一步。",
    summary_next_p2: "预告：CVAE 的 loss 提升不大（仅 1%），但定性收益远超定量——它能做到 VAE 做不到的按需生成。详见下一篇。",

    h2_ref: "参考资源",
    ref_li1: "代码仓库：",
    ref_li2: "第一篇：",
    ref_li3: "实验记录：项目中的 ",
    ref_li4: "原始 VAE 论文：",
  },

  // ═══════════════════════════════════════
  // English
  // ═══════════════════════════════════════
  en: {
    h2_motivation: "Why Color?",
    motivation_p1: "In the first article, we used VAE to generate grayscale handwritten digits — 784 pixels, each with a single intensity value. But most real-world images are in color: traffic lights, medical scans, natural landscapes — color itself carries important information.",
    motivation_p2: "The leap from grayscale to color seems simple (1 channel → 3 channels), but it triggers a cascade of new questions: <strong>How should the model architecture change? Is the loss function still suitable? How do we make the model learn the right colors?</strong>",
    motivation_p3: "This article documents the full process of extending grayscale VAE to color generation — including an unexpected failure, root cause analysis, and the optimization toolkit that emerged from it.",

    h2_arch: "Architecture Upgrade: From Grayscale to Color",
    arch_overview: "From Part 1's grayscale VAE to here, there are four key architectural changes:",
    arch_compare: "Part 1 Grayscale VAE vs This Article's Color VAE",
    arch_thead_dim: "Dimension",
    arch_thead_gray: "Part 1 (Grayscale)",
    arch_thead_color: "This Article (Color)",
    arch_thead_reason: "Reason",
    arch_row_input: "Input channels",
    arch_row_input_gray: "1 (grayscale)",
    arch_row_input_color: "3 (RGB)",
    arch_row_input_reason: "Color images need independent R/G/B channels",
    arch_row_conv: "Conv layers",
    arch_row_conv_gray: "2 layers",
    arch_row_conv_color: "3 layers",
    arch_row_conv_reason: "2 layers → 7×7 features not deep enough; 3 layers → larger receptive field at 4×4",
    arch_row_latent: "Latent dims",
    arch_row_latent_gray: "4",
    arch_row_latent_color: "16",
    arch_row_latent_reason: "Compressing 2352 pixels into 4 numbers (588:1) is too aggressive; 16 gives more expressive capacity",
    arch_row_loss: "Reconstruction loss",
    arch_row_loss_gray: "MSE × 784",
    arch_row_loss_color: "BCE (sum/batch)",
    arch_row_loss_reason: "BCE has sharper gradients at boundary pixels, avoiding MSE's \"gray fog\"",

    h3_model: "Model Changes in Detail",
    model_p1: "Both encoder and decoder upgraded from 2 layers to 3, and adapted to 3-channel input/output:",
    model_enc_title: "Encoder (3-layer conv · no label conditioning)",
    model_enc_path: "Spatial compression path:",
    model_enc_path_detail: "28×28 → 14×14 → 7×7 → 4×4",
    model_enc_chan: "Channel changes:",
    model_enc_chan_detail: "3 → 32 → 64 → 128 (doubling channels as resolution halves)",
    model_enc_fc: "After flattening:",
    model_enc_fc_detail: "128 channels × 4 × 4 = <strong>2048</strong> dims, fed into fc_mu and fc_logvar, each outputting 16 dims",
    model_dec_title: "Decoder (3-layer transposed conv · no label conditioning)",
    model_dec_path: "Spatial upscaling path:",
    model_dec_path_detail: "4×4 → 7×7 → 14×14 → 28×28",
    model_dec_odd: "⚠️ Key detail: the first deconv layer uses <code>output_padding=0</code>, going from 4→7 instead of 4→8. This is because the encoder's stride-2 downsampling on an odd-sized 7×7 feature map uses floor division: 7÷2=3.5→3, so output is ⌊(3+2×1−3)/2⌋+1 = 4. The decoder must reverse exactly to 7, or dimensions won't match.",
    model_dec_output: "Final Sigmoid output: [3, 28, 28]",
    model_latent_note: "Note: the current codebase (vae_color/model.py) already includes CVAE label embeddings. What's shown above is the pure VAE version used in experiments #1–#3 — no label conditioning, 3 conv layers, 16 latent dimensions. Label embeddings are next article's topic.",

    h3_data: "Data Changes: ColoredMNIST",
    data_p1: "MNIST is a grayscale dataset — each image has only one brightness channel. To make it colorful, the core idea is: <code>img.repeat(3, 1, 1)</code> expands to 3 channels, then multiply by a color vector <code>[R, G, B]</code>.",
    data_p2: "The critical question is <strong>where the colors come from</strong>. As we'll see below, this choice directly determines whether the experiment succeeds or fails.",
    data_code_title: "ColoredMNIST Dataset Wrapper",

    h2_coloring: "The Coloring Problem: A Debugging Story",
    coloring_p1: "This is the most valuable 'failure' in the entire project. It's a failure because the model ran fine and loss converged normally; it's valuable because the output was nothing like what we wanted.",

    h3_random: "Experiment #1: Random Coloring (2026-06-28 · 3 min · val_loss = 302.23)",
    random_p1: "The initial idea was intuitive: multiply each MNIST image by a random color coefficient (three random numbers between 0.3~1.0), producing 'colorful' digits. More variation should mean better color learning — or so we thought.",
    random_formula: "colored_img = gray_img.repeat(3, 1, 1) ∗ [R, G, B] (three random numbers)",
    random_p2: "Training ran for 100 epochs, everything looked normal — loss dropped from 640 to 302, KL stabilized at 5~7, early stopping never triggered. Opened the generated images: <strong>all grayscale</strong> — every digit had R≈G≈B. The model had adaptively 'learned' to ignore color.",

    h3_root: "Root Cause Analysis: Color Signal Too Weak",
    root_p1: "Why did the model choose to ignore color? Not a bug — it found the <strong>optimal solution</strong>. Let's do the math:",
    root_li1: "Stroke pixels account for only <strong>~15%</strong> of the image — the remaining 85% is pure black background",
    root_li2: "BCE difference between outputting grayscale (R=G=B=some value) vs correct color: only ~0.14 per stroke pixel",
    root_li3: "Color signal accounts for <strong>~0.6%</strong> of total loss — the model gets more loss reduction by improving shape reconstruction",
    root_conclusion: "The model didn't 'fail to learn color' — it calculated that learning color wasn't worth the effort. Expanding the color coefficient range only made colors more vivid; it didn't change the fundamental problem: <strong>random coloring makes color a noise signal</strong>. If the same digit is red in epoch 1 and blue in epoch 4, the color information is unreliable by design.",

    h3_fix: "Experiment #2: Per-Class Coloring (2026-06-28 · 3 min · val_loss = 252.35 · ↓16.5%)",
    fix_p1: "The solution was simple: <strong>bind color to digit class</strong>. Assign each digit 0–9 a fixed, distinct color:",
    fix_table_head: "Digit → Color Mapping",
    fix_p2: "Once color is bound to class, it becomes a semantic signal: red can't be digit 3, blue can't be digit 7. The model must accurately distinguish R/G/B channels to reconstruct correctly.",
    fix_p3: "The code change was minimal (one line in the dataset wrapper: <code>colored_img = img.repeat(3, 1, 1) * CLASS_COLORS[label]</code>), but the effect was immediate: val_loss dropped from 302 to 252 (↓16.5%), colors rendered correctly, and reconstruction quality improved simultaneously.",

    h2_optimization: "The Optimization Toolkit: From Working to Working Well",
    optimize_p1: "While fixing the coloring problem, we also built out a full optimization toolkit. Each improvement is independent and addresses a specific problem. Here's what each one solves and why it's designed this way.",

    h3_bce: "BCE Replaces MSE",
    bce_p1: "In Part 1 we used MSE for reconstruction loss. MSE's weakness in generation tasks is well-known: when a boundary pixel is sometimes black and sometimes white, MSE's optimal output is 0.5 (gray) — this is the 'gray fog' effect.",
    bce_p2: "BCE (Binary Cross Entropy) has its maximum gradient at 0.5, explicitly penalizing ambiguity. The loss changes from <code>mse_loss(reduction='mean') * 2352</code> to <code>bce_loss(reduction='sum') / batch_size</code> — no manual coefficient needed; BCE's sum/batch naturally sits in the tens range, automatically balancing against KL divergence.",
    bce_code_title: "BCE Reconstruction Loss",

    h3_beta: "β Coefficient & KL Warm-up",
    beta_p1: "VAE training is essentially a tug-of-war: <strong>reconstruction loss wants to spread out each image's z (further apart = better reconstruction), while KL divergence wants to squeeze all z toward standard Gaussian (closer together = better generation).</strong>",
    beta_p2: "Introduce <strong>β coefficient</strong> to control this tug-of-war. β < 1 favors reconstruction quality, β > 1 favors generation diversity. For colored MNIST — relatively simple data — β = 0.05 (recon:KL = 20:1) works best: nail the reconstruction first, then worry about generation.",
    beta_formula: "L = L_recon + β × D_KL",
    beta_p3: "But β can't be applied directly from the start. At epoch 0, KL divergence can reach thousands (randomly initialized fc_logvar outputs large positive values → exp explosion). Even with β=0.05, KL gradients would still dominate recon by dozens of times.",
    beta_p4: "<strong>KL warm-up</strong> solves this: for the first 20 epochs, kl_weight linearly ramps from 0 to β. The encoder learns content from reconstruction alone for 20 epochs; KL is gradually introduced afterward, fine-tuning rather than bulldozing the existing encoding.",

    h3_scheduler: "Cosine Annealing Learning Rate",
    scheduler_p1: "The problem with fixed learning rate is that it 'can't brake' in late training. When parameters near optimal, gradients become tiny — but lr × tiny_gradient can still overshoot the valley, land on the opposite slope, overshoot back next round, and oscillate forever.",
    scheduler_p2: "Cosine annealing (CosineAnnealingLR) smoothly decays lr from 0.001 to 1e-5: big strides early, tiny steps later. T_max equals total epochs, eta_min is a small floor value.",

    h3_clip: "Adaptive Gradient Clipping",
    clip_p1: "Gradient clipping prevents gradient explosion. But fixed thresholds have a contradiction: early in training, gradients are large (5~10), so a threshold of 1 would cut 80% of effective step size; late in training, gradients are small (0.1~0.5), so a threshold of 10 offers no protection.",
    clip_p2: "Adaptive solution: maintain an <strong>exponential moving average (EMA)</strong> of gradient norms, and only clip when the current gradient exceeds 5× the historical mean. Early on, the mean is large so the threshold is automatically loose; later, the mean shrinks so the threshold tightens.",
    clip_code_title: "Adaptive Gradient Clipping",

    h3_early: "Early Stopping + Validation Set",
    early_p1: "In Part 1, we trained on all 60K MNIST images and printed training loss — which always decreases, making overfitting invisible.",
    early_p2: "Improvement: split data into 50K training + 10K validation. The validation set never participates in training; it's used for independent evaluation each epoch. When val_loss hasn't improved for 10 consecutive epochs, training stops automatically, saving the weights from the epoch with the lowest val_loss.",
    early_p3: "In this case, early stopping never triggered — all 3 experiments ran the full 100 epochs. This means no significant overfitting, but diminishing returns were severe (improvements after epoch 50 were negligible).",

    h2_experiments: "Experiment Overview",
    experiments_p1: "Below is the complete comparison of the 3 experiments covered in this article. All experiments ran on a server GPU, approximately 3 minutes each, 100 epochs.",
    exp_table_title: "Experiment Comparison",
    exp_th_exp: "Experiment",
    exp_th_key: "Key Config",
    exp_th_val: "Best val_loss",
    exp_th_color: "Coloring",
    exp_th_note: "Notes",
    exp1_key: "latent=8, β=0.1, random coloring",
    exp1_note: "All grayscale output, coloring failed",
    exp2_key: "latent=8, β=0.1, per-class coloring",
    exp2_note: "Coloring succeeded, ↓16.5% vs #1",
    exp3_key: "latent=16, β=0.05, per-class coloring",
    exp3_note: "Further ↓10.9%, best accuracy",

    experiments_p2: "Loss reduction path across the three experiments:",
    exp_trend_h3: "Loss Trends",
    exp_trend_1: "Experiment #1→#2 (coloring strategy): val_loss 302 → 252, ↓16.5%. The biggest single jump — not from changing the model or tuning parameters, but from <strong>fixing how the data was constructed</strong>.",
    exp_trend_2: "Experiment #2→#3 (architecture parameters): val_loss 252 → 225, ↓10.9%. latent_size 8→16 gives more latent capacity; β 0.1→0.05 shifts the bias further toward reconstruction quality.",
    exp_trend_3: "Common pattern: ~95% of learning happens during the KL warm-up period (first 20 epochs). After warm-up, the remaining 70+ epochs improve by less than 6 loss points.",

    experiments_p3: "Complete experimental records — including per-epoch loss values and convergence analysis — are in the <a href='https://github.com/Muanyan-mjq/The_simple_vae' target='_blank' rel='noopener noreferrer' class='text-indigo-600 dark:text-indigo-400 hover:underline'>GitHub repo</a>'s <code>EXPERIMENT_LOG.md</code> and <code>CHANGELOG.md</code>.",

    h2_train: "Training Code Overview",
    train_p1: "The complete training loop incorporating all the optimizations above:",
    train_code_title: "Training Script (train.py core logic)",
    train_params: "Final hyperparameter configuration:",
    train_param_list: "batch_size=256, num_epochs=100, lr=0.001→1e-5, latent_size=16, β=0.05, warmup_epochs=20, patience=10",

    h2_summary: "Summary & Review",
    summary_p1: "This article isn't a 'tweaked some parameters and improved loss' log. The core takeaways are on three levels:",

    summary_h3_debug: "Debugging Methodology: From Symptom to Root Cause",
    summary_debug_p1: "When model output doesn't match expectations, the easiest mistake is blindly changing parameters. Experiment #1's grayscale output had nothing to do with 'network too shallow' or 'learning rate too high' — the root cause was <strong>the data construction made the color signal so weak the model chose to ignore it</strong>. Changing the model architecture wouldn't fix this; changing the coloring strategy would.",
    summary_debug_p2: "Build the habit: first analyze <strong>what the loss is actually penalizing</strong>, then act. Here, the color difference per pixel was only 0.14 BCE, while shape reconstruction loss for the whole batch was in the hundreds. The model's optimal strategy was obviously 'ignore that 0.14, focus entirely on those hundreds'.",

    summary_h3_toolkit: "Engineering Training: From Script to Experiment",
    summary_toolkit_p1: "Part 1's training code was 'just make it run' — full data training, fixed learning rate, no validation, no early stopping. This article introduces a full set of engineering practices: train/val split, early stopping, learning rate scheduling, gradient clipping. These aren't VAE-specific — they're infrastructure for any deep learning training.",
    summary_toolkit_p2: "The single most valuable addition is <strong>adaptive gradient clipping</strong> — fixed thresholds differ by two orders of magnitude between early and late training, making a universal value impossible. EMA-adaptive thresholds eliminate the trial-and-error of tuning clip values.",

    summary_h3_beta: "The Philosophy of β: A Carefully Orchestrated Tug-of-War",
    summary_beta_p1: "β is the most subtle parameter in these experiments. At 0.1, reconstruction is decent but KL is too loose and generation quality suffers; at 0.05, reconstruction is best but KL is even looser; at 0.01, KL nearly vanishes and latent space loses all constraint. There is no 'optimal β' — it only represents where you stand between 'draw clearly' and 'draw diversely'.",
    summary_beta_p2: "KL warm-up is β's necessary companion. In early training, the encoder's output is chaotic — directly introducing KL would teach it to 'output 0, pretend to be standard Gaussian'. That's posterior collapse. Warm-up gives the encoder a chance to learn content from reconstruction first, then gradually add KL regularization.",

    summary_h3_next: "Next: Conditional Generation with CVAE",
    summary_next_p1: "The current VAE can only generate randomly — you can't say 'draw a red 5'. The next article will add <strong>label conditioning</strong> to the model, making both encoder and decoder 'aware' of which digit they're processing. That's CVAE (Conditional VAE) — the leap from random generation to controllable generation.",
    summary_next_p2: "Preview: CVAE's loss improvement is minimal (only ~1%), but the qualitative gain far exceeds the quantitative — it enables class-specific generation that VAE simply can't do. Details in the next article.",

    h2_ref: "References",
    ref_li1: "Code repository: ",
    ref_li2: "Part 1: ",
    ref_li3: "Experiment logs: ",
    ref_li4: "Original VAE paper: ",
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 代码块双语定义
// ══════════════════════════════════════════════════════════════
const codeBlocks = {
  encoder: {
    zh: `class Encoder(nn.Module):
    def __init__(self, latent_size):
        super(Encoder, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=2, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        # 输出均值和对数方差
        self.fc_mu = nn.Linear(128*4*4, latent_size)
        self.fc_logvar = nn.Linear(128*4*4, latent_size)

    def forward(self, x):
        x = F.leaky_relu(self.bn1(self.conv1(x)))  # 28×28 → 14×14
        x = F.leaky_relu(self.bn2(self.conv2(x)))  # 14×14 → 7×7
        x = F.leaky_relu(self.bn3(self.conv3(x)))  # 7×7 → 4×4
        x = x.flatten(1)                            # 展平为 2048 维
        mu = self.fc_mu(x)                          # 输出均值 μ
        logvar = self.fc_logvar(x)                  # 输出对数方差 log(σ²)
        return mu, logvar`,
    en: `class Encoder(nn.Module):
    def __init__(self, latent_size):
        super(Encoder, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=2, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        # Output mean and log-variance
        self.fc_mu = nn.Linear(128*4*4, latent_size)
        self.fc_logvar = nn.Linear(128*4*4, latent_size)

    def forward(self, x):
        x = F.leaky_relu(self.bn1(self.conv1(x)))  # 28×28 → 14×14
        x = F.leaky_relu(self.bn2(self.conv2(x)))  # 14×14 → 7×7
        x = F.leaky_relu(self.bn3(self.conv3(x)))  # 7×7 → 4×4
        x = x.flatten(1)                            # Flatten to 2048 dims
        mu = self.fc_mu(x)                          # Output mean μ
        logvar = self.fc_logvar(x)                  # Output log-variance log(σ²)
        return mu, logvar`,
  },
  decoder: {
    zh: `class Decoder(nn.Module):
    def __init__(self, latent_size):
        super(Decoder, self).__init__()
        self.fc = nn.Linear(latent_size, 128*4*4)
        self.bn_fc = nn.BatchNorm1d(128*4*4)
        # output_padding=0：4→7（匹配 encoder 的奇数尺寸）
        self.deconv1 = nn.ConvTranspose2d(128, 64, kernel_size=3, stride=2, padding=1, output_padding=0)
        self.bn1 = nn.BatchNorm2d(64)
        self.deconv2 = nn.ConvTranspose2d(64, 32, kernel_size=3, stride=2, padding=1, output_padding=1)
        self.bn2 = nn.BatchNorm2d(32)
        self.deconv3 = nn.ConvTranspose2d(32, 3, kernel_size=3, stride=2, padding=1, output_padding=1)

    def forward(self, z):
        x = F.leaky_relu(self.bn_fc(self.fc(z)))     # z → 2048 维
        x = x.view(-1, 128, 4, 4)                    # 重塑为特征图
        x = F.leaky_relu(self.bn1(self.deconv1(x)))  # 4×4 → 7×7
        x = F.leaky_relu(self.bn2(self.deconv2(x)))  # 7×7 → 14×14
        x = torch.sigmoid(self.deconv3(x))            # 14×14 → 28×28, 3 通道
        return x`,
    en: `class Decoder(nn.Module):
    def __init__(self, latent_size):
        super(Decoder, self).__init__()
        self.fc = nn.Linear(latent_size, 128*4*4)
        self.bn_fc = nn.BatchNorm1d(128*4*4)
        # output_padding=0: 4→7 (matching encoder's odd-sized feature map)
        self.deconv1 = nn.ConvTranspose2d(128, 64, kernel_size=3, stride=2, padding=1, output_padding=0)
        self.bn1 = nn.BatchNorm2d(64)
        self.deconv2 = nn.ConvTranspose2d(64, 32, kernel_size=3, stride=2, padding=1, output_padding=1)
        self.bn2 = nn.BatchNorm2d(32)
        self.deconv3 = nn.ConvTranspose2d(32, 3, kernel_size=3, stride=2, padding=1, output_padding=1)

    def forward(self, z):
        x = F.leaky_relu(self.bn_fc(self.fc(z)))     # z → 2048 dims
        x = x.view(-1, 128, 4, 4)                    # Reshape to feature map
        x = F.leaky_relu(self.bn1(self.deconv1(x)))  # 4×4 → 7×7
        x = F.leaky_relu(self.bn2(self.deconv2(x)))  # 7×7 → 14×14
        x = torch.sigmoid(self.deconv3(x))            # 14×14 → 28×28, 3 channels
        return x`,
  },
  dataset: {
    zh: `# 10 种数字 → 10 种固定颜色
CLASS_COLORS = torch.tensor([
    [1.0, 0.3, 0.3],  # 0: 红
    [0.3, 1.0, 0.3],  # 1: 绿
    [0.3, 0.4, 1.0],  # 2: 蓝
    [1.0, 1.0, 0.3],  # 3: 黄
    [0.8, 0.3, 1.0],  # 4: 紫
    [0.3, 1.0, 1.0],  # 5: 青
    [1.0, 0.6, 0.3],  # 6: 橙
    [1.0, 0.4, 0.7],  # 7: 粉
    [0.5, 1.0, 0.4],  # 8: 草绿
    [0.3, 0.8, 0.8],  # 9: 蓝绿
]).view(10, 3, 1, 1)

class ColoredMNIST(Dataset):
    def __init__(self, dataset):
        self.dataset = dataset

    def __getitem__(self, idx):
        img, label = self.dataset[idx]
        color = CLASS_COLORS[label]           # [3, 1, 1]
        colored_img = img.repeat(3, 1, 1) * color
        return colored_img, label`,
    en: `# 10 digits → 10 fixed colors
CLASS_COLORS = torch.tensor([
    [1.0, 0.3, 0.3],  # 0: Red
    [0.3, 1.0, 0.3],  # 1: Green
    [0.3, 0.4, 1.0],  # 2: Blue
    [1.0, 1.0, 0.3],  # 3: Yellow
    [0.8, 0.3, 1.0],  # 4: Purple
    [0.3, 1.0, 1.0],  # 5: Cyan
    [1.0, 0.6, 0.3],  # 6: Orange
    [1.0, 0.4, 0.7],  # 7: Pink
    [0.5, 1.0, 0.4],  # 8: Grass-green
    [0.3, 0.8, 0.8],  # 9: Teal
]).view(10, 3, 1, 1)

class ColoredMNIST(Dataset):
    def __init__(self, dataset):
        self.dataset = dataset

    def __getitem__(self, idx):
        img, label = self.dataset[idx]
        color = CLASS_COLORS[label]           # [3, 1, 1]
        colored_img = img.repeat(3, 1, 1) * color
        return colored_img, label`,
  },
  train: {
    zh: `for epoch in range(num_epochs):
    vae.train()
    kl_weight = beta * min(1.0, epoch / warmup_epochs)

    for inputs, _ in train_loader:
        inputs = inputs.to(device)
        optimizer.zero_grad()

        # 前向传播
        recon_x, mu, logvar = vae(inputs)

        # 计算损失
        recon_loss = F.binary_cross_entropy(recon_x, inputs, reduction='sum') / inputs.size(0)
        kl_loss = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())
        loss = recon_loss + kl_weight * kl_loss

        # 反向传播
        loss.backward()

        # 自适应梯度裁剪
        total_norm = clip_grad_norm_(vae.parameters(), max_norm=float('inf'))
        threshold = grad_ema * 5.0
        clip_grad_norm_(vae.parameters(), max_norm=threshold)
        grad_ema = 0.9 * grad_ema + 0.1 * total_norm

        optimizer.step()

    scheduler.step()  # 余弦退火

    # 验证阶段 + 早停检查
    val_loss = evaluate(vae, val_loader)
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        torch.save(vae.state_dict(), 'best_model.pth')
    elif patience_counter >= patience:
        break`,
    en: `for epoch in range(num_epochs):
    vae.train()
    kl_weight = beta * min(1.0, epoch / warmup_epochs)

    for inputs, _ in train_loader:
        inputs = inputs.to(device)
        optimizer.zero_grad()

        # Forward pass
        recon_x, mu, logvar = vae(inputs)

        # Compute loss
        recon_loss = F.binary_cross_entropy(recon_x, inputs, reduction='sum') / inputs.size(0)
        kl_loss = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())
        loss = recon_loss + kl_weight * kl_loss

        # Backward pass
        loss.backward()

        # Adaptive gradient clipping
        total_norm = clip_grad_norm_(vae.parameters(), max_norm=float('inf'))
        threshold = grad_ema * 5.0
        clip_grad_norm_(vae.parameters(), max_norm=threshold)
        grad_ema = 0.9 * grad_ema + 0.1 * total_norm

        optimizer.step()

    scheduler.step()  # Cosine annealing

    # Validation + early stopping
    val_loss = evaluate(vae, val_loader)
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        torch.save(vae.state_dict(), 'best_model.pth')
    elif patience_counter >= patience:
        break`,
  },
};

// ══════════════════════════════════════════════════════════════
// 颜色对照数据
// ══════════════════════════════════════════════════════════════
const colorMap = [
  { digit: "0", color: "红 Red", rgb: "(1.0, 0.3, 0.3)", bg: "#fecaca" },
  { digit: "1", color: "绿 Green", rgb: "(0.3, 1.0, 0.3)", bg: "#bbf7d0" },
  { digit: "2", color: "蓝 Blue", rgb: "(0.3, 0.4, 1.0)", bg: "#bfdbfe" },
  { digit: "3", color: "黄 Yellow", rgb: "(1.0, 1.0, 0.3)", bg: "#fef08a" },
  { digit: "4", color: "紫 Purple", rgb: "(0.8, 0.3, 1.0)", bg: "#e9d5ff" },
  { digit: "5", color: "青 Cyan", rgb: "(0.3, 1.0, 1.0)", bg: "#a5f3fc" },
  { digit: "6", color: "橙 Orange", rgb: "(1.0, 0.6, 0.3)", bg: "#fed7aa" },
  { digit: "7", color: "粉 Pink", rgb: "(1.0, 0.4, 0.7)", bg: "#fbcfe8" },
  { digit: "8", color: "草绿 Grass", rgb: "(0.5, 1.0, 0.4)", bg: "#d9f99d" },
  { digit: "9", color: "蓝绿 Teal", rgb: "(0.3, 0.8, 0.8)", bg: "#99f6e4" },
];

export default function VAEPost2() {
  const { lang } = useLang();
  const c = content[lang];

  return (
    <BlogPostLayout post={post} seriesPosts={seriesPosts}>
      {/* ── 动机 ── */}
      <h2>{c.h2_motivation}</h2>
      <p>{c.motivation_p1}</p>
      <p dangerouslySetInnerHTML={{ __html: c.motivation_p2 }} />
      <p>{c.motivation_p3}</p>

      {/* ── 架构升级 ── */}
      <h2>{c.h2_arch}</h2>
      <p>{c.arch_overview}</p>

      {/* 对照表 */}
      <div className="my-8 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-zinc-300 dark:border-zinc-700">
              <th className="text-left p-3 font-semibold text-zinc-900 dark:text-white">{c.arch_thead_dim}</th>
              <th className="text-left p-3 font-semibold text-zinc-500 dark:text-zinc-400">{c.arch_thead_gray}</th>
              <th className="text-left p-3 font-semibold text-indigo-600 dark:text-indigo-400">{c.arch_thead_color}</th>
              <th className="text-left p-3 font-semibold text-zinc-900 dark:text-white">{c.arch_thead_reason}</th>
            </tr>
          </thead>
          <tbody className="text-zinc-800 dark:text-zinc-200">
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="p-3 font-medium">{c.arch_row_input}</td>
              <td className="p-3 text-zinc-500">{c.arch_row_input_gray}</td>
              <td className="p-3 text-indigo-600 dark:text-indigo-400 font-semibold">{c.arch_row_input_color}</td>
              <td className="p-3">{c.arch_row_input_reason}</td>
            </tr>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="p-3 font-medium">{c.arch_row_conv}</td>
              <td className="p-3 text-zinc-500">{c.arch_row_conv_gray}</td>
              <td className="p-3 text-indigo-600 dark:text-indigo-400 font-semibold">{c.arch_row_conv_color}</td>
              <td className="p-3">{c.arch_row_conv_reason}</td>
            </tr>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="p-3 font-medium">{c.arch_row_latent}</td>
              <td className="p-3 text-zinc-500">{c.arch_row_latent_gray}</td>
              <td className="p-3 text-indigo-600 dark:text-indigo-400 font-semibold">{c.arch_row_latent_color}</td>
              <td className="p-3">{c.arch_row_latent_reason}</td>
            </tr>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="p-3 font-medium">{c.arch_row_loss}</td>
              <td className="p-3 text-zinc-500">{c.arch_row_loss_gray}</td>
              <td className="p-3 text-indigo-600 dark:text-indigo-400 font-semibold">{c.arch_row_loss_color}</td>
              <td className="p-3">{c.arch_row_loss_reason}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          {lang === "zh" ? "▲ 第一篇灰度 VAE vs 本篇彩色 VAE 架构对照" : "▲ Part 1 Grayscale VAE vs This Article's Color VAE"}
        </p>
      </div>

      <h3>{c.h3_model}</h3>
      <p>{c.model_p1}</p>

      <p className="text-lg font-semibold text-zinc-900 dark:text-white mt-6 mb-2">{c.model_enc_title}</p>
      <CodeBlock language="python">{codeBlocks.encoder[lang]}</CodeBlock>
      <p>
        {c.model_enc_path}<strong>{c.model_enc_path_detail}</strong><br />
        {c.model_enc_chan}{c.model_enc_chan_detail}<br />
        {c.model_enc_fc}<span dangerouslySetInnerHTML={{ __html: c.model_enc_fc_detail }} />
      </p>

      <p className="text-lg font-semibold text-zinc-900 dark:text-white mt-8 mb-2">{c.model_dec_title}</p>
      <CodeBlock language="python">{codeBlocks.decoder[lang]}</CodeBlock>
      <p>
        {c.model_dec_path}<strong>{c.model_dec_path_detail}</strong><br />
        {c.model_dec_output}[3, 28, 28]
      </p>

      {/* output_padding 细节 */}
      <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200" dangerouslySetInnerHTML={{ __html: c.model_dec_odd }} />
      </div>

      {/* latent note */}
      <div className="mt-6 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.model_latent_note}</p>
      </div>

      <h3>{c.h3_data}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.data_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: c.data_p2 }} />
      <p>{c.data_code_title}：</p>
      <CodeBlock language="python">{codeBlocks.dataset[lang]}</CodeBlock>

      {/* ── 染色问题 ── */}
      <h2>{c.h2_coloring}</h2>
      <p>{c.coloring_p1}</p>

      <h3>{c.h3_random}</h3>
      <p>{c.random_p1}</p>
      <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400 my-3">{c.random_formula}</p>
      <p dangerouslySetInnerHTML={{ __html: c.random_p2 }} />

      <h3>{c.h3_root}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.root_p1 }} />
      <ul>
        <li dangerouslySetInnerHTML={{ __html: c.root_li1 }} />
        <li dangerouslySetInnerHTML={{ __html: c.root_li2 }} />
        <li dangerouslySetInnerHTML={{ __html: c.root_li3 }} />
      </ul>
      <p dangerouslySetInnerHTML={{ __html: c.root_conclusion }} />

      <h3>{c.h3_fix}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.fix_p1 }} />

      {/* 颜色对照表 */}
      <div className="my-6 grid grid-cols-2 sm:grid-cols-5 gap-2">
        {colorMap.map((item) => (
          <div
            key={item.digit}
            className="p-3 rounded-xl text-center border border-zinc-200 dark:border-zinc-800 transition-all hover:scale-105"
            style={{ backgroundColor: item.bg }}
          >
            <div className="text-2xl font-bold text-zinc-800 mb-1">{item.digit}</div>
            <div className="text-xs text-zinc-600 leading-tight">
              {lang === "zh" ? item.color.split(" ")[0] : item.color.split(" ")[1]}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{item.rgb}</div>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-2 mb-6">
        {c.fix_table_head}
      </p>

      <p dangerouslySetInnerHTML={{ __html: c.fix_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: c.fix_p3 }} />

      {/* ── 优化工具箱 ── */}
      <h2>{c.h2_optimization}</h2>
      <p>{c.optimize_p1}</p>

      {/* BCE */}
      <h3>{c.h3_bce}</h3>
      <p>{c.bce_p1}</p>
      <p dangerouslySetInnerHTML={{ __html: c.bce_p2 }} />
      <p>{c.bce_code_title}：</p>
      <CodeBlock language="python">{`# 旧：MSE（第一篇）
recon_loss = F.mse_loss(recon_x, inputs, reduction='mean') * 2352

# 新：BCE（本篇）
recon_loss = F.binary_cross_entropy(recon_x, inputs, reduction='sum') / inputs.size(0)`}</CodeBlock>

      {/* β 系数与 KL 预热 */}
      <h3>{c.h3_beta}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.beta_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: c.beta_p2 }} />
      <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400 my-3">{c.beta_formula}</p>
      <p>{c.beta_p3}</p>
      <p dangerouslySetInnerHTML={{ __html: c.beta_p4 }} />

      {/* KL warm-up 公式 */}
      <MathBlock>{"\\text{kl\\_weight} = \\beta \\times \\min\\left(1.0,\\ \\frac{\\text{epoch}}{\\text{warmup\\_epochs}}\\right)"}</MathBlock>

      {/* 余弦退火 */}
      <h3>{c.h3_scheduler}</h3>
      <p>{c.scheduler_p1}</p>
      <p>{c.scheduler_p2}</p>

      {/* 自适应梯度裁剪 */}
      <h3>{c.h3_clip}</h3>
      <p>{c.clip_p1}</p>
      <p dangerouslySetInnerHTML={{ __html: c.clip_p2 }} />
      <p>{c.clip_code_title}：</p>
      <CodeBlock language="python">{`# 自适应梯度裁剪（EMA 动态阈值）
total_norm = clip_grad_norm_(model.parameters(), max_norm=float('inf'))  # 只读不裁
threshold = grad_ema * 5.0                                               # 历史均值 × 5
clip_grad_norm_(model.parameters(), max_norm=threshold)                  # 真正裁剪
grad_ema = 0.9 * grad_ema + 0.1 * total_norm                            # 更新 EMA`}</CodeBlock>

      {/* 早停 */}
      <h3>{c.h3_early}</h3>
      <p>{c.early_p1}</p>
      <p>{c.early_p2}</p>
      <p>{c.early_p3}</p>

      {/* ── 实验总览 ── */}
      <h2>{c.h2_experiments}</h2>
      <p>{c.experiments_p1}</p>

      <div className="my-8 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-zinc-300 dark:border-zinc-700">
              <th className="text-left p-3 font-semibold text-zinc-900 dark:text-white">{c.exp_th_exp}</th>
              <th className="text-left p-3 font-semibold text-zinc-900 dark:text-white">{c.exp_th_key}</th>
              <th className="text-right p-3 font-semibold text-zinc-900 dark:text-white">{c.exp_th_val}</th>
              <th className="text-center p-3 font-semibold text-zinc-900 dark:text-white">{c.exp_th_color}</th>
              <th className="text-left p-3 font-semibold text-zinc-900 dark:text-white">{c.exp_th_note}</th>
            </tr>
          </thead>
          <tbody className="text-zinc-800 dark:text-zinc-200">
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="p-3 font-bold">#1</td>
              <td className="p-3">{c.exp1_key}</td>
              <td className="p-3 text-right font-mono text-red-600 dark:text-red-400">302.23</td>
              <td className="p-3 text-center text-red-500">❌</td>
              <td className="p-3">{c.exp1_note}</td>
            </tr>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="p-3 font-bold">#2</td>
              <td className="p-3">{c.exp2_key}</td>
              <td className="p-3 text-right font-mono text-amber-600 dark:text-amber-400">252.35</td>
              <td className="p-3 text-center text-emerald-500">✅</td>
              <td className="p-3">{c.exp2_note}</td>
            </tr>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="p-3 font-bold">#3</td>
              <td className="p-3">{c.exp3_key}</td>
              <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">224.80</td>
              <td className="p-3 text-center text-emerald-500">✅</td>
              <td className="p-3">{c.exp3_note}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">{c.exp_table_title}</p>
      </div>

      <p>{c.experiments_p2}</p>

      <h3>{c.exp_trend_h3}</h3>
      <ul>
        <li dangerouslySetInnerHTML={{ __html: c.exp_trend_1 }} />
        <li dangerouslySetInnerHTML={{ __html: c.exp_trend_2 }} />
        <li dangerouslySetInnerHTML={{ __html: c.exp_trend_3 }} />
      </ul>

      <p dangerouslySetInnerHTML={{ __html: c.experiments_p3 }} />

      {/* ── 训练代码全貌 ── */}
      <h2>{c.h2_train}</h2>
      <p>{c.train_p1}</p>
      <CodeBlock language="python">{codeBlocks.train[lang]}</CodeBlock>
      <p><strong>{c.train_params}</strong> {c.train_param_list}</p>

      {/* ── 总结 ── */}
      <h2>{c.h2_summary}</h2>
      <p>{c.summary_p1}</p>

      <h3>{c.summary_h3_debug}</h3>
      <p>{c.summary_debug_p1}</p>
      <p dangerouslySetInnerHTML={{ __html: c.summary_debug_p2 }} />

      <h3>{c.summary_h3_toolkit}</h3>
      <p>{c.summary_toolkit_p1}</p>
      <p dangerouslySetInnerHTML={{ __html: c.summary_toolkit_p2 }} />

      <h3>{c.summary_h3_beta}</h3>
      <p>{c.summary_beta_p1}</p>
      <p dangerouslySetInnerHTML={{ __html: c.summary_beta_p2 }} />

      <h3>{c.summary_h3_next}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.summary_next_p1 }} />
      <p>{c.summary_next_p2}</p>

      {/* 下一篇导航卡片 */}
      <div className="mt-12 mb-10">
        <Link
          href="/blog/vae-3-cvae"
          className="group block p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                {lang === "zh" ? "继续阅读" : "Continue Reading"}
              </p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {lang === "zh" ? "VAE 学习笔记（三）：条件生成 CVAE" : "VAE Notes (3): Conditional Generation with CVAE"}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {lang === "zh" ? "在 VAE 中加入标签条件，实现指定类别的图像生成——从「随机画数字」到「按需画特定的数字」。" : "Adding label conditioning to VAE for class-specific generation — from random digit drawing to on-demand specific digits."}
              </p>
            </div>
            <div className="shrink-0 ml-6 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* ── 上一页导航 ── */}
      <div className="mb-10">
        <Link
          href="/blog/vae-1-introduction"
          className="group block p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 transition-colors">
              <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {lang === "zh" ? "上一篇" : "Previous"}
              </p>
              <p className="text-base font-semibold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                {lang === "zh" ? "VAE 学习笔记（一）：从直觉到实现" : "VAE Notes (1): From Intuition to Implementation"}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* ── 参考资源 ── */}
      <h2>{c.h2_ref}</h2>
      <div className="mt-6 space-y-3">
        {[
          {
            icon: "💻",
            title: "vae_color",
            desc: lang === "zh" ? "本文所有代码与实验记录" : "All code and experiment logs for this article",
            href: "https://github.com/Muanyan-mjq/The_simple_vae",
            external: true,
          },
          {
            icon: "📝",
            title: lang === "zh" ? "VAE 学习笔记（一）：从直觉到实现" : "VAE Notes (1): From Intuition to Implementation",
            desc: lang === "zh" ? "本篇的前置阅读" : "Prerequisite reading for this article",
            href: `${BASE_PATH}/blog/vae-1-introduction`,
            external: false,
          },
          {
            icon: "📋",
            title: "EXPERIMENT_LOG.md / CHANGELOG.md",
            desc: lang === "zh" ? "4 次实验的完整 loss 数据与 57 条修改记录" : "Complete loss data for 4 experiments and 57 change records",
            href: "https://github.com/Muanyan-mjq/The_simple_vae",
            external: true,
          },
          {
            icon: "📄",
            title: "Kingma & Welling, Auto-Encoding Variational Bayes, 2013",
            desc: lang === "zh" ? "VAE 原始论文" : "Original VAE paper",
            href: "https://arxiv.org/abs/1312.6114",
            external: true,
          },
        ].map((item, i) => (
          <a
            key={i}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5"
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                {item.title}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
            </div>
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>
    </BlogPostLayout>
  );
}
