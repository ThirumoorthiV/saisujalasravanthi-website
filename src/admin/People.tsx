// Admin-only: who can use the CMS.
import { useEffect, useState, type FormEvent } from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import { useStaff } from "./AdminApp";
import { useConfirm } from "./confirm";
import { createStaffAccount, listStaff, removeStaff, saveStaff, type StaffMember } from "./api";
import { Avatar, Button, Card, errorMessage, inputClass, Notice, PageTitle, Spinner } from "./ui";

const ROLE_OPTIONS = [
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
];

export function StaffPage() {
  const me = useStaff();
  const confirm = useConfirm();
  const [staff, setStaff] = useState<StaffMember[]>();
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [form, setForm] = useState<StaffMember>({ uid: "", name: "", email: "", role: "editor" });
  const [busy, setBusy] = useState(false);

  const load = () =>
    listStaff()
      .then((list) => setStaff(list.sort((a, b) => a.name.localeCompare(b.name))))
      .catch((err) => setMessage({ tone: "error", text: errorMessage(err) }));

  useEffect(() => {
    load();
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const member = await createStaffAccount({ name: form.name.trim(), email: form.email.trim(), role: form.role });
      setMessage({
        tone: "success",
        text: `Account created. ${member.name} will get an email from Firebase to set a password (ask them to check spam), then they can sign in here.`,
      });
      setForm({ uid: "", name: "", email: "", role: "editor" });
      load();
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    }
    setBusy(false);
  };

  const add = async (e: FormEvent) => {
    e.preventDefault();
    const member = { uid: form.uid.trim(), name: form.name.trim(), email: form.email.trim(), role: form.role };
    if (!member.name || !member.email) return setMessage({ tone: "error", text: "Fill in the name and email above too." });
    if (!/^[A-Za-z0-9]{20,128}$/.test(member.uid)) {
      return setMessage({ tone: "error", text: "That doesn't look like a User ID. Copy it from the CMS sign-in page or Firebase → Authentication → Users." });
    }
    try {
      await saveStaff(member, staff?.find((s) => s.uid === member.uid));
      setMessage({ tone: "success", text: `${member.name} can now sign in to the CMS.` });
      setForm({ uid: "", name: "", email: "", role: "editor" });
      load();
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    }
  };

  const update = async (member: StaffMember, role: StaffMember["role"] | null) => {
    if (
      role === null &&
      !(await confirm({
        title: "Remove CMS access?",
        message: (
          <>
            <strong className="mb-1 block text-ink-900">
              {member.name} ({member.email})
            </strong>
            They will no longer be able to sign in to the CMS. You can add them back later.
          </>
        ),
        confirmLabel: "Yes, remove",
      }))
    )
      return;
    try {
      if (role === null) await removeStaff(member);
      else await saveStaff({ ...member, role }, member);
      load();
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    }
  };

  return (
    <>
      <PageTitle>Staff access</PageTitle>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      {!staff ? (
        <Spinner />
      ) : (
        <div className="mb-8 overflow-x-auto rounded-lg border border-ink-200 bg-white md:overflow-visible">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-maroon-50 text-sm">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {staff.map((m) => (
                <tr key={m.uid}>
                  <td className="px-4 py-2 font-semibold">
                    <span className="flex items-center gap-3">
                      <Avatar name={m.name} photo={m.photo} className="h-9 w-9 text-sm" />
                      {m.name}
                    </span>
                  </td>
                  <td className="px-4 py-2">{m.email}</td>
                  <td className="px-4 py-2">
                    {m.uid === me.uid ? (
                      "Admin (you)"
                    ) : (
                      <Dropdown
                        ariaLabel={`Role for ${m.name}`}
                        value={m.role}
                        onChange={(v) => update(m, v as StaffMember["role"])}
                        options={ROLE_OPTIONS}
                        className="w-36"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {m.uid !== me.uid && (
                      <Button variant="ghost" onClick={() => update(m, null)}>
                        Remove
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Card className="max-w-2xl">
        <h2 className="font-heading text-lg font-bold text-maroon-900">Add a staff member</h2>
        <p className="mt-1 text-[15px]">
          This creates their login and emails them a link to set their own password. Then they sign in at this CMS address
          (the website's <strong>Sign in</strong> link, or <strong>/login/</strong>).
        </p>
        <p className="mt-2 text-sm text-ink-600">
          <strong>Editors</strong> manage the website content. <strong>Admins</strong> can also see form submissions and manage staff.
        </p>
        <form onSubmit={create} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${inputClass} mt-1`} />
          </label>
          <label className="block text-sm font-semibold">
            Email
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`${inputClass} mt-1`} />
          </label>
          <div className="text-sm font-semibold">
            <span id="new-role-label">Role</span>
            <Dropdown
              labelId="new-role-label"
              value={form.role}
              onChange={(v) => setForm({ ...form, role: v as StaffMember["role"] })}
              options={ROLE_OPTIONS}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create account & send invite"}
            </Button>
          </div>
        </form>

        <details className="mt-6 border-t border-ink-200 pt-4">
          <summary className="cursor-pointer text-sm font-semibold text-maroon-700">Already has a login? Add by User ID</summary>
          <p className="mt-2 text-sm text-ink-600">
            When someone with a login but no access signs in, the CMS shows their User ID. Paste it here with the name and email above.
          </p>
          <form onSubmit={add} className="mt-3 flex flex-wrap gap-2">
            <input
              required
              aria-label="User ID"
              placeholder="User ID"
              value={form.uid}
              onChange={(e) => setForm({ ...form, uid: e.target.value })}
              className={`${inputClass} max-w-sm font-mono`}
            />
            <Button type="submit" variant="secondary" disabled={busy}>
              Give access
            </Button>
          </form>
        </details>
      </Card>
    </>
  );
}
