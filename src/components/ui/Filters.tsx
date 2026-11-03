import { useId } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Dropdown } from "./Dropdown";

export interface FilterDef {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

function FilterField({ def, value, onChange }: { def: FilterDef; value: string; onChange: (v: string) => void }) {
  const labelId = useId();
  return (
    <div>
      <span id={labelId} className="text-xs font-semibold uppercase tracking-wide text-ink-600">
        {def.label}
      </span>
      <Dropdown value={value} onChange={onChange} labelId={labelId} placeholder="All" options={[{ value: "", label: "All" }, ...def.options]} />
    </div>
  );
}

/** Filter panel bound to URL search params so filtered views are shareable. */
export function FilterBar({
  filters,
  values,
  onChange,
  onReset,
  count,
}: {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  count: number;
}) {
  const active = Object.values(values).some(Boolean);
  const cols = filters.length >= 4 ? "lg:grid-cols-4" : filters.length === 3 ? "lg:grid-cols-3" : "";
  return (
    <div className="mb-8 rounded-xl bg-white p-5 shadow-sm ring-1 ring-ink-200/70">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 font-semibold text-maroon-700">
          <SlidersHorizontal size={18} aria-hidden /> Filter
        </p>
        <div className="flex items-center gap-4">
          <p className="text-sm text-ink-600" aria-live="polite">
            Showing {count} {count === 1 ? "result" : "results"}
          </p>
          {active && (
            <button type="button" onClick={onReset} className="flex min-h-[36px] items-center gap-1 text-sm font-semibold text-maroon-700 hover:text-maroon-600">
              <X size={16} aria-hidden /> Clear
            </button>
          )}
        </div>
      </div>
      <div className={`grid gap-4 sm:grid-cols-2 ${cols}`}>
        {filters.map((f) => (
          <FilterField key={f.key} def={f} value={values[f.key] ?? ""} onChange={(v) => onChange(f.key, v)} />
        ))}
      </div>
    </div>
  );
}

export const uniqueOptions = (values: string[]) => [...new Set(values)].sort().map((v) => ({ value: v, label: v }));
