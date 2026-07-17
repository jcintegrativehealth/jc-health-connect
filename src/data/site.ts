// Central mock data for JC Integrative Health
// All content is demonstration only and free of invented credentials.

export type Service = {
  slug: string;
  name: string;
  short: string;
  summary: string;
  overview: string;
  helps: string[];
  concerns: string[];
  approach: string[];
  expect: string[];
  faqs: { q: string; a: string }[];
  related: string[]; // research slugs
};

export const services: Service[] = [
  {
    slug: "integrative-medicine",
    name: "Integrative Medicine",
    short: "Whole-person care",
    summary: "Comprehensive care combining evidence-based medicine with lifestyle, nutrition, and prevention.",
    overview:
      "Integrative medicine considers the full context of a person's health — biology, environment, and behavior — while remaining grounded in clinical evidence. Our practice integrates conventional diagnostics with nutrition, sleep, movement, and stress physiology to build a coherent care plan.",
    helps: [
      "Individuals seeking a broader medical evaluation",
      "Patients navigating multiple concurrent conditions",
      "Those focused on prevention and long-term health",
    ],
    concerns: ["Fatigue", "Weight and metabolic changes", "Sleep disruption", "Inflammatory patterns", "Recovery and resilience"],
    approach: [
      "Comprehensive intake and review of medical history",
      "Targeted laboratory and functional assessments",
      "Lifestyle and nutritional evaluation",
      "Personalized care plan with clear milestones",
    ],
    expect: [
      "60–90 minute initial consultation",
      "Written care plan with clinical rationale",
      "Coordinated follow-up and lab review",
      "Optional integration with wearables and remote monitoring",
    ],
    faqs: [
      { q: "Is this a replacement for my primary care?", a: "Integrative medicine complements, and does not replace, primary care." },
      { q: "Do you prescribe medications?", a: "When clinically appropriate and consistent with state licensure." },
    ],
    related: ["mtor-review", "inflammation-longevity", "cgm-non-diabetic"],
  },
  { slug: "longevity-medicine", name: "Longevity Medicine", short: "Healthspan-focused", summary: "Protocols and monitoring designed to support healthspan and long-term biological resilience.", overview: "Longevity medicine focuses on extending years of healthy function. Our approach draws on cardiometabolic, inflammatory, and functional markers to prioritize interventions with reasonable evidence.", helps: ["Adults focused on healthy aging", "Individuals with a family history of cardiometabolic disease"], concerns: ["Healthy aging", "Cardiovascular risk", "Metabolic decline", "Cognitive resilience"], approach: ["Biomarker panel and functional testing", "Nutrition and movement prescription", "Sleep and recovery evaluation", "Careful review of medications and supplements"], expect: ["Longitudinal biomarker tracking", "Structured, prioritized care plan", "Coordinated specialist referrals when useful"], faqs: [{ q: "Do you prescribe experimental therapies?", a: "We prioritize interventions supported by clinical evidence and appropriate regulatory oversight." }], related: ["mtor-review", "epigenetic-clocks"] },
  { slug: "preventive-medicine", name: "Preventive Medicine", short: "Early detection", summary: "Screening and risk reduction across cardiovascular, metabolic, and other domains.", overview: "Preventive medicine emphasizes early detection and modification of risk factors before disease develops or advances.", helps: ["Adults establishing a baseline", "Individuals with known risk factors"], concerns: ["Cardiovascular risk", "Metabolic syndrome", "Cancer screening awareness"], approach: ["Guideline-based screening review", "Personalized risk stratification", "Behavioral and pharmacological options"], expect: ["Structured screening plan", "Clear rationale for each recommendation"], faqs: [], related: [] },
  { slug: "functional-health-assessment", name: "Functional Health Assessment", short: "Systems evaluation", summary: "In-depth assessment of the systems most relevant to a person's presenting concerns.", overview: "A structured evaluation across metabolic, hormonal, gastrointestinal, and inflammatory systems.", helps: ["Complex or overlapping symptoms", "Those seeking a systems view"], concerns: ["Fatigue", "Digestive symptoms", "Hormonal changes"], approach: ["Comprehensive intake", "Targeted labs", "Care plan synthesis"], expect: ["Clear written summary and next steps"], faqs: [], related: [] },
  { slug: "metabolic-health", name: "Metabolic Health", short: "Insulin, lipids, energy", summary: "Evaluation and management of insulin sensitivity, lipids, and metabolic function.", overview: "Metabolic health underlies energy, cardiovascular risk, and long-term function. We use standard and functional markers to characterize and respond.", helps: ["Insulin resistance", "Lipid abnormalities", "Metabolic syndrome"], concerns: ["Weight changes", "Energy", "Post-meal fatigue"], approach: ["Metabolic panel and lipid subfractions", "Nutrition and movement plan", "Pharmacotherapy when appropriate"], expect: ["Structured protocol with checkpoints"], faqs: [], related: ["cgm-non-diabetic"] },
  { slug: "weight-management", name: "Weight Management", short: "Sustainable change", summary: "Medically-guided weight management with attention to metabolism, behavior, and long-term outcomes.", overview: "Weight management integrates nutrition, physical activity, sleep, and, when appropriate, pharmacotherapy — all within a longer view of metabolic health.", helps: ["Adults seeking sustainable change"], concerns: ["Metabolic health", "Body composition"], approach: ["Baseline assessment", "Structured plan", "Ongoing follow-up"], expect: ["Regular check-ins with clinical adjustments"], faqs: [], related: [] },
  { slug: "hormone-health", name: "Hormone Health", short: "Endocrine balance", summary: "Evidence-based evaluation of thyroid, adrenal, and sex hormone function.", overview: "Careful hormonal evaluation informed by symptoms, function, and laboratory context.", helps: ["Perimenopause and menopause", "Andropause", "Thyroid concerns"], concerns: ["Energy", "Mood", "Sleep", "Metabolism"], approach: ["Structured hormonal panel", "Symptom-guided evaluation"], expect: ["Clear treatment options with rationale"], faqs: [], related: [] },
  { slug: "mens-health", name: "Men's Health", short: "Preventive & metabolic", summary: "Preventive and metabolic care tailored to men across the lifespan.", overview: "Emphasizing cardiovascular risk, hormonal balance, and long-term function.", helps: ["Adult men across ages"], concerns: ["Cardiovascular risk", "Testosterone concerns"], approach: ["Screening and biomarker review"], expect: ["Personalized recommendations"], faqs: [], related: [] },
  { slug: "womens-health", name: "Women's Health", short: "Lifespan-oriented", summary: "Preventive, metabolic, and hormonal care through every life stage.", overview: "Care that accounts for the specific patterns of women's health, from perimenopause to bone health.", helps: ["Adult women across ages"], concerns: ["Hormonal transitions", "Bone health"], approach: ["Longitudinal biomarker tracking"], expect: ["Coordinated care with specialists as needed"], faqs: [], related: [] },
  { slug: "sleep-and-recovery", name: "Sleep and Recovery", short: "Restoration", summary: "Diagnostic and clinical support for restorative sleep and recovery.", overview: "Sleep is foundational to metabolic, cognitive, and immune function. We evaluate sleep quality and its systemic implications.", helps: ["Insomnia", "Fragmented sleep", "Recovery concerns"], concerns: ["Fatigue", "Cognitive fog"], approach: ["Sleep evaluation", "Behavioral and medical options"], expect: ["Structured, measurable plan"], faqs: [], related: [] },
  { slug: "nutrition-and-lifestyle", name: "Nutrition and Lifestyle", short: "Applied nutrition", summary: "Nutrition and lifestyle guidance grounded in clinical evidence and each patient's context.", overview: "Nutrition, movement, sleep, and stress are interdependent. Our recommendations are practical and revisited over time.", helps: ["Adults across ages"], concerns: ["Metabolic and cardiovascular"], approach: ["Individualized nutritional plan"], expect: ["Regular re-evaluation and adjustment"], faqs: [], related: [] },
  { slug: "cardiometabolic-health", name: "Cardiometabolic Health", short: "Heart & metabolism", summary: "Integrated evaluation of cardiovascular and metabolic risk.", overview: "A unified view of cardiovascular and metabolic risk with practical strategies for reduction.", helps: ["Elevated risk profiles"], concerns: ["Lipids", "Blood pressure", "Insulin resistance"], approach: ["Guideline-based screening", "Personalized risk model"], expect: ["Structured intervention plan"], faqs: [], related: [] },
  { slug: "healthy-aging", name: "Healthy Aging", short: "Function across time", summary: "Care oriented toward maintaining function, cognition, and vitality over decades.", overview: "Healthy aging spans metabolism, musculoskeletal, cognitive, and emotional health.", helps: ["Adults across life stages"], concerns: ["Function", "Cognition", "Resilience"], approach: ["Longitudinal biomarker monitoring"], expect: ["Progressive, evidence-guided plan"], faqs: [], related: [] },
  { slug: "stress-and-resilience", name: "Stress and Resilience", short: "Nervous system", summary: "Clinical support for stress physiology, autonomic balance, and resilience-building.", overview: "Chronic stress affects nearly every system. We use validated tools alongside clinical assessment.", helps: ["Adults facing sustained stress"], concerns: ["Sleep", "Digestion", "Cardiovascular strain"], approach: ["Assessment and clinical strategies"], expect: ["Practical, measurable plan"], faqs: [], related: [] },
  { slug: "health-optimization", name: "Health Optimization", short: "Fine-tuning function", summary: "For those with stable baselines seeking careful, evidence-informed refinement.", overview: "Optimization emphasizes careful measurement and reasonable, evidence-informed interventions.", helps: ["Adults with stable baselines"], concerns: ["Performance", "Recovery"], approach: ["Comprehensive baseline", "Iterative adjustments"], expect: ["Data-informed protocol"], faqs: [], related: [] },
  { slug: "medical-technology-consultation", name: "Medical Technology Consultation", short: "Wearables & devices", summary: "Guidance on clinically relevant devices, wearables, and digital health tools.", overview: "We evaluate the practical utility, evidence, and limitations of medical technology for a given person's care plan.", helps: ["Patients exploring wearables and monitoring tools"], concerns: ["Practical integration", "Signal quality"], approach: ["Needs and evidence review", "Integration planning"], expect: ["Clear, unbiased guidance"], faqs: [], related: ["cgm-non-diabetic", "llm-diagnostics"] },
  { slug: "executive-health", name: "Executive Health", short: "Time-efficient", summary: "Comprehensive preventive medicine designed for time-constrained schedules.", overview: "A structured, time-efficient program for those balancing demanding roles with long-term health.", helps: ["Executives and professionals"], concerns: ["Preventive screening", "Cardiometabolic risk"], approach: ["Comprehensive intake in a single day when possible"], expect: ["Written report and follow-up"], faqs: [], related: [] },
  { slug: "personalized-health-planning", name: "Personalized Health Planning", short: "Integrated plan", summary: "Long-term health plans synthesizing prevention, longevity, and integrative care.", overview: "Personalized planning coordinates the many parts of a person's care into one clear, revisitable plan.", helps: ["Adults seeking a clear, integrated plan"], concerns: ["Coordination across domains"], approach: ["Baseline synthesis", "Milestones and reviews"], expect: ["Living document that evolves with you"], faqs: [], related: [] },
];

