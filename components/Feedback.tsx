"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Suburi } from "@/lib/suburi";

type Props = {
  card: Suburi;
  userAnswer: string;
  correct: boolean;
  isLast: boolean;
  onNext: () => void;
};

export function Feedback({ card, userAnswer, correct, isLast, onNext }: Props) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle
          className={
            "text-xl " +
            (correct
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-destructive")
          }
        >
          {correct ? "Correct" : "Not quite"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {card.numberJa} ({card.number})
          </div>
          <div className="mt-1 text-lg font-medium">{card.nameEn}</div>
          <div className="mt-1 text-2xl font-mono">{card.nameJa}</div>
        </div>
        {!correct && (
          <div className="text-sm text-muted-foreground">
            You answered: <span className="font-mono">{userAnswer}</span>
          </div>
        )}
        <Button autoFocus size="lg" onClick={onNext} className="w-full">
          {isLast ? "See results" : "Next"}
        </Button>
      </CardContent>
    </Card>
  );
}
