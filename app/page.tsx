"use client";

import { ModePicker } from "@/components/ModePicker";
import { QuizCard } from "@/components/QuizCard";
import { Feedback } from "@/components/Feedback";
import { Results } from "@/components/Results";
import {
  deckFor,
  type Level,
  type Mode,
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
      level: Level;
      mode: Mode;
      deck: Suburi[];
      index: number;
      score: number;
    }
  | {
      kind: "feedback";
      level: Level;
      mode: Mode;
      deck: Suburi[];
      index: number;
      score: number;
      userAnswer: string;
      correct: boolean;
    }
  | {
      kind: "done";
      level: Level;
      mode: Mode;
      score: number;
      total: number;
    };

export default function Home() {
  const [state, setState] = useState<State>({ kind: "picking" });

  const start = (level: Level, mode: Mode) => {
    setState({
      kind: "playing",
      level,
      mode,
      deck: shuffle(deckFor(level)),
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
          level={state.level}
          mode={state.mode}
          score={state.score}
          total={state.total}
          onAgain={() => start(state.level, state.mode)}
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
  const fullPool = deckFor(state.level);

  const options = useMemo(() => {
    if (state.mode === "A") return pickOptions(card, fullPool, 3);
    if (state.mode === "B") return pickOptions(card, fullPool, Math.min(fullPool.length, 10));
    return [];
  }, [card, fullPool, state.mode]);

  const judge = (correct: boolean, userAnswer: string) => {
    setState({
      kind: "feedback",
      level: state.level,
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
      level={state.level}
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
        level: state.level,
        mode: state.mode,
        score: state.score,
        total: state.deck.length,
      });
    } else {
      setState({
        kind: "playing",
        level: state.level,
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
