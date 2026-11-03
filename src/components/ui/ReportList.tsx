import { Download, FileText } from "lucide-react";
import type { Report } from "@/types";
import { PendingBadge } from "./Primitives";

/** Downloadable document list; links still pointing at "#" show as pending. */
export function ReportList({ items }: { items: Report[] }) {
  return (
    <ul className="divide-y divide-ink-200 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink-200/70">
      {items.map((r) => {
        const pending = r.file === "#";
        const inner = (
          <>
            <span className="flex items-center gap-3">
              <FileText size={20} className="shrink-0 text-maroon-700" aria-hidden />
              <span>
                <span className="block font-medium text-ink-900">{r.title}</span>
                <span className="block text-sm text-ink-600">
                  {r.type} · {r.year}
                </span>
              </span>
            </span>
            {pending ? (
              <PendingBadge>Coming soon</PendingBadge>
            ) : (
              <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-maroon-700">
                <Download size={16} aria-hidden /> PDF
              </span>
            )}
          </>
        );
        return (
          <li key={r.title}>
            {pending ? (
              <div className="flex min-h-[64px] items-center justify-between gap-4 px-5 py-3">{inner}</div>
            ) : (
              <a href={r.file} target="_blank" rel="noopener" className="flex min-h-[64px] items-center justify-between gap-4 px-5 py-3 hover:bg-maroon-50">
                {inner}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
