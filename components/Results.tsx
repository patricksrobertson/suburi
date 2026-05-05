"use client";

import { Button } from "@/components/ui/button";
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
} from "@/lib/suburi";

type Props = {
  selected: SeriesId[];
  direction: Direction;
  mode: Mode;
  score: number;
  total: number;
  onAgain: () => void;
  onChange: () => void;
};

export function Results({
  selected,
  direction,
  mode,
  score,
  total,
  onAgain,
  onChange,
}: Props) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Deck complete</CardTitle>
        <CardDescription>
          {describeSelection(selected)} · {DIRECTION_HEADER[direction]} ·{" "}
          {MODE_LABEL[mode]}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="text-center">
          <div className="text-5xl font-semibold">
            {score}
            <span className="text-2xl text-muted-foreground">/{total}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">{pct}% correct</div>
        </div>
        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={onAgain}>
            Study this deck again
          </Button>
          <Button size="lg" variant="outline" onClick={onChange}>
            Change series or mode
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
