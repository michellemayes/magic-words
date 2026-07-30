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
]
