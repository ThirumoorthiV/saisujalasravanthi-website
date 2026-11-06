import { formatNumber } from "@/lib/format";
import type { YearlyImpact } from "@/types";

export interface Point {
  year: number;
  value: number;
  partial: boolean;
}

export const seriesFor = (data: YearlyImpact[], label: string): Point[] =>
  data.map((y) => ({ year: y.year, partial: y.partial, value: y.metrics.find((m) => m.label === label)!.value }));

const yearLabel = (p: Point) => (p.partial ? `${p.year} (year to date)` : String(p.year));

/** Rounds up to a clean axis maximum (1, 2, 2.5 or 5 × a power of ten). */
const niceMax = (v: number) => {
  const pow = 10 ** Math.floor(Math.log10(v));
  return ([1, 2, 2.5, 5, 10].find((m) => m * pow >= v) ?? 10) * pow;
};
const compact = (n: number) => (n >= 10000 ? `${n / 1000}K` : formatNumber(n));

/** SVG path through the points; the in-progress year is drawn dashed separately. */
function linePaths<P extends { x: number; y: number; partial: boolean }>(pts: P[]) {
  const full = pts.filter((p) => !p.partial);
  const solid = full.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join("");
  const lastFull = full[full.length - 1];
  const partial = pts.find((p) => p.partial);
  const dashed = lastFull && partial ? `M${lastFull.x} ${lastFull.y}L${partial.x} ${partial.y}` : "";
  return { solid, dashed, full };
}

/**
 * Headline trend: line + area wash with a value axis; the selected year is marked and labelled.
 * `width` sets the drawing's own width — a narrow drawing for phones keeps its text readable.
 */
export function TrendChart({ points, selected, label, width = 640 }: { points: Point[]; selected: number | "all"; label: string; width?: number }) {
  const W = width, H = Math.round(width * 0.4) + 40, L = 48, R = 44, T = 28, B = 32;
  const max = niceMax(Math.max(...points.map((p) => p.value)));
  const x = (i: number) => L + (i * (W - L - R)) / (points.length - 1);
  const y = (v: number) => T + (1 - v / max) * (H - T - B);
  const pts = points.map((p, i) => ({ ...p, x: x(i), y: y(p.value) }));
  const { solid, dashed, full } = linePaths(pts);
  const area = `${solid}L${full[full.length - 1].x} ${H - B}L${full[0].x} ${H - B}Z`;
  // Label the selected year, or the latest full year under "All".
  const focus = selected === "all" ? full[full.length - 1] : pts.find((p) => p.year === selected)!;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label} by year`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="stroke-ink-200" strokeWidth={1} />
          <text x={L - 8} y={y(t)} textAnchor="end" dominantBaseline="central" className="fill-ink-600 text-[11px]">
            {compact(t)}
          </text>
        </g>
      ))}
      <path d={area} className="fill-maroon-700/10" />
      <path d={solid} fill="none" className="stroke-maroon-700" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {dashed && <path d={dashed} fill="none" className="stroke-maroon-700" strokeWidth={2} strokeDasharray="5 5" strokeLinecap="round" />}
      {pts.map((p) => {
        const on = p.year === focus.year;
        return (
          <g key={p.year}>
            <text x={p.x} y={H - 10} textAnchor="middle" className={`text-[12px] ${on ? "fill-ink-900 font-semibold" : "fill-ink-600"}`}>
              {p.partial ? `${p.year} YTD` : p.year}
            </text>
            <circle
              cx={p.x}
              cy={p.y}
              r={on ? 6 : 4}
              strokeWidth={2}
              className={p.partial ? "fill-white stroke-maroon-700" : "fill-maroon-700 stroke-white"}
            />
            {/* Larger invisible hit target carries the hover readout */}
            <circle cx={p.x} cy={p.y} r={18} fill="transparent">
              <title>{`${yearLabel(p)}: ${formatNumber(p.value)}`}</title>
            </circle>
          </g>
        );
      })}
      <text x={focus.x} y={focus.y - 14} textAnchor="middle" className="fill-ink-900 text-[13px] font-semibold">
        {formatNumber(focus.value)}
      </text>
    </svg>
  );
}

/** Compact trend for a stat tile; the selected year gets a marker. */
export function Sparkline({ points, selected }: { points: Point[]; selected: number | "all" }) {
  const W = 120, H = 36, P = 5;
  const max = Math.max(...points.map((p) => p.value));
  const min = Math.min(...points.map((p) => p.value));
  const pts = points.map((p, i) => ({
    ...p,
    x: P + (i * (W - 2 * P)) / (points.length - 1),
    y: P + (1 - (p.value - min) / (max - min || 1)) * (H - 2 * P),
  }));
  const { solid, dashed, full } = linePaths(pts);
  const mark = selected === "all" ? full[full.length - 1] : pts.find((p) => p.year === selected)!;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-28 shrink-0" aria-hidden>
      <path d={solid} fill="none" className="stroke-maroon-700" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {dashed && <path d={dashed} fill="none" className="stroke-maroon-700" strokeWidth={2} strokeDasharray="3 3" strokeLinecap="round" />}
      <circle cx={mark.x} cy={mark.y} r={4} strokeWidth={2} className={`stroke-white ${mark.partial ? "fill-maroon-400" : "fill-maroon-700"}`} />
    </svg>
  );
}

/** Ranked horizontal bars of percentage growth, largest first, one hue. */
export function GrowthBars({ rows }: { rows: { label: string; from: number; to: number }[] }) {
  const data = rows
    .map((r) => ({ ...r, pct: Math.round(((r.to - r.from) / r.from) * 100) }))
    .sort((a, b) => b.pct - a.pct);
  const max = Math.max(...data.map((d) => Math.abs(d.pct)), 1);
  return (
    <ul className="space-y-4">
      {data.map((d) => (
        <li key={d.label} title={`${d.label}: ${formatNumber(d.from)} → ${formatNumber(d.to)}`}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-ink-900">{d.label}</span>
            <span className="shrink-0 text-ink-600">
              {formatNumber(d.from)} → {formatNumber(d.to)}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-3">
            <div className="h-5 flex-1">
              <div
                className={`h-full rounded-r ${d.pct >= 0 ? "bg-maroon-700" : "bg-maroon-400"}`}
                style={{ width: `${Math.max(2, (Math.abs(d.pct) / max) * 100)}%` }}
              />
            </div>
            <span className="w-14 shrink-0 text-right font-heading text-lg font-bold text-ink-900">
              {d.pct >= 0 ? "+" : "−"}
              {Math.abs(d.pct)}%
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Every figure by year — the table view behind the charts. */
export function ImpactTable({ data, selected }: { data: YearlyImpact[]; selected: number | "all" }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-ink-200/70">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink-200">
            <th scope="col" className="p-3 font-semibold text-ink-900">
              Measure
            </th>
            {data.map((y) => (
              <th key={y.year} scope="col" className={`p-3 text-right font-semibold ${y.year === selected ? "bg-maroon-50 text-maroon-700" : "text-ink-900"}`}>
                {y.year}
                {y.partial && <span className="block text-xs font-normal text-ink-600">year to date</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data[0].metrics.map((m, i) => (
            <tr key={m.label} className="border-b border-ink-200/60 last:border-0">
              <th scope="row" className="p-3 font-medium text-ink-900">
                {m.label}
              </th>
              {data.map((y) => (
                <td key={y.year} className={`p-3 text-right tabular-nums ${y.year === selected ? "bg-maroon-50 font-semibold" : "text-ink-600"}`}>
                  {formatNumber(y.metrics[i].value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
