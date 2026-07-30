import type { Concept } from '../types'

export const design: Concept[] = [
  {
    id: 'crazy-eights',
    name: 'Crazy Eights',
    aka: ['eight ideas in eight minutes', 'divergent sketching', 'quantity over quality ideation'],
    origin: 'Google Ventures Design Sprint',
    domains: ['design', 'product'],
    intents: ['ideate'],
    oneLiner:
      'Force out eight distinct concepts fast, so the obvious first three get out of the way and the interesting ones surface.',
    useWhen: [
      'I only have one idea and it is probably the obvious one',
      'we need more options before we commit',
      'the brainstorm produced variations of the same thing',
      'I am anchored on my first solution',
      'kicking off a design exploration',
    ],
    prompt:
      'Do Crazy Eights on this. Give me eight genuinely distinct approaches — distinct in mechanism, not in styling. Deliberately include one that removes the feature entirely, one that solves it with no interface at all, one that solves it socially or by policy rather than technically, and one that is uncomfortably expensive. For each, one sentence on the approach and one on who it is best for. Then tell me which two are worth developing further and what makes them different from the safe default I would otherwise have picked.',
    why:
      'The mandated categories — remove it, no interface, non-technical, expensive — are what break anchoring. Asked for eight ideas flat, a model gives you one idea with eight coats of paint.',
    related: ['how-might-we', 'blue-ocean-errc', 'inversion', 'design-critique'],
    tags: ['ideation', 'brainstorming', 'design sprint', 'divergent thinking', 'options'],
  },

  {
    id: 'user-journey-mapping',
    name: 'User Journey Mapping',
    aka: ['journey map', 'experience map', 'service blueprint'],
    origin: 'Service design practice',
    domains: ['design', 'product'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Lay out the user\'s full path stage by stage with their actions, thoughts and emotions, so the gaps between the steps become visible.',
    useWhen: [
      'users drop off somewhere and I do not know where',
      'the feature works but the experience is bad',
      'we optimise screens and never the whole flow',
      'onboarding feels broken',
      'handoffs between teams create a disjointed experience',
    ],
    prompt:
      'Map the user journey for this. For each stage give me: what the user is doing, what they are thinking, what they are feeling, which touchpoints they hit, and — behind the line of visibility — what our systems and teams are doing. Pay particular attention to the transitions between stages and to the waiting periods, because that is where journeys break rather than within a single well-designed screen. Then mark the three highest-emotion moments and tell me which one, if fixed, would most change their overall impression.',
    why:
      'Explicitly directing attention at transitions and waits is what makes this different from a flow diagram. Individual screens are usually fine; the seams are not.',
    related: ['jobs-to-be-done', 'heuristic-evaluation', 'root-cause-fishbone', 'cohort-analysis'],
    tags: ['ux', 'journey', 'onboarding', 'service design', 'drop off'],
  },

  {
    id: 'heuristic-evaluation',
    name: 'Heuristic Evaluation',
    aka: ["Nielsen's heuristics", 'usability heuristics', 'expert review'],
    origin: 'Jakob Nielsen & Rolf Molich, 1990',
    domains: ['design'],
    intents: ['critique'],
    oneLiner:
      'Assess an interface against ten established usability principles, giving you specific defensible findings rather than opinions.',
    useWhen: [
      'is this interface actually usable',
      'I need a design review and have no users to test with',
      'the design feels wrong and I cannot articulate why',
      'reviewing a flow before it ships',
      'justifying UX changes to stakeholders',
    ],
    prompt:
      "Run a heuristic evaluation using Nielsen's ten heuristics: system status visibility, match to the real world, user control and freedom, consistency and standards, error prevention, recognition over recall, flexibility and efficiency, aesthetic and minimalist design, error recovery, and help and documentation. For each violation: the heuristic breached, the specific element, a severity from 0 to 4, and a concrete fix. Sort by severity. Then say which heuristics this design handles well, so I know what not to break while fixing the rest.",
    why:
      'A named heuristic converts "this feels off" into a finding a stakeholder cannot wave away. The what-not-to-break list prevents the usual regression from a redesign.',
    watchOut:
      'Heuristic evaluation finds usability problems, not desirability or value problems. It cannot tell you the feature is unwanted.',
    related: ['design-critique', 'accessibility-audit', 'user-journey-mapping', 'red-teaming'],
    tags: ['usability', 'ux review', 'nielsen', 'interface', 'audit'],
  },

  {
    id: 'accessibility-audit',
    name: 'Accessibility Audit (WCAG)',
    aka: ['a11y review', 'WCAG audit', 'screen reader check'],
    origin: 'W3C Web Content Accessibility Guidelines',
    domains: ['design', 'engineering'],
    intents: ['critique'],
    oneLiner:
      'Check an interface against perceivable, operable, understandable and robust criteria, prioritising by who is actually blocked.',
    useWhen: [
      'is this accessible',
      'we need to meet WCAG AA',
      'keyboard navigation is probably broken',
      'colour contrast and screen reader support',
      'accessibility came up in review and we have no plan',
    ],
    prompt:
      'Audit this against WCAG 2.2 AA. Organise findings under Perceivable, Operable, Understandable and Robust. For each issue: the success criterion, what breaks, who it blocks, and the specific code or design fix. Prioritise by whether it fully blocks a user from completing the task versus merely degrading the experience — a missing label on the submit button outranks a decorative contrast issue. Include the things automated checkers miss: focus order, focus visibility, meaningful alt text versus filler, live region announcements, and whether the keyboard path is a reasonable journey rather than merely possible.',
    why:
      'Naming what automated tools miss is the point. Anything an axe scan catches you did not need a prompt for; the judgement calls are the gap.',
    related: ['heuristic-evaluation', 'design-critique', 'plain-language'],
    tags: ['accessibility', 'a11y', 'wcag', 'inclusive design', 'compliance'],
  },

  {
    id: 'information-architecture',
    name: 'Information Architecture / Card Sort',
    aka: ['IA', 'card sorting', 'taxonomy design', 'navigation structure'],
    origin: 'Library science; Rosenfeld & Morville',
    domains: ['design', 'writing'],
    intents: ['structure'],
    oneLiner:
      'Group and label content the way users think about it rather than the way the organisation is structured.',
    useWhen: [
      'nobody can find anything in our docs',
      'the navigation reflects our org chart',
      'we have too many menu items',
      'organising a knowledge base or settings page',
      'users ask for features that already exist',
    ],
    prompt:
      'Design the information architecture for this. Propose a grouping based on how users would look for things, not on how we are organised internally, and give each group a label using the user\'s vocabulary rather than ours. Then stress-test it: for each of these tasks [list them], trace the path a first-time user would take and mark where they would hesitate between two plausible groups. Flag any item that legitimately belongs in two places, and say whether to duplicate it, cross-link it, or restructure. Aim for breadth over depth — more top-level items beats more clicks.',
    why:
      'Tracing specific tasks through the structure is what tests an IA. A taxonomy always looks coherent to the person who wrote it; only the hesitation points reveal it is wrong.',
    related: ['user-journey-mapping', 'pyramid-principle', 'plain-language', 'heuristic-evaluation'],
    tags: ['navigation', 'taxonomy', 'documentation', 'ux', 'findability'],
  },
]
