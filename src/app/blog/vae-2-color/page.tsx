"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { MathBlock, InlineMath } from "@/components/math-block";
import { CodeBlock } from "@/components/code-block";
import { blogPosts } from "@/lib/blog-data";
import { BASE_PATH } from "@/lib/base-path";

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
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
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

const content = {
  zh: {
    // ── 动机 ──
    h2_motivation: "为什么要做彩色？",
    motivation_p1: "第一篇文章中，我们用 VAE 生成了灰度手写数字——784 个像素，每像素只有一个灰度值。现实中绝大多数图片都是彩色的：红绿灯、医疗影像、自然风光——色彩本身携带了重要信息。",
    motivation_p2: "从灰度到彩色的跨越看似简单（1 通道变 3 通道），实际上引发了一连串新问题：<strong>模型架构怎么改？损失函数还适用吗？怎么让模型学会画正确的颜色？</strong>",
    motivation_p3: "这篇文章记录了在灰度 VAE 基础上扩展彩色生成的全过程——包括一次意料之外的失败、根因分析、以及最终带来的优化工具箱升级。",

    // ── 架构升级 ──
    h2_arch: "架构升级：从灰度到彩色",
    arch_p1: "从第一篇的灰度 VAE 到这里，架构层面有四处关键改动：",

    // 对照表字段
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
    arch_row_conv_reason: "2 层特征图到 7×7 就停了；3 层到 4×4，单个特征点覆盖更大感受野",
    arch_row_latent: "潜在空间维度",
    arch_row_latent_gray: "4",
    arch_row_latent_color: "16",
    arch_row_latent_reason: "2352 像素用 4 个数压缩（588:1）太狠，16 给更多表达空间",
    arch_row_loss: "重建损失",
    arch_row_loss_gray: "MSE × 784",
    arch_row_loss_color: "BCE（sum/batch）",
    arch_row_loss_reason: "BCE 对边界像素梯度更尖锐，避免 MSE 的「灰度雾」",

    h3_model: "模型改动详解",
    model_p1: "编码器和解码器都从 2 层卷积升级到 3 层，并适配了 3 通道输入/输出。下面是本篇使用的 VAE 版本（不含标签条件，CVAE 是下一篇的主题）：",

    // Encoder
    model_enc_title: "Encoder（3 层卷积版）",
    model_enc_code_title: "Encoder 代码（model.py）",
    model_enc_explain1: "三层卷积 + 批归一化，逐步压缩空间：",
    model_enc_explain2: "28×28 → 14×14 → 7×7 → 4×4",
    model_enc_explain3: "同时通道逐层翻倍：3 → 32 → 64 → 128",
    model_enc_explain4: "展平后得到 128×4×4 = 2048 维，分别接",
    model_enc_explain5: "和",
    model_enc_explain6: "，各输出 16 维",

    model_enc_detail: "逐行解析：",
    model_enc_d1: "<code>Conv2d(3, 32, kernel_size=3, stride=2, padding=1)</code> — 输入 3 通道（RGB 彩色图），输出 32 通道，stride=2 让尺寸减半（28→14）",
    model_enc_d2: "<code>BatchNorm2d</code> — 稳定训练，加速收敛，每一层后面都跟着一个 BN",
    model_enc_d3: "<code>LeakyReLU</code> — 比 ReLU 更平滑，避免「死亡神经元」问题",
    model_enc_d4: "<code>fc_mu</code> 和 <code>fc_logvar</code> — 两个独立的全连接层，分别输出均值和对数方差",
    model_enc_d5: "为什么输出 log(σ²) 而不是 σ？因为对数可以取任意实数，数值更稳定",

    model_enc_deep: "深入理解：为什么加第三层？",
    model_enc_deep_p1: "第一篇的 2 层卷积压缩到 7×7 就停了。每个特征点对应原图约 7×7 像素的区域——对 MNIST 这种简单数字来说刚好够用，但彩色信息（R/G/B 三个通道的分布模式）需要更大的空间上下文。",
    model_enc_deep_p2: "加第三层后特征图缩小到 4×4，每个特征点覆盖更大感受野，能同时编码颜色组合和笔画形状。代价是 FC 维度从 64×7×7=3136 变为 128×4×4=2048——维度反而下降了，但信息更「浓缩」了。",
    model_enc_deep_p3: "对应地，latent_size 从 4 翻到 16：输入信息量 ×3（灰度→3 通道），压缩维度 ×4，保持了合理的压缩比 ~150:1（2352÷16），而不是灰度版的 ~200:1 或彩色 4 维的 588:1。",

    // Decoder
    model_dec_title: "Decoder（3 层转置卷积版）",
    model_dec_code_title: "Decoder 代码（model.py）",
    model_dec_explain1: "全连接层把",
    model_dec_explain2: "维潜在向量扩展为 128×4×4 的特征图",
    model_dec_explain3: "三层转置卷积逐步放大：4×4 → 7×7 → 14×14 → 28×28",
    model_dec_explain4: "最后用 Sigmoid 压缩像素值到 [0, 1]，输出 3 通道彩色图",

    model_dec_detail: "逐行解析：",
    model_dec_d1: "<code>Linear(latent_size, 128*4*4)</code> — 把 16 维潜在向量扩展成 2048 维",
    model_dec_d2: "<code>ConvTranspose2d</code> — 转置卷积，作用是放大图像尺寸。stride=2 让尺寸翻倍",
    model_dec_d3: "<code>output_padding=0</code>（第一层）— 关键细节！4→7 而非 4→8，下面详解",
    model_dec_d4: "<code>Sigmoid</code> — 把输出值压缩到 [0,1]，对应 RGB 各通道的像素值",

    model_dec_odd: "⚠️ output_padding=0：为什么第一层是 4→7 而不是 4→8？",
    model_dec_odd_p1: "编码器在 stride=2 下采样时，7 是奇数——PyTorch 的 Conv2d 取 floor：7÷2=3.5→3，加 padding 后输出为 ⌊(3+2×1−3)/2⌋+1 = 4。解码器必须逆向还原到 7，否则 7→8 会导致尺寸不匹配。",
    model_dec_odd_p2: "这是从 CIFAR-10（32×32 整除）转回 MNIST（28×28）时踩的一个坑。三十二有 2⁵ 因子可以连续除以 2 五次，但 28 只有 2²×7——第三次除 2 时就会出现奇数。",

    model_latent_note: "注意：当前代码仓库（vae_color/model.py）中模型已经包含了 CVAE 的标签嵌入层。上面展示的是实验 #1~#3 使用的纯 VAE 版本，标签嵌入是下一篇的主题。",

    // 数据改动
    h3_data: "数据改动：ColoredMNIST",
    data_p1: "MNIST 是灰度数据集，每张图只有一个亮度通道。要让它变成彩色：<code>img.repeat(3, 1, 1)</code> 把单通道扩展为 3 通道，然后乘上一个颜色向量 <code>[R, G, B]</code>。",
    data_p2: "关键问题是<strong>颜色从哪来</strong>。这个选择直接决定了实验的成败。",
    data_code_title: "ColoredMNIST 数据集包装类",

    // ── 染色问题 ──
    h2_coloring: "染色问题：一次失败的调试",
    coloring_p1: "这是整个项目最有价值的一次「失败」——模型跑通了、loss 正常收敛了、但输出完全不是我们想要的。",

    h3_random: "实验 #1：随机染色（val_loss = 302.23）",
    random_p1: "最初的想法很直觉：给每张 MNIST 图片乘一个随机颜色系数（0.3~1.0 之间的三个随机数），生成「五颜六色」的数字。变体越多，模型学到的颜色能力应该越强——至少我们是这么想的。",
    random_formula_desc: "染色公式：",
    random_p2: "训练跑了 100 轮，一切正常——loss 从 640 降到 302，KL 稳定在 5~7，早停也没触发。打开生成的图片，<strong>全是灰度</strong>。模型自适应地「学会」了忽略颜色。",

    h3_root: "根因分析：模型在算账",
    root_p1: "为什么模型选择忽略颜色？不是 bug，是<strong>最优策略</strong>。算一笔账：",
    root_li1: "MNIST 数字的<strong>笔画像素只占图片的 ~15%</strong>——剩下 85% 是纯黑背景",
    root_li2: "输出灰度（R=G=B=均值）vs 正确彩色的 BCE 差异：每像素仅 ~0.14",
    root_li3: "颜色信号占总 loss 的 <strong>~0.6%</strong>——模型在形状上多费一点力，loss 降得多得多",
    root_p2: "更进一步：同一张图在不同 epoch 颜色不同（因为是随机的），颜色没有语义含义——它纯粹是噪声。模型的最优策略是「忽略噪声，专注形状」。",
    root_conclusion: "核心教训：不是「颜色不够鲜艳」，而是「颜色作为信号不够可靠」。加大颜色系数范围让颜色更鲜艳，没有解决可靠性问题。",

    h3_fix: "实验 #2：按类染色（val_loss = 252.35 · ↓16.5%）",
    fix_p1: "解决思路很简单：<strong>把颜色绑定到数字类别</strong>。0~9 各分配一种固定鲜明的颜色。颜色变成语义信号——画红色不可能是 3，画蓝色不可能是 7。模型必须准确区分 R/G/B 通道。",
    fix_table_head: "▲ 数字 → 颜色对照表",
    fix_p2: "改动极小（dataset 中一行：<code>colored_img = img.repeat(3, 1, 1) * CLASS_COLORS[label]</code>），效果立竿见影：val_loss 从 302 降到 252（↓16.5%），颜色成功输出，重建质量同步提升。",

    fix_deep: "为什么不是「数据增强」？",
    fix_deep_p1: "有一种反驳：「随机染色可以看作数据增强，让模型更鲁棒」。但数据增强的前提是增强后的样本仍在数据分布内——MNIST 数字的灰度笔画和彩色背景不构成合理的分布。随机染色制造的是分布外的噪声，而非分布内的变体。",
    fix_deep_p2: "按类染色则是人为给每类数字强加了一个属性，把「颜色 = 类别 ID」变成了数据定义的一部分。这更像是在原始数据上叠加结构化标注，而非制造噪声。",

    // ── 优化工具箱 ──
    h2_optimization: "优化工具箱：从「跑通」到「跑好」",
    optimize_p1: "在修复染色问题的同时，我们对训练过程做了一整套优化。每项改进独立可用，下面是每项「解决什么问题」和「为什么这样设计」。",

    h3_bce: "BCE 替代 MSE",
    bce_p1: "第一篇中我们用 MSE 做重建损失。MSE 的缺点在生成任务中很明显：当一个边缘像素有时黑有时白时，MSE 的最优输出是 0.5（灰色）——这就是「灰度雾」效应。",
    bce_p2: "BCE（Binary Cross Entropy）的梯度在 0.5 处最大，明确惩罚模糊不清。从 <code>mse_loss(reduction='mean') * 2352</code> 改为 <code>bce_loss(reduction='sum') / batch_size</code>：不需要手动乘系数，BCE 的 sum/batch 天然在几十量级，和 KL 散度自动平衡。",
    bce_code_title: "重建损失对比代码",

    h3_beta: "β 系数与 KL 预热",
    beta_p1: "VAE 的训练本质上是一场拔河：<strong>重建损失想把每张图的 z 拉开（越散重建越准），KL 散度想把所有 z 挤到标准高斯周围（越聚生成越好）。</strong>",
    beta_p2: "引入 <strong>β 系数</strong>来控制权重：",
    beta_p3: "对于彩色 MNIST，β = 0.05（重建:KL = 20:1）效果最好——先保证能画清楚，再谈生成多样性。",
    beta_p4: "但 β 不能直接用在训练初期。epoch 0 的 KL 散度可能达到数千（随机初始化的 fc_logvar → exp 爆炸），即使 β=0.05，KL 梯度仍是 recon 的几十倍。",
    beta_p5: "<strong>KL 预热（warm-up）</strong>：前 20 轮 kl_weight 从 0 线性增长到 β。编码器先专注重建 20 轮，第 21 轮起逐步引入 KL，在已有能力上微调而非推倒重来。",

    h3_scheduler: "余弦退火学习率",
    scheduler_p1: "固定学习率的问题是后期「刹不住车」。参数接近最优时梯度很小，但 lr × 小梯度仍可能跨过谷底→对面坡→下一轮跨回来→无限震荡。",
    scheduler_p2: "余弦退火让学习率从 0.001 平滑降到 1e-5：前期大步赶路，后期小碎步踩准。T_max 设为 epoch 总数，eta_min 设为极小底值。",

    h3_clip: "自适应梯度裁剪",
    clip_p1: "梯度裁剪防止梯度爆炸。但固定阈值有一个矛盾：前期梯度 5~10，阈值设 1 砍掉 80% 步长；后期梯度 0.1~0.5，阈值设 10 等于没保护。",
    clip_p2: "自适应方案：维护一个梯度范数的<strong>指数移动平均（EMA）</strong>，当前梯度超过历史均值 5 倍时才裁剪。前期均值大 → 阈值自动放宽；后期均值小 → 阈值自动收紧。",
    clip_code_title: "自适应梯度裁剪代码",

    h3_early: "早停 + 验证集",
    early_p1: "第一篇用了全部 6 万张 MNIST 训练，打印训练 loss——永远在下降，看不出是否过拟合。",
    early_p2: "改进：5 万训练 + 1 万验证。验证集不参与训练，每轮独立评估。val_loss 连续 10 轮不创新低时自动停止，保存的是 val_loss 最低那轮的权重。",
    early_p3: "不过在这个场景下，早停从未触发——3 个实验都跑满了 100 轮。说明模型还没明显过拟合，但 epoch 50 后改善微乎其微。",

    // 实验 #3
    h3_exp3: "实验 #3：调参提精度（val_loss = 224.80 · ↓10.9%）",
    exp3_p1: "实验 #2 的染色问题解决了，但重建质量还有提升空间。本次同时做两项调整：<strong>latent_size 8→16</strong> 和 <strong>β 0.1→0.05</strong>。",
    exp3_p2: "latent_size 翻倍给了模型多一倍隐空间表达细节，β 减半让模型更偏重建精度。val_loss 从 252 降到 225（↓10.9%），KL 略升（5.50→6.23）——因为 KL 是对 16 个维度求和，维度翻倍后 KL 自然变大，不代表分布质量变差。",

    // ── 实验总览 ──
    h2_experiments: "实验总览",
    experiments_p1: "下面是本篇 3 个实验的完整对比。所有实验在服务器 GPU 上运行，每次约 3 分钟，100 epoch。",
    exp_table_title: "▲ 本篇实验对比",
    exp_th_exp: "实验",
    exp_th_key: "关键配置",
    exp_th_val: "最佳 val_loss",
    exp_th_color: "染色",
    exp_th_note: "说明",
    exp1_key: "latent=8, β=0.1, 随机染色",
    exp1_note: "全灰度，染色失败",
    exp2_key: "latent=8, β=0.1, 按类染色",
    exp2_note: "染色成功，↓16.5%",
    exp3_key: "latent=16, β=0.05, 按类染色",
    exp3_note: "再降 10.9%，最佳精度",

    experiments_p2: "三次实验的 loss 下降路径分析：",
    exp_trend_h3: "Loss 下降趋势",
    exp_trend_1: "<strong>#1→#2（改染色方式）</strong>：val_loss 302 → 252，↓16.5%。这是最大的一跳——不是改模型、不是调参数，是修正了数据的构造方式。",
    exp_trend_2: "<strong>#2→#3（改架构参数）</strong>：val_loss 252 → 225，↓10.9%。latent_size 翻倍给更大隐空间，β 减半偏向重建精度。",
    exp_trend_3: "<strong>共同特征</strong>：~95% 的学习发生在 KL 预热期（前 20 轮）。预热结束后，后 70 轮的改善不到 6 个 loss 点。训练到 60 轮基本就够用了。",
    experiments_p3: "完整实验数据（每轮 loss、收敛曲线等）记录在 <a href='https://github.com/Muanyan-mjq/vae-color' target='_blank' rel='noopener noreferrer' class='text-indigo-600 dark:text-indigo-400 hover:underline'>GitHub 仓库</a> 的 <code>EXPERIMENT_LOG.md</code> 中。",

    // ── 训练代码全貌 ──
    h2_train: "训练代码全貌",
    train_p1: "包含了上述所有优化的完整训练循环：",
    train_code_title: "训练脚本核心（train.py）",
    train_params: "最终超参数配置：",
    train_param_list: "batch_size=256, num_epochs=100, lr=0.001→1e-5, latent_size=16, β=0.05, warmup_epochs=20, patience=10",

    // ── 生成效果 ──
    h2_visual: "生成效果",
    visual_p1: "实验 #3 训练完成后的重建效果和随机生成效果如下。左边是原始彩色数字（按类染色），右边是 VAE 的重建结果：",
    visual_recon_caption: "▲ 重建对比：上排为原始彩色 MNIST，下排为 VAE 重建（实验 #3, latent=16, β=0.05）",
    visual_gen_caption: "▲ 随机生成：从 N(0,1) 采样潜在向量，解码得到的全新彩色数字",
    visual_note: "注意：以上图片需要从服务器生成。运行 <code>python vae_test.py</code>（需先恢复纯 VAE 版模型权重），输出在 <code>test_img/</code> 和 <code>sample_img/</code> 目录。也可以直接使用实验 #3 训练时每 10 轮自动保存的 <code>out_img/epochs_*.png</code> 和 <code>test_img/test_*.png</code>。",

    // ── 总结 ──
    h2_summary: "总结与回顾",
    summary_p1: "这篇文章不是「调了几个参数 loss 降了多少」的流水账。核心收获有三个层面：",

    summary_h3_debug: "调试方法论：从现象到根因",
    summary_debug_p1: "当模型输出不符合预期时，最容易犯的错误是盲目改参数。实验 #1 的灰度输出，根因不是网络太浅或学习率太大，是<strong>数据构造方式让颜色信号不可靠</strong>。改架构不解决这个问题，改染色方式才能。",
    summary_debug_p2: "养成习惯：先分析 <strong>loss 在罚什么</strong>，再动手改。一个像素的颜色差异只有 0.14 BCE，整个 batch 的形状重建有几百。模型的最优策略清楚得很——忽略颜色、全力学形状。这不是模型的问题，是你的数据设计有问题。",

    summary_h3_toolkit: "工程化训练：从脚本到实验",
    summary_toolkit_p1: "第一篇的训练代码是「能跑就行」——全数据训练、固定学习率、无验证、无早停。这一篇引入了一整套工程实践——这些不是 VAE 特有的，是任何深度学习训练的基础设施。",
    summary_toolkit_p2: "最有价值的单项改进是<strong>自适应梯度裁剪</strong>——固定阈值在训练前后差两个数量级，一刀切的值根本不存在。EMA 自适应阈值省去了反复试值的麻烦。",

    summary_h3_beta: "β 的哲学：一场精心控制的拔河",
    summary_beta_p1: "β 是这篇实验中最微妙的参数。0.1 时重建还行但 KL 太松；0.05 时重建最好；0.01 时 KL 几乎消失、latent 空间失去约束。没有「最优 β」——它代表你在「画得清楚」和「画得多样」之间的站队。",
    summary_beta_p2: "KL 预热是 β 的必要配套。训练初期 encoder 输出混乱，直接引入 KL 会让它学会「输出 0，装作标准高斯」——这就是后验坍缩。预热给了 encoder 先用重建学内容、再慢慢被 KL 规整的机会。",

    summary_h3_next: "下一步：条件生成 CVAE",
    summary_next_p1: "现在的 VAE 只能随机生成——你没法说「给我画一个红色的 5」。下一篇将在编码器和解码器中同时注入<strong>标签条件</strong>，让模型知道当前处理的是什么数字。这就是 CVAE——从随机生成到可控生成的关键一步。",
    summary_next_p2: "预告：CVAE 的 loss 提升只有 ~1%，但定性价值远超定量——它能做到 VAE 做不到的按需生成。",

    h2_ref: "参考资源",
    ref_li1: "代码仓库：",
    ref_li2: "第一篇：",
    ref_li3: "实验记录：",
    ref_li4: "VAE 论文：",
  },

  // ════════════════════ English ════════════════════
  en: {
    h2_motivation: "Why Color?",
    motivation_p1: "In the first article, we used VAE to generate grayscale handwritten digits — 784 pixels, each with a single intensity value. But most real-world images are in color: traffic lights, medical scans, natural landscapes — color itself carries important information.",
    motivation_p2: "The leap from grayscale to color seems simple (1 channel → 3 channels), but it triggers a cascade of new questions: <strong>How should the model architecture change? Is the loss function still suitable? How do we make the model learn the right colors?</strong>",
    motivation_p3: "This article documents the full process of extending grayscale VAE to color generation — including an unexpected failure, root cause analysis, and the optimization toolkit that emerged from it.",

    h2_arch: "Architecture Upgrade: From Grayscale to Color",
    arch_p1: "From Part 1's grayscale VAE to here, there are four key architectural changes:",

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
    arch_row_conv_reason: "2 layers stop at 7×7 feature maps; 3 layers reach 4×4 with larger receptive field per point",
    arch_row_latent: "Latent dims",
    arch_row_latent_gray: "4",
    arch_row_latent_color: "16",
    arch_row_latent_reason: "Compressing 2352 pixels into 4 numbers (588:1) is too aggressive; 16 gives more expressive capacity",
    arch_row_loss: "Reconstruction loss",
    arch_row_loss_gray: "MSE × 784",
    arch_row_loss_color: "BCE (sum/batch)",
    arch_row_loss_reason: "BCE has sharper gradients at boundary pixels, avoiding MSE's \"gray fog\"",

    h3_model: "Model Changes in Detail",
    model_p1: "Both encoder and decoder upgraded from 2 layers to 3, adapted to 3-channel I/O. Here's the pure VAE version used in experiments #1–#3 (CVAE label embeddings covered in the next article):",

    model_enc_title: "Encoder (3-layer version)",
    model_enc_code_title: "Encoder Code (model.py)",
    model_enc_explain1: "Three conv layers + BatchNorm progressively compress spatial dimensions:",
    model_enc_explain2: "28×28 → 14×14 → 7×7 → 4×4",
    model_enc_explain3: "while doubling channels: 3 → 32 → 64 → 128",
    model_enc_explain4: "After flattening: 128×4×4 = 2048 dims, fed into ",
    model_enc_explain5: " and ",
    model_enc_explain6: ", each outputting 16 dims",

    model_enc_detail: "Line-by-line breakdown:",
    model_enc_d1: "<code>Conv2d(3, 32, kernel_size=3, stride=2, padding=1)</code> — Input 3 channels (RGB), output 32 channels, stride=2 halves size (28→14)",
    model_enc_d2: "<code>BatchNorm2d</code> — Stabilizes training, accelerates convergence, follows every conv layer",
    model_enc_d3: "<code>LeakyReLU</code> — Smoother than ReLU, avoids the \"dying neuron\" problem",
    model_enc_d4: "<code>fc_mu</code> and <code>fc_logvar</code> — Two independent FC layers outputting mean and log-variance respectively",
    model_enc_d5: "Why output log(σ²) instead of σ? Log can take any real value, more numerically stable",

    model_enc_deep: "Deep Dive: Why Add a Third Layer?",
    model_enc_deep_p1: "Part 1's 2-layer encoder compressed to 7×7 feature maps. Each feature point covers roughly a 7×7 pixel patch — fine for simple MNIST digits, but color information (R/G/B distribution patterns) benefits from larger spatial context.",
    model_enc_deep_p2: "The third layer shrinks features to 4×4, where each point aggregates structural and color information from a larger receptive field. FC dims go from 64×7×7=3136 to 128×4×4=2048 — fewer dimensions but more concentrated information.",
    model_enc_deep_p3: "Correspondingly, latent_size goes from 4 to 16: input information ×3 (grayscale→3 channels), latent capacity ×4, keeping a reasonable compression ratio of ~150:1 (2352÷16), rather than the grayscale version's ~200:1 or the 4-dim color version's 588:1.",

    model_dec_title: "Decoder (3-layer version)",
    model_dec_code_title: "Decoder Code (model.py)",
    model_dec_explain1: "FC layer expands the ",
    model_dec_explain2: "-dim latent vector into a 128×4×4 feature map",
    model_dec_explain3: "Three transposed conv layers progressively upsample: 4×4 → 7×7 → 14×14 → 28×28",
    model_dec_explain4: "Final Sigmoid compresses to [0, 1], outputting 3-channel color image",

    model_dec_detail: "Line-by-line breakdown:",
    model_dec_d1: "<code>Linear(latent_size, 128*4*4)</code> — Expands the 16-dim latent vector to 2048 dims",
    model_dec_d2: "<code>ConvTranspose2d</code> — Transposed convolution, upsamples image size. stride=2 doubles dimensions",
    model_dec_d3: "<code>output_padding=0</code> (first layer) — Critical! 4→7 instead of 4→8, explained below",
    model_dec_d4: "<code>Sigmoid</code> — Compresses output to [0,1], corresponding to RGB pixel values",

    model_dec_odd: "⚠️ output_padding=0: Why 4→7 and not 4→8?",
    model_dec_odd_p1: "During the encoder's stride-2 downsampling, 7 is odd — PyTorch's Conv2d uses floor: 7÷2=3.5→3, with padding the output is ⌊(3+2×1−3)/2⌋+1 = 4. The decoder must reverse exactly to 7, or dimensions won't match.",
    model_dec_odd_p2: "This is a pitfall encountered when switching from CIFAR-10 (32×32, evenly divisible) back to MNIST (28×28). 32 = 2⁵, divisible by 2 five times; 28 = 2²×7 — the third division by 2 hits an odd number.",

    model_latent_note: "Note: the current codebase (vae_color/model.py) already includes CVAE label embeddings. What's shown above is the pure VAE version from experiments #1–#3. Label embeddings are next.",

    h3_data: "Data Changes: ColoredMNIST",
    data_p1: "MNIST is grayscale — one brightness channel per image. To make it colorful: <code>img.repeat(3, 1, 1)</code> expands to 3 channels, then multiply by a color vector <code>[R, G, B]</code>.",
    data_p2: "The critical question is <strong>where the colors come from</strong>. This choice directly determines success or failure.",
    data_code_title: "ColoredMNIST Dataset Wrapper",

    h2_coloring: "The Coloring Problem: A Debugging Story",
    coloring_p1: "This is the most valuable 'failure' of the entire project — the model ran fine, loss converged normally, but the output was nothing like what we wanted.",

    h3_random: "Experiment #1: Random Coloring (val_loss = 302.23)",
    random_p1: "The initial idea was intuitive: multiply each MNIST image by a random color coefficient (three numbers between 0.3~1.0), producing 'colorful' digits. More variation = better color learning, right?",
    random_formula_desc: "Coloring formula:",
    random_p2: "Training ran for 100 epochs, everything looked normal — loss dropped from 640 to 302, KL stabilized at 5~7. Opened the generated images: <strong>all grayscale</strong>. The model adaptively 'learned' to ignore color.",

    h3_root: "Root Cause: The Model Did the Math",
    root_p1: "Why ignore color? Not a bug — the <strong>optimal strategy</strong>. Let's do the math:",
    root_li1: "Stroke pixels account for only <strong>~15%</strong> of the image — the remaining 85% is pure black background",
    root_li2: "BCE difference between grayscale output and correct color: only ~0.14 per stroke pixel",
    root_li3: "Color signal accounts for <strong>~0.6%</strong> of total loss — model gets far more reduction by improving shape",
    root_p2: "Worse: the same digit gets different random colors across epochs. Color has no semantic meaning — it's pure noise. The model's optimal strategy is 'ignore the noise, focus on shape'.",
    root_conclusion: "Core lesson: it's not that 'colors aren't bright enough' — it's that 'color as a signal isn't reliable enough'. Widening the color coefficient range makes colors more vivid without solving the reliability problem.",

    h3_fix: "Experiment #2: Per-Class Coloring (val_loss = 252.35 · ↓16.5%)",
    fix_p1: "The solution: <strong>bind color to digit class</strong>. Assign each digit 0–9 a fixed, distinct color. Color becomes a semantic signal — red can't be 3, blue can't be 7. The model must accurately distinguish R/G/B channels.",
    fix_table_head: "▲ Digit → Color Mapping",
    fix_p2: "Minimal code change (one line: <code>colored_img = img.repeat(3, 1, 1) * CLASS_COLORS[label]</code>), immediate effect: val_loss 302→252 (↓16.5%), correct colors, improved reconstruction.",

    fix_deep: "Why Isn't This 'Data Augmentation'?",
    fix_deep_p1: "A possible objection: 'Random coloring is just data augmentation, making the model more robust'. But data augmentation requires augmented samples to stay within the data distribution — grayscale strokes on randomly colored backgrounds don't form a valid distribution. Random coloring creates out-of-distribution noise, not in-distribution variants.",
    fix_deep_p2: "Per-class coloring imposes a structured attribute — 'color = class ID' becomes part of the data definition. It's more like adding structured annotations than adding noise.",

    h2_optimization: "The Optimization Toolkit: From Working to Working Well",
    optimize_p1: "Alongside fixing the coloring problem, we built out a full optimization toolkit. Each improvement is independent. Here's what each solves and why.",

    h3_bce: "BCE Replaces MSE",
    bce_p1: "Part 1 used MSE for reconstruction loss. MSE's weakness: when a boundary pixel is sometimes black and sometimes white, MSE's optimal output is 0.5 (gray) — the 'gray fog' effect.",
    bce_p2: "BCE has its maximum gradient at 0.5, explicitly penalizing ambiguity. From <code>mse_loss(reduction='mean') * 2352</code> to <code>bce_loss(reduction='sum') / batch_size</code> — no manual coefficient needed; BCE's sum/batch naturally sits in the tens range, auto-balancing against KL.",
    bce_code_title: "Reconstruction Loss Comparison",

    h3_beta: "β Coefficient & KL Warm-up",
    beta_p1: "VAE training is a tug-of-war: <strong>recon loss wants to spread each image's z apart; KL wants to squeeze all z toward standard Gaussian.</strong>",
    beta_p2: "Introduce <strong>β coefficient</strong> to control the balance:",
    beta_p3: "For colored MNIST, β = 0.05 (recon:KL = 20:1) works best — nail reconstruction first, then worry about generation diversity.",
    beta_p4: "But β can't be applied from epoch 0. Initial KL can reach thousands (random fc_logvar → exp explosion); even β=0.05 leaves KL dominating recon.",
    beta_p5: "<strong>KL warm-up</strong>: first 20 epochs kl_weight ramps from 0 to β. The encoder learns content from reconstruction alone, then KL is gradually introduced to fine-tune rather than bulldoze.",

    h3_scheduler: "Cosine Annealing LR",
    scheduler_p1: "Fixed learning rate can't 'brake' in late training. When parameters near optimal, gradients are tiny — but lr × tiny_gradient can still overshoot, land on the opposite slope, and oscillate forever.",
    scheduler_p2: "Cosine annealing smoothly decays lr from 0.001 to 1e-5: big strides early, tiny steps late. T_max = total epochs, eta_min = small floor value.",

    h3_clip: "Adaptive Gradient Clipping",
    clip_p1: "Gradient clipping prevents explosion, but fixed thresholds are contradictory: early gradients 5~10, threshold 1 cuts 80% of step; late gradients 0.1~0.5, threshold 10 offers no protection.",
    clip_p2: "Adaptive: maintain an <strong>EMA</strong> of gradient norms. Only clip when current exceeds 5× the historical mean. Early: mean large → threshold loose; late: mean small → threshold tight.",
    clip_code_title: "Adaptive Gradient Clipping Code",

    h3_early: "Early Stopping + Validation Set",
    early_p1: "Part 1 trained on all 60K MNIST and printed training loss — always decreasing, overfitting invisible.",
    early_p2: "Improvement: 50K train + 10K validation. Validation never participates in training; independently evaluated each epoch. When val_loss hasn't improved for 10 epochs, stop and save the best-epoch weights.",
    early_p3: "In this case, early stopping never triggered — all 3 experiments ran full 100 epochs. No significant overfitting, but improvements after epoch 50 were negligible.",

    h3_exp3: "Experiment #3: Parameter Tuning (val_loss = 224.80 · ↓10.9%)",
    exp3_p1: "Experiment #2 solved coloring but left room for reconstruction quality. Two simultaneous changes: <strong>latent_size 8→16</strong> and <strong>β 0.1→0.05</strong>.",
    exp3_p2: "Doubling latent_size gives twice the latent capacity for fine details; halving β shifts bias toward reconstruction. val_loss: 252→225 (↓10.9%). KL rose slightly (5.50→6.23) — not a quality issue, just summing over 16 dimensions vs 8.",

    h2_experiments: "Experiment Overview",
    experiments_p1: "Below is the complete comparison of the 3 experiments. All ran on a server GPU, ~3 minutes each, 100 epochs.",
    exp_table_title: "▲ Experiment Comparison",
    exp_th_exp: "Exp",
    exp_th_key: "Key Config",
    exp_th_val: "Best val_loss",
    exp_th_color: "Color",
    exp_th_note: "Notes",
    exp1_key: "latent=8, β=0.1, random",
    exp1_note: "All grayscale, coloring failed",
    exp2_key: "latent=8, β=0.1, per-class",
    exp2_note: "Coloring OK, ↓16.5%",
    exp3_key: "latent=16, β=0.05, per-class",
    exp3_note: "Best accuracy, ↓10.9%",

    experiments_p2: "Loss reduction path across experiments:",
    exp_trend_h3: "Loss Trends",
    exp_trend_1: "<strong>#1→#2 (coloring strategy)</strong>: val_loss 302→252, ↓16.5%. The biggest single jump — from fixing data construction, not from changing the model.",
    exp_trend_2: "<strong>#2→#3 (architecture params)</strong>: val_loss 252→225, ↓10.9%. Doubling latent capacity, halving KL weight toward reconstruction.",
    exp_trend_3: "<strong>Common pattern</strong>: ~95% of learning happens during KL warm-up (first 20 epochs). After warm-up, 70+ epochs improve by <6 loss points. Training to 60 epochs is sufficient.",
    experiments_p3: "Complete experimental data (per-epoch loss, convergence curves) in the <a href='https://github.com/Muanyan-mjq/vae-color' target='_blank' rel='noopener noreferrer' class='text-indigo-600 dark:text-indigo-400 hover:underline'>GitHub repo</a>'s <code>EXPERIMENT_LOG.md</code>.",

    h2_train: "Training Code Overview",
    train_p1: "The complete training loop incorporating all optimizations:",
    train_code_title: "Training Script Core (train.py)",
    train_params: "Final hyperparameter config:",
    train_param_list: "batch_size=256, num_epochs=100, lr=0.001→1e-5, latent_size=16, β=0.05, warmup_epochs=20, patience=10",

    h2_visual: "Visual Results",
    visual_p1: "Reconstruction and generation results from Experiment #3. Left: original colored MNIST (per-class coloring). Right: VAE reconstruction:",
    visual_recon_caption: "▲ Reconstruction: top row = original colored MNIST, bottom row = VAE reconstruction (Experiment #3, latent=16, β=0.05)",
    visual_gen_caption: "▲ Random generation: sampling latent vectors from N(0,1), decoded into novel color digit images",
    visual_note: "Note: these images need to be generated from the server. Run <code>python vae_test.py</code> (restore pure VAE weights first). Output goes to <code>test_img/</code> and <code>sample_img/</code>. Or use the auto-saved images from Experiment #3 training at <code>out_img/epochs_*.png</code> and <code>test_img/test_*.png</code>.",

    h2_summary: "Summary & Review",
    summary_p1: "This article isn't a 'tweaked parameters and improved loss' log. The core takeaways are on three levels:",

    summary_h3_debug: "Debugging Methodology: From Symptom to Root Cause",
    summary_debug_p1: "When output doesn't match expectations, the easiest mistake is blindly changing parameters. Experiment #1's grayscale output had nothing to do with network depth or learning rate — the root cause was <strong>data construction making the color signal unreliable</strong>. Fixing the architecture wouldn't help; fixing the coloring strategy would.",
    summary_debug_p2: "Build the habit: first analyze <strong>what the loss is actually penalizing</strong>, then act. Color difference per pixel: 0.14 BCE. Shape reconstruction for the whole batch: hundreds. The model's optimal strategy is clear — ignore color, focus on shape. That's not a model problem; it's a data design problem.",

    summary_h3_toolkit: "Engineering Training: From Script to Experiment",
    summary_toolkit_p1: "Part 1's training code was 'just make it run'. This article introduces full engineering practices — train/val split, early stopping, LR scheduling, gradient clipping. These aren't VAE-specific; they're infrastructure for any DL training.",
    summary_toolkit_p2: "The single most valuable addition is <strong>adaptive gradient clipping</strong> — fixed thresholds differ by two orders of magnitude between early and late training. EMA-adaptive thresholds eliminate the trial-and-error.",

    summary_h3_beta: "The Philosophy of β: A Carefully Orchestrated Tug-of-War",
    summary_beta_p1: "β is the most subtle parameter. At 0.1: decent reconstruction but loose KL; at 0.05: best reconstruction; at 0.01: KL nearly vanishes, latent space loses constraint. There is no 'optimal β' — it represents where you stand between 'draw clearly' and 'draw diversely'.",
    summary_beta_p2: "KL warm-up is β's necessary companion. Early encoder output is chaotic; directly introducing KL teaches it to 'output 0, pretend to be standard Gaussian' — posterior collapse. Warm-up lets the encoder learn content first, then gradually add KL regularization.",

    summary_h3_next: "Next: Conditional Generation with CVAE",
    summary_next_p1: "The current VAE can only generate randomly — you can't say 'draw a red 5'. The next article adds <strong>label conditioning</strong>, injecting class information into both encoder and decoder. That's CVAE — the leap from random to controllable generation.",
    summary_next_p2: "Preview: CVAE's loss improvement is only ~1%, but the qualitative gain far exceeds the quantitative — class-specific generation that VAE simply can't do.",

    h2_ref: "References",
    ref_li1: "Code repo: ",
    ref_li2: "Part 1: ",
    ref_li3: "Experiment logs: ",
    ref_li4: "VAE paper: ",
  },
} as const;

