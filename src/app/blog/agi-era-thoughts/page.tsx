"use client";

import { useLang } from "@/components/language-context";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { blogPosts } from "@/lib/blog-data";
import { BASE_PATH } from "@/lib/base-path";

const post = blogPosts.find((p) => p.slug === "agi-era-thoughts")!;

const content = {
  zh: {
    // ── 开场 ──
    h2_opening: "你有没有想过——",
    opening_p1: `如果有一天，任何知识、任何技能、任何产出都能被 AI 即时生成，「你会做什么」这件事就不再重要了。`,
    opening_p2: `这个问题是我在 2026 年 7 月 31 日深夜和 Codex 聊天时碰到的。不是「AGI 什么时候来」那种技术预测，而是更根本的：<strong>当一切都能被 AI 做掉的时候，人还剩什么？</strong>`,
    opening_p3: `Codex 给了一个很漂亮的框架——「人类第一次从能力匮乏走进愿望匮乏」。我觉得有道理，但隐约觉得哪里不对。于是我把整段对话贴给了 Claude Code，让它逐条质疑。结果它没复读 Codex，而是从几个我完全没想过的角度撕开了这个框架。`,
    opening_p4: `这篇文章就是那场三方对话的记录。不是「AI 帮你写的 AGI 预测」，而是一个大一学生，带着两个 AI，试图搞清楚一件事：<strong>在这个一切都会被重做的时代里，人到底是什么。</strong>`,

    // ── 核心论点 ──
    h2_thesis: "一、核心论点：从「能力匮乏」到「愿望匮乏」",
    thesis_p1: `Codex 对 AGI 时代最根本改变的判断，一句话：<strong>人类第一次从「能力的匮乏」走进「愿望的匮乏」。</strong>`,
    thesis_p2: `过去几万年，生活的默认设定一直是「不够」——资源不够、时间不够、能力不够、信息不够。人的大半心智都花在克服不足上：学习、竞争、计算、忍耐、规划。`,
    thesis_p3: `匮乏看起来很苦，但它一直在偷偷扮演两个角色：`,
    thesis_li1: `<strong>动力</strong>——因为难，所以要更努力`,
    thesis_li2: `<strong>意义</strong>——因为别人做不到，所以我的「做到」有价值`,
    thesis_p4: `AGI 把这层地基抽走。人类将在「什么都有」的状态下运行——而人类文明从来没有在充足里运行过。`,
    thesis_blockquote: `人类从「手段」中被解放出来，然后被迫成为「目的」。以前问「怎么办」，以后只问「为什么」。`,

    // ── 五个改变 ──
    h2_changes: "二、会发生的五个具体改变",
    changes_intro: `顺着核心论点往下推，Codex 列出了五个会发生的改变——不是科幻，是逻辑推演：`,
    changes_1: `<strong>劳动与身份解耦。</strong>几千年来「你是谁」≈「你做什么」。你是学生、工程师、母亲——身份从劳作里长出来，时间结构、社会地位、自我价值都靠它支撑。当做事可以外包，身份失去默认锚点。「我是谁」变成每天要自己回答的问题。`,
    changes_2: `<strong>真实与虚构边界模糊。</strong>生成内容无限廉价后，「看到即真实」这个默认设定会失效。信任、可验证的痕迹、亲手做过的证据——这些都需要主动维护，而不再是默认状态。`,
    changes_3: `<strong>关系成本改变。</strong>AI 可以无限耐心、随时理解、永远在场。和 AI 的关系比和人的关系更容易，但「容易」和「值得」是两回事。亲密、孤独、成长的定义都会被重写。`,
    changes_4: `<strong>意义危机取代贫穷成为最大的社会问题。</strong>无聊会成为普遍疾病。以前「值得」由生存压力替你定义，以后你需要自己生产「值得」。`,
    changes_5: `<strong>教育与科研规则变化。</strong>知识获取趋近零成本，学位作为「信息门槛」的价值继续贬值。但「发现好问题」的能力会比「解决难题」更值钱——模型能解题，但定义题目依然是人。`,

    // ── 三样东西 ──
    h2_three: "三、人类要守住的三样东西",
    three_intro: `Codex 问我：「到那个时候，你最想守住的是什么？」我几乎是下意识地答了三样：`,
    three_1: `<strong>独特的想法和见解</strong>——不来自数据，来自「活过」`,
    three_2: `<strong>不怕犯错的勇气</strong>——AI 被设计成尽量正确；人可以在重要的事情上犯错，错误是原创性的入口`,
    three_3: `<strong>独一无二、不被条件约束的审美</strong>——不被生存、市场、评价约束，同时主动抵抗 AI 平均美的下沉气流`,
    three_p2: `Codex 说这三样其实是同一件事的不同面：<strong>有主体性的人</strong>。它们的共同点是不来自数据，而来自「活过」——AI 可以见过无数风格，但它没被生活逼到墙角过；它可以模拟勇敢，但它没真正害怕过什么，所以也不知道「怕」的另一面是什么味道。`,
    three_p3: `更重要的是：这三样不是「保得住」的静态财产，而是<strong>会退化的能力</strong>。写日记、做项目、犯错、争论——这些日常动作就是练习。AGI 时代最大的风险不是「AI 夺走它们」，而是<strong>「人因为太方便而不再练习它们」</strong>。想要什么答案都有，慢慢就不想问自己的问题了。`,

    // ── 时间线 ──
    h2_timeline: "四、AGI 什么时候来？",
    timeline_p1: `回答这个问题之前，先要澄清一个常见的误解：AGI 不会是一个「某天宣布降临」的事件，而是一条<strong>连续爬升的曲线</strong>。`,
    timeline_p2: `你现在用的 Codex、Claude Code、Cursor 这些工具，放在 2022 年就是科幻。但人类适应得很快，三个月后就觉得「这算什么 AGI」。这种「渐进式脱敏」才是真正的变化模式——我们已经在这条曲线上了，只是感知有滞后。`,
    timeline_p3: `真正的分界线不是「它能做什么」，而是<strong>它能不能自己设定目标并持续自我改进</strong>。在那之前，最合理的姿态大概就是在一切变化中保持自己的方向。`,

    // ── Claude Code 修正 ──
    h2_critique: "五、Claude Code 的不同意见：这个框架哪里不对",
    critique_p1: `我把上面的整段对话贴给 Claude Code。它的第一反应不是赞美，是质疑。下面三个修正，每一个都戳在 Codex 的盲区上。`,

    h3_physical: "修正一：「什么都有」？物理世界不归 AGI 管",
    physical_p1: `Codex 的框架暗示 AGI 之后什么都有。Claude Code 直接说：<strong>这不是真的。</strong>`,
    physical_p2: `AGI 能给你无限的知识、代码、文本——但物理世界不归它管。你仍然只有 24 小时一天，仍然只有一个身体，仍然只能同时出现在一个地方。你不可能同时吃 100 顿饭、谈 100 段恋爱、爬 100 座山。`,
    physical_p3: `所以「稀缺」没有消失，只是换了层皮：从<strong>能力的稀缺</strong>变成<strong>注意力的稀缺</strong>和<strong>身体的稀缺</strong>。你永远只能体验有限的人生——这个限制比「能力不够」更根本，是存在本身的边界，AGI 动不了它。`,
    physical_p4: `这意味着 AGI 时代的核心问题不是「什么都有了我还要什么」，而是<strong>「选项无限多，但我只能挑极其有限的一部分来活」</strong>。稀缺从「做不到」变成了「选不过来」——两种完全不同性质的问题。`,

    h3_meaning: "修正二：「世界替你决定什么是重要的」——不对",
    meaning_p1: `Codex 说以前是世界的限制替你决定什么叫重要——努力是因为不努力就没饭吃，学习是因为考试，竞争是因为资源有限。`,
    meaning_p2: `Claude Code 的回应是：<strong>不对。</strong>世界给你的一直是约束条件（考试、分数、竞争），不是意义。你转专业学 CS、想发顶会论文、写日记追问「准确是什么」——哪一件是「世界替你决定的」？`,
    meaning_p3: `意义从来都要自己找。只是以前很多人忙到没时间想。AGI 没改变「意义需要自己找」这个事实，它只是<strong>让更多人没法再假装这个问题不存在</strong>。这不是新问题，是一个被推迟了很久的老问题终于找上门来了。`,

    h3_taste: "修正三：犯错不是壁垒，品味才是",
    taste_p1: `Codex 说「AI 不敢犯错，人敢犯错所以人有原创性」——很好听，但太浪漫了。`,
    taste_p2: `实际上 AI 当然能「犯错」。扩散模型加噪再去噪，每一步都是「错」的；让它生成不存在的动物，毫无压力。创造力不是「犯错」的能力，而是<strong>知道哪个错值得犯</strong>的判断力。`,
    taste_p3: `Codex 在别处其实说过同一件事——「在无限多的可能里选出值得的那个」——但它把「犯错」和「选择」拆成了两个论点。其实是一件事：`,
    taste_blockquote: `创造力 = 品味 × 勇气。人真正的壁垒不是生成能力，是品味。`,
    taste_p4: `这个修正把浪漫叙事拉回地面。人不是因为「敢错」而有原创性，是因为<strong>有判断力决定什么值得去错</strong>。`,

    // ── 认知牢笼 ──
    h2_cognition: "六、认知的牢笼：你抄的是答案，不是出答案的人",
    cognition_p1: `在 Claude Code 的质疑之后，我提了一个自己的观察：<strong>人无法认知高于自己认知以上的事物。</strong>`,
    cognition_p2: `普通人是可以通过社交媒体看到富人的生活的——但永远不会真正理解。因为你没活过「钱不是问题」的状态，所有想象都是现有欲望的放大版，不是那个人真正的困扰和快乐。这跟智商无关，跟体验有关：<strong>你没活过，就不知道。</strong>`,
    cognition_p3: `审美同理。设计师抄苹果极简——抄到的是<strong>结果</strong>，不是<strong>那个结果怎么长出来的</strong>。他不知道苹果内部为砍一个按钮吵了多少次架，不知道 Jony Ive 在设计学校被折磨了几年，不知道「简洁」背后有多少次「做复杂了然后删掉」。结果就是他永远跟在后面。`,
    cognition_p4: `但 Claude Code 在这里补了一个反直觉的推论：`,
    cognition_blockquote: `不知道「正确答案」有时候反而是优势。`,
    cognition_p5: `我现在是大一学生，不会像 OpenAI 研究员那样「知道这不能做」，所以可能会试试。审美还没被行业「规范」过，所以可能会觉得某些东西好看——而那个东西恰好可能是新的。`,
    cognition_p6: `年轻人的创新窗口不在「更聪明」，在<strong>认知约束跟大厂不一样</strong>。局限，恰好可能是差异。`,

    // ── 走自己的路 ──
    h2_path: "七、学习前人 vs 走自己的路：不是对立，各练各的",
    path_p1: `我追问了自己：学习前人成果和自己创新，是不是互相抵消？结论是——<strong>不是。</strong>`,
    path_p2: `用 Claude Code 的话：「前者给你语言，后者让你用这个语言说出只有你能说的话。」`,
    path_p3: `VAE 就是完美例子。2013 年 Kingma 和 Welling 提出 VAE 时，自动编码器用了几十年，变分推断也是老东西。创新不是发明新概念，而是<strong>把两个已有的东西焊在一起，说「这个连接有意义」</strong>。别人看自动编码器看到压缩，他们看到生成；别人看变分推断看到数学技巧，他们看到概率建模。同一个东西，不同视角——这就是创新。`,
    path_p4: `所以我现在做的事不矛盾：学 CS231n、跑代码、看论文——积累「语言」；写日记、对审美有自己的判断、对「准确无误」持怀疑——形成「视角」。两件事各练各的，交点就是原创性。`,
    path_p5: `但 Claude Code 给了一个让我停了很久的警告：`,
    path_blockquote: `「有自己的想法」的第一步不是构建，是辨别。`,
    path_p6: `在信息过载的时代，你以为的「自己的想法」，很多时候只是<strong>你上周刷到的某篇文章，忘了来源，却长进了你的认知里</strong>。辨别哪些想法不是你自己的——这件事比你想象的要难得多。`,

    // ── 能力 vs 状态 ──
    h2_capability: "八、能力 vs 状态：一个从未想过的角度",
    capability_p1: `到这里，Claude Code 抛出了一个我完全没想过的角度：`,
    capability_blockquote: `AGI 时代最根本的特征，是人的价值从「会什么」彻底转移到「你是谁」。`,
    capability_p2: `过去「我会写 Python」是价值。以后任何一个 AI 都会。但「我是一个因为某个奇怪原因特别在意 VAE latent space 颜色分布的人」——<strong>这才是价值。</strong>它不是能力，是<strong>取向（orientation）</strong>——在无限多的可能性里，你自己选择盯着什么看。`,
    capability_p3: `AGI 可以帮你做任何事，但<strong>它不知道什么事值得做。</strong>`,
    capability_p4: `顺着这个往下，我意识到：「让人真正明白自己想要什么」，在 AGI 时代不是一个附带属性，而是一种<strong>宝贵的状态</strong>。Claude Code 说「状态」比「能力」准确——`,
    capability_bold: `能力可以学，状态不是。`,
    capability_p5: `做题、写代码、发论文——花时间就能获得。但「知道自己想要什么」没法训练。它需要另一套东西：足够的安静才听得到自己的声音；足够的诚实才能区分「我真的想要」和「别人告诉我该想要」；可能还需要一些挫败、一些错误选择、一些回头看的时刻——因为人往往是在「发现不想要什么」之后，才开始逼近「真正想要什么」。`,
    capability_p6: `这些东西没有教程、不考试、没有作业。但它们<strong>是练习的结果</strong>——只是练习不发生在课堂上。写日记、追问「什么是准的」「什么是好的审美」「什么是走自己的路」——这些追问本质上是在<strong>持续校准自己的取向</strong>，不让自己的「想要」被默认值吃掉。`,

    // ── 收束 ──
    h2_closing: "九、收束：最难的不是变聪明，是不糊弄自己",
    closing_p1: `把两段对话放在一起：`,
    closing_p2: `Codex 看到了<strong>匮乏的转移</strong>——从能力不够变成愿望不确定。Claude Code 补充了<strong>边界的持久</strong>——物理世界、注意力、身体，这些 AGI 动不了，所以「选择」本身变成最稀缺的行为。`,
    closing_p3: `Codex 列了<strong>三样要守住的东西</strong>——见解、勇气、审美。Claude Code 重新翻译：不是「犯错 = 原创」，而是「品味 × 勇气 = 创造力」；「不被条件约束的审美」不是天赋，需要每天练习，不练就退化。`,
    closing_p4: `Codex 说人类从手段变成目的。Claude Code 加了一句：<strong>变成目的之后，最难的不是变聪明，是不糊弄自己。</strong>`,
    closing_p5: `因为答案唾手可得，但问题不是。当一切都能被生成，最贵的不是你能生成什么，而是<strong>你选择生成什么、选择不生成什么、选择为什么花掉你有限的时间</strong>。`,
    closing_p6: `AGI 时代不是答案时代，是<strong>选择时代</strong>。选择的前提是：你得先知道自己是谁。`,
    closing_p7: `所以如果你问我，AGI 时代什么样的人最稀缺——不是最聪明的人，是<strong>最不含糊的人</strong>。那些在充足里仍然能选择、仍然愿意为一件事付出长期主义、仍然每天都问自己「我到底想要什么」并且不糊弄答案的人。`,
    closing_p8: `写这篇东西本身，也是这个练习的一部分。`,
    closing_p9: `2026 年 7 月 31 日，深夜。`,

    // ── 附注 ──
    h2_note: "附注",
    note_p1: `这篇文章最早以 Obsidian 笔记形式记录（<code>SecondBrain/3-Areas/关于AGI时代的思考.md</code>），是当天与 Codex 和 Claude Code 两段对话的整理。博客版本把碎片化的对话体整理成了连贯的文章结构，核心论点和逻辑全部保留。`,
    note_p2: `如果你对这个话题有自己的想法，欢迎通过主页的链接找到我——我很好奇不同的人对「AGI 时代你最想守住什么」这个问题的答案。`,
  },

  en: {
    // ── Opening ──
    h2_opening: "Have You Ever Wondered—",
    opening_p1: `What if one day, any knowledge, any skill, any output could be instantly generated by AI — then "what you can do" would no longer matter.`,
    opening_p2: `This question hit me late at night on July 31, 2026, while chatting with Codex. Not the "when will AGI arrive" kind of prediction, but something more fundamental: <strong>when AI can do everything, what's left for humans?</strong>`,
    opening_p3: `Codex gave a beautiful framework — "for the first time, humanity moves from scarcity of capability to scarcity of desire." It resonated, but something felt off. So I pasted the entire conversation into Claude Code and asked it to critique. It didn't echo — it tore the framework open from angles I'd never considered.`,
    opening_p4: `This article is the record of that three-way conversation. Not an "AI-generated AGI prediction," but a freshman student, with two AIs, trying to figure out one thing: <strong>in an era where everything can be remade, what is a human being?</strong>`,

    // ── Core Thesis ──
    h2_thesis: "1. The Core Thesis: From Capability Scarcity to Desire Scarcity",
    thesis_p1: `Codex's judgment on the most fundamental change of the AGI era, in one sentence: <strong>For the first time, humanity moves from "scarcity of capability" to "scarcity of desire."</strong>`,
    thesis_p2: `For tens of thousands of years, the default setting of life was "not enough" — not enough resources, time, ability, information. Most of human cognition has been spent overcoming insufficiency: learning, competing, calculating, enduring, planning.`,
    thesis_p3: `Scarcity looked like a curse, but it secretly played two roles:`,
    thesis_li1: `<strong>Motivation</strong> — because it was hard, you had to try harder`,
    thesis_li2: `<strong>Meaning</strong> — because others couldn't do it, your "doing it" had value`,
    thesis_p4: `AGI pulls out this foundation. Humanity would operate in a state of "having everything" — and human civilization has never run on abundance.`,
    thesis_blockquote: `Humans are liberated from "means" and then forced to become "ends." We used to ask "how"; from now on, we only ask "why."`,

    // ── Five Changes ──
    h2_changes: "2. Five Concrete Changes That Will Happen",
    changes_intro: `Following the core thesis, Codex laid out five changes — not science fiction, but logical extrapolation:`,
    changes_1: `<strong>Labor and identity decouple.</strong> For millennia, "who you are" ≈ "what you do." You're a student, an engineer, a mother — identity grew from labor, and time structure, social status, and self-worth all depended on it. When work can be outsourced, identity loses its default anchor. "Who am I" becomes a question you answer yourself, every day.`,
    changes_2: `<strong>The boundary between real and fake blurs.</strong> When generated content becomes infinitely cheap, "seeing is believing" collapses as a default. Trust, verifiable traces, evidence of things you've actually done — these become things you actively maintain, not default states.`,
    changes_3: `<strong>The cost of relationships changes.</strong> AI has infinite patience, always understands, is always present. Relationships with AI become easier than relationships with people — but "easy" and "worth it" are different things. Intimacy, loneliness, and growth get redefined.`,
    changes_4: `<strong>Meaning crisis replaces poverty as the biggest social problem.</strong> Boredom becomes a universal disease. Before, "worth it" was defined for you by survival pressure. After, you have to produce your own "worth it."`,
    changes_5: `<strong>Education and research rules change.</strong> Knowledge acquisition approaches zero cost. Degrees continue to devalue as information barriers. But the ability to "find good questions" becomes more valuable than "solving hard problems" — models can solve, but defining the problem still belongs to humans.`,

    // ── Three Things ──
    h2_three: "3. Three Things Humans Must Hold Onto",
    three_intro: `Codex asked me: "When that time comes, what do you most want to hold onto?" I answered almost reflexively with three things:`,
    three_1: `<strong>Unique ideas and insights</strong> — not from data, but from "having lived"`,
    three_2: `<strong>The courage to make mistakes</strong> — AI is designed to be correct; humans can make mistakes on things that matter, and mistakes are the doorway to originality`,
    three_3: `<strong>A unique aesthetic, unconstrained by conditions</strong> — not bound by survival, market, or evaluation, while actively resisting the downward current of AI's averaged beauty`,
    three_p2: `Codex noted these three are facets of the same thing: <strong>a person with subjectivity</strong>. Their common trait — they don't come from data, but from "having lived." AI can have seen countless styles, but it's never been cornered by life. It can simulate bravery, but it's never truly feared anything, so it doesn't know what the other side of fear tastes like.`,
    three_p3: `More importantly: these three aren't static assets you "keep" — they're <strong>abilities that degrade</strong>. Writing journals, building projects, making mistakes, arguing — these everyday actions are the practice. The real risk of the AGI era isn't "AI taking them away," it's <strong>"humans stopping the practice because it's too convenient."</strong> When every answer is at your fingertips, you slowly stop asking your own questions.`,

    // ── Timeline ──
    h2_timeline: "4. When Is AGI Coming?",
    timeline_p1: `Before answering, let's clear up a common misconception: AGI won't be a "one day it's announced" event. It's a <strong>continuously climbing curve</strong>.`,
    timeline_p2: `The Codex, Claude Code, and Cursor you're using now — by 2022 standards, they were science fiction. But humans adapt fast. Three months later, we think "that's not AGI." This "gradual desensitization" is the real pattern of change — we're already on the curve, just lagging in perception.`,
    timeline_p3: `The real dividing line isn't "what it can do" — it's <strong>whether it can set its own goals and continuously self-improve.</strong> Until then, the most reasonable posture is probably to keep your own direction amidst all the change.`,

    // ── Claude Code Critique ──
    h2_critique: "5. Claude Code's Dissent: What's Wrong With This Framework",
    critique_p1: `I pasted the entire conversation above into Claude Code. Its first reaction wasn't praise — it was skepticism. Three corrections, each hitting a blind spot in Codex's framework.`,

    h3_physical: `Correction 1: "Having Everything"? The Physical World Doesn't Answer to AGI`,
    physical_p1: `Codex's framework implies AGI gives us everything. Claude Code cut through: <strong>That's not true.</strong>`,
    physical_p2: `AGI can give you infinite knowledge, code, text — but the physical world isn't under its jurisdiction. You still only have 24 hours a day. You still only have one body. You can still only be in one place at a time. You can't eat 100 meals, have 100 relationships, or climb 100 mountains simultaneously.`,
    physical_p3: `So "scarcity" hasn't disappeared — it just changed form. From <strong>scarcity of capability</strong> to <strong>scarcity of attention</strong> and <strong>scarcity of embodiment</strong>. You can only ever experience a finite life — this limit is more fundamental than "not being capable enough." It's the boundary of existence itself. AGI can't touch it.`,
    physical_p4: `This means the AGI-era core problem isn't "I have everything, now what do I want?" — it's <strong>"I have infinite options, but I can only live an extremely finite subset of them."</strong> Scarcity shifts from "can't do it" to "can't choose it all" — fundamentally different problems.`,

    h3_meaning: `Correction 2: "The World Used to Decide What Matters for You" — No, It Didn't`,
    meaning_p1: `Codex said the world's constraints used to decide what was important — you worked hard because you'd starve otherwise, you studied because of exams, you competed because resources were limited.`,
    meaning_p2: `Claude Code's response: <strong>No.</strong> What the world gave you was always constraints (exams, scores, competition), not meaning. Switching your major to CS, wanting to publish at top conferences, journaling to ask "what does accuracy even mean?" — which of these was "the world deciding for you"?`,
    meaning_p3: `Meaning has always been something you had to find yourself. It's just that before, many people were too busy surviving to have time. AGI didn't change "meaning must be self-made" — it just <strong>made it harder for more people to pretend this question doesn't exist.</strong> Not a new problem. An old problem, postponed for so long it's finally knocking.`,

    h3_taste: "Correction 3: Making Mistakes Isn't the Moat. Taste Is.",
    taste_p1: `Codex said "AI doesn't dare to make mistakes, humans do, so humans have originality" — sounds good, too romantic.`,
    taste_p2: `In reality, AI can absolutely "make mistakes." Add noise and denoise — every step is a "mistake." Generate an animal that doesn't exist — no problem. Creativity isn't the ability to "make mistakes" — it's the judgment to <strong>know which mistakes are worth making.</strong>`,
    taste_p3: `Codex actually said the same thing elsewhere — "selecting the worthy one from infinite possibilities" — but it split "making mistakes" and "choosing" into two arguments. They're the same thing:`,
    taste_blockquote: `Creativity = Taste × Courage. Humanity's real moat isn't generative capability. It's taste.`,
    taste_p4: `This correction pulls the romantic narrative back to earth. Humans aren't original because they "dare to be wrong" — they're original because <strong>they have the judgment to decide what's worth being wrong about.</strong>`,

    // ── Cognitive Prison ──
    h2_cognition: "6. The Cognitive Prison: You're Copying the Answer, Not the Person Who Made It",
    cognition_p1: `After Claude Code's critique, I offered my own observation: <strong>Humans cannot cognize things above their own level of cognition.</strong>`,
    cognition_p2: `Sure, ordinary people can see rich people's lives on social media — but they'll never truly understand. Because you've never lived in a state where "money isn't a problem." All your imaginings are just amplified versions of your current desires, not that person's actual troubles or joys. This has nothing to do with IQ. It's about experience: <strong>if you haven't lived it, you don't know it.</strong>`,
    cognition_p3: `Aesthetics follow the same logic. A designer copies Apple's minimalism — they're copying the <strong>result</strong>, not <strong>how that result grew</strong>. They don't know the fights inside Apple over removing a single button. They don't know the years Jony Ive spent being tortured in design school. They don't know how many rounds of "make it complex, then delete" sit behind that "simplicity." So they'll always be following.`,
    cognition_p4: `But Claude Code added a counterintuitive corollary here:`,
    cognition_blockquote: `Not knowing the "right answer" can sometimes be an advantage.`,
    cognition_p5: `I'm a freshman. I won't, like an OpenAI researcher, "know this can't be done," so I might try it anyway. My aesthetic hasn't been "standardized" by the industry yet, so I might find something beautiful — and that thing might actually be new.`,
    cognition_p6: `The innovation window for young people isn't about "being smarter." It's about <strong>having different cognitive constraints than big companies.</strong> Your limitations might be exactly your differentiation.`,

    // ── Own Path ──
    h2_path: "7. Learning From Predecessors vs. Walking Your Own Path: Not Contradictory",
    path_p1: `I pushed myself: does learning from predecessors and having your own path cancel each other out? Conclusion — <strong>No.</strong>`,
    path_p2: `In Claude Code's words: "The former gives you a language. The latter lets you use that language to say something only you can say."`,
    path_p3: `VAE is the perfect example. When Kingma and Welling proposed VAE in 2013, autoencoders had been around for decades and variational inference was old news. Innovation wasn't inventing new concepts — it was <strong>welding two existing things together and saying "this connection is meaningful."</strong> Others looked at autoencoders and saw compression; they saw generation. Same thing, different perspective — that's innovation.`,
    path_p4: `So my current situation isn't contradictory: learning CS231n, running code, reading papers — accumulating "language"; writing journals, having my own judgments about aesthetics, being skeptical of "accuracy" — forming my own "perspective." Two things trained separately. Their intersection is originality.`,
    path_p5: `But Claude Code gave a warning that made me pause:`,
    path_blockquote: `The first step to "having your own thoughts" isn't building — it's discerning.`,
    path_p6: `In the age of information overload, what you think is "your own idea" is often <strong>an article you scrolled past last week, forgotten its source, but it grew roots in your cognition.</strong> Discerning which thoughts aren't yours — that's harder than it sounds.`,

    // ── Capability vs State ──
    h2_capability: "8. Capability vs. State: A Perspective I'd Never Considered",
    capability_p1: `At this point, Claude Code dropped a perspective I'd never thought about:`,
    capability_blockquote: `The most fundamental feature of the AGI era is that human value shifts entirely from "what you can do" to "who you are."`,
    capability_p2: `In the past, "I can write Python" was value. In the future, any AI can do that. But "I'm someone who, for some strange reason, really cares about the color distribution in VAE latent space" — <strong>that's value.</strong> It's not a capability. It's an <strong>orientation</strong> — the thing you choose to stare at, out of infinite possibilities.`,
    capability_p3: `AGI can help you do anything, but <strong>it doesn't know what's worth doing.</strong>`,
    capability_p4: `Following this thread, I realized: "truly knowing what you want" isn't a side attribute in the AGI era — it's a <strong>precious state</strong>. Claude Code said "state" is more accurate than "capability" —`,
    capability_bold: `Capabilities can be learned. States cannot.`,
    capability_p5: `Solving problems, writing code, publishing papers — obtainable with time. But "knowing what you want" can't be trained. It requires a different set of things: enough quiet to hear your own voice; enough honesty to distinguish "I truly want this" from "someone told me I should want this"; probably some setbacks, some wrong choices, some moments of looking back — because people often only start approaching "what do I actually want" after discovering "what I definitely don't want."`,
    capability_p6: `These things have no tutorials, no exams, no homework. But they are <strong>the result of practice</strong> — it's just that the practice doesn't happen in classrooms. Writing journals, repeatedly asking "what is accuracy," "what is good aesthetics," "what does it mean to walk my own path" — these questions are, in essence, <strong>continuously calibrating your own orientation</strong>, refusing to let your "wants" be eaten by the defaults.`,

    // ── Closing ──
    h2_closing: "9. Closing: The Hardest Thing Isn't Getting Smarter. It's Not Bullshitting Yourself.",
    closing_p1: `Put the two conversations side by side:`,
    closing_p2: `Codex saw <strong>the shift of scarcity</strong> — from capability shortage to desire uncertainty. Claude Code supplemented <strong>the persistence of boundaries</strong> — the physical world, attention, embodiment — these limits AGI can't touch, which makes "choosing" itself the scarcest act.`,
    closing_p3: `Codex listed <strong>three things to hold onto</strong> — insight, courage, aesthetics. Claude Code retranslated: it's not "mistakes = originality," but "taste × courage = creativity"; "aesthetic unconstrained by conditions" isn't a gift — it needs daily practice, stop and it degrades.`,
    closing_p4: `Codex said humans move from means to ends. Claude Code added: <strong>after becoming the ends, the hardest thing isn't getting smarter — it's not bullshitting yourself.</strong>`,
    closing_p5: `Because answers are everywhere, but questions are not. When everything can be generated, the most expensive thing isn't what you can generate — it's <strong>what you choose to generate, what you choose not to generate, and what you choose to spend your finite time on.</strong>`,
    closing_p6: `The AGI era isn't an era of answers. It's an <strong>era of choices.</strong> And the prerequisite for choosing is: you have to know who you are first.`,
    closing_p7: `So if you ask me what kind of person is most scarce in the AGI era — not the smartest. <strong>The person who refuses to bullshit themselves.</strong> The one who can still choose amid abundance, still commit to long-termism for something they care about, still ask themselves every day "what do I actually want" — and refuse to accept a lazy answer.`,
    closing_p8: `Writing this piece is part of that practice.`,
    closing_p9: `Late night, July 31, 2026.`,

    // ── Note ──
    h2_note: "Note",
    note_p1: `This article was originally recorded as an Obsidian note (<code>SecondBrain/3-Areas/关于AGI时代的思考.md</code>), compiled from two conversations with Codex and Claude Code on the same day. The blog version transforms the fragmented conversational style into a coherent article structure — all core arguments and logic remain intact.`,
    note_p2: `If you have your own thoughts on this topic, find me through the links on my homepage — I'm genuinely curious how different people answer: "In the AGI era, what do you most want to hold onto?"`,
  },
};