export type Condition = { slug: string; name: string; summary: string; body: string };
export const conditions: Condition[] = [
  { slug: "fatigue", name: "Fatigue", summary: "Persistent low energy with medical, metabolic, and lifestyle drivers.", body: "Fatigue often has multiple overlapping contributors — sleep quality, thyroid or adrenal function, iron and B12 status, blood sugar patterns, inflammation, and mental health. Our evaluation examines these systematically." },
  { slug: "weight-concerns", name: "Weight Concerns", summary: "Understanding weight as a signal of metabolic health.", body: "Weight is one signal among many. We evaluate metabolism, sleep, stress, and nutrition to design sustainable strategies." },
  { slug: "metabolic-syndrome", name: "Metabolic Syndrome", summary: "A cluster of cardiometabolic risk factors.", body: "Insulin resistance, central adiposity, elevated blood pressure, and lipid changes travel together. Coordinated care can meaningfully reduce risk." },
  { slug: "insulin-resistance", name: "Insulin Resistance", summary: "Reduced sensitivity to insulin across tissues.", body: "Insulin resistance often precedes clinical diabetes by years. Early recognition creates a wider window for intervention." },
  { slug: "sleep-problems", name: "Sleep Problems", summary: "Difficulty falling asleep, staying asleep, or feeling rested.", body: "Sleep quality shapes nearly every system. We evaluate architecture, timing, and physiology." },
  { slug: "stress", name: "Stress", summary: "Chronic stress and autonomic imbalance.", body: "Sustained stress affects cardiovascular, digestive, and metabolic function. Effective care combines physiology with practical behavior." },
  { slug: "inflammation", name: "Inflammation", summary: "Low-grade systemic inflammation.", body: "Chronic inflammation is a shared feature of many long-term conditions. We measure and address contributors." },
  { slug: "hormonal-concerns", name: "Hormonal Concerns", summary: "Endocrine changes across the lifespan.", body: "Hormonal shifts affect energy, sleep, cognition, and metabolism. Careful evaluation clarifies options." },
  { slug: "digestive-health", name: "Digestive Health", summary: "GI symptoms and their systemic implications.", body: "The digestive system interacts with immune, hormonal, and metabolic function. Assessment is systematic." },
  { slug: "healthy-aging", name: "Healthy Aging", summary: "Maintaining function and vitality over time.", body: "Healthy aging is the sum of many small decisions — sleep, movement, nutrition, and preventive care." },
  { slug: "cardiovascular-risk", name: "Cardiovascular Risk", summary: "Assessing and modifying risk over years and decades.", body: "Cardiovascular risk is dynamic. Modern assessment integrates lipids, imaging, and functional markers." },
  { slug: "brain-health", name: "Brain Health", summary: "Cognitive function, mood, and long-term resilience.", body: "Brain health is influenced by sleep, metabolism, inflammation, and vascular factors." },
  { slug: "low-energy", name: "Low Energy", summary: "Persistent sense of reduced vitality.", body: "Energy involves mitochondrial function, sleep, and metabolic balance." },
  { slug: "lifestyle-optimization", name: "Lifestyle Optimization", summary: "Refining daily patterns for durable health.", body: "Small, consistent shifts in nutrition, movement, sleep, and stress management often outperform aggressive short-term change." },
  { slug: "preventive-health-planning", name: "Preventive Health Planning", summary: "Building a proactive, personalized plan.", body: "Preventive planning coordinates screenings, monitoring, and lifestyle strategies into a single coherent plan." },
];

