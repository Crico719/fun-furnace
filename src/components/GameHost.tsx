import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Maximize, Minimize, Pause, Play, RotateCcw } from "lucide-react";
import type { GameDefinition } from "@/games/types";

export function GameHost({ game }: { game: GameDefinition }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [runId, setRunId] = useState(0);
  const [score, setScore] = useState(0);
  const [fs, setFs] = useState(false);
  const Game = game.component;

  useEffect(() => {
    const h = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "Escape") setPaused((p) => !p);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const restart = () => {
    setRunId((r) => r + 1);
    setScore(0);
    setPaused(false);
  };
  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else ref.current?.requestFullscreen?.();
  };
  const onScore = useCallback((s: number) => setScore(s), []);

  const btn = "inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary transition-colors";

  return (
    <div ref={ref} className="flex min-h-screen flex-col bg-background">
      <header className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <Link to="/" className={btn}><ArrowLeft className="h-4 w-4" />Catálogo</Link>
        <h1 className="mx-2 font-display text-xl tracking-wider" style={{ color: game.accent }}>{game.title}</h1>
        <span className="font-display text-sm text-muted-foreground">PUNTOS {score}</span>
        <div className="ml-auto flex gap-2">
          <button className={btn} onClick={() => setPaused((p) => !p)}>
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {paused ? "Reanudar" : "Pausar"}
          </button>
          <button className={btn} onClick={restart}><RotateCcw className="h-4 w-4" />Reiniciar</button>
          <button className={btn} onClick={toggleFs}>
            {fs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            {fs ? "Salir" : "Pantalla completa"}
          </button>
        </div>
      </header>
      <main className="relative flex flex-1 items-center justify-center p-4">
        <Game key={runId} paused={paused} onScore={onScore} />
        {paused && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 backdrop-blur-sm">
            <p className="font-display text-5xl tracking-widest text-primary">PAUSA</p>
            <button className={btn} onClick={() => setPaused(false)}><Play className="h-4 w-4" />Reanudar</button>
          </div>
        )}
      </main>
      <footer className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        Controles: {game.controls} · P / Esc para pausar
      </footer>
    </div>
  );
}
