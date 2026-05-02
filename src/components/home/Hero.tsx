import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        
        {/* Enhanced Animated Background Elements */}
        {/* Golden Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-yellow-400/30 via-yellow-500/20 to-yellow-600/10 rounded-full blur-[100px]"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-br from-yellow-500/25 via-yellow-600/15 to-yellow-700/10 rounded-full blur-[120px]"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.div
          className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-600/20 via-yellow-700/10 to-yellow-800/5 rounded-full blur-[80px]"
          animate={{
            x: [0, 120, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Golden Particle Effects */}
        <motion.div
          className="absolute top-1/2 left-1/3 w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-lg shadow-yellow-500/50"
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -100, -200],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0
          }}
        />
        
        <motion.div
          className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-full shadow-lg shadow-yellow-600/50"
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -80, -160],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-accent rounded-full"
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -120, -240],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: 2
          }}
        />

        {/* Golden Rotating Gradient Ring */}
        <motion.div
          className="absolute top-1/2 right-10 w-32 h-32 border-2 border-yellow-500/30 rounded-full shadow-lg shadow-yellow-500/20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <motion.div
            className="w-full h-full border border-yellow-600/20 rounded-full"
            animate={{
              rotate: [360, 0],
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* Golden Pulsing Grid Pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(250, 204, 21, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.3) 0%, transparent 50%)`,
          }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Enhanced Left Side Animations */}
        <motion.div
          className="absolute top-1/4 -left-20 w-40 h-40"
          animate={{
            rotate: [0, 360],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full border-4 border-yellow-500/30 rounded-full relative">
            <motion.div
              className="absolute inset-2 border-2 border-yellow-400/40 rounded-full"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-500 rounded-full -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Enhanced Right Side Animations */}
        <motion.div
          className="absolute top-1/3 -right-16 w-32 h-32"
          animate={{
            rotate: [0, -360],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full relative">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-16 bg-gradient-to-b from-yellow-400/50 to-transparent origin-bottom"
                style={{
                  transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scaleY: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
            <motion.div
              className="absolute top-1/2 left-1/2 w-6 h-6 bg-yellow-500 rounded-full -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  "0 0 0px rgba(250, 204, 21, 0)",
                  "0 0 20px rgba(250, 204, 21, 0.6)",
                  "0 0 0px rgba(250, 204, 21, 0)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Additional Left Side Floating Elements */}
        <motion.div
          className="absolute bottom-1/4 left-10 w-24 h-24"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <div className="w-full h-full border-2 border-yellow-600/40 rounded-lg transform rotate-45">
            <motion.div
              className="w-full h-full border border-yellow-400/30 rounded-lg"
              animate={{
                rotate: [-45, 45, -45],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Additional Right Side Floating Elements */}
        <motion.div
          className="absolute top-1/2 right-8 w-20 h-20"
          animate={{
            y: [0, 40, 0],
            rotate: [0, -180, -360],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <div className="w-full h-full relative">
            <motion.div
              className="absolute inset-0 border-2 border-yellow-500/50 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute inset-2 border border-yellow-400/40 rounded-full"
              animate={{
                scale: [1.3, 1, 1.3],
                opacity: [0.7, 0.3, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Left Side Wave Animation */}
        <motion.div
          className="absolute top-1/2 left-0 w-32 h-32"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg className="w-full h-full text-yellow-500/30" viewBox="0 0 100 100">
            <motion.path
              d="M 20 50 Q 30 30, 50 50 T 80 50"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              animate={{
                d: [
                  "M 20 50 Q 30 30, 50 50 T 80 50",
                  "M 20 50 Q 30 70, 50 50 T 80 50",
                  "M 20 50 Q 30 30, 50 50 T 80 50"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>

        {/* Right Side Wave Animation */}
        <motion.div
          className="absolute bottom-1/3 right-0 w-32 h-32"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <svg className="w-full h-full text-yellow-600/30" viewBox="0 0 100 100">
            <motion.path
              d="M 20 50 Q 30 70, 50 50 T 80 50"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              animate={{
                d: [
                  "M 20 50 Q 30 70, 50 50 T 80 50",
                  "M 20 50 Q 30 30, 50 50 T 80 50",
                  "M 20 50 Q 30 70, 50 50 T 80 50"
                ]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>
      </div>

      <div className="container relative pt-24 pb-28 md:pt-36 md:pb-40">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-sm border-yellow-500/30 cursor-default"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0px rgba(250, 204, 21, 0)",
                "0 0 15px rgba(250, 204, 21, 0.3)",
                "0 0 0px rgba(250, 204, 21, 0)"
              ]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
            <span className="text-muted-foreground font-medium">Trusted by 2M+ gamers worldwide</span>
          </motion.div>

          <motion.h1 
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            Top up your game.
            <br />
            <span className="text-gradient">Instantly.</span>
          </motion.h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Diamonds, UC, CP, Gems and more — delivered to your account in seconds. 
            Join the elite community of gamers who demand speed and security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="xl" className="group shadow-glow relative overflow-hidden border-yellow-500/30" asChild>
              <Link to="/games">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-yellow-500/30 to-yellow-600/20 translate-x-[-100%]"
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Start Top-Up
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
            <Button variant="glass" size="xl" className="border-white/10 hover:bg-white/5" asChild>
              <a href="#games">Browse Games</a>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
            {[
              { icon: Zap, label: "Instant", value: "<30s", color: "text-primary" },
              { icon: Shield, label: "Secure", value: "256-bit", color: "text-secondary" },
              { icon: Sparkles, label: "Rated", value: "4.9 / 5", color: "text-accent" },
            ].map((s, i) => (
              <motion.div 
                key={i} 
                className="glass rounded-2xl p-6 border-white/5 hover:border-white/10 transition-colors"
                whileHover={{ y: -5, scale: 1.02 }}
                animate={{
                  y: [0, i % 2 === 0 ? -5 : 5, 0]
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <s.icon className={`h-6 w-6 ${s.color} mx-auto mb-3`} />
                <div className="font-display font-bold text-xl mb-1">{s.value}</div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

