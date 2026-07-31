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
    opening_p1: `如果有一天，任何知识、任何技能、任何产出都能被 AI 即时生成——<strong>「你会做什么」就不再重要了。</strong>`,
    opening_p2: `2026 年 7 月 31 日深夜，我和 Codex 聊到了这个问题。`,
    opening_p3: `不是「AGI 什么时候来」那种技术预测。是更根本的东西：<strong>当一切都能被 AI 做掉，人还剩什么？</strong>`,
    opening_p4: `Codex 给了个漂亮的框架——「人类第一次从能力匮乏走进愿望匮乏。」我觉得有道理，又隐约觉得哪里不对。`,
    opening_p5: `于是我把整段对话贴给 Claude Code，让它逐条质疑。它没复读——从几个我完全没想到的角度撕开了这个框架，然后我们顺着往下挖。`,
    opening_p6: `这篇文章就是那场三方对话的记录。<strong>不是「AI 写的 AGI 预测」——是一个大一学生和两个 AI 一起，试图搞明白在这个一切都会被重做的时代里，人到底是什么。</strong>`,

    // ── 一、核心论点 ──
    h2_thesis: "一、核心论点：从「能力匮乏」到「愿望匮乏」",
    thesis_p1: `Codex 一句话说出了 AGI 时代最根本的改变：`,
    thesis_blockquote: `人类第一次从「能力的匮乏」走进「愿望的匮乏」。`,
    thesis_p2: `过去几万年，生活的默认设定一直是「不够」——资源不够、时间不够、能力不够、信息不够。人的大半心智都花在克服不足上：学习、竞争、计算、忍耐、规划。`,
    thesis_p3: `匮乏很苦，但它一直在偷偷扮演两个角色：`,
    thesis_li1: `<strong>动力</strong>——因为难，所以值得努力`,
    thesis_li2: `<strong>意义</strong>——因为别人做不到，所以我的「做到」有价值`,
    thesis_p4: `AGI 把这层地基抽走了。人类将在「什么都有」的状态下运行——而<strong>人类文明从来没有在充足里运行过</strong>。`,
    thesis_p5: `Codex 的收束：`,
    thesis_blockquote2: `人类从「手段」中被解放出来，然后被迫成为「目的」。以前问「怎么办」，以后只问「为什么」。`,

    // ── 二、五个改变 ──
    h2_changes: "二、会发生的五个具体改变",
    changes_intro: `顺着这个逻辑往下推——不是科幻，是推论：`,
    changes_1: `<strong>劳动与身份解耦。</strong>几千年来「你是谁」≈「你做什么」。学生、工程师、母亲——身份从劳作里长出来，时间结构、社会地位、自我价值都靠它支撑。当做事可以外包，身份失去默认锚点，「我是谁」变成每天要自己回答的问题。`,
    changes_2: `<strong>真实与虚构边界模糊。</strong>生成内容无限廉价后，「看到即真实」的默认设定失效。信任、可验证的痕迹、亲手做过的证据——不再天然存在，需要主动维护。`,
    changes_3: `<strong>关系成本改变。</strong>AI 无限耐心、随时理解、永远在场。和 AI 的关系比和人更容易——但「容易」不等于「值得」。亲密、孤独、成长的定义都会被重写。`,
    changes_4: `<strong>意义危机取代贫穷成为最大的社会问题。</strong>无聊会变成普遍疾病。以前「值得」由生存压力替你定义，以后——<strong>「值得」需要你自己生产。</strong>`,
    changes_5: `<strong>教育与科研规则变化。</strong>知识获取趋近零成本，学位作为信息门槛继续贬值。但「发现好问题」的能力比「解决难题」更值钱——模型能解题，<strong>定义题目依然是人。</strong>`,

    // ── 三、三样东西 ──
    h2_three: "三、人类要守住的三样东西",
    three_intro: `Codex 问我：「到那个时候，你最想守住的是什么？」`,
    three_p1: `我几乎是下意识答了三样：`,
    three_1: `<strong>独特的想法和见解</strong>——不来自数据，来自「活过」`,
    three_2: `<strong>不怕犯错的勇气</strong>——AI 被设计成尽量正确；人可以在重要的事情上犯错，错误是原创性的入口`,
    three_3: `<strong>独一无二、不被条件约束的审美</strong>——不被生存、市场、评价约束，同时主动抵抗 AI 平均美的下沉气流`,
    three_p2: `Codex 说这三样是同一件事的不同面：<strong>有主体性的人</strong>。`,
    three_p3: `共同点是不来自数据，来自「活过」。AI 见过无数风格——但它没被生活逼到墙角过，没在墙角里长出过东西。它能模拟勇敢——但它没真正害怕过什么，所以不知道「怕」的另一面是什么味道。`,
    three_p4: `更重要的是：这三样不是「保得住」的静态财产，而是<strong>会退化的能力</strong>。`,
    three_p5: `写日记、做项目、犯错、争论——这些日常动作就是练习。AGI 时代最大的风险不是「AI 夺走它们」，而是<strong>人因为太方便而不再练习</strong>。想要什么答案都有，慢慢就不想问自己的问题了。`,

    // ── 四、时间线 ──
    h2_timeline: "四、AGI 到底什么时候来？",
    timeline_p1: `先澄清一个误解：AGI 不会是一声令下「今天宣布降临」的事件。它是一条<strong>连续爬升的曲线</strong>。`,
    timeline_p2: `你现在用的 Codex、Claude Code、Cursor——放 2022 年就是科幻。但人适应得很快，三个月后就觉得「这算什么 AGI」。这种渐进式脱敏才是真正的变化模式。`,
    timeline_p3: `<strong>我们已经在这条曲线上了，只是感知有滞后。</strong>`,
    timeline_p4: `真正的分界不是「它能做什么」，而是<strong>它能不能自己设定目标并持续自我改进</strong>。在那之前，最合理的姿态就是在变化中保持自己的方向。`,

    // ── 五、Claude Code 修正 ──
    h2_critique: "五、Claude Code：这个框架哪里不对",
    critique_p1: `我把上面整段对话贴给 Claude Code。第一反应不是赞美——是质疑。`,

    h3_physical: "修正一：「什么都有」？物理世界不归 AGI 管",
    physical_p1: `Codex 的框架暗示 AGI 之后什么都有。Claude Code 直接说：<strong>这不是真的。</strong>`,
    physical_p2: `AGI 能给你无限的知识、代码、文本——但物理世界不归它管。你还是只有 24 小时一天，还是只有一个身体，还是只能同时出现在一个地方。你不可能同时吃 100 顿饭、谈 100 段恋爱、爬 100 座山。`,
    physical_p3: `所以「稀缺」没消失——只是换了层皮。从<strong>能力的稀缺</strong>变成<strong>注意力的稀缺</strong>和<strong>身体的稀缺</strong>。你永远只能体验有限的人生——这个限制比「能力不够」更根本，是<strong>存在本身的边界</strong>，AGI 动不了它。`,
    physical_p4: `这意味着 AGI 时代的核心问题不是「什么都有了我还要什么」。而是——`,
    physical_blockquote: `选项无限多，但我只能挑极其有限的一部分来活。稀缺从「做不到」变成了「选不过来」。`,
    physical_p5: `两种完全不同性质的问题。`,

    h3_meaning: "修正二：「世界替你决定什么是重要的」——不对",
    meaning_p1: `Codex 说以前是世界的限制替你决定什么叫重要——努力是因为不努力就没饭吃，学习是因为考试，竞争是因为资源有限。`,
    meaning_p2: `Claude Code 的回应很直接：`,
    meaning_blockquote: `世界给你的从来都是约束条件，不是意义。`,
    meaning_p3: `你转专业学 CS、想发顶会论文、写日记追问「准确是什么」——哪一件是「世界替你决定的」？`,
    meaning_p4: `意义从来都要自己找。只是以前很多人忙到没时间想。AGI 没改变「意义需要自己找」这个事实——它只是<strong>让更多人没法再假装这个问题不存在</strong>。是一个被推迟了很久的老问题，终于找上门了。`,

    h3_taste: "修正三：犯错不是壁垒，品味才是",
    taste_p1: `Codex 说「AI 不敢犯错，人敢犯错所以人有原创性」——好听，但太浪漫了。`,
    taste_p2: `实际上 AI 当然能「犯错」。扩散模型加噪再去噪，每一步都是「错」的。让它生成不存在的动物，毫无压力。`,
    taste_p3: `创造力不是「犯错」的能力，而是<strong>知道哪个错值得犯</strong>的判断力。Codex 自己在别处也说了——「在无限多的可能里选出值得的那个」——但它把「犯错」和「选择」拆成了两个论点。其实是一件事：`,
    taste_blockquote: `创造力 = 品味 × 勇气。人真正的壁垒不是生成能力，是品味。`,
    taste_p4: `人不是因为「敢错」而有原创性——是因为<strong>有判断力决定什么值得去错</strong>。`,

    // ── 六、认知牢笼 ──
    h2_cognition: "六、认知的牢笼：你抄的是答案，不是出答案的人",
    cognition_p1: `在 Claude Code 的质疑之后，我提了一个自己的观察：`,
    cognition_blockquote: `人无法认知高于自己认知以上的事物。`,
    cognition_p2: `普通人可以通过社交媒体看到富人的生活——但永远不会真正理解。因为<strong>你没活过「钱不是问题」的状态</strong>。你对那种生活的所有想象，都只是自己现有欲望的放大版，不是那个人真正的困扰和快乐。`,
    cognition_p3: `这跟智商无关，跟体验有关：<strong>你没活过，就不知道。</strong>`,
    cognition_p4: `审美同理。设计师抄苹果极简——抄到的是<strong>结果</strong>，不是<strong>那个结果怎么长出来的</strong>。他不知道苹果内部为砍一个按钮吵了多少次架，不知道 Jony Ive 在设计学校被折磨了几年才形成那种审美直觉，不知道「简洁」背后有多少次「做复杂了然后删掉」。`,
    cognition_p5: `所以他永远跟在后面。不是不想创新——是<strong>不知道创新从哪来。</strong>`,
    cognition_p6: `但 Claude Code 在这里补了一个反直觉的推论：`,
    cognition_blockquote2: `不知道「正确答案」，有时候反而是优势。`,
    cognition_p7: `我现在是大一学生——不会像 OpenAI 研究员那样「知道这不能做」，所以可能会试试。审美还没被行业「规范」过，所以可能会觉得某些东西好看——而那个东西恰好可能是新的。`,
    cognition_p8: `年轻人的创新窗口不在「更聪明」，在<strong>认知约束跟大厂不一样</strong>。局限，恰好可能是差异。`,

    // ── 七、走自己的路 ──
    h2_path: "七、学习前人 vs 走自己的路：不矛盾",
    path_p1: `我追问了自己：学前人成果和走自己的路，是不是互相抵消？`,
    path_p2: `结论——<strong>不是。</strong>`,
    path_blockquote: `前者给你语言，后者让你用这个语言说出只有你能说的话。`,
    path_p3: `VAE 就是最好的例子。2013 年 Kingma 和 Welling 提出 VAE 的时候，自动编码器已经用了几十年，变分推断也是老东西。创新不是发明新概念——是<strong>把两个已有的东西焊在一起，说「这个连接有意义」</strong>。`,
    path_p4: `别人看自动编码器看到压缩，他们看到生成。别人看变分推断看到数学技巧，他们看到概率建模。<strong>同一个东西，不同视角——这就是创新。</strong>`,
    path_p5: `所以我现在的处境不矛盾：学 CS231n、跑代码、看论文——积累「语言」。写日记、对审美有自己的判断、对「准确无误」持怀疑——形成「视角」。两件事各练各的，交点就是原创性。`,
    path_p6: `但 Claude Code 给了一个让我停了很久的警告：`,
    path_blockquote2: `「有自己的想法」的第一步，不是构建，是辨别。`,
    path_p7: `在信息过载的时代，你以为的「自己的想法」——很多时候不过是<strong>上周刷到的某篇文章，忘了来源，却在认知里生了根。</strong>辨别哪些想法不是你自己的，比想象中难得多。`,

    // ── 八、能力 vs 状态 ──
    h2_capability: "八、能力 vs 状态：从未想过的角度",
    capability_p1: `到这里，Claude Code 抛出了一个我完全没想过的角度：`,
    capability_blockquote: `AGI 时代最根本的特征，是人的价值从「会什么」彻底转移到「你是谁」。`,
    capability_p2: `过去「我会写 Python」是价值。以后任何一个 AI 都会。`,
    capability_p3: `但<strong>「我是一个因为某个奇怪原因特别在意 VAE latent space 颜色分布的人」</strong>——这才是价值。它不是能力，是<strong>取向</strong>。是在无限多的可能性里，自己选择盯着什么看。`,
    capability_p4: `AGI 可以帮你做任何事。但<strong>它不知道什么事值得做。</strong>`,
    capability_p5: `顺着这个往下：让人真正明白自己想要什么——在 AGI 时代不是附带属性，而是一种<strong>宝贵的状态</strong>。`,
    capability_p6: `Claude Code 说「状态」比「能力」准确——`,
    capability_bold: `能力可以学。状态不是。`,
    capability_p7: `做题、写代码、发论文——花时间就能获得。但「知道自己想要什么」没法训练。它需要足够安静才听得到自己的声音，足够诚实才能区分「我真的想要」和「别人告诉我该想要」。`,
    capability_p8: `可能还需要一些挫败、一些错误选择、一些回头看的时刻——因为人往往是在<strong>「发现不想要什么」之后，才开始逼近「真正想要什么」</strong>。`,
    capability_p9: `这些东西没有教程，不考试，没有作业。但它们是<strong>练习的结果</strong>——只是练习不发生在课堂上。`,
    capability_p10: `写日记、追问「什么是准的」「什么是好的审美」「什么是走自己的路」——这些本质上是在<strong>持续校准自己的取向</strong>，不让「想要」被默认值吃掉。`,

    // ── 九、收束 ──
    h2_closing: "九、收束：最难的不是变聪明，是不糊弄自己",
    closing_p1: `Codex 看到了<strong>匮乏的转移</strong>——从能力不够变成愿望不确定。Claude Code 补充了<strong>边界的持久</strong>——物理世界、注意力、身体，这些 AGI 动不了，所以「选择」本身变成了最稀缺的行为。`,
    closing_p2: `Codex 列了<strong>三样要守住的东西</strong>——见解、勇气、审美。Claude Code 重新翻译了一遍：不是「犯错 = 原创」，而是「品味 × 勇气 = 创造力」；「不被条件约束的审美」不是天赋，是每天练习、不练就退化的能力。`,
    closing_p3: `Codex 说人类从手段变成目的。Claude Code 加了一句：`,
    closing_blockquote: `变成目的之后，最难的不是变聪明——是不糊弄自己。`,
    closing_p4: `因为在 AGI 时代，答案唾手可得。但问题不是。`,
    closing_p5: `当一切都能被生成，最贵的不是你能生成什么——而是<strong>你选择生成什么、选择不生成什么、选择为什么而花掉有限的时间。</strong>`,
    closing_p6: `AGI 时代不是答案时代。是<strong>选择时代。</strong>`,
    closing_p7: `而选择的前提是：你得先知道自己是谁。`,
    closing_p8: `所以如果你问我 AGI 时代什么样的人最稀缺——不是最聪明的人。<strong>是最不含糊的人。</strong>那些在充足里仍然能选择、仍然愿意为一件事付出长期主义、仍然每天都问自己「我到底想要什么」——并且不糊弄答案的人。`,
    closing_p9: `写这篇东西本身，也是这个练习的一部分。`,
    closing_p10: `2026 年 7 月 31 日，深夜。`,

    // ── 附注 ──
    h2_note: "附注",
    note_p1: `这篇文章最早以 Obsidian 笔记形式记录（<code>SecondBrain/3-Areas/关于AGI时代的思考.md</code>），是当天与 Codex 和 Claude Code 两段对话的整理。博客版本将碎片化的对话体重新组织为连贯结构，核心论点与逻辑全部保留。`,
    note_p2: `如果你对这个话题有自己的想法，欢迎通过主页的链接找到我——我很好奇不同的人对「AGI 时代你最想守住什么」这个问题的答案。`,
  },

  en: {
    h2_opening: "Have You Ever Wondered—",
    opening_p1: `What if one day, any knowledge, any skill, any output could be instantly generated by AI — then <strong>"what you can do" would no longer matter.</strong>`,
    opening_p2: `Late night, July 31, 2026. I was chatting with Codex.`,
    opening_p3: `Not the "when will AGI arrive" kind of prediction. Something more fundamental: <strong>when AI can do everything, what's left for humans?</strong>`,
    opening_p4: `Codex gave a beautiful framework — "for the first time, humanity moves from scarcity of capability to scarcity of desire." It resonated, but something felt off.`,
    opening_p5: `So I pasted the entire conversation into Claude Code and asked it to critique point by point. It didn't echo — it tore the framework open from angles I'd never considered, and we dug deeper.`,
    opening_p6: `This article is the record of that three-way conversation. <strong>Not an "AI-generated AGI prediction" — it's a freshman and two AIs, trying to figure out what a human being is in an era where everything can be remade.</strong>`,

    h2_thesis: "1. The Core Thesis: From Capability Scarcity to Desire Scarcity",
    thesis_p1: `Codex on the most fundamental change of the AGI era, in one sentence:`,
    thesis_blockquote: `For the first time, humanity moves from "scarcity of capability" to "scarcity of desire."`,
    thesis_p2: `For tens of thousands of years, the default setting of life was "not enough." Not enough resources, time, ability, information. Most of human cognition spent overcoming insufficiency: learning, competing, calculating, enduring, planning.`,
    thesis_p3: `Scarcity looked like a curse, but played two hidden roles:`,
    thesis_li1: `<strong>Motivation</strong> — because it was hard, it was worth the effort`,
    thesis_li2: `<strong>Meaning</strong> — because others couldn't do it, your doing it had value`,
    thesis_p4: `AGI pulls out this foundation. Humanity would operate in "having everything" — and <strong>human civilization has never run on abundance.</strong>`,
    thesis_p5: `Codex's closing:`,
    thesis_blockquote2: `Humans are liberated from "means" and forced to become "ends." We used to ask "how"; from now on, we only ask "why."`,

    h2_changes: "2. Five Concrete Changes",
    changes_intro: `Following the logic — not science fiction, but extrapolation:`,
    changes_1: `<strong>Labor and identity decouple.</strong> For millennia, "who you are" ≈ "what you do." Student, engineer, mother — identity grew from labor. When work can be outsourced, identity loses its anchor. "Who am I" becomes a question you answer yourself, every day.`,
    changes_2: `<strong>Real and fake blur.</strong> When generated content is infinitely cheap, "seeing is believing" collapses. Trust, verifiable traces, evidence of things you've actually done — no longer defaults, but things you actively maintain.`,
    changes_3: `<strong>Relationships change cost.</strong> AI has infinite patience, always understands, always present. Relationships with AI become easier than with people — but "easy" isn't "worthy." Intimacy, loneliness, and growth get redefined.`,
    changes_4: `<strong>Meaning crisis replaces poverty.</strong> Boredom becomes universal. Before, "worth it" was defined by survival pressure. After — <strong>you have to produce your own "worth it."</strong>`,
    changes_5: `<strong>Education and research change.</strong> Knowledge approaches zero cost. Degrees devalue as information barriers. But "finding good questions" becomes more valuable than "solving hard problems" — models can solve, <strong>defining the problem still belongs to humans.</strong>`,

    h2_three: "3. Three Things Humans Must Hold Onto",
    three_intro: `Codex asked: "When that time comes, what do you most want to hold onto?"`,
    three_p1: `I answered almost reflexively:`,
    three_1: `<strong>Unique ideas and insights</strong> — not from data, from "having lived"`,
    three_2: `<strong>The courage to make mistakes</strong> — AI is designed to be correct; humans can make mistakes on things that matter, and mistakes are the doorway to originality`,
    three_3: `<strong>A unique aesthetic, unconstrained by conditions</strong> — unbound by survival, market, or evaluation; actively resisting AI's downward current of averaged beauty`,
    three_p2: `Codex: these three are facets of one thing — <strong>a person with subjectivity.</strong>`,
    three_p3: `Their common trait: not from data, but from "having lived." AI has seen countless styles — but it's never been cornered by life, never grown something from that corner. It can simulate bravery — but it's never truly feared anything, so it doesn't know the other side.`,
    three_p4: `More importantly: these aren't static assets you "keep" — they're <strong>abilities that degrade.</strong>`,
    three_p5: `Journaling, building, making mistakes, arguing — everyday practice. The real risk of the AGI era isn't "AI taking them." It's <strong>humans stopping the practice because it's too convenient.</strong> When every answer is at your fingertips, you slowly stop asking your own questions.`,

    h2_timeline: "4. When Is AGI Actually Coming?",
    timeline_p1: `First, clear a misconception: AGI won't be an "announced today" event. It's a <strong>continuously climbing curve.</strong>`,
    timeline_p2: `Codex, Claude Code, Cursor — by 2022 standards, science fiction. But humans adapt fast. Three months later: "that's not AGI." Gradual desensitization is the real pattern.`,
    timeline_p3: `<strong>We're already on the curve. We just lag in perception.</strong>`,
    timeline_p4: `The real dividing line isn't "what it can do" — it's <strong>whether it can set its own goals and continuously self-improve.</strong> Until then: keep your direction amidst the change.`,

    h2_critique: "5. Claude Code: What's Wrong With This Framework",
    critique_p1: `I pasted the conversation into Claude Code. First reaction: not praise — skepticism.`,

    h3_physical: `Correction 1: "Having Everything"? The Physical World Doesn't Answer to AGI`,
    physical_p1: `Codex's framework implies AGI gives us everything. Claude Code: <strong>That's not true.</strong>`,
    physical_p2: `AGI gives you infinite knowledge, code, text — but the physical world isn't under its jurisdiction. Still 24 hours a day. One body. One place at a time. Can't eat 100 meals, have 100 relationships, climb 100 mountains simultaneously.`,
    physical_p3: `So "scarcity" hasn't disappeared — just changed form. From <strong>scarcity of capability</strong> to <strong>scarcity of attention</strong> and <strong>scarcity of embodiment.</strong> You can only ever experience a finite life — more fundamental than "not capable enough." <strong>The boundary of existence itself.</strong> AGI can't touch it.`,
    physical_p4: `The core question isn't "I have everything, now what?" It's:`,
    physical_blockquote: `Infinite options, but I can only live an extremely finite subset. Scarcity shifts from "can't do it" to "can't choose it all."`,
    physical_p5: `Fundamentally different problems.`,

    h3_meaning: `Correction 2: "The World Decided What Matters" — No, It Didn't`,
    meaning_p1: `Codex: the world's constraints decided what was important — you worked because you'd starve, studied for exams, competed for limited resources.`,
    meaning_p2: `Claude Code, blunt:`,
    meaning_blockquote: `What the world gave you was always constraints, not meaning.`,
    meaning_p3: `Switching majors to CS, wanting to publish at top conferences, journaling to ask "what does accuracy mean?" — which of these was "the world deciding for you"?`,
    meaning_p4: `Meaning has always been self-made. Before, people were too busy surviving to think about it. AGI didn't change that fact — it just <strong>made it harder for more people to pretend the question doesn't exist.</strong> An old problem, postponed so long it's finally knocking.`,

    h3_taste: "Correction 3: Mistakes Aren't the Moat. Taste Is.",
    taste_p1: `Codex: "AI doesn't dare to make mistakes, humans do, so humans have originality" — sounds good. Too romantic.`,
    taste_p2: `AI can absolutely "make mistakes." Diffusion models add noise and denoise — every step is a "mistake." Generate a non-existent animal? No problem.`,
    taste_p3: `Creativity isn't "making mistakes" — it's <strong>knowing which mistakes are worth making.</strong> Codex said it elsewhere: "selecting the worthy from infinite possibilities." But it split "mistakes" and "choosing" into two arguments. They're one thing:`,
    taste_blockquote: `Creativity = Taste × Courage. Humanity's real moat isn't generative capability. It's taste.`,
    taste_p4: `Humans aren't original because they "dare to be wrong" — they're original because <strong>they have the judgment to decide what's worth being wrong about.</strong>`,

    h2_cognition: "6. The Cognitive Prison: Copying the Answer, Not the Person",
    cognition_p1: `After Claude Code's critique, my own observation:`,
    cognition_blockquote: `Humans cannot cognize things above their own level of cognition.`,
    cognition_p2: `Ordinary people see rich lives on social media — but never truly understand. Because <strong>you've never lived "money isn't a problem."</strong> All imaginings are amplified versions of current desires, not that person's actual troubles and joys.`,
    cognition_p3: `Nothing to do with IQ. Everything to do with experience: <strong>if you haven't lived it, you don't know it.</strong>`,
    cognition_p4: `Aesthetics follow the same logic. A designer copying Apple's minimalism is copying the <strong>result</strong>, not <strong>how that result grew.</strong> They don't know the fights over a single button, the years Jony Ive spent in design school, the rounds of "make it complex, then delete" behind that "simplicity."`,
    cognition_p5: `So they'll always follow. Not unwilling to innovate — <strong>don't know where innovation comes from.</strong>`,
    cognition_p6: `But Claude Code added a counterintuitive corollary:`,
    cognition_blockquote2: `Not knowing the "right answer" can sometimes be an advantage.`,
    cognition_p7: `I'm a freshman — I won't, like an OpenAI researcher, "know this can't be done," so I might try. My aesthetic isn't "standardized" yet, so I might find something beautiful that's actually new.`,
    cognition_p8: `The innovation window for young people isn't "being smarter." It's <strong>having different cognitive constraints than big companies.</strong> Limitations, exactly differentiation.`,

    h2_path: "7. Learning From Predecessors vs. Your Own Path",
    path_p1: `I pushed myself: do learning from predecessors and having your own path cancel out?`,
    path_p2: `Conclusion — <strong>No.</strong>`,
    path_blockquote: `The former gives you a language. The latter lets you use that language to say something only you can say.`,
    path_p3: `VAE is the example. When Kingma and Welling proposed VAE in 2013, autoencoders had been around for decades, variational inference was old news. Innovation wasn't inventing concepts — it was <strong>welding two existing things together and saying "this connection is meaningful."</strong>`,
    path_p4: `Others saw compression; they saw generation. Others saw a math trick; they saw probabilistic modeling. <strong>Same thing, different perspective — that's innovation.</strong>`,
    path_p5: `So my situation isn't contradictory: CS231n, running code, reading papers — accumulating "language." Journaling, aesthetic judgments, skepticism of "accuracy" — forming "perspective." Trained separately. Their intersection is originality.`,
    path_p6: `But Claude Code gave a warning that stopped me:`,
    path_blockquote2: `The first step to "having your own thoughts" isn't building — it's discerning.`,
    path_p7: `In information overload, what you think is "your idea" — often <strong>an article you scrolled past last week, source forgotten, roots grown in your cognition.</strong> Discerning which thoughts aren't yours — harder than it sounds.`,

    h2_capability: "8. Capability vs. State: A New Perspective",
    capability_p1: `Then Claude Code dropped something I'd never considered:`,
    capability_blockquote: `The most fundamental feature of the AGI era: human value shifts entirely from "what you can do" to "who you are."`,
    capability_p2: `Past: "I can write Python" was value. Future: any AI can.`,
    capability_p3: `But <strong>"I'm someone who, for some strange reason, really cares about the color distribution in VAE latent space"</strong> — that's value. Not capability. <strong>Orientation.</strong> What you choose to stare at, out of infinite possibilities.`,
    capability_p4: `AGI can help you do anything. <strong>It doesn't know what's worth doing.</strong>`,
    capability_p5: `Following this: truly knowing what you want isn't a side attribute in the AGI era — it's a <strong>precious state.</strong>`,
    capability_p6: `Claude Code: "state" is more accurate than "capability" —`,
    capability_bold: `Capabilities can be learned. States cannot.`,
    capability_p7: `Solving problems, writing code, publishing papers — obtainable with time. But "knowing what you want" can't be trained. It requires enough quiet to hear your own voice; enough honesty to distinguish "I truly want this" from "someone told me I should."`,
    capability_p8: `Probably some setbacks, wrong choices, moments of looking back — because people start approaching "what I actually want" only after <strong>discovering "what I definitely don't want."</strong>`,
    capability_p9: `No tutorials, no exams, no homework. But <strong>the result of practice</strong> — just practice that doesn't happen in classrooms.`,
    capability_p10: `Journaling, asking "what is accuracy," "what is good aesthetics," "what does it mean to walk my own path" — these are, in essence, <strong>continuously calibrating your own orientation,</strong> refusing to let your "wants" be eaten by defaults.`,

    h2_closing: "9. Closing: The Hardest Thing Isn't Getting Smarter",
    closing_p1: `Codex saw <strong>the shift of scarcity</strong> — from capability shortage to desire uncertainty. Claude Code added <strong>the persistence of boundaries</strong> — physical world, attention, embodiment, limits AGI can't touch, making "choosing" the scarcest act.`,
    closing_p2: `Codex listed <strong>three things to hold onto</strong> — insight, courage, aesthetics. Claude Code retranslated: not "mistakes = originality," but "taste × courage = creativity"; "unconditioned aesthetic" isn't a gift — it needs daily practice or it degrades.`,
    closing_p3: `Codex: humans move from means to ends. Claude Code added:`,
    closing_blockquote: `After becoming the ends, the hardest thing isn't getting smarter — it's not bullshitting yourself.`,
    closing_p4: `Because in the AGI era, answers are everywhere. But questions are not.`,
    closing_p5: `When everything can be generated, the most expensive thing isn't what you generate — it's <strong>what you choose to generate, what you choose not to, and what you choose to spend your finite time on.</strong>`,
    closing_p6: `The AGI era isn't an era of answers. It's an <strong>era of choices.</strong>`,
    closing_p7: `And the prerequisite for choosing: you have to know who you are first.`,
    closing_p8: `So the scarcest kind of person in the AGI era? Not the smartest. <strong>The one who refuses to bullshit themselves.</strong> The one who can still choose amid abundance, still commit to long-termism, still ask every day "what do I actually want" — and refuse a lazy answer.`,
    closing_p9: `Writing this piece is part of that practice.`,
    closing_p10: `Late night, July 31, 2026.`,

    h2_note: "Note",
    note_p1: `Originally recorded as an Obsidian note (<code>SecondBrain/3-Areas/关于AGI时代的思考.md</code>), compiled from two conversations with Codex and Claude Code. The blog version reorganizes fragmented dialogue into a coherent structure — core arguments remain intact.`,
    note_p2: `If you have your own thoughts, find me through the homepage links. I'm curious how different people answer: "In the AGI era, what do you most want to hold onto?"`,
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
      <p dangerouslySetInnerHTML={{ __html: T.opening_p5 }} />
      <p dangerouslySetInnerHTML={{ __html: T.opening_p6 }} />

      <hr />

      {/* ── 一、核心论点 ── */}
      <h2 id="thesis">{T.h2_thesis}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.thesis_p1 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.thesis_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.thesis_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.thesis_p3 }} />
      <ul>
        <li dangerouslySetInnerHTML={{ __html: T.thesis_li1 }} />
        <li dangerouslySetInnerHTML={{ __html: T.thesis_li2 }} />
      </ul>
      <p dangerouslySetInnerHTML={{ __html: T.thesis_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.thesis_p5 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.thesis_blockquote2 }} />
      </blockquote>

      <hr />

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

      <hr />

      {/* ── 三、三样东西 ── */}
      <h2 id="three-things">{T.h2_three}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.three_intro }} />
      <p dangerouslySetInnerHTML={{ __html: T.three_p1 }} />
      <ol>
        <li dangerouslySetInnerHTML={{ __html: T.three_1 }} />
        <li dangerouslySetInnerHTML={{ __html: T.three_2 }} />
        <li dangerouslySetInnerHTML={{ __html: T.three_3 }} />
      </ol>
      <p dangerouslySetInnerHTML={{ __html: T.three_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.three_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.three_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.three_p5 }} />

      <hr />

      {/* ── 四、时间线 ── */}
      <h2 id="timeline">{T.h2_timeline}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.timeline_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.timeline_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.timeline_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.timeline_p4 }} />

      <hr />

      {/* ── 五、Claude Code 修正 ── */}
      <h2 id="critique">{T.h2_critique}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.critique_p1 }} />

      <h3 id="physical">{T.h3_physical}</h3>
      <p dangerouslySetInnerHTML={{ __html: T.physical_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.physical_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.physical_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.physical_p4 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.physical_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.physical_p5 }} />

      <h3 id="meaning">{T.h3_meaning}</h3>
      <p dangerouslySetInnerHTML={{ __html: T.meaning_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.meaning_p2 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.meaning_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.meaning_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.meaning_p4 }} />

      <h3 id="taste">{T.h3_taste}</h3>
      <p dangerouslySetInnerHTML={{ __html: T.taste_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.taste_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.taste_p3 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.taste_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.taste_p4 }} />

      <hr />

      {/* ── 六、认知牢笼 ── */}
      <h2 id="cognition">{T.h2_cognition}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p1 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.cognition_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p5 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p6 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.cognition_blockquote2 }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p7 }} />
      <p dangerouslySetInnerHTML={{ __html: T.cognition_p8 }} />

      <hr />

      {/* ── 七、走自己的路 ── */}
      <h2 id="path">{T.h2_path}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.path_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p2 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.path_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.path_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p5 }} />
      <p dangerouslySetInnerHTML={{ __html: T.path_p6 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.path_blockquote2 }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.path_p7 }} />

      <hr />

      {/* ── 八、能力 vs 状态 ── */}
      <h2 id="capability">{T.h2_capability}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.capability_p1 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.capability_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.capability_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p3 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p5 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p6 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_bold }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p7 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p8 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p9 }} />
      <p dangerouslySetInnerHTML={{ __html: T.capability_p10 }} />

      <hr />

      {/* ── 九、收束 ── */}
      <h2 id="closing">{T.h2_closing}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.closing_p1 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p2 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p3 }} />
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: T.closing_blockquote }} />
      </blockquote>
      <p dangerouslySetInnerHTML={{ __html: T.closing_p4 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p5 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p6 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p7 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p8 }} />
      <p dangerouslySetInnerHTML={{ __html: T.closing_p9 }} />
      <p className="text-zinc-400 dark:text-zinc-500 italic">{T.closing_p10}</p>

      {/* ── 附注 ── */}
      <h2 id="note">{T.h2_note}</h2>
      <p dangerouslySetInnerHTML={{ __html: T.note_p1 }} />
      <p>
        <a
          href={`${BASE_PATH}/agi-era-thoughts.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {lang === "zh" ? "查看原文 PDF（Obsidian 导出）" : "View Original PDF (Obsidian Export)"}
        </a>
      </p>
      <p dangerouslySetInnerHTML={{ __html: T.note_p2 }} />
    </BlogPostLayout>
  );
}
