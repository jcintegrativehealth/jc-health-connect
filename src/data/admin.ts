// Mock data for the JC Integrative Health admin dashboard.
// All demo — no PII, no real medical records.

export const clinic = {
  name: "JC Integrative Health",
  doctor: "Dr. Jason Chen",
  role: "Founder · Medical Director",
  npi: "1234567890",
  hours: "Mon–Fri · 08:00–18:00 · Sat 09:00–13:00",
  states: ["Virginia", "Maryland", "Colorado"],
  languages: ["English", "Spanish", "Portuguese", "Mandarin"],
};

export const kpi = {
  todayAppointments: 12,
  activePatients: 384,
  newPatientRequests: 7,
  pendingMessages: 14,
  pendingPayments: 6,
  newLabs: 9,
  carePlansReview: 4,
  researchDrafts: 3,
  revenueMonth: 128_450,
  collected: 91_200,
  outstanding: 37_250,
  overdue: 8_400,
  refunds: 1_150,
  avgVisitValue: 285,
  activeCarePlans: 142,
  followUpNeeded: 28,
  labsAwaiting: 11,
  incompleteIntakes: 5,
  pendingRx: 3,
  goalsInProgress: 96,
};

export type Status =
  | "Confirmed" | "Checked In" | "In Progress" | "Completed" | "Cancelled" | "No Show"
  | "Active" | "New" | "Follow-Up" | "Inactive" | "Archived"
  | "Draft" | "In Review" | "Approved" | "Scheduled" | "Published"
  | "Sent" | "Paid" | "Partial" | "Overdue" | "Refunded"
  | "To Do" | "Waiting"
  | "Reviewed" | "Requires Follow-Up";

export const todayAgenda = [
  { time: "08:30", patient: "Amelia R.", type: "Longevity consult", modality: "In-person", lang: "EN", state: "VA", status: "Confirmed" as Status },
  { time: "09:15", patient: "Rafael M.", type: "Metabolic follow-up", modality: "Telehealth", lang: "PT", state: "MD", status: "Checked In" as Status },
  { time: "10:00", patient: "Sofía L.", type: "Initial consultation", modality: "In-person", lang: "ES", state: "MD", status: "In Progress" as Status },
  { time: "11:00", patient: "Wei Z.", type: "Preventive review", modality: "Telehealth", lang: "ZH", state: "VA", status: "Confirmed" as Status },
  { time: "13:30", patient: "Marcus B.", type: "Care plan review", modality: "Telehealth", lang: "EN", state: "CO", status: "Confirmed" as Status },
  { time: "14:15", patient: "Priya N.", type: "Weight management", modality: "In-person", lang: "EN", state: "VA", status: "Confirmed" as Status },
  { time: "15:00", patient: "Julia F.", type: "Lab review", modality: "Telehealth", lang: "PT", state: "MD", status: "Confirmed" as Status },
  { time: "16:00", patient: "David C.", type: "Follow-up", modality: "Telehealth", lang: "EN", state: "MD", status: "Confirmed" as Status },
];

