import { Navigate, type RouteObject } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AboutTrust, Leadership, OurJourney, OurNetwork, VisionMission } from "@/pages/About";
import Contact from "@/pages/Contact";
import { CsrEnquiry, CsrImpact, CsrPartners, CsrProjects, CsrWhy } from "@/pages/Csr";
import Donate from "@/pages/Donate";
import { EventDetail, EventsList } from "@/pages/Events";
import Gallery from "@/pages/Gallery";
import { ExpertisePage, GetInvolvedOverview, MedicalVolunteerPage, VolunteerPage } from "@/pages/GetInvolved";
import Home from "@/pages/Home";
import { ImpactDashboard, ImpactGlance, ImpactLocations, ImpactReports } from "@/pages/Impact";
import NotFound from "@/pages/NotFound";
import { PolicyPage } from "@/pages/Policy";
import { ProgrammeCategoryPage, ProgrammeDetail, ProgrammesOverview } from "@/pages/Programmes";
import { STORY_PAGES, StoriesList, StoryDetail } from "@/pages/Stories";
import { AnnualReportsPage, FcraPage, FinancialReportsPage, PoliciesPage, TransparencyOverview } from "@/pages/Transparency";

// URL structure follows §4.4 — every header sub-menu item is its own page.
// Legacy URLs from the old site are 301'd by the host (see vercel.json); the
// client-side fallbacks below catch any that slip through.
const LEGACY_URLS: Record<string, string> = {
  aboutus: "/about-us/",
  covid19reliefwork: "/about-us/our-journey/",
  "education-mission": "/programmes/education/",
  educationalactivities: "/programmes/education/girl-child-education/",
  programminglives: "/programmes/community-empowerment/reprogramming-lives/",
  pediatricheartscreeningcentre: "/programmes/healthcare/pediatric-heart-screening/",
  freemonthlycamp: "/programmes/healthcare/medical-camps/",
  saiaarogyamultispecialityhospital: "/programmes/healthcare/sai-aarogya-hospital/",
  "sai-swasthya-well-centers": "/programmes/healthcare/sai-swasthya/",
  saiswasthya: "/programmes/healthcare/sai-swasthya/",
  ruraldevelopment: "/programmes/rural-development/",
  rualinfrastructure: "/programmes/relief-emergency-support/cyclone-titli-rehabilitation/",
  aushadhalayam: "/programmes/healthcare/aushadhalayam/",
  surgeriesgapfundingsupport: "/programmes/healthcare/surgery-support/",
  csr: "/csr-partnerships/",
  "fcra-report": "/transparency/fcra/",
  contactus: "/contact-us/",
  donation: "/donate/",
  privacypolicy: "/privacy-policy/",
  termsandconditions: "/terms-and-conditions/",
  refundpolicy: "/refund-policy/",
};

// Shared by the browser router (main.tsx) and the build-time prerender (entry-server.tsx).
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      { path: "about-us", element: <AboutTrust /> },
      { path: "about-us/vision-mission", element: <VisionMission /> },
      { path: "about-us/our-journey", element: <OurJourney /> },
      { path: "about-us/leadership", element: <Leadership /> },
      { path: "about-us/our-network", element: <OurNetwork /> },

      { path: "programmes", element: <ProgrammesOverview /> },
      { path: "programmes/:category", element: <ProgrammeCategoryPage /> },
      { path: "programmes/:category/:slug", element: <ProgrammeDetail /> },

      { path: "impact", element: <ImpactGlance /> },
      { path: "impact/dashboard", element: <ImpactDashboard /> },
      { path: "impact/locations", element: <ImpactLocations /> },
      { path: "impact/annual-reports", element: <ImpactReports /> },

      { path: "stories", element: <StoriesList /> },
      ...Object.keys(STORY_PAGES).map((page) => ({ path: `stories/${page}`, element: <StoriesList key={page} page={page} /> })),
      { path: "stories/:slug", element: <StoryDetail /> },
      { path: "events", element: <EventsList /> },
      { path: "events/:slug", element: <EventDetail /> },

      { path: "gallery", element: <Gallery /> },
      { path: "gallery/:group", element: <Gallery /> },

      { path: "csr-partnerships", element: <CsrWhy /> },
      { path: "csr-partnerships/csr-projects", element: <CsrProjects /> },
      { path: "csr-partnerships/csr-impact", element: <CsrImpact /> },
      { path: "csr-partnerships/our-partners", element: <CsrPartners /> },
      { path: "csr-partnerships/csr-enquiry", element: <CsrEnquiry /> },

      { path: "get-involved", element: <GetInvolvedOverview /> },
      { path: "get-involved/volunteer", element: <VolunteerPage /> },
      { path: "get-involved/medical-volunteer", element: <MedicalVolunteerPage /> },
      { path: "get-involved/share-expertise", element: <ExpertisePage /> },
      { path: "donate", element: <Donate /> },

      { path: "transparency", element: <TransparencyOverview /> },
      { path: "transparency/fcra", element: <FcraPage /> },
      { path: "transparency/annual-reports", element: <AnnualReportsPage /> },
      { path: "transparency/financial-reports", element: <FinancialReportsPage /> },
      { path: "transparency/policies", element: <PoliciesPage /> },

      { path: "contact-us", element: <Contact /> },
      { path: "privacy-policy", element: <PolicyPage key="privacy" slug="privacy-policy" /> },
      { path: "terms-and-conditions", element: <PolicyPage key="terms" slug="terms-and-conditions" /> },
      { path: "refund-policy", element: <PolicyPage key="refund" slug="refund-policy" /> },
      ...Object.entries(LEGACY_URLS).map(([path, to]) => ({ path, element: <Navigate to={to} replace /> })),
      { path: "*", element: <NotFound /> },
    ],
  },
];
