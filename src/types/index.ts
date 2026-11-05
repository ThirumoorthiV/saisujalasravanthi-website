// CMS data model (Requirements §10). Each type mirrors one CMS collection.

export type ProgrammeCategorySlug =
  | "healthcare"
  | "rural-development"
  | "education"
  | "community-empowerment"
  | "relief-emergency-support";

export interface ProgrammeCategory {
  slug: ProgrammeCategorySlug;
  name: string;
  pageTitle: string;
  summary: string;
  icon: IconName;
  image: string;
  ctas: { label: string; to: string }[];
}

export interface Programme {
  slug: string;
  name: string;
  category: ProgrammeCategorySlug;
  summary: string;
  problem: string;
  solution: string;
  locations: string[];
  whoWeServe: string[];
  services: string[];
  impact: { label: string; value: string }[];
  icon: IconName;
  image: string;
  /** Inactive programmes appear only under Our Journey / Past Initiatives. */
  active: boolean;
}

export type EventCategory =
  | "Medical Camps"
  | "Health Awareness Programmes"
  | "CSR Events"
  | "Community Programmes"
  | "Education Events"
  | "Workshops"
  | "Special Days & Observances";

export interface TrustEvent {
  slug: string;
  title: string;
  startDate: string; // ISO date
  endDate?: string;
  location: { village: string; district: string; state: string };
  programme: ProgrammeCategorySlug;
  category: EventCategory;
  objective: string;
  whoBenefited: string;
  keyActivities: string[];
  impact: { label: string; value: number }[];
  partners?: string[];
  videoUrl?: string;
  relatedStory?: string;
  image: string;
  status: "Upcoming" | "Completed";
}

export type StoryCategory =
  | "Healthcare Stories"
  | "Community Stories"
  | "Education Stories"
  | "Rural Development"
  | "CSR Stories"
  | "Volunteer Stories"
  | "Beneficiary Stories"
  | "Organisation Updates"
  | "Media & Press"
  | "Thoughts & Insights";

export interface Story {
  slug: string;
  title: string;
  category: StoryCategory;
  programme: ProgrammeCategorySlug;
  author: string;
  publishDate: string;
  cover: string;
  coverAlt: string;
  excerpt: string;
  body: string[];
  tags: string[];
  relatedEvent?: string;
  metaTitle: string;
  metaDescription: string;
  /** Present only on beneficiary stories ("Stories of Change", §5.7). */
  change?: BeneficiaryStory;
}

export interface BeneficiaryStory {
  challenge: string;
  journey: string;
  intervention: string;
  outcome: string;
  quote: string;
  quoteBy: string;
  consentRecorded: boolean;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  group: "Healthcare" | "Education" | "Rural Development" | "CSR" | "Events";
  subCategory: string;
  programme: ProgrammeCategorySlug;
  location: string;
  date: string;
}

export interface ImpactMetric {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  definition: string;
  period: string;
  asOf: string;
  source: string;
  /** False until the Trust confirms the figure (e.g. 18 vs 22 PHCs). */
  verified: boolean;
}

export interface YearlyImpact {
  year: number;
  metrics: { label: string; value: number }[];
}

export interface CsrProject {
  name: string;
  image: string;
  location: string;
  theme: string;
  objective: string;
  beneficiaries: string;
  duration: string;
  budget: string;
  expectedImpact: string;
  model: string;
}

export interface Partner {
  name: string;
  logo: string;
  website?: string;
  permissionGranted: boolean;
}

export interface Report {
  title: string;
  type: "Annual Report" | "Financial Report" | "CSR Report" | "Impact Report" | "Policy" | "Certificate";
  year: string;
  file: string;
}

export interface Leader {
  name: string;
  role: "Founder & Guiding Light" | "Board of Trustees" | "Advisory Council";
  bio: string;
  photo: string;
}

export interface Centre {
  name: string;
  type: "Sai Swasthya Centre" | "Hospital" | "Screening Centre" | "Office";
  address: string;
  state: "Telangana" | "Andhra Pradesh" | "Other";
}

export type IconName =
  | "HeartPulse"
  | "Stethoscope"
  | "Hospital"
  | "Tent"
  | "Baby"
  | "Pill"
  | "Droplets"
  | "GraduationCap"
  | "Users"
  | "LifeBuoy"
  | "Sprout"
  | "Handshake"
  | "ShieldPlus"
  | "Scissors";