export const patients = [
  { id: "P-1042", name: "Amelia Reyes", age: 42, state: "VA", lang: "EN", service: "Longevity", last: "Aug 12", next: "Sep 04", plan: "Active", balance: 0, status: "Active" as Status },
  { id: "P-1043", name: "Rafael Marques", age: 38, state: "MD", lang: "PT", service: "Metabolic", last: "Aug 15", next: "Aug 28", plan: "Active", balance: 240, status: "Follow-Up" as Status },
  { id: "P-1044", name: "Sofía Lopez", age: 51, state: "MD", lang: "ES", service: "Preventive", last: "—", next: "Aug 22", plan: "Draft", balance: 0, status: "New" as Status },
  { id: "P-1045", name: "Wei Zhang", age: 47, state: "VA", lang: "ZH", service: "Longevity", last: "Jul 30", next: "Sep 11", plan: "Active", balance: 0, status: "Active" as Status },
  { id: "P-1046", name: "Marcus Brown", age: 55, state: "CO", lang: "EN", service: "Cardio-metabolic", last: "Aug 05", next: "—", plan: "Needs Review", balance: 850, status: "Follow-Up" as Status },
  { id: "P-1047", name: "Priya Nair", age: 34, state: "VA", lang: "EN", service: "Weight", last: "Aug 10", next: "Aug 25", plan: "Active", balance: 0, status: "Active" as Status },
  { id: "P-1048", name: "Julia Ferreira", age: 60, state: "MD", lang: "PT", service: "Longevity", last: "Aug 03", next: "Sep 02", plan: "Active", balance: 120, status: "Active" as Status },
  { id: "P-1049", name: "David Chen", age: 45, state: "MD", lang: "EN", service: "Preventive", last: "Jul 20", next: "Aug 21", plan: "Active", balance: 0, status: "Active" as Status },
  { id: "P-1050", name: "Elena Duarte", age: 39, state: "CO", lang: "ES", service: "Metabolic", last: "—", next: "—", plan: "—", balance: 0, status: "New" as Status },
  { id: "P-1051", name: "Hiroshi K.", age: 62, state: "VA", lang: "EN", service: "Longevity", last: "Jun 12", next: "—", plan: "Paused", balance: 0, status: "Inactive" as Status },
];

export const activity = [
  { icon: "user-plus", text: "New patient registered · Elena Duarte", time: "12m", tone: "teal" },
  { icon: "flask", text: "Lab result uploaded · P-1042 (Metabolic panel)", time: "34m", tone: "gold" },
  { icon: "calendar", text: "Appointment scheduled · Priya Nair · Aug 25", time: "1h", tone: "navy" },
  { icon: "message", text: "Message received from Rafael Marques", time: "2h", tone: "navy" },
  { icon: "dollar", text: "Payment completed · Invoice #INV-2312 · $285", time: "3h", tone: "teal" },
  { icon: "clipboard", text: "Care plan updated · Marcus Brown", time: "5h", tone: "navy" },
  { icon: "bell", text: "Follow-up required · P-1046 · Cardio-metabolic", time: "1d", tone: "gold" },
];

export const tasks = [
  { id: "t1", title: "Review lab results — Amelia Reyes", cat: "Clinical", priority: "High", due: "Today", status: "To Do" as Status },
  { id: "t2", title: "Approve research draft — GLP-1 & longevity", cat: "Research", priority: "Medium", due: "Today", status: "In Review" as Status },
  { id: "t3", title: "Respond to Rafael Marques (portal message)", cat: "Patients", priority: "High", due: "Today", status: "To Do" as Status },
  { id: "t4", title: "Confirm 4:00 PM appointment — David Chen", cat: "Appointments", priority: "Low", due: "Today", status: "To Do" as Status },
  { id: "t5", title: "Review overdue payment — Marcus Brown", cat: "Billing", priority: "High", due: "Tomorrow", status: "To Do" as Status },
  { id: "t6", title: "Update care plan — Sofía Lopez", cat: "Clinical", priority: "Medium", due: "Aug 22", status: "In Progress" as Status },
  { id: "t7", title: "Publish August Insights digest", cat: "Content", priority: "Low", due: "Aug 30", status: "Waiting" as Status },
];

