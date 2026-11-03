import type { Programme, ProgrammeCategory, ProgrammeCategorySlug } from "@/types";

// Content sourced from the existing website (saisujalasravanthi.in), regrouped
// into the five programme categories of §5.3.

export const PROGRAMME_CATEGORIES: ProgrammeCategory[] = [
  {
    slug: "healthcare",
    image: "/images/site/pediatric-heart-screening-niloufer.webp",
    name: "Healthcare",
    pageTitle: "Healthcare for Underserved Communities",
    summary:
      "Free primary care at Sai Swasthya centres, free secondary care at Sai Aarogya Hospital, monthly outreach camps, pediatric heart screening, surgery gap funding and a pharma bank — all completely free of cost.",
    icon: "HeartPulse",
    ctas: [
      { label: "Find a Healthcare Centre", to: "/about-us/our-network/" },
      { label: "Support Healthcare Services", to: "/donate/" },
    ],
  },
  {
    slug: "rural-development",
    image: "/images/site/timmayapalli-underground-drainage.webp",
    name: "Rural Development",
    pageTitle: "Rural Development & Infrastructure",
    summary:
      "Underground drainage, school and household toilets, borewells and defluoridation plants that transform village health from the ground up.",
    icon: "Droplets",
    ctas: [{ label: "Partner on Rural Projects", to: "/csr-partnerships/" }],
  },
  {
    slug: "education",
    image: "/images/site/girls-classroom.webp",
    name: "Education",
    pageTitle: "Education",
    summary:
      "Supporting girl students and value-based education that nurtures both spiritual and intellectual growth in rural children.",
    icon: "GraduationCap",
    ctas: [{ label: "Support Education", to: "/donate/" }],
  },
  {
    slug: "community-empowerment",
    image: "/images/site/community-women.webp",
    name: "Community Empowerment",
    pageTitle: "Community Empowerment",
    summary:
      "Women & child welfare, de-addiction counselling, financial literacy, BalVikas for children and Re-Programming Lives skills training for rural youth.",
    icon: "Users",
    ctas: [{ label: "Volunteer With Us", to: "/get-involved/volunteer/" }],
  },
  {
    slug: "relief-emergency-support",
    image: "/images/site/cyclone-titli-house.webp",
    name: "Relief & Emergency Support",
    pageTitle: "Relief & Emergency Support",
    summary: "Rebuilding homes and lives after disasters such as Cyclone Titli in coastal Andhra Pradesh.",
    icon: "LifeBuoy",
    ctas: [{ label: "Support Relief Work", to: "/donate/" }],
  },
];

export const getCategory = (slug: string) => PROGRAMME_CATEGORIES.find((c) => c.slug === slug);

