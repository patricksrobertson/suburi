"use client";

import { ModePicker } from "@/components/ModePicker";
import { QuizCard } from "@/components/QuizCard";
import { Feedback } from "@/components/Feedback";
import { Results } from "@/components/Results";
import {
  SUBURI,
  deckForSelection,
  type Mode,
  type SeriesId,
  type Suburi,
} from "@/lib/suburi";
import { shuffle } from "@/lib/shuffle";
import { pickOptions } from "@/lib/distractors";
import { answersMatch } from "@/lib/normalize";
import { useMemo, useState } from "react";

type State =
  | { kind: "picking" }
  | {
      kind: "playing";
      selected: SeriesId[];
      mode: Mode;
      deck: Suburi[];
      index: number;
      score: number;
    }
  | {
      kind: "feedback";
      selected: SeriesId[];
      mode: Mode;
      deck: Suburi[];
      index: number;
      score: number;
      userAnswer: string;
      correct: boolean;
    }
  | {
      kind: "done";
      selected: SeriesId[];
      mode: Mode;
      score: number;
      total: number;
    };

export default function Home() {
  const [state, setState] = useState<State>({ kind: "picking" });

  const start = (selected: SeriesId[], mode: Mode) => {
    setState({
      kind: "playing",
      selected,
      mode,
      deck: shuffle(deckForSelection(selected)),
      index: 0,
      score: 0,
    });
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
      {state.kind === "picking" && <ModePicker onStart={start} />}
      {state.kind === "playing" && <Playing state={state} setState={setState} />}
      {state.kind === "feedback" && (
        <FeedbackView state={state} setState={setState} />
      )}
      {state.kind === "done" && (
        <Results
          selected={state.selected}
          mode={state.mode}
          score={state.score}
          total={state.total}
          onAgain={() => start(state.selected, state.mode)}
          onChange={() => setState({ kind: "picking" })}
        />
      )}
    </main>
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

  const options = useMemo(() => {
    if (state.mode === "A") return pickOptions(card, SUBURI, 3);
    if (state.mode === "B") return pickOptions(card, SUBURI, 10);
    return [];
  }, [card, state.mode]);

  const judge = (correct: boolean, userAnswer: string) => {
    setState({
      kind: "feedback",
      selected: state.selected,
      mode: state.mode,
      deck: state.deck,
      index: state.index,
      score: state.score + (correct ? 1 : 0),
      userAnswer,
      correct,
    });
  };

  return (
    <QuizCard
      selected={state.selected}
      mode={state.mode}
      card={card}
      options={options}
      index={state.index}
      total={state.deck.length}
      score={state.score}
      onPick={(picked) => judge(picked.number === card.number, picked.nameJa)}
      onType={(typed) => judge(answersMatch(typed, card.nameJa), typed)}
    />
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
        selected: state.selected,
        mode: state.mode,
        score: state.score,
        total: state.deck.length,
      });
    } else {
      setState({
        kind: "playing",
        selected: state.selected,
        mode: state.mode,
        deck: state.deck,
        index: state.index + 1,
        score: state.score,
      });
    }
  };

  return (
    <Feedback
      card={card}
      userAnswer={state.userAnswer}
      correct={state.correct}
      isLast={isLast}
      onNext={next}
    />
  );
}