export const appointments = [
  { id: "A-8801", date: "2026-08-19", time: "08:30", patient: "Amelia Reyes", type: "Longevity consult", service: "Longevity", state: "VA", lang: "EN", format: "In-person", duration: 60, status: "Confirmed" as Status, pay: "Paid" as Status },
  { id: "A-8802", date: "2026-08-19", time: "09:15", patient: "Rafael Marques", type: "Metabolic follow-up", service: "Metabolic", state: "MD", lang: "PT", format: "Telehealth", duration: 30, status: "Checked In" as Status, pay: "Partial" as Status },
  { id: "A-8803", date: "2026-08-19", time: "10:00", patient: "Sofía Lopez", type: "Initial consultation", service: "Preventive", state: "MD", lang: "ES", format: "In-person", duration: 75, status: "In Progress" as Status, pay: "Paid" as Status },
  { id: "A-8804", date: "2026-08-19", time: "11:00", patient: "Wei Zhang", type: "Preventive review", service: "Preventive", state: "VA", lang: "ZH", format: "Telehealth", duration: 45, status: "Confirmed" as Status, pay: "Paid" as Status },
  { id: "A-8805", date: "2026-08-19", time: "13:30", patient: "Marcus Brown", type: "Care plan review", service: "Cardio-metabolic", state: "CO", lang: "EN", format: "Telehealth", duration: 30, status: "Confirmed" as Status, pay: "Overdue" as Status },
  { id: "A-8806", date: "2026-08-19", time: "14:15", patient: "Priya Nair", type: "Weight management", service: "Weight", state: "VA", lang: "EN", format: "In-person", duration: 45, status: "Confirmed" as Status, pay: "Paid" as Status },
  { id: "A-8807", date: "2026-08-20", time: "09:00", patient: "Julia Ferreira", type: "Lab review", service: "Longevity", state: "MD", lang: "PT", format: "Telehealth", duration: 30, status: "Confirmed" as Status, pay: "Paid" as Status },
  { id: "A-8808", date: "2026-08-20", time: "10:00", patient: "David Chen", type: "Follow-up", service: "Preventive", state: "MD", lang: "EN", format: "Telehealth", duration: 30, status: "Confirmed" as Status, pay: "Paid" as Status },
];

export const labs = [
  { id: "L-3301", patient: "Amelia Reyes", test: "Comprehensive Metabolic Panel", lab: "Quest", date: "Aug 12", cat: "Metabolic", flag: false, status: "New" as Status },
  { id: "L-3302", patient: "Marcus Brown", test: "Lipid Panel + ApoB", lab: "LabCorp", date: "Aug 10", cat: "Cardiovascular", flag: true, status: "Requires Follow-Up" as Status },
  { id: "L-3303", patient: "Rafael Marques", test: "HbA1c + Fasting Insulin", lab: "Quest", date: "Aug 15", cat: "Metabolic", flag: false, status: "Reviewed" as Status },
  { id: "L-3304", patient: "Julia Ferreira", test: "Thyroid Panel (TSH, T3, T4)", lab: "LabCorp", date: "Aug 03", cat: "Thyroid", flag: false, status: "Reviewed" as Status },
  { id: "L-3305", patient: "Priya Nair", test: "hsCRP + Homocysteine", lab: "Quest", date: "Aug 08", cat: "Inflammation", flag: false, status: "New" as Status },
  { id: "L-3306", patient: "Wei Zhang", test: "Complete Blood Count", lab: "LabCorp", date: "Jul 28", cat: "Hematology", flag: false, status: "Reviewed" as Status },
  { id: "L-3307", patient: "David Chen", test: "Longevity Biomarker Bundle", lab: "Function Health", date: "Aug 05", cat: "Longevity", flag: true, status: "Requires Follow-Up" as Status },
];

export const carePlans = [
  { id: "CP-201", patient: "Amelia Reyes", name: "Longevity foundations", goal: "Metabolic optimization", start: "Jul 01", review: "Sep 01", progress: 62, status: "Active" as Status },
  { id: "CP-202", patient: "Rafael Marques", name: "Insulin sensitivity reset", goal: "HbA1c < 5.4", start: "Jun 20", review: "Aug 25", progress: 78, status: "Follow-Up" as Status },
  { id: "CP-203", patient: "Marcus Brown", name: "Cardio-metabolic protocol", goal: "ApoB reduction", start: "May 15", review: "Aug 21", progress: 41, status: "Follow-Up" as Status },
  { id: "CP-204", patient: "Priya Nair", name: "Sustainable weight care", goal: "Body composition", start: "Jul 10", review: "Sep 10", progress: 54, status: "Active" as Status },
  { id: "CP-205", patient: "Sofía Lopez", name: "Initial preventive plan", goal: "Baseline screening", start: "Aug 15", review: "Sep 15", progress: 8, status: "Draft" as Status },
];

