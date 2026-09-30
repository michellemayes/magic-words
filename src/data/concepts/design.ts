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

  {
    id: 'double-diamond',
    name: 'Double Diamond',
    aka: ['diverge and converge', 'discover define develop deliver', 'problem space then solution space'],
    origin: 'UK Design Council, 2005',
    domains: ['design', 'product'],
    intents: ['plan', 'reframe'],
    oneLiner:
      'Run two rounds of widening then narrowing: first explore and pin down the right problem, then explore and pin down the right solution.',
    useWhen: [
      'we jumped straight to building the first idea someone had',
      'the team is arguing about solutions and nobody agrees on the problem',
      'we shipped it and it solved something users did not care about',
      'I do not know what phase this project is in',
      'research and ideation keep blurring into each other',
    ],
    prompt:
      'Structure this work as a Double Diamond. Discover: list what we would need to learn about users and context, and the questions to open up, without proposing solutions. Define: turn that into one sharp problem statement and say what we are deliberately not solving. Develop: generate several distinct solution directions for that statement. Deliver: say how to test and narrow them to one. For each phase, name the output that marks it finished. Then tell me which phase we are actually in right now, based on what I have described, and where we skipped a phase.',
    why:
      'Naming the four phases with a required output for each stops the model, and the team, from treating a solution idea as a problem definition. Asking which phase we are really in turns a generic framework into a diagnosis of the current project.',
    watchOut:
      'Real projects loop back between diamonds. Treat it as a map of modes of work, not a one-way gate process.',
    related: ['how-might-we', 'jobs-to-be-done', 'crazy-eights', 'abstraction-laddering'],
    tags: ['design process', 'problem framing', 'divergent thinking', 'convergent thinking', 'discovery'],
  },

  {
    id: 'think-aloud-usability-test',
    name: 'Think-Aloud Usability Test',
    aka: ['usability testing', 'think aloud protocol', 'moderated user test', 'task-based testing'],
    origin: 'Ericsson & Simon protocol analysis; popularised for UX by Jakob Nielsen',
    domains: ['design', 'research', 'product'],
    intents: ['diagnose', 'plan'],
    oneLiner:
      'Watch a handful of real users attempt realistic tasks while narrating what they think, so you see where they get confused rather than hearing opinions.',
    useWhen: [
      'we asked users if they liked it and they all said yes, then did not use it',
      'I want to watch people use the prototype but do not know how to run it',
      'the team disagrees about whether the flow is confusing',
      'we need user feedback before launch on a tiny budget',
      'surveys tell us what people say, not what they do',
    ],
    prompt:
      'Write a think-aloud usability test plan for this. Give me: the three to five tasks, each phrased as a realistic goal in the user\'s words that does not name the UI element they need; who to recruit and how many (five is usually enough per round); a neutral script for introducing the session and prompting people to keep talking without leading them; what to observe and note for each task (success, time, hesitation, wrong turns, quotes); and how to synthesise findings into issues ranked by severity and frequency. List the phrases the moderator must avoid because they give away the answer.',
    why:
      'Most AI-written test plans ask users what they think of the design. Specifying tasks written as goals, a non-leading script and banned moderator phrases produces a plan that captures behaviour, which is where usability problems actually show up.',
    watchOut:
      'Five users find most usability problems, not whether anyone wants the product. It also cannot tell you how common a problem is across your whole user base.',
    related: ['heuristic-evaluation', 'five-second-test', 'user-journey-mapping', 'design-critique'],
    tags: ['usability', 'user research', 'testing', 'ux', 'prototype'],
  },

  {
    id: 'five-second-test',
    name: 'Five-Second Test',
    aka: ['first impression test', 'glance test', 'above the fold test'],
    origin: 'UX research practice (Perfetti; UsabilityHub)',
    domains: ['design', 'writing'],
    intents: ['critique'],
    oneLiner:
      'Show a page for five seconds, hide it, and ask what it was for and what stood out, to check whether the main message survives a glance.',
    useWhen: [
      'people land on the page and leave without doing anything',
      'visitors cannot tell what our product does',
      'the homepage says a lot and communicates nothing',
      'I want to know what people notice first',
      'is the headline clear enough',
    ],
    prompt:
      'Run a simulated five-second test on this page. Look only at what a visitor would take in from a quick glance at the top of the screen: the headline, the most prominent visual, and the primary button. Answer as that visitor: what is this, who is it for, and what am I supposed to do next? Then compare those answers with what the page is meant to communicate and list every gap. Name the element that grabbed attention first and whether it deserved to. Finish with a rewrite of the headline and primary action that would pass.',
    why:
      'A model reviewing a page reads every word, which is exactly what visitors do not do. Restricting it to the glance-level elements and making it answer the three visitor questions mimics real scanning and exposes a buried message.',
    watchOut:
      'A simulation is a cheap first filter, not evidence. Run the real test with people outside the team before making claims about users.',
    related: ['visual-hierarchy', 'think-aloud-usability-test', 'bluf', 'heuristic-evaluation'],
    tags: ['first impressions', 'landing page', 'clarity', 'ux research', 'messaging'],
  },

  {
    id: 'visual-hierarchy',
    name: 'Visual Hierarchy',
    aka: ['emphasis and contrast', 'scan path', 'information hierarchy', 'f-pattern'],
    origin: 'Graphic design and Gestalt principles',
    domains: ['design'],
    intents: ['critique', 'structure'],
    oneLiner:
      'Use size, weight, colour, contrast, spacing and position to make the most important thing on the screen get seen first, then the next.',
    useWhen: [
      'everything on the page looks equally important',
      'users miss the main button even though it is right there',
      'the design feels busy and cluttered',
      'I do not know where to look first on this screen',
      'the dashboard is a wall of same-sized boxes',
    ],
    prompt:
      'Review the visual hierarchy of this screen. First state what the single most important element should be, then the second and third, based on what the user came here to do. Then describe the order a user\'s eye will actually travel given the current size, weight, colour, contrast, spacing and position of each element. List every place where the actual order differs from the intended one, and for each give the specific change (for example: reduce the secondary button to a text link, increase heading size one step, add space above the section). Prefer removing emphasis from competing elements over adding more to the main one.',
    why:
      'Asking for the intended order and the predicted order separately turns "it feels cluttered" into a concrete list of mismatches. The instruction to reduce competing emphasis steers away from the default fix of making everything bigger and bolder.',
    related: ['five-second-test', 'fitts-law', 'information-architecture', 'design-critique', 'accessibility-audit'],
    tags: ['layout', 'typography', 'emphasis', 'ui', 'clutter'],
  },

  {
    id: 'hicks-law',
    name: 'Hick\'s Law',
    aka: ['Hick-Hyman law', 'choice overload', 'too many options', 'decision time'],
    origin: 'William Hick and Ray Hyman, 1952',
    domains: ['design', 'product'],
    intents: ['critique', 'prioritize'],
    oneLiner:
      'The time it takes to choose grows with the number of options, so cutting, grouping or defaulting choices makes interfaces faster to use.',
    useWhen: [
      'the menu has so many items nobody finds anything',
      'users freeze on the pricing page and leave',
      'every setting is exposed at once on one screen',
      'onboarding asks too many questions up front',
      'people keep picking the wrong option out of a long list',
    ],
    prompt:
      'Apply Hick\'s Law to this interface. List every point where the user has to choose, and how many options they face at each. For each high-count decision, propose the best fix from: removing options that few people use, setting a smart default, grouping into a small number of labelled categories, splitting the decision into steps, or moving advanced options behind a secondary control. Say which options you would cut and what evidence would justify it. Do not apply this to cases where users already know exactly what they are looking for, such as a well-sorted list they can scan by name.',
    why:
      'Naming the law gives the model a specific lens: count the choices, then reduce them. The menu of fixes and the exception for known-target search keep it from just recommending fewer buttons everywhere.',
    watchOut:
      'Hiding options adds clicks and can bury things experts need. Measure which options are actually used before cutting them.',
    related: ['fitts-law', 'information-architecture', 'visual-hierarchy', 'heuristic-evaluation'],
    tags: ['choice', 'simplicity', 'menus', 'ux laws', 'cognitive load'],
  },

  {
    id: 'fitts-law',
    name: 'Fitts\'s Law',
    aka: ['Fitts law', 'target size and distance', 'click target size', 'tap target'],
    origin: 'Paul Fitts, 1954',
    domains: ['design', 'engineering'],
    intents: ['critique'],
    oneLiner:
      'The time to hit a target depends on its size and distance, so frequent actions should be big and close, and dangerous ones small or far away.',
    useWhen: [
      'people keep missing the button on mobile',
      'users accidentally tap delete instead of save',
      'the main action is tucked in a tiny corner',
      'links are so small they are hard to click',
      'the most used control is the furthest from where people are working',
    ],
    prompt:
      'Review this interface using Fitts\'s Law. For each important interactive element, note its size, how far it is from where the user\'s pointer or thumb usually is, and how often it is used. Flag frequent actions that are small or distant, destructive actions that sit next to common ones or are easy to hit by accident, and touch targets under about 44 by 44 points. For each, give a concrete fix: enlarge the hit area, move it closer to the related content, use screen edges and corners, or add distance or confirmation for risky actions. Order the fixes by how often the element is used.',
    why:
      'The law reduces to two measurable variables, so asking for size, distance and frequency per element gives the model a checklist instead of vague taste. Including destructive actions covers the half of the principle people forget.',
    watchOut:
      'It models pointing speed, not comprehension. A large, close button with an unclear label is still a bad button.',
    related: ['hicks-law', 'visual-hierarchy', 'accessibility-audit', 'heuristic-evaluation'],
    tags: ['touch targets', 'mobile', 'buttons', 'ux laws', 'interaction'],
  },

  {
    id: 'empty-state-design',
    name: 'Empty State Design',
    aka: ['zero state', 'blank slate', 'first-run experience', 'no results state'],
    origin: 'Interaction design practice',
    domains: ['design', 'product'],
    intents: ['critique', 'plan'],
    oneLiner:
      'Design what a screen shows when there is nothing in it yet, so new users, cleared lists and failed searches get guidance instead of a blank page.',
    useWhen: [
      'new users sign up and see a blank screen with nothing to do',
      'the page just says no data',
      'search with no results feels like a dead end',
      'users do not know how to get started after onboarding',
      'our screenshots only ever show the app full of data',
    ],
    prompt:
      'Design the empty states for this product. First list every screen or component that can be empty, and sort each into a type: first use (nothing created yet), user cleared (they finished or deleted everything), no results (a search or filter matched nothing), and error or no permission. For each, write the headline, one line of explanation, and the single primary action that gets the user to a useful state, plus any sample content or template worth offering. Make first-use states teach what the screen is for, and make no-results states say why and how to widen the search.',
    why:
      'Designers and models both work from screens full of data, so empty states get forgotten. Forcing an inventory by type makes the model find all of them, and requiring one primary action per state turns a dead end into a next step.',
    related: ['ux-microcopy', 'onboarding-ramp', 'skeleton-vs-spinner', 'user-journey-mapping', 'heuristic-evaluation'],
    tags: ['onboarding', 'first run', 'ui states', 'activation', 'ux'],
  },

  {
    id: 'ux-microcopy',
    name: 'UX Microcopy',
    aka: ['interface copy', 'ux writing', 'button labels', 'content design'],
    origin: 'UX writing and content design practice',
    domains: ['design', 'writing'],
    intents: ['communicate', 'critique'],
    oneLiner:
      'Write the small bits of interface text, such as labels, buttons, hints, errors and confirmations, so they tell users what will happen and what to do next.',
    useWhen: [
      'our buttons just say submit and OK',
      'error messages say something went wrong and nothing else',
      'users are nervous about clicking because they do not know what happens',
      'the wording in the app is inconsistent from screen to screen',
      'the tone of the interface feels robotic or too cute',
    ],
    prompt:
      'Rewrite the interface text on these screens. For each string give the current text, the new text, and a short reason. Rules: buttons say what happens, using a verb and object ("Save draft", not "OK"); errors say what went wrong, why if it helps, and exactly how to fix it, without blaming the user; hints appear before the mistake, not after; confirmations for destructive actions name what will be lost. Use the user\'s words, not internal names. Keep the same term for the same thing everywhere, and list the terms you standardised. Keep each string as short as it can be while still being clear.',
    why:
      'Generic copy requests produce friendlier versions of the same vague text. Per-string rules with a before, after and reason force specific, checkable changes, and the terminology list catches inconsistency across screens.',
    watchOut:
      'Copy cannot fix a confusing flow. If a label needs a long explanation, the design underneath probably needs to change.',
    related: ['plain-language', 'error-message-design', 'empty-state-design', 'voice-profile', 'form-ux-validation'],
    tags: ['ux writing', 'copy', 'labels', 'error messages', 'content design'],
  },
]