export type Article = {
  slug: string;
  category: string;
  title: string;
  author: string;
  date: string;
  readMinutes: number;
  summary: string;
  body: string[];
  reactions: { helpful: number; insightful: number; wellReferenced: number };
  comments: number;
  tags: string[];
  type: "Research Review" | "Clinical Commentary" | "Evidence Summary" | "New Study" | "Medication Update" | "Technology Review" | "Expert Perspective";
  evidence: "Systematic Review" | "RCT" | "Cohort" | "Observational" | "Expert Opinion";
};

export const articles: Article[] = [
  { slug: "llm-diagnostics", category: "Medical Technology", title: "The Integration of Large Language Models in Diagnostic Pattern Recognition", author: "Dr. Jason Chen", date: "2026-06-12", readMinutes: 9, summary: "Evaluating the role of language models as adjunctive tools in primary care and metabolic screening.", body: ["Large language models increasingly appear in workflows that were historically the domain of narrow clinical decision-support systems. Their strength is not in producing diagnoses but in surfacing patterns across dispersed data.", "In our practice, we have found the most utility in structured intake summarization, differential broadening, and preparation for consultations — never as a substitute for clinical judgment.", "The limitations are well-known: hallucination, sensitivity to prompt wording, and inconsistent citation of sources. Clinical use therefore requires explicit boundaries and validation.", "This review outlines a pragmatic framework: identify tasks where the tool's failure modes are acceptable, define the human-in-the-loop clearly, and monitor outputs against a reference."], reactions: { helpful: 24, insightful: 12, wellReferenced: 7 }, comments: 6, tags: ["AI", "Diagnostics", "Primary Care"], type: "Research Review", evidence: "Systematic Review" },
  { slug: "mtor-review", category: "Longevity", title: "mTOR Inhibitors and Healthspan: A Careful Reading of the Evidence", author: "Dr. Jason Chen", date: "2026-05-28", readMinutes: 14, summary: "A structured review of pharmacological interventions targeting mTOR pathways in the context of healthy aging.", body: ["Interest in mTOR-modulating interventions has grown rapidly. The clinical picture, however, remains more nuanced than public discussion suggests.", "This review focuses on evidence relevant to healthy adults, not disease indications where the risk-benefit profile differs substantially.", "We examine study design, endpoints, adverse-event patterns, and unresolved questions.", "Recommendations for clinical practice are conservative and specify the conditions under which further research would change our view."], reactions: { helpful: 41, insightful: 22, wellReferenced: 16 }, comments: 11, tags: ["Longevity", "Pharmacology"], type: "Research Review", evidence: "RCT" },
  { slug: "inflammation-longevity", category: "Integrative Medicine", title: "Evidence-Based Approaches to Chronic Inflammation and Healthspan", author: "Dr. Jason Chen", date: "2026-05-10", readMinutes: 11, summary: "Which markers to trust, which interventions have signal, and what remains uncertain.", body: ["Chronic low-grade inflammation is implicated in many long-term conditions. Measurement, however, is imprecise, and the clinical response depends on context.", "This piece organizes the practical questions clinicians face into a decision-oriented framework."], reactions: { helpful: 33, insightful: 18, wellReferenced: 9 }, comments: 8, tags: ["Inflammation", "Longevity"], type: "Clinical Commentary", evidence: "Cohort" },
  { slug: "cgm-non-diabetic", category: "Medical Technology", title: "Continuous Glucose Monitoring in Non-Diabetic Adults: What the Data Show", author: "Dr. Jason Chen", date: "2026-04-22", readMinutes: 8, summary: "A measured look at continuous glucose monitoring outside its established indications.", body: ["Continuous glucose monitoring generates a strikingly detailed picture of metabolic variability. The question is what to do with that picture."], reactions: { helpful: 27, insightful: 15, wellReferenced: 6 }, comments: 5, tags: ["Wearables", "Metabolic"], type: "Technology Review", evidence: "Observational" },
  { slug: "epigenetic-clocks", category: "Longevity", title: "Reading Epigenetic Age Clocks with Appropriate Skepticism", author: "Dr. Jason Chen", date: "2026-04-05", readMinutes: 12, summary: "Biological age testing is popular; interpretation lags behind adoption.", body: ["Epigenetic clocks have moved from research settings into consumer products. Their interpretation, however, remains an unsettled science."], reactions: { helpful: 19, insightful: 14, wellReferenced: 5 }, comments: 4, tags: ["Longevity", "Biomarkers"], type: "Evidence Summary", evidence: "Systematic Review" },
  { slug: "new-glp1", category: "New Medications", title: "The Expanding Class of GLP-1 Receptor Agonists: A Clinical Reading", author: "Dr. Jason Chen", date: "2026-03-18", readMinutes: 10, summary: "Newer molecules, broader indications, and open questions in long-term use.", body: ["The GLP-1 receptor agonist class continues to expand. Clinical decision-making has to keep pace with both new evidence and new molecules."], reactions: { helpful: 46, insightful: 21, wellReferenced: 13 }, comments: 14, tags: ["Metabolic", "Pharmacology"], type: "Medication Update", evidence: "RCT" },
];

