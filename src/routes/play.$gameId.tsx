import { createFileRoute, notFound } from "@tanstack/react-router";
import { getGame } from "@/games/registry";
import { GameHost } from "@/components/GameHost";

export const Route = createFileRoute("/play/$gameId")({
  loader: ({ params }) => {
    const g = getGame(params.gameId);
    if (!g) throw notFound();
    return { id: g.id, title: g.title, description: g.description };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title} — Arcadia` : "Juego no encontrado — Arcadia";
    const d = loaderData?.description ?? "Este juego no existe.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: PlayPage,
});

function PlayPage() {
  const { gameId } = Route.useParams();
  return <GameHost game={getGame(gameId)!} />;
}
