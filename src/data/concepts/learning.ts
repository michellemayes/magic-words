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

  {
    id: 'spaced-repetition',
    name: 'Spaced Repetition System',
    aka: ['SRS', 'Anki cards', 'Leitner system', 'minimum information principle'],
    origin: 'Sebastian Leitner (1972); Piotr Wozniak, SuperMemo and the twenty rules of formulating knowledge',
    domains: ['learning'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Turn material into small cards that each test one fact, and review each card on a widening schedule timed to just before you would lose it.',
    useWhen: [
      'turn my notes into flashcards that actually work',
      'my Anki deck is full of cards I hate reviewing',
      'learning vocabulary for a new language over months',
      'I need to keep hundreds of facts for the long term, not just for next week',
      'building a deck for medical or law school',
    ],
    prompt:
      'Turn this material into spaced repetition cards. Follow the minimum information principle: each card tests exactly one fact, with a question that has one clear answer. Split any list or multi-part answer into separate cards, or use cloze deletions. Word the prompt so it cannot be answered by recognising its shape. Add a short context tag to cards that would be ambiguous alone. Skip anything I would not care about forgetting. Output as a two-column table (front, back) I can import, then list any ideas you left out because they are understanding rather than facts and need a different kind of practice.',
    why:
      'Models turning notes into flashcards tend to copy whole paragraphs onto the back of a card, which makes reviews slow and recall fuzzy. Naming the minimum information principle and asking for splits and clozes produces cards that survive months of review, and the "left out" list stops the deck pretending to cover concepts it cannot.',
    watchOut:
      'Cards preserve facts, not understanding. Learn the idea first; use the deck to keep it.',
    related: ['active-recall', 'interleaving', 'desirable-difficulties', 'elaborative-interrogation'],
    tags: ['flashcards', 'memory', 'anki', 'study', 'language learning'],
  },

  {
    id: 'interleaving',
    name: 'Interleaved Practice',
    aka: ['interleaving', 'mixed practice', 'shuffled problem sets'],
    origin: 'Rohrer & Taylor (2007); Kornell & Bjork (2008)',
    domains: ['learning'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Mix different problem types in one practice session instead of doing a block of each, so you learn to pick the method as well as run it.',
    useWhen: [
      'I can do each chapter\'s exercises but fail the mixed exam',
      'I know how to solve it once someone tells me which technique to use',
      'practising the same kind of problem twenty times in a row',
      'my study sessions go through one topic at a time',
      'I freeze when a question does not say which topic it is from',
    ],
    prompt:
      'Build me an interleaved practice set from these topics. Mix the problem types so no two consecutive problems use the same method, and strip any labels, headings or chapter references that give away which method applies. Include a few pairs that look similar on the surface but need different approaches. For each problem, ask me first to name which method I would use and why, before solving it. After I answer, tell me whether my choice of method was right, separately from whether the working was right, and keep a tally of which types I confuse with which.',
    why:
      'Practice sets from a model default to grouping by topic, because that is how textbooks are laid out. Removing labels and asking for the method choice first targets the skill blocked practice never trains: recognising which tool the problem needs.',
    watchOut:
      'Interleave only once you can do each type on its own. Mixing before that just produces confusion.',
    related: ['desirable-difficulties', 'spaced-repetition', 'deliberate-practice', 'worked-example-fading'],
    tags: ['practice', 'study', 'exam prep', 'problem solving', 'maths'],
  },

  {
    id: 'deliberate-practice',
    name: 'Deliberate Practice',
    aka: ['purposeful practice', 'targeted practice', 'the 10,000 hours research'],
    origin: 'K. Anders Ericsson (1993); Ericsson & Pool, Peak',
    domains: ['learning', 'career'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Improve by working on one specific weakness at the edge of your ability, with immediate feedback, rather than by repeating what you can already do.',
    useWhen: [
      'I have been doing this for years and I am not getting better',
      'I have plateaued at intermediate',
      'I practise every day but it is the same stuff',
      'how do I actually get good at public speaking or writing or code review',
      'I do not know what to work on to improve',
    ],
    prompt:
      'Design a deliberate practice plan for this skill. First, break the skill into sub-skills and ask me questions until you can say which one is my current bottleneck. Then design a drill for that one sub-skill: short, repeatable, slightly beyond what I can do reliably now, with a clear success criterion. Say where the feedback comes from on each repetition (a reference answer, a recording, a mentor, a test) since practice without feedback is just repetition. Give me the session length, how I will know I have outgrown the drill, and what the next bottleneck is likely to be.',
    why:
      'Ask a model how to improve and it lists general advice (practise more, read books, find a mentor). Making it diagnose one bottleneck and build a drill with a feedback source produces something you can do tomorrow and measure.',
    watchOut:
      'Deliberate practice is tiring and not fun; an hour of it is a lot. Keep ordinary, enjoyable practice alongside it for motivation.',
    related: ['interleaving', 'desirable-difficulties', 'scaffolding-zpd', 'worked-example-fading', 'feynman-technique'],
    tags: ['skill building', 'practice', 'improvement', 'expertise', 'plateau'],
  },

  {
    id: 'scaffolding-zpd',
    name: 'Scaffolding in the Zone of Proximal Development',
    aka: ['zone of proximal development', 'ZPD', 'instructional scaffolding', 'just-right challenge'],
    origin: 'Lev Vygotsky; scaffolding coined by Wood, Bruner & Ross (1976)',
    domains: ['learning', 'career'],
    intents: ['explain', 'plan'],
    oneLiner:
      'Teach at the level just beyond what the learner can do alone but can do with help, and remove the help piece by piece as they take over.',
    useWhen: [
      'the explanation is either way too basic or way over my head',
      'mentoring a junior who is either bored or drowning',
      'how much should I help without doing it for them',
      'tutoring my kid and I end up just giving the answers',
      'pitch this at my level, not a beginner\'s and not an expert\'s',
    ],
    prompt:
      'Teach this at the edge of what I can already do. Start by asking me two or three diagnostic questions, or giving me a short task, to find what I can do unaided and where I get stuck. Then pitch the next step just past that point. When I get stuck, give the smallest hint that gets me moving, in increasing strength: a question, then a pointer to the relevant idea, then a partial step, and only then the answer. Tell me which level of hint you are giving. As I succeed, give less help on the next problem, and tell me when you think I can do this kind of task alone.',
    why:
      'By default a model either explains everything from scratch or answers at expert level, and when you are stuck it gives the full solution. Asking for diagnosis first and a graded ladder of hints keeps it in the band where you are learning rather than watching.',
    watchOut:
      'Diagnosis only works if you answer honestly. Saying you understand something you do not will pitch everything too high.',
    related: ['worked-example-fading', 'socratic-questioning', 'deliberate-practice', 'blooms-taxonomy', 'audience-ladder'],
    tags: ['teaching', 'mentoring', 'tutoring', 'hints', 'difficulty'],
  },

  {
    id: 'elaborative-interrogation',
    name: 'Elaborative Interrogation',
    aka: ['asking why', 'why is this true', 'self-explanation'],
    origin: 'Pressley et al. (1987); rated in Dunlosky et al. (2013) review of study techniques',
    domains: ['learning'],
    intents: ['explain', 'critique'],
    oneLiner:
      'For each fact you learn, ask and answer why it is true and how it connects to what you already know, so it hooks into a structure instead of floating alone.',
    useWhen: [
      'I memorised the facts but they do not connect to anything',
      'it feels like a list of arbitrary rules',
      'I can recite it but could not reason from it',
      'history dates and names that just will not stick',
      'why does this work the way it does',
    ],
    prompt:
      'Take me through this material by elaborative interrogation. For each key claim, ask me "why would this be true?" or "why this and not something else?" and wait for my answer before continuing. If my answer is right, push one level further: why is that true, or what would change if it were not. If it is wrong or vague, point to what I already know that should lead me to the reason, rather than stating it. After each claim, have me say in one sentence how it connects to an earlier one. At the end, show me the chain of reasons we built as a short outline.',
    why:
      'A model explaining material tends to give the facts and the reasons together, so you never have to produce the reason yourself. Making it ask why and wait turns reading into generation, which is what makes the fact stick.',
    watchOut:
      'It works best when you already have some background to reason from. On completely new ground, read an explanation first, then interrogate it.',
    related: ['feynman-technique', 'socratic-questioning', 'active-recall', 'concept-mapping'],
    tags: ['study', 'understanding', 'questioning', 'memory', 'reasoning'],
  },

  {
    id: 'concept-mapping',
    name: 'Concept Mapping',
    aka: ['concept map', 'knowledge map', 'propositional map'],
    origin: 'Joseph Novak, Cornell University (1972)',
    domains: ['learning', 'writing'],
    intents: ['structure', 'explain'],
    oneLiner:
      'Draw the key ideas as nodes and label every link with the relationship between them, so the map states propositions rather than just grouping topics.',
    useWhen: [
      'I know all the terms but not how they fit together',
      'my notes are a pile of disconnected pages',
      'show me how all these parts of the subject relate',
      'a mind map did not help, it was just a list with lines',
      'I need to see the big picture of a new field',
    ],
    prompt:
      'Build a concept map of this topic. Start with a focus question the map should answer. Pick 12 to 20 key concepts. Connect them with labelled links, where every link reads as a sentence: concept, verb phrase, concept (for example "enzymes lower activation energy"). Arrange it from the most general concepts to the most specific. Add at least three cross-links between distant branches, since those show real understanding. Output it as a list of propositions and as Mermaid graph code. Then ask me to fill in the labels on five links you have left blank.',
    why:
      'Asked for a map, a model often produces a mind map: a tree of topics with unlabelled branches that says nothing about how ideas relate. Requiring every link to read as a sentence, plus cross-links, forces it to state the relationships, which are what you are trying to learn.',
    watchOut:
      'A map the model builds for you is a summary. The learning comes from building or correcting one yourself, so use the blank links.',
    related: ['elaborative-interrogation', 'analogical-mapping', 'information-architecture', 'feynman-technique'],
    tags: ['diagram', 'knowledge structure', 'study', 'mind map', 'notes'],
  },

  {
    id: 'blooms-taxonomy',
    name: 'Bloom\'s Taxonomy',
    aka: ['revised Bloom\'s taxonomy', 'learning objectives levels', 'cognitive levels'],
    origin: 'Benjamin Bloom (1956); revised by Anderson & Krathwohl (2001)',
    domains: ['learning', 'career'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Write learning objectives and assessments at an explicit level of thinking (remember, understand, apply, analyse, evaluate, create) so the course tests what it claims to teach.',
    useWhen: [
      'writing learning objectives for a course or workshop',
      'my quiz only tests whether people memorised definitions',
      'designing a training session for new hires',
      'the lesson plan is a list of topics with no clear outcomes',
      'people pass the training and still cannot do the job',
    ],
    prompt:
      'Design this lesson using Bloom\'s taxonomy. First, write 4 to 6 learning objectives, each starting with a measurable verb and labelled with its level (remember, understand, apply, analyse, evaluate, create). Make sure the objectives reach the level the learner actually needs for their job, not just remember and understand. For each objective, give one activity and one assessment question at that same level, and check that the assessment could not be passed by recall alone when the objective is higher. Present it as a table: objective, level, activity, assessment. Finally, flag any objective using an unmeasurable verb like "know" or "appreciate".',
    why:
      'Left alone, a model writes objectives with vague verbs and quizzes that test recall, because those are easiest to generate. Forcing a level on each row and matching the assessment to it exposes the gap between what the course promises and what it checks.',
    watchOut:
      'The levels are a guide, not a strict ladder. Real tasks mix levels, and you do not have to master every lower level before attempting a higher one.',
    related: ['scaffolding-zpd', 'worked-example-fading', 'rubric-grading', 'definition-of-done'],
    tags: ['instructional design', 'teaching', 'learning objectives', 'training', 'curriculum'],
  },

  {
    id: 'desirable-difficulties',
    name: 'Desirable Difficulties',
    aka: ['productive struggle', 'learning versus performance', 'illusion of fluency'],
    origin: 'Robert A. Bjork (1994)',
    domains: ['learning'],
    intents: ['reframe', 'plan'],
    oneLiner:
      'Conditions that make learning feel slower and harder, such as testing, spacing, mixing and generating answers, tend to make it last longer; smooth study often only feels effective.',
    useWhen: [
      'studying feels easy but I do badly on the exam',
      'rereading my notes feels productive but nothing sticks',
      'the course was great and a month later I remember nothing',
      'I want a study plan that actually works rather than one that feels good',
      'training went smoothly but people could not apply it',
    ],
    prompt:
      'Redesign my study plan using desirable difficulties. List each thing I currently do and say whether it builds long-term learning or just makes the session feel smooth. Replace the smooth ones with harder versions: rereading becomes self-testing, massed sessions become spaced ones, blocked topics become mixed, and reading solutions becomes attempting the problem first. For each change, predict how it will feel (slower, more errors) so I do not abandon it. Also tell me which difficulties would be too much given my current level, because a difficulty only helps if I can eventually succeed at it.',
    why:
      'Asked for a study plan, a model tends to optimise for a pleasant experience: summaries, highlights, neat progressions. Naming desirable difficulties tells it that effort is the goal, and predicting the discomfort in advance stops you from reading it as failure.',
    watchOut:
      'Difficulty is only desirable if you can overcome it. For a real beginner, piling on hard conditions just causes failure; add them as competence grows.',
    related: ['active-recall', 'spaced-repetition', 'interleaving', 'deliberate-practice', 'elaborative-interrogation'],
    tags: ['study', 'memory', 'learning science', 'exam prep', 'training'],
  },
]
