import { useMemo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, Loader2, Check, X, AlertCircle, CreditCard, Download } from "lucide-react";
import { fetchAllOrders, updateOrderStatus } from "@/lib/db";
import { toast } from "sonner";

const statusBadge = (s: string) =>
  s === "completed" ? "bg-success/15 text-success border-success/30"
  : s === "pending" ? "bg-warning/15 text-warning border-warning/30"
  : "bg-destructive/15 text-destructive border-destructive/30";

const tabs = ["all", "completed", "pending", "failed"] as const;

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const [q, setQ] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (id: string, status: "completed" | "failed") => {
    setUpdating(id);
    const success = await updateOrderStatus(id, status);
    if (success) {
      toast.success(`Order ${status === "completed" ? "approved" : "rejected"} successfully`);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      if (selectedOrder?.id === id) setSelectedOrder(prev => ({ ...prev, status }));
    } else {
      toast.error("Failed to update order status");
    }
    setUpdating(null);
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const t = tab === "all" || o.status === tab;
      const m = !q || o.id.toLowerCase().includes(q.toLowerCase()) || (o.userEmail && o.userEmail.toLowerCase().includes(q.toLowerCase())) || o.gameName.toLowerCase().includes(q.toLowerCase()) || (o.playerId && o.playerId.includes(q));
      return t && m;
    });
  }, [orders, tab, q]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Order Management</h1>
          <p className="text-muted-foreground text-sm font-medium">Real-time control center for all transactions.</p>
        </div>
        <Button 
          variant="glass" 
          onClick={loadOrders} 
          disabled={loading}
          className="rounded-2xl px-6 py-6 font-bold shadow-glow-sm"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Search className="h-5 w-5 mr-2" />}
          Refresh Database
        </Button>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", val: orders.length, color: "text-white" },
          { label: "Pending", val: orders.filter(o => o.status === "pending").length, color: "text-warning" },
          { label: "Completed", val: orders.filter(o => o.status === "completed").length, color: "text-success" },
          { label: "Revenue (LKR)", val: orders.filter(o => o.status === "completed").reduce((acc, o) => acc + (o.amount || 0), 0).toLocaleString(), color: "text-primary" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-3xl p-5 border-white/5">
            <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{s.label}</div>
            <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by ID, email, game or Player ID..." 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            className="pl-12 h-14 bg-white/[0.03] border-white/10 rounded-2xl text-base focus:ring-primary/20 focus:border-primary transition-all" 
          />
        </div>
        <div className="flex p-1.5 bg-white/[0.03] rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 whitespace-nowrap ${
                tab === t ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl">
        {loading && orders.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <p className="text-white font-bold text-lg">Fetching Orders</p>
            <p className="text-muted-foreground text-sm">Synchronizing with Firestore database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-white/5 bg-white/[0.01]">
                  <th className="py-6 px-8">Order Detail</th>
                  <th className="py-6 px-6">Account</th>
                  <th className="py-6 px-6">Product</th>
                  <th className="py-6 px-6">Payment</th>
                  <th className="py-6 px-6">Status</th>
                  <th className="py-6 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition-all duration-300 group">
                    <td className="py-6 px-8">
                      <div className="font-mono text-[10px] text-primary font-bold mb-1">#{o.id}</div>
                      <div className="text-[10px] text-muted-foreground">{new Date(o.createdAt?.seconds * 1000).toLocaleString()}</div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="font-bold text-sm text-white mb-0.5">{o.userEmail || "Guest"}</div>
                      <div className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        ID: {o.playerId || "N/A"}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="font-bold text-sm text-white">{o.gameName}</div>
                      <div className="text-[10px] text-muted-foreground">{o.packageName}</div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="font-black text-sm text-primary mb-1">LKR {o.amount?.toLocaleString()}</div>
                      <Badge variant="outline" className="text-[8px] font-black tracking-widest border-white/10 bg-white/5 px-2">
                        {o.method || "card"}
                      </Badge>
                    </td>
                    <td className="py-6 px-6">
                      <Badge variant="secondary" className={`${statusBadge(o.status)} text-[9px] uppercase font-black px-3 py-1 rounded-lg border shadow-sm`}>
                        {o.status}
                      </Badge>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-2">
                        {o.status === "pending" && (
                          <div className="flex gap-2 animate-in fade-in slide-in-from-right-2 duration-500">
                            <Button 
                              size="icon" 
                              className="h-10 w-10 rounded-xl bg-success/20 text-success hover:bg-success hover:text-white transition-all shadow-glow-sm"
                              onClick={() => handleStatusUpdate(o.id, "completed")}
                              disabled={updating === o.id}
                            >
                              <Check className="h-5 w-5" />
                            </Button>
                            <Button 
                              size="icon" 
                              className="h-10 w-10 rounded-xl bg-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all"
                              onClick={() => handleStatusUpdate(o.id, "failed")}
                              disabled={updating === o.id}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        )}
                        <Button 
                          variant="glass" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-white/10 border-white/5"
                          onClick={() => setSelectedOrder(o)}
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-32 text-center">
            <div className="h-20 w-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
            <p className="text-white font-bold text-xl mb-1">No Orders Found</p>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0f172a] w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-black text-white">Transaction Intelligence</h2>
                  <Badge className={statusBadge(selectedOrder.status)}>{selectedOrder.status}</Badge>
                </div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">System Hash: {selectedOrder.id}</p>
              </div>
              <Button variant="glass" size="icon" onClick={() => setSelectedOrder(null)} className="h-12 w-12 rounded-2xl hover:rotate-90 transition-transform duration-500">
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <div className="grid lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3 space-y-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 shadow-inner">
                      <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-4">Payment Method</div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div className="font-black text-lg uppercase text-white tracking-tight">{selectedOrder.method || "card"}</div>
                      </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 shadow-inner">
                      <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-4">Amount Paid</div>
                      <div className="text-3xl font-black text-primary">LKR {selectedOrder.amount?.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Customer Profile</h3>
                    <div className="grid grid-cols-2 gap-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                      <div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase mb-1">User Identification</div>
                        <div className="font-bold text-white text-lg truncate">{selectedOrder.userEmail || "Guest Checkout"}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase mb-1">Player Destination</div>
                        <div className="font-mono text-primary font-black text-xl tracking-tighter">{selectedOrder.playerId || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Product Specifications</h3>
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase mb-1">Service Name</div>
                        <div className="font-black text-white text-2xl tracking-tight">{selectedOrder.gameName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-muted-foreground font-black uppercase mb-1">Variant</div>
                        <Badge variant="outline" className="text-xs font-bold border-primary/20 bg-primary/5 text-primary px-4 py-1 rounded-full">
                          {selectedOrder.packageName}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.status === "pending" && (
                    <div className="flex gap-4 pt-6">
                      <Button 
                        className="flex-1 h-16 bg-success hover:bg-success/90 text-success-foreground rounded-[1.5rem] font-black text-lg shadow-glow-accent group"
                        onClick={() => handleStatusUpdate(selectedOrder.id, "completed")}
                        disabled={updating === selectedOrder.id}
                      >
                        <Check className="h-6 w-6 mr-2 group-hover:scale-125 transition-transform" />
                        Approve & Deliver
                      </Button>
                      <Button 
                        variant="destructive"
                        className="flex-1 h-16 rounded-[1.5rem] font-black text-lg group"
                        onClick={() => handleStatusUpdate(selectedOrder.id, "failed")}
                        disabled={updating === selectedOrder.id}
                      >
                        <X className="h-6 w-6 mr-2 group-hover:scale-125 transition-transform" />
                        Reject Request
                      </Button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Verification Proof</h3>
                  {selectedOrder.receipt ? (
                    <div className="rounded-[2.5rem] border border-white/10 overflow-hidden bg-black/40 aspect-[3/4.5] relative group shadow-2xl">
                      <img 
                        src={selectedOrder.receipt} 
                        alt="Payment Receipt" 
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                        <a 
                          href={selectedOrder.receipt} 
                          target="_blank"
                          rel="noreferrer"
                          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black gap-3 shadow-glow"
                        >
                          <Download className="h-5 w-5" />
                          Download Proof
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[2.5rem] border border-dashed border-white/10 aspect-[3/4.5] flex flex-col items-center justify-center text-center p-12 bg-white/[0.01]">
                      <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <AlertCircle className="h-10 w-10 text-muted-foreground opacity-10" />
                      </div>
                      <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">No Artifact Uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
