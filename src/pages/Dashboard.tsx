import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User as UserIcon, 
  Package, 
  Settings, 
  Plus, 
  Trash2, 
  Zap, 
  ShieldCheck,
  Star,
  LayoutDashboard,
  Wallet,
  History,
  LogOut,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import { fetchUserOrders, fetchUser, topupWallet } from "@/lib/db";
import { auth } from "@/lib/firebase";
import { signOut, sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, isEmailVerified } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [topupAmount, setTopupAmount] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        try {
          console.log("Current user:", { uid: user.uid, email: user.email, displayName: user.displayName });
          
          // Fetch orders and profile in parallel
          const [orderData, profileData] = await Promise.all([
            fetchUserOrders(user.uid, user.email),
            fetchUser(user.uid)
          ]);
          
          console.log("Dashboard loaded orders:", orderData.length);
          console.log("Orders data:", orderData);
          setOrders(orderData);
          setUserData(profileData);
        } catch (error) {
          console.error("Error loading dashboard data:", error);
          toast.error("Failed to load your data. Please refresh.");
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [user]);

  const stats = useMemo(() => {
    return {
      totalOrders: orders.length,
      loyaltyPoints: orders.reduce((sum, o) => o.status === 'completed' ? sum + Math.floor((o.amount || 0) / 100) : sum, 0),
      balance: userData?.balance || 0
    };
  }, [orders, userData]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const handleTopup = async () => {
    const amt = parseFloat(topupAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (user) {
      const success = await topupWallet(user.uid, amt);
      if (success) {
        toast.success(`Successfully added LKR ${amt} to wallet`);
        setTopupAmount("");
        // Reload data
        const profileData = await fetchUser(user.uid);
        setUserData(profileData);
      } else {
        toast.error("Failed to top up wallet");
      }
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    
    setResendLoading(true);
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/auth?message=email_verified`,
        handleCodeInApp: true,
      });
      toast.success("Verification email resent! Please check your inbox (including spam folder).");
    } catch (error: any) {
      toast.error("Failed to resend verification email: " + error.message);
    } finally {
      setResendLoading(false);
    }
  };

  const tabs = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "wallet", icon: Wallet, label: "Wallet & Topup" },
    { id: "history", icon: History, label: "Order History" },
    { id: "settings", icon: Settings, label: "Account Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container py-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Profile Card */}
          <aside className="lg:w-80 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-strong rounded-[2rem] p-8 border-white/5 text-center shadow-2xl"
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-primary blur-lg opacity-40 rounded-full" />
                <div className="relative h-24 w-24 rounded-3xl bg-gradient-primary flex items-center justify-center text-3xl font-black text-primary-foreground shadow-glow mx-auto uppercase">
                  {user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) || "U"}
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-background border-4 border-background flex items-center justify-center">
                  <div className="h-full w-full rounded-xl bg-success flex items-center justify-center shadow-glow-accent">
                    <Zap className="h-5 w-5 text-black" />
                  </div>
                </div>
              </div>
              
              <h2 className="font-display text-2xl font-bold mb-1 truncate">{user?.displayName || userData?.displayName || "Gamer"}</h2>
              <p className="text-muted-foreground text-sm mb-6 truncate">{user?.email}</p>

              <div className="flex justify-center gap-2 mb-8">
                <Badge className="bg-primary/20 text-primary border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
                  BRONZE TIER
                </Badge>
                <Badge className="bg-white/5 text-muted-foreground border-white/10 px-3 py-1 rounded-full text-xs">
                  LVL 1
                </Badge>
              </div>

              {!isEmailVerified && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-warning/10 border border-warning/20 text-center mb-6"
                >
                  <div className="text-warning font-bold text-sm mb-1">Email Not Verified</div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Please verify your email to unlock all features
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-xs border-warning/20 text-warning hover:bg-warning/20"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                    >
                      {resendLoading ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : null}
                      Resend Email
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-xs border-warning/20 text-warning hover:bg-warning/20"
                      onClick={async () => {
                        if (user) {
                          try {
                            await auth.signOut();
                            navigate("/auth?message=verify_email");
                          } catch (error) {
                            toast.error("Failed to sign out. Please try again.");
                          }
                        }
                      }}
                    >
                      Check Email
                    </Button>
                  </div>
                </motion.div>
              )}

              <nav className="space-y-2 text-left">
                {tabs.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                      activeTab === item.id 
                        ? "bg-primary/10 text-primary shadow-glow border border-primary/20" 
                        : "text-muted-foreground hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-bold text-sm">{item.label}</span>
                  </button>
                ))}
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-destructive hover:bg-destructive/10 transition-all duration-300 mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-bold text-sm">Sign Out</span>
                </button>
              </nav>
            </motion.div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Gamer Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Manage your orders and wallet here.</p>
                  </div>
                  <Button variant="hero" size="lg" className="rounded-2xl shadow-glow-accent group" asChild>
                    <Link to="/games">
                      <Plus className="h-5 w-5 mr-2 transition-transform group-hover:rotate-90" />
                      New Top-Up
                    </Link>
                  </Button>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { icon: Package, label: "Total Orders", value: stats.totalOrders.toString(), color: "text-primary", bg: "bg-primary/10" },
                    { icon: Wallet, label: "Balance", value: `LKR ${stats.balance.toLocaleString()}`, color: "text-accent", bg: "bg-accent/10" },
                    { icon: Star, label: "Loyalty Points", value: "Coming Soon", color: "text-warning", bg: "bg-warning/10", badge: "NEW" },
                  ].map((s, i) => (
                    <div key={i} className="glass-strong rounded-[2rem] p-6 border-white/5 flex items-center gap-5 group relative">
                      {s.badge && (
                        <Badge className="absolute -top-2 -right-2 bg-primary/20 text-primary border-primary/20 px-2 py-1 rounded-full text-[10px] font-bold animate-pulse">
                          {s.badge}
                        </Badge>
                      )}
                      <div className={`h-14 w-14 rounded-2xl ${s.bg} flex items-center justify-center`}>
                        <s.icon className={`h-7 w-7 ${s.color}`} />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">{s.label}</div>
                        <div className="font-display text-2xl font-black">{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid xl:grid-cols-2 gap-8">
                  <section className="glass-strong rounded-[2.5rem] p-8 border-white/5">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-display text-xl font-bold">Recent Activity</h3>
                      <Button variant="ghost" onClick={() => setActiveTab("history")} className="text-primary hover:bg-primary/10 rounded-xl">View History</Button>
                    </div>
                    {loading ? (
                      <div className="py-12 text-center"><Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" /></div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 4).map((o) => (
                          <div key={o.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Package className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-bold text-sm">{o.gameName}</div>
                                <div className="text-[10px] text-muted-foreground">{new Date(o.createdAt?.seconds * 1000).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-sm">LKR {o.amount?.toLocaleString()}</div>
                              <div className="text-[9px] uppercase font-black text-success">{o.status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 opacity-50 italic">No recent orders.</div>
                    )}
                  </section>

                  <div className="bg-gradient-primary rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab("wallet")}>
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                      <Wallet className="h-32 w-32 text-black" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-display text-2xl font-black text-primary-foreground mb-2">Wallet Balance</h3>
                      <div className="text-4xl font-black text-primary-foreground mb-6">LKR {stats.balance.toLocaleString()}</div>
                      <Button variant="secondary" className="rounded-xl font-bold px-6 shadow-2xl">Top Up Now</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "wallet" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <h2 className="font-display text-3xl font-bold">Wallet & Topup</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="glass-strong rounded-[2.5rem] p-8 border-white/5">
                    <h3 className="text-lg font-bold mb-6">Current Balance</h3>
                    <div className="text-5xl font-black text-primary mb-2">LKR {stats.balance.toLocaleString()}</div>
                    <p className="text-muted-foreground text-sm mb-8">Use your wallet balance for instant checkout on any game top-up.</p>
                    
                    <div className="space-y-4 relative">
                      {/* Coming Soon Overlay */}
                      <div className="absolute inset-0 bg-[#0A0A0B]/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-2xl border border-primary/20">
                        <Badge className="bg-primary/20 text-primary border-primary/20 px-4 py-2 rounded-full text-sm font-bold mb-2">
                          COMING SOON
                        </Badge>
                        <p className="text-xs text-center text-muted-foreground font-medium max-w-[250px]">Automatic Wallet Top-ups are currently in development.</p>
                      </div>

                      <div className="space-y-2 opacity-30 pointer-events-none">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Enter Top-up Amount (LKR)</label>
                        <input 
                          type="number" 
                          disabled
                          placeholder="e.g. 1000" 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <Button variant="hero" size="lg" className="w-full rounded-2xl py-8 opacity-30 pointer-events-none" disabled>Add Funds to Wallet</Button>
                    </div>
                  </div>
                  
                  <div className="glass-strong rounded-[2.5rem] p-8 border-white/5">
                    <h3 className="text-lg font-bold mb-6">Benefits</h3>
                    <div className="space-y-6">
                      {[
                        { icon: Zap, title: "Instant Checkout", desc: "Skip the payment gateway and pay instantly from your balance." },
                        { icon: ShieldCheck, title: "Safe & Secure", desc: "Your funds are protected by industry-leading security." },
                        { icon: Star, title: "Bonus Points", desc: "Earn extra loyalty points for every wallet top-up above LKR 5000." },
                      ].map((b, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                            <b.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-bold text-sm mb-1">{b.title}</div>
                            <div className="text-xs text-muted-foreground">{b.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <h2 className="font-display text-3xl font-bold">Order History</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (user) {
                        setLoading(true);
                        fetchUserOrders(user.uid, user.email).then(orderData => {
                          console.log("Refreshed orders:", orderData.length);
                          setOrders(orderData);
                          setLoading(false);
                          toast.success("Orders refreshed!");
                        }).catch(error => {
                          console.error("Error refreshing orders:", error);
                          toast.error("Failed to refresh orders");
                          setLoading(false);
                        });
                      }
                    }}
                    className="rounded-xl border-white/10 hover:bg-white/5"
                  >
                    Refresh Orders
                  </Button>
                </div>
                <div className="glass-strong rounded-[2.5rem] p-8 border-white/5">
                  {loading ? (
                    <div className="py-12 text-center"><Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" /></div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((o) => (
                        <div key={o.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                              <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="font-bold">{o.gameName} — {o.packageName}</div>
                              <div className="text-xs text-muted-foreground">Order ID: #{o.id.slice(-8).toUpperCase()} · {new Date(o.createdAt?.seconds * 1000).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-8">
                            <div className="text-right">
                              <div className="font-display font-black text-xl">LKR {o.amount?.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">{o.method} payment</div>
                            </div>
                            <Badge className={`${o.status === 'completed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'} border-none px-4 py-1.5 rounded-full`}>
                              {o.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 opacity-50 italic">You haven't placed any orders yet.</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <h2 className="font-display text-3xl font-bold">Account Settings</h2>
                <div className="max-w-2xl glass-strong rounded-[2.5rem] p-8 border-white/5 space-y-8">
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Display Name</label>
                        <input type="text" defaultValue={user?.displayName || ""} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                        <input type="email" disabled value={user?.email || ""} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none opacity-50" />
                      </div>
                    </div>
                    <Button variant="hero" className="rounded-xl px-8" onClick={() => toast.success("Settings saved (Simulated)")}>Save Changes</Button>
                  </div>
                  
                  <div className="pt-8 border-t border-white/5">
                    <h3 className="font-bold mb-4 text-destructive">Danger Zone</h3>
                    <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10 rounded-xl">Delete Account</Button>
                  </div>
                </div>
              </motion.div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
