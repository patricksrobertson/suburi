"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ChoiceAnswer } from "@/components/ChoiceAnswer";
import { TypedAnswer } from "@/components/TypedAnswer";

import { pickOptions } from "@/lib/distractors";
import { answersMatch } from "@/lib/normalize";
import { shuffle } from "@/lib/shuffle";
import { MODE_LABEL, numberFormsFor, type Mode } from "@/lib/suburi";
import {
  NUMBERS_DECKS,
  NUMBERS_DECK_LABEL,
  NUMBERS_DIRECTIONS,
  NUMBERS_DIRECTION_HEADER,
  NUMBERS_DIRECTION_HELP,
  NUMBERS_DIRECTION_LABEL,
  numbersDeckFor,
  type NumbersCard,
  type NumbersDeckId,
  type NumbersDirection,
} from "@/lib/numbers";

const MODES: Mode[] = ["A", "B", "C"];

type State =
  | { kind: "picking" }
  | {
      kind: "playing";
      deckId: NumbersDeckId;
      direction: NumbersDirection;
      mode: Mode;
      deck: NumbersCard[];
      index: number;
      score: number;
    }
  | {
      kind: "feedback";
      deckId: NumbersDeckId;
      direction: NumbersDirection;
      mode: Mode;
      deck: NumbersCard[];
      index: number;
      score: number;
      userAnswer: string;
      correct: boolean;
    }
  | {
      kind: "done";
      deckId: NumbersDeckId;
      direction: NumbersDirection;
      mode: Mode;
      score: number;
      total: number;
    };

export function NumbersQuiz() {
  const [state, setState] = useState<State>({ kind: "picking" });

  const start = (
    deckId: NumbersDeckId,
    direction: NumbersDirection,
    mode: Mode,
  ) => {
    setState({
      kind: "playing",
      deckId,
      direction,
      mode,
      deck: shuffle(numbersDeckFor(deckId)),
      index: 0,
      score: 0,
    });
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
      {state.kind === "picking" && <Picker onStart={start} />}
      {state.kind === "playing" && <Playing state={state} setState={setState} />}
      {state.kind === "feedback" && (
        <FeedbackView state={state} setState={setState} />
      )}
      {state.kind === "done" && (
        <Results
          deckId={state.deckId}
          direction={state.direction}
          mode={state.mode}
          score={state.score}
          total={state.total}
          onAgain={() => start(state.deckId, state.direction, state.mode)}
          onChange={() => setState({ kind: "picking" })}
        />
      )}
    </main>
  );
}

