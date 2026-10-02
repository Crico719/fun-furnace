import { useEffect, useRef, useState } from "react";
import type { GameProps } from "../types";

const N = 20;
type P = { x: number; y: number };

function randFood(snake: P[]): P {
  while (true) {
    const p = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
}

export function Snake({ paused, onScore }: GameProps) {
  const [snake, setSnake] = useState<P[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<P>({ x: 5, y: 5 });
  const [over, setOver] = useState(false);
  const dir = useRef<P>({ x: 1, y: 0 });
  const next = useRef<P>({ x: 1, y: 0 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, P> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      if (d.x === -dir.current.x && d.y === -dir.current.y) return;
      next.current = d;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (paused || over) return;
    const t = setInterval(() => {
      setSnake((s) => {
        dir.current = next.current;
        const h0 = s[0]!;
        const head = { x: h0.x + dir.current.x, y: h0.y + dir.current.y };
        if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || s.some((p) => p.x === head.x && p.y === head.y)) {
          setOver(true);
          return s;
        }
        const ate = head.x === food.x && head.y === food.y;
        const ns = [head, ...s];
        if (ate) {
          setFood(randFood(ns));
          onScore?.(ns.length - 1);
        } else ns.pop();
        return ns;
      });
    }, 110);
    return () => clearInterval(t);
  }, [paused, over, food, onScore]);

  const steer = (d: P) => {
    if (d.x === -dir.current.x && d.y === -dir.current.y) return;
    next.current = d;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative grid aspect-square w-[min(80vw,70vh)] border-2 border-primary/60 bg-card"
        style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
      >
        {Array.from({ length: N * N }).map((_, i) => {
          const x = i % N, y = Math.floor(i / N);
          const isS = snake.some((p) => p.x === x && p.y === y);
          const isF = food.x === x && food.y === y;
          return <div key={i} className={isS ? "bg-primary" : isF ? "rounded-full bg-accent" : ""} />;
        })}
        {over && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 font-display text-2xl text-accent">
            FIN · reinicia para jugar
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 md:hidden">
        <span />
        <button className="rounded border px-4 py-2" onClick={() => steer({ x: 0, y: -1 })}>▲</button>
        <span />
        <button className="rounded border px-4 py-2" onClick={() => steer({ x: -1, y: 0 })}>◀</button>
        <button className="rounded border px-4 py-2" onClick={() => steer({ x: 0, y: 1 })}>▼</button>
        <button className="rounded border px-4 py-2" onClick={() => steer({ x: 1, y: 0 })}>▶</button>
      </div>
    </div>
  );
}
