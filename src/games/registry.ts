import type { GameDefinition } from "./types";
import { Snake } from "./snake/Snake";
import { Memory } from "./memory/Memory";

/**
 * Game registry. To add a game: create a component in src/games/<id>/
 * that accepts GameProps, then append its definition here.
 */
export const games: GameDefinition[] = [
  {
    id: "snake",
    title: "Serpiente",
    description: "Come, crece y no choques contigo mismo.",
    genre: "Arcade",
    controls: "Flechas o WASD",
    accent: "var(--neon-a)",
    component: Snake,
  },
  {
    id: "memory",
    title: "Memoria",
    description: "Encuentra todas las parejas en el menor número de intentos.",
    genre: "Puzle",
    controls: "Clic / toque",
    accent: "var(--neon-b)",
    component: Memory,
  },
];

export function getGame(id: string) {
  return games.find((g) => g.id === id);
}
