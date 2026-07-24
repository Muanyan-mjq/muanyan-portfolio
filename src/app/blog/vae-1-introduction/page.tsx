"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { MathBlock, InlineMath } from "@/components/math-block";
import { CodeBlock } from "@/components/code-block";
import { blogPosts } from "@/lib/blog-data";
import { BASE_PATH } from "@/lib/base-path";

// 可折叠卡片组件 — grid-template-rows 实现丝滑动画
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

const post = blogPosts.find((p) => p.slug === "vae-1-introduction")!;
const seriesPosts = blogPosts
  .filter((p) => p.series?.name.zh === post.series?.name.zh && p.published)
  .sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));

const content = {
  zh: {
    h2_intro: "什么是 VAE？",
    intro_p1: "想象你有一堆手写数字图片（MNIST 数据集），你想让机器「学会」这些数字的样子，然后自己画出新的数字图片。这就是<strong>生成模型</strong>的任务。",
    intro_p2: "<strong>VAE（Variational Autoencoder，变分自编码器）</strong>是一种生成模型。它的核心思想很简单：",
    intro_li1: "<strong>编码器</strong>（Encoder）：把一张图片「压缩」成一个小数字向量（比如只有 4 个数）",
    intro_li2: "<strong>解码器</strong>（Decoder）：把这个小向量「还原」回一张图片",
    intro_li3: "<strong>潜在空间</strong>（Latent Space）：那个小向量所在的空间，每个点都对应一张图片",
    intro_p3: "如果训练成功，我们只需要在潜在空间里随机采样一个向量，喂给解码器，就能生成一张全新的、看起来像真实数字的图片。",

    h2_arch: "网络架构",
    arch_p1: "让我们看看代码中的具体实现。整个 VAE 由三部分组成：",
    arch_conv_title: "卷积基础回顾",
    arch_conv_p1: "在看代码之前，先理解卷积操作。卷积就是「用一个小窗口扫描图片」。假设图片是 5×5 的像素矩阵，卷积核是 3×3 的小矩阵。卷积核像手电筒一样从左到右、从上到下滑动，每到一个位置，把覆盖的 3×3 区域和卷积核<strong>逐元素相乘再求和</strong>，得到输出图的一个像素。",
    arch_conv_p2: "关键参数：<code>stride</code>（步长）控制窗口每次移动的格数，stride=2 让输出尺寸减半；<code>padding</code>（填充）在图片外围加一圈 0，保证边缘像素也能被扫到。输出尺寸公式：floor((输入尺寸 + 2×padding - 卷积核大小) / stride) + 1。",
    arch_conv_p3: "卷积核是<strong>独立的可学习参数</strong>，不是固定的。训练前随机生成，训练中通过反向传播不断调整，训练后固定。每个卷积核学会检测不同的特征——有的找边缘，有的找纹理，有的找形状。",
    arch_h3_enc: "编码器（Encoder）",
    arch_enc_p1: "编码器的任务是把一张 28×28 的灰度图片压缩成两个向量：<strong>均值 μ</strong> 和<strong>对数方差 log(σ²)</strong>。为什么要输出两个值？因为我们需要用它们来定义一个<strong>正态分布</strong>。",
    arch_enc_code_title: "编码器代码（model.py）",
    arch_enc_explain1: "两层卷积逐步缩小空间尺寸：",
    arch_enc_explain2: "28×28 → 14×14 → 7×7",
    arch_enc_explain3: "同时增加通道数：1 → 32 → 64（提取更多特征）",
    arch_enc_explain4: "最后通过全连接层输出两个",
    arch_enc_explain5: "维向量：μ 和 log(σ²)",
    arch_enc_detail: "逐行解析：",
    arch_enc_d1: "<code>Conv2d(1, 32, kernel_size=3, stride=2, padding=1)</code> — 输入1通道（灰度图），输出32通道，stride=2 让尺寸减半（28→14）",
    arch_enc_d2: "<code>BatchNorm2d(32)</code> — 稳定训练，加速收敛，防止梯度消失",
    arch_enc_d3: "<code>LeakyReLU</code> — 比 ReLU 更平滑，避免「死亡神经元」问题",
    arch_enc_d4: "<code>fc_mu</code> 和 <code>fc_logvar</code> — 两个独立的全连接层，分别输出均值和对数方差",
    arch_enc_d5: "为什么输出 log(σ²) 而不是 σ？因为对数可以取任意实数，数值更稳定",
    arch_enc_deep: "深入理解：通道与信息压缩",
    arch_enc_deep_p1: "通道数的含义：通道 = 「观察角度」的个数。浅层通道检测边缘、纹理；深层通道组合成曲线、形状。1→32→64 是「逐层翻倍」策略——空间每减半一次（丢失细节），通道翻倍一次（增加表示能力）。用更多「角度」来弥补「分辨率」的损失。",
    arch_enc_deep_p2: "步长减半确实会丢掉信息——28→14 丢了一半空间分辨率。但这是有意为之的设计。卷积核在训练过程中学会了区分「重要特征」和「不重要细节」，把有意义的信息浓缩到更小的空间里，丢弃冗余部分。",
    arch_enc_deep_p3: "这种信息筛选并非人工指定，而是通过训练自动完成的。编码器面临严格的压缩约束：输入 784 个像素，最终只能输出 4 个数，同时还要保证解码器能够还原。训练初期，随机权重导致压缩后解码器还原出噪声，损失巨大。反向传播会告诉卷积核：「这个像素解码器需要，加大相关权重」；「那个像素解码器用不上，减小权重」。经过上万次迭代，卷积核自动收敛到一套最优的压缩策略。",
    arch_enc_deep_p4: "全连接层的权重在训练前随机生成，数量等于输入位置数乘以输出位置数。例如 <code>fc_mu = nn.Linear(3136, 4)</code> 会创建一个 [3136, 4] 的矩阵，共 12544 个独立权重。训练时每处理一批图片，反向传播会逐个微调这些权重。",

    arch_h3_dec: "解码器（Decoder）",
    arch_dec_p1: "解码器的任务是反过来：把一个小向量还原成 28×28 的图片。",
    arch_dec_code_title: "解码器代码（model.py）",
    arch_dec_explain1: "全连接层把",
    arch_dec_explain2: "维向量扩展成 64×7×7 的特征图",
    arch_dec_explain3: "两层转置卷积逐步放大：7×7 → 14×14 → 28×28",
    arch_dec_explain4: "最后用 Sigmoid 激活函数把像素值压缩到 [0, 1] 范围",
    arch_dec_detail: "逐行解析：",
    arch_dec_d1: "<code>Linear(latent_size, 64*7*7)</code> — 把 4 维潜在向量扩展成 3136 维",
    arch_dec_d2: "<code>ConvTranspose2d</code> — 转置卷积（也叫反卷积），作用是放大图像尺寸",
    arch_dec_d3: "<code>output_padding=1</code> — 确保尺寸精确翻倍（7→14→28）",
    arch_dec_d4: "<code>Sigmoid</code> — 把输出值压缩到 [0,1]，对应像素灰度值",

    arch_h3_vae: "VAE 整体",
    arch_vae_p1: "把编码器和解码器拼起来，中间加上重参数化操作：",
    arch_vae_deep: "VAE 整体工作机制",
    arch_vae_deep_p1: "解码器是一个确定性函数：给定 z，输出固定的图片，没有随机性。同一个 z 永远生成同一张图。随机性仅存在于采样 z 的过程中，解码器内部是完全确定的。",
    arch_vae_deep_p2: "编码器的缩小和解码器的放大本质上是相同的操作——卷积。编码器用 Conv2d(stride=2) 缩小，解码器用 ConvTranspose2d(stride=2) 放大，即先在像素间插 0，再用 3×3 核扫描。两者共享相同的数学框架和训练方式，只是方向相反。",
    arch_vae_deep_p3: "在 KL 散度约束的分布区域 [-2, 2] 内采样的 z 都能生成合理的图片。但如果手动构造一个从未见过的 z（如 [100, 200, -300, 50]），解码器会生成噪声，因为这个区域在训练中从未被覆盖。",
    arch_vae_deep_p4: "训练效果可以从三个维度观察：损失函数持续下降（从 50+ 降到 30）、重建图片逐渐清晰（epoch 0 是噪声，epoch 90 几乎与原图一致）、生成图片质量提升（epoch 0 是灰团，epoch 90 是清晰数字）。",
    arch_vae_code_title: "VAE 代码（model.py）",

    h2_reparam: "重参数化技巧",
    reparam_p1: "这是 VAE 最巧妙的设计。问题在于：编码器输出的是一个<strong>分布</strong>（μ 和 σ），我们需要从这个分布中「采样」得到 z。但<strong>采样操作是不可微分的</strong>，没法反向传播。",
    reparam_p2: "解决方案：把随机性「转移」到一个外部噪声 ε 上：",
    reparam_formula_desc: "重参数化公式：",
    reparam_explain: "其中 ε 是从标准正态分布 N(0,1) 中采样的随机数。这样 z 仍然是随机的，但对 μ 和 σ 来说是确定性的函数，可以正常反向传播。",
    reparam_code_title: "重参数化代码",
    reparam_deep: "为什么需要重参数化？",
    reparam_deep_p1: "采样操作是不可微分的。如果直接从 N(μ, σ²) 采样得到 z，那么 z 对 μ 和 σ 的梯度是 0——反向传播时梯度传不回去，权重无法更新。",
    reparam_deep_p2: "重参数化把采样过程拆成两步：先从标准正态分布采样 ε（这个操作不需要梯度），然后用 z = μ + ε×σ 计算 z（这个操作是确定性的，可以求梯度）。这样 z 对 μ 的梯度是 1，对 σ 的梯度是 ε——梯度可以正常回传。",
    reparam_deep_p3: "直觉理解：想象你在调收音机。μ 是中心频率，σ 是带宽。重参数化相当于先固定一个随机噪声 ε，然后你调整 μ 和 σ 时，输出 z 会跟着变。这样你就能通过调整 μ 和 σ 来控制 z 的分布。",

    h2_loss: "损失函数",
    loss_p1: "VAE 的损失函数由两部分组成：<strong>重建损失（MSE）</strong>和<strong>KL 散度</strong>。",
    loss_math_title: "数学推导（可选）",
    loss_math_p1: "VAE 的损失函数来自<strong>对数似然函数的下界（ELBO）</strong>。给定数据 x，我们想最大化 log p(x)，但直接计算很困难（需要对所有可能的 z 积分）。VAE 用<strong>变分推断</strong>的方法，构造了一个可优化的下界：",
    loss_math_p2: "log p(x) ≥ E[log p(x|z)] - KL(q(z|x) || p(z))",
    loss_math_p3: "第一项 E[log p(x|z)] 就是重建损失（MSE 的另一种形式），衡量解码器从 z 重建 x 的能力。第二项 KL(q(z|x) || p(z)) 就是 KL 散度，衡量编码器输出的分布 q(z|x) 离先验分布 p(z)（标准正态）有多远。",
    loss_math_p4: "直觉理解：我们同时在做两件事——让重建图片尽可能像原图（第一项），让编码器输出的分布尽可能接近标准正态（第二项）。两者相互制衡，最终达到平衡。",
    loss_h3_recon: "重建损失（MSE）",
    loss_recon_p1: "衡量重建图片和原图的差异。使用<strong>均方误差（MSE）</strong>，乘以 784（28×28 像素总数）让量级和 KL 散度匹配：",
    loss_recon_deep: "MSE 的特性",
    loss_recon_deep_p1: "MSE 对所有误差一视同仁——每个像素差多少就罚多少，小误差小罚，大误差大罚。没有什么「误差小于 0.2 就放过」的阈值。平方惩罚本身就是一种非线性的放大——大误差的惩罚远远超过小误差。",
    loss_recon_deep_p2: "为什么乘 784？量级 = 数值的大小级别。不乘 784 时 MSE ≈ 0.05，KL ≈ 2.0，KL 主导训练。乘 784 后 MSE ≈ 39，两者同一量级。784 = 28×28 是像素总数，「每像素平均」×784 = 「整图总和」。别的数也行，比如设超参数 β：loss = β×MSE + KL。但 784 是刚好合适的经验值。",
    loss_recon_code_title: "重建损失代码",
    loss_recon_explain: "reduction='mean' 计算每像素平均误差，乘 784 恢复为整图总误差",

    loss_h3_kl: "KL 散度",
    loss_kl_p1: "衡量编码器输出的分布离<strong>标准正态分布 N(0,1)</strong> 有多远。KL 散度越小，潜在空间越规整，采样效果越好：",
    loss_kl_deep: "KL 散度的作用",
    loss_kl_deep_p1: "KL 散度衡量两个分布的差异。在 VAE 中，它衡量编码器输出的分布（由 μ 和 σ 定义）离标准正态分布 N(0,1) 有多远。μ=0, σ=1→KL≈0（完美）；μ=3, σ=0.1→KL 很大（又偏又窄）。",
    loss_kl_deep_p2: "约束为正态分布的原因在于：生成阶段我们从标准正态分布采样 z。如果训练时编码器输出的分布偏离正态，生成时采样的 z 将落在训练未覆盖的区域，解码器无法处理，生成效果会很差。",
    loss_kl_deep_p3: "KL 散度和 MSE 的平衡：MSE 让重建图片越来越像原图，KL 让潜在空间越来越规整。两者相互制衡。如果只优化 MSE，编码器会把每个数字映射到潜在空间的不同角落（过拟合）；如果只优化 KL，编码器会把所有数字映射到原点（丢失信息）。",
    loss_kl_code_title: "KL 散度代码",
    loss_kl_explain: "这个公式的推导涉及概率论，直观理解就是：让编码器输出的分布尽量接近标准正态分布",

    loss_h3_total: "总损失",
    loss_total_p1: "两者相加就是总损失：",
    loss_total_formula: "L = MSE × 784 + KL",
    loss_total_explain: "训练过程中，MSE 让重建图片越来越像原图，KL 让潜在空间越来越规整。两者相互制衡。",

    h2_train: "训练过程",
    train_p1: "训练代码非常简洁。核心循环就是：<strong>前向传播 → 计算损失 → 反向传播 → 更新权重</strong>：",
    train_code_title: "训练代码（train.py）",
    train_params: "关键超参数：",
    train_p2: "batch_size = 256（每批 256 张图）、learning_rate = 0.001、latent_size = 4（潜在空间 4 维）、num_epochs = 100",
    train_deep: "训练机制深入理解",
    train_deep_p1: "编码器和解码器是同时训练的。反馈调节通过反向传播完成，分为三步：首先前向传播获取输出；然后反向传播计算梯度——MSE 告诉解码器输出像素的偏差，KL 告诉编码器分布的不合理之处；最后更新权重（每个权重 = 原值 - 学习率×梯度）。",
    train_deep_p2: "梯度贯穿整个网络，形成全局的问责链。从损失函数出发，沿着计算图反向传播，每个权重都会被分配一份「责任」。例如卷积层的某个核会同时接收来自 MSE 和 KL 的梯度，两者合在一起决定调整方向和幅度。这种端到端的训练方式确保了网络各部分协同优化。",
    train_deep_p3: "训练过程是完全自动化的。使用者只需完成三项工作：定义模型结构、准备数据集、运行训练脚本。之后的流程自动循环：输入图片→前向传播→计算损失→反向传播→更新权重→处理下一批图片。模型会自动学习数据的特征，无需人工干预。",
    train_deep_p4: "训练过程中，所有权重存储在 GPU 显存中。每次前向传播时，权重和中间数据都在显存中计算；反向传播后，中间结果被释放，更新后的权重保留在显存。需要定期使用 torch.save 将权重保存为文件，否则进程结束后显存清空，所有训练成果将丢失。",

    h2_result: "训练结果",
    result_p1: "训练 100 个 epoch 后，模型展现出三种能力：",
    result_li1: "<strong>重建图片</strong>：输入一张手写数字，输出一张几乎一样的图片",
    result_li2: "<strong>生成图片</strong>：从标准正态分布随机采样 z，解码生成全新的数字图片",
    result_li3: "<strong>潜在空间插值</strong>：在两个数字的 z 之间线性插值，生成渐变过渡图",
    result_img_recon_caption: "▲ 重建对比：上排为原始 MNIST 图片，下排为 VAE 重建结果",
    result_recon_desc: "重建对比图展示了 VAE 的核心能力。上排是原始 MNIST 手写数字，下排是 VAE 的重建结果。可以看到，重建的数字和原图非常接近——笔画粗细、倾斜角度、整体形状都高度还原。偶有模糊是因为潜在空间只有 4 维，信息压缩是有损的，但整体质量已经很好。",
    result_img_gen_caption: "▲ 随机生成：从 N(0,1) 采样 100 个潜在向量，解码得到的新数字图片",
    result_gen_desc: "这些数字并不存在于原始数据集中——它们是模型「创造」出来的。这正是 VAE 的价值：学会了数据的分布，就能从中采样出新的样本。生成的数字清晰可辨，说明模型真正理解了「数字长什么样」，而不是简单地记忆训练图片。",
    result_p2: "潜在空间只有 4 维，但已经足够让模型学会区分不同的数字。每个维度控制着某种特征（如笔画粗细、倾斜角度等）。通过在潜在空间中插值，我们可以看到数字之间的平滑过渡——比如从 3 渐变到 8，中间会经过看起来像两者混合的形状。",

    h2_summary: "总结与回顾",
    summary_p1: "通过这篇文章，我们从零开始理解了 VAE 的核心原理。让我们回顾一下整个学习过程：",
    summary_h3_what: "我们学到了什么",
    summary_what_p1: "VAE 是一种<strong>生成模型</strong>，它的核心思想是「<strong>压缩再还原</strong>」。编码器把图片压缩成一个小向量（潜在空间中的一个点），解码器把这个向量还原成图片。通过训练，模型学会了数据的本质特征，就能从潜在空间中随机采样，生成全新的图片。",
    summary_h3_key: "三个关键设计",
    summary_key_li1: "<strong>重参数化技巧</strong>：把不可微分的采样操作变成可微分的计算图，让梯度可以正常回传",
    summary_key_li2: "<strong>KL 散度约束</strong>：让编码器输出的分布接近标准正态分布，使得生成时的采样有效",
    summary_key_li3: "<strong>MSE 重建损失</strong>：让重建图片尽可能像原图，逼迫模型学习数据的本质特征",
    summary_h3_why: "为什么这样设计",
    summary_why_p1: "这三个设计相互配合：<strong>重参数化让训练成为可能</strong>，<strong>KL 散度让生成成为可能</strong>，<strong>MSE 让重建质量有保障</strong>。三者缺一不可，共同构成了 VAE 的完整训练框架。",
    summary_h3_next: "下一步学习方向",
    summary_next_p1: "理解了基础 VAE 后，可以继续探索：彩色图像生成（扩展到 3 通道）、CVAE（条件生成，指定生成某个数字）、β-VAE（增强潜在空间的解耦性）、VQ-VAE（离散潜在空间，用于文本生成）。",
    summary_p2: "下一篇我们将扩展到彩色图像生成，并探索不同的网络结构和损失函数组合。",

    h2_eval: "模型评估与调优",
    eval_p1: "评估 VAE 的效果需要从多个维度考量，以下是几个关键指标：",
    eval_h3_recon: "重建质量",
    eval_recon_p1: "最直观的评估方式是看重建图片和原图的相似度。可以用 <strong>MSE</strong>、<strong>SSIM（结构相似性）</strong>等指标量化。MSE 越小，重建越像原图。但 MSE 不是唯一标准——有时候 MSE 很低但图片看起来模糊，因为模型学会了「取平均」来降低误差。",
    eval_h3_gen: "生成质量",
    eval_gen_p1: "生成质量的评估比较主观。常用方法：让人类判断生成的图片是否像真实数字。也可以用 <strong>FID（Fréchet Inception Distance）</strong>等自动化指标，但这些指标需要预训练的分类模型，对简单数据集不太适用。",
    eval_h3_latent: "潜在空间质量",
    eval_latent_p1: "好的潜在空间应该满足三个条件：<strong>连续性</strong>（相近的 z 生成相似的图片）、<strong>完整性</strong>（随机采样的 z 都能生成合理图片）、<strong>可解释性</strong>（每个维度控制某种语义特征）。可以通过在潜在空间中插值来直观评估。",
    eval_h3_tips: "调优技巧",
    eval_tips_p1: "生成图片模糊时，可以尝试增加潜在空间维度（如从 4 改为 8 或 16）、使用更深的网络结构、或更换损失函数（如用 L1 损失代替 MSE）。",
    eval_tips_p2: "KL 散度降为 0 时，说明编码器将所有输入都映射到标准正态分布，丧失了区分能力。此时可以减小 KL 权重，或采用 KL 退火策略——训练初期让 KL 权重从 0 逐渐增加到 1。",
    eval_tips_p3: "训练不稳定时，可以降低学习率、增大 batch_size、或使用梯度裁剪（torch.nn.utils.clip_grad_norm_）来稳定训练过程。",

    h2_limitations: "VAE 的局限性与改进",
    limitations_p1: "VAE 虽然强大，但也存在一些值得了解的局限性，以及对应的改进方向：",
    limitations_h3_blur: "生成图片模糊",
    limitations_blur_p1: "这是 VAE 最明显的问题。原因在于 <strong>MSE 损失的特性</strong>——当模型不确定某个像素应该是 0 还是 1 时，它会选择输出 0.5（平均值）来降低 MSE。这导致生成的图片看起来「雾蒙蒙」的。",
    limitations_blur_p2: "改进方法：使用感知损失（Perceptual Loss）代替 MSE，比较的是图片的高级特征而非像素值；使用 GAN（生成对抗网络）的判别器来判断生成图片是否「真实」；使用更复杂的后验分布（如 Normalizing Flow）。",
    limitations_h3_posterior: "后验坍缩（Posterior Collapse）",
    limitations_posterior_p1: "有时候训练后 <strong>KL 散度降为 0</strong>，编码器把所有输入都映射到标准正态分布，解码器忽略 z，只从噪声中生成图片。这是因为解码器太强大，不需要 z 就能生成合理的图片。",
    limitations_posterior_p2: "改进方法：使用 KL 退火策略（训练初期 KL 权重从 0 逐渐增加到 1）；使用 Free Bits 策略（给 KL 散度设一个最小值）；使用更弱的解码器（如减少层数）。",
    limitations_h3_interp: "潜在空间插值质量",
    limitations_interp_p1: "VAE 的潜在空间插值有时候不够平滑——两个数字之间的过渡可能不自然。这是因为 KL 散度只约束了<strong>边缘分布</strong>为正态分布，没有约束<strong>联合分布</strong>。",
    limitations_interp_p2: "改进方法：使用 β-VAE（β > 1 增强 KL 约束）；使用 WAE（Wasserstein Autoencoder）使用其他距离度量；使用 VQ-VAE（Vector Quantized VAE）使用离散潜在空间。",

    h2_ref: "参考资源",
    ref_li1: "论文：<a href='https://arxiv.org/abs/1312.6114' target='_blank' rel='noopener noreferrer' class='text-indigo-600 dark:text-indigo-400 hover:underline'>Kingma & Welling, <em>Auto-Encoding Variational Bayes</em>, 2013</a>",
    ref_li2: "代码：本文所有代码来自 ",
    ref_li3: "QA 页面：更多 VAE 相关问答见 ",

    h2_data: "数据处理细节",
    data_p1: "训练之前，数据需要经过预处理。以下是两个关键环节：",
    data_h3_norm: "归一化",
    data_norm_p1: "原图像素范围可能是 [0.1, 0.9]，min=0.1, max=0.9，归一化公式：(images - min) / (max - min + 1e-8)，每个像素变成 [0, 1] 之间的数。一个像素值 0.5 → (0.5 - 0.1) / 0.8 = 0.5，保持相对关系。+1e-8 防止分母为 0。",
    data_norm_p2: "归一化的必要性在于：图像保存函数假设输入在 [0, 1] 范围内，直接映射到 [0, 255]。如果输入超出范围，会被截断——负值变为纯黑，大于 1 的值变为纯白。归一化确保所有像素值落在有效区间内。",
    data_h3_size: "输入尺寸的约束",
    data_size_p1: "模型对输入尺寸有严格要求。整个网络的尺寸是硬编码的——例如 fc_mu = nn.Linear(64*7*7, latent_size) 固定了输入维度为 3136。如果将图片改为 64×64，中间维度变为 64×16×16 = 16384，与 3136 不匹配，会直接报错。同理，彩色图片的 3 通道也无法通过单通道的卷积层。",
    data_size_p2: "值得注意的是，28 这个数字并非在代码中显式定义，而是从网络结构推导出来的：两次 stride=2 的卷积将尺寸缩小为 1/4，即 H/4 = 7，反推 H = 28。模型不会验证输入尺寸，只能通过修改全连接层的维度来适配不同的输入。",
  },
  en: {
    h2_intro: "What is VAE?",
    intro_p1: "Imagine you have a bunch of handwritten digit images (MNIST dataset), and you want the machine to \"learn\" what digits look like, then generate new digit images on its own. This is the task of a <strong>generative model</strong>.",
    intro_p2: "VAE (Variational Autoencoder) is a type of generative model. Its core idea is simple:",
    intro_li1: "<strong>Encoder</strong>: \"Compresses\" an image into a small numerical vector (e.g., just 4 numbers)",
    intro_li2: "<strong>Decoder</strong>: \"Reconstructs\" the image from this small vector",
    intro_li3: "<strong>Latent Space</strong>: The space where these vectors live, where each point corresponds to an image",
    intro_p3: "If training is successful, we just need to sample a random vector from the latent space, feed it to the decoder, and generate a brand new image that looks like a real digit.",

    h2_arch: "Network Architecture",
    arch_p1: "Let's look at the concrete implementation in code. The entire VAE consists of three parts:",
    arch_conv_title: "Convolution Basics Review",
    arch_conv_p1: "Before looking at the code, let's understand convolution. Convolution is 'scanning an image with a small window'. Suppose the image is a 5×5 pixel matrix and the kernel is a 3×3 matrix. The kernel slides from left to right, top to bottom like a flashlight. At each position, it <strong>multiplies element-wise and sums</strong> the covered 3×3 region with the kernel to get one pixel of the output.",
    arch_conv_p2: "Key parameters: <code>stride</code> controls how many steps the window moves each time, stride=2 halves the output size; <code>padding</code> adds a ring of 0s around the image, ensuring edge pixels can be scanned. Output size formula: floor((input_size + 2×padding - kernel_size) / stride) + 1.",
    arch_conv_p3: "Convolution kernels are <strong>independent learnable parameters</strong>, not fixed. Randomly generated before training, continuously adjusted through backpropagation during training, and fixed after training. Each kernel learns to detect different features — some find edges, some find textures, some find shapes.",
    arch_h3_enc: "Encoder",
    arch_enc_p1: "The encoder's task is to compress a 28×28 grayscale image into two vectors: mean μ and log-variance log(σ²). Why two outputs? Because we need them to define a normal distribution.",
    arch_enc_code_title: "Encoder Code (model.py)",
    arch_enc_explain1: "Two convolutional layers progressively reduce spatial dimensions:",
    arch_enc_explain2: "28×28 → 14×14 → 7×7",
    arch_enc_explain3: "while increasing channels: 1 → 32 → 64 (extracting more features)",
    arch_enc_explain4: "Finally, fully connected layers output two",
    arch_enc_explain5: "-dimensional vectors: μ and log(σ²)",
    arch_enc_detail: "Line-by-line breakdown:",
    arch_enc_d1: "<code>Conv2d(1, 32, kernel_size=3, stride=2, padding=1)</code> — Input 1 channel (grayscale), output 32 channels, stride=2 halves the size (28→14)",
    arch_enc_d2: "<code>BatchNorm2d(32)</code> — Stabilizes training, accelerates convergence, prevents gradient vanishing",
    arch_enc_d3: "<code>LeakyReLU</code> — Smoother than ReLU, avoids the \"dying neuron\" problem",
    arch_enc_d4: "<code>fc_mu</code> and <code>fc_logvar</code> — Two separate FC layers outputting mean and log-variance respectively",
    arch_enc_d5: "Why output log(σ²) instead of σ? Log can take any real value, more numerically stable",
    arch_enc_deep: "Deep Dive: Channels & Information Compression",
    arch_enc_deep_p1: "What channels mean: channels = number of 'observation angles'. Shallow channels detect edges and textures; deep channels combine into curves and shapes. 1→32→64 is a 'doubling per layer' strategy — each time spatial dimensions halve (losing detail), channels double (increasing representation capacity). Using more 'angles' to compensate for the loss of 'resolution'.",
    arch_enc_deep_p2: "Does halving stride lose information? Yes. 28→14 loses half the spatial resolution. But this is not a bug — it's the design purpose. The kernel learns to discard 'unimportant details' and concentrate 'meaningful features' into a smaller space.",
    arch_enc_deep_p3: "How to ensure discarded details are unimportant? The kernel is forced to learn. The encoder's situation: input 784 pixels, output only 4 numbers, with the rule that no matter how aggressively you compress, the Decoder must reconstruct. First attempt (random weights): random compression, Decoder reconstructs noise, huge loss. Backpropagation says: 'this pixel you discarded, Decoder needs it when reconstructing, increase related weights'; 'this pixel you kept, Decoder doesn't use it, decrease related weights'. After tens of thousands of iterations, it automatically converges to a strategy.",
    arch_enc_deep_p4: "How are FC layer weights generated? Randomly generated before training. Count = input positions × output positions. <code>fc_mu = nn.Linear(3136, 4)</code> — PyTorch automatically creates a [3136, 4] matrix, each number randomly generated. 3136×4 = 12544 independent weights. During training, each batch triggers loss calculation, backpropagation, and individual fine-tuning of all 12544 weights.",

    arch_h3_dec: "Decoder",
    arch_dec_p1: "The decoder does the reverse: reconstructs a 28×28 image from a small vector.",
    arch_dec_code_title: "Decoder Code (model.py)",
    arch_dec_explain1: "Fully connected layer expands the",
    arch_dec_explain2: "-dimensional vector into a 64×7×7 feature map",
    arch_dec_explain3: "Two transposed convolution layers progressively upsample: 7×7 → 14×14 → 28×28",
    arch_dec_explain4: "Finally, Sigmoid activation compresses pixel values to [0, 1]",
    arch_dec_detail: "Line-by-line breakdown:",
    arch_dec_d1: "<code>Linear(latent_size, 64*7*7)</code> — Expands the 4D latent vector into 3136 dimensions",
    arch_dec_d2: "<code>ConvTranspose2d</code> — Transposed convolution (aka deconvolution), upsamples image size",
    arch_dec_d3: "<code>output_padding=1</code> — Ensures exact size doubling (7→14→28)",
    arch_dec_d4: "<code>Sigmoid</code> — Compresses output to [0,1], corresponding to pixel grayscale values",

    arch_h3_vae: "VAE Assembly",
    arch_vae_p1: "Combine encoder and decoder, with reparameterization in between:",
    arch_vae_deep: "How VAE Works as a Whole",
    arch_vae_deep_p1: "The Decoder process is specifically determined by z. The Decoder is a deterministic function: input z, output image, no randomness. The same z always produces the same image. Randomness only exists when sampling z, not inside the Decoder.",
    arch_vae_deep_p2: "Upscaling and downscaling are essentially the same. Encoder downscales with Conv2d(stride=2), Decoder upscales with ConvTranspose2d(stride=2) — inserting 0s between pixels first, then scanning with a 3×3 kernel. Same mathematical framework (convolution), same training method (gradient weight updates), just opposite directions.",
    arch_vae_deep_p3: "Any z values within a suitable range can generate accurate images. Any z within the distribution region [-2, 2] compressed by KL divergence can. But manually constructing z=[100, 200, -300, 50] produces noise, because this z was never seen during training.",
    arch_vae_deep_p4: "How to determine that learning is effective? Not by comparing later — during training there are three pieces of evidence: loss decreases (from 50+ to 30), reconstructed images look more like the original (epoch 0 is noise, epoch 90 is nearly identical), generated images become clearer (epoch 0 is a gray blob, epoch 90 is a clear digit).",
    arch_vae_code_title: "VAE Code (model.py)",

    h2_reparam: "Reparameterization Trick",
    reparam_p1: "This is the most clever design in VAE. The problem: the encoder outputs a distribution (μ and σ), and we need to \"sample\" z from this distribution. But sampling is non-differentiable — we can't backpropagate through it.",
    reparam_p2: "Solution: shift the randomness to an external noise ε:",
    reparam_formula_desc: "Reparameterization formula:",
    reparam_explain: "where ε is sampled from standard normal N(0,1). Now z is still random, but is a deterministic function of μ and σ, enabling normal backpropagation.",
    reparam_code_title: "Reparameterization Code",
    reparam_deep: "Why Reparameterization is Needed",
    reparam_deep_p1: "Sampling is non-differentiable. If we directly sample z from N(μ, σ²), the gradient of z with respect to μ and σ is 0 — backpropagation can't pass through, weights can't be updated.",
    reparam_deep_p2: "Reparameterization splits the sampling into two steps: first sample ε from standard normal (this operation doesn't need gradients), then compute z = μ + ε×σ (this operation is deterministic, can compute gradients). Now the gradient of z with respect to μ is 1, with respect to σ is ε — gradients can flow back normally.",
    reparam_deep_p3: "Intuitive understanding: imagine tuning a radio. μ is the center frequency, σ is the bandwidth. Reparameterization is like first fixing a random noise ε, then when you adjust μ and σ, the output z changes accordingly. This way you can control the distribution of z by adjusting μ and σ.",

    h2_loss: "Loss Function",
    loss_p1: "VAE's loss function consists of two parts:",
    loss_math_title: "Mathematical Derivation (Optional)",
    loss_math_p1: "VAE's loss function comes from the lower bound of the log-likelihood function (ELBO). Given data x, we want to maximize log p(x), but direct computation is difficult (requires integrating over all possible z). VAE uses variational inference to construct an optimizable lower bound:",
    loss_math_p2: "log p(x) ≥ E[log p(x|z)] - KL(q(z|x) || p(z))",
    loss_math_p3: "The first term E[log p(x|z)] is the reconstruction loss (another form of MSE), measuring the decoder's ability to reconstruct x from z. The second term KL(q(z|x) || p(z)) is the KL divergence, measuring how far the encoder's output distribution q(z|x) is from the prior distribution p(z) (standard normal).",
    loss_math_p4: "Intuitive understanding: we're simultaneously doing two things — making reconstructed images look as much like the original as possible (first term), and making the encoder's output distribution as close to standard normal as possible (second term). They balance each other, eventually reaching equilibrium.",
    loss_h3_recon: "Reconstruction Loss (MSE)",
    loss_recon_p1: "Measures how different the reconstructed image is from the original. Uses Mean Squared Error (MSE), multiplied by 784 (28×28 total pixels) to match the magnitude of KL divergence:",
    loss_recon_deep: "MSE Characteristics",
    loss_recon_deep_p1: "MSE treats all errors equally — each pixel's difference is penalized proportionally, small errors get small penalties, large errors get large penalties. There is no threshold like 'errors below 0.2 are forgiven'. Squared penalty is inherently a nonlinear amplification — large errors are penalized far more than small ones.",
    loss_recon_deep_p2: "Why multiply by 784? Magnitude = the scale of a numerical value. Without multiplying by 784, MSE is about 0.05, KL about 2.0, KL dominates training. After multiplying by 784, MSE is about 39, both at the same magnitude. 784 = 28×28 is the total pixel count; 'per-pixel average' × 784 = 'whole-image sum'. Other values work too, e.g., setting hyperparameter β: loss = β×MSE + KL. But 784 is a well-fitting empirical value.",
    loss_recon_code_title: "Reconstruction Loss Code",
    loss_recon_explain: "reduction='mean' computes per-pixel average error, multiplying by 784 restores total image error",

    loss_h3_kl: "KL Divergence",
    loss_kl_p1: "Measures how far the encoder's output distribution is from standard normal N(0,1). Smaller KL divergence means a more regular latent space and better sampling:",
    loss_kl_deep: "The Role of KL Divergence",
    loss_kl_deep_p1: "KL divergence measures the difference between two distributions. In VAE, it measures how far the encoder's output distribution (defined by μ and σ) is from standard normal N(0,1). μ=0, σ=1, KL≈0 (perfect); μ=3, σ=0.1, KL very large (both biased and narrow).",
    loss_kl_deep_p2: "Why constrain to normal distribution? Because during generation we sample z from standard normal. If during training the encoder's output distribution is not normal, then during generation the sampled z will be in regions never seen during training, the decoder won't know how to handle it, and generation quality will be poor.",
    loss_kl_deep_p3: "Balance between KL and MSE: MSE makes reconstructed images look more like originals, KL makes the latent space more regular. They balance each other. If only optimizing MSE, the encoder maps each digit to a different corner of latent space (overfitting); if only optimizing KL, the encoder maps all digits to the origin (losing information).",
    loss_kl_code_title: "KL Divergence Code",
    loss_kl_explain: "The derivation involves probability theory. Intuitively: it pushes the encoder's output distribution toward standard normal",

    loss_h3_total: "Total Loss",
    loss_total_p1: "The two parts add up to the total loss:",
    loss_total_formula: "L = MSE × 784 + KL",
    loss_total_explain: "During training, MSE makes reconstructions look more like originals, KL makes the latent space more regular. They balance each other.",

    h2_train: "Training Process",
    train_p1: "The training code is very concise. The core loop is: forward pass → compute loss → backward pass → update weights:",
    train_code_title: "Training Code (train.py)",
    train_params: "Key hyperparameters:",
    train_p2: "batch_size = 256, learning_rate = 0.001, latent_size = 4 (4D latent space), num_epochs = 100",
    train_deep: "Deep Dive: Training Mechanism",
    train_deep_p1: "Do Encoder and Decoder learn simultaneously? Yes. Feedback adjustment is backpropagation, in three steps: Step 1 forward pass (run once); Step 2 backpropagation (trace back along the computation graph — MSE tells Decoder its output pixels are off by 0.4, KL tells Encoder its distribution width is unreasonable); Step 3 weight update (each weight = original value - learning rate × gradient).",
    train_deep_p2: "Gradients are globally connected. Starting from the loss, tracing back along the computation graph. Every weight reached is assigned a share of 'responsibility' (gradient). conv1's 5th kernel receives gradients from both MSE and KL, combined, then fine-tuned in the direction of the combined force. There is no 'local optimization' — one chain from start to finish.",
    train_deep_p3: "Training is completely autonomous. You only need to do three things: write the model structure (already done), feed data (MNIST dataset), run python train.py. After that, the process is fully automatic: a batch of images in, forward pass, compute loss, backpropagation, update weights, next batch in, repeat this cycle. You don't need to manually adjust weights or tell the model 'this is digit 3'.",
    train_deep_p4: "Weight storage: during training, stored in GPU memory. All kernels, fc weight matrices, bn parameters are loaded into GPU VRAM. During forward pass, weights and intermediate data are in VRAM; after backward, intermediate results are released but updated weights remain. Periodically, torch.save packages VRAM weights into a .pth file. Without saving, closing the process clears VRAM and all weights are lost.",

    h2_result: "Training Results",
    result_p1: "After 100 epochs, the model demonstrates three capabilities:",
    result_li1: "<strong>Reconstruct images</strong>: Input a handwritten digit, output an almost identical image",
    result_li2: "<strong>Generate images</strong>: Sample z from standard normal, decode to generate brand new digit images",
    result_li3: "<strong>Latent space interpolation</strong>: Linearly interpolate between two digits' z to generate smooth transitions",
    result_img_recon_caption: "▲ Reconstruction: top row = original MNIST images, bottom row = VAE reconstructions",
    result_recon_desc: "The reconstruction comparison demonstrates VAE's core capability. Top row shows original MNIST handwritten digits, bottom row shows VAE reconstructions. The reconstructed digits closely match the originals — stroke thickness, tilt angle, and overall shape are highly preserved. Occasional blurriness is expected with only 4 latent dimensions, as information compression is lossy, but overall quality is good.",
    result_img_gen_caption: "▲ Random generation: 100 latent vectors sampled from N(0,1) and decoded into new digit images",
    result_gen_desc: "These digits don't exist in the original dataset — they were \"created\" by the model. This is the value of VAE: once it learns the data distribution, it can sample new examples from it. The generated digits are clear and recognizable, showing the model truly understands 'what digits look like' rather than simply memorizing training images.",
    result_p2: "The latent space is only 4-dimensional, but it's enough for the model to distinguish different digits. Each dimension controls some feature (like stroke thickness, tilt angle, etc.). By interpolating in latent space, we can see smooth transitions between digits — for example, morphing from 3 to 8, with intermediate shapes looking like a blend of both.",

    h2_summary: "Summary & Review",
    summary_p1: "Through this article, we understood the core principles of VAE from scratch. Let's review the entire learning process:",
    summary_h3_what: "What We Learned",
    summary_what_p1: "VAE is a generative model whose core idea is 'compress and reconstruct'. The encoder compresses an image into a small vector (a point in latent space), and the decoder reconstructs the image from this vector. Through training, the model learns the essential features of data, and can randomly sample from the latent space to generate brand new images.",
    summary_h3_key: "Three Key Designs",
    summary_key_li1: "<strong>Reparameterization trick</strong>: Turns non-differentiable sampling into a differentiable computation graph, enabling normal gradient backpropagation",
    summary_key_li2: "<strong>KL divergence constraint</strong>: Makes the encoder's output distribution approach standard normal, making generation-time sampling effective",
    summary_key_li3: "<strong>MSE reconstruction loss</strong>: Makes reconstructed images look as much like originals as possible, forcing the model to learn essential data features",
    summary_h3_why: "Why This Design",
    summary_why_p1: "These three designs work together: reparameterization makes training possible, KL divergence makes generation possible, MSE ensures reconstruction quality. All three are indispensable, together forming VAE's complete training framework.",
    summary_h3_next: "Next Learning Steps",
    summary_next_p1: "After understanding basic VAE, you can continue exploring: color image generation (extending to 3 channels), CVAE (conditional generation, specifying which digit to generate), β-VAE (enhanced latent space disentanglement), VQ-VAE (discrete latent space, used for text generation).",
    summary_p2: "Next, we'll extend to color image generation and explore different network architectures and loss function combinations.",

    h2_eval: "Model Evaluation & Tuning",
    eval_p1: "How to evaluate VAE's performance? Here are several key metrics:",
    eval_h3_recon: "Reconstruction Quality",
    eval_recon_p1: "The most intuitive evaluation is to check how similar reconstructed images are to originals. Can be quantified with MSE, SSIM (Structural Similarity), etc. Smaller MSE means reconstruction looks more like the original. But MSE isn't the only standard — sometimes MSE is very low but images look blurry, because the model learned to 'average' to reduce error.",
    eval_h3_gen: "Generation Quality",
    eval_gen_p1: "Generation quality assessment is somewhat subjective. Common method: let humans judge whether generated images look like real digits. Can also use automated metrics like FID (Fréchet Inception Distance), but these require pretrained classification models, not very suitable for simple datasets.",
    eval_h3_latent: "Latent Space Quality",
    eval_latent_p1: "A good latent space should satisfy: continuity (similar z generates similar images), completeness (randomly sampled z all generate reasonable images), interpretability (each dimension controls some semantic feature). Can be intuitively evaluated by interpolating in latent space.",
    eval_h3_tips: "Tuning Tips",
    eval_tips_p1: "If generated images are very blurry: increase latent space dimensions (latent_size from 4 to 8 or 16); use more complex network structure (deeper convolutional layers); try different loss functions (like L1 loss instead of MSE).",
    eval_tips_p2: "If KL divergence drops to 0: the encoder maps all inputs to standard normal distribution, losing distinguishing information. Can reduce KL weight (like loss = recon_loss + 0.5 * kl_loss), or use KL annealing strategy (KL weight gradually increases from 0 to 1 during early training).",
    eval_tips_p3: "If training is unstable: reduce learning rate (from 0.001 to 0.0001); increase batch_size (from 256 to 512); use gradient clipping (torch.nn.utils.clip_grad_norm_).",

    h2_limitations: "VAE Limitations & Improvements",
    limitations_p1: "While VAE is a powerful generative model, it has some limitations:",
    limitations_h3_blur: "Blurry Generated Images",
    limitations_blur_p1: "This is the most obvious problem with VAE. The reason is the nature of MSE loss — when the model is uncertain whether a pixel should be 0 or 1, it will output 0.5 (average) to reduce MSE. This causes generated images to look 'hazy'.",
    limitations_blur_p2: "Improvements: use Perceptual Loss instead of MSE, comparing high-level features rather than pixel values; use GAN discriminator to judge whether generated images are 'realistic'; use more complex posterior distributions (like Normalizing Flow).",
    limitations_h3_posterior: "Posterior Collapse",
    limitations_posterior_p1: "Sometimes after training, KL divergence drops to 0, the encoder maps all inputs to standard normal distribution, the decoder ignores z and generates images from noise alone. This happens because the decoder is too powerful and doesn't need z to generate reasonable images.",
    limitations_posterior_p2: "Improvements: use KL annealing strategy (KL weight gradually increases from 0 to 1 during early training); use Free Bits strategy (set a minimum value for KL divergence); use a weaker decoder (like reducing layers).",
    limitations_h3_interp: "Latent Space Interpolation Quality",
    limitations_interp_p1: "VAE's latent space interpolation sometimes isn't smooth enough — transitions between two digits may look unnatural. This is because KL divergence only constrains the marginal distribution to be normal, not the joint distribution.",
    limitations_interp_p2: "Improvements: use β-VAE (β > 1 to strengthen KL constraint); use WAE (Wasserstein Autoencoder) with other distance metrics; use VQ-VAE (Vector Quantized VAE) with discrete latent space.",

    h2_ref: "References",
    ref_li1: "Paper: <a href='https://arxiv.org/abs/1312.6114' target='_blank' rel='noopener noreferrer' class='text-indigo-600 dark:text-indigo-400 hover:underline'>Kingma & Welling, <em>Auto-Encoding Variational Bayes</em>, 2013</a>",
    ref_li2: "Code: All code in this article comes from ",
    ref_li3: "Q&A: More VAE Q&A at ",

    h2_data: "Data Processing Details",
    data_p1: "Before training, data needs preprocessing. Here are several key questions:",
    data_h3_norm: "Normalization",
    data_norm_p1: "Original pixel range might be [0.1, 0.9], min=0.1, max=0.9, normalization formula: (images - min) / (max - min + 1e-8), transforms each pixel to [0, 1]. A pixel value 0.5 becomes (0.5 - 0.1) / 0.8 = 0.5, preserving relative relationships. +1e-8 prevents division by zero.",
    data_norm_p2: "Why normalize? save_image assumes input is in [0, 1] and maps directly to [0, 255]. Input -0.5 clips to 0, pure black; input 2.0 clips to 1, pure white. Normalization stretches all values back to [0, 1].",
    data_h3_size: "Input Size",
    data_size_p1: "If the input image is not 28×28 pixels, can the model still work? If you just change the image to 64×64 or color without changing code — it won't run. The entire network's dimensions are hardcoded. fc_mu = nn.Linear(64*7*7, latent_size) locks the input to 3136. Switching to 64×64 gives 64×16×16 = 16384, mismatching 3136, causing an error.",
    data_size_p2: "Where does 28 come from? It's not hardcoded. There's no line in model.py that writes 28. 28 is derived from the data structure itself. How is 64×7×7 derived? Conv2d stride=2 twice: input H, H/2, H/4. H/4 = 7, so H = 28. The model doesn't check if it's 28 or 64 — the fc layer hardcodes 3136, feeding a 32×32 image will cause an error.",
  },
} as const;

