import type { Centre, CsrProject, GalleryItem, Leader, Partner, Report } from "@/types";

// Leadership, centres, projects and reports sourced from the existing website
// (saisujalasravanthi.in). Items marked TODO still need Trust input (§11).

export const LEADERSHIP: Leader[] = [
  {
    name: "Sri Madhusudan Sai",
    photo: "/images/leaders/sri-madhusudan-sai.webp",
    role: "Founder & Guiding Light",
    bio: "Under whose guidance the Trust was established in 2012. The One World One Family Mission he leads has set up institutes of excellence in nutrition, education and healthcare — all offered free of cost.",
  },
  {
    name: "Hari Umakanta Rao",
    photo: "/images/leaders/hari-umakanta-rao.webp",
    role: "Advisory Council",
    bio: "Retired Chief Engineer, Govt. of Telangana. Played a key role in Mission Bhagiratha and water supply projects in Medak and Mahbubnagar.",
  },
  {
    name: "K V Rambabu",
    photo: "/images/leaders/k-v-rambabu.webp",
    role: "Advisory Council",
    bio: "Founder and Managing Director of Pulse Pharmaceuticals (est. 1997), with over 40 years in the pharmaceutical industry.",
  },
  {
    name: "G. Dharma Data",
    photo: "/images/leaders/g-dharma-data.webp",
    role: "Advisory Council",
    bio: "Retired Director (FAC), Drugs Control Administration, Andhra Pradesh; now Adjunct Professor and Regulatory Advisor.",
  },
  {
    name: "Kalyan Chakravarthy Konduri",
    photo: "/images/leaders/kalyan-chakravarthy-konduri.webp",
    role: "Advisory Council",
    bio: "Co-Founder and Executive Director, TechAcme Services Pvt Ltd; associated with the mission for 20 years.",
  },
  {
    name: "Veeramachaneni SivaPrasad",
    photo: "/images/leaders/veeramachaneni-sivaprasad.webp",
    role: "Advisory Council",
    bio: "Founder of Saiteja Constructions; funds free schools and hostels.",
  },
  {
    name: "R. Venkateswara Rao",
    photo: "/images/leaders/r-venkateswara-rao.webp",
    role: "Advisory Council",
    bio: "Retired Engineer-in-Chief, Panchayat Raj Engineering Dept. after 39 years of service; Technical Advisor to APMSIDC for 16 new medical colleges.",
  },
  {
    name: "Rayavarapu Kondala Rao",
    photo: "/images/leaders/rayavarapu-kondala-rao.webp",
    role: "Advisory Council",
    bio: "Retired Engineer-in-Chief, Panchayat Raj & Rural Water Supply (1998); led the Sri Sathya Sai Water Supply Projects in Anantapur, Medak, Mahbubnagar and West Godavari.",
  },
]; // TODO: Board of Trustees (heading exists on the old site but names are not listed)

export const MILESTONES = [
  { year: "2012", title: "Trust established", text: "Sri Sathya Sai Sujala Sravanthi Trust founded in Hyderabad under the guidance of Sri Madhusudan Sai, starting with clean drinking water, sanitation and rural infrastructure." },
  { year: "—", title: "Timmayapalli transformation", text: "Underground drainage for 100+ homes, school toilets for 80+ children, and defluoridation plants and borewells in Timmayapalli and Yenigandlathanda." },
  { year: "2018", title: "Cyclone Titli rehabilitation", text: "Permanent homes for 8 displaced families in Saabakota and Pudilanka, and a community hall in Boyinadhaveedhi, coastal Andhra Pradesh." },
  { year: "2020–21", title: "COVID-19 relief (past initiative)", text: "10,000+ grocery kits in Sangareddy, Bhongir and Hyderabad, financial aid for treatment, and a temporary call centre helping patients find hospital beds." },
  { year: "—", title: "Pediatric Heart Screening Centre", text: "Partnership with Niloufer Hospital begins — 6,000+ children screened and 150+ surgeries over four years." },
  { year: "—", title: "Aushadhalayam (Pharma Bank)", text: "₹65 lakh of medicines channelled from pharma CSR to 5 free-care centres." },
  { year: "Today", title: "Healthcare at scale", text: "Sai Swasthya centres across Andhra Pradesh and Telangana, Sai Aarogya Hospital in Bapatla, monthly outreach camps, education and skills programmes." },
]; // TODO: confirm years marked "—"

