import { GAMES } from "@/data/games";
import { GameCard } from "@/components/games/GameCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const FeaturedGames = () => {
  const featured = GAMES.slice(0, 12);
  
  return (
    <section id="games" className="container py-24">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <div className="text-sm text-yellow-500 font-bold uppercase tracking-widest mb-3">Featured Games</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Pick your battlefield</h2>
          <p className="text-muted-foreground mt-4 text-lg">Top up the most popular mobile games — instant delivery.</p>
        </div>
        <div>
          <Button variant="glass" className="border-yellow-500/30 hover:border-yellow-500/50" asChild>
            <Link to="/games">
              View All Games
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {featured.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} />
        ))}
      </div>
    </section>

  );
};

