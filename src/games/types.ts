import type { ComponentType } from "react";

/** Props every game component receives from the host container. */
export interface GameProps {
  /** True while the host has paused the game. Games must freeze loops/input. */
  paused: boolean;
  /** Report score changes back to the host HUD (optional). */
  onScore?: (score: number) => void;
}

export interface GameDefinition {
  id: string;
  title: string;
  description: string;
  genre: string;
  controls: string;
  accent: string; // CSS color token variable name, e.g. "var(--neon-a)"
  component: ComponentType<GameProps>;
}