// ── 代码块 ──
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

        # 损失：BCE + KL*warmup
        recon_loss = F.binary_cross_entropy(recon_x, inputs, reduction='sum') / inputs.size(0)
        kl_loss = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())
        loss = recon_loss + kl_weight * kl_loss

        loss.backward()

        # 自适应梯度裁剪
        total_norm = clip_grad_norm_(vae.parameters(), max_norm=float('inf'))
        threshold = grad_ema * 5.0
        clip_grad_norm_(vae.parameters(), max_norm=threshold)
        grad_ema = 0.9 * grad_ema + 0.1 * total_norm

        optimizer.step()

    scheduler.step()  # 余弦退火

    # 验证 + 早停 + 每10轮可视化
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

        # Loss: BCE + KL*warmup
        recon_loss = F.binary_cross_entropy(recon_x, inputs, reduction='sum') / inputs.size(0)
        kl_loss = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())
        loss = recon_loss + kl_weight * kl_loss

        loss.backward()

        # Adaptive gradient clipping
        total_norm = clip_grad_norm_(vae.parameters(), max_norm=float('inf'))
        threshold = grad_ema * 5.0
        clip_grad_norm_(vae.parameters(), max_norm=threshold)
        grad_ema = 0.9 * grad_ema + 0.1 * total_norm

        optimizer.step()

    scheduler.step()  # Cosine annealing

    # Validation + early stopping + visualization every 10 epochs
    val_loss = evaluate(vae, val_loader)
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        torch.save(vae.state_dict(), 'best_model.pth')
    elif patience_counter >= patience:
        break`,
  },
};

// ── 颜色对照数据 ──
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
      {/* ═══ 动机 ═══ */}
      <h2>{c.h2_motivation}</h2>
      <p>{c.motivation_p1}</p>
      <p dangerouslySetInnerHTML={{ __html: c.motivation_p2 }} />
      <p>{c.motivation_p3}</p>

      {/* 效果图 */}
      <figure className="my-8">
        <img
          src={`${BASE_PATH}/vae-images/vae-color-reconstruction.png`}
          alt={lang === "zh" ? "VAE 重建对比：上排原始彩色 MNIST，下排 VAE 重建" : "VAE reconstruction: top original colored MNIST, bottom VAE reconstruction"}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800"
        />
        <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          {lang === "zh"
            ? "▲ 最终效果：上排为按类染色的原始 MNIST，下排为 VAE 重建输出"
            : "▲ Final result: top row = per-class colored MNIST, bottom row = VAE reconstruction output"}
        </figcaption>
      </figure>

      {/* ═══ 架构升级 ═══ */}
      <h2>{c.h2_arch}</h2>
      <p>{c.arch_p1}</p>

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
            {[
              [c.arch_row_input, c.arch_row_input_gray, c.arch_row_input_color, c.arch_row_input_reason],
              [c.arch_row_conv, c.arch_row_conv_gray, c.arch_row_conv_color, c.arch_row_conv_reason],
              [c.arch_row_latent, c.arch_row_latent_gray, c.arch_row_latent_color, c.arch_row_latent_reason],
              [c.arch_row_loss, c.arch_row_loss_gray, c.arch_row_loss_color, c.arch_row_loss_reason],
            ].map(([dim, gray, color, reason], i) => (
              <tr key={i} className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="p-3 font-medium">{dim}</td>
                <td className="p-3 text-zinc-500">{gray}</td>
                <td className="p-3 text-indigo-600 dark:text-indigo-400 font-semibold">{color}</td>
                <td className="p-3">{reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ═══ 模型改动 ═══ */}
      <h3>{c.h3_model}</h3>
      <p>{c.model_p1}</p>

      {/* Encoder */}
      <p className="text-lg font-semibold text-zinc-900 dark:text-white mt-8 mb-2">{c.model_enc_title}</p>
      <p>{c.model_enc_code_title}：</p>
      <CodeBlock language="python">{codeBlocks.encoder[lang]}</CodeBlock>
      <p>
        {c.model_enc_explain1}<br />
        <strong>{c.model_enc_explain2}</strong><br />
        {c.model_enc_explain3}<br />
        {c.model_enc_explain4}<InlineMath>{"\\mu"}</InlineMath>{c.model_enc_explain5}<InlineMath>{"\\log(\\sigma^2)"}</InlineMath>{c.model_enc_explain6}
      </p>

      {/* Encoder 逐行解析 */}
      <div className="mt-6 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.model_enc_detail}</p>
        <ul className="space-y-2 text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">
          <li dangerouslySetInnerHTML={{ __html: c.model_enc_d1 }} />
          <li dangerouslySetInnerHTML={{ __html: c.model_enc_d2 }} />
          <li dangerouslySetInnerHTML={{ __html: c.model_enc_d3 }} />
          <li dangerouslySetInnerHTML={{ __html: c.model_enc_d4 }} />
          <li dangerouslySetInnerHTML={{ __html: c.model_enc_d5 }} />
        </ul>
      </div>

      {/* Encoder 深入理解 */}
      <div className="mt-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.model_enc_deep}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.model_enc_deep_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.model_enc_deep_p2}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.model_enc_deep_p3}</p>
      </div>

      {/* Decoder */}
      <p className="text-lg font-semibold text-zinc-900 dark:text-white mt-8 mb-2">{c.model_dec_title}</p>
      <p>{c.model_dec_code_title}：</p>
      <CodeBlock language="python">{codeBlocks.decoder[lang]}</CodeBlock>
      <p>
        {c.model_dec_explain1}<InlineMath>{"d_{\\text{latent}}"}</InlineMath>{c.model_dec_explain2}<br />
        {c.model_dec_explain3}<br />
        {c.model_dec_explain4}
      </p>

      {/* Decoder 逐行解析 */}
      <div className="mt-6 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.model_dec_detail}</p>
        <ul className="space-y-2 text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">
          <li dangerouslySetInnerHTML={{ __html: c.model_dec_d1 }} />
          <li dangerouslySetInnerHTML={{ __html: c.model_dec_d2 }} />
          <li dangerouslySetInnerHTML={{ __html: c.model_dec_d3 }} />
          <li dangerouslySetInnerHTML={{ __html: c.model_dec_d4 }} />
        </ul>
      </div>

      {/* output_padding 深入理解 */}
      <div className="mt-6 p-6 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
        <p className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-4">{c.model_dec_odd}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.model_dec_odd_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.model_dec_odd_p2}</p>
      </div>

      {/* 注意 CVAE */}
      <div className="mt-6 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.model_latent_note}</p>
      </div>

      {/* ═══ 数据改动 ═══ */}
      <h3>{c.h3_data}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.data_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: c.data_p2 }} />
      <p>{c.data_code_title}：</p>
      <CodeBlock language="python">{codeBlocks.dataset[lang]}</CodeBlock>

      {/* ═══ 染色问题 ═══ */}
      <h2>{c.h2_coloring}</h2>
      <p>{c.coloring_p1}</p>

      <h3>{c.h3_random}</h3>
      <p>{c.random_p1}</p>
      <p>{c.random_formula_desc}</p>
      <MathBlock>{"\\text{colored\\_img} = \\text{gray\\_img}.\\text{repeat}(3,1,1) \\times [R,G,B],\\quad R,G,B \\sim U(0.3, 1.0)"}</MathBlock>
      <p dangerouslySetInnerHTML={{ __html: c.random_p2 }} />

      <h3>{c.h3_root}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.root_p1 }} />
      <ul>
        <li dangerouslySetInnerHTML={{ __html: c.root_li1 }} />
        <li dangerouslySetInnerHTML={{ __html: c.root_li2 }} />
        <li dangerouslySetInnerHTML={{ __html: c.root_li3 }} />
      </ul>
      <p>{c.root_p2}</p>

      {/* 根因分析 — 灰底框 */}
      <div className="mt-6 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 font-semibold">{c.root_conclusion}</p>
      </div>

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
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-2 mb-6">{c.fix_table_head}</p>

      <p dangerouslySetInnerHTML={{ __html: c.fix_p2 }} />

      {/* 按类染色深入理解 */}
      <CollapsibleCard title={c.fix_deep} defaultOpen={false}>
        <p className="mb-3 text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.fix_deep_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.fix_deep_p2}</p>
      </CollapsibleCard>

      {/* ═══ 优化工具箱 ═══ */}
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

      {/* β 与 KL 预热 */}
      <h3>{c.h3_beta}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.beta_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: c.beta_p2 }} />
      <MathBlock>{"\\mathcal{L} = \\mathcal{L}_{\\text{BCE}} + \\beta \\cdot D_{\\text{KL}}"}</MathBlock>
      <p>{c.beta_p3}</p>
      <p>{c.beta_p4}</p>
      <p dangerouslySetInnerHTML={{ __html: c.beta_p5 }} />

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

      {/* 实验 #3 */}
      <h3>{c.h3_exp3}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.exp3_p1 }} />
      <p>{c.exp3_p2}</p>

      {/* ═══ 实验总览 ═══ */}
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

      {/* ═══ 训练代码全貌 ═══ */}
      <h2>{c.h2_train}</h2>
      <p>{c.train_p1}</p>
      <CodeBlock language="python">{codeBlocks.train[lang]}</CodeBlock>
      <p><strong>{c.train_params}</strong> {c.train_param_list}</p>

      {/* ═══ 生成效果 ═══ */}
      <h2>{c.h2_visual}</h2>
      <p>{c.visual_p1}</p>

      {/* 重建对比图已移至文章开头 */}

      {/*
       * TODO: 添加随机生成彩色数字网格图
       * 来源：服务器上 vae_color/out_img/epochs_90.png
       * 放入：public/vae-images/vae-color-generation.png
       */}
      <figure className="my-8">
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-12 flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl mb-3 block">🎨</span>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              {lang === "zh"
                ? "📌 待添加：随机生成彩色数字网格"
                : "📌 TODO: Generated color digit grid"}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-mono">
              {lang === "zh"
                ? "来源: vae_color/out_img/ → public/vae-images/vae-color-generation.png"
                : "Source: vae_color/out_img/ → public/vae-images/vae-color-generation.png"}
            </p>
          </div>
        </div>
        <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          {c.visual_gen_caption}
        </figcaption>
      </figure>

      <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200" dangerouslySetInnerHTML={{ __html: c.visual_note }} />
      </div>

      {/* ═══ 总结与回顾 ═══ */}
      <h2>{c.h2_summary}</h2>
      <p>{c.summary_p1}</p>

      <h3>{c.summary_h3_debug}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.summary_debug_p1 }} />
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

      {/* 下一步学习方向卡片 */}
      <div className="mt-8 mb-10 grid md:grid-cols-2 gap-4">
        {[
          { icon: "🧬", title: lang === "zh" ? "条件生成 CVAE" : "Conditional Generation CVAE", desc: lang === "zh" ? "加入标签条件，指定生成某个数字——从随机到可控" : "Add label conditioning for class-specific generation", href: "/blog/vae-3-cvae" },
          { icon: "🔬", title: lang === "zh" ? "β-VAE 解耦表示" : "β-VAE Disentangled Representation", desc: lang === "zh" ? "增强潜在空间的可解释性，每个维度控制独立特征" : "Enhance latent space disentanglement", href: "#" },
          { icon: "💎", title: lang === "zh" ? "VQ-VAE 离散潜在空间" : "VQ-VAE Discrete Latent Space", desc: lang === "zh" ? "离散编码替代连续向量，更高质量生成" : "Discrete encoding for higher quality generation", href: "#" },
          { icon: "🌊", title: lang === "zh" ? "扩散模型入门" : "Intro to Diffusion Models", desc: lang === "zh" ? "从 VAE 到 DDPM——生成模型的下一步进化" : "From VAE to DDPM — next evolution of generative models", href: "#" },
        ].map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group relative p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">{item.title}</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* 下一篇导航 */}
      <div className="mt-8 mb-10">
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
                {lang === "zh" ? "在 VAE 中加入标签条件，实现指定类别的图像生成——从「随机画数字」到「按需画特定的数字」。" : "Adding label conditioning for class-specific generation — from random digit drawing to on-demand specific digits."}
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

      {/* 上一篇导航 */}
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

      {/* ═══ 参考资源 ═══ */}
      <h2>{c.h2_ref}</h2>
      <div className="mt-6 space-y-3">
        {[
          { icon: "💻", title: "vae-color", desc: lang === "zh" ? "本文所有代码与实验记录" : "All code and experiment logs", href: "https://github.com/Muanyan-mjq/vae-color", external: true },
          { icon: "📝", title: lang === "zh" ? "VAE 学习笔记（一）：从直觉到实现" : "VAE Notes (1): From Intuition to Implementation", desc: lang === "zh" ? "本篇的前置阅读" : "Prerequisite reading", href: `${BASE_PATH}/blog/vae-1-introduction`, external: false },
          { icon: "📋", title: "EXPERIMENT_LOG.md", desc: lang === "zh" ? "4 次实验的完整数据与 57 条修改记录" : "Complete experiment data and 57 change records", href: "https://github.com/Muanyan-mjq/vae-color", external: true },
          { icon: "📄", title: "Kingma & Welling, Auto-Encoding Variational Bayes, 2013", desc: lang === "zh" ? "VAE 原始论文" : "Original VAE paper", href: "https://arxiv.org/abs/1312.6114", external: true },
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
              <p className="text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{item.title}</p>
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
