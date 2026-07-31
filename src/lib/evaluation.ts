/**
 * The retrieval evaluation set.
 *
 * Two groups, kept apart on purpose.
 *
 * `TUNING_CASES` are the original end-to-end cases. The ranking has been tuned
 * against them for as long as they have existed, so a good score on them proves
 * only that nothing regressed.
 *
 * `HELD_OUT_CASES` were written afterwards, from the concept list alone, by
 * describing each idea the way someone would who had never met the term — and
 * deliberately avoiding the vocabulary that appears in that concept's own
 * fields. They are the ones that say whether retrieval actually works, because
 * no weight in the ranking was chosen with them in view.
 *
 * Several problems genuinely have more than one right answer, so a case may
 * accept any of a set. Where the alternatives are not really interchangeable
 * the case was dropped rather than fudged.
 */

export interface RetrievalCase {
  query: string
  /** Any one of these counts as correct. */
  expect: string[]
}

/**
 * Stream-of-consciousness cases for `triage()`, which cuts an input into the
 * problems it contains and answers each one.
 *
 * These are built by joining phrasings whose single-query behaviour is already
 * measured above, the way someone would actually run them together in one
 * message. That is deliberate and it is a limitation worth stating: it means
 * this set measures *splitting and merging* — does each strand still get its own
 * word once it is buried in a paragraph — and not retrieval quality, which the
 * cases above already cover. A ramble built from queries the ranker cannot
 * answer would fail here for reasons that have nothing to do with triage.
 */
export interface RambleCase {
  input: string
  /** One entry per problem in the input; any id in the entry counts as found. */
  expect: string[][]
  /** Expected number of threads, where the split is unambiguous. */
  threads?: number
}

export const RAMBLE_CASES: RambleCase[] = [
  {
    input:
      'ok so the deploy went out on friday and the site is slow and I have no idea which service to look at. and then when we sat down to write it up it turned into everyone blaming the new person. also I have to send the exec team a summary and my document buries the point so they stop reading',
    expect: [
      ['observability-triage', 'hypothesis-driven-debugging', 'root-cause-fishbone'],
      ['blameless-postmortem'],
      ['pyramid-principle', 'bluf'],
    ],
    threads: 3,
  },
  {
    input:
      'there is a class in this old service that looks completely pointless and I want to rip it out but honestly I am nervous. and the rewrite we started to replace the whole thing has been going for two years and shipped nothing',
    expect: [['chestertons-fence'], ['strangler-fig']],
  },
  {
    input:
      'everyone on the team has admin because it was easier that way and there is an api key sitting in the repo that was never rotated',
    expect: [['least-privilege'], ['secrets-management']],
  },
  {
    input:
      'the backlog is all P0 and the loudest stakeholder always wins. and when we do settle something it comes back up two weeks later because nobody knows who actually decides',
    expect: [['rice-scoring', 'moscow', 'eisenhower-matrix'], ['decision-roles-daci']],
  },
  {
    input:
      'claude keeps giving me answers that are generic and could apply to anyone, and then when I ask for a table it writes me an essay',
    expect: [['interview-me-first'], ['output-contract']],
  },
  {
    // The control. One problem, said once — triage must not turn this into a
    // committee of three concepts.
    input: 'the plan looks solid and nobody is objecting before we commit real money',
    expect: [['pre-mortem']],
    threads: 1,
  },
  {
    input:
      'users drop off somewhere in the signup flow and I cannot tell where. also the metric has been flat for a month but I think something is happening underneath it',
    expect: [['user-journey-mapping'], ['cohort-analysis']],
  },
  {
    input:
      'I need to give a colleague difficult feedback without it getting personal, plus I am preparing for a job interview myself and my answers ramble',
    expect: [['sbi-feedback', 'nonviolent-communication'], ['star-method']],
  },
  {
    input:
      'our estimate feels optimistic because we always run over on time — and separately I cannot tell which of these tasks is the one actually controlling the date',
    expect: [['reference-class-forecasting'], ['critical-path']],
  },
  {
    input:
      'the agent keeps editing the wrong files and ignoring our conventions. oh and it fixes whatever I complain about in the first attempt instead of trying something else',
    expect: [
      ['negative-space-prompting', 'context-priming'],
      ['sample-and-compare'],
    ],
  },
]