export type Physician = {
  slug: string;
  name: string;
  specialty: string;
  institution: string;
  location: string;
  bio: string;
  interests: string[];
  articles: string[]; // article slugs
};

export const physicians: Physician[] = [
  { slug: "amelia-park", name: "Dr. Amelia Park", specialty: "Endocrinology", institution: "University Hospital (placeholder)", location: "Boston, MA", bio: "Interested in metabolic health, thyroid physiology, and long-term care design.", interests: ["Metabolic Health", "Thyroid", "Preventive Medicine"], articles: ["new-glp1"] },
  { slug: "rafael-mendez", name: "Dr. Rafael Mendez", specialty: "Cardiology", institution: "Cardiovascular Institute (placeholder)", location: "Denver, CO", bio: "Preventive cardiology with a focus on early risk assessment and long-term outcomes.", interests: ["Preventive Cardiology", "Lipidology"], articles: ["mtor-review"] },
  { slug: "hiroko-tanaka", name: "Dr. Hiroko Tanaka", specialty: "Sleep Medicine", institution: "Academic Sleep Center (placeholder)", location: "Seattle, WA", bio: "Sleep architecture, circadian medicine, and the intersection of sleep and metabolic health.", interests: ["Sleep", "Circadian Medicine"], articles: [] },
  { slug: "olivia-brant", name: "Dr. Olivia Brant", specialty: "Integrative Medicine", institution: "Integrative Health Institute (placeholder)", location: "Portland, OR", bio: "Integrative medicine with a background in evidence synthesis.", interests: ["Integrative Medicine", "Evidence Synthesis"], articles: [] },
];