// ── 代码块双语定义 ──
const codeBlocks = {
  encoder: {
    zh: `class Encoder(nn.Module):
    def __init__(self, latent_size):
        super(Encoder, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, stride=2, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        # 输出均值和方差
        self.fc_mu = nn.Linear(64*7*7, latent_size)
        self.fc_logvar = nn.Linear(64*7*7, latent_size)

    def forward(self, x):
        x = F.leaky_relu(self.bn1(self.conv1(x)))  # 28×28 → 14×14
        x = F.leaky_relu(self.bn2(self.conv2(x)))  # 14×14 → 7×7
        x = x.flatten(1)                            # 展平为 3136 维
        mu = self.fc_mu(x)                           # 输出均值 μ
        logvar = self.fc_logvar(x)                   # 输出对数方差 log(σ²)
        return mu, logvar`,
    en: `class Encoder(nn.Module):
    def __init__(self, latent_size):
        super(Encoder, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, stride=2, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        # Output mean and variance
        self.fc_mu = nn.Linear(64*7*7, latent_size)
        self.fc_logvar = nn.Linear(64*7*7, latent_size)

    def forward(self, x):
        x = F.leaky_relu(self.bn1(self.conv1(x)))  # 28×28 → 14×14
        x = F.leaky_relu(self.bn2(self.conv2(x)))  # 14×14 → 7×7
        x = x.flatten(1)                            # Flatten to 3136 dims
        mu = self.fc_mu(x)                           # Output mean μ
        logvar = self.fc_logvar(x)                   # Output log-variance log(σ²)
        return mu, logvar`,
  },
  decoder: {
    zh: `class Decoder(nn.Module):
    def __init__(self, latent_size):
        super(Decoder, self).__init__()
        self.fc = nn.Linear(latent_size, 64*7*7)
        self.bn_fc = nn.BatchNorm1d(64*7*7)
        self.deconv1 = nn.ConvTranspose2d(64, 32, kernel_size=3, stride=2, padding=1, output_padding=1)
        self.bn3 = nn.BatchNorm2d(32)
        self.deconv2 = nn.ConvTranspose2d(32, 1, kernel_size=3, stride=2, padding=1, output_padding=1)

    def forward(self, z):
        x = F.leaky_relu(self.bn_fc(self.fc(z)))    # z → 3136 维
        x = x.view(-1, 64, 7, 7)                    # 重塑为特征图
        x = F.leaky_relu(self.bn3(self.deconv1(x))) # 7×7 → 14×14
        x = torch.sigmoid(self.deconv2(x))           # 14×14 → 28×28
        return x`,
    en: `class Decoder(nn.Module):
    def __init__(self, latent_size):
        super(Decoder, self).__init__()
        self.fc = nn.Linear(latent_size, 64*7*7)
        self.bn_fc = nn.BatchNorm1d(64*7*7)
        self.deconv1 = nn.ConvTranspose2d(64, 32, kernel_size=3, stride=2, padding=1, output_padding=1)
        self.bn3 = nn.BatchNorm2d(32)
        self.deconv2 = nn.ConvTranspose2d(32, 1, kernel_size=3, stride=2, padding=1, output_padding=1)

    def forward(self, z):
        x = F.leaky_relu(self.bn_fc(self.fc(z)))    # z → 3136 dims
        x = x.view(-1, 64, 7, 7)                    # Reshape to feature map
        x = F.leaky_relu(self.bn3(self.deconv1(x))) # 7×7 → 14×14
        x = torch.sigmoid(self.deconv2(x))           # 14×14 → 28×28
        return x`,
  },
  vae: {
    zh: `class VAE(nn.Module):
    def __init__(self, latent_size):
        super(VAE, self).__init__()
        self.encoder = Encoder(latent_size)
        self.decoder = Decoder(latent_size)

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)   # σ = exp(0.5 × log(σ²))
        eps = torch.randn_like(std)      # ε ~ N(0,1)
        return mu + eps * std            # z = μ + ε × σ

    def forward(self, x):
        mu, logvar = self.encoder(x)     # 编码
        z = self.reparameterize(mu, logvar)  # 重参数化采样
        return self.decoder(z), mu, logvar   # 解码`,
    en: `class VAE(nn.Module):
    def __init__(self, latent_size):
        super(VAE, self).__init__()
        self.encoder = Encoder(latent_size)
        self.decoder = Decoder(latent_size)

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)   # σ = exp(0.5 × log(σ²))
        eps = torch.randn_like(std)      # ε ~ N(0,1)
        return mu + eps * std            # z = μ + ε × σ

    def forward(self, x):
        mu, logvar = self.encoder(x)     # Encode
        z = self.reparameterize(mu, logvar)  # Reparameterize & sample
        return self.decoder(z), mu, logvar   # Decode`,
  },
  reparam: {
    zh: `def reparameterize(self, mu, logvar):
    std = torch.exp(0.5 * logvar)   # 从 log(σ²) 计算 σ
    eps = torch.randn_like(std)      # 从标准正态采样 ε
    return mu + eps * std            # 重参数化`,
    en: `def reparameterize(self, mu, logvar):
    std = torch.exp(0.5 * logvar)   # Compute σ from log(σ²)
    eps = torch.randn_like(std)      # Sample ε from standard normal
    return mu + eps * std            # Reparameterize`,
  },
  train: {
    zh: `for epoch in range(num_epochs):
    vae.train()
    for data in dataloader:
        inputs, _ = data
        inputs = inputs.to(device)
        optimizer.zero_grad()

        # 前向传播
        recon_x, mu, logvar = vae(inputs)

        # 计算损失
        recon_loss = F.mse_loss(recon_x, inputs, reduction='mean') * 784
        kl_loss = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())
        loss = recon_loss + kl_loss

        # 反向传播 + 更新权重
        loss.backward()
        optimizer.step()`,
    en: `for epoch in range(num_epochs):
    vae.train()
    for data in dataloader:
        inputs, _ = data
        inputs = inputs.to(device)
        optimizer.zero_grad()

        # Forward pass
        recon_x, mu, logvar = vae(inputs)

        # Compute loss
        recon_loss = F.mse_loss(recon_x, inputs, reduction='mean') * 784
        kl_loss = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())
        loss = recon_loss + kl_loss

        # Backward pass + update weights
        loss.backward()
        optimizer.step()`,
  },
};