export const messages = [
  { id: "M-701", from: "Rafael Marques", subject: "Question about supplement timing", patient: "Rafael Marques", date: "1h", priority: "Normal", folder: "Inbox", unread: true },
  { id: "M-702", from: "Amelia Reyes", subject: "Received lab results — happy to discuss", patient: "Amelia Reyes", date: "3h", priority: "Normal", folder: "Inbox", unread: true },
  { id: "M-703", from: "insurance@bcbs.example", subject: "Coverage inquiry — Marcus Brown", patient: "Marcus Brown", date: "5h", priority: "High", folder: "Billing", unread: true },
  { id: "M-704", from: "Priya Nair", subject: "Need to reschedule Aug 25", patient: "Priya Nair", date: "1d", priority: "Normal", folder: "Appointment Requests", unread: false },
  { id: "M-705", from: "Dr. Amelia Park", subject: "Guest article — mTOR review", patient: "—", date: "2d", priority: "Normal", folder: "Research", unread: false },
  { id: "M-706", from: "Sofía Lopez", subject: "First visit — what to bring?", patient: "Sofía Lopez", date: "2d", priority: "Normal", folder: "Inbox", unread: false },
];

export const invoices = [
  { id: "INV-2312", patient: "Amelia Reyes", service: "Longevity consult", date: "Aug 12", due: "Aug 26", amount: 285, balance: 0, status: "Paid" as Status },
  { id: "INV-2313", patient: "Rafael Marques", service: "Metabolic follow-up", date: "Aug 15", due: "Aug 29", amount: 240, balance: 120, status: "Partial" as Status },
  { id: "INV-2314", patient: "Marcus Brown", service: "Cardio-metabolic", date: "Aug 05", due: "Aug 19", amount: 850, balance: 850, status: "Overdue" as Status },
  { id: "INV-2315", patient: "Julia Ferreira", service: "Longevity", date: "Aug 03", due: "Aug 17", amount: 285, balance: 120, status: "Partial" as Status },
  { id: "INV-2316", patient: "Sofía Lopez", service: "Initial consultation", date: "Aug 15", due: "Aug 29", amount: 425, balance: 0, status: "Paid" as Status },
  { id: "INV-2317", patient: "Wei Zhang", service: "Preventive review", date: "Aug 14", due: "Aug 28", amount: 285, balance: 285, status: "Sent" as Status },
];

export const payments = [
  { id: "PAY-9012", patient: "Amelia Reyes", amount: 285, date: "Aug 12", method: "Card", invoice: "INV-2312", status: "Paid" as Status },
  { id: "PAY-9013", patient: "Rafael Marques", amount: 120, date: "Aug 15", method: "Card", invoice: "INV-2313", status: "Paid" as Status },
  { id: "PAY-9014", patient: "Julia Ferreira", amount: 165, date: "Aug 03", method: "ACH", invoice: "INV-2315", status: "Paid" as Status },
  { id: "PAY-9015", patient: "Sofía Lopez", amount: 425, date: "Aug 15", method: "Card", invoice: "INV-2316", status: "Paid" as Status },
];

export const leads = [
  { name: "Camila Rossi", inquiry: "Longevity consult", state: "MD", lang: "PT", source: "Website", stage: "New Inquiry", priority: "High" },
  { name: "Anthony Ward", inquiry: "Weight management", state: "VA", lang: "EN", source: "Search", stage: "New Inquiry", priority: "Medium" },
  { name: "Fatima H.", inquiry: "Preventive", state: "MD", lang: "EN", source: "Physician referral", stage: "Contacted", priority: "High" },
  { name: "Isabela Costa", inquiry: "Metabolic", state: "MD", lang: "PT", source: "Patient referral", stage: "Consultation Requested", priority: "Medium" },
  { name: "Lin Yu", inquiry: "Longevity", state: "VA", lang: "ZH", source: "University", stage: "Appointment Scheduled", priority: "Medium" },
  { name: "Diego Ortiz", inquiry: "Cardio-metabolic", state: "CO", lang: "ES", source: "Social", stage: "Became Patient", priority: "Low" },
  { name: "Nora Bright", inquiry: "Preventive", state: "VA", lang: "EN", source: "Website", stage: "Follow-Up Later", priority: "Low" },
];