const swasthya = (town: string, state: Centre["state"]): Centre => ({ name: `Sai Swasthya — ${town}`, type: "Sai Swasthya Centre", address: town, state });

export const CENTRES: Centre[] = [
  { name: "Head Office", type: "Office", address: "#8-2-601/P/1, Panchavathi Colony, Road No. 10, Banjara Hills, Hyderabad – 500034", state: "Telangana" },
  { name: "Pediatric Heart Screening Centre", type: "Screening Centre", address: "Niloufer Hospital, Hyderabad", state: "Telangana" },
  ...["Jagtial", "Kagaznagar", "Kondapaka", "Laxetipeta", "Mahbubnagar", "Nagarkurnool", "Peddakonduru", "Sailingi"].map((t) => swasthya(t, "Telangana")),
  { name: "Sai Aarogya Multi-Speciality Hospital", type: "Hospital", address: "Bapatla", state: "Andhra Pradesh" },
  ...["Cherukupalli", "Kajipalem", "Karlapalem", "Madanapalli", "Munipalli", "Nagaram", "Nizampet", "Palasa", "Pulivendala", "Visakhapatnam"].map((t) =>
    swasthya(t, "Andhra Pradesh"),
  ),
]; // TODO: full addresses + lat/long for the map

/** Other states where the wider Sai Swasthya network operates (existing site). */
export const NETWORK_OTHER_STATES = ["Bihar", "Jharkhand", "Karnataka", "Odisha", "Punjab", "Tamil Nadu", "West Bengal"];

export const CSR_PROJECTS: CsrProject[] = [
  {
    name: "Adopt a Sai Swasthya Wellness Centre",
    image: "/images/site/sai-swasthya-centre-1.webp",
    location: "Rural Andhra Pradesh / Telangana",
    theme: "Preventive Healthcare",
    objective: "Fund a free primary diagnostic centre: preventive diagnostics, consultations, telehealth and free medicines.",
    beneficiaries: "Surrounding villages of one taluk",
    duration: "12 months (renewable)",
    budget: "On request",
    expectedImpact: "Early diagnosis of diabetes, hypertension and other conditions; local employment for trained young women.",
    model: "Run under the Sri Madhusudan Sai Institute of Medical Sciences outreach programme",
  },
  {
    name: "Pediatric Heart Screening & Surgery",
    image: "/images/site/pediatric-echo-screening.webp",
    location: "Niloufer Hospital, Hyderabad",
    theme: "Healthcare",
    objective: "Sponsor cardiac screening and surgery gap funding for children with heart conditions.",
    beneficiaries: "Children from low-income families",
    duration: "Ongoing",
    budget: "Per surgery / per screening drive — on request",
    expectedImpact: "Lives saved through early detection and free surgery (6,000+ screened, 150+ surgeries to date).",
    model: "Screening by paediatric cardiologists; surgeries at partner hospitals",
  },
  {
    name: "Aushadhalayam — Pharma CSR",
    image: "/images/site/aushadhalayam-pharmacy.webp",
    location: "Free-care centres across India",
    theme: "Healthcare",
    objective: "Donate medicines or supply at manufacturing cost to cut the ₹3+ crore monthly medicine bill by 40%.",
    beneficiaries: "Patients of free hospitals and wellness centres",
    duration: "Annual commitment",
    budget: "In-kind or cost-price supply",
    expectedImpact: "Every rupee saved funds more free care and surgeries.",
    model: "Licensed, Drug Control compliant, ERP-tracked distribution",
  },
  {
    name: "Village Water & Sanitation",
    image: "/images/site/drinking-water-tank.webp",
    location: "Mahbubnagar district, Telangana",
    theme: "Water & Sanitation",
    objective: "Replicate the Timmayapalli model: underground drainage, school toilets, borewells and defluoridation.",
    beneficiaries: "One village (100+ households)",
    duration: "6–12 months",
    budget: "Reference: ₹1 million for Timmayapalli",
    expectedImpact: "Safe water, sanitation for every home, school toilets for children.",
    model: "Community-led with Sai Youth volunteers",
  },
];

