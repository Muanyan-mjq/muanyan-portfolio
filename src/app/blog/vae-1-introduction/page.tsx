"use client";

import Link from "next/link";
import { useLang } from "@/components/language-context";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { MathBlock, InlineMath } from "@/components/math-block";
import { CodeBlock } from "@/components/code-block";
import { blogPosts } from "@/lib/blog-data";

const post = blogPosts.find((p) => p.slug === "vae-1-introduction")!;
const seriesPosts = blogPosts
  .filter((p) => p.series?.name.zh === post.series?.name.zh && p.published)
  .sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));

const content = {
  zh: {
    h2_intro: "什么是 VAE？",
    intro_p1: "想象你有一堆手写数字图片（MNIST 数据集），你想让机器「学会」这些数字的样子，然后自己画出新的数字图片。这就是<strong>生成模型</strong>的任务。",
    intro_p2: "VAE（Variational Autoencoder，变分自编码器）是一种生成模型。它的核心思想很简单：",
    intro_li1: "<strong>编码器</strong>（Encoder）：把一张图片「压缩」成一个小数字向量（比如只有 4 个数）",
    intro_li2: "<strong>解码器</strong>（Decoder）：把这个小向量「还原」回一张图片",
    intro_li3: "<strong>潜在空间</strong>（Latent Space）：那个小向量所在的空间，每个点都对应一张图片",
    intro_p3: "如果训练成功，我们只需要在潜在空间里随机采样一个向量，喂给解码器，就能生成一张全新的、看起来像真实数字的图片。",

    h2_arch: "网络架构",
    arch_p1: "让我们看看代码中的具体实现。整个 VAE 由三部分组成：",
    arch_h3_enc: "编码器（Encoder）",
    arch_enc_p1: "编码器的任务是把一张 28×28 的灰度图片压缩成两个向量：均值 μ 和对数方差 log(σ²)。为什么要输出两个值？因为我们需要用它们来定义一个正态分布。",
    arch_enc_code_title: "编码器代码（model.py）",
    arch_enc_explain1: "两层卷积逐步缩小空间尺寸：",
    arch_enc_explain2: "28×28 → 14×14 → 7×7",
    arch_enc_explain3: "同时增加通道数：1 → 32 → 64（提取更多特征）",
    arch_enc_explain4: "最后通过全连接层输出两个",
    arch_enc_explain5: "维向量：μ 和 log(σ²)",

    arch_h3_dec: "解码器（Decoder）",
    arch_dec_p1: "解码器的任务是反过来：把一个小向量还原成 28×28 的图片。",
    arch_dec_code_title: "解码器代码（model.py）",
    arch_dec_explain1: "全连接层把",
    arch_dec_explain2: "维向量扩展成 64×7×7 的特征图",
    arch_dec_explain3: "两层转置卷积逐步放大：7×7 → 14×14 → 28×28",
    arch_dec_explain4: "最后用 Sigmoid 激活函数把像素值压缩到 [0, 1] 范围",

    arch_h3_vae: "VAE 整体",
    arch_vae_p1: "把编码器和解码器拼起来，中间加上重参数化操作：",
    arch_vae_code_title: "VAE 代码（model.py）",

    h2_reparam: "重参数化技巧",
    reparam_p1: "这是 VAE 最巧妙的设计。问题在于：编码器输出的是一个分布（μ 和 σ），我们需要从这个分布中「采样」得到 z。但采样操作是不可微分的，没法反向传播。",
    reparam_p2: "解决方案：把随机性「转移」到一个外部噪声 ε 上：",
    reparam_formula_desc: "重参数化公式：",
    reparam_explain: "其中 ε 是从标准正态分布 N(0,1) 中采样的随机数。这样 z 仍然是随机的，但对 μ 和 σ 来说是确定性的函数，可以正常反向传播。",
    reparam_code_title: "重参数化代码",

    h2_loss: "损失函数",
    loss_p1: "VAE 的损失函数由两部分组成：",
    loss_h3_recon: "重建损失（MSE）",
    loss_recon_p1: "衡量重建图片和原图有多不像。使用均方误差（MSE），乘以 784（28×28 像素总数）让量级和 KL 散度匹配：",
    loss_recon_code_title: "重建损失代码",
    loss_recon_explain: "reduction='mean' 计算每像素平均误差，乘 784 恢复为整图总误差",

    loss_h3_kl: "KL 散度",
    loss_kl_p1: "衡量编码器输出的分布离标准正态分布 N(0,1) 有多远。KL 散度越小，潜在空间越规整，采样效果越好：",
    loss_kl_code_title: "KL 散度代码",
    loss_kl_explain: "这个公式的推导涉及概率论，直观理解就是：让编码器输出的分布尽量接近标准正态分布",

    loss_h3_total: "总损失",
    loss_total_p1: "两者相加就是总损失：",
    loss_total_formula: "L = MSE × 784 + KL",
    loss_total_explain: "训练过程中，MSE 让重建图片越来越像原图，KL 让潜在空间越来越规整。两者相互制衡。",

    h2_train: "训练过程",
    train_p1: "训练代码非常简洁。核心循环就是：前向传播 → 计算损失 → 反向传播 → 更新权重：",
    train_code_title: "训练代码（train.py）",
    train_params: "关键超参数：",
    train_p2: "batch_size = 256（每批 256 张图）、learning_rate = 0.001、latent_size = 4（潜在空间 4 维）、num_epochs = 100",

    h2_result: "训练结果",
    result_p1: "训练 100 个 epoch 后，模型可以：",
    result_li1: "<strong>重建图片</strong>：输入一张手写数字，输出一张几乎一样的图片",
    result_li2: "<strong>生成图片</strong>：从标准正态分布随机采样 z，解码生成全新的数字图片",
    result_li3: "<strong>潜在空间插值</strong>：在两个数字的 z 之间线性插值，生成渐变过渡图",
    result_p2: "潜在空间只有 4 维，但已经足够让模型学会区分不同的数字。每个维度控制着某种特征（如笔画粗细、倾斜角度等）。",

    h2_summary: "总结",
    summary_p1: "VAE 的核心思想可以概括为：",
    summary_li1: "<strong>压缩再还原</strong>：编码器压缩，解码器还原，逼迫模型学习数据的本质特征",
    summary_li2: "<strong>约束潜在空间</strong>：用 KL 散度让潜在空间服从正态分布，使得采样生成成为可能",
    summary_li3: "<strong>重参数化</strong>：把不可微分的采样操作变成可微分的计算图",
    summary_p2: "下一篇我们将扩展到彩色图像生成，并探索不同的网络结构和损失函数组合。",

    h2_ref: "参考资源",
    ref_li1: "论文：<a href='https://arxiv.org/abs/1312.6114' target='_blank' rel='noopener noreferrer' class='text-indigo-600 dark:text-indigo-400 hover:underline'>Kingma & Welling, <em>Auto-Encoding Variational Bayes</em>, 2013</a>",
    ref_li2: "代码：本文所有代码来自 ",
    ref_li3: "QA 页面：更多 VAE 相关问答见 ",
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
    arch_h3_enc: "Encoder",
    arch_enc_p1: "The encoder's task is to compress a 28×28 grayscale image into two vectors: mean μ and log-variance log(σ²). Why two outputs? Because we need them to define a normal distribution.",
    arch_enc_code_title: "Encoder Code (model.py)",
    arch_enc_explain1: "Two convolutional layers progressively reduce spatial dimensions:",
    arch_enc_explain2: "28×28 → 14×14 → 7×7",
    arch_enc_explain3: "while increasing channels: 1 → 32 → 64 (extracting more features)",
    arch_enc_explain4: "Finally, fully connected layers output two",
    arch_enc_explain5: "-dimensional vectors: μ and log(σ²)",

    arch_h3_dec: "Decoder",
    arch_dec_p1: "The decoder does the reverse: reconstructs a 28×28 image from a small vector.",
    arch_dec_code_title: "Decoder Code (model.py)",
    arch_dec_explain1: "Fully connected layer expands the",
    arch_dec_explain2: "-dimensional vector into a 64×7×7 feature map",
    arch_dec_explain3: "Two transposed convolution layers progressively upsample: 7×7 → 14×14 → 28×28",
    arch_dec_explain4: "Finally, Sigmoid activation compresses pixel values to [0, 1]",

    arch_h3_vae: "VAE Assembly",
    arch_vae_p1: "Combine encoder and decoder, with reparameterization in between:",
    arch_vae_code_title: "VAE Code (model.py)",

    h2_reparam: "Reparameterization Trick",
    reparam_p1: "This is the most clever design in VAE. The problem: the encoder outputs a distribution (μ and σ), and we need to \"sample\" z from this distribution. But sampling is non-differentiable — we can't backpropagate through it.",
    reparam_p2: "Solution: shift the randomness to an external noise ε:",
    reparam_formula_desc: "Reparameterization formula:",
    reparam_explain: "where ε is sampled from standard normal N(0,1). Now z is still random, but is a deterministic function of μ and σ, enabling normal backpropagation.",
    reparam_code_title: "Reparameterization Code",

    h2_loss: "Loss Function",
    loss_p1: "VAE's loss function consists of two parts:",
    loss_h3_recon: "Reconstruction Loss (MSE)",
    loss_recon_p1: "Measures how different the reconstructed image is from the original. Uses Mean Squared Error (MSE), multiplied by 784 (28×28 total pixels) to match the magnitude of KL divergence:",
    loss_recon_code_title: "Reconstruction Loss Code",
    loss_recon_explain: "reduction='mean' computes per-pixel average error, multiplying by 784 restores total image error",

    loss_h3_kl: "KL Divergence",
    loss_kl_p1: "Measures how far the encoder's output distribution is from standard normal N(0,1). Smaller KL divergence means a more regular latent space and better sampling:",
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

    h2_result: "Training Results",
    result_p1: "After 100 epochs, the model can:",
    result_li1: "<strong>Reconstruct images</strong>: Input a handwritten digit, output an almost identical image",
    result_li2: "<strong>Generate images</strong>: Sample z from standard normal, decode to generate brand new digit images",
    result_li3: "<strong>Latent space interpolation</strong>: Linearly interpolate between two digits' z to generate smooth transitions",
    result_p2: "The latent space is only 4-dimensional, but it's enough for the model to distinguish different digits. Each dimension controls some feature (like stroke thickness, tilt angle, etc.).",

    h2_summary: "Summary",
    summary_p1: "VAE's core idea can be summarized as:",
    summary_li1: "<strong>Compress and reconstruct</strong>: Encoder compresses, decoder reconstructs, forcing the model to learn essential features of the data",
    summary_li2: "<strong>Constrain latent space</strong>: KL divergence makes the latent space follow a normal distribution, enabling sampling and generation",
    summary_li3: "<strong>Reparameterization</strong>: Turns non-differentiable sampling into a differentiable computation graph",
    summary_p2: "Next, we'll extend to color image generation and explore different network architectures and loss function combinations.",

    h2_ref: "References",
    ref_li1: "Paper: <a href='https://arxiv.org/abs/1312.6114' target='_blank' rel='noopener noreferrer' class='text-indigo-600 dark:text-indigo-400 hover:underline'>Kingma & Welling, <em>Auto-Encoding Variational Bayes</em>, 2013</a>",
    ref_li2: "Code: All code in this article comes from ",
    ref_li3: "Q&A: More VAE Q&A at ",
  },
} as const;

