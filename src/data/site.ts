// Site-wide settings. Values marked TODO must be supplied by the Trust (§11).

// Contact details, name and motto taken from the existing site (saisujalasravanthi.in).
export const SITE = {
  name: "Sai Sujala Sravanthi",
  legalName: "Sri Sathya Sai Sujala Sravanthi Trust",
  founded: 2012,
  url: "https://www.saisujalasravanthi.in",
  tagline: "Serving Communities. Transforming Lives. Zero Cost",
  motto: "Love All Serve All",
  submotto: "Help Ever Hurt Never",
  address: "#8-2-601/P/1, Panchavathi Colony, Road No. 10, Banjara Hills, Hyderabad – 500034",
  phones: ["+91 965 2002 767", "+91 630 5167 593"],
  emails: ["info@saisujalasravanthi.in", "saisujalasravanthi@gmail.com"],
  whatsapp: null as string | null, // TODO: confirm if an official WhatsApp exists (§14 Q4)
  registrationNote: "Sri Sathya Sai Sujala Sravanthi Trust, Hyderabad · Est. 2012 · FCRA Reg. No. 368140112",
  social: [
    { label: "Facebook", href: "https://www.facebook.com/saisujalasravanthi" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/saisujalasravanthitrust/" },
  ],
};

/** Donation details from saisujalasravanthi.in/donation. */
export const DONATION = {
  domesticUrl: "https://www.saiaarogya.hospital/donateus",
  qr: "/images/brand/donation-qr.png",
  receiptEmail: "info@saisujalasravanthi.in",
  fcra: {
    trustName: "Sri Sathya Sai Sujala Sravanthi Trust",
    registrationNo: "368140112",
    registrationDate: "30/09/2023",
    accountNo: "40371272305",
    ifsc: "SBIN0000691",
    swift: "SBININBB104",
    bank: "State Bank of India",
    branch: "New Delhi Main Branch – FCRA",
    bankAddress: "11, Sansad Marg, New Delhi – 110001",
  },
};

/**
 * Enquiry routing (§5.13). The existing site publishes only info@ and the Gmail
 * address, so every type routes to info@ until the Trust creates dedicated inboxes.
 */
export const ENQUIRY_INBOXES = {
  "General Enquiries": "info@saisujalasravanthi.in",
  "CSR Partnerships": "info@saisujalasravanthi.in",
  Volunteering: "info@saisujalasravanthi.in",
  "Healthcare Enquiries": "info@saisujalasravanthi.in",
  "Media & Press": "info@saisujalasravanthi.in",
} as const; // TODO: dedicated inboxes per enquiry type

export type EnquiryType = keyof typeof ENQUIRY_INBOXES;

export interface NavItem {
  label: string;
  to: string;
  children?: NavItem[];
}

// Main navigation and sub-menus exactly as specified in §4.2 / §4.3.
export const MAIN_NAV: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About Us",
    to: "/about-us/",
    children: [
      { label: "About the Trust", to: "/about-us/" },
      { label: "Vision & Mission", to: "/about-us/vision-mission/" },
      { label: "Our Journey", to: "/about-us/our-journey/" },
      { label: "Leadership", to: "/about-us/leadership/" },
      { label: "Our Network", to: "/about-us/our-network/" },
    ],
  },
  {
    label: "Our Programmes",
    to: "/programmes/",
    children: [
      {
        label: "Healthcare",
        to: "/programmes/healthcare/",
        children: [
          { label: "Sai Swasthya", to: "/programmes/healthcare/sai-swasthya/" },
          { label: "Sai Aarogya Hospital", to: "/programmes/healthcare/sai-aarogya-hospital/" },
          { label: "Medical Camps", to: "/programmes/healthcare/medical-camps/" },
          { label: "Pediatric Heart Screening", to: "/programmes/healthcare/pediatric-heart-screening/" },
          { label: "Surgery Support", to: "/programmes/healthcare/surgery-support/" },
          { label: "Aushadhalayam", to: "/programmes/healthcare/aushadhalayam/" },
        ],
      },
      { label: "Education", to: "/programmes/education/" },
      { label: "Rural Development", to: "/programmes/rural-development/" },
      { label: "Community Empowerment", to: "/programmes/community-empowerment/" },
      { label: "Relief & Emergency Support", to: "/programmes/relief-emergency-support/" },
    ],
  },
  {
    label: "Our Impact",
    to: "/impact/",
    children: [
      { label: "Impact at a Glance", to: "/impact/" },
      { label: "Impact Dashboard", to: "/impact/dashboard/" },
      { label: "Locations", to: "/impact/locations/" },
      { label: "Annual Reports", to: "/impact/annual-reports/" },
    ],
  },
  {
    label: "Stories & Updates",
    to: "/stories/",
    children: [
      { label: "Blog", to: "/stories/" },
      { label: "Events", to: "/events/" },
      { label: "Beneficiary Stories", to: "/stories/beneficiary-stories/" },
      { label: "Volunteer Stories", to: "/stories/volunteer-stories/" },
      { label: "Media & Press", to: "/stories/media-press/" },
    ],
  },
  {
    label: "Gallery",
    to: "/gallery/",
    children: [
      { label: "Healthcare", to: "/gallery/healthcare/" },
      { label: "Education", to: "/gallery/education/" },
      { label: "Rural Development", to: "/gallery/rural-development/" },
      { label: "CSR", to: "/gallery/csr/" },
      { label: "Events", to: "/gallery/events/" },
    ],
  },
  {
    label: "CSR Partnerships",
    to: "/csr-partnerships/",
    children: [
      { label: "Why Partner With Us", to: "/csr-partnerships/" },
      { label: "CSR Projects", to: "/csr-partnerships/csr-projects/" },
      { label: "CSR Impact", to: "/csr-partnerships/csr-impact/" },
      { label: "Our Partners", to: "/csr-partnerships/our-partners/" },
      { label: "CSR Enquiry", to: "/csr-partnerships/csr-enquiry/" },
    ],
  },
  {
    label: "Get Involved",
    to: "/get-involved/",
    children: [
      { label: "Volunteer", to: "/get-involved/volunteer/" },
      { label: "Medical Volunteer", to: "/get-involved/medical-volunteer/" },
      { label: "CSR Partnership", to: "/csr-partnerships/" },
      { label: "Support Our Work", to: "/donate/" },
    ],
  },
  {
    label: "Transparency",
    to: "/transparency/",
    children: [
      { label: "FCRA", to: "/transparency/fcra/" },
      { label: "Annual Reports", to: "/transparency/annual-reports/" },
      { label: "Financial Reports", to: "/transparency/financial-reports/" },
      { label: "Policies", to: "/transparency/policies/" },
    ],
  },
  { label: "Contact Us", to: "/contact-us/" },
];
