import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Free Fire pro player",
    content: "Got my diamonds in literally 12 seconds. Cheaper than in-app and zero hassle. HASA GOLD STORE is my go-to now.",
    avatar: "AR",
  },
  {
    name: "Priya Sharma",
    role: "Mobile Legends streamer",
    content: "I've used a dozen top-up sites. This one is the cleanest, fastest, and the support actually responds.",
    avatar: "PS",
  },
  {
    name: "Marcus Chen",
    role: "PUBG Mobile veteran",
    content: "The 18% discount on big UC packs is unreal. Saved over $200 last month alone. Highly recommend.",
    avatar: "MC",
  },
];

export const Testimonials = () => {
  return (
    <section className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="text-sm text-primary font-bold uppercase tracking-widest mb-3">Testimonials</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">Loved by the community</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className="glass-strong rounded-3xl p-8 border-white/5 hover:border-white/10 transition-all duration-300"
          >

            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-foreground/90 mb-6 leading-relaxed italic text-lg">"{t.content}"</p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-glow">
                {t.avatar}
              </div>
              <div>
                <div className="font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