// Only partners with written permission are shown (§5.9). These logos are
// already published on the existing website; confirm permission before launch.
const partner = (name: string, file: string): Partner => ({ name, logo: `/images/partners/${file}.png`, permissionGranted: true });

export const PARTNERS: Partner[] = [
  partner("NATCO Pharma", "natco"),
  partner("Pulse Pharmaceuticals", "pulse-pharmaceuticals"),
  partner("Serin", "serin"),
  partner("Sunrise International Labs", "sunrise-international-labs"),
  partner("Island Veer Chemie", "island-veer-chemie"),
  partner("Das Seva Samiti", "das-seva-samiti"),
  partner("NSL Power", "nsl-power"),
  partner("Bluepal", "bluepal"),
  partner("MVS Acmei", "mvs-acme"),
  partner("Surya Global Hospitals", "surya-global-hospitals"),
  partner("Easwaramma Prerana", "easwaramma-prerana"),
  partner("Sagi Seed Multipliers", "sagi-seed-multipliers"),
  partner("Premier Energies", "premier-energies"),
  partner("Rakshit", "rakshit"),
  partner("Sainor", "sainor"),
  partner("Chromo Laboratories", "chromo-laboratories"),
  partner("Vanguard", "vanguard"),
  partner("Evertogen", "evertogen"),
  partner("Kernex Microsystems", "kernex-microsystems"),
  partner("Med Manor Organics", "med-manor-organics"),
  partner("Vital Therapeutics", "vital-therapeutics"),
];

const UGD = "https://www.saisujalasravanthi.in/_files/ugd";

export const REPORTS: Report[] = [
  { title: "FCRA Annual Return 2023–24", type: "Annual Report", year: "2023–24", file: `${UGD}/6ed857_18a828ef5aae42748d6851cf7b17d609.pdf` },
  { title: "FCRA Grant Document", type: "Certificate", year: "—", file: `${UGD}/6ed857_f664e996f28b42569fabf47ee5121be7.pdf` },
  { title: "Annual Report 2025–26", type: "Annual Report", year: "2025–26", file: "#" },
  { title: "Audited Financial Statements 2025–26", type: "Financial Report", year: "2025–26", file: "#" },
  { title: "Audited Financial Statements 2024–25", type: "Financial Report", year: "2024–25", file: "#" },
  { title: "CSR Impact Report", type: "CSR Report", year: "2025–26", file: "#" },
]; // TODO: replace "#" with real PDFs

// Photographs from the existing website. Dates are approximate (TODO: confirm
// with the Trust's archive) and drive the year filter.
const g = (
  id: string,
  file: string,
  alt: string,
  caption: string,
  group: GalleryItem["group"],
  subCategory: string,
  programme: GalleryItem["programme"],
  location: string,
  date: string,
): GalleryItem => ({ id, src: `/images/site/${file}.webp`, alt, caption, group, subCategory, programme, location, date });

