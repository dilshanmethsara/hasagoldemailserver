import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getGame, Package } from "@/data/games";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Check, 
  Star, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Coins, 
  Shield, 
  Diamond, 
  User as UserIcon 
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const TopUp = () => {
  const { user } = useAuth();
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = getGame(gameId || "");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Package | null>(null);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);

  const total = useMemo(() => selected?.price ?? 0, [selected]);

  if (!game) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Game not found</h1>
        <Button asChild variant="hero"><Link to="/games">Browse Games</Link></Button>
      </div>
    );
  }

  const canCheckout = selected && game.fields.every((f) => {
    const value = (fields[f.key] || "").trim();
    if (!value) return false;
    
    // Validate Player ID formats
    if (f.key.toLowerCase().includes("playerid") || f.key.toLowerCase().includes("userid") || f.key.toLowerCase().includes("uid")) {
      // Genshin UID must be exactly 9 digits
      if (game.name.toLowerCase().includes("genshin") && f.key.toLowerCase().includes("uid")) {
        return value.length === 9 && /^\d{9}$/.test(value);
      }
      // CODM allows alphanumeric with #
      if (game.name.toLowerCase().includes("codm") && f.key.toLowerCase().includes("playerid")) {
        return value.length >= 5 && value.length <= 20 && /^[a-zA-Z0-9#]+$/.test(value);
      }
      // Mobile Legends allows alphanumeric with #
      if (game.name.toLowerCase().includes("mobile legends") && f.key.toLowerCase().includes("playerid")) {
        return value.length >= 5 && value.length <= 15 && /^[a-zA-Z0-9#]+$/.test(value);
      }
      // Standard Player IDs must be 10-12 digits
      return value.length >= 10 && value.length <= 12 && /^\d+$/.test(value);
    }
    
    return true;
  });

  const handleCheckout = () => {
    if (!canCheckout) {
      // Check specific validation errors
      for (const f of game.fields) {
        const value = (fields[f.key] || "").trim();
        if (!value) {
          toast.error(`Please enter your ${f.label}`);
          return;
        }
        
        if (f.key.toLowerCase().includes("playerid") || f.key.toLowerCase().includes("userid") || f.key.toLowerCase().includes("uid")) {
          if (game.name.toLowerCase().includes("genshin") && f.key.toLowerCase().includes("uid")) {
            if (value.length !== 9) {
              toast.error("Genshin UID must be exactly 9 digits");
              return;
            }
          } else if (game.name.toLowerCase().includes("codm") && f.key.toLowerCase().includes("playerid")) {
            if (value.length < 5 || value.length > 20) {
              toast.error("CODM Player ID must be 5-20 characters (letters, numbers, and #)");
              return;
            }
          } else if (game.name.toLowerCase().includes("mobile legends") && f.key.toLowerCase().includes("playerid")) {
            if (value.length < 5 || value.length > 15) {
              toast.error("Mobile Legends Player ID must be 5-15 characters (letters, numbers, and #)");
              return;
            }
          } else if (value.length < 10 || value.length > 12) {
            toast.error("Player ID must be 10-12 digits");
            return;
          }
        }
      }
      
      if (!selected) {
        toast.error("Please select a package");
        return;
      }
    }
    
    if (!user) {
      toast.error("You must be logged in to place an order.");
      navigate("/auth");
      return;
    }

    sessionStorage.setItem(
      "hasagoldstore:order",
      JSON.stringify({ gameId: game.id, gameName: game.name, fields, package: selected }),
    );
    navigate("/checkout");
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/games"><ArrowLeft className="h-4 w-4" /> Back to games</Link>
      </Button>

      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-8 border border-border/50 shadow-card">
        <div className="aspect-[16/5] md:aspect-[16/4] relative">
          <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">{game.category}</Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-2">{game.name}</h1>
            <p className="text-muted-foreground mb-3">{game.tagline} · {game.publisher}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /> {game.rating}</div>
              <div className="flex items-center gap-1 text-muted-foreground"><TrendingUp className="h-4 w-4" /> {game.orders} orders</div>
              <div className="flex items-center gap-1 text-muted-foreground"><Zap className="h-4 w-4 text-primary" /> Instant delivery</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Account */}
          <section className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">1</div>
              <h2 className="font-display text-xl font-bold">Enter account info</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {game.fields.map((f) => (
                <div key={f.key} className="space-y-2">
                  <Label>{f.label}</Label>
                  <div className="relative">
                    <Input
                      placeholder={f.placeholder}
                      value={fields[f.key] || ""}
                      onChange={(e) => {
                        let val = e.target.value;
                        
                        // Enhanced validation for different ID types
                        if (f.key.toLowerCase().includes("playerid") || f.key.toLowerCase().includes("userid") || f.key.toLowerCase().includes("uid")) {
                          // For Genshin UID (9 digits)
                          if (game.name.toLowerCase().includes("genshin") && f.key.toLowerCase().includes("uid")) {
                            val = val.replace(/\D/g, "").slice(0, 9);
                          }
                          // For CODM (allows #TAG format)
                          else if (game.name.toLowerCase().includes("codm") && f.key.toLowerCase().includes("playerid")) {
                            // Allow alphanumeric and # for CODM Player ID#TAG format
                            val = val.replace(/[^a-zA-Z0-9#]/g, "").slice(0, 20);
                          }
                          // For Mobile Legends (allows #TAG format)
                          else if (game.name.toLowerCase().includes("mobile legends") && f.key.toLowerCase().includes("playerid")) {
                            // Allow alphanumeric and # for Mobile Legends Player ID#TAG format
                            val = val.replace(/[^a-zA-Z0-9#]/g, "").slice(0, 15);
                          }
                          // For standard numeric Player IDs (10-12 digits)
                          else {
                            val = val.replace(/\D/g, "").slice(0, 12);
                          }
                          
                          // Validation feedback
                          if (game.name.toLowerCase().includes("genshin") && f.key.toLowerCase().includes("uid")) {
                            if (val.length === 9) {
                              setVerifiedName("checked");
                            } else {
                              setVerifiedName(null);
                            }
                          } else if (!game.name.toLowerCase().includes("codm") && !game.name.toLowerCase().includes("mobile legends")) {
                            if (val.length >= 10 && val.length <= 12) {
                              setVerifiedName("checked");
                            } else {
                              setVerifiedName(null);
                            }
                          }
                        }
                        
                        setFields((s) => ({ ...s, [f.key]: val }));
                      }}
                      className={`h-11 bg-card/50 ${
                        (f.key.toLowerCase().includes("playerid") || f.key.toLowerCase().includes("userid") || f.key.toLowerCase().includes("uid")) &&
                        fields[f.key] &&
                        ((game.name.toLowerCase().includes("genshin") && f.key.toLowerCase().includes("uid") && fields[f.key].length !== 9) ||
                         (!game.name.toLowerCase().includes("codm") && !game.name.toLowerCase().includes("mobile legends") && !game.name.toLowerCase().includes("genshin") && (fields[f.key].length < 10 || fields[f.key].length > 12)))
                          ? "border-warning/50 focus:border-warning"
                          : ""
                      }`}
                      maxLength={
                        f.key.toLowerCase().includes("playerid") || f.key.toLowerCase().includes("userid") || f.key.toLowerCase().includes("uid")
                          ? game.name.toLowerCase().includes("genshin") && f.key.toLowerCase().includes("uid")
                            ? 9
                            : game.name.toLowerCase().includes("codm")
                            ? 20
                            : game.name.toLowerCase().includes("mobile legends")
                            ? 15
                            : 12
                          : undefined
                      }
                      inputMode={
                        f.key.toLowerCase().includes("playerid") || f.key.toLowerCase().includes("userid") || f.key.toLowerCase().includes("uid")
                          ? game.name.toLowerCase().includes("codm") || game.name.toLowerCase().includes("mobile legends")
                            ? "text"
                            : "numeric"
                          : undefined
                      }
                    />
                  </div>
                  {/* Validation hints */}
                  {(f.key.toLowerCase().includes("playerid") || f.key.toLowerCase().includes("userid") || f.key.toLowerCase().includes("uid")) && fields[f.key] && (
                    <div className="text-xs text-muted-foreground">
                      {game.name.toLowerCase().includes("genshin") && f.key.toLowerCase().includes("uid") && (
                        <span className={fields[f.key].length === 9 ? "text-success" : "text-warning"}>
                          {fields[f.key].length === 9 ? "✓ Valid UID format" : `UID must be exactly 9 digits (${fields[f.key].length}/9)`}
                        </span>
                      )}
                      {game.name.toLowerCase().includes("codm") && f.key.toLowerCase().includes("playerid") && (
                        <span className="text-muted-foreground">
                          Format: PlayerID#TAG (e.g., 1234567890#ABC)
                        </span>
                      )}
                      {game.name.toLowerCase().includes("mobile legends") && f.key.toLowerCase().includes("playerid") && (
                        <span className="text-muted-foreground">
                          Format: PlayerID#TAG (e.g., 123456789#ABC123)
                        </span>
                      )}
                      {!game.name.toLowerCase().includes("codm") && !game.name.toLowerCase().includes("mobile legends") && !game.name.toLowerCase().includes("genshin") && (
                        <span className={fields[f.key].length >= 10 && fields[f.key].length <= 12 ? "text-success" : "text-warning"}>
                          {fields[f.key].length >= 10 && fields[f.key].length <= 12 
                            ? "✓ Valid Player ID" 
                            : `Player ID must be 10-12 digits (${fields[f.key].length}/12)`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {verifiedName && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-warning/20 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <div className="text-[10px] text-warning font-black uppercase tracking-widest">Important</div>
                    <div className="font-bold text-sm text-foreground">Double check your ID, we don't give refunds.</div>
                  </div>
                </div>
                <Badge className="bg-warning text-warning-foreground border-none">CHECKED</Badge>
              </motion.div>
            )}

            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              We only use your Player ID to deliver — we never ask for passwords.
            </p>
          </section>

          {/* Step 2: Packages */}
          <section className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">2</div>
              <h2 className="font-display text-xl font-bold">Select package</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {game.packages.map((p) => {
                const isSel = selected?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`relative text-left rounded-xl p-4 border transition-bounce ${
                      isSel
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-border/50 bg-card/40 hover:border-primary/40 hover:bg-card/70"
                    }`}
                  >
                    {p.popular && (
                      <Badge className="absolute -top-2 left-3 bg-gradient-accent text-accent-foreground border-0 text-[10px]">
                        POPULAR
                      </Badge>
                    )}
                    {p.discount && (
                      <Badge className="absolute -top-2 right-3 bg-success text-success-foreground border-0 text-[10px]">
                        -{p.discount}%
                      </Badge>
                    )}
                    <div className="text-2xl mb-1">
                      {p.type === "pass" && <Shield className="h-6 w-6 text-primary" />}
                      {p.type === "gold" && <Coins className="h-6 w-6 text-warning" />}
                      {p.type === "gems" && <Zap className="h-6 w-6 text-secondary" />}
                      {p.type === "diamond" && <Diamond className="h-6 w-6 text-accent" />}
                      {!p.type && p.unit}
                    </div>
                    <div className="font-semibold text-sm">{p.amount > 1 ? p.amount.toLocaleString() : p.label}</div>
                    {p.bonus && (
                      <div className="text-[11px] text-success font-bold">+{p.bonus} bonus</div>
                    )}
                    <div className="mt-3 font-display font-bold text-lg text-primary">
                      {game.currencySymbol ?? "$"}{p.price.toLocaleString()}
                    </div>
                    {isSel && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Game</span><span className="font-medium">{game.name}</span></div>
              {game.fields.map((f) => (
                <div key={f.key} className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className="font-medium truncate max-w-[55%] text-right">{fields[f.key] || "—"}</span>
                </div>
              ))}
              <div className="flex justify-between"><span className="text-muted-foreground">Package</span><span className="font-medium">{selected?.label || "—"}</span></div>
              <div className="border-t border-border/50 pt-3 flex justify-between items-baseline">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display text-2xl font-bold text-gradient">{game.currencySymbol ?? "$"}{total.toLocaleString()}</span>
              </div>
            </div>
            <Button variant="hero" size="lg" className="w-full mt-5" disabled={!canCheckout} onClick={handleCheckout}>
              {user ? "Continue to Checkout" : "Login to Checkout"}
            </Button>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-primary" /> Instant</div>
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-success" /> Secure</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TopUp;
