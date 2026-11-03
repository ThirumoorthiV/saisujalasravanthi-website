import { z } from "zod";
import { ENQUIRY_INBOXES } from "@/data/site";
import type { FieldSpec } from "@/components/ui/Form";

const name = z.string().trim().min(2, "Please enter your name");
const email = z.string().trim().email("Please enter a valid email");
const phone = z
  .string()
  .trim()
  .regex(/^[+\d][\d\s-]{7,}$/, "Please enter a valid phone number");
const message = z.string().trim().min(10, "Please write at least a short message");
const required = (msg: string) => z.string().min(1, msg);

// ---- CSR enquiry (§5.9) ----
export const CSR_AREAS = ["Healthcare", "Rural Development", "Education", "Nutrition", "Water & Sanitation", "Preventive Healthcare"] as const;
export const BUDGET_RANGES = ["Under ₹10 lakh", "₹10–25 lakh", "₹25–50 lakh", "₹50 lakh – ₹1 crore", "Above ₹1 crore", "Not decided"] as const;

export const csrSchema = z.object({
  company: z.string().trim().min(2, "Company name is required"),
  contact: name,
  designation: z.string().trim().min(2, "Designation is required"),
  email,
  phone,
  area: required("Choose an area"),
  budget: required("Choose a budget range"),
  location: z.string().trim().optional(),
  message: z.string().trim().optional(),
});
export type CsrEnquiry = z.infer<typeof csrSchema>;
export const csrFields: FieldSpec<CsrEnquiry>[] = [
  { name: "company", label: "Company name", required: true },
  { name: "contact", label: "Contact person", required: true },
  { name: "designation", label: "Designation", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "area", label: "CSR area of interest", type: "select", options: CSR_AREAS, required: true },
  { name: "budget", label: "Budget range", type: "select", options: BUDGET_RANGES, required: true },
  { name: "location", label: "Preferred location" },
  { name: "message", label: "Message", type: "textarea" },
];

// ---- Volunteer ----
export const volunteerSchema = z.object({
  name,
  email,
  phone,
  city: z.string().trim().min(2, "Please enter your city"),
  interest: required("Choose an area"),
  availability: required("Choose availability"),
  message: z.string().trim().optional(),
});
export const volunteerFields: FieldSpec<z.infer<typeof volunteerSchema>>[] = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "city", label: "City", required: true },
  { name: "interest", label: "Area of interest", type: "select", options: ["Medical camps", "Rural development", "Education", "Community programmes", "Events & logistics", "Communications"], required: true },
  { name: "availability", label: "Availability", type: "select", options: ["Weekends", "Weekdays", "Occasional events", "Flexible"], required: true },
  { name: "message", label: "Tell us about yourself", type: "textarea" },
];

// ---- Medical volunteer ----
export const medicalSchema = z.object({
  name,
  email,
  phone,
  specialisation: z.string().trim().min(2, "Please enter your specialisation"),
  registration: z.string().trim().min(3, "Medical registration number is required"),
  availability: required("Choose availability"),
  message: z.string().trim().optional(),
});
export const medicalFields: FieldSpec<z.infer<typeof medicalSchema>>[] = [
  { name: "name", label: "Full name (Dr.)", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "specialisation", label: "Specialisation", required: true },
  { name: "registration", label: "Medical registration no.", required: true },
  { name: "availability", label: "Availability", type: "select", options: ["One camp a month", "Two camps a month", "Weekly", "Teleconsultation only"], required: true },
  { name: "message", label: "Anything else we should know?", type: "textarea" },
];

// ---- Support a programme ----
export const supportSchema = z.object({
  name,
  email,
  phone,
  programme: required("Choose a programme"),
  nationality: required("Please choose one"),
  message: z.string().trim().optional(),
});
export const supportFields: FieldSpec<z.infer<typeof supportSchema>>[] = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "programme", label: "Programme to support", type: "select", options: ["Healthcare", "Education", "Rural Development", "Community Empowerment", "Where most needed"], required: true },
  // FCRA: foreign contributions need separate handling (§5.11 note).
  { name: "nationality", label: "Are you an Indian citizen?", type: "select", options: ["Yes — Indian citizen", "No — foreign national / foreign source"], required: true },
  { name: "message", label: "Message", type: "textarea" },
];

// ---- Share your expertise ----
export const expertiseSchema = z.object({
  name,
  email,
  phone,
  expertise: z.string().trim().min(2, "Please describe your expertise"),
  message,
});
export const expertiseFields: FieldSpec<z.infer<typeof expertiseSchema>>[] = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "expertise", label: "Area of expertise", required: true },
  { name: "message", label: "How would you like to contribute?", type: "textarea", required: true },
];

// ---- Contact (§5.13) ----
export const ENQUIRY_TYPES = Object.keys(ENQUIRY_INBOXES) as (keyof typeof ENQUIRY_INBOXES)[];
export const contactSchema = z.object({
  type: z.enum(ENQUIRY_TYPES as [keyof typeof ENQUIRY_INBOXES, ...(keyof typeof ENQUIRY_INBOXES)[]], {
    errorMap: () => ({ message: "Choose an enquiry type" }),
  }),
  name,
  email,
  phone: z.string().trim().optional(),
  message,
});
export const contactFields: FieldSpec<z.infer<typeof contactSchema>>[] = [
  { name: "type", label: "Enquiry type", type: "select", options: ENQUIRY_TYPES, required: true },
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "message", label: "Message", type: "textarea", required: true },
];
