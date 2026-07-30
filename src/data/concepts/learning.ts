import type { Concept } from '../types'

export const learning: Concept[] = [
  {
    id: 'feynman-technique',
    name: 'Feynman Technique',
    aka: ['explain it simply', 'teach it to learn it', 'gap-finding explanation'],
    origin: 'Richard Feynman',
    domains: ['learning', 'writing'],
    intents: ['explain', 'critique'],
    oneLiner:
      'Explain the concept in plain language as if teaching a beginner; wherever you reach for jargon, that is the gap in your understanding.',
    useWhen: [
      'I think I understand this but I am not sure',
      'I need to actually learn this not just skim it',
      'preparing to teach or present something',
      'I can use it but I cannot explain it',
      'studying for an exam or an interview',
    ],
    prompt:
      'Run the Feynman technique on me for this topic. I will explain it in plain language. Interrupt me every time I use a technical term without having defined it, state something as true without being able to say why, or paper over a step with "basically" or "it just works". Do not supply the missing piece — tell me precisely which part of my explanation is load-bearing but unsupported, and let me go find it. At the end, list my gaps in the order I should close them.',
    variants: [
      {
        label: 'You want the explanation, not the quiz',
        prompt:
          'Explain this the way Feynman would: no jargon, one concrete physical analogy, and an honest statement of where the analogy breaks down. Then tell me the one thing most people get wrong about it and why the wrong version is appealing.',
      },
    ],
    why:
      '"Do not supply the missing piece" is what makes this learning rather than reading. The gap has to stay open long enough for you to notice it.',
    related: ['socratic-questioning', 'audience-ladder', 'analogical-mapping', 'active-recall'],
    tags: ['learning', 'understanding', 'teaching', 'study', 'explanation'],
  },

  {
    id: 'active-recall',
    name: 'Active Recall & Spaced Retrieval',
    aka: ['retrieval practice', 'spaced repetition', 'testing effect', 'flashcards'],
    origin: 'Cognitive psychology; Ebbinghaus, Roediger & Karpicke',
    domains: ['learning'],
    intents: ['explain', 'plan'],
    oneLiner:
      'Retrieving information from memory strengthens it far more than reviewing it does — so test yourself instead of re-reading.',
    useWhen: [
      'I read it and forgot it immediately',
      'how do I actually remember this',
      'studying for a certification',
      'onboarding onto a new codebase or domain',
      'I highlight things and it does not help',
    ],
    prompt:
      'Turn this material into a retrieval practice schedule. First, generate questions that require me to reconstruct the idea rather than recognise it — no multiple choice, and no question whose answer is a single word I could guess from context. Mix in questions that connect two separate parts of the material, since those are the ones that build a model rather than a list. Quiz me one question at a time, wait for my answer, and tell me what I got structurally wrong rather than just correcting the fact. At the end, tell me which items to review tomorrow, in three days, and in a week.',
    why:
      'Specifying "reconstruct not recognise" is what stops the model producing recognition-level questions, which feel productive and do almost nothing for retention.',
    related: ['feynman-technique', 'socratic-questioning', 'worked-example-fading'],
    tags: ['memory', 'study', 'retention', 'learning', 'onboarding'],
  },

  {
    id: 'analogical-mapping',
    name: 'Analogical Mapping',
    aka: ['bridge from what I know', 'structural analogy', 'transfer learning'],
    origin: 'Dedre Gentner, structure-mapping theory',
    domains: ['learning', 'writing', 'engineering'],
    intents: ['explain', 'ideate'],
    oneLiner:
      'Map an unfamiliar structure onto one you already know deeply, then explicitly mark where the mapping breaks.',
    useWhen: [
      'explain this in terms of something I already understand',
      'I know X well and need to learn Y',
      'learning a new language or framework quickly',
      'the concept is abstract and will not stick',
      'I need a metaphor for a presentation',
    ],
    prompt:
      'Explain this by analogy to [something I already know well]. Map the components one to one and show the correspondence as a table. Then — most importantly — tell me exactly where the analogy breaks down, and what mistake I would make if I pushed it too far. Rank the disanalogies by how likely I am to trip over them in practice.',
    why:
      'The disanalogy section is the whole value. An unqualified analogy transfers the wrong intuitions along with the right ones, and you only find out later.',
    related: ['feynman-technique', 'audience-ladder', 'first-principles'],
    tags: ['analogy', 'metaphor', 'learning', 'transfer', 'explanation'],
  },

  {
    id: 'worked-example-fading',
    name: 'Worked Examples with Fading',
    aka: ['faded practice', 'scaffolded examples', 'completion problems'],
    origin: 'Cognitive load theory, John Sweller',
    domains: ['learning', 'engineering'],
    intents: ['explain', 'plan'],
    oneLiner:
      'Start with a fully worked example, then progressively remove steps for the learner to supply, rather than jumping from demonstration to blank page.',
    useWhen: [
      'I watched the tutorial and still cannot do it',
      'the jump from example to exercise is too big',
      'teaching someone a new technique',
      'learning a framework by doing',
      'I understand it when I read it and freeze when I try it',
    ],
    prompt:
      'Teach me this with faded worked examples. Start with one complete example, annotating not just what each step does but why it was chosen over the alternatives. Then give me the same class of problem with the last step removed for me to complete. Then with the last two removed. Keep fading until I am doing it unaided. If I get a step wrong, do not just correct it — tell me which decision in the worked example I failed to transfer, and re-fade from there.',
    why:
      'Annotating why each step was chosen over alternatives is what makes the example transferable. Steps alone teach imitation; choices teach the skill.',
    related: ['active-recall', 'feynman-technique', 'few-shot-examples'],
    tags: ['teaching', 'tutorial', 'practice', 'onboarding', 'skill building'],
  },
]
