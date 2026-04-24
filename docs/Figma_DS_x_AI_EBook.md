# How design systems power the new pace of product development

---

## Table of Contents

- [Introduction](#introduction) — 03
- [Making your design system AI-ready](#making-your-design-system-ai-ready) — 07
- [Setting your design system up for scale](#setting-your-design-system-up-for-scale) — 18
- [Pushing teams further (and skills for what's next)](#pushing-teams-further-and-skills-for-whats-next) — 23

---

## Introduction

In the age of AI, design systems are a context coefficient—the clearer and more complete a system is, the more likely AI is to produce on-brand results. Here, Figma leaders and practitioners share how to harness the power of design systems to meet the moment, and the skills teams will need to keep moving forward.

AI is changing who builds products and how they're built. Historically, the product development process has been defined by clear roles and responsibilities and linear handoffs from one team to another. Today, AI is collapsing that sequence, leading to faster building and a blurring of boundaries between product, design, and engineering. While this acceleration is powerful, it also introduces new risk. As more people take part in design and increasingly bring AI tools into the product development process, work can start to lose the qualities that make it feel both recognizable and distinct.

All of this creates a renewed sense of urgency around design systems. With these systems, teams can codify their taste and craft, extending thoughtfully designed principles and guidelines to any new idea or surface they set out to explore. "[Design systems] help make sure we don't all end up shipping the same generic UIs cobbled together from the same pool of AI-generated parts," says Ana Boyer, Figma designer advocate. "As more companies adopt AI tools in their product development stacks, design systems will increasingly become the connective tissue that guides these tools toward better outcomes."

> **56%** of non-designers are participating frequently in at least one design-centric task, according to recent Figma research.

Hear from Figma leaders and practitioners about how to approach these shifts, including practical advice for building systems ready for the AI era and developing skills to prepare for what's next.

### Navigating a new era of collaboration

"The whole product development process used to start at the beginning and it was very linear," says Figma Vice President of Product Paige Costello. "Now, you can start in the middle then go back to the beginning, or start at the end then go back to the middle. The whole lifecycle has both collapsed and shifted in terms of where you can start."

With AI driving this shift, work moves faster and across more roles. PMs, designers, and developers now work side by side in shared tools, moving fluidly between strategy, design, and implementation. Marketers, engineers, and PMs are also working directly in design tools, giving feedback and creating quick prototypes to express ideas. According to recent Figma research, 55% of product builders are taking on new tasks that fall outside of their usual scope.

> "Instead of discouraging contributions from PMs or other non-designers who want to design, what if we welcomed them into the process? Designers can even empower these collaborators by sharing their quality standards and sense of taste. Design systems—which codify these standards and taste—play a crucial role in making this possible."
> —**Yuhki Yamashita, Chief Product Officer at Figma**

Across disciplines, there's a shift in the day-to-day work of designers, developers, and product managers:

- **Designers** are refining ideas with real components, using live systems instead of static mockups to show how layouts behave in production.
- **Developers** are influencing design earlier, weighing in on component logic, accessibility, and feasibility as ideas take shape.
- **Product managers** are using AI to visualize concepts, prompting rough prototypes that make ideas tangible for the team.

---

## Making your design system AI-ready

> "What many designers and developers can infer just from understanding the brand and the business as a whole, AI doesn't inherently know."
> —**Zoe Adelman**, Product Manager, Figma

"You and your team already have a point of view on what good looks like," Paige says. "The future of who can build the fastest, highest-quality experiences depends on collecting and organizing this context and point of view in one place and knitting it together."

Organizing this context raises a new requirement for how systems are built and maintained: They need to encode the kind of context that AI can't infer on its own. "Authors should be prioritizing getting as much context into the system as possible," says Zoe Adelman, product manager at Figma. "What many designers and developers can infer just from understanding the brand and the business as a whole, AI doesn't inherently know."

Details that once felt optional—clear usage guidelines, complete documentation, and explicit links between design and code—become essential for keeping outputs on-brand and production-ready. "If we really want to maximize the power of AI in product development, we need to give it the same knowledge our best people have," Figma product manager Yarden Katz. "The model needs to understand how we work, what we value, and what makes our product distinct. The results should feel native to us."

### AI as a new consumer

Historically, designers were the primary consumers of design systems, and developers relied on those systems to implement UI consistently. Today, that relationship is evolving. "We're seeing a shift where AI also becomes a consumer of the design system and designers and developers increasingly work with what AI produces," says Zoe.

As AI begins to interact directly with design systems, the idea of fluency is changing. Instead of designers and developers applying the system's rules themselves, they're learning to guide AI in doing so through prompts and structured context. For design systems teams, the focus shifts from driving adoption and enforcement to ensuring the system is complete, interpretable, and ready for both people and AI to use effectively.

### Building on your foundations

Crafting design systems for AI consumption doesn't mean starting from scratch. The same foundations still apply—variables, styles, and components form the logic that keeps your system coherent and give AI the structure it needs to build accurately. "Think about how you would approach design systems before AI," Ana advises. "What are the absolute things you want to make consistent and feel you need to document?" This means fine-tuning what's already in place so that any gaps designers and developers often fill with unspoken context don't leave AI guessing.

### Investing in structure

The clearer your system's structure, the easier it is for both AI and product builders to read and reuse it accurately. Design systems are built around modular components like buttons, inputs, and icons, but those smaller pieces can be difficult for AI tools to compose into coherent layouts on their own. Adding higher-order compositions—blocks and patterns that capture layout, color, and spacing logic—gives AI the context it needs to generate those interfaces.

That same clarity should extend to how you organize your system. Consistent file structures and naming conventions make it easier for both product builders and AI tools to interpret layouts accurately and reuse components with confidence. "Design decisions like how interface building blocks are defined, how components are wired, and how they're used represent the DNA of how a product is built and understood," says Wayne Sun, Figma product designer. "There's a lot of buried treasure there. When models can tap into that structure, they can generate interfaces that align with the system out of the box."

#### To structure your system for clarity and reuse:

- **Add larger, reusable blocks.** Extend your existing system with blocks like headers, cards, or carousels that AI can draw from when generating layouts.
- **Design for stackability.** Structure these blocks so they work together cohesively, making it easier for AI tools (and teams) to combine them into complete, coherent layouts.
- **Clarify relationships between components.** Define how elements like spacing and nesting connect so AI can accurately interpret their structure.
- **Preserve logic through tokens and metadata.** Keep tokens and variables tightly linked to component behavior so AI has reliable cues for spacing, color, and typography.
- **Organize files and naming consistently.** Use predictable hierarchies and clear naming to help collaborators understand how elements relate and reuse them correctly.

For example, instead of structuring your system around separate components like buttons, text fields, and image containers, create a reusable "card" block where those elements are already grouped with defined spacing, color, and typography tokens. When an AI-powered tool references your design system, it can reuse that complete block consistently across layouts rather than guessing how individual elements should fit together.

### Bridging design and code

The design-to-code gap is where details can get lost in translation, leading to misalignment and rework. "Designers and engineers consume components differently," Wayne says. "This means that even when both sides are using the same building blocks, they're not speaking the same language. A lot of hours go into translating between design and code."

When AI understands how design and code relate, it can start to change that equation. Today, that looks like linking design components to their code counterparts through tools like Code Connect, structuring tokens and variables so they're machine-readable, and using design systems as the shared framework that defines those relationships.

> Figma Make will soon make it possible for teams to prototype with their design system components through React code imports from public or private npm packages, making it easier to build and experiment with AI using real system components.

### Clarifying implementation logic

Even with those connections in place, gaps often remain. Much of the work comes down to closing those remaining gaps between design and development. "You might have some components in Figma Design that you've never hooked up to code, even though there's an actual valid component in your code repository for it somewhere," Zoe says. A component that exists only in design might look fine in an AI-generated mockup but miss accessibility features or expected animations.

To lay the groundwork for AI to better understand and connect design and code, teams should:

- **Map design components to product code.** Link design components directly to their coded counterparts so teams can access real implementation details instead of generic snippets.
- **Structure design tokens clearly.** Store tokens in machine-readable formats (like JSON or YAML) with consistent naming so colors, spacing, and typography map predictably to production variables.
- **Expose component relationships.** Make it clear how components, patterns, and variants relate across design and code—through naming, hierarchy, or metadata—so AI can understand how parts fit together.
- **Make implementation logic discoverable.** Your codebase and design system should both reference the same sources for variables, styles, and behaviors. The easier this logic is to access, the more consistently it will be used.

### Bringing design context into the developer environment with MCP

As teams work to link design systems more tightly to production code, emerging standards like Model Context Protocol (MCP) take that connection a step further, letting AI not just understand but actively pull context from a design system in real time. By giving AI structured access to the same components, tokens, and documentation developers use, MCP transforms a design system into a shared context across tools, so designers and developers can work from the same information without exporting, syncing, or duplicating files.

Through tools like Figma Make, MCP also connects design artifacts to the code that powers them. AI can reference the real structure and logic behind a file, keeping generated outputs consistent with established standards and helping teams move from prototype to production more quickly.

Teams can use MCP to maintain and scale their design system by:

- **Connecting design to code:** MCP gives AI access to your design and code context so generated code references real components and variables. This helps teams maintain consistency across products and scale their systems as AI becomes part of everyday workflows.
- **Automating token work:** AI can suggest where tokens should be applied, so new tokens comply with defined standards, and help write scripts for better token workflows.
- **Auditing design-code alignment:** AI agents can flag prop misalignment, audit token usage between design and code, and suggest improvements to layer names for better component mapping.

### Maintaining robust documentation

Thorough documentation provides the extra context layer that AI needs to interpret a design system. Without this documentation, AI can parse rules around components or code but may not translate them into outcomes teams expect.

### Making the implicit explicit

Getting a design system AI-ready means gathering guidance and context that might otherwise be scattered across developer docs, design specs, and Figma files. "Providing more robust documentation for each asset, especially similar components that might be used in subtly different ways, is really critical context for AI to have," Zoe says. "This way, it's always choosing the right assets when there are opportunities to pick between more than one."

But there's more to documentation than simply listing components. As teams build out AI usage for their own design systems, it's important to include examples and patterns that help AI understand not only what to use, but the logic behind when and how to use it.

#### Good design system documentation should:

- **Explain the "why."** Describe each component's purpose and when to use it, not just how it looks.
- **Keep structure consistent.** Use a standard format for every component, clearly separating purpose, usage, behavior, and accessibility details.
- **Show right and wrong examples.** These help AI understand the intended boundaries of a component and avoid misusing styles or patterns.
- **Maintain layer hygiene.** Keep file hierarchies clean and free of unnecessary groups or frames to make structures easier for AI to parse.
- **Document behavior and states.** Spell out hover, focus, and error states so outputs match production logic.
- **Include accessibility details.** Note requirements like color contrast or keyboard navigation so accessibility is built into every output.

> **In short**
> - Many of the foundations that have long been important—like clear structure, active maintenance, and robust documentation—are more important than ever.
> - To evolve design systems for AI, teams should:
>   - Structure tokens and variables predictably.
>   - Document usage rules and intent.
>   - Add higher-order compositions, clarifying relationships, and maintain clean file structures.
>   - Connect design and code through tools like Code Connect and MCP.

#### Related reading
- Why MCP servers are the unlock in AI-centric workflows
- How Figma's investing in design context
- Designers on how to structure files for dev consumption

---

## Setting your design system up for scale

Design systems have always been dynamic, but today more than ever, change has to be built in. The best systems operate like products themselves, with a backlog, clear ownership, and versioning so they grow alongside the tools and teams that depend on them. "It doesn't matter how big or small, the most important part [of a design system] is treating it like a product," says Samira Rahimi, head of platform experiences at Uber. "A design system won't succeed if it's just a thing. It should be a product with clear OKRs, a roadmap, customers, and output." This mindset is especially critical in the AI era, as design systems must scale across more teams and products. Scaling at this level means creating systems resilient enough to maintain intent and standards as the company grows and the pace of change accelerates.

> Hear more from Samira Rahimi, head of platform experience at Uber, and Tali Krakowsky Apel, former director of product design at Coinbase, as they share how design systems can help unify design and development teams in their 2025 Config talk.

### The flywheel of AI collaboration

Today, AI can also help teams understand where to focus their efforts. By surfacing usage patterns and highlighting gaps, AI helps teams prioritize what to build or refine next. As teams and AI continue to collaborate in these ways, the work begins to build momentum. Each cycle helps AI better understand how a team designs and builds, while product builders learn how to guide and refine AI's contributions. Over time, this creates a flywheel of collaboration, where each round of shared work builds fluency and momentum for the next.

Once AI is able to master this fluency in design systems, the next frontier is participation—AI not just consuming systems, but helping create and maintain them. "I think we're going to see that AI plays a bigger role in building alongside design system teams, so they will co-author alongside humans," Zoe says. In this scenario, it may be possible to create one button asset in Figma and have the AI intelligently guess all the different states and variants for you, thereby saving hours in a Figma file fine-tuning every detail.

> In our recent report on the evolution of roles in product development, survey respondents expected the amount of time they spend collaborating, co-creating, or reviewing outputs from AI to grow 42% in the next 12 months.

### Design system adoption made easier

Whether AI is generating variants or analyzing usage, co-creation of design systems between product builders and AI could make them easier to adopt across the board. "AI is going to help a lot with adoption," Ana says. "If the system is something AI can automatically reference, it will use your code components and design tokens in any code it generates. That makes adoption much smoother, because teams won't have to struggle as much to apply the system themselves."

One of the biggest sources of friction today is keeping design and development aligned. AI can help reduce that burden by connecting those workflows across tools without requiring everything to be perfectly mirrored. "Designers and developers can each work their own way, and as long as those worlds are close enough, AI can bridge the gaps," Yarden says.

As AI manages more of that translation through the design system, it can automatically apply the right components and tokens, making consistency a built-in feature instead of a manual task. The result is a system that's faster to use and easier to maintain, one that reduces rework, improves quality, and speeds up delivery. Those gains make its impact measurable.

> Design system adoption has long been a pain point for product builders. Misaligned components, inconsistent naming, and mismatched expectations often slow progress—but strong documentation creates the shared language teams need to stay aligned.

> **In short**
> - AI has the potential to act as a collaborator, helping teams build, maintain, and prioritize design systems.
> - Adoption will become more seamless as AI automatically applies design system rules and connects design to code.

#### Related reading
- How documentation can help drive design system adoption
- The importance of measuring design system impact

---

## Pushing teams further (and skills for what's next)

As AI becomes part of design system management, the work of managing them is changing. "AI will help automate some aspects of overhead and operations, which can take up a lot of time," Ana says. "This shift will free up more time to work on the high-level vision of the overarching design of a product."

As this work evolves, teams will need to strengthen existing skills like domain expertise and design craft while developing new ones, like learning the language that leads to the best AI outputs. Together, these skills will determine how teams turn AI's speed into substance, and how thoughtful decision-making continues to shape great design.

### Understanding AI's behavior

Integrating AI more deeply into your workflow requires analyzing and learning from its behavior. "[The role of the design systems team] is going to be about looking at the insights and how the design system is being consumed," Zoe says. "It's going to be more on authors to see what kind of outputs are coming from their systems." This means tracking how AI interprets components, logging where it breaks rules or invents workarounds, and monitoring which parts of the system get used versus ignored. By treating AI's activity as diagnostic data, teams can prioritize updates based on real usage.

"It's important to avoid relying on AI as the absolute expert—you need to check its outputs before confidently shipping something," Ana says. Knowing where AI excels and where it falls short is an important skill, and developing this instinct takes repetition and awareness. It comes from noticing the small things AI often misses and spotting when its outputs start to drift from your design system or live components. When something feels off, understanding why matters as much as fixing it. "Ask AI questions so you can better understand its reasoning and actually develop the skills to branch out, rather than relying on it to do things you don't know how to," says Ana.

> **57%** of product builders now spend more time on high-value work like defining product vision and long-term strategy, according to recent Figma research.

> "It's important to avoid relying on AI as the absolute expert—you need to check its outputs before confidently shipping something."
> —**Ana Boyer**, Designer Advocate, Figma

### Leaving room for experimentation

With a design system, designers can automate the tasks that once consumed hours, like applying styles or enforcing consistency across files. As a result, they can focus more on what AI can't do: exploring new interactions, infusing taste into every decision, and pushing the creative boundaries of the brand.

But that space for creativity is only valuable if teams are able to harness it with intention—an effort guided by intuition and experimentation. "It's about not seeing rules as hard and fixed," Paige says. "Instead, builders should stay playful and ask, 'What if I just tried this?' It's about listening to your intuition and ideas, and trusting that you can bring them to life." Advancements in AI lower the barrier to creation and experimentation—the more teams lean into that experimentation, the more they'll strengthen their instincts and evolve their craft.

### Harnessing the power of language

As AI proliferates, product builders will likely find themselves spending more time fine-tuning their prompts. Providing complete instructions alongside a design system gives AI the context it needs to deliver outputs that match intent. "I think it's actually more of a language skill than anything else. Knowing the right questions to ask or how to phrase something in a way that gets you the most accurate output is a skill we need to have," Zoe says.

#### Best practices for prompting include:

- **Breaking down complex concepts** into manageable steps.
- **Including relevant design context**—like layout constraints, components, styles, or tokens—to help AI produce outputs that stay consistent and on brand.
- **Linking your design system** through tools like Code Connect or MCP so AI can reference real components, tokens, and documentation instead of recreating them from scratch.
- **Using plain, specific language** instead of abstract adjectives ("use a 16px button" instead of "make it bold.")
- **Providing examples of what good looks like**—showing preferred patterns, styles, or visual treatments so AI understands the standard you're aiming for and can align its results accordingly.
- **Asking AI to explain its reasoning** when outputs feel off to help you guide it more precisely.

> **In short**
> - As AI takes on more operational work, design systems teams move into a more strategic role—shaping architecture, guiding AI's use, and building the skills to interpret and refine its outputs.
> - To meet the moment, teams should continue improving domain knowledge, hone their craft, and learn how to effectively communicate with AI.

#### Related reading
- 6 skills every engineer needs for the AI era
- How to harness skills that AI can't automate

---

## The road ahead

Design systems have always been about helping teams build better, faster, and more consistently. In today's shifting landscape, they become the foundation that allows teams to harness the power of AI and maintain craft at scale.

### Key takeaways

**Design systems scale craft and intent.**
By codifying the details that define great design, design systems preserve quality and identity as teams and AI work together at greater speed.

**Meeting the moment means evolving your design systems for AI consumption.**
Clear documentation, consistent naming, and machine-readable tokens give AI the context it needs to generate reliable, brand-aligned results while reducing manual work.

**AI changes how systems evolve.**
When AI can read and apply system logic, it can help with design system maintenance. It can flag inconsistencies, surface insights, and help teams improve clarity and quality over time.

**New skills will shape the next era of design systems.**
As AI becomes part of daily workflows, teams will need to ensure domain knowledge to check AI's outputs, learn best practices for communicating with AI, and lean into curiosity and exploration.

---

#### Related reading
- How teams are shifting in an AI-driven landscape
- Figma's 2025 AI report: Perspectives from designers and developers

---

> **In Practice: How LinkedIn built Figma Make templates grounded in their design system**
>
> LinkedIn's design systems team needed a faster, more consistent way to create design variations to preserve internal styles. Using Figma Make, they built a starter template that instantly generates on-brand layouts across devices, including light and dark modes, helping designers explore ideas faster while staying true to LinkedIn's system. High-fidelity system-aligned prototypes now drive clearer alignment across design, engineering, and product—boosting both creativity and execution speed.
>
> "We were trying to get more deterministic outputs that would accurately abide by not just our components and styles, but our product patterns as well," says LinkedIn Product Designer Cherin Yoo. "LLMs make choices within the boundaries we give them, and this template helps us narrow those boundaries."

---

*figma.com/reports*
