"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DIRECTION_HEADER,
  MODE_LABEL,
  describeSelection,
  type Direction,
  type Mode,
  type SeriesId,
  type Suburi,
} from "@/lib/suburi";
import { ChoiceAnswer } from "./ChoiceAnswer";
import { TypedAnswer } from "./TypedAnswer";

type Props = {
  selected: SeriesId[];
  direction: Direction;
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
  direction,
  mode,
  card,
  options,
  index,
  total,
  score,
  onPick,
  onType,
}: Props) {
  const choiceLabel =
    direction === "name"
      ? (s: Suburi) => s.nameJa
      : (s: Suburi) => `${s.numberJa} (${s.number})`;

  const typedPlaceholder =
    direction === "name"
      ? "type the japanese name…"
      : "type the japanese number…";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base gap-3">
          <span className="truncate">
            {describeSelection(selected)} · {DIRECTION_HEADER[direction]} ·{" "}
            {MODE_LABEL[mode]}
          </span>
          <span className="text-sm font-normal text-muted-foreground shrink-0">
            {index + 1} / {total} · {score} ✓
          </span>
        </CardTitle>
        <CardDescription>{prompt(direction, mode)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <PromptDisplay direction={direction} mode={mode} card={card} />
        {mode === "C" ? (
          <TypedAnswer
            key={card.number}
            placeholder={typedPlaceholder}
            onSubmit={onType}
          />
        ) : (
          <ChoiceAnswer options={options} label={choiceLabel} onPick={onPick} />
        )}
      </CardContent>
    </Card>
  );
}

function prompt(direction: Direction, mode: Mode): string {
  if (direction === "name") {
    switch (mode) {
      case "A":
        return "Pick the japanese name for this technique.";
      case "B":
        return "Pick the japanese name from the list of 10.";
      case "C":
        return "Type the japanese name in romaji.";
    }
  }
  switch (mode) {
    case "A":
      return "Pick the japanese number for this technique.";
    case "B":
      return "Pick the japanese number from the list of 10.";
    case "C":
      return "Type the japanese number in romaji.";
  }
}

function PromptDisplay({
  direction,
  mode,
  card,
}: {
  direction: Direction;
  mode: Mode;
  card: Suburi;
}) {
  if (direction === "name") {
    if (mode === "A") {
      return (
        <Frame caption={`number ${card.number}`}>
          <div className="text-2xl font-medium">{card.nameEn}</div>
        </Frame>
      );
    }
    if (mode === "B") {
      return (
        <Frame caption="number">
          <div className="text-3xl font-semibold tracking-wide">
            {card.numberJa} ({card.number})
          </div>
        </Frame>
      );
    }
    return (
      <Frame caption="japanese number">
        <div className="text-3xl font-semibold tracking-wide">
          {card.numberJa}
        </div>
      </Frame>
    );
  }

  // direction === "number"
  if (mode === "A") {
    return (
      <Frame caption={card.nameEn}>
        <div className="text-2xl font-mono">{card.nameJa}</div>
      </Frame>
    );
  }
  // B and C: name only, no en hint
  return (
    <Frame caption="japanese name">
      <div className="text-2xl font-mono">{card.nameJa}</div>
    </Frame>
  );
}

function Frame({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-5 text-center">
      <div className="text-sm text-muted-foreground">{caption}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
