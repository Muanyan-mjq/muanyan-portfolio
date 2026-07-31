"use client";

import { useLang } from "@/components/language-context";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { blogPosts } from "@/lib/blog-data";
import { BASE_PATH } from "@/lib/base-path";

const post = blogPosts.find((p) => p.slug === "agi-era-thoughts")!;

const content = {
  zh: {
    // ── 开场 ──
    h2_intro: "这篇文章是怎么来的",
    intro_p1: `2026 年 7 月 31 日，一个普通的暑假晚上。我和 Codex 聊起了 AGI——不是那种「AGI 什么时候来」的技术预测，而是更根本的问题：<strong>AGI 时代，人类还剩什么？</strong>`,
    intro_p2: `Codex 给了一个很漂亮的框架：「人类第一次从能力匮乏走进愿望匮乏。」我觉得有道理，但又隐约觉得哪里不对。于是我把整段对话贴给了 Claude Code，让它逐条质疑。`,
    intro_p3: `结果它没让我失望——它没复读 Codex，而是从几个我完全没想过的角度撕开了这个框架。然后我们顺着往下挖，挖出了一堆我之前从未认真想过的东西。`,
    intro_p4: `这篇文章就是那场对话的记录和整理。它不是「AI 写的 AGI 预测」，而是一个大一学生和两个 AI 一起，试图搞清楚<strong>在这个一切都会被 AI 重做的时代里，人到底是什么</strong>。`,

    // ── Codex 的框架 ──
    h2_codex: "Codex 的框架：从「能力匮乏」到「愿望匮乏」",
    codex_p1: `Codex 的核心观点，一句话：<strong>AGI 时代最根本的改变，是人类第一次从「能力的匮乏」走进「愿望的匮乏」。</strong>`,
    codex_p2: `过去几万年，生活的默认设定是「不够」——资源不够、时间不够、能力不够、信息不够。人的大半心智都花在克服不足上：学习、竞争、计算、忍耐、规划。匮乏既是动力也是意义：因为难，所以值得；因为别人做不到，所以我的做到有意义。`,
    codex_p3: `AGI 把这层地基抽走之后，人类会在「什么都有」的状态下运行——而人类文明从来没有在充足里运行过。`,
    codex_p4: `顺着这个逻辑，Codex 预测了几个具体的改变：`,
    codex_li1: `<strong>劳动与身份解耦</strong>——几千年来「你是谁」≈「你做什么」。当做事可以外包，身份失去默认锚点，「我是谁」变成每天要自己回答的问题`,
    codex_li2: `<strong>真实与虚构边界模糊</strong>——生成内容无限廉价后，「看到即真实」失效；信任、可验证的痕迹、亲手做过的证据变成需要主动维护的东西`,
    codex_li3: `<strong>关系成本改变</strong>——AI 无限耐心、随时理解、永远在场，和 AI 的关系比和人更容易。亲密、孤独、成长的定义会被重写`,
    codex_li4: `<strong>意义危机取代贫穷成为最大的社会问题</strong>——无聊会成为普遍疾病，「值得」需要自己生产`,
    codex_li5: `<strong>教育与科研规则变化</strong>——知识获取趋近零成本，学位作为信息门槛继续贬值；「发现好问题」的能力比「解决难题」更值钱`,
    codex_p5: `Codex 的收束很简洁：<strong>人类从「手段」中被解放出来，然后被迫成为「目的」。以前问「怎么办」，以后只问「为什么」。</strong>`,

    // ── 三样东西 ──
    h2_three: "人类要守住的三样东西",
    three_p1: `在 Codex 问我「你最想守住的是什么」的时候，我几乎是下意识地说出了三样：`,
    three_1: `<strong>独特的想法和见解</strong>——不来自数据，来自「活过」`,
    three_2: `<strong>不怕犯错的勇气</strong>——AI 被设计成尽量正确；人可以在重要的事情上犯错，错误是原创性的入口`,
    three_3: `<strong>独一无二、不被条件约束的审美</strong>——不被生存、市场、评价约束，同时要主动抵抗 AI 平均美的下沉气流`,
    three_p2: `Codex 说这三样其实是同一件事的不同面：<strong>有主体性的人</strong>。它们有一个共同特点——不来自数据，而来自「活过」。AI 可以见过无数风格，但它没有过被生活逼到墙角、又在墙角里长出东西的经历；它可以模拟勇敢，但它没有真正害怕过什么，所以也不知道「怕」的另一面是什么味道。`,
    three_p3: `Codex 还补了一个很重要的提醒：这三样不是「保得住」的静态财产，而是<strong>会退化的能力</strong>。写日记、做项目、犯错、争论——这些日常动作就是练习。AGI 时代真正的风险不是「AI 夺走它们」，而是「人因为太方便而不再练习它们」——想要什么答案都有，慢慢就不想问自己的问题了。`,

    // ── Claude Code 的修正 ──
    h2_critique: "Claude Code 的不同意见：这个框架哪里不对",
    critique_p1: `我把上面的整段对话贴给 Claude Code，它的第一反应不是赞美，是质疑。三个修正，每一个都戳在 Codex 的盲区上。`,

    h3_physical: "「什么都有」？物理世界不归 AGI 管",
    physical_p1: `Codex 说「从能力匮乏走进愿望匮乏」，暗示 AGI 之后什么都有。Claude Code 直接说：<strong>这不是真的。</strong>`,
    physical_p2: `AGI 能给你无限的知识、无限的代码、无限的文本——但物理世界不归它管。你还是只有 24 小时一天，还是只有一个身体，还是只能同时出现在一个地方。你不可能同时吃 100 顿饭，不可能同时谈 100 段恋爱，不可能同时爬 100 座山。`,
    physical_p3: `所以「稀缺」没有消失，它只是换了层皮：从<strong>能力的稀缺</strong>变成了<strong>注意力的稀缺</strong>和<strong>身体的稀缺</strong>。你永远只能体验有限的人生——这个限制比「能力不够」更根本，它是存在本身的边界，AGI 动不了它。`,
    physical_p4: `这个修正很重要。它意味着 AGI 时代的问题不是「什么都有了我还要什么」，而是<strong>「选项无限多，但我只能挑极其有限的一部分来活」</strong>——稀缺从「做不到」变成了「选不过来」。这两个问题的性质完全不同。`,

    h3_meaning: "「以前是世界替你决定什么是重要的」——不对",
    meaning_p1: `Codex 说：「以前是世界的限制替你决定什么是重要的——你努力是因为不努力就没饭吃，你学习是因为考试，你竞争是因为资源有限。」`,
    meaning_p2: `Claude Code 的回应很直接：<strong>不对。</strong>世界给你的从来都是约束条件（考试、分数、竞争），不是意义。你转专业学 CS、你想发顶会论文、你写日记追问「准确是什么」——这些哪一件是「世界替你决定的」？`,
    meaning_p3: `意义从来都要自己找，只是以前很多人忙于生存来不及想。AGI 没有改变「意义需要自己找」这件事，它只是<strong>让更多人没法再假装这个问题不存在了</strong>。这不是一个新问题，是一个被推迟了很久的老问题终于找上门来。`,

    h3_taste: "犯错不是壁垒，品味才是",
    taste_p1: `Codex 说「AI 不敢犯错，人敢犯错所以人有原创性」——这句话很好听，但 Claude Code 说它讲得太浪漫了。`,
    taste_p2: `实际上 AI 当然能「犯错」。你让扩散模型加噪再去噪，每一步都是「错」的；你让它生成不存在的动物，它可以。创造力不是「犯错」的能力，而是<strong>知道哪个错值得犯</strong>的判断力。`,
    taste_p3: `Codex 在别处其实说了同一件事——「在无限多的可能里选出值得的那个」——但它把「犯错」和「选择」拆成了两个论点。Claude Code 说它们是一件事：<strong>创造力 = 品味 × 勇气。</strong>人真正的壁垒不是生成能力，是品味。`,
    taste_p4: `这个修正把浪漫的叙事拉回了地面。人不是因为「敢错」而有原创性，是因为<strong>有判断力决定什么值得错</strong>。`,

    // ── 认知牢笼 ──
    h2_cognition: "认知的牢笼：你抄的是答案，不是出答案的人",
    cognition_p1: `在这个节点，我提出了一个自己的观察：<strong>人无法认知高于自己认知以上的事物。</strong>`,
    cognition_p2: `普通人是可以通过社交媒体看到富人的生活的——豪宅、跑车、私人飞机。但你永远不会真正理解那种生活，因为你没有活过「钱不是问题」的状态。你对那种生活的所有想象，都是你现有欲望的 100 倍放大——不是那个人真正的困扰，也不是那个人真正的快乐。`,
    cognition_p3: `这跟智商无关，跟体验有关。你没活过，就不知道。`,
    cognition_p4: `审美也遵循同一个逻辑。一个设计师看到苹果的极简风格，觉得好看，于是「借鉴」——但他借鉴到的是<strong>结果</strong>，不是<strong>那个结果是怎么长出来的</strong>。他不知道苹果内部为了砍掉一个按钮吵了多少次架，不知道 Jony Ive 在设计学校被折磨了几年才形成那种审美直觉，不知道那个「简洁」背后有多少次「做复杂了然后删掉」的过程。`,
    cognition_p5: `他抄到的是答案，不是出答案的人。所以他永远跟在后面。这不是不想创新，是<strong>不知道创新是从哪来的</strong>。`,
    cognition_p6: `但 Claude Code 在这里补了一个反直觉的推论：<strong>不知道「正确答案」有时候反而是优势。</strong>我现在是大一学生，不会像 OpenAI 研究员那样「知道这不能做」，所以可能会试试。我的审美还没被行业「规范」过，所以可能会觉得某些东西好看，而那个东西恰好是新的。年轻人的创新窗口不在「更聪明」，在<strong>认知约束跟大厂不一样</strong>。局限恰好可能是差异。`,

    // ── 走自己的路 ──
    h2_path: "学习前人 vs 走自己的路：不是对立，各练各的",
    path_p1: `我追问了自己一个问题：学习前人成果和自己创新，是不是互相抵消？我的结论是——<strong>不是。</strong>`,
    path_p2: `用 Claude Code 的话说：「前者给你语言，后者让你用这个语言说出只有你能说的话。」`,
    path_p3: `VAE 本身就是一个完美的例子。Kingma 和 Welling 2013 年提出 VAE 的时候，自动编码器已经用了几十年了，变分推断也是老东西。创新不是发明两个新概念，而是<strong>把两个已有的东西焊在一起，然后说「这个连接是有意义的」</strong>。别人看自动编码器看到压缩，他们看到生成；别人看变分推断看到数学技巧，他们看到概率建模。同一个东西，不同的视角，就有了新东西。`,
    path_p4: `所以我现在的处境其实不矛盾——学 CS231n、跑别人的代码、看论文架构，是在积累「语言」；写日记、对 AGI 和审美有自己的判断、对「准确无误」持怀疑，是在形成自己的「视角」。两个东西各练各的，交点就是原创性。`,
    path_p5: `但 Claude Code 在这里给了一个让我停顿了几秒的警告：<strong>「有自己的想法」的第一步不是构建，是辨别。</strong>`,
    path_p6: `在信息过载的时代，「有自己的想法」的反面不是「被别人洗脑」，而是更隐蔽的一种情况——<strong>你以为是你自己的想法，实际上是你上周刷到的那篇文章不知不觉长进了你的认知里，你只是忘了来源</strong>。辨别哪些想法不是你自己的，这比想象中要难。`,

    // ── 能力 vs 状态 ──
    h2_capability: "能力 vs 状态：一个从未想过的角度",
    capability_p1: `到这里，Claude Code 抛出了一个我从来没想过的角度：`,
    capability_quote: `「AGI 时代最根本的特征，是人的价值从'会什么'彻底转移到'你是谁'。」`,
    capability_p2: `过去「我会写 Python」是价值。以后任何一个 AI 都会写 Python。但「我是一个因为某个奇怪原因特别在意 VAE latent space 颜色分布的人」——<strong>这是价值。</strong>它不是能力，是<strong>取向（orientation）</strong>。是在无限多的可能性里，自己选择盯着什么东西看。`,
    capability_p3: `AGI 可以帮你做任何事，但它不知道什么事值得做。`,
    capability_p4: `顺着这个往下，我意识到了一件事：「让人真正明白自己想要什么」，在 AGI 时代不是一个附带属性，而是一种<strong>宝贵的状态</strong>。Claude Code 说「状态」这个词用得比「能力」准确——`,
    capability_p5: `<strong>能力可以学，状态不是。</strong>`,
    capability_p6: `一个人可以训练做题、写代码、发论文——花时间就能获得。但「知道自己想要什么」没法训练。它需要的是另一套东西：足够安静才能听得到自己的声音；足够诚实才能区分「我真的想要」和「别人告诉我该想要」；可能还需要一些挫败、一些错误的选择、一些回头看的时刻——因为人往往是在「发现自己其实不想要什么」之后，才开始逼近「我到底想要什么」。`,
    capability_p7: `这些东西没有教程，没有作业，不考试。但它们<strong>是练习的结果</strong>——只是这个练习不发生在课堂上。写日记、追问「什么是准确的」「什么是好的审美」「什么是走自己的路」——这些追问本质上就是在持续校准自己的取向，不让自己的「想要」被默认值吃掉。`,

    // ── 收束 ──
    h2_closing: "收束：最难的不是变聪明，是不糊弄自己",
    closing_p1: `把 Codex 和 Claude Code 的对话放在一起看，其实它们指向了同一个地方，只是各自看到的东西不完全一样。`,
    closing_p2: `Codex 看到了<strong>匮乏的转移</strong>：从能力不够变成愿望不确定。Claude Code 补充了<strong>边界的持久</strong>：物理世界、注意力、身体——这些限制 AGI 动不了，所以「选择」本身变成了最稀缺的行为。`,
    closing_p3: `Codex 列了<strong>三样要守住的东西</strong>：见解、勇气、审美。Claude Code 把它们重新翻译了一遍：不是「犯错=原创」，而是「品味×勇气=创造力」；不是「不被条件约束的审美」是天赋，而是它需要每天练习，不练就退化。`,
    closing_p4: `Codex 说人类从手段变成目的。Claude Code 加了一句：<strong>变成目的之后，最难的不是变聪明，是不糊弄自己。</strong>`,
    closing_p5: `因为在 AGI 时代，答案唾手可得，但问题不是。当一切都能被生成的时候，最贵的东西反而不是你能生成什么，而是<strong>你选择生成什么、选择不生成什么、选择为什么而花掉你有限的时间</strong>。`,
    closing_p6: `AGI 时代不是一个答案时代，是一个<strong>选择时代</strong>。而选择的前提是：你得先知道自己是谁。`,
    closing_p7: `所以如果你问我 AGI 时代什么样的人最稀缺——不是最聪明的人，是<strong>最不含糊的人</strong>。是那些在充足里仍然能选择、仍然愿意为一件事付出长期主义、仍然每天都问自己「我到底想要什么」并且不糊弄答案的人。`,
    closing_p8: `写这篇东西本身，也是这个练习的一部分。`,
    closing_p9: `2026 年 7 月 31 日，深夜。`,

    // ── 附注 ──
    h2_note: "附注",
    note_p1: `这篇文章的内容最早记录在我的 Obsidian 笔记中（<code>SecondBrain/3-Areas/关于AGI时代的思考.md</code>），是当天和 Codex 及 Claude Code 两段对话的整理。博客版本做了一些润色，把对话体的碎片感整理成了更连贯的文章结构，但核心论点和逻辑全部保留。`,
    note_p2: `如果你对这个话题有自己的想法，欢迎通过主页的链接找到我。我很好奇不同的人对「AGI 时代你最想守住什么」这个问题的答案。`,
  },

  en: {
    // ── Opening ──
    h2_intro: "Where This Article Came From",
    intro_p1: `July 31, 2026. An ordinary summer night. I was chatting with Codex about AGI — not the "when will AGI arrive" kind of prediction, but something more fundamental: <strong>In the AGI era, what's left for humans?</strong>`,
    intro_p2: `Codex gave a beautiful framework: "For the first time, humanity moves from scarcity of capability to scarcity of desire." It resonated, but something felt off. So I pasted the entire conversation into Claude Code and asked it to critique, point by point.`,
    intro_p3: `It didn't disappoint. It didn't just echo Codex — it tore the framework open from angles I'd never considered. And then we dug deeper, uncovering things I'd never seriously thought about before.`,
    intro_p4: `This article is the record of that conversation. It's not an "AI-written AGI prediction." It's a freshman student and two AIs, trying to figure out <strong>what a human being actually is, in an era where everything can be remade by AI</strong>.`,

    // ── Codex's Framework ──
    h2_codex: "Codex's Framework: From Capability Scarcity to Desire Scarcity",
    codex_p1: `Codex's core argument, in one sentence: <strong>The most fundamental change of the AGI era is that humanity moves, for the first time, from "scarcity of capability" to "scarcity of desire."</strong>`,
    codex_p2: `For tens of thousands of years, the default setting of life has been "not enough" — not enough resources, time, ability, information. Most of human cognition has been spent overcoming insufficiency: learning, competing, calculating, enduring, planning. Scarcity played two hidden roles: it was both motivation and meaning. Things were valuable because they were hard; achievements meant something because others couldn't do them.`,
    codex_p3: `AGI pulls out this foundation. For the first time, humanity would operate in a state of "having everything" — and human civilization has never run on abundance.`,
    codex_p4: `From this logic, Codex predicted several concrete shifts:`,
    codex_li1: `<strong>Labor and identity decouple</strong> — for millennia, "who you are" ≈ "what you do." When work can be outsourced, identity loses its default anchor. "Who am I" becomes a question you have to answer yourself, every day.`,
    codex_li2: `<strong>The boundary between real and fake blurs</strong> — when generated content becomes infinitely cheap, "seeing is believing" collapses. Trust, verifiable traces, and evidence of things you've actually done become things you actively maintain.`,
    codex_li3: `<strong>The cost of relationships changes</strong> — AI has infinite patience, always understands, is always present. Relationships with AI become easier than relationships with people. The definitions of intimacy, loneliness, and growth get rewritten.`,
    codex_li4: `<strong>Meaning crisis replaces poverty as the biggest social problem</strong> — boredom becomes a universal disease. "Worth it" is something you have to produce yourself.`,
    codex_li5: `<strong>Education and research rules change</strong> — knowledge acquisition approaches zero cost. Degrees continue to devalue as information barriers. The ability to "find good questions" becomes more valuable than "solving hard problems."`,
    codex_p5: `Codex's closing line was concise: <strong>Humans are liberated from "means" and then forced to become "ends." We used to ask "how"; from now on, we only ask "why."</strong>`,

    // ── Three Things ──
    h2_three: "Three Things Humans Must Hold Onto",
    three_p1: `When Codex asked me "what do you most want to hold onto?", I answered almost reflexively with three things:`,
    three_1: `<strong>Unique ideas and insights</strong> — not from data, but from "having lived"`,
    three_2: `<strong>The courage to make mistakes</strong> — AI is designed to be as correct as possible; humans can make mistakes on things that matter, and mistakes are the doorway to originality`,
    three_3: `<strong>A unique aesthetic, unconstrained by conditions</strong> — not bound by survival, market, or evaluation, while actively resisting the downward current of AI's averaged beauty`,
    three_p2: `Codex noted that these three are actually facets of the same thing: <strong>a person with subjectivity</strong>. They share one trait — they don't come from data, they come from "having lived." AI can have seen countless styles, but it's never been cornered by life and grown something out of that corner. It can simulate bravery, but it's never truly feared anything, so it doesn't know what the other side of fear tastes like.`,
    three_p3: `Codex also added an important reminder: these three aren't static assets you "keep" — they're <strong>abilities that degrade</strong>. Writing journals, building projects, making mistakes, arguing — these everyday actions are the practice. The real risk of the AGI era isn't "AI taking them away," it's <strong>"humans stopping the practice because it's too convenient"</strong> — when every answer is at your fingertips, you slowly stop asking your own questions.`,

    // ── Claude Code's Critique ──
    h2_critique: "Claude Code's Dissent: What's Wrong With This Framework",
    critique_p1: `I pasted the entire conversation above into Claude Code. Its first reaction wasn't praise — it was skepticism. Three corrections, each hitting a blind spot in Codex's framework.`,

    h3_physical: `"Having Everything"? The Physical World Doesn't Answer to AGI`,
    physical_p1: `Codex said "from capability scarcity to desire scarcity," implying AGI gives us everything. Claude Code cut straight through: <strong>That's not true.</strong>`,
    physical_p2: `AGI can give you infinite knowledge, infinite code, infinite text — but the physical world isn't under its jurisdiction. You still only have 24 hours a day. You still only have one body. You can still only be in one place at a time. You can't eat 100 meals simultaneously, can't have 100 relationships at once, can't climb 100 mountains at the same time.`,
    physical_p3: `So "scarcity" hasn't disappeared — it's just changed form. From <strong>scarcity of capability</strong> to <strong>scarcity of attention</strong> and <strong>scarcity of embodiment</strong>. You can only ever experience a finite life — and this limit is more fundamental than "not being capable enough." It's the boundary of existence itself. AGI can't touch it.`,
    physical_p4: `This correction matters. It means the AGI-era problem isn't "I have everything, now what do I want?" — it's <strong>"I have infinite options, but I can only live an extremely finite subset of them."</strong> Scarcity shifts from "can't do it" to "can't choose it all." These are fundamentally different problems.`,

    h3_meaning: `"The World Used to Decide What Matters for You" — No, It Didn't`,
    meaning_p1: `Codex said: "The world's constraints used to decide what was important for you — you worked hard because you'd starve otherwise, you studied because of exams, you competed because resources were limited."`,
    meaning_p2: `Claude Code's response was blunt: <strong>No.</strong> What the world gave you was always constraints (exams, scores, competition), not meaning. Switching your major to CS, wanting to publish at top conferences, journaling to ask "what does accuracy even mean?" — which of these was "the world deciding for you"?`,
    meaning_p3: `Meaning has always been something you had to find yourself. It's just that before, many people were too busy surviving to have time to think about it. AGI didn't change "meaning must be self-made" — it just <strong>made it harder for more people to pretend this question doesn't exist</strong>. This isn't a new problem. It's an old problem that's been postponed for so long it's finally knocking on the door.`,

    h3_taste: "Making Mistakes Isn't the Moat. Taste Is.",
    taste_p1: `Codex said "AI doesn't dare to make mistakes, humans do, so humans have originality" — it sounds good, but Claude Code said it's too romantic.`,
    taste_p2: `In reality, AI can absolutely "make mistakes." Ask a diffusion model to add noise and denoise — every step is a "mistake." Ask it to generate an animal that doesn't exist — it can. Creativity isn't the ability to "make mistakes." It's the judgment to <strong>know which mistakes are worth making</strong>.`,
    taste_p3: `Codex actually said the same thing elsewhere — "selecting the worthy one from infinite possibilities" — but it split "making mistakes" and "choosing" into two separate arguments. Claude Code said they're the same thing: <strong>Creativity = Taste × Courage.</strong> Humanity's real moat isn't generative capability. It's taste.`,
    taste_p4: `This correction pulls the romantic narrative back to earth. Humans aren't original because they "dare to be wrong" — they're original because they <strong>have the judgment to decide what's worth being wrong about</strong>.`,

    // ── Cognitive Prison ──
    h2_cognition: "The Cognitive Prison: You're Copying the Answer, Not the Person Who Made It",
    cognition_p1: `At this point, I offered my own observation: <strong>Humans cannot cognize things above their own level of cognition.</strong>`,
    cognition_p2: `Sure, an ordinary person can see rich people's lives on social media — mansions, sports cars, private jets. But you'll never truly understand that life, because you've never lived in a state where "money isn't a problem." All your imaginings of that life are just your current desires amplified 100x — not that person's actual troubles, not their actual joys.`,
    cognition_p3: `This has nothing to do with IQ. It has everything to do with experience. If you haven't lived it, you don't know it.`,
    cognition_p4: `Aesthetics follow the same logic. A designer sees Apple's minimalism, thinks it's beautiful, and "borrows" it — but what they're borrowing is <strong>the result</strong>, not <strong>how that result grew</strong>. They don't know how many fights happened inside Apple over removing a single button. They don't know the years Jony Ive spent being tortured in design school to form that aesthetic intuition. They don't know how many rounds of "make it complex, then delete" sit behind that "simplicity."`,
    cognition_p5: `They copied the answer, not the person who produced the answer. So they'll always be following. It's not that they don't want to innovate — it's that <strong>they don't know where innovation comes from</strong>.`,
    cognition_p6: `But Claude Code added a counterintuitive corollary here: <strong>Not knowing the "right answer" can sometimes be an advantage.</strong> I'm a freshman. I won't, like an OpenAI researcher, "know this can't be done," so I might try it anyway. My aesthetic hasn't been "standardized" by the industry yet, so I might find something beautiful — and that thing might actually be new. The innovation window for young people isn't about "being smarter." It's about <strong>having different cognitive constraints than big companies</strong>. Your limitations might be exactly your differentiation.`,

    // ── Own Path ──
    h2_path: "Learning From Predecessors vs. Walking Your Own Path: Not Contradictory",
    path_p1: `I pushed myself with a question: do learning from predecessors and having your own path cancel each other out? My conclusion: <strong>No.</strong>`,
    path_p2: `In Claude Code's words: "The former gives you a language. The latter lets you use that language to say something only you can say."`,
    path_p3: `VAE is the perfect example. When Kingma and Welling proposed VAE in 2013, autoencoders had been around for decades, and variational inference was old news. The innovation wasn't inventing two new concepts — it was <strong>welding two existing things together and saying "this connection is meaningful."</strong> Others looked at autoencoders and saw compression; they saw generation. Others looked at variational inference and saw a mathematical trick; they saw probabilistic modeling. Same thing, different perspective — that's where new things come from.`,
    path_p4: `So my current situation isn't contradictory. Learning CS231n, running other people's code, reading paper architectures — that's accumulating "language." Writing journals, having my own judgments about AGI and aesthetics, being skeptical of "accuracy" — that's forming my own "perspective." These two things train separately. Their intersection is originality.`,
    path_p5: `But Claude Code gave a warning here that made me pause for a few seconds: <strong>The first step to "having your own thoughts" isn't building — it's discerning.</strong>`,
    path_p6: `In an age of information overload, the opposite of "having your own thoughts" isn't "being brainwashed." It's something more insidious — <strong>thinking something is your own idea, when it's actually that article you scrolled past last week, silently growing roots in your cognition, and you just forgot the source.</strong> Discerning which thoughts aren't yours — that's harder than it sounds.`,

    // ── Capability vs State ──
    h2_capability: "Capability vs. State: A Perspective I'd Never Considered",
    capability_p1: `At this point, Claude Code dropped a perspective I'd never thought about before:`,
    capability_quote: `"The most fundamental feature of the AGI era is that human value shifts entirely from 'what you can do' to 'who you are.'"`,
    capability_p2: `In the past, "I can write Python" was value. In the future, any AI can do that. But "I'm someone who, for some strange reason, really cares about the color distribution in VAE latent space" — <strong>that's value.</strong> It's not a capability. It's an <strong>orientation</strong>. It's the thing you choose to stare at, out of infinite possibilities.`,
    capability_p3: `AGI can help you do anything. But it doesn't know what's worth doing.`,
    capability_p4: `Following this thread, I realized something: "truly knowing what you want" isn't a side attribute in the AGI era — it's a <strong>precious state</strong>. Claude Code said "state" is more accurate than "capability" here —`,
    capability_p5: `<strong>Capabilities can be learned. States cannot.</strong>`,
    capability_p6: `A person can train to solve problems, write code, publish papers — these are all capabilities, obtainable with time. But "knowing what you want" can't be trained. It requires a different set of things: enough quiet to hear your own voice; enough honesty to distinguish "I truly want this" from "someone told me I should want this"; probably some setbacks, some wrong choices, some moments of looking back — because people often only start approaching "what do I actually want" after discovering "what I definitely don't want."`,
    capability_p7: `These things have no tutorials, no homework, no exams. But they are <strong>the result of practice</strong> — it's just that the practice doesn't happen in classrooms. Writing journals, repeatedly asking "what is accuracy," "what is good aesthetics," "what does it mean to walk my own path" — these questions are, in essence, continuously calibrating your own orientation, refusing to let your "wants" be eaten by the defaults.`,

    // ── Closing ──
    h2_closing: "Closing: The Hardest Thing Isn't Getting Smarter. It's Not Bullshitting Yourself.",
    closing_p1: `Put Codex's and Claude Code's conversations side by side, and they actually point to the same place — they just see slightly different things.`,
    closing_p2: `Codex saw <strong>the shift of scarcity</strong>: from capability shortage to desire uncertainty. Claude Code supplemented <strong>the persistence of boundaries</strong>: the physical world, attention, embodiment — these limits AGI can't touch, which makes "choosing" itself the scarcest act.`,
    closing_p3: `Codex listed <strong>three things to hold onto</strong>: insight, courage, aesthetics. Claude Code retranslated them: it's not "mistakes = originality," but "taste × courage = creativity"; the "aesthetic unconstrained by conditions" isn't a gift, it's something that needs daily practice — stop practicing, and it degrades.`,
    closing_p4: `Codex said humans move from means to ends. Claude Code added: <strong>after becoming the ends, the hardest thing isn't getting smarter — it's not bullshitting yourself.</strong>`,
    closing_p5: `Because in the AGI era, answers are everywhere, but questions are not. When everything can be generated, the most expensive thing isn't what you can generate — it's <strong>what you choose to generate, what you choose not to generate, and what you choose to spend your finite time on</strong>.`,
    closing_p6: `The AGI era isn't an era of answers. It's an <strong>era of choices</strong>. And the prerequisite for choosing is: you have to know who you are first.`,
    closing_p7: `So if you ask me what kind of person is the most scarce in the AGI era — it's not the smartest person. It's <strong>the person who refuses to bullshit themselves</strong>. The one who can still choose amid abundance, still commit to long-termism for something they care about, still ask themselves every day "what do I actually want" — and refuse to accept a lazy answer.`,
    closing_p8: `Writing this piece is part of that practice.`,
    closing_p9: `Late night, July 31, 2026.`,

    // ── Note ──
    h2_note: "Note",
    note_p1: `The content of this article was originally recorded in my Obsidian notes (<code>SecondBrain/3-Areas/关于AGI时代的思考.md</code>), compiled from two conversations with Codex and Claude Code on the same day. The blog version has been polished to transform the fragmented conversational style into a more coherent article structure, but all core arguments and logic remain intact.`,
    note_p2: `If you have your own thoughts on this topic, feel free to find me through the links on my homepage. I'm genuinely curious about how different people answer the question: "In the AGI era, what do you most want to hold onto?"`,
  },
};

