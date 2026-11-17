// Lets the public website show "you're signed in" (avatar → CMS) without loading
// Firebase on every page. The CMS writes this when someone signs in and clears it
// when they sign out. It's only a display hint: the CMS itself still checks the
// real login, so a stale value just leads to the sign-in page.
const KEY = "sss-cms-user";
const EVENT = "sss-cms-user-change";

export interface CmsSession {
  name: string;
  photo?: string;
  /** Where their CMS is: /admin/ or /staff/ */
  area: string;
}

export function readCmsSession(): CmsSession | null {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return value && typeof value.name === "string" && /^\/(admin|staff)\/$/.test(value.area) ? value : null;
  } catch {
    return null;
  }
}

export function saveCmsSession(session: CmsSession | null) {
  try {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Private browsing / storage blocked: the header just keeps showing "Sign in".
  }
}

/** Calls `fn` when the session changes, in this tab or another one. */
export function onCmsSessionChange(fn: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && fn();
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", onStorage);
  };
}