export default function AgiEraThoughtsPage() {
  const { lang } = useLang();
  const T = content[lang];

  return (
    <BlogPostLayout post={post}>
      {/* ── 开场 ── */}
      <h2 id="opening">{T.h2_opening}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.opening_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.opening_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.opening_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.opening_p4 }} />

      {/* ── 一、核心论点 ── */}
      <h2 id="thesis">{T.h2_thesis}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.thesis_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.thesis_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.thesis_p3 }} />
      <ul>
        <li dangerouslySetInnerHTML={{ __html: T.thesis_li1 }} />
        <li dangerouslySetInnerHTML={{ __html: T.thesis_li2 }} />
      </ul>
      <p dangerouslySetInnerHTML={{ __html: T.thesis_p4 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.thesis_blockquote }} />
      </blockquote>

      {/* ── 二、五个改变 ── */}
      <h2 id="changes">{T.h2_changes}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.changes_intro }} />
      <ol>
        <li dangerouslySetInnerHTML={{ __html: T.changes_1 }} />
        <li dangerouslySetInnerHTML={{ __html: T.changes_2 }} />
        <li dangerouslySetInnerHTML={{ __html: T.changes_3 }} />
        <li dangerouslySetInnerHTML={{ __html: T.changes_4 }} />
        <li dangerouslySetInnerHTML={{ __html: T.changes_5 }} />
      </ol>

      {/* ── 三、三样东西 ── */}
      <h2 id="three-things">{T.h2_three}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.three_intro }} />
      <ol>
        <li dangerouslySetInnerHTML={{ __html: T.three_1 }} />
        <li dangerouslySetInnerHTML={{ __html: T.three_2 }} />
        <li dangerouslySetInnerHTML={{ __html: T.three_3 }} />
      </ol>
      <p dangerouslySetInnerHTML={{ __html: T.three_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.three_p3 }} />

      {/* ── 四、时间线 ── */}
      <h2 id="timeline">{T.h2_timeline}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.timeline_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.timeline_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.timeline_p3 }} />

      {/* ── 五、Claude Code 修正 ── */}
      <h2 id="critique">{T.h2_critique}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.critique_p1 }} />

      <h3 id="physical">{T.h3_physical}</h3>
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
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.taste_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.taste_p4 }} />

      {/* ── 六、认知牢笼 ── */}
      <h2 id="cognition">{T.h2_cognition}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p4 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.cognition_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p5 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p6 }} />

      {/* ── 七、走自己的路 ── */}
      <h2 id="path">{T.h2_path}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.path_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p5 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.path_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.path_p6 }} />

      {/* ── 八、能力 vs 状态 ── */}
      <h2 id="capability">{T.h2_capability}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.capability_p1 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.capability_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.capability_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_bold }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p5 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p6 }} />

      {/* ── 九、收束 ── */}
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
          {lang === "zh"
            ? "点击查看原文 PDF（Obsidian 笔记导出）"
            : "View Original PDF (Exported from Obsidian)"}
        </a>
      </p>
      <p dangerouslySetInnerHTML={{ __html: T.note_p2 }} />
    </BlogPostLayout>
  );
}
