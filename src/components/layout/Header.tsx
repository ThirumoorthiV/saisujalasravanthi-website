import { useEffect, useId, useState } from "react";
import { ChevronDown, ChevronRight, HeartHandshake, Mail, Menu, Phone, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ENQUIRY_INBOXES, MAIN_NAV, SITE, type NavItem } from "@/data/site";
import { buttonClass } from "@/components/ui/Button";

export function Logo({ className = "h-12 md:h-14" }: { className?: string }) {
  return (
    <Link to="/" className="flex shrink-0 items-center" aria-label={`${SITE.legalName} — home`}>
      <img src="/images/brand/logo.png" alt={SITE.legalName} width={543} height={217} className={`w-auto ${className}`} />
    </Link>
  );
}

function DesktopItem({ item, alignRight }: { item: NavItem; alignRight: boolean }) {
  return (
    <li className="group relative">
      <NavLink
        to={item.to}
        end={item.to === "/"}
        className={({ isActive }) =>
          `flex min-h-[48px] items-center gap-0.5 whitespace-nowrap px-2.5 text-[14.5px] font-medium transition-colors hover:bg-maroon-600 ${
            isActive ? "bg-gold-500 text-maroon-900" : "text-white"
          }`
        }
      >
        {item.label}
        {item.children && <ChevronDown size={14} aria-hidden className="opacity-80" />}
      </NavLink>
      {item.children && (
        <ul
          className={`invisible absolute top-full z-50 min-w-[240px] rounded-b-lg border-t-2 border-gold-500 bg-white py-2 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          {item.children.map((child) => (
            <li key={child.to} className="group/sub relative">
              <Link
                to={child.to}
                className="flex items-center justify-between gap-3 px-4 py-2 text-sm font-medium text-ink-900 hover:bg-maroon-50 hover:text-maroon-700 group-hover/sub:bg-maroon-50 group-hover/sub:text-maroon-700"
              >
                {child.label}
                {child.children && <ChevronRight size={14} aria-hidden className="opacity-70" />}
              </Link>
              {child.children && (
                // Flyout: hidden until the parent row is hovered or keyboard-focused.
                <ul
                  className={`invisible absolute top-0 z-50 min-w-[240px] rounded-lg border-t-2 border-gold-500 bg-white py-2 opacity-0 shadow-lg transition group-focus-within/sub:visible group-focus-within/sub:opacity-100 group-hover/sub:visible group-hover/sub:opacity-100 ${
                    alignRight ? "right-full" : "left-full"
                  }`}
                >
                  {child.children.map((g) => (
                    <li key={g.to}>
                      <Link to={g.to} className="block px-4 py-2 text-sm text-ink-900 hover:bg-maroon-50 hover:text-maroon-700">
                        {g.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/** Mobile accordion: sub-menus stay closed until their toggle is tapped. */
function MobileItem({ item, depth }: { item: NavItem; depth: number }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  return (
    <li className={depth ? "" : "border-b border-ink-200/70 last:border-0"}>
      <div className="flex items-center justify-between gap-2">
        <Link
          to={item.to}
          className={`flex flex-1 items-center ${depth ? "min-h-[44px] text-ink-900" : "min-h-[52px] font-semibold text-maroon-700"}`}
        >
          {item.label}
        </Link>
        {item.children && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-label={`${expanded ? "Hide" : "Show"} ${item.label} sub-menu`}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition ${
              expanded ? "bg-maroon-700 text-white" : "bg-maroon-50 text-maroon-700"
            }`}
          >
            <ChevronDown size={18} className={`transition ${expanded ? "rotate-180" : ""}`} aria-hidden />
          </button>
        )}
      </div>
      {item.children && expanded && (
        <div id={panelId}>
          <MobileItems items={item.children} depth={depth + 1} />
        </div>
      )}
    </li>
  );
}

function MobileItems({ items, depth = 0 }: { items: NavItem[]; depth?: number }) {
  return (
    <ul className={depth ? "mb-3 ml-2 border-l-2 border-gold-500 pl-4" : ""}>
      {items.map((item) => (
        <MobileItem key={item.to + item.label} item={item} depth={depth} />
      ))}
    </ul>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, search, hash } = useLocation();

  useEffect(() => setOpen(false), [pathname, search, hash]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 bg-cream transition-shadow ${scrolled ? "shadow-md" : ""}`}>
      <div className="mx-auto flex max-w-content items-center gap-2 px-4 py-2 sm:gap-4 sm:px-6">
        <Logo className="h-10 sm:h-14 lg:h-16" />
        <div className="ml-auto hidden items-center gap-6 text-sm text-ink-600 lg:flex">
          <a href={`mailto:${ENQUIRY_INBOXES["General Enquiries"]}`} className="flex items-center gap-2 hover:text-maroon-700">
            <Mail size={16} className="text-maroon-700" aria-hidden /> {ENQUIRY_INBOXES["General Enquiries"]}
          </a>
          <span className="flex items-center gap-2">
            <Phone size={16} className="text-maroon-700" aria-hidden /> {SITE.phones.join(" / ")}
          </span>
        </div>
        <Link to="/donate/" className={`${buttonClass("primary")} ml-auto !min-h-[38px] !px-3 !py-1.5 sm:!min-h-[44px] sm:!px-5 sm:!py-2.5 lg:ml-0`}>
          <HeartHandshake size={16} aria-hidden /> Donate
        </Link>
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-maroon-700 hover:bg-maroon-100 sm:h-11 sm:w-11 xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>

      <nav aria-label="Main" className="hidden border-b-[3px] border-gold-500 bg-maroon-700 xl:block">
        <ul className="mx-auto flex max-w-content justify-between px-4 sm:px-6">
          {MAIN_NAV.map((item, i) => (
            <DesktopItem key={item.to} item={item} alignRight={i >= MAIN_NAV.length - 3} />
          ))}
        </ul>
      </nav>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="max-h-[calc(100dvh-60px)] overflow-y-auto border-t border-ink-200 bg-white px-4 py-4 sm:px-6 xl:hidden">
          <MobileItems items={MAIN_NAV} />
        </nav>
      )}
    </header>
  );
}
