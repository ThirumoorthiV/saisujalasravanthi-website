import type { KeyboardEvent } from "react";
import { INDIA_STATES, INDIA_VIEWBOX } from "@/data/indiaMap";

interface IndiaMapProps {
  /** Centres per state — states with a count are clickable */
  counts: Record<string, number>;
  /** States in the wider network, shaded but not clickable */
  network: string[];
  selected: string;
  onSelect: (state: string) => void;
}

/** Clickable India map (official boundaries). Selecting the active state again clears it. */
export function IndiaMap({ counts, network, selected, onSelect }: IndiaMapProps) {
  const toggle = (name: string) => onSelect(selected === name ? "" : name);
  const onKey = (e: KeyboardEvent, name: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(name);
    }
  };
  // Draw the selected state last so its outline sits on top of its neighbours.
  const ordered = [...INDIA_STATES].sort((a, b) => Number(a.name === selected) - Number(b.name === selected));
  const active = INDIA_STATES.filter((s) => counts[s.name]);

  return (
    <svg viewBox={INDIA_VIEWBOX} className="h-auto w-full" role="group" aria-label="Map of India showing states with our centres">
      {ordered.map((s) => {
        const count = counts[s.name];
        if (!count) {
          const inNetwork = network.includes(s.name);
          return (
            <path key={s.name} d={s.d} className={`stroke-white [stroke-width:1] ${inNetwork ? "fill-gold-500/45" : "fill-ink-200"}`}>
              <title>{inNetwork ? `${s.name} — wider Sai Swasthya network` : s.name}</title>
            </path>
          );
        }
        const isSel = selected === s.name;
        return (
          <path
            key={s.name}
            d={s.d}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={`${s.name}: ${count} ${count === 1 ? "centre" : "centres"}`}
            onClick={() => toggle(s.name)}
            onKeyDown={(e) => onKey(e, s.name)}
            className={`cursor-pointer outline-none transition-colors focus-visible:fill-maroon-600 focus-visible:stroke-gold-500 ${
              isSel ? "fill-maroon-900 stroke-gold-500 [stroke-width:4]" : "fill-maroon-700 stroke-white [stroke-width:1] hover:fill-maroon-600"
            }`}
          >
            <title>{`${s.name} — ${count} ${count === 1 ? "centre" : "centres"}`}</title>
          </path>
        );
      })}
      {active.map((s) => (
        <g key={s.name} className="pointer-events-none" aria-hidden>
          <circle cx={s.label[0]} cy={s.label[1]} r={36} className="fill-white stroke-gold-500 [stroke-width:4]" />
          <text x={s.label[0]} y={s.label[1]} textAnchor="middle" dominantBaseline="central" className="fill-maroon-700 font-heading text-[40px] font-bold">
            {counts[s.name]}
          </text>
        </g>
      ))}
    </svg>
  );
}
