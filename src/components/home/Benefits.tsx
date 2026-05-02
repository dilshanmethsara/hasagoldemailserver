import { Zap, ShieldCheck, Headphones, BadgePercent, CreditCard, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  { icon: Zap, title: "Instant Delivery", desc: "Most orders complete in under 30 seconds, automatically." },
  { icon: ShieldCheck, title: "100% Secure", desc: "End-to-end encrypted payments. Your data stays private." },
  { icon: BadgePercent, title: "Best Prices", desc: "Up to 18% off compared to in-game prices, every day." },
  { icon: Headphones, title: "24/7 Support", desc: "Live chat with real humans whenever you need help." },
  { icon: CreditCard, title: "All Payment Methods", desc: "Cards, wallets, crypto and local methods supported." },
  { icon: Globe2, title: "Global Coverage", desc: "Top up from 150+ countries with localized currencies." },
];

export const Benefits = () => {
  return (
    <section className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="text-sm text-primary font-bold uppercase tracking-widest mb-3">Why HASA GOLD STORE</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">Built for serious gamers</h2>
        <p className="text-muted-foreground mt-4 text-lg">Everything you need to keep playing — without the wait.</p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="group relative glass-strong rounded-3xl p-8 border-white/5 hover:border-primary/30 transition-all duration-300"
          >
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-transparent transition-all duration-300 shadow-glow group-hover:shadow-glow-accent">
              <b.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-display font-bold text-xl mb-3">{b.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};