function Picker({
  onStart,
}: {
  onStart: (
    deckId: NumbersDeckId,
    direction: NumbersDirection,
    mode: Mode,
  ) => void;
}) {
  const [deckId, setDeckId] = useState<NumbersDeckId>("1-10");
  const [direction, setDirection] = useState<NumbersDirection>("japanese");
  const [mode, setMode] = useState<Mode>("A");

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Japanese Number Drill</CardTitle>
        <CardDescription>
          Pick a deck, what you&apos;re answering, and a difficulty.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <section>
          <h3 className="text-sm font-medium mb-2">Deck</h3>
          <RadioGroup
            value={deckId}
            onValueChange={(v) => setDeckId(v as NumbersDeckId)}
            className="gap-3"
          >
            {NUMBERS_DECKS.map((d) => (
              <Label key={d} className="cursor-pointer">
                <RadioGroupItem value={d} />
                {NUMBERS_DECK_LABEL[d]}
              </Label>
            ))}
          </RadioGroup>
        </section>

        <section>
          <h3 className="text-sm font-medium mb-2">Answering</h3>
          <div
            role="radiogroup"
            aria-label="Answering"
            className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
          >
            {NUMBERS_DIRECTIONS.map((d) => (
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
                {NUMBERS_DIRECTION_LABEL[d]}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {NUMBERS_DIRECTION_HELP[direction]}
          </p>
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
          onClick={() => onStart(deckId, direction, mode)}
          className="w-full"
        >
          Start
        </Button>

        <Link
          href="/"
          className="text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          ← Switch to suburi quiz
        </Link>
      </CardContent>
    </Card>
  );
}

function Playing({
  state,
  setState,
}: {
  state: Extract<State, { kind: "playing" }>;
  setState: (s: State) => void;
}) {
  const card = state.deck[state.index];
  const fullPool = useMemo(() => numbersDeckFor(state.deckId), [state.deckId]);

  const options = useMemo(() => {
    if (state.mode === "A") return pickOptions(card, fullPool, 3);
    if (state.mode === "B") return pickOptions(card, fullPool, 10);
    return [];
  }, [card, fullPool, state.mode]);

  const judge = (correct: boolean, userAnswer: string) => {
    setState({
      kind: "feedback",
      deckId: state.deckId,
      direction: state.direction,
      mode: state.mode,
      deck: state.deck,
      index: state.index,
      score: state.score + (correct ? 1 : 0),
      userAnswer,
      correct,
    });
  };

  const onPick = (picked: NumbersCard) => {
    const userAnswer =
      state.direction === "japanese" ? picked.numberJa : String(picked.number);
    judge(picked.number === card.number, userAnswer);
  };

  const onType = (typed: string) => {
    let correct: boolean;
    if (state.direction === "japanese") {
      correct = numberFormsFor(card.number).some((form) =>
        answersMatch(typed, form),
      );
    } else {
      correct = answersMatch(typed, String(card.number));
    }
    judge(correct, typed);
  };

  return (
    <QuizCard
      deckId={state.deckId}
      direction={state.direction}
      mode={state.mode}
      card={card}
      options={options}
      index={state.index}
      total={state.deck.length}
      score={state.score}
      onPick={onPick}
      onType={onType}
    />
  );
}

function QuizCard({
  deckId,
  direction,
  mode,
  card,
  options,
  index,
  total,
  score,
  onPick,
  onType,
}: {
  deckId: NumbersDeckId;
  direction: NumbersDirection;
  mode: Mode;
  card: NumbersCard;
  options: readonly NumbersCard[];
  index: number;
  total: number;
  score: number;
  onPick: (picked: NumbersCard) => void;
  onType: (typed: string) => void;
}) {
  const choiceLabel =
    direction === "japanese"
      ? (c: NumbersCard) => c.numberJa
      : (c: NumbersCard) => String(c.number);

  const placeholder =
    direction === "japanese"
      ? "type the romaji…"
      : "type the arabic numeral…";

  const promptCaption =
    direction === "japanese" ? "number" : "japanese number";
  const promptValue =
    direction === "japanese" ? String(card.number) : card.numberJa;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base gap-3">
          <span className="truncate">
            Numbers {NUMBERS_DECK_LABEL[deckId]} ·{" "}
            {NUMBERS_DIRECTION_HEADER[direction]} · {MODE_LABEL[mode]}
          </span>
          <span className="text-sm font-normal text-muted-foreground shrink-0">
            {index + 1} / {total} · {score} ✓
          </span>
        </CardTitle>
        <CardDescription>
          {direction === "japanese"
            ? "Give the japanese (romaji) for this number."
            : "Give the arabic numeral for this number."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg border border-border bg-muted/40 p-5 text-center">
          <div className="text-sm text-muted-foreground">{promptCaption}</div>
          <div className="mt-1 text-3xl font-semibold tracking-wide">
            {promptValue}
          </div>
        </div>
        {mode === "C" ? (
          <TypedAnswer
            key={card.number}
            placeholder={placeholder}
            onSubmit={onType}
          />
        ) : (
          <ChoiceAnswer options={options} label={choiceLabel} onPick={onPick} />
        )}
      </CardContent>
    </Card>
  );
}

function FeedbackView({
  state,
  setState,
}: {
  state: Extract<State, { kind: "feedback" }>;
  setState: (s: State) => void;
}) {
  const card = state.deck[state.index];
  const isLast = state.index + 1 >= state.deck.length;

  const next = () => {
    if (isLast) {
      setState({
        kind: "done",
        deckId: state.deckId,
        direction: state.direction,
        mode: state.mode,
        score: state.score,
        total: state.deck.length,
      });
    } else {
      setState({
        kind: "playing",
        deckId: state.deckId,
        direction: state.direction,
        mode: state.mode,
        deck: state.deck,
        index: state.index + 1,
        score: state.score,
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle
          className={
            "text-xl " +
            (state.correct
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-destructive")
          }
        >
          {state.correct ? "Correct" : "Not quite"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg border border-border bg-muted/40 p-4 text-center">
          <div className="text-2xl font-mono">{card.numberJa}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            ({card.number})
          </div>
        </div>
        {!state.correct && (
          <div className="text-sm text-muted-foreground">
            You answered: <span className="font-mono">{state.userAnswer}</span>
          </div>
        )}
        <Button autoFocus size="lg" onClick={next} className="w-full">
          {isLast ? "See results" : "Next"}
        </Button>
      </CardContent>
    </Card>
  );
}

function Results({
  deckId,
  direction,
  mode,
  score,
  total,
  onAgain,
  onChange,
}: {
  deckId: NumbersDeckId;
  direction: NumbersDirection;
  mode: Mode;
  score: number;
  total: number;
  onAgain: () => void;
  onChange: () => void;
}) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Deck complete</CardTitle>
        <CardDescription>
          Numbers {NUMBERS_DECK_LABEL[deckId]} ·{" "}
          {NUMBERS_DIRECTION_HEADER[direction]} · {MODE_LABEL[mode]}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="text-center">
          <div className="text-5xl font-semibold">
            {score}
            <span className="text-2xl text-muted-foreground">/{total}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {pct}% correct
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={onAgain}>
            Study this deck again
          </Button>
          <Button size="lg" variant="outline" onClick={onChange}>
            Change deck or mode
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
