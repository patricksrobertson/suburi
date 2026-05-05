"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  MODE_LABEL,
  describeSelection,
  type Mode,
  type SeriesId,
  type Suburi,
} from "@/lib/suburi";
import { ChoiceAnswer } from "./ChoiceAnswer";
import { TypedAnswer } from "./TypedAnswer";

type Props = {
  selected: SeriesId[];
  mode: Mode;
  card: Suburi;
  options: readonly Suburi[];
  index: number;
  total: number;
  score: number;
  onPick: (answer: Suburi) => void;
  onType: (typed: string) => void;
};

export function QuizCard({
  selected,
  mode,
  card,
  options,
  index,
  total,
  score,
  onPick,
  onType,
}: Props) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base gap-3">
          <span className="truncate">
            {describeSelection(selected)} · {MODE_LABEL[mode]}
          </span>
          <span className="text-sm font-normal text-muted-foreground shrink-0">
            {index + 1} / {total} · {score} ✓
          </span>
        </CardTitle>
        <CardDescription>{prompt(mode)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <PromptDisplay mode={mode} card={card} />
        {mode === "C" ? (
          <TypedAnswer key={card.number} onSubmit={onType} />
        ) : (
          <ChoiceAnswer options={options} onPick={onPick} />
        )}
      </CardContent>
    </Card>
  );
}

function prompt(mode: Mode): string {
  switch (mode) {
    case "A":
      return "Pick the japanese name for this technique.";
    case "B":
      return "Pick the japanese name from the list of 10.";
    case "C":
      return "Type the japanese name in romaji.";
  }
}

function PromptDisplay({ mode, card }: { mode: Mode; card: Suburi }) {
  if (mode === "A") {
    return (
      <div className="rounded-lg border border-border bg-muted/40 p-5 text-center">
        <div className="text-sm text-muted-foreground">number {card.number}</div>
        <div className="mt-1 text-2xl font-medium">{card.nameEn}</div>
      </div>
    );
  }
  if (mode === "B") {
    return (
      <div className="rounded-lg border border-border bg-muted/40 p-5 text-center">
        <div className="text-sm text-muted-foreground">number</div>
        <div className="mt-1 text-3xl font-semibold tracking-wide">
          {card.numberJa} ({card.number})
        </div>
      </div>
    );
  }
  // C
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-5 text-center">
      <div className="text-sm text-muted-foreground">japanese number</div>
      <div className="mt-1 text-3xl font-semibold tracking-wide">
        {card.numberJa}
      </div>
    </div>
  );
}
