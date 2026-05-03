import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Users as UsersIcon } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { fetchAllUsers } from "@/lib/db";
import { motion } from "framer-motion";

const tierColor = (t: string) => ({
  Bronze: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Silver: "bg-zinc-400/15 text-zinc-300 border-zinc-400/30",
  Gold: "bg-warning/15 text-warning border-warning/30",
  Platinum: "bg-primary/15 text-primary border-primary/30",
}[t] || "bg-muted text-muted-foreground");

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchAllUsers();
      setUsers(data);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const filtered = useMemo(
    () => {
      console.log("DEBUG: Users before filter:", users.length);
      console.log("DEBUG: Search query:", q);
      const filtered = users.filter((u) => !q || (u.name && u.name.toLowerCase().includes(q.toLowerCase())) || (u.email && u.email.toLowerCase().includes(q.toLowerCase())));
      console.log("DEBUG: Users after filter:", filtered.length);
      return filtered;
    },
    [users, q],
  );

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Registered Users</h1>
        <p className="text-muted-foreground">Manage your player base and loyalty tiers.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search by name or email..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/20" 
        />
      </div>

      <div className="glass-strong rounded-[2.5rem] overflow-hidden border-white/5">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Fetching players from server...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-white/5 bg-white/[0.02]">
                  <th className="py-5 px-6 font-black uppercase tracking-widest">Player</th>
                  <th className="py-5 px-6 font-black uppercase tracking-widest text-center">Country Code</th>
                  <th className="py-5 px-6 font-black uppercase tracking-widest text-center">WhatsApp Number</th>
                  <th className="py-5 px-6 font-black uppercase tracking-widest text-center">Email Status</th>
                  <th className="py-5 px-6 font-black uppercase tracking-widest text-center">Tier</th>
                  <th className="py-5 px-6 font-black uppercase tracking-widest text-center">Orders</th>
                  <th className="py-5 px-6 font-black uppercase tracking-widest text-right">Total Spent</th>
                  <th className="py-5 px-6 font-black uppercase tracking-widest text-right">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={u.id} 
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-primary flex items-center justify-center text-xs font-black text-primary-foreground shadow-glow uppercase">
                          {u.name ? u.name.split(" ").map((n: string) => n[0]).join("") : u.email.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-sm group-hover:text-primary transition-colors">{u.name || "Gamer"}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      {u.whatsapp ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-success/15 text-success flex items-center justify-center">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.495 0-.198-.05-.605-.225-.967C10.016 9.025 9.89 8.827 9.89 8.827s-.149-.298-.446-.298c-.297 0-.644-.05-.99-.05-.347 0-.92.149-1.402.695-.482.546-1.84 1.791-1.84 4.361 0 2.57 1.87 5.054 2.133 5.34.262.286 2.418 3.698 5.86 5.191.819.354 1.463.564 1.964.723.824.262 1.578.225 2.172.136.662-.099 2.03-.832 2.321-1.637.291-.805.291-1.493.225-1.637-.066-.149-.225-.223-.446-.372z"/>
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                            </svg>
                          </div>
                          <select 
                            value={u.whatsapp.substring(0, 3)} 
                            readOnly
                            className="w-16 px-2 py-1 text-xs text-center bg-white/5 border border-white/10 rounded-lg text-success font-bold"
                          >
                            <option value="+94">+94</option>
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                          </select>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground font-medium">-</div>
                      )}
                    </td>
                    <td className="py-5 px-6 text-center">
                      {u.whatsapp ? (
                        <input 
                          type="text" 
                          value={u.whatsapp.substring(3)}
                          readOnly
                          className="w-24 px-3 py-1 text-xs text-center bg-white/5 border border-white/10 rounded-lg text-muted-foreground font-medium"
                        />
                      ) : (
                        <div className="text-xs text-muted-foreground font-medium">Not provided</div>
                      )}
                    </td>
                    <td className="py-5 px-6 text-center">
                      <Badge 
                        variant="secondary" 
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase ${
                          u.emailVerified 
                            ? "bg-success/15 text-success border-success/30" 
                            : "bg-warning/15 text-warning border-warning/30"
                        }`}
                      >
                        {u.emailVerified ? "Verified" : "Pending"}
                      </Badge>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <Badge variant="secondary" className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase ${tierColor(u.tier)}`}>
                        {u.tier || "Bronze"}
                      </Badge>
                    </td>
                    <td className="py-5 px-6 text-center font-bold">
                      {u.orders || 0}
                    </td>
                    <td className="py-5 px-6 text-right font-display font-black text-primary">
                      LKR {(u.spent || 0).toLocaleString()}
                    </td>
                    <td className="py-5 px-6 text-right text-xs text-muted-foreground font-medium">
                      {u.joined}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-24 text-center">
            <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <UsersIcon className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
            <h3 className="font-bold text-xl mb-2">No players found</h3>
            <p className="text-muted-foreground max-w-[250px] mx-auto text-sm">
              Either there are no registered users yet, or your search query matches nothing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
