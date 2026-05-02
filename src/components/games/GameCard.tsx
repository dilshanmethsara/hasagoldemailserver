import { Link } from "react-router-dom";
import { Star, TrendingUp, ArrowRight, Lock } from "lucide-react";
import { Game } from "@/data/games";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const GameCard = ({ game, index = 0 }: { game: Game; index?: number }) => {
  const { user, isEmailVerified } = useAuth();
  const isComingSoon = game.status === "coming-soon";
  const isBlocked = !isEmailVerified && user;

  const handleCardClick = (e: React.MouseEvent) => {
    if (isComingSoon) {
      e.preventDefault();
      return;
    }
    
    if (isBlocked) {
      e.preventDefault();
      toast.error("Please verify your email before making top-ups. Check your inbox for the verification link.");
      return;
    }
  };

  return (
    <motion.div
      whileHover={!isComingSoon && !isBlocked ? { y: -8, scale: 1.02 } : {}}
      className={`group ${isComingSoon || isBlocked ? "cursor-not-allowed" : ""}`}
    >
      <Link
        to={isComingSoon || isBlocked ? "#" : `/topup/${game.id}`}
        onClick={handleCardClick}
        className={`relative block rounded-2xl overflow-hidden bg-gradient-card border border-white/5 shadow-card transition-all duration-500 ease-out ${
          isComingSoon 
            ? "grayscale opacity-80" 
            : isBlocked
            ? "opacity-70"
            : "hover:shadow-glow hover:border-yellow-500/40"
        }`}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={game.image}
            alt={`${game.name} cover`}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              !isComingSoon && !isBlocked ? "group-hover:scale-110" : ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80" />
          
          {isComingSoon && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white font-bold text-sm uppercase tracking-widest shadow-2xl">
                Coming Soon
              </div>
            </div>
          )}

          {isBlocked && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-warning/20 text-warning font-bold text-sm uppercase tracking-widest shadow-2xl flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Verify Email
              </div>
            </div>
          )}

          <Badge className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white border-white/10">
            {game.category}
          </Badge>
          
          {!isComingSoon && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md text-xs text-white">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {game.rating}
            </div>
          )}
        </div>

        <div className="p-4 space-y-2 relative bg-card/80 backdrop-blur-sm">
          <div>
            <h3 className={`font-display font-bold text-lg leading-tight transition-colors ${
              !isComingSoon ? "group-hover:text-yellow-500" : "text-muted-foreground"
            }`}>
              {game.name}
            </h3>
            <p className="text-xs text-muted-foreground">{game.publisher}</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              {isComingSoon ? "Scheduled" : `${game.orders} orders`}
            </div>
            {!isComingSoon && !isBlocked && (
              <div className="flex items-center gap-1 text-sm font-medium text-primary transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                Top Up
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            )}
            {isBlocked && (
              <div className="flex items-center gap-1 text-xs font-medium text-warning">
                <Lock className="h-3 w-3" />
                Locked
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


