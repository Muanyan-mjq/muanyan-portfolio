"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";

type QA = { q: string; a: string };
type Topic = { id: string; name: string; icon: string; items: QA[] };

const topicsZh: Topic[] = [
  {
    id: "convolution",
    name: "卷积基础",
    icon: "🔲",
    items: [
      { q: "卷积是什么逻辑？什么操作流程？", a: "用 VAE 里的实际参数来讲：kernel_size=3, stride=2, padding=1。卷积就是'用一个小窗口扫描图片'。假设图片是 5×5 的像素矩阵，卷积核是 3×3 的小矩阵。卷积核像手电筒一样从左到右、从上到下滑动，每到一个位置，把覆盖的 3×3 区域和卷积核**逐元素相乘再求和**，得到输出图的一个像素。" },
      { q: "卷积核的具体计算是什么？", a: "用一个超简单的例子。假设图片是 3×3，卷积核 2×2，一步步算。位置①——停左上角，盖住 [1,2,4,5]：`1×2 + 2×0 + 4×1 + 5×3 = 2+0+4+15 = 21`。位置②——窗口右移一格，盖住 [2,3,5,6]：`2×2 + 3×0 + 5×1 + 6×3 = 27`。位置③——窗口下移回到左边，盖住 [4,5,7,8]：`4×2 + 5×0 + 7×1 + 8×3 = 39`。位置④——右下角，盖住 [5,6,8,9]：`5×2 + 6×0 + 8×1 + 9×3 = 45`。最终输出是 2×2 的小图。" },
      { q: "卷积核是独立的矩阵吗？和原图像素有关系吗？", a: "对，卷积核是**独立的一套权重数字**，和原图像素没关系。原图像素是你喂进去的数据，每张图都不一样；卷积核是模型的参数，训练开始前随机生成，训练过程中不断调整，训练完就固定了。" },
      { q: "步长和填充具体是什么原理和逻辑？", a: "`stride=1` 每次移 1 格，扫得密输出大。`stride=2` 每次跳 2 格，输出更小。填充（padding）在图片外面加一圈假像素（0），两个作用：让边缘像素也能被卷积核扫到（不被忽略）；保证尺寸能整除 stride。公式：`输出尺寸 = floor((输入尺寸 + 2×padding - 卷积核大小) / stride) + 1`。" },
      { q: "卷积核是可以自主学习的吗？需要我们自己提供数据吗？", a: "不需要你提供，是模型自己'学'出来的。训练前卷积核里的数是随机的（比如随机生成 [-0.1, 0.1] 之间的小数），这时候模型是'瞎的'；训练中每看到一张图，算损失→反向传播→梯度自动调整卷积核里的每个数；训练后卷积核固定。" },
    ],
  },
  {
    id: "encoder",
    name: "Encoder 详解",
    icon: "🔧",
    items: [
      { q: "通道数是否决定卷积核单组个数？", a: "第1层：输入1通道→32个卷积核，每个核是独立的3×3矩阵，都扫同一张输入图→出32张特征图。第2层：输入32张特征图→要输出64张，此时每个'卷积核'不是一个3×3矩阵，而是一个`3×3×32`的立方体。一组核扫32张输入图后求和得到1张输出。一共64组→输出64张。" },
      { q: "步长减半是否会影响信息提取？", a: "会丢掉信息。28→14 丢了一半空间分辨率。但这不是 bug，是设计目的——卷积核学会了把'不重要的细节'丢掉，把'有意义的特征'浓缩到更小的空间里。" },
      { q: "如何确保丢掉的细节不重要？卷积核如何学会这个过程？", a: "它不'知道'，它是被逼出来的。Encoder的处境：输入784个像素，出口只有4个数，规则是你压得再狠Decoder也得还原回来。卷积核试第一次（随机权重）：乱压→Decoder还原出一坨屎→损失巨大。反向传播说：'你丢掉的这个像素Decoder还原时需要它→加大相关权重'；'你保留的这个像素Decoder根本没用上→减小相关权重'。试了上万次之后自动收敛到一套策略。" },
      { q: "全连接的独立权重是如何生成的？", a: "训练前随机生成，数目=输入位置数×输出位置数。`fc_mu = nn.Linear(3136, 4)`，PyTorch 自动创建一个 [3136, 4] 的矩阵，每个数随机生成。3136×4=12544 个独立权重。训练时每看一批图→算损失→反向传播→12544个权重各自微调。" },
      { q: "输出为 z 作为概率分布时，如何确定随机采样就能生成相似图片？", a: "不是在'很多图里挑一张像的'，而是训练时就逼着模型学会这件事。训练时两条规则在打架：MSE说Decoder输出必须像原图→Decoder学会z稍微动一点输出也跟着微微变；KL说Encoder分布必须接近标准正态→Encoder把同类数字的z挤到相近区域。如果采样'有误'：训练阶段采样的ε是随机的，模型被迫学会'不管ε是什么Decoder都要能把z还原成合理图片'。" },
      { q: "forward 里数据会不会做类似处理，将有效数据留下，无效数据去除？", a: "没有显式的过滤，但有隐式的信息筛选。conv1保留所有信息只是换了种表示方式；conv2空间从14×14缩到7×7被迫丢掉一半空间细节→卷积核学会了'丢掉什么、保留什么'；flatten不丢信息只是改变形状；`fc_mu/fc_logvar` 3136→4是最大的压缩→权重矩阵自动学到哪3136个数里只有一小部分真正重要。" },
    ],
  },
  {
    id: "loss",
    name: "损失函数",
    icon: "📉",
    items: [
      { q: "MSE 和 KL 散度是什么？", a: "MSE（均方误差）——两张图像不像。`MSE = (重建图每个像素 - 原图对应像素)² 的平均值`。MSE越小→重建图越像原图。KL散度——两个分布像不像。KL散度衡量Encoder输出的分布离标准正态差多远。`μ=0,σ=1→KL≈0`（完美）；`μ=3,σ=0.1→KL很大`（又偏又窄）。" },
      { q: "MSE 是否会对误差范围做局限判断？", a: "没有。MSE对所有误差一视同仁——每个像素差多少就罚多少，小误差小罚，大误差大罚。没有什么'误差小于0.2就放过'的阈值。平方惩罚本身就是一种非线性的放大——大误差的惩罚远远超过小误差。" },
      { q: "为什么乘 784？量级具体指什么？", a: "量级=数值的大小级别。不乘784时MSE≈0.05，KL≈2.0，KL主导训练。乘784后MSE≈39，两者同一量级。784=28×28是像素总数，'每像素平均'×784='整图总和'。别的数也行，比如设超参数β：`loss = β×MSE + KL`。但784是刚好合适的经验值。" },
      { q: "Huber Loss 是更先进还是更落后？", a: "不是更先进——是适用场景不同。MSE对大误差极度敏感；Huber Loss小误差用平方、大误差用线性，适合数据有离群值时用。MNIST不需要Huber。" },
    ],
  },
  {
    id: "decoder",
    name: "Decoder 与生成",
    icon: "🎨",
    items: [
      { q: "Decoder 的过程是不是由 z 来专门确定？", a: "对。Decoder是一个确定的函数：输入z→输出图片，没有随机性。同一个z永远出同一张图。随机性只在采样z的时候不在Decoder内部。" },
      { q: "放大和缩小本质是一样的吗？", a: "对，都是卷积核扫过去。Encoder缩小用`Conv2d(stride=2)`，Decoder放大用`ConvTranspose2d(stride=2)`——先在两像素间插0，再3×3核扫过去。同一个数学框架（卷积），同样的训练方式（梯度更新权重），只是操作方向相反。" },
      { q: "在一个合适范围内的 z 值都可以生成准确图片吗？", a: "在KL散度'压'出来的分布区域[-2,2]内的z都能。但手动构造`z=[100,200,-300,50]`→生成噪声，因为这个z在训练中从未出现过。" },
      { q: "如何确定学习是有效的？", a: "不是后期对比，训练过程中就有三条证据：loss在降（从50+降到30）、重建图越来越像（epoch0是噪声→epoch90几乎一样）、生成图越来越清楚（epoch0灰团→epoch90清晰数字）。" },
    ],
  },
  {
    id: "training",
    name: "训练与优化",
    icon: "⚙️",
    items: [
      { q: "Encoder 和 Decoder 是同时学习的吗？反馈调节如何进行？", a: "你的理解完全正确。Encoder和Decoder是同时训练的。反馈调节就是反向传播，分三步：第1步前向传播（先跑一遍）；第2步反向传播（顺着原路往回传'意见'——MSE告诉Decoder输出像素差了0.4，KL告诉Encoder分布宽度不合理）；第3步权重更新（每个权重 = 原值 - 学习率×梯度）。" },
      { q: "独立权重能否确保数据恢复准确？出错时能否自动调节？", a: "能，但是被逼着调的，不是主动纠错。训练早期权重随机→重建是噪声→MSE很大→梯度回传→每个独立权重根据'自己对误差贡献了多少'各自微调。独立权重的优势：每个权重专管一条连接，调一个不影响别人，精密度高。" },
      { q: "梯度是关联全局的吗？", a: "对，梯度是贯穿整个网络的问责链。从loss出发，沿着计算图一路追回去。追到的每一个权重都会被分配一份'责任'（梯度）。conv1的第5个卷积核收到了MSE传来的梯度+KL传来的梯度→合在一起→按合力方向微调。没有'局部优化'，从头到尾一根链。" },
      { q: "训练是自主训练还是需要人为帮助？", a: "完全自主。你只需要做三件事：写好模型结构（已写好）、喂数据（MNIST数据集）、跑 `python train.py`。之后的过程全自动：一批图进去→前向传播→算损失→反向传播→更新权重→下一批图进去，重复这个循环。你不需要手动调权重、告诉模型'这是数字3'。" },
      { q: "权重需要存储吗？存在哪里？", a: "训练过程中存在GPU显存里。所有卷积核、fc权重矩阵、bn参数全部加载到GPU显存。forward时权重和中间数据都在显存，backward后中间结果释放掉但权重更新完留在显存。定期`torch.save`把显存里的权重打包写成.pth文件。不存盘→关进程→显存清空→权重全部丢失。" },
    ],
  },
  {
    id: "channels",
    name: "通道与特征",
    icon: "🔍",
    items: [
      { q: "通道在整体流程中有什么作用？", a: "通道='观察角度'的个数。浅层通道检测边缘、纹理；深层通道组合成曲线、形状。1→32→64是'逐层翻倍'策略——空间每减半一次（丢失细节），通道翻倍一次（增加表示能力）。用更多'角度'来弥补'分辨率'的损失。" },
    ],
  },
  {
    id: "data",
    name: "数据处理",
    icon: "🖼️",
    items: [
      { q: "如果输入图片像素不为 28×28，模型还能用吗？", a: "如果只把图片改成64×64或彩色图，不改代码——跑不了。整个网络的尺寸是硬编码的。`fc_mu = nn.Linear(64*7*7, latent_size)` 写死了输入只能是3136。换64×64图→中间是64×16×16=16384→和3136不匹配→报错。换彩色图→conv1写死了输入1通道→3通道不匹配→报错。换数据集必须改代码，但结构逻辑不变，只改尺寸参数。" },
      { q: "归一化的具体流程是什么？", a: "原图像素范围可能是[0.1, 0.9]→min=0.1, max=0.9→`(images-0.1)/(0.9-0.1+1e-8)`→每个像素变成[0,1]之间的数。一个像素值0.5→`(0.5-0.1)/0.8=0.5`保持相对关系。`+1e-8`防止分母为0。" },
      { q: "过黑或者过曝是怎么导致的？", a: "对。`save_image`假设输入在[0,1]直接映射到[0,255]。输入-0.5→clip到0→纯黑；输入2.0→clip到1→纯白。归一化把所有值重新拉伸到[0,1]。" },
      { q: "图片拼接有什么逻辑顺序吗？", a: "有——先水平后竖直。水平拼接（`dim=-1`，宽度）：图0|图1|...→一行；竖直拼接（`dim=-2`，高度）：行0→行1→...。`n = int(sqrt(N))`自动取平方根。" },
      { q: "H 和 W 的数据 28 是从哪里来的？", a: "没写死。model.py里没有任何一行写28。28是从数据结构本身推出来的。64×7×7怎么来的？Conv2d stride=2两次→输入H→H/2→H/4。H/4=7→H=28。模型不检查你是28还是64——fc层硬编码了3136，喂32×32的图会报错。" },
    ],
  },
];

