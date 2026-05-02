import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Smartphone, Banknote, Power, Edit2, Check, X, Loader2, AlertCircle, Plus, Trash2 } from "lucide-react";
import { fetchPaymentConfigs, updatePaymentConfig } from "@/lib/db";
import { toast } from "sonner";

const AdminPayments = () => {
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const loadConfigs = async () => {
    setLoading(true);
    const data = await fetchPaymentConfigs();
    // Normalize bank accounts if they don't exist
    const normalizedData = data.map(c => {
      if (c.id === "bank" && !c.accounts) {
        return {
          ...c,
          accounts: [{ bankName: c.bankName || "", number: c.number || "", name: c.name || "" }]
        };
      }
      return c;
    });
    setConfigs(normalizedData);
    setLoading(false);
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    const success = await updatePaymentConfig(id, { status: newStatus });
    if (success) {
      setConfigs(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      toast.success(`${id.toUpperCase()} payment method ${newStatus === "active" ? "activated" : "paused"}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    const success = await updatePaymentConfig(id, editData);
    if (success) {
      setConfigs(prev => prev.map(c => c.id === id ? { ...c, ...editData } : c));
      setEditing(null);
      toast.success("Payment details updated successfully");
    } else {
      toast.error("Failed to save changes");
    }
    setSaving(false);
  };

  const handleAddAccount = () => {
    if (editData.accounts?.length >= 3) {
      toast.error("Maximum 3 bank accounts allowed.");
      return;
    }
    setEditData({
      ...editData,
      accounts: [...(editData.accounts || []), { bankName: "", number: "", name: "" }]
    });
  };

  const handleUpdateAccount = (index: number, field: string, value: string) => {
    const newAccounts = [...editData.accounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setEditData({ ...editData, accounts: newAccounts });
  };

  const handleRemoveAccount = (index: number) => {
    const newAccounts = [...editData.accounts];
    newAccounts.splice(index, 1);
    setEditData({ ...editData, accounts: newAccounts });
  };

  const getIcon = (id: string) => {
    if (id === "ezcash") return Smartphone;
    if (id === "bank") return Banknote;
    return CreditCard;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Payment Orchestration</h1>
        <p className="text-muted-foreground text-sm font-medium">Control global payment methods and transaction details.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center glass rounded-[3rem]">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-bold">Synchronizing Payment Gateway...</p>
          </div>
        ) : (
          configs.map((c) => {
            const Icon = getIcon(c.id);
            const isEditing = editing === c.id;

            return (
              <div 
                key={c.id} 
                className={`glass rounded-[2.5rem] border-white/5 overflow-hidden transition-all duration-500 hover:border-primary/20 ${
                  c.status === "paused" ? "opacity-60 saturate-[0.2]" : ""
                }`}
              >
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-glow-sm ${
                        c.status === "active" ? "bg-primary/10 text-primary" : "bg-white/5 text-muted-foreground"
                      }`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">{c.label}</h3>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{c.type} Flow</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${
                      c.status === "active" ? "bg-success/15 text-success border-success/30" : "bg-white/5 text-muted-foreground border-white/10"
                    } text-[10px] uppercase font-black px-3 py-1 rounded-lg border shadow-sm`}>
                      {c.status}
                    </Badge>
                  </div>

                  {isEditing ? (
                    <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                      {c.id === "bank" ? (
                        <div className="space-y-4">
                          {editData.accounts?.map((acc: any, index: number) => (
                            <div key={index} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 relative">
                              <div className="absolute top-4 right-4">
                                {editData.accounts.length > 1 && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 text-destructive hover:bg-destructive/20 hover:text-destructive"
                                    onClick={() => handleRemoveAccount(index)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account {index + 1}</h4>
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-primary ml-1">Financial Institution</label>
                                  <Input 
                                    value={acc.bankName} 
                                    onChange={(e) => handleUpdateAccount(index, "bankName", e.target.value)}
                                    className="h-10 bg-white/[0.03] border-white/10 rounded-xl font-bold"
                                    placeholder="e.g. Commercial Bank"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-primary ml-1">Account Holder Name</label>
                                  <Input 
                                    value={acc.name} 
                                    onChange={(e) => handleUpdateAccount(index, "name", e.target.value)}
                                    className="h-10 bg-white/[0.03] border-white/10 rounded-xl font-bold"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-primary ml-1">Account Number</label>
                                  <Input 
                                    value={acc.number} 
                                    onChange={(e) => handleUpdateAccount(index, "number", e.target.value)}
                                    className="h-10 bg-white/[0.03] border-white/10 rounded-xl font-mono font-bold text-base"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          {editData.accounts?.length < 3 && (
                            <Button 
                              variant="outline" 
                              className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white"
                              onClick={handleAddAccount}
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add Another Account
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-primary ml-1">Account Holder Name</label>
                            <Input 
                              value={editData.name || ""} 
                              onChange={(e) => setEditData({...editData, name: e.target.value})}
                              className="h-12 bg-white/[0.03] border-white/10 rounded-xl font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-primary ml-1">Identification / Number</label>
                            <Input 
                              value={editData.number || ""} 
                              onChange={(e) => setEditData({...editData, number: e.target.value})}
                              className="h-12 bg-white/[0.03] border-white/10 rounded-xl font-mono font-bold text-lg"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 font-black"
                          onClick={() => handleSaveEdit(c.id)}
                          disabled={saving}
                        >
                          {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Check className="h-5 w-5 mr-2" />}
                          Save Configuration
                        </Button>
                        <Button 
                          variant="glass" 
                          className="h-12 w-12 p-0 rounded-xl border-white/5"
                          onClick={() => setEditing(null)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {c.id === "bank" ? (
                        <div className="space-y-3">
                          {c.accounts?.map((acc: any, i: number) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-muted-foreground font-black uppercase">{acc.bankName}</span>
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-widest">Account {i + 1}</span>
                              </div>
                              <div className="font-mono font-bold text-lg text-white">{acc.number}</div>
                              <div className="text-xs text-muted-foreground font-bold uppercase">{acc.name}</div>
                            </div>
                          ))}
                        </div>
                      ) : c.type !== "automatic" ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="text-[10px] text-muted-foreground font-black uppercase mb-1">Entity Name</div>
                            <div className="font-bold text-white truncate">{c.name || "Automatic"}</div>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="text-[10px] text-muted-foreground font-black uppercase mb-1">Dest. ID</div>
                            <div className="font-mono font-bold text-primary truncate">{c.number || "AUTO-00"}</div>
                          </div>
                        </div>
                      ) : null}
                      
                      <div className="flex gap-3 pt-2">
                        {c.type !== "automatic" && (
                          <Button 
                            variant="glass" 
                            className="flex-1 h-14 rounded-2xl border-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 group"
                            onClick={() => {
                              setEditing(c.id);
                              // Deep copy editData so changes don't mutate state immediately
                              setEditData(JSON.parse(JSON.stringify(c)));
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2 transition-transform group-hover:rotate-12" />
                            Modify Details
                          </Button>
                        )}
                        <Button 
                          variant={c.status === "active" ? "destructive" : "glass"}
                          className={`h-14 p-0 rounded-2xl border-white/5 transition-all duration-500 ${
                            c.type === "automatic" ? "flex-1 w-full px-6" : "w-14"
                          } ${
                            c.status === "active" ? "hover:scale-[1.02]" : "bg-success/20 text-success border-success/20 hover:bg-success hover:text-white"
                          }`}
                          onClick={() => handleToggleStatus(c.id, c.status)}
                        >
                          <Power className="h-5 w-5" />
                          {c.type === "automatic" && (
                            <span className="ml-3 font-black uppercase tracking-widest text-[10px]">
                              {c.status === "active" ? "Pause Gateway" : "Activate Gateway"}
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                {c.status === "paused" && (
                  <div className="bg-destructive/10 py-3 px-8 border-t border-destructive/20 flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-destructive">This method is currently invisible to customers</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
            <Smartphone className="h-7 w-7" />
          </div>
          <div>
            <h4 className="text-white font-black text-lg">Real-time Synchronization</h4>
            <p className="text-xs text-muted-foreground font-medium">Changes made here are applied instantly to the checkout page for all active sessions.</p>
          </div>
        </div>
        <Badge variant="outline" className="px-4 py-2 border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
          Live Gateway Active
        </Badge>
      </div>
    </div>
  );
};

export default AdminPayments;

