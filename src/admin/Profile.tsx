// "My profile": the signed-in person's details, name and password.
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword } from "firebase/auth";
import { Camera, Check, Copy, KeyRound, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useStaff, useUpdateStaff } from "./AdminApp";
import { makeProfilePhoto, saveOwnName, saveOwnPhoto } from "./api";
import { useConfirm } from "./confirm";
import { auth } from "./Login";
import { Avatar, Button, Card, errorMessage, inputClass, Notice, PageTitle } from "./ui";

const CAN_DO: Record<"admin" | "editor", string[]> = {
  editor: ["Add, edit, publish and delete Blog posts, Events and Gallery photos", "Edit Programmes, Leadership, Our Network, Our Partners and the “Follow us” social media links"],
  admin: [
    "Everything an Editor can do",
    "View, download and delete form submissions",
    "Add staff, change their role and remove their access",
  ],
};

const when = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "-";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-ink-600">{label}</dt>
      <dd className="min-w-0 break-words text-[15px] text-ink-900">{children}</dd>
    </div>
  );
}

export function ProfilePage() {
  const staff = useStaff();
  const user = auth.currentUser!;
  const providers = user.providerData.map((p) => p.providerId);
  const hasPassword = providers.includes("password");
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    await navigator.clipboard?.writeText(staff.uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PageTitle>My profile</PageTitle>

      {/* Phones: photo, then name and details, then Sign out, all centred. From sm: one row. */}
      <Card className="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-5 sm:text-left md:flex-col md:gap-4 md:text-center lg:flex-row lg:gap-5 lg:text-left">
        <PhotoPicker />
        <div className="min-w-0 sm:flex-1 md:flex-none lg:flex-1">
          <h2 className="break-words font-heading text-2xl font-bold text-maroon-900">{staff.name}</h2>
          <p className="break-words text-ink-600">{user.email}</p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-maroon-50 px-3 py-1 text-sm font-semibold text-maroon-700">
            <ShieldCheck size={15} aria-hidden /> {staff.role === "admin" ? "Admin" : "Editor"}
          </span>
        </div>
        <Button variant="secondary" className="w-full sm:w-auto md:w-full lg:w-auto" onClick={() => signOut(auth)}>
          <LogOut size={16} aria-hidden /> Sign out
        </Button>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="mb-1 flex items-center gap-2 font-heading text-lg font-bold text-maroon-900">
            <UserRound size={19} aria-hidden /> Account details
          </h2>
          <dl className="divide-y divide-ink-200">
            <Row label="Name">{staff.name}</Row>
            <Row label="Email">{user.email}</Row>
            <Row label="Role">{staff.role === "admin" ? "Admin" : "Editor"}</Row>
            <Row label="Signs in with">
              {[hasPassword && "Email & password", providers.includes("google.com") && "Google"].filter(Boolean).join(" and ") || "-"}
            </Row>
            <Row label="Account created">{when(user.metadata.creationTime)}</Row>
            <Row label="Last sign-in">{when(user.metadata.lastSignInTime)}</Row>
            <Row label="User ID">
              <span className="flex items-center gap-2">
                <code className="break-all rounded bg-maroon-50 px-2 py-0.5 text-sm">{staff.uid}</code>
                <button
                  type="button"
                  onClick={copyId}
                  title="Copy User ID"
                  aria-label="Copy User ID"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-maroon-700 hover:bg-maroon-50"
                >
                  {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                </button>
              </span>
            </Row>
          </dl>
        </Card>

        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-maroon-900">
            <ShieldCheck size={19} aria-hidden /> What you can do
          </h2>
          <ul className="space-y-2">
            {CAN_DO[staff.role].map((line) => (
              <li key={line} className="flex gap-2 text-[15px]">
                <Check size={18} className="mt-0.5 shrink-0 text-success" aria-hidden /> {line}
              </li>
            ))}
          </ul>
          {staff.role === "editor" && <p className="mt-4 text-sm text-ink-600">Need more access? Ask a CMS admin.</p>}
        </Card>

        <NameForm />
        {hasPassword ? (
          <PasswordForm />
        ) : (
          <Card>
            <h2 className="mb-2 flex items-center gap-2 font-heading text-lg font-bold text-maroon-900">
              <KeyRound size={19} aria-hidden /> Password
            </h2>
            <p className="text-[15px] text-ink-600">You sign in with Google, so your password is managed in your Google account.</p>
          </Card>
        )}
      </div>
    </>
  );
}

/** The big profile picture with "Change photo" / "Remove" underneath. */
function PhotoPicker() {
  const staff = useStaff();
  const updateStaff = useUpdateStaff();
  const input = useRef<HTMLInputElement>(null);
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const save = async (photo: string | null) => {
    await saveOwnPhoto(staff.uid, photo);
    updateStaff({ ...staff, photo: photo ?? undefined });
  };

  const choose = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      await save(await makeProfilePhoto(file));
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
    if (input.current) input.current.value = "";
  };

  const remove = async () => {
    const ok = await confirm({
      title: "Remove your profile photo?",
      message: "Your initial will be shown instead. You can upload a new photo any time.",
      confirmLabel: "Yes, remove",
    });
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      await save(null);
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy}
        title="Change photo"
        aria-label="Change profile photo"
        className="group relative rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-maroon-100"
      >
        <Avatar name={staff.name} photo={staff.photo} className="h-24 w-24 font-heading text-4xl ring-4 ring-gold-100" />
        <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-maroon-700 text-white shadow group-hover:bg-maroon-600">
          <Camera size={15} aria-hidden />
        </span>
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70 text-xs font-semibold text-maroon-700">
            Saving…
          </span>
        )}
      </button>
      <input ref={input} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => choose(e.target.files?.[0])} />
      <div className="flex gap-3 text-[13px]">
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="font-semibold text-maroon-700 hover:underline">
          {staff.photo ? "Change photo" : "Upload photo"}
        </button>
        {staff.photo && (
          <button type="button" onClick={remove} disabled={busy} className="text-ink-600 hover:text-error hover:underline">
            Remove
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="max-w-[220px] text-center text-[13px] text-error">
          {error}
        </p>
      )}
    </div>
  );
}