export const TUNING_CASES: RetrievalCase[] = [
  { query: 'my problem statement is too narrow and we jumped straight to a solution', expect: ['abstraction-laddering'] },
  { query: 'we keep fixing the same thing over and over and it comes back', expect: ['five-whys'] },
  { query: 'this old code looks useless and I want to delete it but I am nervous', expect: ['chestertons-fence'] },
  { query: 'the plan looks solid and nobody is objecting before we commit real money', expect: ['pre-mortem'] },
  { query: 'everything in the backlog is labelled P0 and the loudest stakeholder wins', expect: ['rice-scoring'] },
  { query: 'my emails are too long and busy people ignore them', expect: ['bluf'] },
  { query: 'the answers I get are generic and could apply to anyone', expect: ['interview-me-first'] },
  { query: 'the site is slow and I have no idea which service to look at', expect: ['observability-triage'] },
  { query: 'I need to give a colleague difficult feedback without it getting personal', expect: ['sbi-feedback'] },
  { query: 'I have been changing random things hoping the bug goes away', expect: ['hypothesis-driven-debugging'] },
  { query: 'it used to work last week and now it does not', expect: ['binary-search-debugging'] },
  { query: 'we need to cut scope to hit the date but the client says everything is essential', expect: ['moscow'] },
  { query: 'users asked for a feature but I do not know what they actually want', expect: ['jobs-to-be-done'] },
  { query: 'how do I remember what I read instead of forgetting it immediately', expect: ['active-recall'] },
  { query: 'I think I understand this but I cannot explain it to anyone', expect: ['feynman-technique'] },
  { query: 'we are setting a new KPI and I am worried the team will game it', expect: ['goodharts-law'] },
  { query: 'our estimate feels optimistic we always run over on time', expect: ['reference-class-forecasting'] },
  { query: 'the document buries the point and executives stop reading', expect: ['pyramid-principle'] },
  { query: 'everything it writes sounds the same and reads bland', expect: ['constraint-stacking'] },
  { query: 'it wrote three thousand words with the wrong structure', expect: ['progressive-disclosure'] },
  { query: 'should we build this ourselves or buy it, where is our differentiation', expect: ['wardley-mapping'] },
  { query: 'the metric is flat but I think something is happening underneath', expect: ['cohort-analysis'] },
  { query: 'users drop off somewhere in the flow and I cannot tell where', expect: ['user-journey-mapping'] },
  { query: 'I only have one idea and it is the obvious one', expect: ['crazy-eights'] },
  { query: 'this decision keeps coming back up and nobody knows who decides', expect: ['decision-roles-daci'] },
  { query: 'I am busy all day and never get to the important work', expect: ['eisenhower-matrix'] },
  { query: 'preparing for a job interview and my answers ramble', expect: ['star-method'] },
  { query: 'where do I even start building this, integration always breaks late', expect: ['walking-skeleton'] },
  { query: 'the agent keeps editing the wrong files and ignoring our conventions', expect: ['context-priming'] },
  { query: 'I need a rough market size and I have no data at all', expect: ['fermi-estimation'] },

  { query: 'I cannot test my business logic without spinning up a database', expect: ['hexagonal-architecture'] },
  { query: 'the screen gets into states that should not be possible and I cannot reproduce it', expect: ['mvi-architecture'] },
  { query: 'our view controllers are thousands of lines and nothing about the screen is testable', expect: ['mvvm-architecture'] },
  { query: 'the rewrite has taken two years and shipped nothing and we cannot pause feature work', expect: ['strangler-fig'] },
  { query: 'the vendor data model is spreading through our own code and making it ugly', expect: ['anti-corruption-layer'] },
  { query: 'the word customer means three different things across our system', expect: ['bounded-context'] },
  { query: 'the refactor branch has been open for months and cannot be merged', expect: ['branch-by-abstraction'] },
  { query: 'reads are slow because the schema is optimised for writing', expect: ['cqrs'] },
  { query: 'someone overwrote a value and we cannot tell what it used to be', expect: ['event-sourcing'] },
  { query: 'the payment went through but the order was never created', expect: ['saga-pattern'] },
  { query: 'our mobile app makes eleven calls just to render one screen', expect: ['backend-for-frontend'] },
  { query: 'it works on my machine and deploying takes a page of manual steps', expect: ['twelve-factor-app'] },
  { query: 'my business logic imports the database driver and I cannot mock it', expect: ['dependency-inversion'] },
  { query: 'SQL is scattered all through my service classes', expect: ['repository-pattern'] },
  { query: 'changing the database forced changes in our business rules', expect: ['clean-architecture'] },

  { query: 'everyone on the team has admin because it was easier that way', expect: ['least-privilege'] },
  { query: 'we have a firewall so surely we are fine', expect: ['defense-in-depth'] },
  { query: 'we need a security review before launch and I do not know where to start', expect: ['threat-modeling-stride'] },
  { query: 'anything inside our network can talk to anything else', expect: ['zero-trust'] },
  { query: 'if this credential leaked how bad would it actually be', expect: ['blast-radius'] },
  { query: 'if the auth service goes down does everything become public', expect: ['fail-closed'] },
  { query: 'debug endpoints are probably still enabled in production', expect: ['attack-surface-reduction'] },
  { query: 'one person can push straight to production with nobody looking', expect: ['separation-of-duties'] },
  { query: 'there is an API key committed in our repository and it was never rotated', expect: ['secrets-management'] },
  { query: 'we log everything just in case and keep it forever', expect: ['data-minimization'] },
  { query: 'we keep permanent admin because on call needs it during incidents', expect: ['break-glass-access'] },
  { query: 'where exactly should I be validating this user input', expect: ['trust-boundary'] },
  { query: 'how would we even know if one of our packages was compromised', expect: ['supply-chain-provenance'] },
]

