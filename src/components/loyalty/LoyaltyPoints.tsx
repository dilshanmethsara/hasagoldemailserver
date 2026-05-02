import { Star, Gift, Trophy, Zap, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const LoyaltyPoints = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-6"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-primary font-bold">NEW FEATURE</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl font-black mb-6"
          >
            Loyalty Points
            <span className="text-gradient"> Coming Soon</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Earn rewards with every top-up! Get ready for our exclusive loyalty program where your gaming passion pays off.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Star,
              title: "Earn Points",
              description: "Get points with every game top-up purchase",
              color: "text-yellow-500"
            },
            {
              icon: Gift,
              title: "Redeem Rewards",
              description: "Exchange points for exclusive in-game items and discounts",
              color: "text-purple-500"
            },
            {
              icon: Trophy,
              title: "Tier Benefits",
              description: "Unlock higher tiers for better rewards and bonuses",
              color: "text-orange-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-strong rounded-3xl p-8 text-center border border-white/5 hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-2xl mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-3xl p-12 text-center border border-primary/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <Crown className="h-8 w-8 text-primary" />
              <Zap className="h-8 w-8 text-accent animate-pulse" />
            </div>
            
            <h3 className="font-display text-3xl md:text-4xl font-black mb-4">
              Something Amazing is
              <span className="text-gradient"> Coming Soon!</span>
            </h3>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're working hard to bring you the best loyalty program in gaming. Stay tuned for exclusive rewards, special bonuses, and member-only benefits!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-glow-accent hover:shadow-glow-accent-lg transition-all duration-300"
                disabled
              >
                Notify Me When Available
              </motion.button>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                <span className="text-sm">Launching in 2026</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { label: "Points per Purchase", value: "10%" },
            { label: "Bonus Rewards", value: "5X" },
            { label: "Exclusive Items", value: "50+" },
            { label: "Member Tiers", value: "5" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
