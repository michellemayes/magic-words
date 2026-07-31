import type { Concept } from '../types'

export const diagnosis: Concept[] = [
  {
    id: 'rubber-duck-debugging',
    name: 'Rubber Duck Debugging',
    aka: ['rubber ducking', 'explain it line by line', 'talk it through'],
    origin: 'The Pragmatic Programmer',
    domains: ['engineering', 'learning'],
    intents: ['diagnose', 'explain'],
    oneLiner:
      'Explain the thing line by line to a patient listener; the act of articulating it exposes the gap you were skipping over.',
    useWhen: [
      'I have been staring at this for an hour',
      'the code looks right but does not work',
      'I do not even know what question to ask',
      'I need to talk this through',
      'my logic seems fine and the output is wrong',
    ],
    prompt:
      'Be my rubber duck. I am going to explain this code and what I expect it to do. Do not fix it and do not suggest solutions. Instead, ask me to clarify every step where my explanation skips something, asserts something without evidence, or uses a word like "obviously" or "just". When my stated expectation and the actual code diverge, point at the exact line and ask me what I think it does — do not tell me.',
    why:
      'The bug is almost always inside the step you skip when narrating. A model told to fix it will fix it and you will learn nothing; a model told to interrogate the narration finds the gap and it stays found.',
    related: ['xy-problem', 'hypothesis-driven-debugging', 'socratic-questioning', 'binary-search-debugging'],
    tags: ['debugging', 'stuck', 'code', 'explanation', 'programming'],
  },

  {
    id: 'hypothesis-driven-debugging',
    name: 'Hypothesis-Driven Debugging',
    aka: ['scientific debugging', 'predict then test', 'debugging by hypothesis'],
    origin: 'Andreas Zeller, Why Programs Fail',
    domains: ['engineering', 'data'],
    intents: ['diagnose'],
    oneLiner:
      'Write down a specific hypothesis and the observation that would refute it, then run one experiment at a time instead of changing things until it works.',
    useWhen: [
      'I have been changing random things hoping it works',
      'I fixed it but I do not know what fixed it',
      'the bug is intermittent',
      'too many possible causes',
      'shotgun debugging is not working',
    ],
    prompt:
      'Debug this scientifically. Generate a ranked list of hypotheses for the cause, each stated precisely enough to be wrong. For the top hypothesis, tell me the single cheapest observation that would distinguish it from the others — one that gives a different result depending on whether it is true — and what result would refute it. One experiment at a time; wait for my result before proposing the next. Do not suggest fixes until a hypothesis survives a test.',
    why:
      'Models are strongly biased toward proposing fixes immediately. Withholding fixes until a hypothesis survives a discriminating test is what converts guessing into debugging, especially for intermittent bugs where a random change appears to work.',
    related: ['binary-search-debugging', 'differential-diagnosis', 'rubber-duck-debugging', 'five-whys'],
    tags: ['debugging', 'scientific method', 'intermittent bug', 'engineering', 'troubleshooting'],
  },

  {
    id: 'binary-search-debugging',
    name: 'Binary Search Debugging',
    aka: ['bisection', 'git bisect', 'halving the search space', 'wolf fence'],
    origin: 'Classic technique; formalised by git bisect',
    domains: ['engineering'],
    intents: ['diagnose'],
    oneLiner:
      'Halve the search space with each test — in commits, in inputs, or in the pipeline — instead of scanning linearly.',
    useWhen: [
      'it used to work and now it does not',
      'it worked fine last week and something since then broke it',
      'somewhere in this huge pipeline something breaks',
      'which commit broke it',
      'the input file is enormous and one row is bad',
      'the config used to be fine',
    ],
    prompt:
      'Find this by bisection rather than by inspection. Define the search space precisely, confirm a known-good and a known-bad endpoint, and tell me the exact midpoint test to run first and what each outcome would mean. Keep giving me one test at a time based on my results. Warn me up front about anything that would break the monotonicity assumption bisection depends on — flaky tests, unrelated breakage in the middle of the range, or state that carries between runs.',
    why:
      'The monotonicity warning is what stops a bisection from confidently converging on the wrong commit, which is the standard way this technique fails in practice.',
    related: ['hypothesis-driven-debugging', 'differential-diagnosis', 'timeline-reconstruction'],
    tags: ['debugging', 'bisect', 'regression', 'git', 'search'],
  },

  {
    id: 'differential-diagnosis',
    name: 'Differential Diagnosis',
    aka: ['differential', 'rule out list', 'what else could it be'],
    origin: 'Clinical medicine',
    domains: ['engineering', 'data', 'research'],
    intents: ['diagnose'],
    oneLiner:
      'List every condition consistent with the symptoms, then order tests by how much each one narrows the field.',
    useWhen: [
      'the symptom could have several causes',
      'I keep fixating on one explanation',
      'what else could explain this',
      'the obvious cause turned out not to be it',
      'performance regression with no clear source',
    ],
    prompt:
      'Give me a differential diagnosis for these symptoms. List every plausible cause consistent with all the evidence, including the boring and the rare ones, with a rough prior for each. Explicitly name the ones I appear to have already ruled out and ask whether I actually tested them or just assumed. Then order the diagnostic tests by information gain — which single check eliminates the largest share of the list — not by ease.',
    why:
      'Ordering by information gain rather than by convenience is the difference between three tests and eleven. The "ruled out or assumed" question catches the most common diagnostic failure.',
    related: ['hypothesis-driven-debugging', 'root-cause-fishbone', 'binary-search-debugging', 'observability-triage'],
    tags: ['diagnosis', 'troubleshooting', 'root cause', 'medicine', 'systematic'],
  },

  {
    id: 'root-cause-fishbone',
    name: 'Fishbone (Ishikawa) Analysis',
    aka: ['ishikawa diagram', 'cause and effect diagram', 'fishbone', '6Ms'],
    origin: 'Kaoru Ishikawa, quality management',
    domains: ['engineering', 'product', 'strategy'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Group candidate causes into categories branching off the problem, so you search the whole space instead of the first branch you thought of.',
    useWhen: [
      'the failure had more than one cause',
      'five whys gave me a single line and that felt incomplete',
      'quality problems keep coming from different directions',
      'we need a structured cause analysis for a review',
      'the team each blame a different thing',
    ],
    prompt:
      'Build a fishbone analysis for this problem. Use the categories People, Process, Tooling, Environment, Data, and Design — adapt them if a better set fits. Under each, list specific candidate causes, going two levels deep where you can. Then mark which causes have supporting evidence, which are speculation, and which combination of causes would have to co-occur to produce exactly the failure we saw. Finish with the three cheapest checks that would confirm or eliminate whole branches.',
    why:
      'Categories force lateral search. Left unstructured, both people and models elaborate the first plausible branch and never look at the others — which is precisely how multi-cause failures get half-fixed.',
    related: ['five-whys', 'differential-diagnosis', 'blameless-postmortem', 'fmea'],
    tags: ['root cause', 'quality', 'structured analysis', 'multi-cause', 'incident'],
  },

  {
    id: 'blameless-postmortem',
    name: 'Blameless Postmortem',
    aka: ['incident retrospective', 'postmortem', 'learning review'],
    origin: 'Site reliability engineering practice (Google SRE, Etsy)',
    domains: ['engineering', 'career'],
    intents: ['diagnose', 'communicate'],
    oneLiner:
      'Reconstruct an incident on the assumption that everyone acted sensibly given what they knew, so the analysis lands on the system rather than a person.',
    useWhen: [
      'we had an outage and need to write it up',
      'the retro turned into finger pointing',
      'how do we stop this happening again',
      'writing an incident report for leadership',
      'someone made a mistake and I do not want to punish them',
    ],
    prompt:
      'Write this as a blameless postmortem. Assume every person acted reasonably given the information available to them at that moment — where a decision looks wrong in hindsight, explain what made it look right at the time. Structure it as: impact in user terms, timeline with what was known at each step, contributing factors, what went well, and action items. Every action item must change a system, a default, an alert, or a piece of documentation. Reject any action item that amounts to "be more careful" or "add a review step" without a mechanism.',
    why:
      'The "looked right at the time" reconstruction is what makes a postmortem actionable — it identifies the missing signal rather than the missing diligence, and only the former can be fixed.',
    related: ['five-whys', 'root-cause-fishbone', 'timeline-reconstruction', 'sbi-feedback'],
    tags: ['incident', 'outage', 'retrospective', 'sre', 'culture'],
  },

  {
    id: 'timeline-reconstruction',
    name: 'Timeline Reconstruction',
    aka: ['incident timeline', 'sequence of events', 'what happened when'],
    origin: 'Incident response and accident investigation',
    domains: ['engineering', 'research'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Build a strict chronological record separating what happened from what was observed from what was believed, before attempting explanation.',
    useWhen: [
      'I have logs and alerts and slack messages and no clear story',
      'people disagree about what happened first',
      'the incident is confusing and I need order',
      'writing up a complicated failure',
      'correlating events across systems',
    ],
    prompt:
      'Reconstruct a timeline from this material. Keep three columns strictly separate: what actually happened (with timestamps), what was observed or alerted at that moment, and what the responders believed at that moment. Mark gaps where we have no data rather than smoothing over them, and mark any ordering you inferred rather than observed. Do not offer a causal explanation yet — I want the chronology clean first. Then tell me where the largest gap between reality and belief opened up, because that is where detection failed.',
    why:
      'Separating happened / observed / believed is the technique. Merged into one narrative, hindsight contaminates the record and the detection gap — usually the real finding — becomes invisible.',
    related: ['blameless-postmortem', 'root-cause-fishbone', 'binary-search-debugging', 'observability-triage'],
    tags: ['incident', 'timeline', 'forensics', 'logs', 'investigation'],
  },

  {
    id: 'observability-triage',
    name: 'RED / USE Method Triage',
    aka: ['RED method', 'USE method', 'golden signals', 'observability triage'],
    origin: 'Brendan Gregg (USE), Tom Wilkie (RED), Google SRE (golden signals)',
    domains: ['engineering', 'data'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Check services by Rate, Errors and Duration, and resources by Utilisation, Saturation and Errors — a fixed checklist that finds the layer at fault fast.',
    useWhen: [
      'the site is slow and I do not know where to look',
      'which service is causing this',
      'what dashboards should we even have',
      'production is degraded and I am panicking',
      'we have metrics everywhere and no signal',
    ],
    prompt:
      'Triage this using RED for services and USE for resources. For each service in the path, walk Rate, Errors and Duration; for each resource — CPU, memory, disk, network, connection pools, thread pools — walk Utilisation, Saturation and Errors. Tell me which specific metric to look at first and what value would implicate that layer versus exonerate it. Saturation before utilisation: queue depth and wait time tell you more than a busy percentage. End with the single most likely layer given what I have described.',
    why:
      'A fixed checklist beats intuition under pressure. It is the same reason pilots use them: the failure mode of an expert in an outage is skipping a layer they are sure is fine.',
    related: ['differential-diagnosis', 'theory-of-constraints', 'timeline-reconstruction', 'fmea'],
    tags: ['observability', 'performance', 'production', 'monitoring', 'sre'],
  },
]
