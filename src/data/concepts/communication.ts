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
]
