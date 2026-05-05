"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DIRECTION_LABEL,
  MODE_LABEL,
  SERIES,
  type Direction,
  type Mode,
  type SeriesId,
} from "@/lib/suburi";
import { useState } from "react";

type Props = {
  onStart: (selected: SeriesId[], direction: Direction, mode: Mode) => void;
};

const MODES: Mode[] = ["A", "B", "C"];
const DIRECTIONS: Direction[] = ["name", "number"];

export function ModePicker({ onStart }: Props) {
  const [selected, setSelected] = useState<Set<SeriesId>>(
    () => new Set(SERIES.map((s) => s.id)),
  );
  const [direction, setDirection] = useState<Direction>("name");
  const [mode, setMode] = useState<Mode>("A");

  const toggle = (id: SeriesId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = selected.size === SERIES.length;
  const noneSelected = selected.size === 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Jo Suburi Flash Cards</CardTitle>
        <CardDescription>
          Pick which series to drill, the quiz direction, and a difficulty.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Series</h3>
            <button
              type="button"
              onClick={() =>
                setSelected(
                  allSelected ? new Set() : new Set(SERIES.map((s) => s.id)),
                )
              }
              className="text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              {allSelected ? "Clear all" : "Select all"}
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {SERIES.map((s) => (
              <Label key={s.id} className="cursor-pointer items-start gap-3">
                <Checkbox
                  checked={selected.has(s.id)}
                  onCheckedChange={() => toggle(s.id)}
                />
                <span className="flex flex-col gap-0.5 leading-tight">
                  <span className="font-medium">{s.nameJa}</span>
                  <span className="text-xs text-muted-foreground">
                    {s.nameEn} · #{s.range[0]}–{s.range[1]}
                  </span>
                </span>
              </Label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium mb-2">Direction</h3>
          <div
            role="radiogroup"
            aria-label="Direction"
            className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
          >
            {DIRECTIONS.map((d) => (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={direction === d}
                onClick={() => setDirection(d)}
                className={
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors " +
                  (direction === d
                    ? "bg-background text-foreground ring-1 ring-foreground/10"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {DIRECTION_LABEL[d]}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium mb-2">Mode</h3>
          <RadioGroup
            value={mode}
            onValueChange={(v) => setMode(v as Mode)}
            className="gap-3"
          >
            {MODES.map((m) => (
              <Label key={m} className="cursor-pointer">
                <RadioGroupItem value={m} />
                {MODE_LABEL[m]}
              </Label>
            ))}
          </RadioGroup>
        </section>

        <Button
          size="lg"
          onClick={() => onStart([...selected], direction, mode)}
          disabled={noneSelected}
          className="w-full"
        >
          Start
        </Button>
      </CardContent>
    </Card>
  );
}
