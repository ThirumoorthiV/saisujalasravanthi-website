import type { ImpactMetric, YearlyImpact } from "@/types";

// Single source of truth for every impact figure on the site (§5.10) — the
// homepage shows the first four. Figures come from the existing website or the
// review deck; each needs Trust confirmation of period and as-of date.
const WEBSITE = "Existing website, saisujalasravanthi.in";

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    id: "phcs",
    label: "Sai Swasthya Centres",
    value: 18,
    definition: "Sai Swasthya primary health / wellness centres listed in Andhra Pradesh (10) and Telangana (8).",
    period: "Current",
    asOf: "Pending confirmation",
    source: `${WEBSITE} — centre list. Review deck also quotes 22.`,
    verified: false,
  },
  {
    id: "screenings",
    label: "Children Screened for Heart Disease",
    value: 6000,
    suffix: "+",
    definition: "Children screened by the Pediatric Heart Screening Centre at Niloufer Hospital.",
    period: "Cumulative, 4-year partnership",
    asOf: "Pending confirmation",
    source: `${WEBSITE} — Pediatric Heart Screening page`,
    verified: false,
  },
  {
    id: "surgeries",
    label: "Pediatric Heart Surgeries",
    value: 150,
    suffix: "+",
    definition: "Surgeries performed for children identified through cardiac screening.",
    period: "Cumulative, 4-year partnership",
    asOf: "Pending confirmation",
    source: `${WEBSITE} — Pediatric Heart Screening page`,
    verified: false,
  },
  {
    id: "outpatients",
    label: "Outpatients",
    value: 60000,
    suffix: "+",
    definition: "Outpatient consultations across centres and camps.",
    period: "To be confirmed",
    asOf: "Pending confirmation",
    source: "Website review deck (slide 5)",
    verified: false,
  },
  {
    id: "inpatients",
    label: "Inpatient Services",
    value: 1000,
    suffix: "+",
    definition: "Inpatient admissions at Sai Aarogya Hospital.",
    period: "To be confirmed",
    asOf: "Pending confirmation",
    source: "Website review deck (slide 5)",
    verified: false,
  },
  {
    id: "medicines",
    label: "Worth of Medicines Supplied",
    value: 65,
    prefix: "₹",
    suffix: " lakh",
    definition: "Medicines supplied free by Aushadhalayam (Pharma Bank) to 5 free-care centres.",
    period: "Cumulative since launch",
    asOf: "Pending confirmation",
    source: `${WEBSITE} — Aushadhalayam page`,
    verified: false,
  },
  {
    id: "homes",
    label: "Homes on Underground Drainage",
    value: 100,
    suffix: "+",
    definition: "Homes connected to the permanent underground drainage system in Timmayapalli, Mahbubnagar.",
    period: "Project total",
    asOf: "Pending confirmation",
    source: `${WEBSITE} — Rural Development page`,
    verified: false,
  },
  {
    id: "families-housed",
    label: "Families Given Permanent Homes",
    value: 8,
    definition: "Families displaced by Cyclone Titli (2018) given permanent homes in Saabakota and Pudilanka, AP.",
    period: "2018 onwards",
    asOf: "Pending confirmation",
    source: `${WEBSITE} — Rural Development page (homepage says 3 houses in Pudilanka)`,
    verified: false,
  },
];

// SAMPLE year-wise figures for layout and review only — replace with the
// Trust's confirmed numbers (§11) before launch.
const YEAR_LABELS = [
  "Patients served",
  "Medical camps",
  "Health screenings",
  "Surgeries supported",
  "Villages reached",
  "Students supported",
  "CSR projects completed",
  "Volunteers engaged",
];

// Each metric follows its own pattern so the trends read differently.
const SAMPLE_YEARS: Record<number, number[]> = {
  2023: [38500, 96, 12400, 310, 140, 1850, 6, 420],
  2024: [46200, 118, 13100, 385, 205, 1920, 9, 560],
  2025: [53900, 112, 19300, 452, 228, 2710, 7, 690],
  2026: [41800, 94, 16200, 338, 236, 2380, 8, 610],
};

/** Years still in progress — shown as year-to-date and never compared with a full year. */
const PARTIAL_YEARS = new Set([2026]);

export const YEARLY_IMPACT: YearlyImpact[] = Object.entries(SAMPLE_YEARS).map(([year, values]) => ({
  year: Number(year),
  partial: PARTIAL_YEARS.has(Number(year)),
  metrics: YEAR_LABELS.map((label, i) => ({ label, value: values[i] })),
}));