export type Innovation = {
  slug: string;
  name: string;
  category: string;
  status: "Available Now" | "Emerging" | "In Clinical Trials" | "Experimental";
  evidence: "Level 1" | "Level 2" | "Level 3" | "Level 4";
  summary: string;
  potential: string;
  limitations: string;
};

export const innovations: Innovation[] = [
  { slug: "hs-crp-monitoring", name: "High-Sensitivity CRP Monitoring", category: "Diagnostics", status: "Available Now", evidence: "Level 1", summary: "Well-validated inflammation marker used across preventive cardiology and longevity contexts.", potential: "Risk stratification and monitoring response to intervention.", limitations: "Nonspecific; must be interpreted in clinical context." },
  { slug: "cgm-non-diabetic", name: "Continuous Glucose Monitoring", category: "Wearables", status: "Available Now", evidence: "Level 2", summary: "High-resolution glycemic monitoring across daily life.", potential: "Individualized metabolic insights and behavior change.", limitations: "Interpretation outside diabetes remains active research." },
  { slug: "biological-age-panels", name: "Advanced Biological Age Panels", category: "Diagnostics", status: "Emerging", evidence: "Level 3", summary: "Multi-modal panels attempting to capture biological aging beyond chronological age.", potential: "Long-term monitoring of intervention effects.", limitations: "Standardization and clinical actionability remain limited." },
  { slug: "ai-retinal-imaging", name: "AI-Assisted Retinal Imaging", category: "AI in Medicine", status: "Emerging", evidence: "Level 3", summary: "Retinal microvasculature as a window into systemic vascular aging.", potential: "Noninvasive systemic vascular assessment.", limitations: "Regulatory and interpretive frameworks still developing." },
  { slug: "senolytics-phase2", name: "Senolytic Interventions", category: "Pharmacology", status: "In Clinical Trials", evidence: "Level 3", summary: "Targeted clearance of senescent cells; multiple candidates in trials.", potential: "Potential impact on age-related dysfunction.", limitations: "Clinical outcomes in humans remain early." },
  { slug: "ketone-monitoring-next", name: "Next-Generation Continuous Ketone Monitoring", category: "Wearables", status: "In Clinical Trials", evidence: "Level 3", summary: "Real-time ketone monitoring extending metabolic visibility.", potential: "Precision metabolic care and research.", limitations: "Availability and validation are still limited." },
  { slug: "epigenetic-reprogramming", name: "Partial Epigenetic Reprogramming", category: "Research Pipeline", status: "Experimental", evidence: "Level 4", summary: "Preclinical work exploring cellular rejuvenation without loss of identity.", potential: "Long-term potential if safety translates to humans.", limitations: "Not a clinical option; ongoing preclinical research." },
];