const topicsEn: Topic[] = [
  {
    id: "convolution",
    name: "Convolution Basics",
    icon: "🔲",
    items: [
      { q: "What is the logic of convolution? What is the process?", a: "Using actual VAE parameters: kernel_size=3, stride=2, padding=1. Convolution is 'scanning an image with a small window'. Suppose the image is a 5x5 pixel matrix and the kernel is a 3x3 matrix. The kernel slides from left to right, top to bottom like a flashlight. At each position, it **multiplies element-wise and sums** the covered 3x3 region with the kernel to get one pixel of the output." },
      { q: "What is the specific calculation of a convolution kernel?", a: "A super simple example. Suppose the image is 3x3, kernel is 2x2, step by step. Position 1 -- top-left corner, covers [1,2,4,5]: `1x2 + 2x0 + 4x1 + 5x3 = 2+0+4+15 = 21`. Position 2 -- window shifts right, covers [2,3,5,6]: `2x2 + 3x0 + 5x1 + 6x3 = 27`. Position 3 -- window moves down to the left, covers [4,5,7,8]: `4x2 + 5x0 + 7x1 + 8x3 = 39`. Position 4 -- bottom-right corner, covers [5,6,8,9]: `5x2 + 6x0 + 8x1 + 9x3 = 45`. The final output is a 2x2 small image." },
      { q: "Is the convolution kernel an independent matrix? Does it relate to the original image pixels?", a: "Yes, the kernel is **an independent set of weight numbers**, unrelated to the original image pixels. The original pixels are data you feed in, different for each image; the kernel is a model parameter, randomly generated before training, continuously adjusted during training, and fixed after training." },
      { q: "What are the principles and logic of stride and padding?", a: "`stride=1` moves 1 step each time, scanning densely with larger output. `stride=2` jumps 2 steps each time, with smaller output. Padding adds a ring of fake pixels (0) around the image, serving two purposes: edge pixels can also be scanned by the kernel (not ignored); ensures dimensions are divisible by stride. Formula: `output_size = floor((input_size + 2xpadding - kernel_size) / stride) + 1`." },
      { q: "Can convolution kernels learn on their own? Do we need to provide data?", a: "No, you don't need to provide them -- the model 'learns' them itself. Before training, kernel values are random (e.g., random decimals in [-0.1, 0.1]), the model is 'blind' at this point; during training, each image seen triggers loss calculation, backpropagation, and gradient-based automatic adjustment of every kernel value; after training, kernels are fixed." },
    ],
  },
  {
    id: "encoder",
    name: "Encoder Details",
    icon: "🔧",
    items: [
      { q: "Does the number of channels determine the number of kernels per group?", a: "Layer 1: input 1 channel, 32 kernels, each kernel is an independent 3x3 matrix, all scanning the same input image, producing 32 feature maps. Layer 2: input 32 feature maps, output 64 maps; now each 'kernel' is not a 3x3 matrix but a `3x3x32` cube. One group of kernels scans 32 input maps and sums to get 1 output. 64 groups total produce 64 outputs." },
      { q: "Does halving the stride affect information extraction?", a: "Yes, information is lost. 28 to 14 loses half the spatial resolution. But this is not a bug -- it's the design purpose. The kernel learns to discard 'unimportant details' and concentrate 'meaningful features' into a smaller space." },
      { q: "How to ensure discarded details are unimportant? How does the kernel learn this?", a: "It doesn't 'know' -- it's forced. The encoder's situation: input 784 pixels, output only 4 numbers, with the rule that no matter how aggressively you compress, the Decoder must reconstruct. First attempt (random weights): random compression, Decoder reconstructs garbage, huge loss. Backpropagation says: 'this pixel you discarded, Decoder needs it when reconstructing, increase related weights'; 'this pixel you kept, Decoder doesn't use it, decrease related weights'. After tens of thousands of iterations, it automatically converges to a strategy." },
      { q: "How are the independent weights of the fully connected layer generated?", a: "Randomly generated before training. Count = input positions x output positions. `fc_mu = nn.Linear(3136, 4)` -- PyTorch automatically creates a [3136, 4] matrix, each number randomly generated. 3136 x 4 = 12544 independent weights. During training, each batch of images triggers loss calculation, backpropagation, and individual fine-tuning of all 12544 weights." },
      { q: "When output z is a probability distribution, how can random sampling generate similar images?", a: "It's not 'picking a similar image from many' -- the model is forced to learn this during training. Two rules fight during training: MSE says Decoder output must resemble the original, so the Decoder learns that slight changes in z lead to slight output changes; KL says the Encoder distribution must approach standard normal, so the Encoder squeezes z of the same digit class to nearby regions. If sampling is 'off': the training-stage epsilon is random, forcing the model to learn 'regardless of what epsilon is, Decoder must reconstruct z into a reasonable image'." },
      { q: "Does forward pass filter data, keeping valid data and removing invalid data?", a: "No explicit filtering, but implicit information selection. conv1 retains all info, just changes the representation; conv2 spatially reduces from 14x14 to 7x7, forced to discard half the spatial details, and the kernel learns 'what to discard, what to keep'; flatten loses no info, just changes shape; `fc_mu/fc_logvar` 3136 to 4 is the biggest compression, the weight matrix automatically learns which of the 3136 numbers are truly important." },
    ],
  },
  {
    id: "loss",
    name: "Loss Functions",
    icon: "📉",
    items: [
      { q: "What are MSE and KL divergence?", a: "MSE (Mean Squared Error) -- two images don't look alike. `MSE = average of (each reconstructed pixel - corresponding original pixel)^2`. Smaller MSE means the reconstruction looks more like the original. KL divergence -- whether two distributions look alike. KL divergence measures how far the Encoder's output distribution is from standard normal. `mu=0, sigma=1, KL approx 0` (perfect); `mu=3, sigma=0.1, KL very large` (both biased and narrow)." },
      { q: "Does MSE impose limits on the error range?", a: "No. MSE treats all errors equally -- each pixel's difference is penalized proportionally, small errors get small penalties, large errors get large penalties. There is no threshold like 'errors below 0.2 are forgiven'. Squared penalty is inherently a nonlinear amplification -- large errors are penalized far more than small ones." },
      { q: "Why multiply by 784? What does 'magnitude' specifically mean?", a: "Magnitude = the scale/level of a numerical value. Without multiplying by 784, MSE is about 0.05, KL about 2.0, KL dominates training. After multiplying by 784, MSE is about 39, both at the same magnitude. 784 = 28x28 is the total pixel count; 'per-pixel average' x 784 = 'whole-image sum'. Other values work too, e.g., setting hyperparameter beta: `loss = beta x MSE + KL`. But 784 is a well-fitting empirical value." },
      { q: "Is Huber Loss more advanced or less advanced?", a: "Not more advanced -- it's for different use cases. MSE is extremely sensitive to large errors; Huber Loss uses squared for small errors and linear for large errors, suitable when data has outliers. MNIST doesn't need Huber." },
    ],
  },
  {
    id: "decoder",
    name: "Decoder & Generation",
    icon: "🎨",
    items: [
      { q: "Is the Decoder process specifically determined by z?", a: "Yes. The Decoder is a deterministic function: input z, output image, no randomness. The same z always produces the same image. Randomness only exists when sampling z, not inside the Decoder." },
      { q: "Are upscaling and downscaling essentially the same?", a: "Yes, both are kernel scanning. Encoder downscales with `Conv2d(stride=2)`, Decoder upscales with `ConvTranspose2d(stride=2)` -- inserting 0s between pixels first, then scanning with a 3x3 kernel. Same mathematical framework (convolution), same training method (gradient weight updates), just opposite directions." },
      { q: "Can z values within a suitable range all generate accurate images?", a: "Any z within the distribution region [-2, 2] compressed by KL divergence can. But manually constructing `z=[100,200,-300,50]` produces noise, because this z was never seen during training." },
      { q: "How to determine that learning is effective?", a: "Not by comparing later -- during training there are three pieces of evidence: loss decreases (from 50+ to 30), reconstructed images look more like the original (epoch 0 is noise, epoch 90 is nearly identical), generated images become clearer (epoch 0 is a gray blob, epoch 90 is a clear digit)." },
    ],
  },
  {
    id: "training",
    name: "Training & Optimization",
    icon: "⚙️",
    items: [
      { q: "Do the Encoder and Decoder learn simultaneously? How does feedback adjustment work?", a: "Your understanding is correct. Encoder and Decoder are trained simultaneously. Feedback adjustment is backpropagation, in three steps: Step 1 forward pass (run once); Step 2 backpropagation (trace back along the computation graph -- MSE tells Decoder its output pixels are off by 0.4, KL tells Encoder its distribution width is unreasonable); Step 3 weight update (each weight = original value - learning rate x gradient)." },
      { q: "Can independent weights ensure accurate data reconstruction? Can they self-correct on errors?", a: "Yes, but they are forced to adjust, not proactively correcting. Early in training, weights are random, reconstruction is noise, MSE is large, gradients propagate back, and each independent weight fine-tunes based on 'how much it contributed to the error'. Advantage of independent weights: each weight manages one connection, adjusting one doesn't affect others, high precision." },
      { q: "Are gradients globally connected?", a: "Yes, gradients form an accountability chain throughout the entire network. Starting from the loss, tracing back along the computation graph. Every weight reached is assigned a share of 'responsibility' (gradient). conv1's 5th kernel receives gradients from both MSE and KL, combined, then fine-tuned in the direction of the combined force. There is no 'local optimization' -- one chain from start to finish." },
      { q: "Does training happen autonomously or require human help?", a: "Completely autonomous. You only need to do three things: write the model structure (already done), feed data (MNIST dataset), run `python train.py`. After that, the process is fully automatic: a batch of images in, forward pass, compute loss, backpropagation, update weights, next batch in, repeat this cycle. You don't need to manually adjust weights or tell the model 'this is digit 3'." },
      { q: "Do weights need to be stored? Where are they stored?", a: "During training, they are stored in GPU memory. All kernels, fc weight matrices, bn parameters are loaded into GPU VRAM. During forward pass, weights and intermediate data are in VRAM; after backward, intermediate results are released but updated weights remain. Periodically, `torch.save` packages VRAM weights into a .pth file. Without saving, closing the process clears VRAM and all weights are lost." },
    ],
  },
  {
    id: "channels",
    name: "Channels & Features",
    icon: "🔍",
    items: [
      { q: "What role do channels play in the overall process?", a: "Channels = number of 'observation angles'. Shallow channels detect edges and textures; deep channels combine into curves and shapes. 1 to 32 to 64 is a 'doubling per layer' strategy -- each time spatial dimensions halve (losing detail), channels double (increasing representation capacity). Using more 'angles' to compensate for the loss of 'resolution'." },
    ],
  },
  {
    id: "data",
    name: "Data Processing",
    icon: "🖼️",
    items: [
      { q: "If the input image is not 28x28 pixels, can the model still work?", a: "If you just change the image to 64x64 or color without changing code -- it won't run. The entire network's dimensions are hardcoded. `fc_mu = nn.Linear(64*7*7, latent_size)` locks the input to 3136. Switching to 64x64 gives 64x16x16=16384, mismatching 3136, causing an error. Switching to color, conv1 is locked to 1 input channel, 3 channels mismatch. Changing datasets requires code changes, but the structural logic stays the same, only dimension parameters change." },
      { q: "What is the specific normalization process?", a: "Original pixel range might be [0.1, 0.9], min=0.1, max=0.9, `(images-0.1)/(0.9-0.1+1e-8)` transforms each pixel to [0,1]. A pixel value 0.5 becomes `(0.5-0.1)/0.8=0.5`, preserving relative relationships. `+1e-8` prevents division by zero." },
      { q: "What causes images to be too dark or overexposed?", a: "Yes. `save_image` assumes input is in [0,1] and maps directly to [0,255]. Input -0.5 clips to 0, pure black; input 2.0 clips to 1, pure white. Normalization stretches all values back to [0,1]." },
      { q: "Is there a logical order for image concatenation?", a: "Yes -- horizontal first, then vertical. Horizontal concatenation (`dim=-1`, width): image 0 | image 1 | ... into one row; vertical concatenation (`dim=-2`, height): row 0, row 1, ... `n = int(sqrt(N))` automatically takes the square root." },
      { q: "Where does the 28 in H and W come from?", a: "It's not hardcoded. There's no line in model.py that writes 28. 28 is derived from the data structure itself. How is 64x7x7 derived? Conv2d stride=2 twice: input H, H/2, H/4. H/4=7, so H=28. The model doesn't check if it's 28 or 64 -- the fc layer hardcodes 3136, feeding a 32x32 image will cause an error." },
    ],
  },
];

