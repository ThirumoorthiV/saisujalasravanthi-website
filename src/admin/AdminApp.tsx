// The CMS. Everyone signs in at /login/; admins then work at /admin/ and editors
// at /staff/ (same app, three entry pages). Hash URLs (/admin/#/stories) so it
// works on any host without server rewrites. Staff log in with Firebase Authentication; what they
// can do is decided by their document in the `staff` collection.
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Globe,
  HeartHandshake,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { HashRouter, Navigate, NavLink, Route, Routes } from "react-router-dom";
import { SITE } from "@/data/site";
import { saveCmsSession } from "@/lib/cmsSession";
import { getStaff, type StaffMember } from "./api";
import { ConfirmProvider } from "./confirm";
import { ContentEditor, ContentList } from "./Content";
import { Dashboard } from "./Dashboard";
import { StaffPage } from "./People";
import { ProfilePage } from "./Profile";
import { SubmissionsPage } from "./Submissions";
import { auth, Login, NotAuthorised } from "./Login";
import { Avatar, errorMessage, Spinner } from "./ui";

const LOGIN = "/login/";
const AREAS: Record<StaffMember["role"], string> = { admin: "/admin/", editor: "/staff/" };

const StaffContext = createContext<StaffMember | null>(null);
export const useStaff = () => useContext(StaffContext)!;
const UpdateStaffContext = createContext<(s: StaffMember) => void>(() => {});
/** Updates the signed-in person's details on screen (e.g. after changing their name). */
export const useUpdateStaff = () => useContext(UpdateStaffContext);

export function AdminApp() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [staff, setStaff] = useState<StaffMember | null | undefined>(undefined);
  const [error, setError] = useState("");

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        setUser(u);
        setStaff(undefined);
        setError("");
        if (!u) return;
        try {
          setStaff(await getStaff(u.uid));
        } catch (err) {
          setError(errorMessage(err));
          setStaff(null);
        }
      }),
    [],
  );

  // Tell the public website header who is signed in (it shows their avatar).
  useEffect(() => {
    if (user === null || staff === null) saveCmsSession(null);
    else if (staff) saveCmsSession({ name: staff.name, photo: staff.photo, area: AREAS[staff.role] });
  }, [user, staff]);

  if (user === undefined || (user && staff === undefined)) return <Spinner />;

  // Each role has its own address: /login/ to sign in, then /admin/ or /staff/.
  const home = staff ? AREAS[staff.role] : LOGIN;
  if (!window.location.pathname.startsWith(home)) {
    window.location.replace(home + (staff ? window.location.hash : ""));
    return <Spinner />;
  }
  if (!user) return <Login />;
  if (!staff) return <NotAuthorised user={user} error={error} />;

  return (
    <StaffContext.Provider value={staff}>
      <UpdateStaffContext.Provider value={setStaff}>
      <ConfirmProvider>
      <HashRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/:collection" element={<ContentList />} />
            <Route path="/:collection/new" element={<ContentEditor />} />
            <Route path="/:collection/edit/:id" element={<ContentEditor />} />
            <Route path="/submissions" element={staff.role === "admin" ? <SubmissionsPage /> : <Navigate to="/" />} />
            <Route path="/staff" element={staff.role === "admin" ? <StaffPage /> : <Navigate to="/" />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Shell>
      </HashRouter>
      </ConfirmProvider>
      </UpdateStaffContext.Provider>
    </StaffContext.Provider>
  );
}