function NameForm() {
  const staff = useStaff();
  const updateStaff = useUpdateStaff();
  const [name, setName] = useState(staff.name);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) return setMessage({ tone: "error", text: "Please enter your name." });
    setBusy(true);
    setMessage(null);
    try {
      await saveOwnName(staff.uid, trimmed);
      updateStaff({ ...staff, name: trimmed });
      setMessage({ tone: "success", text: "Name updated." });
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    }
    setBusy(false);
  };

  return (
    <Card>
      <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-maroon-900">
        <UserRound size={19} aria-hidden /> Change your name
      </h2>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
        <label className="block w-full text-sm font-semibold sm:w-auto sm:min-w-[220px] sm:flex-1">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputClass} mt-1`} maxLength={80} />
        </label>
        <Button type="submit" disabled={busy || name.trim() === staff.name} className="w-full sm:w-auto">
          {busy ? "Saving…" : "Save name"}
        </Button>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (next.length < 8) return setMessage({ tone: "error", text: "The new password must be at least 8 characters." });
    if (next !== confirm) return setMessage({ tone: "error", text: "The two new passwords don't match." });
    const user = auth.currentUser!;
    setBusy(true);
    try {
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email!, current));
      await updatePassword(user, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setMessage({ tone: "success", text: "Password changed. Use the new password next time you sign in." });
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setMessage({
        tone: "error",
        text: /invalid-credential|wrong-password/.test(code)
          ? "Your current password is incorrect."
          : code.includes("weak-password")
            ? "That password is too weak. Try a longer one."
            : code.includes("too-many-requests")
              ? "Too many attempts. Please wait a few minutes."
              : errorMessage(err),
      });
    }
    setBusy(false);
  };

  return (
    <Card>
      <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-maroon-900">
        <KeyRound size={19} aria-hidden /> Change password
      </h2>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <form onSubmit={submit} className="space-y-3">
        <label className="block text-sm font-semibold">
          Current password
          <input type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} className={`${inputClass} mt-1`} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            New password
            <input type="password" autoComplete="new-password" required value={next} onChange={(e) => setNext(e.target.value)} className={`${inputClass} mt-1`} />
          </label>
          <label className="block text-sm font-semibold">
            Confirm new password
            <input type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`${inputClass} mt-1`} />
          </label>
        </div>
        <p className="text-[13px] text-ink-600">At least 8 characters.</p>
        <Button type="submit" disabled={busy} className="w-full sm:w-auto">
          {busy ? "Changing…" : "Change password"}
        </Button>
      </form>
    </Card>
  );
}
