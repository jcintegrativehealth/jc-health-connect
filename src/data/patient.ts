// Mock demonstration data for the Patient Portal.
// No real medical, personal, or billing data is processed.

export const patient = {
  firstName: "Emily",
  lastName: "Carter",
  fullName: "Emily Carter",
  preferredName: "Emily",
  dob: "1986-04-12",
  gender: "Female",
  address: "1420 Pearl Street, Boulder, CO 80302",
  state: "Colorado",
  phone: "+1 (720) 555-0142",
  email: "emily.carter@example.com",
  language: "English",
  emergencyContact: {
    name: "Michael Carter",
    relationship: "Spouse",
    phone: "+1 (720) 555-0188",
    email: "michael.carter@example.com",
  },
  physician: "Dr. Jason Chen",
};

export type ApptStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";

export const appointments = [
  {
    id: "apt-2026-0917",
    date: "2026-07-24",
    time: "10:30 AM",
    tz: "MST",
    physician: "Dr. Jason Chen",
    type: "Follow-up Visit",
    service: "Integrative Medicine",
    format: "Telehealth",
    language: "English",
    duration: "30 min",
    status: "Confirmed" as ApptStatus,
    payment: "Paid",
    forms: "Pending",
    preparation: [
      "Complete the Sleep and Recovery intake",
      "Have your medication list available",
      "Have your most recent labs available",
      "Join from a quiet, private space",
    ],
    notes: "We will focus on metabolic trends from your July panel and adjust the current care plan.",
  },
  {
    id: "apt-2026-1105",
    date: "2026-08-14",
    time: "9:00 AM",
    tz: "MST",
    physician: "Dr. Jason Chen",
    type: "Longevity Program Review",
    service: "Longevity Medicine",
    format: "In-person · Boulder",
    language: "English",
    duration: "60 min",
    status: "Pending" as ApptStatus,
    payment: "Not billed",
    forms: "Not started",
    preparation: ["Fasting labs 3 days prior", "Bring wearable data summary"],
    notes: "Quarterly review of longevity biomarkers and program milestones.",
  },
  {
    id: "apt-2026-0605",
    date: "2026-06-05",
    time: "11:00 AM",
    tz: "MST",
    physician: "Dr. Jason Chen",
    type: "Initial Consultation",
    service: "Integrative Medicine",
    format: "Telehealth",
    language: "English",
    duration: "60 min",
    status: "Completed" as ApptStatus,
    payment: "Paid",
    forms: "Completed",
    preparation: [],
    notes: "Baseline visit. Initial care plan established.",
  },
];

export const todaysActions = [
  { id: 1, label: "Complete Sleep & Recovery intake", status: "Pending", due: "Due before Jul 24" },
  { id: 2, label: "Review updated care plan", status: "Due Soon", due: "This week" },
  { id: 3, label: "Read message from Dr. Chen", status: "Pending", due: "Today" },
  { id: 4, label: "Confirm upcoming appointment", status: "Completed", due: "" },
  { id: 5, label: "Upload recent thyroid panel", status: "Overdue", due: "Was due Jul 10" },
];

export const healthJourney = [
  { date: "Jul 15", type: "Lab result", label: "Metabolic Panel — Awaiting review" },
  { date: "Jul 12", type: "Care plan", label: "Care Plan v3 published by Dr. Chen" },
  { date: "Jul 10", type: "Message", label: "New message from your care team" },
  { date: "Jul 08", type: "Document", label: "Visit summary added" },
  { date: "Jul 02", type: "Appointment", label: "Follow-up visit completed" },
  { date: "Jun 24", type: "Goal", label: "Sleep goal updated: 7h 30m" },
];