/** The Trust logo in white, for the maroon sidebar. */
function CmsLogo({ className }: { className: string }) {
  return (
    <a href="/" aria-label={`${SITE.legalName} website`} className="inline-block">
      <img src="/images/brand/logo.png" alt={SITE.legalName} width={543} height={217} className={`w-auto brightness-0 invert ${className}`} />
    </a>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const staff = useStaff();
  const [open, setOpen] = useState(false);
  // Don't let the page scroll behind the open phone menu.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  type Link = [string, string, LucideIcon];
  const sections: { title?: string; links: Link[] }[] = [
    { links: [["/", "Dashboard", LayoutDashboard]] },
    {
      title: "Updates",
      links: [
        ["/stories", "Blog & Stories", BookOpen],
        ["/events", "Events", CalendarDays],
        ["/gallery", "Gallery", Images],
      ],
    },
    {
      title: "Website pages",
      links: [
        ["/programmes", "Programmes", HeartHandshake],
        ["/leadership", "Leadership", UserRound],
        ["/centres", "Our Network", MapPin],
      ],
    },
    ...(staff.role === "admin"
      ? [
          {
            title: "Admin",
            links: [
              ["/submissions", "Form submissions", Inbox],
              ["/staff", "Staff access", Users],
            ] as Link[],
          },
        ]
      : []),
  ];
  // Same colours as the website's main menu: maroon, lighter maroon on hover, gold for the current page.
  const item = "flex w-full items-center gap-3 rounded-md px-3 py-2 text-[15px] font-medium transition-colors";
  return (
    <div className="min-h-screen md:flex">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-maroon-700 px-4 shadow-md md:hidden">
        <CmsLogo className="h-9" />
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-maroon-600"
          aria-expanded={open}
          aria-controls="cms-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </header>
      <nav
        id="cms-nav"
        aria-label="CMS"
        // Phones: a full-height menu that slides under the fixed header. Desktop: the sidebar.
        className={`${open ? "flex" : "hidden"} fixed inset-x-0 bottom-0 top-16 z-40 flex-col bg-maroon-700 text-white md:sticky md:inset-auto md:top-0 md:z-auto md:flex md:h-screen md:w-64 md:shrink-0`}
      >
        <div className="hidden px-6 pb-4 pt-5 md:block">
          <CmsLogo className="h-11" />
          <p className="mt-2.5 flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-500">
            <span className="h-px w-5 bg-gold-500" aria-hidden />
            Website CMS
          </p>
        </div>
        <div className="cms-scroll flex-1 overflow-y-auto border-t border-white/15 px-3 py-3">
          {sections.map((section, i) => (
            <div key={section.title ?? i} className={i ? "mt-5" : ""}>
              {section.title && (
                <p className="px-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-gold-100/60">{section.title}</p>
              )}
              <ul className="space-y-0.5">
                {section.links.map(([to, label, Icon]) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === "/"}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `${item} ${isActive ? "bg-gold-500 font-semibold text-maroon-900 shadow-sm" : "text-white/90 hover:bg-maroon-600 hover:text-white"}`
                      }
                    >
                      <Icon size={18} aria-hidden className="shrink-0" /> {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/15 p-3">
          <div className="flex items-center gap-1 rounded-lg bg-maroon-900/40 p-1.5">
            <NavLink
              to="/profile"
              onClick={() => setOpen(false)}
              title="My profile"
              className={({ isActive }) =>
                `flex min-w-0 flex-1 items-center gap-3 rounded-md px-1.5 py-1 transition-colors ${isActive ? "bg-maroon-600" : "hover:bg-maroon-600"}`
              }
            >
              <Avatar name={staff.name} photo={staff.photo} className="h-9 w-9 ring-2 ring-gold-500" />
              <span className="min-w-0 flex-1 text-sm leading-tight">
                <span className="block truncate font-semibold">{staff.name}</span>
                <span className="block truncate text-[13px] text-white/70">{staff.role === "admin" ? "Admin" : "Editor"}</span>
              </span>
            </NavLink>
            <a
              href="/"
              title="View website"
              aria-label="View website"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/80 hover:bg-maroon-600 hover:text-white"
            >
              <Globe size={17} aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => signOut(auth)}
              title="Sign out"
              aria-label="Sign out"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/80 hover:bg-maroon-600 hover:text-white"
            >
              <LogOut size={17} aria-hidden />
            </button>
          </div>
        </div>
      </nav>
      <main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-8">{children}</main>
    </div>
  );
}