export const research = [
  { id: "R-081", title: "GLP-1 receptor agonists and longevity: evidence in 2026", author: "Dr. Jason Chen", guest: "—", category: "Metabolic", evidence: "Systematic review", status: "Draft" as Status, date: "—", views: 0, reactions: 0, comments: 0 },
  { id: "R-080", title: "ApoB versus LDL-C in cardiovascular risk stratification", author: "Dr. Jason Chen", guest: "Dr. Amelia Park", category: "Cardiovascular", evidence: "Narrative review", status: "In Review" as Status, date: "—", views: 0, reactions: 0, comments: 0 },
  { id: "R-079", title: "Continuous glucose monitoring beyond diabetes", author: "Dr. Jason Chen", guest: "—", category: "Metabolic", evidence: "Clinical commentary", status: "Scheduled" as Status, date: "Aug 25", views: 0, reactions: 0, comments: 0 },
  { id: "R-078", title: "Rethinking mTOR modulation in longevity practice", author: "Dr. Jason Chen", guest: "—", category: "Longevity", evidence: "Systematic review", status: "Published" as Status, date: "Aug 10", views: 4210, reactions: 128, comments: 42 },
  { id: "R-077", title: "Adaptogens: an evidence-based framework", author: "Dr. Jason Chen", guest: "Dr. Priya Menon", category: "Integrative", evidence: "Narrative review", status: "Published" as Status, date: "Jul 28", views: 3120, reactions: 96, comments: 31 },
  { id: "R-076", title: "Chronic fatigue: an integrative diagnostic approach", author: "Dr. Jason Chen", guest: "—", category: "Integrative", evidence: "Clinical commentary", status: "Archived" as Status, date: "May 05", views: 1980, reactions: 44, comments: 22 },
];

export const insightsContent = [
  { id: "I-201", title: "August medication update — cardiometabolic", type: "Medication Update", status: "Draft" as Status, views: 0 },
  { id: "I-200", title: "CGM in metabolically healthy adults: what to look for", type: "Medical Insight", status: "Published" as Status, views: 2410 },
  { id: "I-199", title: "FDA update: novel anti-inflammatory approvals", type: "FDA Update", status: "Published" as Status, views: 1180 },
  { id: "I-198", title: "Wearables in clinical practice — 2026 review", type: "Technology Review", status: "Scheduled" as Status, views: 0 },
];

export const notifications = [
  { id: "n1", type: "appointment", text: "New appointment · Sofía Lopez · Sep 02, 10:00", time: "5m", read: false },
  { id: "n2", type: "message", text: "New portal message from Rafael Marques", time: "22m", read: false },
  { id: "n3", type: "lab", text: "Lab result uploaded · Amelia Reyes · Metabolic panel", time: "1h", read: false },
  { id: "n4", type: "billing", text: "Overdue payment · Marcus Brown · INV-2314", time: "3h", read: true },
  { id: "n5", type: "research", text: "3 new comments on “Rethinking mTOR”", time: "5h", read: true },
  { id: "n6", type: "task", text: "Task due today · Review lab results — Amelia Reyes", time: "6h", read: true },
];

export const documents = [
  { id: "D-501", name: "Amelia_Reyes_Intake.pdf", patient: "Amelia Reyes", cat: "Intake Forms", date: "Aug 10", by: "Portal", status: "Signed", size: "412 KB", version: "v1" },
  { id: "D-502", name: "Rafael_Marques_LabPanel.pdf", patient: "Rafael Marques", cat: "Lab Reports", date: "Aug 15", by: "Quest", status: "Uploaded", size: "1.2 MB", version: "v1" },
  { id: "D-503", name: "Consent_Telehealth_2026.pdf", patient: "—", cat: "Templates", date: "Jul 01", by: "Dr. Chen", status: "Active", size: "88 KB", version: "v3" },
  { id: "D-504", name: "Marcus_Brown_CarePlan.pdf", patient: "Marcus Brown", cat: "Clinical Files", date: "Aug 08", by: "Dr. Chen", status: "Signed", size: "220 KB", version: "v2" },
  { id: "D-505", name: "GLP1_LongevityDraft.docx", patient: "—", cat: "Research Files", date: "Aug 17", by: "Dr. Chen", status: "Draft", size: "56 KB", version: "v4" },
];

export const services = ["Longevity", "Metabolic", "Preventive", "Cardio-metabolic", "Weight", "Integrative"];