export default function VAEPost1() {
  const { lang } = useLang();
  const c = content[lang];

  return (
    <BlogPostLayout post={post} seriesPosts={seriesPosts}>
      {/* 什么是 VAE */}
      <h2>{c.h2_intro}</h2>
      <p dangerouslySetInnerHTML={{ __html: c.intro_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: c.intro_p2 }} />
      <ul>
        <li dangerouslySetInnerHTML={{ __html: c.intro_li1 }} />
        <li dangerouslySetInnerHTML={{ __html: c.intro_li2 }} />
        <li dangerouslySetInnerHTML={{ __html: c.intro_li3 }} />
      </ul>
      <p>{c.intro_p3}</p>

      {/* 网络架构 */}
      <h2>{c.h2_arch}</h2>
      <p>{c.arch_p1}</p>

      {/* 卷积基础回顾 */}
      <div className="mt-8 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.arch_conv_title}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2" dangerouslySetInnerHTML={{ __html: c.arch_conv_p1 }} />
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2" dangerouslySetInnerHTML={{ __html: c.arch_conv_p2 }} />
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200" dangerouslySetInnerHTML={{ __html: c.arch_conv_p3 }} />
      </div>

      <h3>{c.arch_h3_enc}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.arch_enc_p1 }} />
      <CodeBlock language="python">{codeBlocks.encoder[lang]}</CodeBlock>
      <p>
        {c.arch_enc_explain1}<br />
        {c.arch_enc_explain2}<br />
        {c.arch_enc_explain3}<br />
        {c.arch_enc_explain4} <InlineMath>{"\\mu"}</InlineMath> {c.arch_enc_explain5}
      </p>

      {/* 编码器逐行解析 */}
      <div className="mt-6 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.arch_enc_detail}</p>
        <ul className="space-y-2 text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">
          <li dangerouslySetInnerHTML={{ __html: c.arch_enc_d1 }} />
          <li dangerouslySetInnerHTML={{ __html: c.arch_enc_d2 }} />
          <li dangerouslySetInnerHTML={{ __html: c.arch_enc_d3 }} />
          <li dangerouslySetInnerHTML={{ __html: c.arch_enc_d4 }} />
          <li dangerouslySetInnerHTML={{ __html: c.arch_enc_d5 }} />
        </ul>
      </div>

      {/* 编码器深入理解 */}
      <div className="mt-8 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.arch_enc_deep}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.arch_enc_deep_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.arch_enc_deep_p2}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.arch_enc_deep_p3}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200" dangerouslySetInnerHTML={{ __html: c.arch_enc_deep_p4 }} />
      </div>

      <h3>{c.arch_h3_dec}</h3>
      <p>{c.arch_dec_p1}</p>
      <CodeBlock language="python">{codeBlocks.decoder[lang]}</CodeBlock>
      <p>
        {c.arch_dec_explain1} <InlineMath>{"d_{\\text{latent}}"}</InlineMath> {c.arch_dec_explain2}<br />
        {c.arch_dec_explain3}<br />
        {c.arch_dec_explain4}
      </p>

      {/* 解码器逐行解析 */}
      <div className="mt-6 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.arch_dec_detail}</p>
        <ul className="space-y-2 text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">
          <li dangerouslySetInnerHTML={{ __html: c.arch_dec_d1 }} />
          <li dangerouslySetInnerHTML={{ __html: c.arch_dec_d2 }} />
          <li dangerouslySetInnerHTML={{ __html: c.arch_dec_d3 }} />
          <li dangerouslySetInnerHTML={{ __html: c.arch_dec_d4 }} />
        </ul>
      </div>

      <h3>{c.arch_h3_vae}</h3>
      <p>{c.arch_vae_p1}</p>
      <CodeBlock language="python">{codeBlocks.vae[lang]}</CodeBlock>

      {/* VAE 整体工作机制 */}
      <div className="mt-8 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.arch_vae_deep}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.arch_vae_deep_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.arch_vae_deep_p2}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.arch_vae_deep_p3}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.arch_vae_deep_p4}</p>
      </div>

      {/* 重参数化技巧 */}
      <h2>{c.h2_reparam}</h2>
      <p dangerouslySetInnerHTML={{ __html: c.reparam_p1 }} />
      <p>{c.reparam_p2}</p>
      <p>{c.reparam_formula_desc}</p>
      <MathBlock>{"z = \\mu + \\epsilon \\cdot \\sigma, \\quad \\epsilon \\sim \\mathcal{N}(0, 1)"}</MathBlock>
      <p>{c.reparam_explain}</p>
      <p>{c.reparam_code_title}：</p>
      <CodeBlock language="python">{codeBlocks.reparam[lang]}</CodeBlock>

      {/* 重参数化深入解释 */}
      <div className="mt-8 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.reparam_deep}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.reparam_deep_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.reparam_deep_p2}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.reparam_deep_p3}</p>
      </div>

      {/* 损失函数 */}
      <h2>{c.h2_loss}</h2>

      {/* Loss 曲线图 — 损失函数开头 */}
      <figure className="my-8">
        <img
          src={`${BASE_PATH}/vae-images/vae-loss-curve.png`}
          alt={lang === "zh" ? "VAE 训练 Loss 曲线" : "VAE training loss curve"}
          className="rounded-xl shadow-lg w-full max-w-xl mx-auto"
        />
        <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          {lang === "zh" ? "▲ 训练过程中的 Loss 下降曲线（MSE + KL）" : "▲ Training loss curve (MSE + KL) over epochs"}
        </figcaption>
      </figure>

      <p dangerouslySetInnerHTML={{ __html: c.loss_p1 }} />

      {/* 数学推导 */}
      <div className="mt-8 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.loss_math_title}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2" dangerouslySetInnerHTML={{ __html: c.loss_math_p1 }} />
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2 font-mono">{c.loss_math_p2}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.loss_math_p3}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.loss_math_p4}</p>
      </div>

      <h3>{c.loss_h3_recon}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.loss_recon_p1 }} />
      <MathBlock>{"\\mathcal{L}_{\\text{recon}} = \\text{MSE}(x, \\hat{x}) \\times 784"}</MathBlock>
      <CodeBlock language="python">{`recon_loss = F.mse_loss(recon_x, inputs, reduction='mean') * 784`}</CodeBlock>
      <p>{c.loss_recon_explain}</p>

      {/* MSE 深入解释 */}
      <div className="mt-8 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.loss_recon_deep}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.loss_recon_deep_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.loss_recon_deep_p2}</p>
      </div>

      <h3>{c.loss_h3_kl}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.loss_kl_p1 }} />
      <MathBlock>{"D_{\\text{KL}} = -\\frac{1}{2} \\sum_{i=1}^{d} (1 + \\log(\\sigma_i^2) - \\mu_i^2 - \\sigma_i^2)"}</MathBlock>
      <CodeBlock language="python">{`kl_loss = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())`}</CodeBlock>
      <p>{c.loss_kl_explain}</p>

      {/* KL 散度深入解释 */}
      <div className="mt-8 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.loss_kl_deep}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.loss_kl_deep_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.loss_kl_deep_p2}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.loss_kl_deep_p3}</p>
      </div>

      <h3>{c.loss_h3_total}</h3>
      <p>{c.loss_total_p1}</p>
      <MathBlock>{"\\mathcal{L} = \\mathcal{L}_{\\text{recon}} + D_{\\text{KL}}"}</MathBlock>
      <p>{c.loss_total_explain}</p>

      {/* 数据处理细节 */}
      <h2>{c.h2_data}</h2>
      <p>{c.data_p1}</p>

      <h3>{c.data_h3_norm}</h3>
      <p>{c.data_norm_p1}</p>
      <p>{c.data_norm_p2}</p>

      <h3>{c.data_h3_size}</h3>
      <p>{c.data_size_p1}</p>
      <p>{c.data_size_p2}</p>

      {/* 训练过程 */}
      <h2>{c.h2_train}</h2>

      {/* 重建对比图 — 训练过程开头 */}
      <figure className="my-8">
        <img
          src={`${BASE_PATH}/vae-images/vae-reconstruction.jpg`}
          alt={lang === "zh" ? "VAE 重建对比：上排原图，下排重建" : "VAE reconstruction: top row original, bottom row reconstructed"}
          className="rounded-xl shadow-lg w-full"
        />
        <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          {c.result_img_recon_caption}
        </figcaption>
      </figure>

      <p dangerouslySetInnerHTML={{ __html: c.train_p1 }} />
      <CodeBlock language="python">{codeBlocks.train[lang]}</CodeBlock>
      <p><strong>{c.train_params}</strong> {c.train_p2}</p>

      {/* 训练机制深入理解 */}
      <div className="mt-8 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{c.train_deep}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.train_deep_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.train_deep_p2}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200 mb-2">{c.train_deep_p3}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.train_deep_p4}</p>
      </div>

      {/* 训练结果 */}
      <h2>{c.h2_result}</h2>
      <p>{c.result_p1}</p>
      <ul>
        <li dangerouslySetInnerHTML={{ __html: c.result_li1 }} />
        <li dangerouslySetInnerHTML={{ __html: c.result_li2 }} />
        <li dangerouslySetInnerHTML={{ __html: c.result_li3 }} />
      </ul>

      <p>{c.result_recon_desc}</p>

      <p>{c.result_p2}</p>

      {/* VAE 局限性与改进 */}
      <h2>{c.h2_limitations}</h2>
      <p>{c.limitations_p1}</p>

      <CollapsibleCard title={c.limitations_h3_blur} defaultOpen={true}>
        <p className="mb-3 text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.limitations_blur_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.limitations_blur_p2}</p>
      </CollapsibleCard>

      <CollapsibleCard title={c.limitations_h3_posterior}>
        <p className="mb-3 text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.limitations_posterior_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.limitations_posterior_p2}</p>
      </CollapsibleCard>

      <CollapsibleCard title={c.limitations_h3_interp}>
        <p className="mb-3 text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.limitations_interp_p1}</p>
        <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">{c.limitations_interp_p2}</p>
      </CollapsibleCard>

      {/* 模型评估与调优 */}
      <h2>{c.h2_eval}</h2>
      <p>{c.eval_p1}</p>

      <h3>{c.eval_h3_recon}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.eval_recon_p1 }} />

      <h3>{c.eval_h3_gen}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.eval_gen_p1 }} />

      <h3>{c.eval_h3_latent}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.eval_latent_p1 }} />

      <h3>{c.eval_h3_tips}</h3>
      <p>{c.eval_tips_p1}</p>
      <p>{c.eval_tips_p2}</p>
      <p>{c.eval_tips_p3}</p>

      {/* 总结与回顾 */}
      <h2>{c.h2_summary}</h2>
      <p>{c.summary_p1}</p>

      <h3>{c.summary_h3_what}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.summary_what_p1 }} />

      <h3>{c.summary_h3_key}</h3>
      <ul>
        <li dangerouslySetInnerHTML={{ __html: c.summary_key_li1 }} />
        <li dangerouslySetInnerHTML={{ __html: c.summary_key_li2 }} />
        <li dangerouslySetInnerHTML={{ __html: c.summary_key_li3 }} />
      </ul>

      <h3>{c.summary_h3_why}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.summary_why_p1 }} />

      <h3>{c.summary_h3_next}</h3>
      <p>{c.summary_next_p1}</p>

      {/* 下一步学习方向 - 高级卡片 */}
      <div className="mt-8 mb-10 grid md:grid-cols-2 gap-4">
        {[
          { icon: "🎨", title: lang === "zh" ? "彩色图像生成" : "Color Image Generation", desc: lang === "zh" ? "扩展到 3 通道 RGB，处理更复杂的图像数据" : "Extend to 3-channel RGB, handle more complex image data", href: "/blog/vae-2-color" },
          { icon: "🎯", title: lang === "zh" ? "条件生成 CVAE" : "Conditional Generation CVAE", desc: lang === "zh" ? "指定生成某个类别的图像，如只生成数字 7" : "Specify which class to generate, e.g., only digit 7", href: "/blog/vae-3-cvae" },
          { icon: "🔬", title: lang === "zh" ? "β-VAE 解耦表示" : "β-VAE Disentangled Representation", desc: lang === "zh" ? "增强潜在空间的解耦性，每个维度控制独立特征" : "Enhance latent space disentanglement, each dimension controls independent features", href: "#" },
          { icon: "💎", title: lang === "zh" ? "VQ-VAE 离散潜在空间" : "VQ-VAE Discrete Latent Space", desc: lang === "zh" ? "使用离散编码，用于文本生成和更高质量的图像" : "Use discrete encoding for text generation and higher quality images", href: "#" },
        ].map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group relative p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
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

      {/* 下一篇 - 高级卡片 */}
      <div className="mt-12 mb-10">
        <Link
          href="/blog/vae-2-color"
          className="group block p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                {lang === "zh" ? "继续阅读" : "Continue Reading"}
              </p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {lang === "zh" ? "VAE 学习笔记（二）：彩色图像与优化" : "VAE Notes (2): Color Images & Optimization"}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {lang === "zh" ? "扩展到彩色图像生成，探索不同的网络结构和损失函数组合" : "Extend to color image generation, explore different architectures and loss functions"}
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

      {/* 参考资源 - 高级卡片 */}
      <h2>{c.h2_ref}</h2>
      <div className="mt-6 space-y-3">
        {[
          {
            icon: "📄",
            title: "Kingma & Welling, Auto-Encoding Variational Bayes, 2013",
            desc: lang === "zh" ? "VAE 原始论文" : "Original VAE paper",
            href: "https://arxiv.org/abs/1312.6114",
            external: true,
          },
          {
            icon: "💻",
            title: "The_simple_vae",
            desc: lang === "zh" ? "本文所有代码来源" : "All code in this article",
            href: "https://github.com/hasen-zcs/The_simple_vae",
            external: true,
          },
          {
            icon: "❓",
            title: "VAE Q&A",
            desc: lang === "zh" ? "更多 VAE 相关问答" : "More VAE Q&A records",
            href: `${BASE_PATH}/qa/vae`,
            external: false,
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
