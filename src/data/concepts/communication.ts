import type { Concept } from '../types'

export const communication: Concept[] = [
  {
    id: 'pyramid-principle',
    name: 'Pyramid Principle',
    aka: ['Minto pyramid', 'MECE', 'answer first structure', 'consulting structure'],
    origin: 'Barbara Minto, McKinsey',
    domains: ['writing', 'strategy', 'product'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Lead with the answer, support it with three to five mutually exclusive and collectively exhaustive arguments, and put the evidence beneath each.',
    useWhen: [
      'my document buries the point',
      'executives are not reading past the first page',
      'my writing is a chronology of how I figured it out',
      'the argument is there but the structure is a mess',
      'how do consultants structure recommendations',
    ],
    prompt:
      'Restructure this using the Pyramid Principle. Put the single governing recommendation at the top as one sentence. Beneath it, three to five supporting arguments that are mutually exclusive and collectively exhaustive — check them explicitly for overlap and for gaps and tell me if they fail either test. Beneath each argument, the evidence. Strip out the narrative of how I arrived at the conclusion; the reader wants the conclusion, not my journey. Flag any supporting argument that is actually a restatement of the recommendation.',
    why:
      'Explicitly testing the MECE property is what distinguishes this from "add a summary at the top". Overlapping arguments feel like more support and are actually one argument said three ways — a model will tell you which, if asked.',
    watchOut:
      'Answer-first fails when the reader is hostile to the conclusion. In that case, lead with the shared premise instead.',
    related: ['bluf', 'scqa', 'working-backwards', 'reader-centric-rewrite'],
    tags: ['writing', 'structure', 'executive communication', 'documents', 'consulting'],
  },

  {
    id: 'bluf',
    name: 'BLUF (Bottom Line Up Front)',
    aka: ['bottom line up front', 'lead with the ask', 'TLDR first'],
    origin: 'US military communication doctrine',
    domains: ['writing', 'career'],
    intents: ['communicate'],
    oneLiner:
      'Open with the conclusion and the specific action required, then supply context — so a reader who stops after one paragraph still has what they need.',
    useWhen: [
      'my emails are too long and get ignored',
      'nobody responds to my slack messages',
      'I need a decision from a busy person',
      'how do I write an update leadership will read',
      'my status updates ramble',
    ],
    prompt:
      'Rewrite this BLUF-style. First line: the bottom line — the decision, the ask, or the status, plus the deadline. Second line: exactly what I need from the reader and by when, or "no action needed" if that is true. Then the context, in descending order of importance, so it can be cut from the bottom without losing anything essential. Keep the first two lines readable on a phone lock screen.',
    variants: [
      {
        label: 'Escalating a problem upward',
        prompt:
          'Rewrite this as a BLUF escalation: what is wrong, what it costs, what I have already tried, what I am asking for specifically, and what happens if the answer is no. Four sentences before any detail. No blame, no throat-clearing, no apologising for the length.',
      },
    ],
    why:
      'The phone-lock-screen constraint is a concrete length test the model can actually satisfy, unlike "be concise" — which it will agree to and then ignore.',
    related: ['pyramid-principle', 'scqa', 'reader-centric-rewrite', 'decision-roles-daci'],
    tags: ['email', 'slack', 'brevity', 'executive communication', 'updates'],
  },

  {
    id: 'scqa',
    name: 'SCQA Framework',
    aka: ['situation complication question answer', 'SCR', 'setup payoff'],
    origin: 'Barbara Minto',
    domains: ['writing', 'strategy'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Open with a stable Situation, introduce the Complication that disturbs it, surface the Question that raises, and give the Answer.',
    useWhen: [
      'how do I open this document',
      'the intro is boring and nobody reads on',
      'I need to make the reader care before the recommendation',
      'writing a strategy doc or a proposal',
      'the audience does not yet think there is a problem',
    ],
    prompt:
      'Write the opening using SCQA. Situation: something the reader already accepts as true, stated in their terms — no persuasion yet. Complication: the specific change or tension that makes the situation no longer stable, with evidence. Question: the question the complication forces, stated so plainly the reader would have asked it themselves. Answer: my recommendation in one sentence. Keep the whole thing under 150 words, and make sure the Situation is genuinely uncontroversial — if the reader argues with the first sentence, the rest will not land.',
    why:
      'Complementary to the Pyramid Principle rather than an alternative: SCQA earns the right to lead with the answer by first establishing that a question exists.',
    related: ['pyramid-principle', 'bluf', 'story-spine', 'working-backwards'],
    tags: ['writing', 'opening', 'narrative', 'proposal', 'structure'],
  },

  {
    id: 'reader-centric-rewrite',
    name: 'Curse of Knowledge Rewrite',
    aka: ['curse of knowledge', 'reader centric editing', 'jargon audit'],
    origin: 'Named by Robin Hogarth; popularised by Chip & Dan Heath and Steven Pinker',
    domains: ['writing', 'learning'],
    intents: ['communicate', 'explain'],
    oneLiner:
      'You cannot un-know what you know, so your writing skips the steps that made it make sense — the fix is to audit for assumed context, not for style.',
    useWhen: [
      'people keep misunderstanding my writing',
      'this is clear to me and apparently to nobody else',
      'writing docs for a different audience',
      'too much jargon',
      'my explanation assumes too much',
    ],
    prompt:
      'Audit this for the curse of knowledge. Read it as a specific reader: [describe them — role, seniority, what they already know, what they care about]. Mark every place where I assume context they do not have: undefined jargon, acronyms, implied history, references to systems or decisions they were not part of, and reasoning steps I skipped because they are obvious to me. For each, tell me the minimum I would need to add. Then flag anything I over-explained for this particular reader, because that costs their attention too.',
    why:
      'The over-explanation pass is what keeps this from turning every document into a tutorial. Clarity is calibration to a specific reader, not maximal explanation.',
    related: ['feynman-technique', 'audience-ladder', 'plain-language', 'bluf'],
    tags: ['clarity', 'editing', 'jargon', 'audience', 'documentation'],
  },

  {
    id: 'audience-ladder',
    name: 'Audience Ladder',
    aka: ['explain at five levels', 'ELI5 to expert', 'progressive explanation'],
    origin: 'Popularised by WIRED\'s "5 Levels" series',
    domains: ['writing', 'learning', 'meta'],
    intents: ['explain', 'communicate'],
    oneLiner:
      'Explain the same idea at several levels of sophistication so you can find the rung your audience is actually on.',
    useWhen: [
      'I do not know how technical to make this',
      'explaining the same thing to engineers and executives',
      'my explanation is either patronising or over their head',
      'writing for a mixed audience',
      'I need an analogy that works for a non-technical stakeholder',
    ],
    prompt:
      'Explain this at four levels: to a curious twelve-year-old, to a smart generalist with no domain background, to a practitioner in an adjacent field, and to an expert in this exact field. Each version must be accurate — simplify by omitting detail, never by saying something false. After the four, tell me which one fits my actual audience [describe them] and which specific sentence from a lower level is worth keeping in the higher-level version as the anchor image.',
    why:
      'The "borrow one sentence from a lower rung" instruction is where the value is. The best expert-level writing keeps exactly one concrete image from the twelve-year-old version.',
    related: ['feynman-technique', 'reader-centric-rewrite', 'analogical-mapping', 'plain-language'],
    tags: ['explanation', 'teaching', 'audience', 'analogy', 'simplification'],
  },

  {
    id: 'plain-language',
    name: 'Plain Language Pass',
    aka: ['plain english', 'readability edit', 'de-jargon'],
    origin: 'Plain Language movement / US Plain Writing Act 2010',
    domains: ['writing', 'design'],
    intents: ['communicate'],
    oneLiner:
      'Cut nominalisations, passive constructions and abstraction until the sentence says who does what.',
    useWhen: [
      'this reads like corporate mush',
      'my writing is full of nominalisations',
      'make this shorter without losing meaning',
      'legal or policy text nobody can parse',
      'error messages and UI copy',
    ],
    prompt:
      'Do a plain language pass. Turn nominalisations back into verbs ("make a determination" becomes "decide"), give every sentence a clear actor doing a clear thing, and cut hedging that adds no information. Preserve every substantive qualification — do not make it more confident than the original. Show the result, then a short table of the three changes that most improved it and what each one was hiding, since vague writing usually conceals a decision nobody wanted to state.',
    why:
      '"Vague writing conceals a decision nobody wanted to state" turns copy-editing into a diagnostic. The passive voice in a policy doc is usually load-bearing.',
    watchOut:
      'Do not let it strip necessary hedges from legal, medical, or safety text. The "preserve qualifications" clause is not optional there.',
    related: ['reader-centric-rewrite', 'bluf', 'audience-ladder'],
    tags: ['editing', 'clarity', 'concise', 'ux writing', 'style'],
  },

  {
    id: 'story-spine',
    name: 'Story Spine',
    aka: ['narrative arc', 'and then one day', 'Pixar pitch'],
    origin: 'Kenn Adams, improvisational theatre',
    domains: ['writing', 'product', 'strategy'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Once upon a time / every day / but one day / because of that / until finally — a skeleton that makes any change feel inevitable rather than arbitrary.',
    useWhen: [
      'my presentation is a pile of facts',
      'how do I make this memorable',
      'pitching a vision',
      'the demo needs a story around it',
      'writing a case study or customer story',
    ],
    prompt:
      'Structure this as a story spine: "Once upon a time [stable world] / Every day [the routine and its cost] / But one day [the change or insight] / Because of that [consequence] / Because of that [second consequence] / Until finally [the new state]". Keep the protagonist as the customer, not us — we are at most the guide. Make the "every day" section sting: the cost of the status quo is what makes the rest land. Then tell me which of the beats I currently have no evidence for.',
    why:
      'Casting the customer as protagonist is the correction most product narratives need, and models will default to making the company the hero unless told otherwise.',
    related: ['scqa', 'jobs-to-be-done', 'working-backwards', 'pyramid-principle'],
    tags: ['storytelling', 'presentation', 'pitch', 'narrative', 'marketing'],
  },

  {
    id: 'sbi-feedback',
    name: 'Situation-Behaviour-Impact',
    aka: ['SBI', 'feedback model', 'radical candor in practice'],
    origin: 'Center for Creative Leadership',
    domains: ['career'],
    intents: ['communicate'],
    oneLiner:
      'Describe the specific situation, the observable behaviour, and its concrete impact — with no inference about the person\'s character or intent.',
    useWhen: [
      'I need to give someone difficult feedback',
      'how do I say this without it being personal',
      'a peer keeps doing something that undermines the team',
      'writing a performance review',
      'my feedback keeps landing badly',
    ],
    prompt:
      'Draft this feedback using Situation-Behaviour-Impact. Situation: when and where, specifically. Behaviour: what was observable — what a camera would have recorded — with no interpretation of motive. Impact: the concrete effect on the work, the team, or me, stated as my experience rather than as objective fact. Then strip out every inference about their intent or character, and show me what you removed, because those are the phrases that would have triggered defensiveness. End with a genuine question that opens a conversation rather than closing one.',
    why:
      'Making the model show what it stripped out teaches the pattern. The inferred-motive phrases are the ones you would not have noticed writing yourself.',
    related: ['nonviolent-communication', 'design-critique', 'blameless-postmortem', 'disagree-and-commit'],
    tags: ['feedback', 'management', 'difficult conversation', 'performance review', 'leadership'],
  },

  {
    id: 'nonviolent-communication',
    name: 'Nonviolent Communication',
    aka: ['NVC', 'observation feeling need request', 'compassionate communication'],
    origin: 'Marshall Rosenberg',
    domains: ['career'],
    intents: ['communicate'],
    oneLiner:
      'Separate observation from evaluation, name the feeling and the underlying need, then make a specific, refusable request.',
    useWhen: [
      'this conversation keeps turning into a fight',
      'I am frustrated and about to send something I will regret',
      'a conflict with a colleague or a partner',
      'how do I ask for what I need without accusing',
      'the same argument keeps recurring',
    ],
    prompt:
      'Rewrite this using Nonviolent Communication. Observation: what happened, stated so neutrally that the other person would agree with the description. Feeling: what I feel, using an actual emotion rather than a disguised accusation ("I feel dismissed" is a judgement, not a feeling). Need: the underlying need that is unmet. Request: something specific, doable and genuinely refusable — not a demand wearing a question mark. Flag anywhere my original wording contained a judgement I had mistaken for an observation.',
    why:
      'The "I feel dismissed is not a feeling" distinction is the one people consistently get wrong, and naming it explicitly in the prompt is what makes the output different from a politeness pass.',
    watchOut:
      'Full NVC phrasing can read as stilted in a workplace. Use the structure to think, then translate to normal register.',
    related: ['sbi-feedback', 'steelmanning', 'disagree-and-commit'],
    tags: ['conflict', 'communication', 'relationships', 'difficult conversation', 'empathy'],
  },

  {
    id: 'star-method',
    name: 'STAR Method',
    aka: ['situation task action result', 'behavioural interview answers'],
    origin: 'Structured behavioural interviewing',
    domains: ['career'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Answer "tell me about a time when" as Situation, Task, Action, Result — with the Action in the first person singular.',
    useWhen: [
      'preparing for a job interview',
      'writing my performance self-review',
      'how do I talk about my accomplishments',
      'my interview answers ramble',
      'promotion packet or brag document',
    ],
    prompt:
      'Structure this experience as a STAR answer. Situation and Task in two sentences of context — no more. Action is the bulk of it, and must be in the first person singular: what I specifically did, including the decision points and what I chose against. Result must be quantified, and if I have no number, tell me what number I should go find. Keep the whole thing under 90 seconds spoken. Then flag every "we" in the Action section, because that is where interviewers lose track of what I actually did.',
    why:
      'The "we" flag is the single highest-value edit in interview prep. Candidates describe team accomplishments and interviewers cannot score them.',
    related: ['bluf', 'sbi-feedback', 'pyramid-principle'],
    tags: ['interview', 'career', 'resume', 'promotion', 'self review'],
  },

  {
    id: 'world-bible',
    name: 'World Bible',
    aka: ['story bible', 'series bible', 'lore document', 'canon document', 'show bible'],
    origin: 'Television writers\' rooms and long-running fiction series',
    domains: ['writing', 'meta'],
    intents: ['structure', 'steer'],
    oneLiner:
      'One canonical reference for the facts, rules, characters and tone of an invented world, written down before the drafting so every chapter, episode or session draws from the same source.',
    useWhen: [
      'the characters keep changing personality between chapters',
      'it forgot how the magic system works halfway through',
      'details in my novel contradict each other',
      'every new chat about my story starts from scratch',
      'I am building a fantasy setting and cannot keep track of it',
      'the timeline of my story does not add up',
      'a game world where the lore keeps drifting',
    ],
    prompt:
      'Before we write any more scenes, build a world bible for this project and treat it as canon from now on. Sections: premise and tone in a paragraph; the rules of the world, stated as constraints with their costs and limits, because unlimited powers break stories; a character sheet for each major character covering want, fear, voice, and what they know and when they learned it; places; a dated timeline of events; and an open-questions list for anything not yet decided. Draw only from what I have already written, and flag every contradiction you find rather than silently picking a side. When we draft later, check each scene against the bible and tell me before you add anything new to canon.',
    variants: [
      {
        label: 'For a long-running AI project, not fiction',
        prompt:
          'Write a project bible I can paste at the top of every new session: the fixed decisions and why, the vocabulary we use and what each term means, the conventions to follow, the things we have tried and rejected, and the open questions. Keep it to what a newcomer must know to avoid contradicting past work, and nothing else.',
      },
    ],
    why:
      'A model has no memory across sessions and a weak grip on details from far back in a long context, so continuity drifts unless the canon is written down and handed back. Naming it a bible tells the model it is authoritative, not a suggestion, and the "flag contradictions, do not resolve them" instruction keeps the author in charge of canon.',
    watchOut:
      'Bibles grow until nobody reads them. Keep the pasted version short and put the long-form lore in a separate reference, or the important constraints get buried.',
    related: ['style-sheet', 'continuity-pass', 'voice-profile', 'context-priming'],
    tags: ['fiction', 'worldbuilding', 'consistency', 'creative writing', 'canon', 'lore'],
  },

  {
    id: 'style-sheet',
    name: 'Editorial Style Sheet',
    aka: ['copyeditor style sheet', 'house style', 'spelling and usage sheet'],
    origin: 'Book publishing copyediting practice',
    domains: ['writing'],
    intents: ['structure', 'steer'],
    oneLiner:
      'A running per-document list of every spelling, capitalisation, hyphenation, number and naming decision, so the same choice is made the same way every time.',
    useWhen: [
      'the same name is spelled three different ways in the draft',
      'is it e-mail or email, we keep switching',
      'the document mixes British and American spelling',
      'numbers are sometimes words and sometimes digits',
      'several people wrote parts of this and it reads inconsistent',
    ],
    prompt:
      'Build an editorial style sheet for this document before editing it. Go through the text and record every decision that has more than one defensible answer: spelling variants, capitalisation of terms and titles, hyphenation and compound words, how numbers, dates and units are written, abbreviations and when they are first expanded, product and proper names, and serial comma. Where the text is inconsistent, list each variant with a count and recommend one, noting which I must decide. Then apply the sheet and give me the list of changes grouped by rule, not a line-by-line diff.',
    why:
      'Asked to "make it consistent", a model normalises some instances and misses others because it never commits to the rule. Writing the sheet first turns a vague polish into a checklist it applies mechanically, and the counts surface choices the author did not know they were making.',
    watchOut:
      'A style sheet records choices; it does not make prose good. Run it last, after structural edits, or it gets rebuilt every time a section moves.',
    related: ['world-bible', 'plain-language', 'continuity-pass'],
    tags: ['editing', 'copyediting', 'consistency', 'style guide', 'writing'],
  },

  {
    id: 'continuity-pass',
    name: 'Continuity Pass',
    aka: ['continuity edit', 'consistency check', 'continuity error hunt'],
    origin: 'Film script supervision and manuscript editing',
    domains: ['writing'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'A dedicated read that checks only whether facts, timelines and character knowledge agree across the whole work, separate from any edit for quality.',
    useWhen: [
      'a reader said a character knew something before they could have',
      'the eye colour changed in chapter nine',
      'I rewrote the middle and now the ending does not line up',
      'the dates in the report disagree with each other',
      'check that nothing in this long draft contradicts itself',
    ],
    prompt:
      'Do a continuity pass on this draft and nothing else: do not comment on style or pacing. Track every stated fact about people, places, objects, dates, durations and numbers, and every point where a character learns something. Report each conflict with both locations quoted, what disagrees, and which version the rest of the text supports. Separately list timeline problems, such as travel that takes impossible time or events out of order, and knowledge problems, where someone acts on information they have not yet received. Rank by how noticeable each would be to a reader.',
    why:
      'Mixed into a general edit, contradictions lose out to style notes, because style is visible in every paragraph and a contradiction needs two distant passages held in mind at once. A single-purpose pass with quoted locations forces the model to actually cross-reference.',
    watchOut:
      'Deliberate inconsistency, such as an unreliable narrator or a character lying, will be flagged. Tell it which contradictions are intentional.',
    related: ['world-bible', 'style-sheet', 'self-critique-loop'],
    tags: ['editing', 'fiction', 'consistency', 'timeline', 'review'],
  },

  {
    id: 'voice-profile',
    name: 'Voice Profile',
    aka: ['style profile', 'writing fingerprint', 'tone of voice guide', 'brand voice'],
    origin: 'Brand voice guidelines and stylometry',
    domains: ['writing', 'meta'],
    intents: ['steer', 'structure'],
    oneLiner:
      'Extract an explicit description of how someone writes from real samples, then write to that description instead of to "sound like me".',
    useWhen: [
      'it does not sound like me',
      'the draft reads like a robot wrote it',
      'ghostwriting for my boss and it sounds nothing like them',
      'our blog posts all sound different depending on who wrote them',
      'I want it to write the way I write',
    ],
    prompt:
      'Before drafting, build a voice profile from these samples. Describe it concretely enough that someone else could imitate it: typical sentence length and how much it varies, vocabulary register and words used often or never, how paragraphs open, use of first person, humour and how it is signalled, punctuation habits, how claims are hedged or not, and how pieces begin and end. Quote a short example for each trait. List what this writer never does, since the absences are what generic prose gets wrong. Then write the draft to the profile, and afterwards point to the two places it drifts furthest from it.',
    why:
      '"Write like me" gives the model nothing to hold, so it falls back to its default voice with a few surface features copied. Making it state the traits and the absences first turns imitation into a spec it can be checked against.',
    watchOut:
      'Three or four samples of the same kind are the minimum; a profile built from one email will overfit to that email.',
    related: ['few-shot-examples', 'world-bible', 'style-sheet', 'reader-centric-rewrite'],
    tags: ['writing', 'tone', 'ghostwriting', 'brand voice', 'style', 'profiling'],
  },

  {
    id: 'inverted-pyramid',
    name: 'Inverted Pyramid',
    aka: ['news style', 'most important first', 'journalistic structure', 'lede first'],
    origin: 'Nineteenth-century wire-service journalism',
    domains: ['writing'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Put the most newsworthy facts in the first paragraph and order everything after by decreasing importance, so the piece can be cut from the bottom at any point.',
    useWhen: [
      'people only read the first paragraph of my updates',
      'writing an announcement and the news is in paragraph four',
      'my status report starts with background nobody needs',
      'the editor will trim this and I do not know what survives',
      'how do journalists decide what goes first',
    ],
    prompt:
      'Restructure this as an inverted pyramid. Write a lede of one or two sentences that answers who, what, when, where and why for the single most important development, in plain words a skimmer would understand. Then order every remaining paragraph by how much a reader loses if it is cut, most important first, with background and history at the bottom. Each paragraph should stand on its own without needing the one after it. Finally, show me where you would cut if the piece had to lose half its length, and confirm that the shortened version is still accurate.',
    why:
      'The "where would you cut" test gives the model a concrete check it can run on its own ordering. Without it, "put the important thing first" produces a new opening sentence stacked on the same chronological body.',
    watchOut:
      'Built for news and announcements. Arguments and persuasive pieces usually need the Pyramid Principle instead, because their supporting points are not ranked by newsworthiness but grouped by logic.',
    related: ['bluf', 'pyramid-principle', 'scqa', 'concision-pass'],
    tags: ['journalism', 'structure', 'announcements', 'news writing', 'skimmable'],
  },

  {
    id: 'reverse-outline',
    name: 'Reverse Outline',
    aka: ['after-the-fact outline', 'paragraph audit', 'post-draft outline', 'structural edit'],
    origin: 'Writing-centre and composition teaching practice',
    domains: ['writing'],
    intents: ['diagnose', 'structure', 'critique'],
    oneLiner:
      'Outline a finished draft one line per paragraph to see the structure you actually wrote, then fix the order, gaps and repeats before touching sentences.',
    useWhen: [
      'my draft feels disorganised but I cannot say why',
      'I wrote this without a plan and now it wanders',
      'the essay repeats itself somewhere in the middle',
      'I do not know which parts to move or cut',
      'a long document that grew over weeks and has no shape',
    ],
    prompt:
      'Make a reverse outline of this draft. For each paragraph, give its number and one sentence stating the point it actually makes, not the point it seems meant to make. Mark paragraphs that make two points, paragraphs that repeat an earlier point, and paragraphs whose point does not serve the main claim. Then state the main claim as the outline reveals it and say whether it matches the claim in the introduction. Propose a new order as a list of paragraph numbers with merges and cuts noted, and name any step in the argument that is missing entirely. Do not rewrite prose yet.',
    why:
      'Summarising each paragraph forces the model to read for structure instead of polishing sentences, which is what it does by default when asked to "improve" a draft. The "does not rewrite prose" line keeps the structural diagnosis from being buried under line edits.',
    watchOut:
      'Short pieces rarely need it. Below a page, a plain read catches the same problems faster.',
    related: ['pyramid-principle', 'continuity-pass', 'self-critique-loop', 'concision-pass'],
    tags: ['editing', 'structure', 'revision', 'essays', 'drafting'],
  },

  {
    id: 'and-but-therefore',
    name: 'And, But, Therefore (ABT)',
    aka: ['ABT', 'ABT narrative template', 'and but therefore', 'narrative spine'],
    origin: 'Randy Olson, "Houston, We Have a Narrative"; adapted from Trey Parker and Matt Stone',
    domains: ['writing', 'research'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'State the setup with "and", the problem with "but", and the consequence or action with "therefore", so any explanation has a narrative instead of a list.',
    useWhen: [
      'my presentation is just a list of facts',
      'the abstract is accurate and completely boring',
      'I need to explain why this project matters in two sentences',
      'people nod along and then forget what I said',
      'my pitch has no tension',
    ],
    prompt:
      'Rewrite the core message as an ABT: one sentence of "[established context] and [more context], but [the problem or surprise], therefore [what we do or what follows]". Keep it under 50 words. Then check it: the "and" part must be something the audience already accepts, the "but" must be a real conflict rather than a transition, and the "therefore" must follow from the "but". Give me three versions with different "but" statements, say which is strongest and why, and then show how the full piece should be reordered so it follows that arc.',
    why:
      'The three connecting words give the model a fixed grammar, and a short one is easy to check. Asking for several "but" options matters because the problem statement is where most drafts are weak, and the model picks the conflict it would otherwise have smoothed over.',
    watchOut:
      'Every paragraph written as an ABT becomes monotonous. Use it for the spine of the piece and for openings, not as a template for every section.',
    related: ['scqa', 'story-spine', 'pyramid-principle', 'narrative-memo'],
    tags: ['storytelling', 'narrative', 'science communication', 'pitch', 'abstract'],
  },

  {
    id: 'narrative-memo',
    name: 'Narrative Memo',
    aka: ['six-page memo', 'Amazon narrative', 'memo instead of slides', 'written narrative'],
    origin: 'Amazon senior leadership meetings, after Jeff Bezos banned slide decks in 2004',
    domains: ['writing', 'strategy', 'product'],
    intents: ['communicate', 'decide'],
    oneLiner:
      'Replace the slide deck with a few pages of full sentences that the room reads silently at the start of the meeting, so the reasoning has to be written out rather than implied by bullets.',
    useWhen: [
      'our slide decks hide weak reasoning behind bullet points',
      'meetings are spent explaining the deck instead of deciding',
      'I need to write a proposal leadership will actually read',
      'the plan sounds good in a presentation but falls apart in questions',
      'converting bullet points into a real argument',
    ],
    prompt:
      'Turn this into a narrative memo of no more than six pages, in full paragraphs with no bullets except for data tables. Order: the purpose and the decision being asked for in the first paragraph; the context a smart reader outside the team needs; the tenets or principles the proposal rests on; the current state with data; the proposal and the alternatives we rejected, with why; risks and open questions; and the specific ask. Every claim needs a number or a reason. Where my notes rely on a bullet to hide a missing step, write the step out or flag that I need to supply it. End with the five hardest questions a sceptical reader will write in the margin.',
    why:
      'Banning bullets is the working constraint. A model writing bullets can list assertions without connecting them; in paragraphs it has to supply the "because" and "so", and the gaps show up as sentences it cannot write.',
    watchOut:
      'It only works if the meeting actually reserves reading time. Sent as a pre-read that nobody opens, a six-page memo is worse than a one-page summary.',
    related: ['working-backwards', 'pyramid-principle', 'rfc-process', 'bluf'],
    tags: ['memo', 'amazon', 'proposal', 'meetings', 'decision making', 'documents'],
  },

  {
    id: 'concision-pass',
    name: 'Concision Pass',
    aka: ['omit needless words', 'cut edit', 'tighten', 'word count cut', 'line edit for length'],
    origin: 'Strunk and White, "The Elements of Style"; newsroom copy desks',
    domains: ['writing'],
    intents: ['communicate', 'critique'],
    oneLiner:
      'Cut every word, sentence and paragraph that does not change the meaning, measured against a hard length target rather than a feeling of tightness.',
    useWhen: [
      'this is too long and I cannot see what to remove',
      'I need to get this under the word limit',
      'my writing is wordy and repetitive',
      'every sentence starts with a throat-clearing phrase',
      'trim this without changing what it says',
    ],
    prompt:
      'Do a concision pass and cut this by at least 30 percent without losing any fact, qualification or instruction. Work in this order: delete paragraphs that repeat an earlier point, then sentences that only announce what comes next, then filler phrases ("it is important to note that", "in order to", "the fact that"), stacked intensifiers and doubled words ("each and every"). Keep the author\'s voice and any hedge that carries real uncertainty. Give me the cut version, the before and after word counts, and a short list of anything you considered removing but kept because it changed the meaning.',
    why:
      '"Make it concise" is an instruction models agree with and then barely follow. A percentage target and a word count make it measurable, and the ordered list of cuts pushes the model to remove whole redundant paragraphs, not only trim words inside them.',
    watchOut:
      'A hard percentage can cut the transitions a reader needs. If the result reads choppy, restore connectives before restoring content.',
    related: ['plain-language', 'bluf', 'reverse-outline', 'inverted-pyramid'],
    tags: ['editing', 'concise', 'word count', 'brevity', 'revision'],
  },

  {
    id: 'show-dont-tell',
    name: 'Show, Don\'t Tell',
    aka: ['show do not tell', 'dramatise', 'concrete detail', 'scene over summary'],
    origin: 'Fiction craft teaching, often traced to Chekhov\'s letters',
    domains: ['writing'],
    intents: ['communicate', 'critique'],
    oneLiner:
      'Replace statements of emotion, character or quality with concrete actions, details and dialogue that let the reader reach the conclusion themselves.',
    useWhen: [
      'my story says the character is angry but I do not feel it',
      'the writing is flat and full of adjectives',
      'readers say my characters feel like descriptions',
      'my case study just says the product is great',
      'how do I make this scene come alive',
    ],
    prompt:
      'Find every sentence in this draft that tells the reader what to conclude: named emotions ("she was furious"), character labels ("he was generous"), and verdicts ("it was a beautiful house", "the tool is powerful"). List them with their location. For the five that matter most to the piece, rewrite each as something the reader can see or hear: an action, a specific object, a line of dialogue, or a measurable result, and do not name the emotion or quality in the rewrite. Leave summary where it is doing its job of moving time along quickly, and tell me which telling sentences you kept on purpose and why.',
    why:
      'Listing the telling sentences first gives the model a target it can find mechanically. The rule against naming the emotion in the rewrite stops the common failure where it adds a gesture and then explains it anyway.',
    watchOut:
      'Showing everything makes a piece slow and long. Summary is the right tool for transitions and for facts the reader just needs to know.',
    related: ['voice-profile', 'story-spine', 'concision-pass', 'continuity-pass'],
    tags: ['fiction', 'creative writing', 'description', 'craft', 'storytelling'],
  },

  {
    id: 'crucial-conversations',
    name: 'Crucial Conversations',
    aka: ['high stakes conversation', 'pool of shared meaning', 'STATE my path', 'silence or violence'],
    origin: 'Patterson, Grenny, McMillan and Switzler, "Crucial Conversations" (2002)',
    domains: ['career'],
    intents: ['communicate', 'plan'],
    oneLiner:
      'When stakes are high, opinions differ and emotions run strong, keep the conversation safe enough that both sides put all their information on the table.',
    useWhen: [
      'I have to talk to my manager about something big and I keep avoiding it',
      'every time we discuss this it turns into a fight or a sulk',
      'a talk with my cofounder about equity that I am dreading',
      'people go quiet in the meeting and complain afterwards',
      'how do I raise a problem without the other person getting defensive',
    ],
    prompt:
      'Help me prepare for this conversation using the Crucial Conversations approach. First, what do I really want for myself, for them and for the relationship, and what would I do if I wanted those things. Second, separate the facts from the story I am telling myself about them. Third, draft an opening that states the facts, then my tentative conclusion, then asks for their view (the STATE path). Fourth, list the signs that they are moving to silence or aggression and a line I can use to restore safety, such as a contrasting statement ("I do not mean X, I do mean Y"). End with the outcome we should leave with: who does what by when.',
    why:
      'The "what do I really want" step stops the model from drafting a script to win the argument. Splitting facts from story gives it a concrete edit to make on the user\'s own framing, which is where these conversations usually go wrong.',
    watchOut:
      'Preparation helps, but a memorised script sounds like one. Use the draft to clarify your facts and opening, then talk normally.',
    related: ['nonviolent-communication', 'sbi-feedback', 'radical-candor', 'psychological-safety'],
    tags: ['difficult conversation', 'conflict', 'communication', 'leadership', 'relationships'],
  },

  {
    id: 'radical-candor',
    name: 'Radical Candor',
    aka: ['care personally challenge directly', 'ruinous empathy', 'obnoxious aggression', 'manipulative insincerity'],
    origin: 'Kim Scott, "Radical Candor" (2017)',
    domains: ['career'],
    intents: ['communicate', 'critique'],
    oneLiner:
      'Give feedback that both shows you care about the person and challenges them directly, avoiding the two common failures of being too nice to be useful or too harsh to be heard.',
    useWhen: [
      'I keep softening feedback until it says nothing',
      'my team never tells me what I am doing wrong',
      'I was told I come across as harsh when giving notes',
      'I let a performance problem go on too long because I liked them',
      'how do I tell someone their work is not good enough',
    ],
    prompt:
      'Rewrite this feedback using the Radical Candor framework. First, place my current draft on the two axes (care personally, challenge directly) and name which failure it is closest to: ruinous empathy, obnoxious aggression or manipulative insincerity, quoting the phrases that put it there. Then rewrite it so the problem is stated plainly in the first two sentences, the evidence is specific, and the care shows in what I offer to do next rather than in padding around the criticism. Keep it short enough to say in person. Finally, give me one question to ask them to invite feedback on me in return.',
    why:
      'Naming the four quadrants gives the model a vocabulary to diagnose the draft, not just rewrite it, so the user sees which habit to fix. "Care shows in what I offer to do" stops the rewrite from reaching for compliments to sandwich the criticism.',
    watchOut:
      'Often misread as permission to be blunt. Candor without a relationship already in place lands as aggression, whatever the framework says.',
    related: ['sbi-feedback', 'crucial-conversations', 'nonviolent-communication', 'psychological-safety'],
    tags: ['feedback', 'management', 'leadership', 'performance review', 'candor'],
  },

  {
    id: 'scarf-model',
    name: 'SCARF Model',
    aka: ['SCARF', 'status certainty autonomy relatedness fairness', 'social threat model'],
    origin: 'David Rock, NeuroLeadership Institute (2008)',
    domains: ['career'],
    intents: ['diagnose', 'communicate'],
    oneLiner:
      'People react to social threats to Status, Certainty, Autonomy, Relatedness and Fairness as strongly as to physical ones, so check a message against all five before sending it.',
    useWhen: [
      'my announcement caused a much bigger reaction than I expected',
      'the team is upset about a reorg and I do not know why exactly',
      'a reasonable change is getting fierce pushback',
      'I need to tell people their project is being cancelled',
      'why did that email land so badly',
    ],
    prompt:
      'Check this message against the SCARF model. For each of the five domains (Status, Certainty, Autonomy, Relatedness, Fairness), say whether the message threatens or rewards it for each group of readers, and quote the wording responsible. Rank the threats by how strongly they are likely to be felt. Then revise the message to reduce the top three threats without hiding the actual decision: for example, give a date for the next update to address certainty, or real choices within the change to address autonomy. List anything that cannot be softened honestly so I can address it in person.',
    why:
      'Five named domains give the model a checklist to read the message from the recipient\'s side, where "make this more sensitive" produces generic warmth. Tying each threat to quoted wording keeps the revision specific.',
    watchOut:
      'The neuroscience behind it is looser than it is often presented. Treat it as a useful checklist for reactions, not as a model of the brain.',
    related: ['nonviolent-communication', 'psychological-safety', 'crucial-conversations', 'stakeholder-mapping'],
    tags: ['change management', 'leadership', 'communication', 'reorg', 'empathy'],
  },

  {
    id: 'batna',
    name: 'BATNA',
    aka: ['best alternative to a negotiated agreement', 'principled negotiation', 'Getting to Yes', 'walk away point', 'interests not positions'],
    origin: 'Roger Fisher and William Ury, "Getting to Yes" (1981), Harvard Negotiation Project',
    domains: ['career', 'strategy'],
    intents: ['plan', 'decide'],
    oneLiner:
      'Know what you will do if the negotiation fails, because that alternative, not the other side\'s opening number, sets how much leverage you have and when to walk away.',
    useWhen: [
      'I have a job offer and do not know how hard to push on salary',
      'negotiating a contract and I feel like I have no leverage',
      'how do I know when to walk away from a deal',
      'the other side keeps anchoring on their number',
      'we are arguing positions and getting nowhere',
    ],
    prompt:
      'Help me prepare this negotiation using principled negotiation from Getting to Yes. First, list my realistic alternatives if no deal happens and pick the best one: that is my BATNA, and state it concretely with its value. Do the same for the other side, from what I know, and say what would make theirs weaker or stronger. Second, separate positions from interests: what each side is demanding and why they actually want it. Third, propose three options that serve both sides\' interests better than splitting the difference, and an objective standard (market data, precedent) to anchor on. End with my walk-away point and one way I could improve my BATNA before the talk.',
    why:
      'Starting with the alternatives turns "how do I negotiate" from a question about tactics into one about facts, which a model can reason about. Asking for the other side\'s BATNA too prevents the one-sided advice where the user overrates their own position.',
    watchOut:
      'A BATNA you are not actually willing to act on is a bluff. If the alternative is hypothetical, say so and plan around it.',
    related: ['expected-value', 'opportunity-cost', 'steelmanning', 'stakeholder-mapping'],
    tags: ['negotiation', 'salary', 'contracts', 'leverage', 'deal making'],
  },

  {
    id: 'stakeholder-mapping',
    name: 'Stakeholder Mapping',
    aka: ['power interest grid', 'stakeholder analysis', 'Mendelow matrix', 'influence map'],
    origin: 'Mendelow\'s power-interest matrix (1991) and project management practice',
    domains: ['career', 'strategy'],
    intents: ['plan', 'prioritize'],
    oneLiner:
      'Place everyone affected by a project on a grid of power over it and interest in it, then decide how to engage each quadrant instead of treating everyone the same.',
    useWhen: [
      'someone senior blocked my project late and I never saw it coming',
      'I do not know who I need to get on board',
      'too many people want updates and I cannot keep them all happy',
      'a cross-team initiative where nobody reports to me',
      'who should I talk to before I announce this',
    ],
    prompt:
      'Build a stakeholder map for this initiative. List every person and group affected, including those who could block it quietly, like finance, legal, security or an adjacent team. For each, estimate power (can they stop or change it) and interest (how much it affects them) as high or low, with one line of evidence. Place them in the four quadrants: manage closely, keep satisfied, keep informed, monitor. For the manage-closely group, give each person\'s likely position, what they care about, and the conversation I should have with them and in what order. Flag anyone whose position I am guessing at, and anyone missing that usually matters for this kind of project.',
    why:
      'A named grid forces the model to rate each person on two dimensions instead of producing a flat list of names. The "who could block it quietly" prompt catches the low-visibility, high-power groups that surprise people late.',
    watchOut:
      'People move quadrants as a project progresses. A map made at kickoff is out of date by launch; revisit it at each milestone.',
    related: ['decision-roles-daci', 'managing-up', 'scarf-model', 'blind-spot-audit'],
    tags: ['stakeholders', 'influence', 'project management', 'alignment', 'politics'],
  },

  {
    id: 'managing-up',
    name: 'Managing Up',
    aka: ['managing your manager', 'managing your boss', 'upward management'],
    origin: 'Gabarro and Kotter, "Managing Your Boss", Harvard Business Review (1980)',
    domains: ['career'],
    intents: ['communicate', 'plan'],
    oneLiner:
      'Treat the relationship with your manager as something you actively shape: learn their goals, pressures and preferred style, and adapt how you report, ask and escalate to fit.',
    useWhen: [
      'my boss keeps asking for updates at the worst times',
      'I do great work and my manager does not seem to notice',
      'my manager and I have completely different working styles',
      'I never know what my boss actually cares about',
      'how do I tell my manager a project is going off the rails',
    ],
    prompt:
      'Help me manage up with this manager. First, from what I have told you, describe their goals, the pressures on them from above, and their working style: do they want detail or summary, written or spoken, early warnings or finished answers. Mark what is guesswork and give me questions to confirm it. Second, identify where my current habits clash with their style. Third, draft a short recurring update in the format they would prefer, with decisions I need from them at the top. Fourth, write how I should raise the current problem: what to say first, what options to bring, and what I am asking them to do.',
    why:
      'Starting from the manager\'s pressures turns a vague relationship question into a model of another person the assistant can reason about. Marking guesswork and producing confirming questions stops the advice from being built on the user\'s assumptions.',
    watchOut:
      'Managing up is about making the working relationship effective, not about managing perceptions. If the advice starts to look like image control, the underlying problem is probably the work or the fit.',
    related: ['bluf', 'brag-document', 'stakeholder-mapping', 'crucial-conversations'],
    tags: ['manager', 'career', 'workplace', 'communication', 'status updates'],
  },
]