export const PROGRAMMES: Programme[] = [
  {
    slug: "sai-swasthya",
    image: "/images/site/sai-swasthya-centre-2.webp",
    name: "Sai Swasthya Wellness Centres",
    category: "healthcare",
    icon: "Stethoscope",
    active: true,
    summary:
      "Free primary diagnostic healthcare centres in rural areas — preventive diagnostics, consultations, telehealth and free medicines.",
    problem:
      "Rural families often live far from a doctor and only seek care once illness becomes serious. Preventive healthcare that provides early diagnosis is the need of the hour.",
    solution:
      "Sai Swasthya Wellness Centres are set up under the rural community outreach programme of Sri Madhusudan Sai Institute of Medical Sciences and Research. They provide early diagnosis and dispense medicines free of charge, and refer patients to tertiary care centres and allied hospitals. The vision: 6,000 centres — one in every taluk — within ten years, each training local school-leavers (with priority for girls) to assist patients, creating rural employment towards a Swastha Bharath and Samruddha Bharath.",
    locations: [
      "Andhra Pradesh: Cherukupalli, Kajipalem, Karlapalem, Madanapalli, Munipalli, Nagaram, Nizampet, Palasa, Pulivendala, Visakhapatnam",
      "Telangana: Jagtial, Kagaznagar, Kondapaka, Laxetipeta, Mahbubnagar, Nagarkurnool, Peddakonduru, Sailingi",
    ],
    whoWeServe: ["Rural families", "Patients with diabetes and hypertension", "Women, children and the elderly"],
    services: ["Preventive diagnostics", "Outpatient consultations", "Telehealth consultations", "Rural outreach camps", "Free medicines", "Referrals to tertiary care"],
    impact: [
      { label: "Centres in AP & Telangana", value: "18" },
      { label: "Target centres nationwide (10 yrs)", value: "6,000" },
    ],
  },
  {
    slug: "sai-aarogya-hospital",
    image: "/images/site/sai-aarogya-hospital-bapatla.webp",
    name: "Sai Aarogya Multi-Speciality Hospital",
    category: "healthcare",
    icon: "Hospital",
    active: true,
    summary: "Free secondary care in Bapatla, Andhra Pradesh — complementing the primary care of Sai Swasthya centres.",
    problem: "Specialist and inpatient care is out of reach for many rural families, both in distance and cost.",
    solution:
      "Sai Aarogya provides secondary care to rural communities in 30–50 bedded facilities, completely free of charge and regardless of caste, creed, religion or economic status. It complements the Sai Swasthya Wellness Centres so patients move seamlessly from primary to secondary care.",
    locations: ["Bapatla, Andhra Pradesh"],
    whoWeServe: ["Rural patients referred from Sai Swasthya centres", "Anyone in need — regardless of caste, creed, religion or economic status"],
    services: ["Orthopaedics", "Ophthalmology", "Paediatrics", "Dentistry", "Preventive care for hypertension & diabetes", "Inpatient care"],
    impact: [{ label: "Bedded facility", value: "30–50 beds" }],
  },
  {
    slug: "medical-camps",
    image: "/images/site/outreach-medical-camp.webp",
    name: "Monthly Outreach Medical Camps",
    category: "healthcare",
    icon: "Tent",
    active: true,
    summary: "Monthly specialist camps — dental, gynaecology, eye, orthopaedic, dermatology, general medicine and diabetes screening.",
    problem: "A door-to-door survey found that eye, dental and orthopaedic problems were the main health concerns in the villages we serve.",
    solution:
      "Free monthly outreach camps run with leading institutions — including SVS Dental College, Mahbubnagar and Sadhuram Hospitals for eye care. Patients who need further treatment are taken to Hyderabad, and health cards record treatment history to support ongoing care.",
    locations: ["Rural Telangana"],
    whoWeServe: ["Village communities", "Women (gynaecology & hygiene workshops)", "Patients needing follow-up care"],
    services: ["Dental", "Gynaecology", "Ophthalmology", "Orthopaedics", "Dermatology", "General medicine", "Diabetes screening", "Health cards & follow-up"],
    impact: [{ label: "Camp frequency", value: "Monthly" }],
  },
  {
    slug: "pediatric-heart-screening",
    image: "/images/site/pediatric-heart-screening-niloufer.webp",
    name: "Pediatric Heart Screening Centre",
    category: "healthcare",
    icon: "Baby",
    active: true,
    summary: "Transforming little hearts, one step at a time — free cardiac screening and surgery for children, with Niloufer Hospital.",
    problem: "Congenital heart conditions in children often go undetected until they become life-threatening, and treatment is unaffordable for poor families.",
    solution:
      "For four years, the Sri Sathya Sai Pediatric Heart Screening Centre has partnered with Niloufer Hospital, Hyderabad. Paediatric cardiologists screen children and surgical interventions are provided free of cost, supported by doctors, volunteers and donors.",
    locations: ["Niloufer Hospital, Hyderabad"],
    whoWeServe: ["Children with suspected cardiac conditions", "Families who cannot afford treatment"],
    services: ["Cardiac screening", "Paediatric cardiology consultation", "Free surgical intervention", "Surgery gap funding"],
    impact: [
      { label: "Children screened", value: "6,000+" },
      { label: "Surgeries performed", value: "150+" },
      { label: "Volunteers", value: "50" },
      { label: "Paediatric cardiologists", value: "5" },
    ],
  },
  {
    slug: "surgery-support",
    image: "/images/site/infant-surgery-support.webp",
    name: "Surgeries Gap Funding Support",
    category: "healthcare",
    icon: "Scissors",
    active: true,
    summary: "Bridging the funding gap so children identified in our cardiac screening programme get the surgery they need.",
    problem: "Even when a child's heart condition is diagnosed, families often cannot cover the full cost of surgery and post-operative care.",
    solution:
      "Cases identified during our ongoing cardiac screening programme at Niloufer Hospital receive gap funding for surgery and infection-control care at hospitals such as Nice Hospital and KIMS, Hyderabad.",
    locations: ["Hyderabad"],
    whoWeServe: ["Children identified through cardiac screening", "Families from villages such as Thimayyapalli"],
    services: ["Case assessment", "Surgery gap funding", "Infection-control care support"],
    impact: [{ label: "Hospitals involved", value: "Niloufer · Nice · KIMS" }],
  },
  {
    slug: "aushadhalayam",
    image: "/images/site/aushadhalayam-pharmacy.webp",
    name: "Sri Sathya Sai Aushadhalayam (Pharma Bank)",
    category: "healthcare",
    icon: "Pill",
    active: true,
    summary: "Channelling pharmaceutical CSR into free medicines and disposables for our free-care hospitals and centres.",
    problem: "Medicines and disposables are a major cost for the free-care network — currently over ₹3 crore per month.",
    solution:
      "Aushadhalayam partners with pharmaceutical companies to use their CSR — as direct donations or procurement at manufacturing cost — to supply Sri Sathya Sai Sanjeevani Hospitals, Sai Aarogya and Sai Swasthya centres. It is licensed to procure and distribute medicines without commercial intent, follows Drug Control Department regulations, and tracks every item through an ERP system. Target: at least a 40% annual reduction in these costs.",
    locations: ["Hyderabad (operations)", "Free-care centres across India"],
    whoWeServe: ["Patients of free hospitals and wellness centres"],
    services: ["Medicine donations", "Procurement at manufacturing cost", "ERP-tracked distribution"],
    impact: [
      { label: "Medicines supplied", value: "₹65 lakh" },
      { label: "Centres supplied", value: "5" },
      { label: "Beneficiaries", value: "800+" },
      { label: "Surgeries facilitated", value: "30" },
    ],
  },
  {
    slug: "water-sanitation",
    image: "/images/site/drinking-water-tank.webp",
    name: "Drinking Water, Sanitation & Defluoridation",
    category: "rural-development",
    icon: "Droplets",
    active: true,
    summary: "Underground drainage, school and household toilets, borewells and defluoridation plants — the Timmayapalli model.",
    problem: "Open drains, lack of toilets and fluoride-contaminated water cause disease and keep children — especially girls — out of school.",
    solution:
      "In Timmayapalli village, Mahbubnagar district, Sai Youth and villagers built a permanent underground drainage system and school toilets, and encouraged 95% of households to build their own toilets. Defluoridation plants and borewells now provide safe drinking water in Timmayapalli and Yenigandlathanda.",
    locations: ["Timmayapalli, Mahbubnagar district", "Yenigandlathanda"],
    whoWeServe: ["Village households", "School children", "Farmers"],
    services: ["Underground drainage", "School toilets", "Household toilets", "Borewells", "Defluoridation plants", "Agricultural training"],
    impact: [
      { label: "Homes on underground drainage", value: "100+" },
      { label: "Children with school toilets", value: "80+" },
      { label: "Households with toilets", value: "95%" },
      { label: "Farmers trained", value: "200+" },
    ],
  },
  {
    slug: "girl-child-education",
    image: "/images/site/girls-classroom.webp",
    name: "Girl Child Education",
    category: "education",
    icon: "GraduationCap",
    active: true,
    summary: "Supporting girls at Sri Sathya Sai Prashanti Niketanam College, Kondapaka — a free, fully residential campus for girls.",
    problem: "Girls in rural areas often stop studying after school because of cost and distance.",
    solution:
      "The Trust supported the education of 10 girls at Sri Sathya Sai Prashanti Niketanam College, Kondapaka, Siddipet — which provides free education from Intermediate to College level on a fully residential campus focused on the all-round development of the girl child.",
    locations: ["Kondapaka, Siddipet, Telangana"],
    whoWeServe: ["Rural girl students"],
    services: ["Education support", "Residential learning", "All-round development"],
    impact: [{ label: "Girls supported", value: "10" }],
  },
  {
    slug: "value-based-education",
    image: "/images/free/rural-classroom.webp",
    name: "Value-Based Education",
    category: "education",
    icon: "Sprout",
    active: true,
    summary: "Education that fuses spiritual and intellectual growth, with Sri Sathya Sai Loka Seva Gurukulam.",
    problem: "Rural children lack access to quality education that also builds character.",
    solution:
      "The Trust collaborates with Sri Sathya Sai Loka Seva Gurukulam on values-based education for rural students — part of a wider mission network offering free education, healthcare and nutrition (with Sri Sathya Sai Annapoorna Trust).",
    locations: ["Karnataka, Telangana and Tamil Nadu (mission network)"],
    whoWeServe: ["Rural boys and girls"],
    services: ["Free values-based education", "Free nutrition", "Free healthcare"],
    impact: [
      { label: "Students (mission network)", value: "~5,000" },
      { label: "Institutions (mission network)", value: "38" },
    ],
  },
  {
    slug: "women-child-welfare",
    image: "/images/site/community-women.webp",
    name: "Women & Child Welfare",
    category: "community-empowerment",
    icon: "Users",
    active: true,
    summary: "De-addiction counselling, early-marriage awareness, hygiene workshops, financial literacy and BalVikas.",
    problem: "Alcoholism, early marriage, poor hygiene and low financial awareness hold rural families back.",
    solution:
      "Alongside our outreach camps: one-on-one and group counselling that has helped many women quit drinking; awareness on the health risks of child marriage; hygiene workshops led by gynaecologist Dr. Sailaja; introductions to savings and government financial schemes; and BalVikas sessions on human values, devotional singing and moral stories for children.",
    locations: ["Outreach camp villages, Telangana"],
    whoWeServe: ["Women", "Children", "Families affected by alcohol"],
    services: ["Alcohol de-addiction", "Early marriage awareness", "Hygiene education", "Financial literacy", "BalVikas"],
    impact: [{ label: "Children in BalVikas", value: "80+" }],
  },
  {
    slug: "reprogramming-lives",
    image: "/images/site/reprogramming-lives-graduates.webp",
    name: "Sri Sathya Sai Re-Programming Lives",
    category: "community-empowerment",
    icon: "Sprout",
    active: true,
    summary: "60–100 day skills programmes that make rural youth employable and encourage a value-based life.",
    problem: "Job-seeking rural youth and recent graduates lack the skills industry needs.",
    solution:
      "A curriculum designed by industry experts to close skill gaps — soft skills, communication, analytical skills in finance and banking, and software-based technical skills — taught by subject-matter experts from industry over 60 to 100 days.",
    locations: ["Rural areas"],
    whoWeServe: ["Unemployed and job-seeking youth", "Students who have recently left college"],
    services: ["Soft skills", "Communication skills", "Finance & banking analytics", "Software skills"],
    impact: [{ label: "Programme length", value: "60–100 days" }],
  },
  {
    slug: "cyclone-titli-rehabilitation",
    image: "/images/site/cyclone-titli-house.webp",
    name: "Cyclone Titli Rehabilitation",
    category: "relief-emergency-support",
    icon: "LifeBuoy",
    active: true,
    summary: "Permanent homes and a community hall for families displaced by Cyclone Titli (2018) in coastal Andhra Pradesh.",
    problem: "Cyclone Titli affected 8 million people in coastal Andhra Pradesh in 2018, leaving many families without homes.",
    solution:
      "The Trust built permanent homes for displaced families in Saabakota and Pudilanka (Srikakulam district), and a community hall in Boyinadhaveedhi that now hosts regular free medical camps.",
    locations: ["Saabakota and Pudilanka, Srikakulam district, Andhra Pradesh", "Boyinadhaveedhi"],
    whoWeServe: ["Families displaced by the cyclone"],
    services: ["Permanent housing", "Community hall", "Free medical camps"],
    impact: [
      { label: "Families given permanent homes", value: "8" },
      { label: "Project cost", value: "₹1.7 million" },
    ],
  },
  {
    slug: "covid-relief",
    image: "/images/site/covid-relief-grocery-kits.webp",
    name: "COVID-19 Relief Work",
    category: "relief-emergency-support",
    icon: "ShieldPlus",
    active: false,
    summary: "10,000+ grocery kits, treatment assistance and a bed-finding call centre during the pandemic (past initiative).",
    problem: "",
    solution: "",
    locations: ["Sangareddy", "Bhongir", "Hyderabad"],
    whoWeServe: [],
    services: [],
    impact: [],
  },
];

export const programmesIn = (category: ProgrammeCategorySlug) =>
  PROGRAMMES.filter((p) => p.category === category && p.active);

export const getProgramme = (category: string, slug: string) =>
  PROGRAMMES.find((p) => p.category === category && p.slug === slug && p.active);
