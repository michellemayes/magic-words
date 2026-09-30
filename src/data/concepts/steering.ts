import type { Concept } from '../types'

export const steering: Concept[] = [
  {
    id: 'interview-me-first',
    name: 'Interview Me First',
    aka: ['elicitation before generation', 'ask before you answer', 'requirements interview'],
    origin: 'Prompting practice',
    domains: ['meta'],
    intents: ['steer', 'reframe'],
    oneLiner:
      'Make the model interrogate you before it produces anything, so it works from your actual context rather than a plausible average one.',
    useWhen: [
      'the answer is generic and could apply to anyone',
      'it does not know enough about my situation',
      'I keep having to correct the output',
      'I do not know how to describe what I want',
      'the first draft is always wrong in the same ways',
    ],
    prompt:
      'Before you write anything, interview me. Ask the questions whose answers would most change what you produce — the ones where a different answer means a different artefact, not the ones that merely add colour. One question at a time, and stop as soon as further questions would not change the output. Then tell me what you have assumed about anything I did not cover, before you start.',
    variants: [
      {
        label: 'When you are short on time',
        prompt:
          'Ask me the three questions whose answers would most change your output, then proceed with explicit assumptions for everything else. Mark the assumptions clearly at the top so I can correct the ones you got wrong.',
      },
    ],
    why:
      'Generic output is almost always an underspecified prompt rather than a model limitation. Handing the elicitation to the model is more reliable than trying to anticipate what it needs, because it knows which of its own degrees of freedom are open.',
    watchOut:
      'Without the "stop when questions stop mattering" clause you will get interrogated for fifteen turns.',
    related: ['xy-problem', 'output-contract', 'context-priming', 'socratic-questioning'],
    tags: ['prompting', 'context', 'generic output', 'requirements', 'ai'],
  },

  {
    id: 'output-contract',
    name: 'Output Contract',
    aka: ['schema first prompting', 'specify the format', 'response contract'],
    origin: 'Prompting practice; structured output',
    domains: ['meta', 'engineering'],
    intents: ['steer', 'structure'],
    oneLiner:
      'Specify the exact shape of the answer — sections, field types, length, ordering — before asking for the content.',
    useWhen: [
      'the output is right but in an unusable format',
      'I need consistent structure across many runs',
      'it writes essays when I want a table',
      'I am parsing the output programmatically',
      'the response is too long every time',
    ],
    prompt:
      'Respond in exactly this structure and nothing else: [define your sections, fields and types]. Rules: every field is required; write "unknown" rather than guessing; no preamble, no summary, no closing offer to help. If the content does not fit the structure, say so in a field called "contract_violation" and explain why rather than silently reshaping it.',
    variants: [
      {
        label: 'When you keep getting essays',
        prompt:
          'Answer in at most five bullets of under 20 words each. No introduction, no conclusion, no restating my question. If that is genuinely not enough space for a correct answer, give me the five bullets plus one sentence explaining what is being lost.',
      },
    ],
    why:
      'The contract_violation escape hatch is what stops the model silently mangling content to fit a shape you specified badly — which is otherwise the failure mode of rigid formats.',
    related: ['constraint-stacking', 'few-shot-examples', 'rubric-grading', 'definition-of-done'],
    tags: ['prompting', 'format', 'structured output', 'json', 'consistency'],
  },

  {
    id: 'role-and-rubric',
    name: 'Role and Rubric Priming',
    aka: ['persona prompting', 'act as', 'expert framing with criteria'],
    origin: 'Prompting practice',
    domains: ['meta'],
    intents: ['steer'],
    oneLiner:
      'Assign a specific expert perspective *and* the criteria that expert would judge by — the role alone changes tone, the rubric changes substance.',
    useWhen: [
      'the answer is surface level',
      'act as a prompt did not really help',
      'I want the level of a senior specialist',
      'the response reads like a blog post not an expert',
      'I need domain-specific judgement',
    ],
    prompt:
      'Take the role of [specific expert — not "an expert" but e.g. a staff SRE who has run this class of system at scale for a decade]. Before answering, state the four criteria someone in that role would judge this by, and what separates excellent from merely adequate on each. Then answer, and score your own answer against those criteria, calling out where it falls short. Use the vocabulary and the standards of that role, including the trade-offs a generalist would not know to raise.',
    why:
      'A role by itself mostly changes register. Making the model derive the rubric first — and then grade itself against it — is what changes the substance, because it establishes a standard before it commits to an answer.',
    watchOut:
      'A role does not add knowledge the model lacks. It focuses what it has, and it can also make a confident answer sound more authoritative than it deserves.',
    related: ['rubric-grading', 'self-critique-loop', 'output-contract', 'red-teaming'],
    tags: ['prompting', 'persona', 'expertise', 'depth', 'ai'],
  },

  {
    id: 'self-critique-loop',
    name: 'Self-Critique Loop',
    aka: ['reflexion', 'draft critique revise', 'second pass'],
    origin: 'Reflexion (Shinn et al.); standard editing practice',
    domains: ['meta', 'writing'],
    intents: ['steer', 'critique'],
    oneLiner:
      'Have the model draft, then critique its own draft against explicit criteria, then revise — as three separate steps in one turn.',
    useWhen: [
      'the first draft is always mediocre',
      'I keep asking it to try again',
      'the output has obvious flaws it should have caught',
      'I want a higher quality answer without more back and forth',
      'important document and one shot at it',
    ],
    prompt:
      'Do this in three labelled passes. Pass 1: write the draft. Pass 2: critique your own draft as a hostile expert reviewer would — be specific about weaknesses and name the three biggest, and do not merely praise it. Pass 3: rewrite, fixing what pass 2 identified. Show all three passes. In pass 2, if you cannot find three real weaknesses, say so explicitly rather than inventing filler criticism.',
    why:
      'Making the passes visible and labelled is what forces genuine revision. Asked to "write a really good X", a model produces one draft; asked to critique and revise, it produces measurably different output because the critique is in context when it rewrites.',
    watchOut:
      'Self-critique catches structural and completeness problems well and factual errors poorly — it cannot check what it does not know.',
    related: ['role-and-rubric', 'rubric-grading', 'red-teaming', 'sample-and-compare'],
    tags: ['prompting', 'quality', 'revision', 'drafting', 'ai'],
  },

  {
    id: 'sample-and-compare',
    name: 'Sample and Compare',
    aka: ['self consistency', 'generate three then pick', 'parallel drafts'],
    origin: 'Self-consistency decoding (Wang et al.)',
    domains: ['meta'],
    intents: ['steer', 'ideate'],
    oneLiner:
      'Generate several independent attempts before evaluating any of them, then synthesise — rather than iterating on the first one.',
    useWhen: [
      'the first answer might be a local optimum',
      'I want to see the range of possible approaches',
      'the answer varies a lot between runs',
      'iterating on the first draft is not getting anywhere',
      'high stakes answer and I want confidence',
    ],
    prompt:
      'Generate three genuinely different approaches to this before evaluating any of them — different in strategy, not in wording. Do not let the first influence the others; if approach two is a variation on approach one, discard it and find a real alternative. Then compare them against the criteria that matter here, name the strongest, and build a final answer from it while grafting in the best specific idea from each of the others.',
    why:
      'Committing to "no evaluation until all three exist" is what prevents anchoring. The graft step is what makes this beat simply picking a winner.',
    related: ['self-critique-loop', 'crazy-eights', 'decision-matrix', 'role-and-rubric'],
    tags: ['prompting', 'variance', 'options', 'quality', 'ai'],
  },

  {
    id: 'constraint-stacking',
    name: 'Constraint Stacking',
    aka: ['add constraints to improve creativity', 'negative constraints', 'forbidden list'],
    origin: 'Creative practice; applied to prompting',
    domains: ['meta', 'writing', 'design'],
    intents: ['steer', 'ideate'],
    oneLiner:
      'Add explicit prohibitions and hard limits — the constraints are what push output off the obvious default path.',
    useWhen: [
      'everything it produces sounds the same',
      'the output is bland and generic',
      'it keeps using the same words and structures',
      'I want something more surprising',
      'the ideas are all safe',
    ],
    prompt:
      'Do this under hard constraints. Forbidden: [the specific words, structures, framings or clichés you keep seeing]. Required: [a specific form, length, or perspective]. Additionally, the answer must not use the most obvious approach, must fit in [limit], and must be defensible to a skeptical expert. If a constraint makes the task impossible rather than merely harder, tell me which one and why instead of quietly breaking it.',
    why:
      'Bland output is the model taking the highest-probability path. Constraints raise the cost of that path, and negative constraints — a named forbidden list — do more work than positive instructions.',
    related: ['output-contract', 'crazy-eights', 'negative-space-prompting', 'sample-and-compare'],
    tags: ['prompting', 'creativity', 'generic output', 'voice', 'constraints'],
  },

  {
    id: 'negative-space-prompting',
    name: 'Negative Space Prompting',
    aka: ['tell it what not to do', 'scope exclusion', 'out of scope list'],
    origin: 'Prompting practice',
    domains: ['meta'],
    intents: ['steer'],
    oneLiner:
      'State explicitly what is out of scope, so the model spends its effort on the part you actually care about.',
    useWhen: [
      'it keeps solving a problem I did not ask about',
      'the answer covers everything and commits to nothing',
      'it keeps adding caveats and alternatives I do not want',
      'it rewrites things I asked it to leave alone',
      'too much unnecessary preamble',
    ],
    prompt:
      'Here is what is explicitly out of scope: [list]. Do not address, mention, or hedge about any of it — assume it is handled. Do not restate my question, do not summarise what you are about to do, and do not offer follow-up help at the end. Focus entirely on [the specific thing]. If something out of scope genuinely blocks the in-scope work, say so in one line and stop rather than working around it.',
    why:
      'Models cover the whole plausible space by default because that is what looks helpful. Explicit exclusions convert breadth into depth, and the "say so and stop" clause keeps you from losing a genuine blocker.',
    related: ['constraint-stacking', 'output-contract', 'moscow', 'context-priming'],
    tags: ['prompting', 'scope', 'focus', 'concise', 'ai'],
  },

  {
    id: 'context-priming',
    name: 'Context Priming',
    aka: ['orient before asking', 'repo tour', 'load the context first'],
    origin: 'Agentic coding practice',
    domains: ['meta', 'engineering'],
    intents: ['steer', 'explain'],
    oneLiner:
      'Have the model build and state its understanding of the terrain before you ask it to change anything.',
    useWhen: [
      'it made changes that do not fit our conventions',
      'the agent is editing the wrong files',
      'it does not understand our codebase',
      'starting work in an unfamiliar repository',
      'the suggestions ignore how we actually do things',
    ],
    prompt:
      'Before making any changes, orient yourself and report back. Tell me: the architecture in five sentences, the conventions this codebase actually follows (as evidenced by the code, not by any style guide), where the code relevant to my task lives, what the existing tests cover, and what surprised you. Then state what you would change and why, and wait for me to confirm before touching anything.',
    why:
      '"Conventions as evidenced by the code, not the style guide" is the key phrase — it produces the real conventions rather than the aspirational ones, and it is what makes generated code stop looking foreign.',
    related: ['interview-me-first', 'negative-space-prompting', 'chain-of-thought', 'literature-scan'],
    tags: ['agents', 'coding', 'codebase', 'conventions', 'ai'],
  },

  {
    id: 'chain-of-thought',
    name: 'Reason Before Answering',
    aka: ['chain of thought', 'think step by step', 'show your working'],
    origin: 'Wei et al., 2022',
    domains: ['meta'],
    intents: ['steer'],
    oneLiner:
      'Make the model work through the reasoning before committing to a conclusion, so the conclusion follows from the work rather than the work justifying the conclusion.',
    useWhen: [
      'it gets multi-step problems wrong',
      'the answer is confident and incorrect',
      'I cannot tell how it reached that conclusion',
      'complex calculation or logic puzzle',
      'I need to check its reasoning',
    ],
    prompt:
      'Work through this step by step before giving me an answer. Show the intermediate reasoning, including anything you rule out and why. State any assumption at the point you make it, not retroactively. Give the conclusion only at the end — and if the reasoning does not actually support a confident conclusion, say that instead of producing one anyway.',
    why:
      'The last clause is the part people leave off. Without it you get careful reasoning followed by a confident answer regardless of whether the reasoning supported one.',
    watchOut:
      'Reasoning models already do this internally. The value here is making the working *visible and checkable*, not making it happen.',
    related: ['self-critique-loop', 'rubric-grading', 'sample-and-compare', 'hypothesis-driven-debugging'],
    tags: ['prompting', 'reasoning', 'accuracy', 'transparency', 'ai'],
  },

  {
    id: 'few-shot-examples',
    name: 'Few-Shot Examples',
    aka: ['show dont tell prompting', 'exemplars', 'match this style'],
    origin: 'GPT-3 paper (Brown et al.)',
    domains: ['meta', 'writing'],
    intents: ['steer'],
    oneLiner:
      'Show two or three examples of exactly what you want instead of describing it — demonstration transfers what description cannot.',
    useWhen: [
      'I cannot describe the style I want',
      'it does not match our house voice',
      'I keep explaining the format and it keeps getting it wrong',
      'I need consistent output across many items',
      'the tone is close but not right',
    ],
    prompt:
      'Here are three examples of what good looks like: [paste them]. And here is one that is subtly wrong: [paste it]. First, tell me what pattern you infer from the good examples and what specifically makes the fourth one wrong — I want to check you inferred the right rule before you use it. Then produce [your item] following that pattern.',
    why:
      'The near-miss example plus the check-the-inferred-rule step is what makes this reliable. Positive examples alone are ambiguous — several rules explain them, and the model may pick the wrong one silently.',
    related: ['worked-example-fading', 'output-contract', 'constraint-stacking', 'rubric-grading'],
    tags: ['prompting', 'style', 'voice', 'consistency', 'examples'],
  },

  {
    id: 'rubric-grading',
    name: 'Rubric-Based Grading',
    aka: ['score against criteria', 'evaluation rubric', 'grade this'],
    origin: 'Educational assessment; used in LLM evaluation',
    domains: ['meta', 'writing', 'learning'],
    intents: ['critique', 'steer'],
    oneLiner:
      'Define the criteria and what each score level means, then grade against them — turning "is this good?" into something answerable.',
    useWhen: [
      'is this good enough to send',
      'I need consistent evaluation across many items',
      'reviewing candidates or submissions fairly',
      'the feedback I get is vague',
      'I want to know specifically what to improve',
    ],
    prompt:
      'Grade this against a rubric. First propose the criteria that actually matter for this artefact and its purpose, with a concrete description of what a 1, 3 and 5 look like on each — descriptions specific enough that two different reviewers would agree. Let me adjust the rubric before you score. Then score with a one-line justification and a quote or specific reference as evidence for each. Finish with the single highest-leverage change: the one edit that would move the most criteria at once.',
    why:
      'Defining the score anchors before seeing the artefact is what prevents the rubric from being reverse-engineered to fit the impression the model already formed.',
    related: ['role-and-rubric', 'self-critique-loop', 'design-critique', 'output-contract'],
    tags: ['evaluation', 'feedback', 'quality bar', 'assessment', 'prompting'],
  },

  {
    id: 'progressive-disclosure',
    name: 'Progressive Disclosure',
    aka: ['chunked delivery', 'outline first', 'section by section'],
    origin: 'Interaction design principle, applied to prompting',
    domains: ['meta', 'writing'],
    intents: ['steer', 'plan'],
    oneLiner:
      'Get an outline and agree on it before any drafting, then take delivery one section at a time.',
    useWhen: [
      'it produced 3000 words and the structure was wrong',
      'long document and I do not want to waste a full generation',
      'I want to steer as it goes',
      'complex output where early mistakes compound',
      'the answer is too long to check properly',
    ],
    prompt:
      'Do not write the full thing yet. First give me an outline: sections, one line each on what goes in them, and the approximate length of each. Wait for my approval, and flag any section where you think my structure is wrong before we start. Then write one section at a time, stopping after each so I can redirect. Carry forward what I correct in earlier sections without me repeating it.',
    why:
      'A wrong outline costs one exchange to fix; a wrong 3000-word draft costs a regeneration and usually anchors the second attempt on the first one\'s mistakes.',
    related: ['output-contract', 'interview-me-first', 'negative-space-prompting', 'work-breakdown-structure'],
    tags: ['prompting', 'long form', 'writing', 'iteration', 'control'],
  },

  {
    id: 'headless-run',
    name: 'Headless Mode',
    aka: ['non-interactive run', 'unattended agent', 'print mode', 'batch agent run', 'claude -p'],
    origin: 'Headless browsers and servers; Claude Code\'s non-interactive mode',
    domains: ['meta', 'engineering'],
    intents: ['steer', 'plan'],
    oneLiner:
      'Write the task so it can finish with nobody watching: no questions back, explicit stopping rules, decisions logged, and output a script can parse.',
    useWhen: [
      'I want to run this in CI without anyone answering prompts',
      'the agent stopped to ask a question and the job hung',
      'running the same task over hundreds of files overnight',
      'I need the output to be machine readable for a pipeline',
      'kick it off and come back later to the result',
    ],
    prompt:
      'You are running headless: nobody will answer questions or approve steps. Where you would normally ask, choose the most conservative reasonable option, record the assumption, and continue. Do not take destructive or irreversible actions; if the task requires one, stop and report instead. Stop when the success check passes, or after a fixed budget of attempts, whichever comes first. Finish with a single structured result I can parse: status of done, partial or blocked, what changed, every assumption you made, and anything a human must look at.',
    why:
      'Models default to conversational turn-taking and treat ambiguity as a reason to ask, which hangs an unattended run. Stating up front that nobody is there converts each question into a logged assumption, and the fixed result shape lets a script check the outcome instead of a person reading prose.',
    watchOut:
      'Conservative defaults can quietly produce a no-op that reports success. Make the success check something observable, like tests passing, not the model\'s own judgement.',
    related: ['output-contract', 'interview-me-first', 'constraint-stacking'],
    tags: ['automation', 'agents', 'ci', 'non-interactive', 'headless', 'scripting'],
  },

  {
    id: 'prompt-chaining',
    name: 'Prompt Chaining',
    aka: ['staged prompts', 'multi-step pipeline', 'task decomposition for llms', 'one job per call'],
    origin: 'Anthropic and OpenAI prompting guides; LLM pipeline practice',
    domains: ['meta', 'engineering'],
    intents: ['steer', 'plan'],
    oneLiner:
      'Split a big task into a sequence of smaller calls, each with one job and a defined output that feeds the next.',
    useWhen: [
      'one giant request does five things and does all of them badly',
      'it forgets half the instructions in a long prompt',
      'I cannot tell which part of the process went wrong',
      'research, analysis and writing all mashed into one answer',
      'the task is too big to get right in a single go',
    ],
    prompt:
      'Do not attempt this in one pass. First break the task into three to six stages, each with a single job, a named input and a named output (for example: extract facts, then analyse them, then draft, then check). Show me that chain before running it. Then run one stage at a time. At the end of each stage, emit only that stage\'s output in the agreed shape, plus a one-line check of whether it is good enough to feed the next stage. If a stage fails its check, fix or rerun that stage instead of pushing a weak result downstream.',
    why:
      'A model given one instruction per step spends all its attention on that step, and the explicit hand-off shape between stages makes each result inspectable. When the final answer is wrong you can see which link broke instead of regenerating everything.',
    watchOut:
      'Errors compound down the chain, and each stage only sees what the previous one passed along. Keep anything later stages need, such as the original goal, in every step.',
    related: ['progressive-disclosure', 'plan-then-execute', 'output-contract', 'work-breakdown-structure'],
    tags: ['prompting', 'pipelines', 'decomposition', 'workflow', 'ai'],
  },

  {
    id: 'plan-then-execute',
    name: 'Plan Then Execute',
    aka: ['plan mode', 'propose before acting', 'approval gate', 'plan and wait'],
    origin: 'Agentic coding practice; plan-and-solve prompting (Wang et al., 2023)',
    domains: ['meta', 'engineering'],
    intents: ['steer', 'plan'],
    oneLiner:
      'Have the agent write a concrete plan of what it will change and how it will verify it, and wait for approval before it touches anything.',
    useWhen: [
      'the agent charged ahead and rewrote half the project',
      'I only find out what it decided after it has already done it',
      'it took an approach I would have rejected in ten seconds',
      'the change is risky and I want a say before it starts',
      'undoing its work takes longer than doing it myself',
    ],
    prompt:
      'Do not make any changes yet. First write a plan: the goal in one sentence, the files or systems you will touch and what changes in each, the order you will do it in, the approach you considered and rejected and why, the riskiest step, and how you will verify the result works. List any open questions whose answers would change the plan. Then stop and wait for my approval. Once I approve, follow the plan; if you discover it was wrong, stop and tell me what changed instead of silently improvising a new one.',
    why:
      'Reviewing a plan costs a minute; reviewing a finished diff built on a bad approach costs the whole run. Asking for the rejected alternative and the riskiest step surfaces the decisions a reviewer actually needs to see, and the "stop if the plan breaks" rule keeps approval meaningful.',
    watchOut:
      'For small, reversible edits the approval round trip is pure overhead. Save it for changes that are expensive to undo.',
    related: ['context-priming', 'progressive-disclosure', 'prompt-chaining', 'interview-me-first', 'pre-mortem'],
    tags: ['agents', 'planning', 'approval', 'coding', 'control'],
  },

  {
    id: 'quote-then-answer',
    name: 'Quote Then Answer',
    aka: ['extract quotes first', 'evidence first answering', 'cite before you conclude', 'grounded answering'],
    origin: 'Anthropic long-context prompting guidance',
    domains: ['meta', 'research'],
    intents: ['steer', 'explain'],
    oneLiner:
      'Make the model pull the exact passages that bear on the question out of a long document first, then answer only from those passages.',
    useWhen: [
      'it made up something that is not in the document I gave it',
      'I pasted a long contract and the answer ignores the relevant clause',
      'I cannot tell which part of the report the answer came from',
      'summaries of long files drift away from what they actually say',
      'I need to check the answer against the source quickly',
    ],
    prompt:
      'Before answering, find the passages in the document that are relevant to my question and copy them out word for word inside <quotes> tags, each with its location (section, page or heading). Do not paraphrase in this step. Then answer inside <answer> tags using only what those quotes support, referring to them by number. If the quotes do not contain enough to answer, say what is missing rather than filling the gap from general knowledge. If passages conflict, show both and say which you would trust and why.',
    why:
      'In a long context the model tends to answer from a blurred impression of the whole document. Forcing verbatim extraction first puts the exact evidence right next to where the answer is generated, and it gives you a fast way to check the answer against the source.',
    watchOut:
      'Verbatim quotes can still be chosen selectively. Ask for passages that cut against the answer too when the question is contested.',
    related: ['retrieval-grounding', 'chain-of-thought', 'calibrated-uncertainty', 'output-contract'],
    tags: ['prompting', 'long context', 'hallucination', 'citations', 'documents'],
  },

  {
    id: 'calibrated-uncertainty',
    name: 'Calibrated Uncertainty',
    aka: ['confidence levels', 'flag your guesses', 'say how sure you are', 'epistemic markers'],
    origin: 'Forecasting and calibration research (Tetlock); LLM calibration work',
    domains: ['meta', 'research'],
    intents: ['steer', 'critique'],
    oneLiner:
      'Ask the model to attach a confidence level to each claim and separate what it knows from what it is inferring or guessing.',
    useWhen: [
      'it sounds equally sure about everything, including the parts it made up',
      'I cannot tell which bits to double check',
      'confident answer turned out to be wrong',
      'I need to know what is fact and what is a guess',
      'it never says I do not know',
    ],
    prompt:
      'For each substantive claim in your answer, mark how confident you are: high (you would bet on it and could point to why), medium (likely, but based on inference or partial knowledge), or low (a guess). Put the mark right after the claim, not in a footnote. Separate what comes from the material I gave you from what comes from your general knowledge. For anything medium or low, say what would confirm or refute it. End with the one claim I should verify before relying on this. Saying "I do not know" is an acceptable answer.',
    why:
      'By default a model writes every sentence in the same assured register, so its guesses look like its facts. Asking for a per-claim label with a concrete meaning, and explicitly permitting "I do not know", gives it room to express the uncertainty it already has and tells you where to spend checking effort.',
    watchOut:
      'Stated confidence is a useful signal, not a probability you can trust to the decimal. It is weakest exactly where the model is confidently wrong, so still verify the high-stakes claims.',
    related: ['chain-of-thought', 'quote-then-answer', 'estimation-uncertainty', 'self-critique-loop'],
    tags: ['prompting', 'confidence', 'hallucination', 'accuracy', 'verification'],
  },

  {
    id: 'minimal-diff-edits',
    name: 'Minimal Diff Edits',
    aka: ['surgical edits', 'change only what I asked', 'smallest possible change', 'leave the rest untouched'],
    origin: 'Code review practice; agentic editing',
    domains: ['meta', 'engineering', 'writing'],
    intents: ['steer'],
    oneLiner:
      'Constrain an edit to exactly what was requested and keep everything else byte-identical, so the change is easy to review and nothing unrelated drifts.',
    useWhen: [
      'I asked for one fix and it reformatted the whole file',
      'it rewrote my paragraph when I wanted one word changed',
      'the diff is huge and I cannot find the actual change',
      'it keeps tidying up things I did not ask it to touch',
      'renamed variables and reordered imports for no reason',
    ],
    prompt:
      'Make only the change I asked for. Everything else must stay byte-identical: no reformatting, no renaming, no reordering, no fixing typos or style you happen to notice, no added comments. Match the surrounding style even where you would do it differently. Output the change as a diff or as exact before and after snippets, not the whole rewritten file. If the requested change genuinely forces edits elsewhere, list each one and why before making it. Put anything else you noticed in a separate "not changed" list at the end.',
    why:
      'Models treat an edit request as permission to improve the whole thing, because a fuller rewrite looks more helpful. Naming the specific kinds of drift, and giving the model a "not changed" list as a place to put its other observations, removes the reason to act on them.',
    watchOut:
      'Sometimes the surrounding code is the real problem. Ask for the "not changed" list so the minimal fix does not hide a larger issue.',
    related: ['negative-space-prompting', 'output-contract', 'preparatory-refactoring', 'code-review-checklist'],
    tags: ['editing', 'coding', 'diff', 'scope', 'review'],
  },

  {
    id: 'context-handoff-brief',
    name: 'Context Handoff Brief',
    aka: ['session handoff', 'handover note', 'continuation summary', 'agent handoff', 'compaction summary'],
    origin: 'Shift handover practice (medicine, operations); multi-agent workflows',
    domains: ['meta', 'writing'],
    intents: ['steer', 'communicate'],
    oneLiner:
      'Have the model write a self-contained brief that lets a fresh session or another agent pick up the work without the original conversation.',
    useWhen: [
      'the chat got so long it started forgetting early decisions',
      'I need to start a new session and do not want to explain everything again',
      'passing a half-finished task to another agent or teammate',
      'the new conversation repeated mistakes we already fixed',
      'I want to pause this work and resume next week',
    ],
    prompt:
      'Write a handoff brief for someone who has none of this conversation and must continue the work. Include, in this order: the goal and what done looks like; the current state (what is finished, what is in progress, what is untouched); decisions made and why, including options we rejected so they are not revisited; constraints and preferences I have stated; dead ends and what we learned from them; the exact next step; and open questions. Use specific names, paths, commands and values rather than descriptions. Leave out the history of how we got here unless it changes what to do next.',
    why:
      'Summaries default to narrating what happened. Ordering the brief around what the next reader must do, and calling out rejected options and dead ends, preserves the information that is expensive to rediscover and most often lost when context resets.',
    watchOut:
      'The brief reflects what the model thinks mattered. Read it before handing it on and add anything it dropped, especially your own preferences.',
    related: ['context-priming', 'bluf', 'plan-then-execute', 'headless-run'],
    tags: ['agents', 'context', 'handoff', 'summary', 'long conversations'],
  },

  {
    id: 'eval-set-first',
    name: 'Eval Set First',
    aka: ['test cases before prompt tuning', 'prompt test set', 'evals before vibes', 'golden examples'],
    origin: 'Test-driven development, applied to prompt engineering',
    domains: ['meta', 'engineering'],
    intents: ['steer', 'critique'],
    oneLiner:
      'Before rewording a prompt, write a small set of inputs with expected outcomes, so every change is judged against the same cases instead of the last one you tried.',
    useWhen: [
      'I keep tweaking the prompt and cannot tell if it is getting better',
      'fixing one example broke another one I had already fixed',
      'I test by trying whatever input comes to mind',
      'the prompt works on my examples and fails for real users',
      'I do not know when to stop fiddling with the wording',
    ],
    prompt:
      'Before we change the prompt, help me build a test set. Propose 10 to 20 inputs: typical cases, edge cases, inputs that failed before, and a few where the correct behaviour is to refuse or ask. For each, write what a passing output must do and must not do, as checkable criteria rather than an ideal answer. Let me edit the set. Then run the current prompt against every case and report pass or fail with a reason. Only then propose one prompt change at a time, rerun the full set, and show which cases flipped in each direction.',
    why:
      'Without fixed cases each edit is judged on whichever example you happen to look at, so you chase regressions in circles. Writing pass criteria before seeing output stops the model grading itself generously, and rerunning the whole set makes regressions visible.',
    watchOut:
      'A small set is easy to overfit. Add real failures as you find them, and keep a few cases you never tune against.',
    related: ['llm-evaluation-harness', 'rubric-grading', 'few-shot-examples', 'red-green-refactor', 'prompt-chaining'],
    tags: ['prompting', 'evaluation', 'testing', 'iteration', 'ai'],
  },
]
