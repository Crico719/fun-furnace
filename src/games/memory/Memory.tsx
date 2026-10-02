import { useEffect, useState } from "react";
import type { GameProps } from "../types";

const SYMBOLS = ["★", "♦", "♣", "♥", "☀", "☂", "♫", "✿"];

function deal() {
  return [...SYMBOLS, ...SYMBOLS]
    .map((s) => ({ s, k: Math.random() }))
    .sort((a, b) => a.k - b.k)
    .map((c, i) => ({ id: i, s: c.s }));
}

export function Memory({ paused, onScore }: GameProps) {
  const [cards, setCards] = useState<{ id: number; s: string }[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [tries, setTries] = useState(0);

  useEffect(() => setCards(deal()), []);

  useEffect(() => {
    if (open.length !== 2) return;
    const a = open[0]!, b = open[1]!;
    const t = setTimeout(() => {
      if (cards[a]?.s === cards[b]?.s) setDone((d) => new Set([...d, a, b]));
      setOpen([]);
    }, 600);
    return () => clearTimeout(t);
  }, [open, cards]);

  const flip = (i: number) => {
    if (paused || open.length === 2 || open.includes(i) || done.has(i)) return;
    const n = [...open, i];
    setOpen(n);
    if (n.length === 2) {
      setTries((t) => t + 1);
      onScore?.(tries + 1);
    }
  };

  const won = cards.length > 0 && done.size === cards.length;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid w-[min(90vw,60vh)] grid-cols-4 gap-3">
        {cards.map((c, i) => {
          const shown = open.includes(i) || done.has(i);
          return (
            <button
              key={c.id}
              onClick={() => flip(i)}
              className={`aspect-square rounded-md border-2 text-4xl transition-all ${
                shown ? "border-accent bg-accent/15 text-accent" : "border-border bg-card hover:border-primary"
              } ${done.has(i) ? "opacity-50" : ""}`}
            >
              {shown ? c.s : ""}
            </button>
          );
        })}
      </div>
      <p className="font-display text-lg text-muted-foreground">
        {won ? `¡Completado en ${tries} intentos!` : `Intentos: ${tries}`}
      </p>
    </div>
  );
}