const translations = {
  zh: {
    backToList: "返回问答列表",
    pageTitle: "VAE 问答记录",
    subtitle: "这里有一些我学习 VAE 时的问答记录，涵盖了从卷积基础、损失函数到生成过程的核心概念。",
    footerText: "由 OpenCode + DeepSeek V4 生成",
    searchPlaceholder: "搜索问题或答案...",
    allTopics: "全部",
    totalPrefix: "共",
    totalSuffix: "条问答",
    itemCountSuffix: "条",
    share: "分享",
    linkCopied: "链接已复制到剪贴板",
    copyFailed: "复制失败，请手动复制：",
    noResults: "没有找到匹配的结果",
    noResultsHint: "试试其他关键词，或者清除筛选条件",
  },
  en: {
    backToList: "Back to Q&A",
    pageTitle: "VAE Q&A Records",
    subtitle: "Here are some Q&A records from my VAE learning, covering core concepts from convolution basics and loss functions to the generation process.",
    footerText: "Generated by OpenCode + DeepSeek V4",
    searchPlaceholder: "Search questions or answers...",
    allTopics: "All",
    totalPrefix: "Total",
    totalSuffix: "Q&As",
    itemCountSuffix: "items",
    share: "Share",
    linkCopied: "Link copied to clipboard",
    copyFailed: "Copy failed, please copy manually: ",
    noResults: "No matching results",
    noResultsHint: "Try other keywords or clear filters",
  },
} as const;

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [a]);

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-lg font-medium text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {q}
        </span>
        <svg
          className={`w-5 h-5 shrink-0 mt-1.5 text-zinc-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${height}px` : "0px", opacity: open ? 1 : 0 }}
      >
        <div className="pb-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {a.split(/(`[^`]+`)/).map((part, i) =>
            part.startsWith("`") ? (
              <code key={i} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-sm font-mono">
                {part.slice(1, -1)}
              </code>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function VAEQA() {
  const { lang } = useLang();
  const t = translations[lang];
  const topics = lang === "en" ? topicsEn : topicsZh;
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredTopics = topics
    .map((topic) => {
      const filteredItems = topic.items.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      );
      return { ...topic, items: filteredItems };
    })
    .filter((topic) => topic.items.length > 0)
    .filter((topic) => !activeTopic || topic.id === activeTopic);

  const totalItems = filteredTopics.reduce((sum, t) => sum + t.items.length, 0);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert(t.linkCopied);
    } catch {
      alert(t.copyFailed + url);
    }
  };

  return (
    <div className="pt-12 pb-24 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* 面包屑导航 */}
        <div className="mb-8">
          <Link
            href="/qa"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {t.backToList}
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">
              VAE Q&A
            </h2>
          </div>
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            {t.pageTitle}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-300 mb-6">
            {t.subtitle}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t.footerText}
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={handleShare}
            className="px-6 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            🔗 {t.share}
          </button>
        </div>

        {/* Topic filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTopic(null)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              !activeTopic
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {t.allTopics}
          </button>
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(activeTopic === topic.id ? null : topic.id)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                activeTopic === topic.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {topic.icon} {topic.name}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="mb-8">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {t.totalPrefix} {totalItems} {t.totalSuffix}
          </span>
        </div>

        {/* Content */}
        {filteredTopics.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-4">{t.noResults}</p>
            <p className="text-zinc-400 dark:text-zinc-500">{t.noResultsHint}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredTopics.map((topic) => (
              <div key={topic.id} id={topic.id}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{topic.icon}</span>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {topic.name}
                  </h2>
                  <span className="ml-auto text-sm text-zinc-500 dark:text-zinc-400">
                    {topic.items.length} {t.itemCountSuffix}
                  </span>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 px-8">
                  {topic.items.map((item, i) => (
                    <AccordionItem key={i} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t.footerText}
          </p>
        </div>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
        >
          ↑
        </button>
      )}
    </div>
  );
}
