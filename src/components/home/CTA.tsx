import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const CTA = () => {
  return (
    <section className="container py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-card border border-white/10 p-12 md:p-20 text-center shadow-glow-accent">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        
        <div className="relative z-10">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
            Ready to <span className="text-gradient">level up?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Join 2 million gamers who trust HASA GOLD STORE for instant, secure top-ups every day.
          </p>
          <div className="w-full max-w-sm mx-auto md:max-w-none">
            <Button variant="hero" size="xl" className="group w-full md:w-auto px-6 md:px-10 py-6 md:py-8 text-base md:text-lg h-auto whitespace-normal" asChild>
              <Link to="/games" className="flex items-center justify-center">
                <span>Start Your First Top-Up</span>
                <ArrowRight className="h-5 w-5 md:h-6 md:w-6 ml-2 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};


