import { Link, NavLink } from "react-router-dom";
import { Gamepad2, ShoppingCart, User, Menu, X, Search, LogOut } from "lucide-react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";


const navItems = [
  { to: "/", label: "Home" },
  { to: "/games", label: "Games" },
  { to: "/dashboard", label: "Dashboard" },
];


export const Navbar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (

    <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Golden circle effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full blur-md opacity-60 group-hover:opacity-80 transition-all duration-500 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full blur-sm opacity-40 group-hover:opacity-60 transition-all duration-300" />
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="relative h-10 w-10 rounded-full overflow-hidden shadow-glow border-2 border-yellow-500/50"
            >
              <img 
                src="/hasalogo.png" 
                alt="HASA GOLD STORE Logo" 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-yellow-500 font-bold text-lg">HG</span>';
                  }
                }}
              />
            </motion.div>
          </div>
          <span className="font-display font-black text-2xl tracking-tighter whitespace-nowrap">
            HASA <span className="text-gradient">GOLD</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item, i) => (
            <div key={item.to}>

              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive ? "text-primary bg-primary/10 shadow-[0_0_20px_rgba(0,255,255,0.1)]" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5" asChild title="Search Games">
            <Link to="/games" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 text-primary" asChild title="Dashboard">
                <Link to="/dashboard" aria-label="Dashboard">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="glass" size="sm" className="rounded-xl border-white/5 text-xs" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="hero" size="sm" className="rounded-xl shadow-glow-accent px-6" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}

          <Button variant="hero" size="lg" className="rounded-xl shadow-glow-accent group ml-2" asChild>
            <Link to="/games">
              <ShoppingCart className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
              Top Up Now
            </Link>
          </Button>
        </div>

        <button
          className="md:hidden p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>



      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="container py-8 flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                      isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-white/5"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {!user && (
                <Button variant="hero" size="xl" asChild className="mt-4 rounded-2xl">
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              )}
              <Button variant="hero" size="xl" asChild className="mt-4 rounded-2xl">
                <Link to="/games" onClick={() => setOpen(false)}>
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  Top Up Now
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

