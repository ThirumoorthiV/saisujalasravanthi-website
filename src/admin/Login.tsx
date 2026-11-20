// CMS sign-in screens, branded like the website. Staff are invited by an admin
// (Staff access page), so there is deliberately no "create account" option.
import { getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from "firebase/auth";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { SITE } from "@/data/site";
import { app } from "@/lib/firebase";
import { Button, buttonClass, errorMessage, inputClass, Notice } from "./ui";

export const auth = getAuth(app);

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="sticky top-0 z-20 border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3 md:px-6">
          <a href="/" aria-label={`${SITE.legalName} — website home`}>
            <img src="/images/brand/logo.png" alt={SITE.legalName} width={543} height={217} className="h-11 w-auto md:h-14" />
          </a>
          <a href="/" className="text-sm font-semibold text-maroon-700 hover:underline">
            ← Back to website
          </a>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10 md:items-center md:py-16">{children}</main>

      <footer className="bg-maroon-900 px-4 py-6 text-center text-sm text-white/80">
        <p className="font-heading text-base text-white">
          {SITE.motto} · {SITE.submotto}
        </p>
        <p className="mt-1">
          © {new Date().getFullYear()} {SITE.legalName}. Authorised access only.
        </p>
      </footer>
    </div>
  );
}

const card = "w-full max-w-md rounded-2xl border border-ink-200 bg-white px-6 py-8 shadow-lg shadow-maroon-900/5 md:px-8";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const failed = (err: unknown) => {
    const code = (err as { code?: string }).code ?? "";
    if (/popup-closed-by-user|cancelled-popup-request/.test(code)) return; // they closed the Google window
    setMessage({
      tone: "error",
      text: /invalid-credential|wrong-password|user-not-found|invalid-email/.test(code)
        ? "Email or password is incorrect."
        : /configuration-not-found|operation-not-allowed/.test(code)
          ? "This sign-in method isn't switched on yet: Firebase console → Authentication → Sign-in method."
          : code.includes("popup-blocked")
            ? "Your browser blocked the Google window. Allow pop-ups for this site and try again."
            : code.includes("too-many-requests")
              ? "Too many attempts. Please wait a few minutes or reset your password."
              : errorMessage(err),
    });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      failed(err);
    }
    setBusy(false);
  };

  const google = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider().setCustomParameters({ prompt: "select_account" }));
    } catch (err) {
      failed(err);
    }
    setBusy(false);
  };

  const reset = async () => {
    if (!email.trim()) return setMessage({ tone: "error", text: "Enter your email address above, then click “Forgot password?” again." });
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch {
      // Don't reveal whether an account exists.
    }
    setMessage({ tone: "success", text: "If this email has an account, a password reset link is on its way. Check your spam folder too." });
  };

  return (
    <AuthLayout>
      <div className={card}>
        <h1 className="text-center font-heading text-[28px] font-bold leading-tight text-maroon-700">Welcome back</h1>
        <p className="mx-auto mt-2 max-w-xs text-center text-[15px] text-ink-600">
          Sign in to manage the website content.
        </p>
        <p className="mt-4 flex items-start gap-2.5 rounded-md border-l-4 border-gold-500 bg-gold-100 px-3.5 py-2.5 text-[13px] leading-snug text-ink-900">
          <LockKeyhole className="mt-px h-4 w-4 shrink-0 text-maroon-700" aria-hidden />
          <span>
            <strong className="block font-semibold">Only for Trust admins, staff and volunteers.</strong>
            <span className="mt-0.5 block text-ink-600">Visitors don't need an account to use the website.</span>
          </span>
        </p>

        <div className="mt-6">{message && <Notice tone={message.tone}>{message.text}</Notice>}</div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-ink-600 hover:text-maroon-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
              </button>
            </div>
            <div className="mt-1.5 text-right">
              <button type="button" onClick={reset} className="text-[13px] text-maroon-700 hover:underline">
                Forgot password?
              </button>
            </div>
          </div>
          <Button type="submit" disabled={busy} className="w-full py-3 text-[15px]">
            <Mail className="h-4 w-4" aria-hidden />
            {busy ? "Signing in…" : "Sign in with email"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-ink-600" aria-hidden="true">
          <span className="h-px flex-1 bg-ink-200" />
          or continue with
          <span className="h-px flex-1 bg-ink-200" />
        </div>

        <button
          type="button"
          onClick={google}
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-ink-900/70 bg-white py-3 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-maroon-50 disabled:opacity-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-[13px] text-ink-600">
          Need access? Ask a CMS admin of the Trust to invite you.
        </p>
      </div>
    </AuthLayout>
  );
}

export function NotAuthorised({ user, error }: { user: User; error: string }) {
  return (
    <AuthLayout>
      <div className={card}>
        <h1 className="text-center font-heading text-2xl font-bold text-maroon-700">You don't have access yet</h1>
        <div className="mt-4">{error && <Notice tone="error">{error}</Notice>}</div>
        <p className="text-[15px]">
          You're signed in as <strong className="break-all">{user.email}</strong>, but this account hasn't been given CMS access. Ask a CMS
          admin to add you on the <em>Staff access</em> page using this User ID:
        </p>
        <p className="my-3 select-all break-all rounded bg-maroon-50 px-3 py-2 font-mono text-sm">{user.uid}</p>
        <div className="grid gap-2 sm:flex sm:flex-wrap">
          <Button variant="secondary" onClick={() => navigator.clipboard?.writeText(user.uid)}>
            Copy User ID
          </Button>
          <Button variant="ghost" onClick={() => signOut(auth)}>
            Sign out
          </Button>
          <a href="/" className={buttonClass("ghost")}>
            Back to website
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
