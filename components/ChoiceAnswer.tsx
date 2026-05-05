"use client";

import type { Suburi } from "@/lib/suburi";

type Props = {
  options: readonly Suburi[];
  label: (s: Suburi) => string;
  onPick: (answer: Suburi) => void;
};

export function ChoiceAnswer({ options, label, onPick }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <button
          key={opt.number}
          type="button"
          onClick={() => onPick(opt)}
          className="text-left rounded-lg border border-border bg-card px-4 py-3 text-base hover:bg-muted hover:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
        >
          {label(opt)}
        </button>
      ))}
    </div>
  );
}
