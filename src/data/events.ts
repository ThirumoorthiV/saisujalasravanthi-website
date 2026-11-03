import type { EventCategory, TrustEvent } from "@/types";

export const EVENT_CATEGORIES: EventCategory[] = [
  "Medical Camps",
  "Health Awareness Programmes",
  "CSR Events",
  "Community Programmes",
  "Education Events",
  "Workshops",
  "Special Days & Observances",
];

// The existing site has no dated events. Entries below are based on real
// programmes but their dates and counts are SAMPLES — replace with the Trust's
// event reports (§11). The Events page shows a notice while SAMPLE_EVENTS is true.
export const SAMPLE_EVENTS = true;

export const EVENTS: TrustEvent[] = [
  {
    slug: "monthly-dental-camp-mahbubnagar",
    image: "/images/site/outreach-medical-camp.webp",
    title: "Monthly Dental Camp with SVS Dental College",
    startDate: "2026-09-06",
    location: { village: "Timmayapalli", district: "Mahbubnagar", state: "Telangana" },
    programme: "healthcare",
    category: "Medical Camps",
    objective: "Free dental check-ups and treatment for villagers, run with SVS Dental College, Mahbubnagar.",
    whoBenefited: "Residents of Timmayapalli and neighbouring villages",
    keyActivities: ["Dental screening", "Treatment and extractions", "Oral hygiene awareness", "Health card updates"],
    impact: [{ label: "Beneficiaries", value: 200 }],
    partners: ["SVS Dental College, Mahbubnagar"],
    status: "Completed",
  },
  {
    slug: "pediatric-heart-screening-niloufer",
    image: "/images/site/pediatric-echo-screening.webp",
    title: "Pediatric Heart Screening Day, Niloufer Hospital",
    startDate: "2026-09-27",
    location: { village: "Hyderabad", district: "Hyderabad", state: "Telangana" },
    programme: "healthcare",
    category: "Medical Camps",
    objective: "Screen children for congenital heart conditions and refer those needing surgery.",
    whoBenefited: "Children referred to Niloufer Hospital",
    keyActivities: ["Cardiac screening by paediatric cardiologists", "Parent counselling", "Surgery gap funding assessment"],
    impact: [{ label: "Children screened", value: 150 }],
    partners: ["Niloufer Hospital"],
    relatedStory: "varun-kumar-vsd-closure",
    status: "Completed",
  },
  {
    slug: "eye-camp-sadhuram-hospitals",
    image: "/images/site/outreach-camp-consultations.webp",
    title: "Free Eye Camp with Sadhuram Hospitals",
    startDate: "2026-10-11",
    location: { village: "Timmayapalli", district: "Mahbubnagar", state: "Telangana" },
    programme: "healthcare",
    category: "Medical Camps",
    objective: "Eye screening, spectacles and cataract referrals for village residents.",
    whoBenefited: "Elderly villagers and school children",
    keyActivities: ["Vision testing", "Cataract screening", "Spectacle distribution", "Referrals to Hyderabad"],
    impact: [{ label: "Patients screened", value: 180 }],
    partners: ["Sadhuram Hospitals"],
    relatedStory: "monthly-outreach-camps-women-welfare",
    status: "Completed",
  },
  {
    slug: "womens-hygiene-workshop",
    image: "/images/site/community-women.webp",
    title: "Women's Hygiene Workshop with Dr. Sailaja",
    startDate: "2026-08-10",
    location: { village: "Timmayapalli", district: "Mahbubnagar", state: "Telangana" },
    programme: "community-empowerment",
    category: "Workshops",
    objective: "Improve women's health and sanitation through hygiene education.",
    whoBenefited: "Women of the village",
    keyActivities: ["Hygiene education", "Gynaecology consultations", "Early-marriage awareness"],
    impact: [{ label: "Women attended", value: 60 }],
    relatedStory: "monthly-outreach-camps-women-welfare",
    status: "Completed",
  },
  {
    slug: "balvikas-annual-day",
    image: "/images/free/school-children.webp",
    title: "BalVikas Annual Day",
    startDate: "2026-04-14",
    location: { village: "Timmayapalli", district: "Mahbubnagar", state: "Telangana" },
    programme: "community-empowerment",
    category: "Community Programmes",
    objective: "Celebrate BalVikas children's learning in human values, devotional singing and moral stories.",
    whoBenefited: "80+ BalVikas children and their families",
    keyActivities: ["Value-based performances", "Devotional singing", "Parent interaction"],
    impact: [{ label: "Children participated", value: 80 }],
    status: "Completed",
  },
  {
    slug: "cyclone-titli-homes-handover",
    image: "/images/site/cyclone-titli-house.webp",
    title: "Handover of Homes to Cyclone Titli Families",
    startDate: "2018-12-01",
    location: { village: "Pudilanka", district: "Srikakulam", state: "Andhra Pradesh" },
    programme: "relief-emergency-support",
    category: "Special Days & Observances",
    objective: "Hand over permanent homes to families displaced by Cyclone Titli.",
    whoBenefited: "8 displaced families in Saabakota and Pudilanka",
    keyActivities: ["Home handover", "Community hall inauguration at Boyinadhaveedhi", "Free medical camp"],
    impact: [{ label: "Families housed", value: 8 }],
    relatedStory: "cyclone-titli-homes",
    status: "Completed",
  },
];

export const getEvent = (slug: string) => EVENTS.find((e) => e.slug === slug);

export const sortByDateDesc = <T extends { startDate: string }>(items: T[]) =>
  [...items].sort((a, b) => b.startDate.localeCompare(a.startDate));
