// Form delivery. Each submission is:
//  1. saved to Firestore (src/lib/firebase.ts) — a permanent, exportable record, and
//  2. emailed via Web3Forms (https://web3forms.com) — the team's instant notification.
// Either one succeeding counts as delivered, so an outage of one service never
// loses an enquiry.
//
// Both are configured in .env (VITE_FIREBASE_* and VITE_WEB3FORMS_ACCESS_KEY).
// These keys are public by design — Firestore access is limited by its security
// rules, and a Web3Forms key can only send to its owner's inbox.
const ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || import.meta.env.VITE_WEB3FORMS_KEY) as string | undefined;
const FIREBASE_ON = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

const FORM_TITLES: Record<string, string> = {
  contact: "Contact enquiry",
  csr_enquiry: "CSR partnership enquiry",
  volunteer_form: "Volunteer registration",
  "medical-volunteer_form": "Medical volunteer registration",
  "share-expertise_form": "Share your expertise",
};

export class SubmitError extends Error {}

async function sendEmail(title: string, data: Record<string, unknown>) {
  const enquiryType = typeof data.type === "string" ? ` — ${data.type}` : "";
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `${title}${enquiryType} | saisujalasravanthi.in`,
      from_name: "Sai Sujala Sravanthi website",
      replyto: data.email,
      form: title,
      page: window.location.href,
      ...data,
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
  if (!res.ok || !json.success) throw new SubmitError(json.message || "Something went wrong while sending.");
}

async function saveToFirestore(formName: string, title: string, data: Record<string, unknown>) {
  const { saveSubmission } = await import("./firebase");
  await saveSubmission(formName, title, data);
}

export async function submitForm(formName: string, data: Record<string, unknown>) {
  const title = FORM_TITLES[formName] ?? "Website form";
  const jobs = [
    ...(FIREBASE_ON ? [saveToFirestore(formName, title, data)] : []),
    ...(ACCESS_KEY ? [sendEmail(title, data)] : []),
  ];
  if (!jobs.length) throw new SubmitError("Online submissions aren't set up yet.");

  const results = await Promise.allSettled(jobs);
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  failures.forEach((f) => console.error("Form delivery failed:", f.reason));
  if (failures.length === results.length) {
    const reason = failures[0].reason;
    throw reason instanceof SubmitError ? reason : new SubmitError("Something went wrong while sending.");
  }
}