export type Medication = { slug: string; name: string; classLabel: string; status: string; use: string; note: string };
export const medications: Medication[] = [
  { slug: "tirzepatide-update", name: "Tirzepatide — Extended Indications", classLabel: "GLP-1 / GIP RA", status: "FDA Approved", use: "Type 2 diabetes; chronic weight management", note: "Long-term data continue to accumulate; individualized decisions are essential." },
  { slug: "semaglutide-cv", name: "Semaglutide — Cardiovascular Outcomes", classLabel: "GLP-1 RA", status: "Published Trials", use: "Type 2 diabetes, weight management, cardiovascular risk reduction", note: "Cardiovascular outcome data broaden clinical use in selected populations." },
  { slug: "bempedoic-acid", name: "Bempedoic Acid", classLabel: "ATP-citrate lyase inhibitor", status: "FDA Approved", use: "LDL-C lowering in adults with statin intolerance or insufficient response", note: "Complementary role in a lipid-lowering strategy." },
  { slug: "lp-a-therapies", name: "Lipoprotein(a)-Targeted Therapies", classLabel: "Investigational", status: "Phase 3", use: "Elevated Lp(a) as a residual cardiovascular risk factor", note: "Awaiting outcome data; not currently available for routine use." },
];

export const states = [
  { slug: "colorado", name: "Colorado", short: "CO" },
  { slug: "washington", name: "Washington", short: "WA" },
];

export const visitTypes = [
  { slug: "initial", name: "Initial Consultation", duration: "60–90 minutes" },
  { slug: "followup", name: "Follow-Up Visit", duration: "30–45 minutes" },
  { slug: "telehealth", name: "Telehealth Consultation", duration: "45–60 minutes" },
  { slug: "longevity", name: "Longevity Consultation", duration: "60 minutes" },
  { slug: "preventive", name: "Preventive Health Consultation", duration: "60 minutes" },
  { slug: "tech", name: "Medical Technology Consultation", duration: "45 minutes" },
];

export const insightsCategories = [
  "Integrative Medicine",
  "Longevity",
  "Medical Innovation",
  "New Medications",
  "FDA Updates",
  "AI in Healthcare",
  "Wearables",
  "Digital Health",
  "Nutrition",
  "Sleep",
  "Metabolic Health",
  "Preventive Health",
  "Research Explained",
];