export const GALLERY: GalleryItem[] = [
  g("g1", "pediatric-heart-screening-niloufer", "Paediatric cardiologists examining an infant at Niloufer Hospital", "Pediatric heart screening at Niloufer Hospital", "Healthcare", "Cardiac Screening", "healthcare", "Hyderabad", "2025-10-04"),
  g("g2", "pediatric-echo-screening", "Doctor performing an echocardiogram on a child", "Echocardiogram screening", "Healthcare", "Cardiac Screening", "healthcare", "Hyderabad", "2025-09-12"),
  g("g3", "infant-cardiac-care", "Doctor attending to an infant in a hospital ward", "Post-surgery infant care", "Healthcare", "Cardiac Screening", "healthcare", "Hyderabad", "2025-07-20"),
  g("g4", "sai-swasthya-centre-1", "Sai Swasthya wellness centre building", "Sai Swasthya wellness centre", "Healthcare", "Sai Swasthya", "healthcare", "Andhra Pradesh", "2025-08-12"),
  g("g5", "sai-swasthya-centre-2", "Sai Swasthya centre decorated for its opening", "Sai Swasthya centre opening", "Healthcare", "Sai Swasthya", "healthcare", "Telangana", "2025-06-02"),
  g("g6", "sai-swasthya-centre-3", "Inside a Sai Swasthya wellness centre", "Sai Swasthya consultation room", "Healthcare", "Sai Swasthya", "healthcare", "Telangana", "2025-06-02"),
  g("g7", "sai-aarogya-hospital-bapatla", "Sai Aarogya Multi-Speciality Hospital campus, Bapatla", "Sai Aarogya Hospital, Bapatla", "Healthcare", "Hospital", "healthcare", "Bapatla", "2025-09-01"),
  g("g8", "outreach-medical-camp", "Doctors examining villagers at a monthly outreach camp", "Monthly outreach medical camp", "Healthcare", "Medical Camps", "healthcare", "Mahbubnagar", "2024-06-14"),
  g("g9", "outreach-camp-consultations", "Consultations and eye check-ups at an outreach camp", "Outreach camp consultations", "Healthcare", "Medical Camps", "healthcare", "Mahbubnagar", "2024-09-21"),
  g("g10", "aushadhalayam-distribution-1", "Volunteers distributing medicines at a camp", "Free medicine distribution", "CSR", "CSR Activities", "healthcare", "Telangana", "2025-03-09"),
  g("g11", "aushadhalayam-pharmacy", "Pharmacy shelves stocked by the Aushadhalayam pharma bank", "Aushadhalayam-stocked pharmacy", "CSR", "CSR Activities", "healthcare", "Andhra Pradesh", "2025-03-09"),
  g("g12", "aushadhalayam-medicine-stock", "Boxes of donated medicines at a hospital", "Pharma CSR medicine donation", "CSR", "Partner Engagements", "healthcare", "Andhra Pradesh", "2025-02-15"),
  g("g13", "timmayapalli-underground-drainage", "Villagers laying underground drainage pipes", "Underground drainage, Timmayapalli", "Rural Development", "Sanitation", "rural-development", "Timmayapalli", "2016-03-20"),
  g("g14", "drinking-water-tank", "Villagers installing a drinking water tank", "Safe drinking water installation", "Rural Development", "Drinking Water", "rural-development", "Timmayapalli", "2016-05-22"),
  g("g15", "rural-sanitation-toilets", "Household toilets built in the village", "Household and school toilets", "Rural Development", "Sanitation", "rural-development", "Timmayapalli", "2016-08-10"),
  g("g16", "cyclone-titli-house", "Permanent home built for a family after Cyclone Titli", "Home built after Cyclone Titli", "Rural Development", "Housing", "relief-emergency-support", "Pudilanka", "2018-12-01"),
  g("g17", "girls-classroom", "Girl students in a classroom", "Girl students at Kondapaka", "Education", "Students", "education", "Kondapaka", "2024-07-15"),
  g("g18", "prashanti-niketanam-campus", "Sri Sathya Sai Prashanti Niketanam College campus", "Prashanti Niketanam College campus", "Education", "Education Programmes", "education", "Kondapaka", "2024-07-15"),
  g("g19", "reprogramming-lives-session", "Youth attending a Re-Programming Lives training session", "Re-Programming Lives session", "Education", "Education Programmes", "community-empowerment", "Hyderabad", "2024-11-10"),
  g("g20", "reprogramming-lives-graduates", "Re-Programming Lives participants with certificates", "Re-Programming Lives graduates", "Events", "Annual Events", "community-empowerment", "Hyderabad", "2024-12-05"),
  g("g21", "community-women", "Village women at a community programme", "Women & child welfare programme", "Events", "Workshops", "community-empowerment", "Telangana", "2024-08-10"),
  g("g22", "covid-relief-grocery-kits", "Families receiving grocery kits during COVID-19", "COVID-19 grocery kit distribution", "Events", "Special Programmes", "relief-emergency-support", "Sangareddy", "2020-05-10"),
];