export const HELD_OUT_CASES: RetrievalCase[] = [
  // Framing & diagnosis
  { query: 'I want to throw out a rule nobody seems to follow any more', expect: ['chestertons-fence'] },
  { query: 'everyone here just says this is how our industry does it', expect: ['first-principles'] },
  { query: 'I keep asking how to make my workaround behave instead of asking about the actual thing', expect: ['xy-problem'] },
  { query: 'what would guarantee this goes badly', expect: ['inversion', 'pre-mortem'] },
  { query: 'I need to talk it through out loud to somebody who will not interrupt', expect: ['rubber-duck-debugging'] },
  { query: 'lots of possible causes and I want to rule them out in a sensible order', expect: ['differential-diagnosis'] },
  { query: 'I only ever look at the first thing I suspect and miss whole categories', expect: ['root-cause-fishbone'] },
  { query: 'something went badly wrong and I do not want the write up to turn into finger pointing', expect: ['blameless-postmortem'] },
  { query: 'I need to separate what really happened from what people thought was happening', expect: ['timeline-reconstruction'] },

  // Decisions
  { query: 'the team argued for an hour and at the end nothing was actually settled', expect: ['decision-roles-daci'] },
  { query: 'we cannot undo this once it ships so how much should we agonise over it', expect: ['type-1-type-2-decisions'] },
  { query: 'I lost the argument but I still have to go and make this work', expect: ['disagree-and-commit'] },
  { query: 'the number went up but I do not think anything actually got better', expect: ['goodharts-law'] },
  { query: 'I want to know what happens two or three steps after this lands', expect: ['second-order-thinking'] },
  { query: 'a long shot with a huge payoff against a safe boring bet', expect: ['expected-value'] },
  { query: 'saying yes to this means saying no to something else and nobody counts that', expect: ['opportunity-cost'] },
  { query: 'four options and everyone is just voting on their favourite', expect: ['decision-matrix'] },
  { query: 'what evidence would prove me wrong about this', expect: ['falsification-test'] },
  { query: 'I want to make my opponents case better than they can make it themselves', expect: ['steelmanning'] },
  { query: 'I want somebody to genuinely try to tear this apart before we commit', expect: ['red-teaming'] },
  { query: 'which of the things we are taking for granted would sink us if it were false', expect: ['assumption-mapping'] },
  { query: 'what is conspicuously missing from my own analysis', expect: ['blind-spot-audit'] },

  // Planning & prioritisation
  { query: 'I can only fix one thing this quarter and improvements elsewhere seem to do nothing', expect: ['theory-of-constraints'] },
  { query: 'the date keeps moving and I cannot tell which tasks actually control it', expect: ['critical-path'] },
  { query: 'people keep telling me the work is finished and then it turns out it is not', expect: ['definition-of-done'] },
  { query: 'I have no idea how long this investigation will take so I cannot plan around it', expect: ['timeboxing'] },
  { query: 'we know where we want to be in three years but not what to do on Monday', expect: ['backcasting'] },
  { query: 'I want to check the idea is worth building before anyone writes code', expect: ['working-backwards', 'mvp-riskiest-assumption'] },
  { query: 'we are about to build a whole product on a guess nobody has ever checked', expect: ['mvp-riskiest-assumption'] },
  { query: 'the chunks of work are too big for anyone to size honestly', expect: ['work-breakdown-structure'] },
  { query: 'waiting another month on this one probably costs us more than the other one', expect: ['cost-of-delay'] },
  { query: 'some of these things customers just expect and some would actually delight them', expect: ['kano-model'] },
  { query: 'I have an outcome I want but no line from it to what anyone should build', expect: ['opportunity-solution-tree'] },

  // Writing & communication
  { query: 'my writing assumes the reader already knows things they do not', expect: ['reader-centric-rewrite'] },
  { query: 'the same explanation has to work for the chief executive and for an engineer', expect: ['audience-ladder'] },
  { query: 'the sentence is technically correct but I cannot tell who is doing what', expect: ['plain-language'] },
  { query: 'my slides are a list of facts and nobody feels why any of it matters', expect: ['story-spine'] },
  { query: 'I need a shape for the memo that sets up why this matters before the ask', expect: ['scqa'] },
  { query: 'I have to raise something with a teammate without it sounding like an attack on who they are', expect: ['nonviolent-communication', 'sbi-feedback'] },

  // Learning
  { query: 'I keep re-reading my notes and none of it sticks', expect: ['active-recall'] },
  { query: 'I want to relate this new system to one the new starter already knows well', expect: ['analogical-mapping'] },
  { query: 'showing them once and then leaving them with a blank page does not work', expect: ['worked-example-fading'] },
  { query: 'I want to be questioned until I notice the hole myself', expect: ['socratic-questioning'] },

  // Data & research
  { query: 'the average looks flat but I suspect recent signups behave nothing like the old ones', expect: ['cohort-analysis'] },
  { query: 'does this really cause that or is there something else driving both', expect: ['confounders-check'] },
  { query: 'twenty inputs in the model and I do not know which ones actually move the answer', expect: ['sensitivity-analysis'] },
  { query: 'two completely different methods gave me the same answer, is that meaningful', expect: ['triangulation'] },
  { query: 'I want to know what is already settled on this question and what is still argued about', expect: ['literature-scan'] },
  { query: 'roughly how many of these exist in the country, I have nothing to go on', expect: ['fermi-estimation'] },

  // Strategy & product
  { query: 'we picked five priorities and they quietly contradict each other', expect: ['playing-to-win'] },
  { query: 'everything we sell is the same as what everyone else sells', expect: ['blue-ocean-errc'] },
  { query: 'our goals doc has numbers under it but hitting them would not prove the goal', expect: ['okr-laddering'] },
  { query: 'I want to understand why a rival built it that way, not list their features', expect: ['competitive-teardown'] },

  // Design
  { query: 'I want defensible findings about this screen rather than my own taste', expect: ['heuristic-evaluation'] },
  { query: 'some people cannot use our product at all and I need to know who is blocked first', expect: ['accessibility-audit'] },
  { query: 'our menu is organised the way the company is organised and users cannot find anything', expect: ['information-architecture'] },
  { query: 'feedback on the mock turned into everyone stating preferences', expect: ['design-critique'] },

  // Security
  { query: 'a component falls over and half the company stops working', expect: ['blast-radius'] },
  { query: 'contractors still have working accounts a year after they left', expect: ['least-privilege'] },
  { query: 'the signup form collects a load of fields nobody has ever queried', expect: ['data-minimization'] },
  { query: 'if the permission check throws an exception what happens to the request', expect: ['fail-closed'] },
  { query: 'a library we depend on could ship anything at all in its next release', expect: ['supply-chain-provenance'] },
  { query: 'we sign in at the perimeter and after that nothing gets checked again', expect: ['zero-trust'] },
  { query: 'the same person raises the payment and approves it', expect: ['separation-of-duties'] },
  { query: 'I want to enumerate the ways each part could fail and fix the worst first', expect: ['fmea'] },

  // Working with AI
  { query: 'it gives me a wall of prose when I wanted three bullets and a table', expect: ['output-contract'] },
  { query: 'I asked for one change and it rewrote a load of things I never mentioned', expect: ['negative-space-prompting'] },
  { query: 'it answers instantly and confidently and the arithmetic is wrong', expect: ['chain-of-thought'] },
  { query: 'describing the tone I want never works, it drifts straight back', expect: ['few-shot-examples'] },
  { query: 'it hands me a first draft and I have to find the flaws myself every time', expect: ['self-critique-loop'] },
  { query: 'it fixes whatever I complain about in the first attempt instead of trying something else', expect: ['sample-and-compare'] },
  { query: 'I want it to judge this against stated standards, not tell me it looks good', expect: ['rubric-grading'] },
  { query: 'answering as a specific kind of expert changes the voice but not the substance', expect: ['role-and-rubric'] },
]