export default function AgiEraThoughtsPage() {
  const { lang } = useLang();
  const T = content[lang];

  return (
    <BlogPostLayout post={post}>
      {/* ── 开场 ── */}
      <h2 id="intro">{T.h2_intro}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.intro_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.intro_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.intro_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.intro_p4 }} />

      {/* ── Codex 的框架 ── */}
      <h2 id="codex-framework">{T.h2_codex}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.codex_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.codex_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.codex_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.codex_p4 }} />
      <ul>
        <li dangerouslySetInnerHTML={{ __html: T.codex_li1 }} />
        <li dangerouslySetInnerHTML={{ __html: T.codex_li2 }} />
        <li dangerouslySetInnerHTML={{ __html: T.codex_li3 }} />
        <li dangerouslySetInnerHTML={{ __html: T.codex_li4 }} />
        <li dangerouslySetInnerHTML={{ __html: T.codex_li5 }} />
      </ul>
      <p dangerouslySetInnerHTML={{ __html: T.codex_p5 }} />

      {/* ── 三样东西 ── */}
      <h2 id="three-things">{T.h2_three}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.three_p1 }} />
      <ol>
        <li dangerouslySetInnerHTML={{ __html: T.three_1 }} />
        <li dangerouslySetInnerHTML={{ __html: T.three_2 }} />
        <li dangerouslySetInnerHTML={{ __html: T.three_3 }} />
      </ol>
      <p dangerouslySetInnerHTML={{ __html: T.three_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.three_p3 }} />

      {/* ── Claude Code 的修正 ── */}
      <h2 id="claude-critique">{T.h2_critique}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.critique_p1 }} />

      <h3 id="physical-world">{T.h3_physical}</h3>
      <p dangerouslySetInnerHTML={{ __html: T.physical_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.physical_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.physical_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.physical_p4 }} />

      <h3 id="meaning">{T.h3_meaning}</h3>
      <p dangerouslySetInnerHTML={{ __html: T.meaning_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.meaning_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.meaning_p3 }} />

      <h3 id="taste">{T.h3_taste}</h3>
      <p dangerouslySetInnerHTML={{ __html: T.taste_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.taste_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.taste_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.taste_p4 }} />

      {/* ── 认知牢笼 ── */}
      <h2 id="cognitive-prison">{T.h2_cognition}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p5 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p6 }} />

      {/* ── 走自己的路 ── */}
      <h2 id="own-path">{T.h2_path}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.path_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p5 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p6 }} />

      {/* ── 能力 vs 状态 ── */}
      <h2 id="capability-vs-state">{T.h2_capability}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.capability_p1 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.capability_quote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.capability_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p5 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p6 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p7 }} />

      {/* ── 收束 ── */}
      <h2 id="closing">{T.h2_closing}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.closing_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p5 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p6 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p7 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p8 }} />
      <p className="text-zinc-400 dark:text-zinc-500 italic">{T.closing_p9}</p>

      {/* ── 附注 ── */}
      <h2 id="note">{T.h2_note}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.note_p1 }} />
      <p>
        📄{" "}
        <a
          href={`${BASE_PATH}/agi-era-thoughts.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          {lang === "zh" ? "点击查看原文 PDF（Obsidian 笔记导出）" : "View Original PDF (Exported from Obsidian)"}
        </a>
      </p>
      <p dangerouslySetInnerHTML={{ __html: T.note_p2 }} />
    </BlogPostLayout>
  );
}
