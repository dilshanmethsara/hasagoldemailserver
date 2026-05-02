import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Database,
  RefreshCcw,
  Zap,
  ShieldCheck,
  Clock,
  ExternalLink
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { seedDatabase, fetchAllOrders } from "@/lib/db";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AdminOverview = () => {
  const [syncing, setSyncing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAllOrders();
      setOrders(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => o.status === 'completed' ? sum + (o.amount || 0) : sum, 0);
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalOrders = orders.length;
    const uniqueUsers = new Set(orders.map(o => o.userId)).size;
    
    return [
      { label: "Total Revenue", value: `LKR ${totalRevenue.toLocaleString()}`, change: "+12.4%", up: true, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
      { label: "Total Orders", value: totalOrders.toString(), change: "+8.2%", up: true, icon: ShoppingBag, color: "text-accent", bg: "bg-accent/10" },
      { label: "Active Users", value: uniqueUsers.toString(), change: "+5.7%", up: true, icon: Users, color: "text-warning", bg: "bg-warning/10" },
      { label: "Conversion", value: totalOrders > 0 ? `${((completedOrders / totalOrders) * 100).toFixed(1)}%` : "0%", change: "-0.3%", up: false, icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
    ];
  }, [orders]);

  const chartData = useMemo(() => {
    // Generate last 7 days chart data based on real orders
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => {
      const dayOrders = orders.filter(o => {
        const d = new Date(o.date);
        return days[d.getDay()] === day && o.status === 'completed';
      });
      return {
        day,
        value: dayOrders.reduce((sum, o) => sum + (o.amount || 0), 0)
      };
    });
  }, [orders]);

  const handleSync = async () => {
    setSyncing(true);
    const success = await seedDatabase();
    setSyncing(false);
    if (success) {
      toast.success("Database synced successfully!");
    }
  };

  const statusBadge = (s: string) =>
    s === "completed" ? "bg-success/15 text-success border-success/30"
    : s === "pending" ? "bg-warning/15 text-warning border-warning/30"
    : "bg-destructive/15 text-destructive border-destructive/30";

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Command Center</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Live data from Firestore
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="glass" 
            onClick={handleSync} 
            disabled={syncing}
            className="rounded-2xl border-white/5 bg-white/5 hover:bg-white/10"
          >
            <Database className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            Sync Database
          </Button>
          <Button variant="hero" className="rounded-2xl shadow-glow-accent">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Site
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-strong rounded-[2rem] p-6 border-white/5 group hover:border-primary/30 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-2xl ${s.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <Badge variant="secondary" className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${s.up ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                {s.change}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-black mb-1">{s.label}</div>
            <div className="font-display text-2xl font-black">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-strong rounded-[2.5rem] p-8 border-white/5"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Revenue Performance
            </h3>
            <div className="flex gap-2">
              <Badge className="bg-primary/20 text-primary border-none">7 Days</Badge>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="white" strokeOpacity={0.05} vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(10, 10, 11, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-strong rounded-[2.5rem] p-8 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent"
        >
          <h3 className="font-display text-xl font-bold mb-8 flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" /> System Health
          </h3>
          <div className="space-y-6">
            {[
              { label: "Database", status: "Operational", color: "text-success" },
              { label: "Auth Service", status: "Operational", color: "text-success" },
              { label: "Payment API", status: "Testing", color: "text-warning" },
              { label: "Mail Server", status: "Operational", color: "text-success" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-sm font-bold">{item.label}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-3xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary font-bold mb-2 uppercase tracking-tighter">Admin Note</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Don't forget to sync the game catalog whenever you update prices in the code.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-[2.5rem] p-8 border-white/5"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-display text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Live Transactions
          </h3>
          <Button variant="ghost" className="text-primary hover:bg-primary/10 rounded-xl">View Full History</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-white/5">
                <th className="py-4 px-4 font-black uppercase tracking-widest">Order ID</th>
                <th className="py-4 px-4 font-black uppercase tracking-widest">Customer</th>
                <th className="py-4 px-4 font-black uppercase tracking-widest">Game / Pkg</th>
                <th className="py-4 px-4 font-black uppercase tracking-widest">Amount</th>
                <th className="py-4 px-4 font-black uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.slice(0, 5).map((r) => (
                <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                  <td className="py-5 px-4 font-mono text-[10px] text-muted-foreground">{r.id}</td>
                  <td className="py-5 px-4 font-bold">{r.userEmail || "Guest User"}</td>
                  <td className="py-5 px-4">
                    <div className="font-bold text-xs">{r.gameName}</div>
                    <div className="text-[10px] text-muted-foreground">{r.packageName}</div>
                  </td>
                  <td className="py-5 px-4 font-display font-black text-lg text-primary">
                    LKR {r.amount?.toLocaleString()}
                  </td>
                  <td className="py-5 px-4">
                    <Badge variant="secondary" className={`rounded-lg font-black uppercase text-[9px] ${statusBadge(r.status)}`}>
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground italic">
                    No transactions found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