export default function VAEPost1() {
  const { lang } = useLang();
  const c = content[lang];

  return (
    <BlogPostLayout post={post} seriesPosts={seriesPosts}>
      {/* 什么是 VAE */}
      <h2>{c.h2_intro}</h2>
      <p dangerouslySetInnerHTML={{ __html: c.intro_p1 }} />
      <p>{c.intro_p2}</p>
      <ul>
        <li dangerouslySetInnerHTML={{ __html: c.intro_li1 }} />
        <li dangerouslySetInnerHTML={{ __html: c.intro_li2 }} />
        <li dangerouslySetInnerHTML={{ __html: c.intro_li3 }} />
      </ul>
      <p>{c.intro_p3}</p>

      {/* 网络架构 */}
      <h2>{c.h2_arch}</h2>
      <p>{c.arch_p1}</p>

      <h3>{c.arch_h3_enc}</h3>
      <p>{c.arch_enc_p1}</p>
      <CodeBlock language="python">{`class Encoder(nn.Module):
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
        return mu, logvar`}</CodeBlock>
      <p>
        {c.arch_enc_explain1}<br />
        {c.arch_enc_explain2}<br />
        {c.arch_enc_explain3}<br />
        {c.arch_enc_explain4} <InlineMath>{"\\mu"}</InlineMath> {c.arch_enc_explain5}
      </p>

      <h3>{c.arch_h3_dec}</h3>
      <p>{c.arch_dec_p1}</p>
      <CodeBlock language="python">{`class Decoder(nn.Module):
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
        return x`}</CodeBlock>
      <p>
        {c.arch_dec_explain1} <InlineMath>{"d_{\\text{latent}}"}</InlineMath> {c.arch_dec_explain2}<br />
        {c.arch_dec_explain3}<br />
        {c.arch_dec_explain4}
      </p>

      <h3>{c.arch_h3_vae}</h3>
      <p>{c.arch_vae_p1}</p>
      <CodeBlock language="python">{`class VAE(nn.Module):
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
        return self.decoder(z), mu, logvar   # 解码`}</CodeBlock>

      {/* 重参数化技巧 */}
      <h2>{c.h2_reparam}</h2>
      <p>{c.reparam_p1}</p>
      <p>{c.reparam_p2}</p>
      <p>{c.reparam_formula_desc}</p>
      <MathBlock>{"z = \\mu + \\epsilon \\cdot \\sigma, \\quad \\epsilon \\sim \\mathcal{N}(0, 1)"}</MathBlock>
      <p>{c.reparam_explain}</p>
      <p>{c.reparam_code_title}：</p>
      <CodeBlock language="python">{`def reparameterize(self, mu, logvar):
    std = torch.exp(0.5 * logvar)   # 从 log(σ²) 计算 σ
    eps = torch.randn_like(std)      # 从标准正态采样 ε
    return mu + eps * std            # 重参数化`}</CodeBlock>

      {/* 损失函数 */}
      <h2>{c.h2_loss}</h2>
      <p>{c.loss_p1}</p>

      <h3>{c.loss_h3_recon}</h3>
      <p dangerouslySetInnerHTML={{ __html: c.loss_recon_p1 }} />
      <MathBlock>{"\\mathcal{L}_{\\text{recon}} = \\text{MSE}(x, \\hat{x}) \\times 784"}</MathBlock>
      <CodeBlock language="python">{`recon_loss = F.mse_loss(recon_x, inputs, reduction='mean') * 784`}</CodeBlock>
      <p>{c.loss_recon_explain}</p>

      <h3>{c.loss_h3_kl}</h3>
      <p>{c.loss_kl_p1}</p>
      <MathBlock>{"D_{\\text{KL}} = -\\frac{1}{2} \\sum_{i=1}^{d} (1 + \\log(\\sigma_i^2) - \\mu_i^2 - \\sigma_i^2)"}</MathBlock>
      <CodeBlock language="python">{`kl_loss = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())`}</CodeBlock>
      <p>{c.loss_kl_explain}</p>

      <h3>{c.loss_h3_total}</h3>
      <p>{c.loss_total_p1}</p>
      <MathBlock>{"\\mathcal{L} = \\mathcal{L}_{\\text{recon}} + D_{\\text{KL}}"}</MathBlock>
      <p>{c.loss_total_explain}</p>

      {/* 训练过程 */}
      <h2>{c.h2_train}</h2>
      <p>{c.train_p1}</p>
      <CodeBlock language="python">{`for epoch in range(num_epochs):
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
        optimizer.step()`}</CodeBlock>
      <p><strong>{c.train_params}</strong> {c.train_p2}</p>

      {/* 训练结果 */}
      <h2>{c.h2_result}</h2>
      <p>{c.result_p1}</p>
      <ul>
        <li dangerouslySetInnerHTML={{ __html: c.result_li1 }} />
        <li dangerouslySetInnerHTML={{ __html: c.result_li2 }} />
        <li dangerouslySetInnerHTML={{ __html: c.result_li3 }} />
      </ul>
      <p>{c.result_p2}</p>

      {/* 总结 */}
      <h2>{c.h2_summary}</h2>
      <p>{c.summary_p1}</p>
      <ul>
        <li dangerouslySetInnerHTML={{ __html: c.summary_li1 }} />
        <li dangerouslySetInnerHTML={{ __html: c.summary_li2 }} />
        <li dangerouslySetInnerHTML={{ __html: c.summary_li3 }} />
      </ul>
      <p>
        {c.summary_p2.split("下一篇")[0]}
        <Link href="/blog/vae-2-color" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
          {lang === "zh" ? "下一篇：VAE 学习笔记（二）：彩色图像与优化" : "Next: VAE Notes (2): Color Images & Optimization"}
        </Link>
        {c.summary_p2.split("组合。")[1] ? "。" : ""}
      </p>

      {/* 参考资源 */}
      <h2>{c.h2_ref}</h2>
      <ul>
        <li dangerouslySetInnerHTML={{ __html: c.ref_li1 }} />
        <li>
          {c.ref_li2}
          <a href="https://github.com/Muanyan-mjq/The_simple_vae" target="_blank" rel="noopener noreferrer">The_simple_vae</a>
        </li>
        <li>
          {c.ref_li3}
          <a href="/qa/vae">VAE Q&A</a>
        </li>
      </ul>
    </BlogPostLayout>
  );
}