export const vitals = [
  { key: "weight", label: "Weight", value: "142 lb", unit: "lb", trend: [143, 142.5, 142.2, 142, 141.8, 142, 142], status: "Within expected range" },
  { key: "bp", label: "Blood pressure", value: "118 / 76", unit: "mmHg", trend: [120, 118, 122, 119, 118, 118, 118], status: "Within expected range" },
  { key: "hr", label: "Resting heart rate", value: "62", unit: "bpm", trend: [64, 63, 62, 62, 61, 62, 62], status: "Within expected range" },
  { key: "spo2", label: "Oxygen saturation", value: "98", unit: "%", trend: [98, 98, 97, 98, 98, 98, 98], status: "Within expected range" },
  { key: "sleep", label: "Sleep (avg)", value: "7h 12m", unit: "", trend: [6.8, 7.0, 7.2, 7.1, 7.3, 7.2, 7.2], status: "Follow-up recommended" },
  { key: "glucose", label: "Fasting glucose", value: "92", unit: "mg/dL", trend: [95, 94, 93, 92, 93, 92, 92], status: "Within expected range" },
];

export const conditions = [
  { name: "Insulin resistance (mild)", status: "Monitoring", added: "Jun 2026", reviewed: "Jul 2026" },
  { name: "Chronic sleep debt", status: "Active", added: "Jun 2026", reviewed: "Jul 2026" },
  { name: "Vitamin D deficiency", status: "Resolved", added: "Feb 2025", reviewed: "Jan 2026" },
];

export const allergies = [
  { allergen: "Penicillin", reaction: "Rash", severity: "Moderate", date: "2012" },
  { allergen: "Shellfish", reaction: "Hives", severity: "Mild", date: "2018" },
];

export const medications = [
  { name: "Metformin ER", dose: "500 mg", freq: "Twice daily", time: "AM / PM with food", status: "Active", prescribed: "Dr. Jason Chen", start: "Jun 2026", refill: "Refill available in 12 days", condition: "Insulin resistance" },
  { name: "Levothyroxine", dose: "50 mcg", freq: "Once daily", time: "Morning, empty stomach", status: "Active", prescribed: "External", start: "2021", refill: "Refill available in 40 days", condition: "Thyroid support" },
];

export const supplements = [
  { name: "Vitamin D3", dose: "2000 IU", freq: "Once daily", time: "Morning", purpose: "Bone & immune", status: "Active", start: "Jun 2026" },
  { name: "Magnesium glycinate", dose: "300 mg", freq: "Once daily", time: "Evening", purpose: "Sleep & recovery", status: "Active", start: "Jun 2026" },
  { name: "Omega-3", dose: "1000 mg", freq: "Once daily", time: "With meal", purpose: "Cardiometabolic", status: "Active", start: "Jun 2026" },
];

export const labs = [
  {
    id: "lab-metab-jul26",
    panel: "Comprehensive Metabolic Panel",
    category: "Metabolic",
    date: "2026-07-14",
    lab: "Quest Diagnostics",
    reviewStatus: "Awaiting Review" as const,
    biomarkers: 14,
    physicianComment: false,
    followUp: "Recommended",
    results: [
      { name: "Fasting glucose", value: 92, unit: "mg/dL", range: "70 – 99", prev: 96, status: "Within Reference Range" },
      { name: "HbA1c", value: 5.6, unit: "%", range: "< 5.7", prev: 5.8, status: "Within Reference Range" },
      { name: "Fasting insulin", value: 12, unit: "µIU/mL", range: "2 – 20", prev: 15, status: "Within Reference Range" },
      { name: "hs-CRP", value: 2.4, unit: "mg/L", range: "< 1.0", prev: 2.1, status: "Outside Reference Range" },
      { name: "ALT", value: 22, unit: "U/L", range: "7 – 35", prev: 24, status: "Within Reference Range" },
    ],
  },
  {
    id: "lab-thyroid-jun26",
    panel: "Thyroid Panel",
    category: "Thyroid",
    date: "2026-06-30",
    lab: "LabCorp",
    reviewStatus: "Reviewed" as const,
    biomarkers: 5,
    physicianComment: true,
    followUp: "None",
    results: [
      { name: "TSH", value: 1.8, unit: "mIU/L", range: "0.4 – 4.0", prev: 2.0, status: "Within Reference Range" },
      { name: "Free T4", value: 1.2, unit: "ng/dL", range: "0.8 – 1.8", prev: 1.1, status: "Within Reference Range" },
    ],
  },
  {
    id: "lab-lipid-jun26",
    panel: "Advanced Lipid Panel",
    category: "Cardiovascular",
    date: "2026-06-30",
    lab: "Quest Diagnostics",
    reviewStatus: "Follow-Up Recommended" as const,
    biomarkers: 9,
    physicianComment: true,
    followUp: "Recommended",
    results: [
      { name: "LDL-C", value: 132, unit: "mg/dL", range: "< 100", prev: 138, status: "Outside Reference Range" },
      { name: "HDL-C", value: 58, unit: "mg/dL", range: "> 50", prev: 55, status: "Within Reference Range" },
      { name: "Triglycerides", value: 110, unit: "mg/dL", range: "< 150", prev: 128, status: "Within Reference Range" },
      { name: "ApoB", value: 96, unit: "mg/dL", range: "< 90", prev: 102, status: "Outside Reference Range" },
    ],
  },
];

