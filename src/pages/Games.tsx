import { useMemo, useState } from "react";
import { GAMES } from "@/data/games";
import { GameCard } from "@/components/games/GameCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["All", "Battle Royale", "MOBA", "Shooter", "Strategy", "RPG"] as const;

const Games = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    return GAMES.filter((g) => {
      const matchQ = g.name.toLowerCase().includes(q.toLowerCase()) || g.publisher.toLowerCase().includes(q.toLowerCase());
      const matchC = cat === "All" || g.category === cat;
      return matchQ && matchC;
    });
  }, [q, cat]);

  return (
    <div className="container py-12">
      <div className="mb-10 animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Browse all games</h1>
        <p className="text-muted-foreground">Find your game and top up instantly.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search games or publishers..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10 h-12 bg-card/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {categories.map((c) => (
            <Button
              key={c}
              variant={cat === c ? "hero" : "glass"}
              size="sm"
              onClick={() => setCat(c)}
              className="shrink-0"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No games found. Try a different search.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map((g, i) => (
            <GameCard key={g.id} game={g} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Games;
