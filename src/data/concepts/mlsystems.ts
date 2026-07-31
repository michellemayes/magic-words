import type { Concept } from '../types'

export const mlSystems: Concept[] = [
  {
    id: 'training-serving-skew',
    name: 'Training-Serving Skew',
    aka: ['feature skew', 'offline online mismatch', 'transform drift'],
    origin: 'Google\'s Rules of Machine Learning; production ML practice',
    domains: ['engineering', 'data'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'The model performs worse in production than in evaluation because the features it receives at serving time are computed differently from those it was trained on.',
    useWhen: [
      'the model scored well offline and performs badly for real users',
      'the training pipeline and the serving code compute features separately',
      'a feature definition changed and only one side was updated',
      'we cannot explain the gap between our evaluation and reality',
    ],
    prompt:
      'Diagnose skew between training and serving for this model. Compare the two paths feature by feature: how each is computed, from what source, with what defaults for missing values, and with what data available at the moment of computation — the last is the subtle one, since training may use values that did not exist yet at serving time. Then propose the structural fix, which is a single implementation used by both paths rather than two implementations kept in agreement by discipline. Where that is impossible, specify the continuous comparison: log serving-time feature values and compare their distributions against training data, and alert on divergence.',
    why:
      'Shared feature computation is the only durable fix, and logging serving features for distribution comparison is what detects skew before the metrics degrade visibly.',
    watchOut:
      'Skew can appear without any code change, when an upstream data source changes its format, timing or default behaviour.',
    related: ['feature-store', 'data-drift-detection', 'model-monitoring', 'reproducible-training'],
    tags: ['machine learning', 'production', 'features', 'diagnosis'],
  },

  {
    id: 'data-leakage',
    name: 'Data Leakage',
    aka: ['target leakage', 'train-test contamination', 'too good to be true results'],
    origin: 'Machine learning methodology; Kaufman and colleagues, 2012',
    domains: ['data', 'engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Information available in training but not at prediction time inflates evaluation scores and produces a model that fails completely in production.',
    useWhen: [
      'the model gets ninety-nine percent accuracy and I do not believe it',
      'performance collapsed when we deployed',
      'one feature dominates and I am not sure why it is available',
      'we split the data randomly and the records are related',
    ],
    prompt:
      'Audit this modelling setup for leakage. Check the classic sources in order: features computed from data that only exists after the outcome, features derived from the target however indirectly, preprocessing such as scaling or imputation fitted on the whole dataset before splitting, and a split that separates rows but not entities or time — grouped or temporal data split randomly leaks between folds. For each feature, state whether its value would genuinely be available at the moment of prediction, which is the decisive test. Then recommend the correct split strategy for our data, and say what the honest performance estimate looks like once leakage is removed.',
    why:
      'The would-this-value-exist-at-prediction-time test catches most leakage in one pass, and the split-by-entity-or-time issue is what silently inflates results on data people assume is independent.',
    watchOut:
      'Leakage often enters through a feature that is genuinely available but only because of an operational quirk that will change. Check why it is available, not just that it is.',
    related: ['training-serving-skew', 'offline-online-metric-gap', 'reproducible-training', 'confounders-check'],
    tags: ['machine learning', 'evaluation', 'methodology', 'correctness'],
  },

  {
    id: 'feature-store',
    name: 'Feature Store',
    aka: ['feature platform', 'online and offline feature serving', 'point-in-time correctness'],
    origin: 'Uber Michelangelo, 2017; now a standard component category',
    domains: ['data', 'engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'A shared system for defining, computing and serving features to both training and inference, whose main value is point-in-time correctness and reuse.',
    useWhen: [
      'every model reimplements the same features slightly differently',
      'our training data accidentally used values from after the event',
      'a feature works in the notebook and not in the service',
      'someone is proposing a feature platform and I need the actual criteria',
    ],
    prompt:
      'Assess whether a shared feature platform is justified here, and be specific rather than accepting the category as obviously good. The two properties that matter are one definition serving both training and inference, and point-in-time correct retrieval so a training example only sees values that existed at its timestamp — explain what building that correctly requires, since it is the hard part and the reason ad hoc joins produce leakage. Then weigh against the cost: another system to operate, and a coupling between teams. Recommend based on how many models and teams share features, since with one model the platform is overhead.',
    why:
      'Point-in-time correctness is the property that prevents a whole class of leakage and is genuinely hard to build ad hoc, so it is the criterion that decides whether the platform earns its cost.',
    watchOut:
      'Adopting a feature platform without solving the online serving latency for your actual feature set can add a hop that the model budget cannot afford.',
    related: ['training-serving-skew', 'data-leakage', 'temporal-data-modeling', 'reproducible-training'],
    tags: ['machine learning', 'data platform', 'features', 'architecture'],
  },

  {
    id: 'labeling-quality',
    name: 'Labelling Quality',
    aka: ['annotation guidelines', 'inter-annotator agreement', 'label noise'],
    origin: 'Supervised learning practice; annotation methodology from linguistics and vision',
    domains: ['data'],
    intents: ['structure', 'critique'],
    oneLiner:
      'A model cannot be more consistent than its labels, so measure annotator agreement and treat disagreement as evidence the task definition is ambiguous.',
    useWhen: [
      'the model is confused about exactly the cases our annotators disagreed on',
      'we have labels and no idea how reliable they are',
      'two annotators labelled the same items differently and nobody noticed',
      'the guideline is one sentence and everyone interprets it differently',
    ],
    prompt:
      'Design a labelling process for this task. Write the guideline as decision rules with worked examples including the hard cases, since ambiguity in the guideline appears directly as noise in the model. Then measure agreement by having multiple annotators label an overlapping sample, and treat systematic disagreement as a specification defect to fix rather than as annotator error — that reframing is what improves the data. Specify the adjudication process for disagreements and the ongoing quality checks including planted items with known answers. Finish with the label error audit: sample the existing labels and estimate the error rate, since it bounds achievable model performance.',
    why:
      'Treating annotator disagreement as evidence of an ambiguous task rather than as annotator error is what turns quality measurement into an improvement loop.',
    watchOut:
      'High agreement can mean the guideline encodes a shared bias rather than that the labels are correct. Agreement is necessary, not sufficient.',
    related: ['data-quality-checks', 'fairness-auditing', 'human-in-the-loop-review', 'data-leakage'],
    tags: ['machine learning', 'data quality', 'annotation', 'methodology'],
  },

  {
    id: 'reproducible-training',
    name: 'Reproducible Training',
    aka: ['experiment tracking', 'lineage for models', 'can we rebuild this model'],
    origin: 'ML engineering practice',
    domains: ['engineering', 'data'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Being able to rebuild a model exactly requires versioning the data, the code, the configuration and the environment together — any one missing and you cannot.',
    useWhen: [
      'the model in production was trained by someone who has left',
      'we cannot reproduce the results from three months ago',
      'we do not know which data version produced this model',
      'an auditor asked how a decision was made and we could not answer',
    ],
    prompt:
      'Establish reproducibility for our training. Enumerate what must be captured for a training run: the code commit, the data snapshot or query with a version rather than a live table, all hyperparameters and configuration, the environment including library versions and hardware, and the random seeds. Then be honest about the limits — some operations are nondeterministic on parallel hardware, so state where bit-exact reproduction is impossible and what statistical equivalence we can promise instead. Specify what is recorded per run and where. Finish with the audit question the setup must answer: given a prediction, identify the model, the data it was trained on, and who approved its deployment.',
    why:
      'Data versioning is the component people omit, and distinguishing bit-exact from statistically equivalent reproduction is what makes the claim honest under scrutiny.',
    watchOut:
      'Training against a live table rather than a snapshot means the run can never be reproduced, even with everything else captured perfectly.',
    related: ['model-registry-versioning', 'data-lineage', 'reproducible-builds', 'feature-store'],
    tags: ['machine learning', 'reproducibility', 'lineage', 'governance'],
  },

  {
    id: 'model-registry-versioning',
    name: 'Model Registry',
    aka: ['model versioning', 'model lineage', 'promotion of models'],
    origin: 'MLOps practice',
    domains: ['engineering', 'data'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Treat a trained model as a versioned artefact with metadata, approval state and lineage, so deploying, comparing and rolling back are ordinary operations.',
    useWhen: [
      'nobody knows which model version is currently serving',
      'we cannot roll back to the previous model quickly',
      'the model file was copied to a server by hand',
      'we have no record of what each model was evaluated against',
    ],
    prompt:
      'Design model artefact management for us. Specify what each registered version carries: the artefact itself, the training run reference, the evaluation results against a named dataset version, the intended use and known limitations, and the approval state. Then define the promotion path from candidate to production with the gate criteria, mirroring how code is promoted, and the rollback procedure with the previous version retained and immediately deployable. Then address the two ML-specific parts: comparing a candidate against the incumbent on the same evaluation set, and the retention policy for old models given that reproducing a prediction from a past decision may be required.',
    why:
      'Requiring an evaluation against a named dataset version with each registration is what makes candidate-versus-incumbent comparison meaningful rather than a comparison of two differently-measured numbers.',
    watchOut:
      'A registry that records artefacts but not the data version behind them cannot answer the questions that matter during an incident or an audit.',
    related: ['reproducible-training', 'model-rollout-strategy', 'artifact-immutability', 'model-monitoring'],
    tags: ['machine learning', 'mlops', 'versioning', 'governance'],
  },

  {
    id: 'offline-online-metric-gap',
    name: 'Offline-Online Metric Gap',
    aka: ['why the A/B test disagreed with the evaluation', 'proxy metric mismatch'],
    origin: 'Applied machine learning and experimentation practice',
    domains: ['data', 'engineering'],
    intents: ['diagnose', 'critique'],
    oneLiner:
      'A model that scores better offline frequently performs no better or worse in a live test, because the offline metric is a proxy measured on a biased sample.',
    useWhen: [
      'the new model was better on every offline metric and the test was flat',
      'our accuracy improved and the business metric did not',
      'we keep shipping models that do not move anything',
      'the evaluation data comes from what the old model chose to show',
    ],
    prompt:
      'Explain the gap between our offline evaluation and the live result for this model. Work through the standard causes: the offline metric is a proxy for a business outcome and the relationship is weak, the evaluation data was collected under the current model so it is biased toward what that model already surfaces, the improvement is real but too small to detect at our traffic, or the model changed user behaviour in a way the offline evaluation cannot represent. Determine which applies here with evidence. Then recommend the corrections: counterfactual evaluation accounting for the logging policy, a better-correlated proxy validated against past experiments, and the decision rule for when offline results justify a live test.',
    why:
      'Feedback bias in evaluation data collected under the incumbent model is the cause teams most often miss, and validating the proxy against past experiments is what makes offline gates trustworthy.',
    watchOut:
      'Chasing offline metric improvements without periodically validating the proxy leads to a long series of models that improve a number nobody cares about.',
    related: ['data-leakage', 'feedback-loop-effects', 'ranking-evaluation', 'model-rollout-strategy'],
    tags: ['machine learning', 'evaluation', 'experimentation', 'metrics'],
  },

  {
    id: 'ranking-evaluation',
    name: 'Ranking Evaluation',
    aka: ['NDCG and precision at k', 'relevance judgements', 'search quality measurement'],
    origin: 'Information retrieval research',
    domains: ['data', 'engineering'],
    intents: ['estimate', 'critique'],
    oneLiner:
      'Measuring a ranked list requires deciding what counts as relevant, how much position matters, and how to handle the results nobody has judged.',
    useWhen: [
      'we changed the ranking and cannot tell whether it is better',
      'every relevance improvement is somebody\'s opinion',
      'clicks say one thing and our judges say another',
      'we do not know what metric to use for search quality',
    ],
    prompt:
      'Design evaluation for this ranking system. Choose the metric from what users do: a single-answer lookup, a browse task and a comprehensive search need different measures, so state ours and pick accordingly with position weighting justified rather than defaulted. Then address the two hard problems. First, judgements: how relevance is defined, graded rather than binary where appropriate, and how agreement between judges is checked. Second, unjudged results, since a new ranking surfaces items nobody has assessed and treating them as irrelevant systematically penalises change — specify the pooling or sampling that handles it. Finish with how implicit signals such as clicks are used given their strong position bias.',
    why:
      'Unjudged results being scored as irrelevant systematically penalises exactly the changes you want to evaluate, and it is the flaw that makes naive offline ranking evaluation misleading.',
    watchOut:
      'Click data is heavily biased by position and by what the current system shows. Using it as ground truth entrenches the existing ranking.',
    related: ['offline-online-metric-gap', 'full-text-search-design', 'feedback-loop-effects', 'labeling-quality'],
    tags: ['machine learning', 'search', 'evaluation', 'metrics'],
  },

  {
    id: 'model-rollout-strategy',
    name: 'Model Rollout Strategy',
    aka: ['shadow mode for models', 'champion challenger', 'gradual model release'],
    origin: 'Production machine learning practice',
    domains: ['engineering', 'data'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Release a model like any other change — shadow first, then a small share of traffic, with the metrics and the abort criteria decided in advance.',
    useWhen: [
      'we swapped the model and quality dropped for everyone at once',
      'we cannot tell whether the new model is better in production',
      'the new model was fine on average and terrible for one segment',
      'rolling back a model takes a redeploy and an hour',
    ],
    prompt:
      'Design the rollout for this model. Stage it: shadow mode where the candidate scores real traffic without its output being used, so we compare predictions and latency without risk; then a small share of live traffic; then progressive increase. Specify what is compared at each stage — prediction agreement with the incumbent, the business metric, latency and cost — and the segment breakdown, since an aggregate improvement can hide a serious regression for a subgroup, which is the failure that damages trust. Set the abort criteria and the rollback, which should be a configuration change rather than a deployment. Finish with the monitoring that continues after full rollout.',
    why:
      'Segment-level comparison during rollout catches the subgroup regression that aggregate metrics hide, and shadow mode gives latency and cost evidence before any user is affected.',
    watchOut:
      'Shadow mode doubles inference cost and load on any downstream feature lookups. That capacity has to be planned rather than discovered.',
    related: ['canary-release', 'shadow-traffic', 'model-monitoring', 'model-registry-versioning'],
    tags: ['machine learning', 'deployment', 'rollout', 'risk'],
  },

  {
    id: 'model-monitoring',
    name: 'Model Monitoring',
    aka: ['production model observability', 'prediction monitoring', 'silent degradation'],
    origin: 'MLOps practice',
    domains: ['engineering', 'data'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'A degrading model raises no errors and returns confident answers, so monitoring must watch inputs, outputs and outcomes rather than availability.',
    useWhen: [
      'the model has been getting worse for months and nobody noticed',
      'our dashboards are green and the predictions are poor',
      'we only find out about quality problems from customer complaints',
      'the ground truth arrives weeks later and we do not use it',
    ],
    prompt:
      'Design monitoring for this model in production. Cover three layers: inputs, watching feature distributions and missing-value rates against the training distribution; outputs, watching the prediction distribution and confidence, since a shift there is detectable immediately and needs no labels; and outcomes, comparing predictions against ground truth as it arrives, which is the real measure but is delayed. State the delay for us and what we watch in the meantime. Then break every measure down by segment, because aggregate stability hides subgroup degradation. Finish with the alert design: what pages, what opens an investigation, and the runbook for a suspected quality problem.',
    why:
      'Output distribution monitoring gives an immediate signal without waiting for labels, which is what closes the gap created by delayed ground truth.',
    watchOut:
      'Ground truth that arrives only for cases the model acted on is a biased sample, so the measured performance can look stable while overall quality falls.',
    related: ['data-drift-detection', 'training-serving-skew', 'anomaly-detection-alerting', 'feedback-loop-effects'],
    tags: ['machine learning', 'monitoring', 'production', 'quality'],
  },

  {
    id: 'data-drift-detection',
    name: 'Drift Detection',
    aka: ['covariate shift', 'concept drift', 'distribution monitoring'],
    origin: 'Machine learning research on distribution shift; production practice',
    domains: ['data', 'engineering'],
    intents: ['diagnose', 'plan'],
    oneLiner:
      'Distinguish the input distribution changing from the relationship between inputs and outcome changing, because only the second necessarily makes the model wrong.',
    useWhen: [
      'the drift alert fires constantly and we ignore it',
      'our model was trained before a market change and may be stale',
      'the inputs look different and I do not know if that matters',
      'nobody can say when we should retrain',
    ],
    prompt:
      'Design drift detection for this model. Separate the two phenomena explicitly: inputs shifting, which may be harmless if the learned relationship still holds, and the relationship itself changing, which degrades performance regardless of the inputs — and note that the second usually requires outcome data to detect. Choose the statistical test per feature type with a threshold that accounts for sample size, since with enough traffic any test will find a significant difference and that is why drift alerts get ignored. Then connect detection to action: what triggers investigation, what triggers retraining, and what triggers a rollback, since detection without a defined response accomplishes nothing.',
    why:
      'Separating covariate shift from concept drift determines whether an alert matters, and thresholds accounting for sample size are what stop high-traffic systems from alerting constantly.',
    watchOut:
      'Automated retraining triggered by drift can chase a temporary anomaly into the model. Retraining needs the same rollout discipline as any other change.',
    related: ['model-monitoring', 'training-serving-skew', 'anomaly-detection-alerting', 'feedback-loop-effects'],
    tags: ['machine learning', 'monitoring', 'drift', 'retraining'],
  },

  {
    id: 'feedback-loop-effects',
    name: 'Feedback Loops in Models',
    aka: ['self-fulfilling predictions', 'runaway feedback', 'model influences its own data'],
    origin: 'Sculley and colleagues, Hidden Technical Debt in Machine Learning Systems, 2015',
    domains: ['data', 'engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'When a model\'s outputs shape the data it later trains on, small biases amplify and the system converges on its own assumptions rather than on reality.',
    useWhen: [
      'our recommendations have narrowed to the same few items',
      'the fraud model flags a group more, so we investigate them more, so we find more',
      'we only have outcome data for the cases the model approved',
      'two models in our system seem to be influencing each other',
    ],
    prompt:
      'Trace the feedback paths around this model. Identify where its outputs affect what data is subsequently collected — what is shown, what is approved, what gets investigated — and describe the amplification each creates over repeated cycles. Then look for the hidden path where another model consumes this one\'s output, creating coupling nobody owns. For each loop, propose the intervention: a proportion of randomised or exploratory decisions to keep unbiased data flowing, counterfactual logging of what would have happened, and evaluation against a held-out population unaffected by the model. Finish with the monitoring that would detect narrowing or amplification before it becomes visible externally.',
    why:
      'Deliberate exploration to keep unbiased data flowing is the structural remedy, and it has to be designed in because every incentive at serving time argues against it.',
    watchOut:
      'These loops can encode and amplify a bias affecting a specific group, turning a small initial disparity into a large one over months.',
    related: ['fairness-auditing', 'offline-online-metric-gap', 'model-monitoring', 'goodharts-law'],
    tags: ['machine learning', 'feedback loops', 'bias', 'systems'],
  },

  {
    id: 'fairness-auditing',
    name: 'Fairness Auditing',
    aka: ['disparate impact analysis', 'subgroup performance', 'bias evaluation'],
    origin: 'Algorithmic fairness research; Barocas, Hardt and Narayanan',
    domains: ['data', 'engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Measure performance and error types separately for each affected group, knowing that the several definitions of fairness are mathematically incompatible and one must be chosen deliberately.',
    useWhen: [
      'the model works well overall and badly for one group',
      'we removed the sensitive attribute and assumed that made it fair',
      'someone asked whether our model is biased and I do not know how to answer',
      'a regulator is asking about disparate impact',
    ],
    prompt:
      'Design a fairness assessment for this system. Start by naming the affected groups and the harm being tested for, since fairness is meaningless without specifying with respect to what. Then measure per group, separating error types, because equal overall accuracy can hide very different false positive and false negative rates, and those have different consequences for the people affected. Explain that the common definitions cannot all hold at once and recommend which matters here based on the harm. Then address the correlated-features point, since removing a sensitive attribute does not remove the information when other features proxy for it. Finish with the mitigations and their costs.',
    why:
      'The incompatibility of fairness definitions means one must be chosen from the harm, and the proxy-features point corrects the widespread belief that dropping an attribute is sufficient.',
    watchOut:
      'A model can meet every statistical fairness criterion and still be deployed in a way that causes harm. The measurement is about the model, not the system around it.',
    related: ['feedback-loop-effects', 'labeling-quality', 'human-in-the-loop-review', 'model-monitoring'],
    tags: ['machine learning', 'fairness', 'evaluation', 'ethics'],
  },

  {
    id: 'human-in-the-loop-review',
    name: 'Human in the Loop',
    aka: ['review queues', 'confidence thresholds', 'automation with escalation'],
    origin: 'Applied machine learning and decision system practice',
    domains: ['engineering', 'design'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Automate the confident cases and route the rest to people, which requires a threshold justified by the cost of each error type and a review process that stays sustainable.',
    useWhen: [
      'the model is right most of the time and the mistakes are expensive',
      'our review queue has grown beyond what the team can handle',
      'reviewers approve everything because the volume is too high',
      'we cannot decide where to set the automation threshold',
    ],
    prompt:
      'Design the division of labour between the model and human reviewers. Set the threshold from the asymmetric cost of the two error types rather than from a round confidence number, and show the resulting volume at each candidate threshold against our review capacity — that comparison is the real constraint. Then design the review experience so it produces good decisions: the information a reviewer needs, the model\'s reasoning where available, and the time realistically available per item. Then address rubber-stamping, which is the standard failure at high volume, with measurement of override rates. Finish with the loop back: reviewer decisions as labels, and the sampling of automated decisions to check the threshold is still right.',
    why:
      'Comparing volume at each threshold against actual review capacity is what makes the threshold decision real, and override-rate measurement is what detects rubber-stamping before it becomes invisible automation.',
    watchOut:
      'A reviewer shown the model\'s answer first tends to agree with it, so the human check provides less independent verification than it appears to.',
    related: ['fairness-auditing', 'labeling-quality', 'model-monitoring', 'defect-triage-matrix'],
    tags: ['machine learning', 'automation', 'process', 'decisions'],
  },

  {
    id: 'inference-cost-optimization',
    name: 'Inference Cost and Latency',
    aka: ['serving efficiency', 'batching and quantisation', 'model serving budget'],
    origin: 'Production machine learning engineering practice',
    domains: ['engineering'],
    intents: ['diagnose', 'decide'],
    oneLiner:
      'Serving cost and latency are usually dominated by a few choices — model size, batching, precision, and caching — and each trades quality for money in a measurable way.',
    useWhen: [
      'our inference bill is larger than the rest of our infrastructure',
      'the model adds three hundred milliseconds to every request',
      'we cannot afford to run this model at full traffic',
      'someone suggested a smaller model and we do not know what we would lose',
    ],
    prompt:
      'Reduce serving cost and latency for this model. Break the current cost per request into its parts — feature retrieval, preprocessing, model execution, and network — since teams often optimise the model when feature lookup dominates. Then evaluate the levers with the quality cost of each measured rather than assumed: a smaller or distilled model, reduced numeric precision, batching requests with its latency implication, caching results for repeated inputs, and hardware choice. Present each as a quality-versus-cost point so the trade is explicit. Finish with the cheapest lever of all, which is not calling the model when a rule or a cached answer suffices.',
    why:
      'Attributing cost across feature retrieval and preprocessing rather than assuming the model dominates is what directs effort correctly, and presenting quality-versus-cost points makes the trade a decision rather than a guess.',
    watchOut:
      'Batching improves throughput and adds waiting time to every request. On an interactive path that can cost more in experience than it saves in money.',
    related: ['batching-amortization', 'percentile-latency', 'cloud-cost-attribution', 'model-rollout-strategy'],
    tags: ['machine learning', 'cost', 'latency', 'serving'],
  },

  {
    id: 'llm-evaluation-harness',
    name: 'LLM Evaluation Harness',
    aka: ['prompt regression testing', 'eval sets for language models', 'model-graded evaluation'],
    origin: 'Applied language model practice',
    domains: ['engineering', 'data'],
    intents: ['critique', 'structure'],
    oneLiner:
      'Language model behaviour changes with every prompt edit and model version, so you need a graded evaluation set that runs like a test suite.',
    useWhen: [
      'we changed the prompt to fix one case and broke three others',
      'we upgraded the model version and cannot tell what changed',
      'quality assessment is one person trying a few examples',
      'the output looks fine and we have no way to compare two versions',
    ],
    prompt:
      'Build an evaluation harness for this language model feature. Assemble a dataset covering the real distribution plus the failure cases we have seen, since regression cover for known failures is the highest-value part. Then define grading per case type: exact or structural checks where the output is constrained, and a rubric with a model as judge where it is open-ended — for the latter, validate the judge against human ratings on a sample, because an unvalidated judge is an opinion generator. Account for nondeterminism by running multiple samples and reporting distributions. Finish with the workflow: run on every prompt or model change, compare against the current baseline, and report which cases moved in each direction.',
    why:
      'Validating a model-as-judge against human ratings is the step that makes automated grading trustworthy, and per-case movement reporting is what turns an aggregate score into an actionable diff.',
    watchOut:
      'An evaluation set that never changes gets optimised against, and the feature improves on the set while getting no better in reality. Refresh it from production failures.',
    related: ['llm-guardrails', 'retrieval-grounding', 'rubric-grading', 'regression-benchmarking'],
    tags: ['machine learning', 'llm', 'evaluation', 'testing'],
  },

  {
    id: 'retrieval-grounding',
    name: 'Retrieval Grounding',
    aka: ['RAG', 'retrieval-augmented generation', 'citation and provenance'],
    origin: 'Lewis and colleagues, retrieval-augmented generation, 2020',
    domains: ['engineering', 'data'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Supply relevant source material with the question and require answers to be traceable to it, so quality becomes a retrieval problem you can measure.',
    useWhen: [
      'the assistant confidently states things that are not in our documentation',
      'answers are correct in general and wrong about our specifics',
      'we cannot tell where an answer came from',
      'we built retrieval augmentation and the answers did not improve',
    ],
    prompt:
      'Design grounded answering for this system, treating retrieval quality as the primary variable since generation cannot recover from material that does not contain the answer. Specify chunking and how it preserves the context a passage needs to be interpretable alone, the retrieval method including where keyword matching beats semantic similarity for identifiers and exact terms, and reranking. Then measure retrieval separately from generation, since a combined score cannot tell you which is failing — define the retrieval metric against a judged set. Then require citation to specific passages, and specify the behaviour when nothing relevant is retrieved, which must be declining to answer rather than answering anyway.',
    why:
      'Measuring retrieval separately from generation is what makes the system debuggable, and defining the nothing-relevant behaviour is what prevents confident answers with no basis.',
    watchOut:
      'Semantic similarity retrieves passages that are topically related and factually irrelevant. Exact identifiers, codes and names usually need lexical matching alongside.',
    related: ['llm-guardrails', 'full-text-search-design', 'llm-evaluation-harness', 'ranking-evaluation'],
    tags: ['machine learning', 'llm', 'retrieval', 'grounding'],
  },

  {
    id: 'llm-guardrails',
    name: 'Language Model Guardrails',
    aka: ['output validation for LLMs', 'prompt injection defence', 'constrained generation'],
    origin: 'Applied language model security and reliability practice',
    domains: ['engineering', 'security'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Treat model output as untrusted input and model input as attacker-influenced, because instructions embedded in retrieved content will be followed unless the architecture prevents it.',
    useWhen: [
      'a user got the assistant to ignore its instructions',
      'the model returned malformed output and our parser crashed',
      'content we retrieved contained instructions and the model obeyed them',
      'we are giving the model access to tools and I am nervous',
    ],
    prompt:
      'Design controls around this language model feature. Treat output as untrusted: validate structure against a schema with a retry or fallback path, and never pass generated text into a query, a shell, a template or a browser context without the same escaping any untrusted input would get. Then treat input as attacker-influenced, since retrieved documents and user content can carry instructions — explain that prompt wording alone is not a boundary, and that the real control is limiting what the system can do, so specify the permissions available during a request and require confirmation for anything consequential. Finish with the logging needed to investigate a suspected manipulation.',
    why:
      'Treating generated output as untrusted input closes the injection paths that prompt instructions cannot, and constraining available permissions is the only durable defence against instructions in retrieved content.',
    watchOut:
      'Guardrails implemented as instructions in the prompt can be talked around. Anything that must not happen has to be prevented outside the model.',
    related: ['retrieval-grounding', 'input-validation-boundary', 'least-privilege', 'llm-evaluation-harness'],
    tags: ['machine learning', 'llm', 'security', 'reliability'],
  },
]