export const carePlan = {
  name: "Metabolic Reset & Longevity Foundation",
  goal: "Improve insulin sensitivity and cardiometabolic markers over 12 weeks",
  start: "Jun 5, 2026",
  updated: "Jul 12, 2026",
  nextReview: "Aug 14, 2026",
  physician: "Dr. Jason Chen",
  phase: "Phase 2 · Stabilization",
  progress: 62,
  sections: [
    {
      title: "Nutrition",
      items: [
        { rec: "Mediterranean-style meals, 30g protein per meal", freq: "Daily", status: "In Progress" },
        { rec: "Fiber target 30g / day", freq: "Daily", status: "In Progress" },
      ],
    },
    {
      title: "Exercise",
      items: [
        { rec: "Zone 2 cardio", freq: "3× / week · 40 min", status: "In Progress" },
        { rec: "Resistance training", freq: "2× / week", status: "Not Started" },
      ],
    },
    {
      title: "Sleep",
      items: [{ rec: "Target 7.5h with consistent bedtime", freq: "Nightly", status: "Requires Review" }],
    },
    {
      title: "Supplements",
      items: [
        { rec: "Magnesium glycinate 300 mg", freq: "Evening", status: "In Progress" },
        { rec: "Omega-3 1000 mg", freq: "With meal", status: "In Progress" },
      ],
    },
    {
      title: "Monitoring",
      items: [
        { rec: "Continuous glucose monitor", freq: "2 weeks", status: "In Progress" },
        { rec: "Weekly weight & waist", freq: "Weekly", status: "In Progress" },
      ],
    },
  ],
};

export const messages = [
  {
    id: "msg-1",
    from: "Dr. Jason Chen",
    dept: "Care Team",
    subject: "Your July metabolic panel",
    preview: "Your recent labs look encouraging overall — a few markers I'd like to discuss…",
    date: "Jul 15",
    unread: true,
    body: "Emily,\n\nYour July panel shows continued improvement in insulin and HbA1c. hs-CRP is still slightly elevated — we'll adjust the care plan on Tuesday. No action needed from you before then.\n\n— Dr. Chen",
  },
  { id: "msg-2", from: "Care Coordinator", dept: "Appointments", subject: "Reminder: Follow-up on Jul 24", preview: "Just a friendly reminder about your upcoming telehealth visit…", date: "Jul 14", unread: false, body: "Your telehealth follow-up is on July 24 at 10:30 AM MST." },
  { id: "msg-3", from: "Billing", dept: "Billing", subject: "Receipt available", preview: "Your receipt for invoice #INV-2026-0442 is now available…", date: "Jul 08", unread: false, body: "Receipt for invoice #INV-2026-0442 is available in Documents." },
];

export const documents = [
  { name: "Metabolic Panel — Jul 2026", category: "Lab Reports", date: "Jul 15", type: "PDF", size: "412 KB" },
  { name: "Care Plan v3", category: "Care Plans", date: "Jul 12", type: "PDF", size: "268 KB" },
  { name: "Visit summary — Jul 02", category: "Visit Summaries", date: "Jul 02", type: "PDF", size: "184 KB" },
  { name: "Consent — Telehealth", category: "Consent Documents", date: "Jun 05", type: "PDF", size: "96 KB" },
  { name: "Receipt INV-2026-0442", category: "Receipts", date: "Jul 08", type: "PDF", size: "72 KB" },
  { name: "Sleep & Recovery guide", category: "Educational Materials", date: "Jun 20", type: "PDF", size: "1.2 MB" },
];

