import type { Concept } from '../types'

export const frontend: Concept[] = [
  {
    id: 'core-web-vitals',
    name: 'Core Web Vitals',
    aka: ['LCP INP CLS', 'field performance metrics', 'page experience'],
    origin: 'Google Chrome team, 2020',
    domains: ['engineering', 'design'],
    intents: ['diagnose', 'estimate'],
    oneLiner:
      'Three field-measured signals — when the main content appears, how quickly the page responds to input, and how much it shifts — chosen to approximate what users feel.',
    useWhen: [
      'our lab scores are green and real users say the site is slow',
      'the page jumps around while loading and people click the wrong thing',
      'the button does nothing for a second after being tapped',
      'someone wants a performance target and I need a defensible one',
    ],
    prompt:
      'Diagnose this page against the three headline experience signals and be precise about what each measures. For the largest content paint, identify the element actually being measured, since it is often not what we assume, and attribute its delay across server response, resource load and render blocking. For interaction responsiveness, find the long tasks that block the main thread during and after load. For layout stability, find every element inserted or resized after first paint — late images without dimensions, injected banners, web fonts swapping. Report per segment rather than in aggregate, since mobile on a poor connection is where the failures are.',
    why:
      'Identifying which element is actually measured and attributing its delay across phases is what turns a score into a specific fix rather than general advice.',
    watchOut:
      'These are proxies for experience, not experience itself. A page can score well and still feel bad if the content people came for arrives last.',
    related: ['critical-rendering-path', 'perceived-performance', 'real-user-monitoring', 'performance-budget'],
    tags: ['frontend', 'performance', 'metrics', 'user experience'],
  },

  {
    id: 'critical-rendering-path',
    name: 'Critical Rendering Path',
    aka: ['render blocking resources', 'above the fold delivery', 'waterfall analysis'],
    origin: 'Web performance practice; Ilya Grigorik\'s writing on browser rendering',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Trace exactly what must be downloaded, parsed and executed before the user sees content, and remove or defer everything else from that chain.',
    useWhen: [
      'the page is blank for three seconds before anything appears',
      'our stylesheet blocks rendering and it is enormous',
      'a third-party tag in the head delays everything',
      'the browser cannot start fetching an image until a script has run',
    ],
    prompt:
      'Map the chain of dependencies before first meaningful content on this page. Build the waterfall showing what blocks what, and identify chains where one resource is only discoverable after another has been parsed or executed, since those serial dependencies dominate and are invisible from a resource list. Then apply the remedies per item: inline the styles needed for initial content and defer the rest, defer or move scripts, preload late-discovered critical resources, and remove render-blocking third parties from the head. Quantify the expected saving per change from the waterfall rather than asserting it, and state what must stay blocking and why.',
    why:
      'Serial discovery chains are the specific structure that produces long blank periods, and they are only visible when you look at what blocks what rather than at total bytes.',
    watchOut:
      'Preloading too much competes for bandwidth with the truly critical resources and can make first paint worse rather than better.',
    related: ['core-web-vitals', 'bundle-splitting', 'font-loading-strategy', 'third-party-script-governance'],
    tags: ['frontend', 'performance', 'loading', 'diagnosis'],
  },

  {
    id: 'perceived-performance',
    name: 'Perceived Performance',
    aka: ['felt speed', 'response time psychology', 'progressive display'],
    origin: 'Human-computer interaction research; Nielsen\'s response time limits',
    domains: ['design', 'engineering'],
    intents: ['reframe', 'structure'],
    oneLiner:
      'What users experience is not elapsed time but whether the interface acknowledges them, shows progress and gives them something to do — which is often cheaper to fix than the actual latency.',
    useWhen: [
      'we cannot make this faster but people complain about waiting',
      'the operation genuinely takes eight seconds and always will',
      'users click twice because nothing happened after the first click',
      'the app is objectively fast and feels sluggish',
    ],
    prompt:
      'Improve how fast this interaction feels, separately from how fast it is. Apply the response-time thresholds: under about a tenth of a second feels instant and needs no feedback, up to a second keeps flow but needs acknowledgement, and beyond that needs a progress indication that shows actual progress rather than an indefinite animation. Map our interactions to those bands. Then apply the specific techniques: immediate acknowledgement of input, showing partial results as they arrive rather than waiting for completion, doing predictable work in advance, and placing unavoidable waits where users expect them. Finish with what genuinely must get faster because no presentation will hide it.',
    why:
      'Mapping interactions to the response-time bands tells you which need acknowledgement versus real progress, and it separates the waits you can dress up from the ones you must actually fix.',
    watchOut:
      'Fake progress that completes and then waits is worse than honest uncertainty, because it destroys trust in every future indicator.',
    related: ['skeleton-vs-spinner', 'optimistic-ui', 'core-web-vitals', 'progressive-disclosure'],
    tags: ['frontend', 'user experience', 'performance', 'psychology'],
  },

  {
    id: 'skeleton-vs-spinner',
    name: 'Loading State Design',
    aka: ['skeleton screens', 'spinners', 'progress indication'],
    origin: 'Interface design practice; skeleton screens popularised by Luke Wroblewski',
    domains: ['design', 'engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Choose the loading treatment by how long the wait is and how much of the layout you can predict, because the wrong one makes a fast page feel slower.',
    useWhen: [
      'the spinner flashes for a moment and the page flickers',
      'the layout jumps when the content finally arrives',
      'everything shows a spinner including things that load instantly',
      'users cannot tell whether the page is loading or broken',
    ],
    prompt:
      'Design loading states for these interfaces. Choose per case by duration and predictability: for waits under a few hundred milliseconds show nothing, since an indicator that flashes is worse than none — specify the delay before any indicator appears. For predictable layouts use a placeholder matching the final dimensions so nothing shifts when content arrives. For long or unpredictable operations show real progress and what is happening. Then cover the states people forget: the empty result, which must look different from loading, the error state, and the partial state where some content has arrived. Finish with the minimum display duration that prevents flicker.',
    why:
      'The delay-before-showing and minimum-display-duration rules are what eliminate loading flicker, and they are the details that separate a considered implementation from a spinner on every request.',
    watchOut:
      'A placeholder whose shape does not match the real content causes the layout shift it was meant to prevent, plus a moment of confusion.',
    related: ['perceived-performance', 'optimistic-ui', 'core-web-vitals', 'error-boundaries'],
    tags: ['frontend', 'user experience', 'loading', 'design'],
  },

  {
    id: 'optimistic-ui',
    name: 'Optimistic UI',
    aka: ['optimistic updates', 'assume success', 'local-first response'],
    origin: 'Interface engineering practice; common in collaborative and mobile applications',
    domains: ['engineering', 'design'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Show the result of an action immediately and reconcile with the server afterwards, which removes latency from the interaction and requires a plan for when you were wrong.',
    useWhen: [
      'every click waits for a round trip before anything visibly happens',
      'the app feels sluggish on mobile networks',
      'liking something takes a second to register',
      'we tried this and the interface got into confusing states when calls failed',
    ],
    prompt:
      'Design optimistic updates for these actions. Select them by failure probability and reversal cost: an action that rarely fails and is trivially undone is a good candidate, while anything that moves money or is externally visible is not — classify ours. For each chosen action, specify the predicted local state, how the real response reconciles with it including when the server returns something different rather than merely succeeding, and the rollback presentation, which must explain what happened rather than silently reverting. Then handle sequencing: several optimistic actions in flight, and one failing while later ones depend on it.',
    why:
      'The server-returns-something-different case and dependent queued actions are where these implementations break, and both need designing before the happy path is built.',
    watchOut:
      'Silently reverting an optimistic change makes users believe their action was lost. The reversal needs an explanation as much as an error does.',
    related: ['perceived-performance', 'offline-first-sync', 'client-state-management', 'idempotency-keys'],
    tags: ['frontend', 'user experience', 'latency', 'state'],
  },

  {
    id: 'server-vs-client-rendering',
    name: 'Rendering Strategy',
    aka: ['SSR versus CSR', 'static generation', 'streaming rendering'],
    origin: 'Web architecture practice; the debate renewed with each framework generation',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Decide where each page is rendered — build time, request time on the server, or in the browser — from its data freshness, personalisation and discoverability needs.',
    useWhen: [
      'our marketing pages are slow because they render in the browser',
      'search engines see an empty page',
      'the server rendering makes every request expensive',
      'someone is proposing a framework migration and I need the actual criteria',
    ],
    prompt:
      'Choose a rendering strategy per route rather than for the whole application, since the answer differs by page. For each, state the data freshness required, whether the content is personalised, whether it must be indexable, and how interactive it is — those four determine the answer. Then map to a strategy: pre-rendered at build for static content, rendered per request where content is fresh or personalised, rendered in the browser for highly interactive authenticated views, or a hybrid streaming the shell first. Include the operational consequences: server cost per request, cache strategy at the edge, and what happens when the rendering server is slow or unavailable.',
    why:
      'Deciding per route from four concrete properties avoids the whole-application argument, and the caching and failure implications are what the framework comparison usually omits.',
    watchOut:
      'Server rendering moves work from the user\'s device to your servers, which is a real cost line and a new availability dependency for pages that previously needed neither.',
    related: ['hydration-cost', 'cdn-edge-caching', 'critical-rendering-path', 'progressive-enhancement'],
    tags: ['frontend', 'architecture', 'rendering', 'performance'],
  },

  {
    id: 'hydration-cost',
    name: 'Hydration Cost',
    aka: ['islands architecture', 'partial hydration', 'interactive too late'],
    origin: 'Frontend framework practice; islands architecture named by Katie Sylor-Miller and Jason Miller',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Server-rendered markup that must be re-processed in the browser to become interactive means shipping the content twice and blocking the main thread to reconnect it.',
    useWhen: [
      'the page appears quickly and does nothing when clicked',
      'we server-render and the JavaScript bundle is still huge',
      'the main thread is blocked for a second after content appears',
      'mostly static pages ship an entire application framework',
    ],
    prompt:
      'Analyse the cost of making this server-rendered page interactive. Measure the gap between content appearing and the page responding to input, and attribute it to script download, parse and the reconnection work itself. Then identify which parts of the page genuinely need client-side interactivity and which are static content that is currently being processed anyway — that ratio is the size of the opportunity. Propose the reduction: isolating interactive regions so only they ship and process script, deferring the reconnection of below-the-fold regions until visible, and removing framework involvement entirely from static areas. Estimate the saving per change.',
    why:
      'Quantifying the static-versus-interactive ratio on the page turns an architectural debate into a measured opportunity, and the appear-to-respond gap is the number users actually feel.',
    watchOut:
      'Splitting a page into independently interactive regions complicates shared state between them. Regions that must coordinate closely are poor candidates.',
    related: ['server-vs-client-rendering', 'bundle-splitting', 'core-web-vitals', 'progressive-enhancement'],
    tags: ['frontend', 'performance', 'rendering', 'javascript'],
  },

  {
    id: 'bundle-splitting',
    name: 'Bundle Splitting',
    aka: ['code splitting', 'lazy loading routes', 'chunk strategy'],
    origin: 'Frontend build tooling practice',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Ship only the code needed for the current view, splitting along boundaries that match how users actually navigate rather than however the bundler happens to divide things.',
    useWhen: [
      'the initial download includes the admin panel nobody uses',
      'our bundle is two megabytes and growing every sprint',
      'every route change downloads everything again',
      'we split the bundle and the number of requests exploded',
    ],
    prompt:
      'Design a splitting strategy for this application. Analyse the current bundle to see what is included and what proportion is used on the first view. Then split along the boundaries that match navigation: route level first, then heavy components loaded on interaction such as editors, charts and date pickers. Separate rarely-changing vendor code so it stays cached across deploys, and state how the chunk hashing avoids invalidating everything on every release. Then avoid the two failure modes: too many small chunks creating request overhead and dependency waterfalls, and shared code duplicated across chunks. Finish with prefetching for likely next navigations.',
    why:
      'Cache-friendly chunking across deploys and avoiding chunk waterfalls are what determine whether splitting actually helps repeat visitors, and both are commonly missed.',
    watchOut:
      'Lazily loading a component the user reaches immediately just adds a round trip to the interaction. Split by what is genuinely deferred, not by what is easy to split.',
    related: ['dependency-weight-budget', 'critical-rendering-path', 'cdn-edge-caching', 'hydration-cost'],
    tags: ['frontend', 'performance', 'build', 'loading'],
  },

  {
    id: 'dependency-weight-budget',
    name: 'Dependency Weight',
    aka: ['bundle size budget', 'library cost analysis', 'the cost of one more package'],
    origin: 'Frontend performance practice',
    domains: ['engineering'],
    intents: ['decide', 'critique'],
    oneLiner:
      'Every added library costs download, parse and execution time on the user\'s device, and the cost is easy to add and hard to notice.',
    useWhen: [
      'we added a library for one function and the bundle grew by a hundred kilobytes',
      'nobody knows why the bundle is this large',
      'we have three date libraries in one application',
      'someone wants to add a dependency and we have no basis for saying no',
    ],
    prompt:
      'Audit our client dependencies for weight against value. For each significant one, report its contribution after tree-shaking and compression, what we actually use it for, and whether that use is a small fraction of what it provides. Then evaluate the alternatives specifically: a smaller library, a platform capability that has since become widely available, or a local implementation of the part we need. Include the transitive weight and any duplicate functionality across packages. Then propose a budget and the pipeline check reporting the size difference on every change, since making the cost visible at review time is what prevents the slow accumulation.',
    why:
      'Reporting the size delta per change at review time is the control that works, because the problem is accumulation rather than any single decision.',
    watchOut:
      'Replacing a library with your own code moves the cost from bytes to maintenance and bugs. Weigh both, especially for anything involving dates, currency or text encoding.',
    related: ['bundle-splitting', 'performance-budget', 'dependency-pinning', 'supply-chain-provenance'],
    tags: ['frontend', 'dependencies', 'performance', 'budgets'],
  },

  {
    id: 'image-optimization',
    name: 'Image Delivery',
    aka: ['responsive images', 'modern formats', 'lazy loading images'],
    origin: 'Web performance practice',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Images are usually most of a page\'s weight, and most of that is waste — wrong dimensions, outdated formats and eager loading of things nobody scrolls to.',
    useWhen: [
      'we serve a four thousand pixel wide photo to a phone',
      'the page weighs six megabytes and it is all pictures',
      'images load slowly and shift the layout when they arrive',
      'the same image is fetched at three different sizes with no caching benefit',
    ],
    prompt:
      'Design image delivery for this site. Cover each dimension with the specific mechanism: correct dimensions per viewport and pixel density using responsive source sets, modern formats with fallbacks, compression quality chosen per image type rather than globally, and deferred loading for anything below the fold while never deferring the largest visible element, since that directly delays first content. Then require explicit dimensions or aspect ratios on every image to prevent layout shift. Finish with the pipeline: whether transformation happens at build or through an on-demand service, and the caching strategy given that each variant is a separate cache entry.',
    why:
      'Never deferring the largest above-the-fold image and always declaring dimensions are the two rules that keep image optimisation from harming the metrics it is meant to improve.',
    watchOut:
      'Aggressive compression on images with text or fine detail produces visible artefacts. Quality settings need to vary by content type.',
    related: ['core-web-vitals', 'cdn-edge-caching', 'compression-tradeoffs', 'critical-rendering-path'],
    tags: ['frontend', 'performance', 'images', 'media'],
  },

  {
    id: 'font-loading-strategy',
    name: 'Font Loading Strategy',
    aka: ['FOIT and FOUT', 'font-display', 'web font performance'],
    origin: 'Web typography and performance practice',
    domains: ['engineering', 'design'],
    intents: ['decide', 'diagnose'],
    oneLiner:
      'Custom fonts block or swap text as they load, so choose deliberately between invisible text, a visible swap, and a fallback that never changes.',
    useWhen: [
      'the text is invisible for a second while the font loads',
      'the page reflows noticeably when the font arrives',
      'we load six font files for two visible weights',
      'the font blocks rendering on slow connections',
    ],
    prompt:
      'Design font loading for this site. Choose the display behaviour deliberately and state the trade: blocking briefly avoids a visible change at the cost of invisible text, swapping shows content immediately at the cost of a visible reflow, and a limit means the custom font may never apply on a slow connection. Then reduce the cost: subset to the characters actually needed, ship only the weights and styles genuinely used, self-host with a long cache lifetime and preload the critical file. Then minimise the reflow by choosing a fallback with similar metrics and adjusting its size and spacing to match, which makes the swap nearly invisible.',
    why:
      'Metric-matched fallbacks turn the swap from a jarring reflow into something users do not notice, which resolves the trade-off rather than choosing a side of it.',
    watchOut:
      'Third-party font services add a connection and a dependency on the critical path. Self-hosting is usually faster and always more reliable.',
    related: ['critical-rendering-path', 'core-web-vitals', 'third-party-script-governance', 'image-optimization'],
    tags: ['frontend', 'performance', 'typography', 'loading'],
  },

  {
    id: 'client-data-fetching-strategy',
    name: 'Client Data Fetching',
    aka: ['stale-while-revalidate on the client', 'request deduplication', 'cache and refetch'],
    origin: 'Frontend data library practice; patterns from SWR and React Query',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Client-side data needs a policy for caching, revalidation, deduplication and invalidation — otherwise every component fetches independently and shows different values.',
    useWhen: [
      'three components on the page fetch the same data separately',
      'the list shows stale data after we edited an item',
      'navigating back refetches everything and the page flashes',
      'we manage loading and error state by hand in every component',
    ],
    prompt:
      'Define the data fetching policy for this application. Specify the cache key structure including every parameter that changes the result, deduplication of concurrent identical requests, and the revalidation triggers — on mount, on window focus, on reconnect, and on an interval — with the staleness tolerated per data type rather than one global setting. Then design invalidation after mutations: which cached entries a given mutation invalidates, and whether we refetch or update in place. Finish with the states every consumer must handle, including showing stale data while revalidating, which is the pattern that removes most loading spinners.',
    why:
      'Mapping mutations to the cache entries they invalidate is the part hand-rolled fetching always gets wrong, and stale-while-revalidate is what eliminates the flash on navigation.',
    watchOut:
      'Showing stale data without any indication is wrong for anything where currency matters, such as balances, availability or prices.',
    related: ['cache-invalidation-strategy', 'optimistic-ui', 'client-state-management', 'request-coalescing'],
    tags: ['frontend', 'data', 'caching', 'state'],
  },

  {
    id: 'infinite-scroll-tradeoffs',
    name: 'Infinite Scroll Trade-offs',
    aka: ['endless scrolling versus pagination', 'load more button'],
    origin: 'Interface design practice; long-standing usability debate',
    domains: ['design', 'engineering'],
    intents: ['decide', 'critique'],
    oneLiner:
      'Continuous loading suits browsing and breaks finding, sharing, returning and reaching the footer — choose by what users are trying to do.',
    useWhen: [
      'users cannot get back to an item they saw earlier',
      'nobody can reach the footer links anymore',
      'the page becomes slow and heavy after scrolling for a while',
      'we are choosing between paging and endless loading and arguing about it',
    ],
    prompt:
      'Decide the list navigation pattern for this view based on user intent: continuous loading suits open-ended browsing, explicit paging suits searching for something specific or working through a set systematically, and a load-more button sits between and keeps the footer reachable. Recommend one for our case. Then specify the implementation requirements whichever is chosen: a stable identity in the URL so a position can be shared and restored, restoring the scroll position on back navigation, releasing off-screen items so memory does not grow without limit, keyboard and screen reader accessibility, and stable ordering so items do not repeat or vanish as new ones arrive.',
    why:
      'Position restoration on back navigation and unbounded memory growth are the two failures that make continuous loading feel broken, and both are implementation choices rather than consequences of the pattern.',
    watchOut:
      'Endless loading destroys any sense of how much there is. For sets users need to work through completely, that removes their ability to plan.',
    related: ['api-pagination', 'perceived-performance', 'client-data-fetching-strategy', 'user-journey-mapping'],
    tags: ['frontend', 'user experience', 'lists', 'navigation'],
  },

  {
    id: 'client-state-management',
    name: 'Client State Management',
    aka: ['state colocation', 'global store', 'server state versus UI state'],
    origin: 'Frontend architecture practice',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Separate state by origin — server data, UI state, form state, URL state — because each has a different lifetime and owner, and treating them alike causes most state bugs.',
    useWhen: [
      'our global store contains server data that is always out of date',
      'everything is in one store and any change re-renders the world',
      'the URL does not reflect what the user is looking at',
      'we cannot tell where a piece of state actually lives',
    ],
    prompt:
      'Categorise the state in this application by origin and assign each an owner. Server data belongs in a cache with revalidation rather than in a store treated as truth, since copying it into a store is what makes it go stale. State that should survive a refresh or be shareable belongs in the URL. State used by one component belongs in that component, and only genuinely cross-cutting UI state belongs in a shared store. Apply that classification to our current state and report the misplacements. Then say what each move fixes concretely, and what the smallest state container is that we still need after the reclassification.',
    why:
      'Treating server data as cache rather than as store contents removes an entire class of staleness bugs, and the origin-based classification usually shrinks the global store dramatically.',
    watchOut:
      'Putting everything in the URL makes it unreadable and exposes state you may not want shared. Reserve it for what genuinely identifies the view.',
    related: ['client-data-fetching-strategy', 'mvi-architecture', 'optimistic-ui', 'form-ux-validation'],
    tags: ['frontend', 'state', 'architecture', 'design'],
  },

  {
    id: 'form-ux-validation',
    name: 'Form Validation Experience',
    aka: ['inline validation', 'error timing', 'form usability'],
    origin: 'Interface design research; Luke Wroblewski\'s work on web forms',
    domains: ['design', 'engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'When and how you tell someone their input is wrong determines whether a form feels helpful or hostile — and validating too eagerly is the common mistake.',
    useWhen: [
      'the field turns red while the user is still typing it',
      'users abandon the form at the same field every time',
      'the error appears at the top and nobody knows which field it means',
      'the form clears everything when submission fails',
    ],
    prompt:
      'Design validation behaviour for this form. Set the timing rules: validate a field when the user leaves it rather than on each keystroke, except when confirming success as they type helps such as a password meeting requirements, and never mark a field invalid before they have finished it. Then design the messages: adjacent to the field, stating what is wrong and what would be right rather than restating the rule, and never discarding what they entered. Cover submission failure, where errors must be summarised, linked to their fields, focus moved to the first one, and announced to assistive technology. Finish with the fields that could accept more formats instead of rejecting them.',
    why:
      'Accepting more input formats rather than validating them away removes whole categories of error, and it is the option teams skip in favour of better error messages.',
    watchOut:
      'Client validation is a convenience and never a control. Every rule must also be enforced on the server.',
    related: ['input-validation-boundary', 'error-message-design', 'focus-management', 'client-state-management'],
    tags: ['frontend', 'forms', 'user experience', 'validation'],
  },

  {
    id: 'error-boundaries',
    name: 'Error Boundaries',
    aka: ['component error isolation', 'partial failure in the UI', 'fallback rendering'],
    origin: 'Frontend framework practice; the term from React',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Contain a component failure so it degrades one region instead of blanking the entire application.',
    useWhen: [
      'one broken widget renders the whole page blank',
      'an error in an analytics component took down the checkout',
      'users see a white screen with no explanation',
      'a single malformed record breaks the entire list',
    ],
    prompt:
      'Design failure isolation for this interface. Identify the regions that should fail independently — each should be something a user can do without, and the boundary should sit where a fallback still leaves a usable page — then specify the fallback content per region, which should explain that this part is unavailable rather than showing an empty space. Include a recovery action where retrying could work. Then handle the errors that boundaries do not catch, typically those in asynchronous callbacks and event handlers, and say how those are captured. Finish with reporting, so a contained failure is still visible to us rather than silently degrading for every user.',
    why:
      'Contained failures that are not reported are the trap: the interface looks fine and a feature is broken for everyone, so the reporting requirement is part of the design.',
    watchOut:
      'Wrapping everything in boundaries can hide a systemic failure behind many small fallbacks. Boundaries need monitoring at least as much as crashes do.',
    related: ['client-error-monitoring', 'graceful-degradation', 'skeleton-vs-spinner', 'fail-fast-vs-fault-tolerance'],
    tags: ['frontend', 'error handling', 'resilience', 'user experience'],
  },

  {
    id: 'client-error-monitoring',
    name: 'Client Error Monitoring',
    aka: ['browser error reporting', 'crash reporting', 'source maps in production'],
    origin: 'Frontend operations practice',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Errors happening in users\' browsers are invisible to server monitoring, and without reporting you learn about them from support tickets or not at all.',
    useWhen: [
      'a customer reported a broken page and we have no record of it',
      'the error only happens in one browser version',
      'our stack traces are minified and meaningless',
      'we do not know how many users hit errors',
    ],
    prompt:
      'Set up client-side error reporting. Specify what is captured beyond the message and stack: browser and version, application release, the user action leading to it, and a breadcrumb trail of recent events, since a stack trace without the sequence that produced it is rarely enough. Then handle the practical obstacles — uploading source maps privately so traces are readable without exposing source, grouping errors so one broken deploy does not create thousands of separate reports, and filtering the noise from browser extensions and third-party scripts that will otherwise dominate the volume. Finish with the privacy rules on what may be captured and the alerting threshold based on affected user rate.',
    why:
      'Extension and third-party noise is what makes client error reporting unusable, and filtering it plus grouping by release is what leaves a signal anyone will act on.',
    watchOut:
      'Capturing the state that caused an error can capture personal data typed into a form. Redaction rules have to be part of the setup.',
    related: ['error-boundaries', 'real-user-monitoring', 'observability-instrumentation', 'browser-support-matrix'],
    tags: ['frontend', 'monitoring', 'errors', 'observability'],
  },

  {
    id: 'offline-first-sync',
    name: 'Offline-First Sync',
    aka: ['local-first software', 'sync engine', 'conflict resolution on reconnect'],
    origin: 'Mobile and local-first application practice; Ink and Switch local-first essay, 2019',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Treat the local copy as primary and the server as a synchronisation partner, which makes the application work offline and makes conflict resolution a first-class design problem.',
    useWhen: [
      'the app is useless on a train or in a lift',
      'users lose work when the connection drops',
      'we sync on reconnect and sometimes overwrite changes',
      'the mobile experience on a poor network is unusable',
    ],
    prompt:
      'Design offline-capable synchronisation for this application. Specify the local store and what is available offline versus what genuinely requires the network. Then design the change queue: how local mutations are recorded, ordered and retried, and how they are made idempotent so a retry after an ambiguous failure does not duplicate. Conflict resolution is the heart of it, so define per data type whether last-write-wins is acceptable, whether changes can be merged automatically, or whether a user must decide — and design what that decision looks like. Finish with the visible state: how the interface shows what is unsynced, what failed, and how much has queued up.',
    why:
      'Making the sync state visible and deciding conflict policy per data type are what prevent silent data loss, which is the failure that destroys trust in an offline-capable app.',
    watchOut:
      'A device offline for a long time can return with changes conflicting against many later ones. Test the long-absence case, not just a brief disconnection.',
    related: ['crdt', 'optimistic-ui', 'idempotency-keys', 'eventual-consistency'],
    tags: ['frontend', 'offline', 'sync', 'mobile'],
  },

  {
    id: 'progressive-enhancement',
    name: 'Progressive Enhancement',
    aka: ['works without JavaScript', 'layered capability', 'resilient web design'],
    origin: 'Web standards practice; Steven Champeon, 2003',
    domains: ['engineering', 'design'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Build the core experience with the most reliable technology available and layer enhancements on top, so a failure in one layer degrades the experience rather than removing it.',
    useWhen: [
      'a script failed to load and the entire page is unusable',
      'the form does not submit if JavaScript is disabled or broken',
      'users on old devices or poor networks get nothing at all',
      'someone says nobody disables JavaScript and I want a better argument',
    ],
    prompt:
      'Assess this feature for layered resilience. Make the argument on the right grounds, which is not about users disabling scripts but about the many ways a script fails to run — a failed request, a parse error from an unsupported syntax, an extension, a timeout on a poor connection, a third party breaking. Then define the base experience that works without our enhancements and what each layer adds. Apply it concretely to forms and navigation, which are the highest-value cases because the platform already provides working versions. Finish with what genuinely cannot work this way and what the fallback should say when it cannot function.',
    why:
      'Framing this as script-fails-to-run rather than script-disabled is what makes the argument land, since the failure modes are common and measurable rather than hypothetical.',
    watchOut:
      'Fully duplicating rich interactions in a basic form can double the work. Aim for a usable base, not an equivalent one.',
    related: ['server-vs-client-rendering', 'graceful-degradation', 'browser-support-matrix', 'error-boundaries'],
    tags: ['frontend', 'resilience', 'accessibility', 'web standards'],
  },

  {
    id: 'browser-support-matrix',
    name: 'Browser Support Matrix',
    aka: ['supported environments', 'baseline compatibility', 'feature detection'],
    origin: 'Web development practice',
    domains: ['engineering'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Write down which environments you support, at what level, based on your actual audience — so decisions about using a new capability stop being arguments.',
    useWhen: [
      'nobody knows whether we still support that old browser',
      'we avoid modern features in case someone somewhere cannot use them',
      'a customer reported a failure on a browser we did not know we supported',
      'our build targets an ancient baseline and ships enormous compatibility code',
    ],
    prompt:
      'Define our support policy from data. Pull the actual distribution of browsers, versions and devices from our analytics, weighted by revenue or by the importance of the users rather than by raw session count, since a small share may be a large customer. Then define tiers: fully supported and tested, functional but not visually identical, and unsupported with a clear message rather than a broken page. Tie the build targets to that policy so we are not shipping compatibility code for environments we do not support. Finish with the review cadence and how a capability is adopted — feature detection with a fallback rather than version sniffing.',
    why:
      'Weighting by user importance rather than session share is what makes the policy defensible, and tying build targets to it removes compatibility overhead nobody realised was there.',
    watchOut:
      'Analytics under-counts environments where your site already fails, since those users leave without generating sessions. Check error reports too.',
    related: ['progressive-enhancement', 'client-error-monitoring', 'dependency-weight-budget', 'accessibility-audit'],
    tags: ['frontend', 'compatibility', 'policy', 'browsers'],
  },

  {
    id: 'responsive-breakpoints',
    name: 'Responsive Breakpoints',
    aka: ['mobile first', 'container queries', 'fluid layout'],
    origin: 'Ethan Marcotte, Responsive Web Design, 2010',
    domains: ['design', 'engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Choose layout change points from where the content stops working rather than from a list of device widths, because devices change and content constraints do not.',
    useWhen: [
      'the layout breaks at a size between our breakpoints',
      'we have breakpoints named after phones from years ago',
      'the component looks wrong in a sidebar although the page width is fine',
      'we maintain separate layouts for every device class',
    ],
    prompt:
      'Rework the responsive strategy for this interface. Derive breakpoints from content: resize continuously and note where lines become too long or too short, where a table stops being readable, or where a navigation no longer fits — those points are the breakpoints, and they should be named for what changes rather than for a device. Then prefer intrinsic sizing and fluid values so fewer explicit breakpoints are needed, and use container-relative queries where a component must adapt to its own space rather than the viewport, which is the fix for a component that looks wrong in a sidebar. Finish with the testing sizes, including the awkward ones between common devices.',
    why:
      'Content-derived breakpoints survive new devices, and container-relative sizing is the specific answer to components that must work in several contexts at once.',
    watchOut:
      'Designs specified at three fixed widths hide what happens between them. Most real viewports are not any of the sizes in the mockups.',
    related: ['css-architecture', 'component-api-design', 'design-system-governance', 'theming-and-dark-mode'],
    tags: ['frontend', 'layout', 'responsive', 'design'],
  },

  {
    id: 'theming-and-dark-mode',
    name: 'Theming and Dark Mode',
    aka: ['design tokens', 'colour modes', 'semantic colour naming'],
    origin: 'Design systems practice; accelerated by system-level dark mode',
    domains: ['design', 'engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Support alternative appearances by naming colours for their role rather than their value, so a theme is a swap of tokens instead of a rewrite.',
    useWhen: [
      'adding dark mode means finding every colour in the codebase',
      'our dark theme has unreadable text in half a dozen places',
      'the same grey is used for borders, text and backgrounds',
      'the theme flashes light before switching to dark on load',
    ],
    prompt:
      'Design the theming layer for this interface. Replace value-based colour names with role-based tokens — surface, surface raised, text primary, text muted, border, accent, danger — so each theme provides values for the same roles, and note that a single grey used for several roles is what makes theming impossible. Then require contrast checking per theme rather than once, since a pairing that passes in one mode often fails in the other, and cover states like hover, disabled and focus which are usually forgotten. Finish with the mechanics: respecting the system preference, allowing an override, persisting it, and applying it before first paint to avoid a flash.',
    why:
      'Role-based tokens are what make a second theme a data change rather than a rewrite, and per-theme contrast checking catches the failures that a single audit misses.',
    watchOut:
      'Dark mode is not an inversion. Elevation, shadows and image treatment all need their own decisions or the result looks wrong even with correct contrast.',
    related: ['design-system-governance', 'accessibility-audit', 'css-architecture', 'responsive-breakpoints'],
    tags: ['frontend', 'design systems', 'accessibility', 'theming'],
  },

  {
    id: 'design-system-governance',
    name: 'Design System Governance',
    aka: ['component library ownership', 'contribution model', 'system versus product teams'],
    origin: 'Design systems practice',
    domains: ['design', 'engineering'],
    intents: ['plan', 'decide'],
    oneLiner:
      'A shared component library succeeds or fails on its governance — who decides what belongs, how teams contribute, and how breaking changes reach consumers.',
    useWhen: [
      'every team has forked the button component',
      'the design system team is a bottleneck for every request',
      'nobody uses the shared components because they never fit',
      'a change to a shared component broke three products',
    ],
    prompt:
      'Design the governance model for our shared component library. Define what belongs in it — patterns used by several products and stable enough to standardise — and what deliberately stays in product code, since an over-inclusive system becomes a bottleneck. Then design the contribution path so a team needing a variant can add it rather than forking, with review by the system owners but not a queue they must join. Specify the versioning and adoption policy: how a breaking change is communicated and migrated, whether consumers upgrade on their own schedule, and how much version skew is tolerated. Finish with the adoption measure that shows whether it is working.',
    why:
      'The contribution path is what determines whether teams fork, and forks are the failure mode that quietly ends a design system while the library still exists.',
    watchOut:
      'A system that cannot express a legitimate product need forces teams to work around it, and those workarounds become the real system.',
    related: ['component-api-design', 'theming-and-dark-mode', 'plugin-architecture', 'semantic-versioning'],
    tags: ['design systems', 'governance', 'collaboration', 'frontend'],
  },

  {
    id: 'component-api-design',
    name: 'Component API Design',
    aka: ['props design', 'composition versus configuration', 'slot patterns'],
    origin: 'Component-based frontend practice',
    domains: ['engineering', 'design'],
    intents: ['structure', 'critique'],
    oneLiner:
      'A reusable component either grows a configuration option for every variation or exposes composition points — the second scales and the first does not.',
    useWhen: [
      'this component has twenty-three properties and counting',
      'every new use case needs another boolean flag',
      'the component is so flexible it is easier to write your own',
      'two flags interact and produce a combination nobody designed',
    ],
    prompt:
      'Review this component interface. Count the configuration options and identify how many exist to support a single caller, since those are the signal that configuration is being used where composition belongs. Then propose the composition alternative: exposing slots or children so callers supply structure rather than toggling behaviour, and splitting a component that is really two into separate ones sharing internals. Apply the design rules: no boolean that changes what the component fundamentally is, no option whose valid values depend on another option, and defaults that make the common case require almost nothing. Finish with what the interface should refuse to support.',
    why:
      'Counting options that exist for one caller is a concrete measure of configuration creep, and refusing to support some cases is what keeps a shared component coherent.',
    watchOut:
      'Composition pushes responsibility onto callers, who may then all implement the common case slightly differently. Provide an easy default alongside the flexible form.',
    related: ['design-system-governance', 'api-ergonomics', 'strategy-pattern', 'interface-segregation'],
    tags: ['frontend', 'components', 'api design', 'reuse'],
  },

  {
    id: 'css-architecture',
    name: 'CSS Architecture',
    aka: ['BEM', 'utility classes', 'scoped styles', 'specificity management'],
    origin: 'Frontend styling practice; methodologies from BEM through utility-first',
    domains: ['engineering', 'design'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Styling at scale is a naming and scoping problem: without a convention, specificity escalates and nobody can safely delete a rule.',
    useWhen: [
      'nobody dares delete any CSS in case something breaks',
      'we keep adding important to override our own rules',
      'a style change in one place broke a page nobody was thinking about',
      'the stylesheet has grown for years and only ever grows',
    ],
    prompt:
      'Recommend a styling approach for this codebase. Evaluate the options — strict naming conventions, component-scoped styles, or utility classes — against three things that actually matter here: whether a style can be changed without unknown side effects, whether unused styles can be identified and deleted, and how the approach handles the cascade for genuinely global concerns like typography and spacing. Then specify what stays global: tokens, resets and layout primitives. Finish with the migration path from the current state, which should be incremental with new work in the new approach rather than a rewrite, and the rule preventing specificity escalation.',
    why:
      'Deletability is the property that determines whether a stylesheet stops growing, and it is the criterion most methodology comparisons leave out.',
    watchOut:
      'Any approach applied inconsistently is worse than the one you had, because now readers must understand two systems and where each applies.',
    related: ['design-system-governance', 'theming-and-dark-mode', 'dead-code-removal', 'responsive-breakpoints'],
    tags: ['frontend', 'css', 'architecture', 'maintainability'],
  },

  {
    id: 'keyboard-navigation',
    name: 'Keyboard Navigation',
    aka: ['tab order', 'keyboard accessibility', 'no mouse required'],
    origin: 'Accessibility practice; WCAG operable criteria',
    domains: ['design', 'engineering'],
    intents: ['critique', 'structure'],
    oneLiner:
      'Everything achievable with a pointer must be achievable from the keyboard, in a sensible order, with visible indication of where you are.',
    useWhen: [
      'the custom dropdown cannot be opened without a mouse',
      'tabbing through the page jumps around unpredictably',
      'the focus outline was removed because it looked untidy',
      'you can tab into a hidden menu that is off screen',
    ],
    prompt:
      'Audit this interface for keyboard operability. Walk the page with the keyboard alone and record: whether every interactive element is reachable, whether the order follows the visual reading order, whether focus is always visible, and whether any action requires a pointer. Then check the patterns that commonly fail — custom controls built from non-interactive elements, modals that do not trap focus or that lose it on close, off-screen content that remains focusable, and content whose visibility depends on hover. For each finding, give the fix, preferring native interactive elements over recreating their behaviour, since that removes most of the work.',
    why:
      'Preferring native elements over rebuilt ones is the fix that resolves most keyboard findings at once, and the walk-the-page procedure produces evidence rather than a checklist opinion.',
    watchOut:
      'Adding tab index values to force an order creates a separate sequence that diverges from the visual layout as soon as anything changes. Fix the source order instead.',
    related: ['focus-management', 'screen-reader-testing', 'accessibility-audit', 'component-api-design'],
    tags: ['accessibility', 'frontend', 'keyboard', 'usability'],
  },

  {
    id: 'focus-management',
    name: 'Focus Management',
    aka: ['focus trapping', 'moving focus after navigation', 'skip links'],
    origin: 'Accessibility engineering practice; WAI-ARIA authoring practices',
    domains: ['engineering', 'design'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'In an application that changes content without a page load, you must move focus deliberately, or keyboard and screen reader users are left behind.',
    useWhen: [
      'after opening a dialog the keyboard is still on the page behind it',
      'navigating to a new view leaves focus at the top with no announcement',
      'closing a menu loses focus entirely and tabbing starts from the beginning',
      'the new content appeared and screen reader users did not know',
    ],
    prompt:
      'Specify focus behaviour for these interactions. For each, state where focus goes and where it returns: opening a dialog moves focus inside and traps it, closing returns it to the trigger, client-side navigation moves it to the new content heading, and removing a focused element moves it to a sensible neighbour rather than to the document. Then cover announcement, since moving focus is only half of it — content appearing without focus moving needs a live region, and every live region needs a politeness level chosen so it does not interrupt. Finish with the skip link for repeated navigation and how it is verified to work.',
    why:
      'The pair of rules — where focus goes and where it returns — is what makes dialogs and client-side navigation usable, and it is the specific thing single-page applications break by default.',
    watchOut:
      'Live regions that announce every change are as unusable as silence. Reserve assertive announcements for things that genuinely interrupt.',
    related: ['keyboard-navigation', 'screen-reader-testing', 'accessibility-audit', 'client-state-management'],
    tags: ['accessibility', 'frontend', 'focus', 'usability'],
  },

  {
    id: 'screen-reader-testing',
    name: 'Screen Reader Testing',
    aka: ['assistive technology testing', 'semantic markup verification', 'accessible name'],
    origin: 'Accessibility practice',
    domains: ['engineering', 'design'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Automated checks catch a minority of accessibility problems; hearing the interface read aloud reveals whether it is actually usable.',
    useWhen: [
      'we pass the automated audit and a user still cannot complete the task',
      'the button is announced as just button with no label',
      'the reading order makes no sense even though the page looks fine',
      'nobody on the team has ever used the site with a screen reader',
    ],
    prompt:
      'Plan screen reader verification for this interface. Specify which combinations to test, since behaviour differs by reader and browser pairing, and which one or two pairings give the best coverage for our audience. Then define the procedure as tasks rather than element checks: complete the primary journey using the reader and record where you get stuck, because element-level checking misses the failures that only appear in sequence. Focus on what automation cannot see — whether names are meaningful rather than merely present, whether the heading structure conveys the page, whether relationships between labels and controls are correct, and whether state changes are announced.',
    why:
      'Task-based testing surfaces the failures that element-level automation cannot see, and meaningful-versus-present labels is the gap that produces technically compliant, unusable pages.',
    watchOut:
      'A sighted developer testing with a screen reader has context a real user lacks. Treat it as finding problems, not as proving their absence.',
    related: ['keyboard-navigation', 'focus-management', 'accessibility-audit', 'exploratory-testing-charter'],
    tags: ['accessibility', 'testing', 'frontend', 'inclusive design'],
  },

  {
    id: 'internationalization',
    name: 'Internationalisation',
    aka: ['i18n', 'localisation readiness', 'pluralisation and formatting'],
    origin: 'Software globalisation practice; Unicode and CLDR standards',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Separating translatable text from code is the easy part; the hard parts are grammar, formatting, layout expansion and text that assumes English structure.',
    useWhen: [
      'we concatenate sentence fragments and they are untranslatable',
      'the German text overflows every button',
      'the date shows as month day year to everyone',
      'plural handling breaks in languages with more than two forms',
    ],
    prompt:
      'Prepare this application for translation. Beyond extracting strings, address the parts that break: sentences assembled from fragments, which must become whole templates with placeholders since word order differs; pluralisation, which needs the full set of categories rather than a singular and a plural; and any grammatical agreement that a placeholder cannot carry. Then cover formatting through locale-aware facilities for dates, numbers, currency, names and addresses rather than our own. Finally cover presentation: layout that tolerates text expanding substantially, right-to-left support, and fonts covering the required scripts. Finish with how translators get the context they need to translate correctly.',
    why:
      'Concatenated fragments and naive pluralisation are the two things that make a codebase fundamentally untranslatable, and both look fine until translation begins.',
    watchOut:
      'Machine-translated interface text without review produces confident nonsense in exactly the places users need clarity, such as errors and confirmations.',
    related: ['timezone-handling', 'plain-language', 'responsive-breakpoints', 'accessibility-audit'],
    tags: ['frontend', 'internationalisation', 'localisation', 'text'],
  },

  {
    id: 'timezone-handling',
    name: 'Time Zone Handling',
    aka: ['storing timestamps', 'UTC versus local', 'daylight saving bugs'],
    origin: 'Long-standing practice; the tz database and its regular political updates',
    domains: ['engineering', 'data'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Store instants in a single absolute reference and render in the viewer\'s zone — except for future local events, where the zone identifier must be stored because offsets change.',
    useWhen: [
      'the report is off by a day for users in another country',
      'a recurring meeting shifted by an hour after the clocks changed',
      'we store local times and cannot compare them',
      'the daily job ran twice on the day the clocks went back',
    ],
    prompt:
      'Review time handling in this system and classify every stored time value by what it represents. An instant that already happened is stored absolutely and rendered per viewer. A future local event needs the zone identifier stored alongside, because the offset for that date may change through political decisions and an offset stored today can become wrong. A date without a time, like a birthday, must not be given one. Report our misclassifications. Then check the boundary cases: day boundaries for reports where the user\'s day differs from the server\'s, ambiguous and skipped local times at transitions, and scheduled jobs at times that may occur twice or not at all.',
    why:
      'The stored-offset-becomes-wrong problem for future events is the subtle one, and classifying every value by what it represents is what catches all three categories at once.',
    watchOut:
      'The time zone database changes several times a year. Systems that embed a copy will disagree with the world until they are updated.',
    related: ['deterministic-clock', 'internationalization', 'temporal-data-modeling', 'logical-clocks'],
    tags: ['engineering', 'time', 'correctness', 'internationalisation'],
  },

  {
    id: 'third-party-script-governance',
    name: 'Third-Party Script Governance',
    aka: ['tag management', 'vendor script risk', 'supply chain in the browser'],
    origin: 'Web performance and security practice',
    domains: ['engineering', 'security'],
    intents: ['critique', 'plan'],
    oneLiner:
      'Every external script runs with full access to your page and can slow it, break it, or read anything on it — and marketing usually adds them faster than engineering removes them.',
    useWhen: [
      'a vendor script went down and took our checkout with it',
      'nobody knows what half these tags do or who added them',
      'our page loads eleven third-party scripts',
      'an analytics change broke the site with no deploy from us',
    ],
    prompt:
      'Audit our third-party scripts. For each, record the owner, the business purpose, the performance cost measured with and without it, and the access it has to page content and user data — noting that a script included directly can read anything on the page including form fields. Then classify by whether it must run during the critical path, could be deferred, or could be removed. Propose the controls: loading strategy per script, a content policy restricting what may be loaded, integrity checks where the vendor supports them, and the process by which a new script is approved rather than added directly. Finish with the failure behaviour when a vendor is slow or down.',
    why:
      'Measuring the cost with and without each script gives an evidence base for removal, and the vendor-goes-down failure behaviour is what turns this from a performance concern into an availability one.',
    watchOut:
      'A tag manager makes adding scripts a non-engineering action with no review. That convenience is exactly the governance gap.',
    related: ['csp-configuration', 'critical-rendering-path', 'supply-chain-provenance', 'dependency-weight-budget'],
    tags: ['frontend', 'security', 'performance', 'governance'],
  },

  {
    id: 'csp-configuration',
    name: 'Content Security Policy',
    aka: ['CSP', 'script source restrictions', 'nonce-based policies'],
    origin: 'Web security standard; widely deployed since the mid-2010s',
    domains: ['security', 'engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Declare which sources the browser may load and execute, so an injected script has nowhere to come from even if injection succeeds.',
    useWhen: [
      'we want defence against injected scripts beyond output escaping',
      'our policy allows unsafe inline and therefore does very little',
      'a compliance requirement asks for a content policy',
      'we tried to add one and it broke the site',
    ],
    prompt:
      'Design a content security policy for this application. Start in report-only mode and collect violations from real traffic, since guessing the required sources is what breaks sites. Then build the policy toward a strict form: nonce or hash based script sources rather than a host allowlist, because an allowlist containing a large content network is easily bypassed. Enumerate what currently requires inline scripts or styles and give the migration for each, since those are the actual work. Cover the other directives that matter — frame ancestors, object sources, base URI and form actions — and finish with the violation reporting endpoint and how a legitimate new source gets added.',
    why:
      'Host allowlists containing large shared origins provide much weaker protection than teams assume, and the report-only-first sequence is what makes deployment safe.',
    watchOut:
      'A policy with unsafe inline permitted offers almost no protection against the attack it exists to stop. Partial adoption can be worse than none if it creates false confidence.',
    related: ['xss-prevention', 'third-party-script-governance', 'cors-configuration', 'defense-in-depth'],
    tags: ['security', 'frontend', 'browser', 'headers'],
  },

  {
    id: 'xss-prevention',
    name: 'Cross-Site Scripting Prevention',
    aka: ['XSS', 'output encoding', 'sanitisation versus escaping'],
    origin: 'Web security practice; OWASP guidance',
    domains: ['security', 'engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Untrusted content becomes executable when it reaches a context that interprets it — the defence is context-correct encoding at output, not filtering at input.',
    useWhen: [
      'we filter script tags on input and I am told that is not enough',
      'user content is rendered as HTML somewhere in our application',
      'we use the dangerous render-raw-HTML escape hatch in a few places',
      'a penetration test found injection in an attribute we thought was safe',
    ],
    prompt:
      'Audit this application for injection into rendering contexts. Trace untrusted data to every output point and identify the context each lands in — HTML body, attribute, URL, JavaScript, CSS — since each needs different encoding and the correct one for HTML text is wrong inside an attribute or a URL. Report every place raw HTML is inserted deliberately and what sanitises it, requiring a maintained allowlist-based sanitiser rather than our own filtering. Then cover the second-order case where content is stored safely and rendered unsafely later, and the URL case where a script-scheme link executes. Finish with the framework features that make safe rendering the default.',
    why:
      'Context-correct output encoding is the actual defence and input filtering is the common misunderstanding, so tracing to output points by context is what finds the real gaps.',
    watchOut:
      'Writing your own sanitiser is a losing game against browser parsing quirks. Use a maintained library and keep it updated.',
    related: ['csp-configuration', 'input-validation-boundary', 'trust-boundary', 'attack-surface-reduction'],
    tags: ['security', 'frontend', 'injection', 'web'],
  },

  {
    id: 'csrf-protection',
    name: 'Cross-Site Request Forgery Protection',
    aka: ['CSRF tokens', 'SameSite cookies', 'state-changing request protection'],
    origin: 'Web security practice; OWASP guidance',
    domains: ['security', 'engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'A browser attaches your cookies to requests another site triggers, so a state-changing endpoint authenticated only by a cookie can be invoked by any page the user visits.',
    useWhen: [
      'our form posts are authenticated by a session cookie and nothing else',
      'someone asked how we prevent request forgery and I did not know',
      'we moved to a token in a header and I am unsure whether we still need protection',
      'a state change happens on a request that only reads on paper',
    ],
    prompt:
      'Audit this application for request forgery exposure. Enumerate every state-changing endpoint and state what authenticates it, since the vulnerability exists precisely where authentication is ambient — a cookie the browser sends automatically — and does not exist where the caller must supply a credential the attacking page cannot read. Then specify the layered defence: cookie attributes restricting cross-site sending, a per-session token verified on every state-changing request, and verification of the request origin. Cover the endpoints that change state behind a read-shaped method, which the token check often misses. Finish with the interaction between these controls and any legitimate cross-site integration we support.',
    why:
      'Framing the vulnerability as ambient authentication explains exactly which endpoints are exposed and why header-token authentication is not, which is the question teams get wrong in both directions.',
    watchOut:
      'Cookie attribute defaults have improved but vary by browser and version, and they do not protect same-site subdomains you do not fully control. Layer the defences.',
    related: ['xss-prevention', 'cors-configuration', 'idempotent-http-methods', 'api-authentication-choice'],
    tags: ['security', 'frontend', 'web', 'authentication'],
  },
]
