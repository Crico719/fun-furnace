import { createFileRoute, Link } from "@tanstack/react-router";
import { games } from "@/games/registry";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arcadia — Catálogo de juegos" },
      { name: "description", content: "Elige un juego y juega al instante en pantalla completa." },
      { property: "og:title", content: "Arcadia — Catálogo de juegos" },
      { property: "og:description", content: "Elige un juego y juega al instante en pantalla completa." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen px-6 py-12 md:px-16">
      <header className="mb-12">
        <p className="font-display text-sm tracking-[0.3em] text-accent">INSERTA MONEDA</p>
        <h1 className="font-display text-6xl tracking-wider text-primary md:text-8xl">ARCADIA</h1>
        <p className="mt-2 max-w-lg text-muted-foreground">
          Tu sala de juegos. Elige un título y se abrirá en su propia vista con controles.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g, i) => (
          <Link
            key={g.id}
            to="/play/$gameId"
            params={{ gameId: g.id }}
            className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-6 transition-all hover:-translate-y-1"
            style={{ ["--a" as string]: g.accent }}
          >
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: g.accent }} />
            <p className="font-display text-xs tracking-widest text-muted-foreground">
              {String(i + 1).padStart(2, "0")} · {g.genre.toUpperCase()}
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-wide" style={{ color: g.accent }}>{g.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{g.description}</p>
            <p className="mt-6 font-display text-sm tracking-widest text-foreground group-hover:text-accent">
              ▶ JUGAR
            </p>
          </Link>
        ))}
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Más juegos próximamente
        </div>
      </div>
    </div>
  );
}
