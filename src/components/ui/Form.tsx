import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { Controller, useForm, type Control, type FieldValues, type Path } from "react-hook-form";
import { Link } from "react-router-dom";
import type { ZodType } from "zod";
import { buttonClass } from "./Button";
import { Dropdown } from "./Dropdown";
import { submitForm, SubmitError } from "@/lib/submit";

const inputClass =
  "mt-1 block min-h-[44px] w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-ink-900 placeholder:text-ink-600/60 focus:border-maroon-700 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 aria-[invalid=true]:border-error";

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink-900">
        {label}
        {required && <span className="text-error"> *</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1 block text-sm text-error">
          {error}
        </span>
      )}
    </label>
  );
}

type Common = { label: string; error?: string };

export const TextInput = forwardRef<HTMLInputElement, Common & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, required, ...rest }, ref) => (
    <Field label={label} error={error} required={required}>
      <input ref={ref} className={inputClass} aria-invalid={!!error} {...rest} />
    </Field>
  ),
);

export const TextArea = forwardRef<HTMLTextAreaElement, Common & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ label, error, required, ...rest }, ref) => (
    <Field label={label} error={error} required={required}>
      <textarea ref={ref} rows={4} className={inputClass} aria-invalid={!!error} {...rest} />
    </Field>
  ),
);

/** Dropdown field wired to react-hook-form through Controller. */
function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  error,
  options,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  error?: string;
  options: readonly string[];
}) {
  const labelId = useId();
  return (
    <div>
      <span id={labelId} className="text-sm font-semibold text-ink-900">
        {label}
        {required && <span className="text-error"> *</span>}
      </span>
      <Controller
        control={control}
        name={name}
        defaultValue={"" as never}
        render={({ field }) => (
          <Dropdown
            name={field.name}
            value={(field.value as string) ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            options={options.map((o) => ({ value: o, label: o }))}
            labelId={labelId}
            invalid={!!error}
          />
        )}
      />
      {error && (
        <span role="alert" className="mt-1 block text-sm text-error">
          {error}
        </span>
      )}
    </div>
  );
}

export interface FieldSpec<T> {
  name: Path<T & FieldValues>;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  options?: readonly string[];
  required?: boolean;
  full?: boolean;
}

/**
 * Generic validated form. `onSubmit` is where the form service / backend call
 * goes; until one is connected, submissions are logged and acknowledged.
 */
export function EnquiryForm<T extends FieldValues>({
  schema,
  fields,
  submitLabel,
  inbox,
  formName,
  defaultValues,
}: {
  schema: ZodType<T>;
  fields: FieldSpec<T>[];
  submitLabel: string;
  inbox: string;
  formName: string;
  defaultValues?: Partial<T>;
}) {
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<T>({ resolver: zodResolver(schema), defaultValues: defaultValues as never });

  const onSubmit = async (data: T) => {
    setFailure(null);
    try {
      // Bots tick the hidden box; pretend success without sending.
      if (!honeypot) await submitForm(formName, data);
      window.dispatchEvent(new CustomEvent("form_submit", { detail: { formName } })); // GA4 hook
      setSent(true);
      reset();
    } catch (e) {
      setFailure(e instanceof SubmitError ? e.message : "We couldn't reach the server.");
    }
  };

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-center rounded-xl bg-success/10 px-6 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
          <CheckCircle2 size={28} aria-hidden />
        </span>
        <p className="mt-4 font-heading text-2xl font-semibold text-maroon-700">Thank you!</p>
        <p className="mt-2 max-w-md text-ink-900">Your details have been received. Our team will contact you shortly.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm font-semibold text-maroon-700 underline">
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        checked={honeypot}
        onChange={(e) => setHoneypot(e.target.checked)}
      />
      {fields.map((f) => {
        const error = (errors[f.name]?.message as string | undefined) ?? undefined;
        if (f.type === "select")
          return (
            <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
              <SelectField control={control} name={f.name} label={f.label} required={f.required} error={error} options={f.options ?? []} />
            </div>
          );
        const common = { label: f.label, required: f.required, error, ...register(f.name) };
        return (
          <div key={f.name} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
            {f.type === "textarea" ? (
              <TextArea {...common} />
            ) : (
              <TextInput {...common} type={f.type ?? "text"} />
            )}
          </div>
        );
      })}
      <div className="sm:col-span-2">
        <p className="mb-4 text-xs text-ink-600">
          By submitting, you consent to the Trust storing these details to respond to your enquiry. See our{" "}
          <Link to="/privacy-policy/" className="font-semibold text-maroon-700 underline">
            Privacy Policy
          </Link>
          .
        </p>
        {failure && (
          <p role="alert" className="mb-4 flex gap-2 rounded-lg bg-error/10 p-3 text-sm text-error">
            <AlertCircle size={18} className="shrink-0" aria-hidden />
            <span>
              {failure} Please try again, or email us at{" "}
              <a href={`mailto:${inbox}`} className="font-semibold underline">
                {inbox}
              </a>
              .
            </span>
          </p>
        )}
        <button type="submit" disabled={isSubmitting} className={`${buttonClass("primary")} w-full disabled:cursor-wait disabled:opacity-70`}>
          {isSubmitting ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Send size={16} aria-hidden />}
          {isSubmitting ? "Sending…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
