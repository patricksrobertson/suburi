"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  LEVEL_LABEL,
  MODE_LABEL,
  type Level,
  type Mode,
} from "@/lib/suburi";
import { useState } from "react";

type Props = {
  onStart: (level: Level, mode: Mode) => void;
};

const LEVELS: Level[] = ["4-kyu", "3-kyu"];
const MODES: Mode[] = ["A", "B", "C"];

export function ModePicker({ onStart }: Props) {
  const [level, setLevel] = useState<Level>("4-kyu");
  const [mode, setMode] = useState<Mode>("A");

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Jo Suburi Flash Cards</CardTitle>
        <CardDescription>
          Pick a kyu level and a difficulty, then drill the deck.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <section>
          <h3 className="text-sm font-medium mb-2">Level</h3>
          <RadioGroup
            value={level}
            onValueChange={(v) => setLevel(v as Level)}
            className="gap-3"
          >
            {LEVELS.map((l) => (
              <Label key={l} className="cursor-pointer">
                <RadioGroupItem value={l} />
                {LEVEL_LABEL[l]}
              </Label>
            ))}
          </RadioGroup>
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
          onClick={() => onStart(level, mode)}
          className="w-full"
        >
          Start
        </Button>
      </CardContent>
    </Card>
  );
}
