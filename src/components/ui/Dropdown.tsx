import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
}

/**
 * Brand-styled replacement for <select>. Native option lists use the OS
 * highlight colour (blue), which CSS cannot change, so options render in our
 * own listbox with maroon-tint hover and selected states.
 */
export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select…",
  labelId,
  invalid = false,
  name,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  labelId?: string;
  invalid?: boolean;
  name?: string;
  onBlur?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open, onBlur]);

  useEffect(() => {
    if (open && active >= 0) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
    onBlur?.();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (active >= 0) choose(active);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={root} className="relative mt-1">
      <button
        type="button"
        name={name}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-invalid={invalid}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 text-left focus:border-maroon-700 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 ${
          invalid ? "border-error" : "border-ink-200"
        }`}
      >
        <span className={selected ? "text-ink-900" : "text-ink-600/70"}>{selected?.label ?? placeholder}</span>
        <ChevronDown size={18} className={`shrink-0 text-maroon-700 transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <ul
          ref={list}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-ink-200"
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li
                key={o.value || "__all"}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(i);
                }}
                className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-[15px] ${
                  isSelected ? "bg-maroon-100 font-semibold text-maroon-700" : i === active ? "bg-maroon-50 text-maroon-700" : "text-ink-900"
                }`}
              >
                {o.label}
                {isSelected && <Check size={16} aria-hidden />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