export const forms = [
  { id: "form-sleep", title: "Sleep and Recovery intake", desc: "10 questions about sleep patterns and recovery.", time: "6 min", due: "Jul 24", status: "In Progress", progress: 40 },
  { id: "form-nutri", title: "Nutrition Questionnaire", desc: "Dietary patterns and preferences.", time: "8 min", due: "—", status: "Not Started", progress: 0 },
  { id: "form-hist", title: "Medical History update", desc: "Confirm and update your medical history.", time: "12 min", due: "Aug 01", status: "Requires Update", progress: 0 },
  { id: "form-consent", title: "Telehealth Consent", desc: "Consent to telehealth services.", time: "3 min", due: "—", status: "Completed", progress: 100 },
];

export const invoices = [
  { id: "INV-2026-0501", service: "Follow-up Visit", date: "Jul 24", due: "Aug 07", amount: 220, balance: 220, status: "Pending" },
  { id: "INV-2026-0442", service: "Initial Consultation", date: "Jun 05", due: "Jun 19", amount: 480, balance: 0, status: "Paid" },
  { id: "INV-2026-0398", service: "Advanced Lipid Panel", date: "Jun 30", due: "Jul 14", amount: 165, balance: 0, status: "Paid" },
];

export const programs = [
  { slug: "longevity", name: "Longevity Program", goal: "Optimize healthspan and biological age markers", duration: "12 months", start: "Jun 5, 2026", phase: "Foundation", progress: 20, next: "Longevity biomarker panel — Aug 10" },
  { slug: "metabolic", name: "Metabolic Health Program", goal: "Improve insulin sensitivity and lipid profile", duration: "12 weeks", start: "Jun 5, 2026", phase: "Stabilization", progress: 62, next: "Follow-up visit — Jul 24" },
  { slug: "executive", name: "Executive Health", goal: "Comprehensive annual assessment", duration: "Annual", start: "—", phase: "Not enrolled", progress: 0, next: "Speak with your care team" },
];

export const education = [
  { title: "Understanding your metabolic panel", type: "Guide", category: "Labs", author: "Dr. Jason Chen", time: "8 min", reason: "From your care plan" },
  { title: "Zone 2 cardio: a practical guide", type: "Article", category: "Exercise", author: "Care Team", time: "6 min", reason: "Related to your health goal" },
  { title: "Foundations of restorative sleep", type: "Video", category: "Sleep", author: "Dr. Jason Chen", time: "12 min", reason: "Recommended by your care team" },
  { title: "Mediterranean-style eating", type: "Guide", category: "Nutrition", author: "Care Team", time: "10 min", reason: "From your care plan" },
  { title: "Longevity biomarkers: what we track", type: "Research", category: "Longevity", author: "Dr. Jason Chen", time: "14 min", reason: "Related to your program" },
  { title: "Wearables and clinical data", type: "Article", category: "Technology", author: "Care Team", time: "5 min", reason: "Recommended for you" },
];

export const notifications = [
  { id: "n1", type: "Lab Result", label: "New lab available: Metabolic Panel", date: "Jul 15", unread: true },
  { id: "n2", type: "Message", label: "New message from Dr. Jason Chen", date: "Jul 15", unread: true },
  { id: "n3", type: "Care Plan", label: "Care Plan v3 published", date: "Jul 12", unread: false },
  { id: "n4", type: "Form Due", label: "Sleep and Recovery intake due Jul 24", date: "Jul 10", unread: false },
  { id: "n5", type: "Appointment Reminder", label: "Upcoming visit on Jul 24 at 10:30 AM", date: "Jul 08", unread: false },
  { id: "n6", type: "Payment", label: "New invoice #INV-2026-0501", date: "Jul 24", unread: false },
];
