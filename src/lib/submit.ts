// Form delivery via Web3Forms (https://web3forms.com). Each submission is emailed
// to the address that owns the access key; set it in .env as
// VITE_WEB3FORMS_ACCESS_KEY. Web3Forms access keys are designed to be public
// (they only allow sending to the owner's inbox), so shipping it in the client
// bundle is expected.
const ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || import.meta.env.VITE_WEB3FORMS_KEY) as string | undefined;

const FORM_TITLES: Record<string, string> = {
  contact: "Contact enquiry",
  csr_enquiry: "CSR partnership enquiry",
  volunteer_form: "Volunteer registration",
  "medical-volunteer_form": "Medical volunteer registration",
  "share-expertise_form": "Share your expertise",
};

export class SubmitError extends Error {}

export async function submitForm(formName: string, data: Record<string, unknown>) {
  if (!ACCESS_KEY) throw new SubmitError("Online submissions aren't set up yet.");

  const title = FORM_TITLES[formName] ?? "Website form";
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
