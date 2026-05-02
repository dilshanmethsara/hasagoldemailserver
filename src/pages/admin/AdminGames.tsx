import { GAMES } from "@/data/games";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";

const AdminGames = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Games & Packages</h1>
          <p className="text-muted-foreground text-sm">Manage your catalog of games and top-up packages.</p>
        </div>
        <Button variant="hero"><Plus className="h-4 w-4" /> Add Game</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {GAMES.map((g) => (
          <div key={g.id} className="glass rounded-2xl overflow-hidden">
            <div className="flex gap-4 p-4">
              <img src={g.image} alt={g.name} loading="lazy" className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold truncate">{g.name}</h3>
                    <p className="text-xs text-muted-foreground">{g.publisher} · {g.category}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="secondary" className="text-[10px]">{g.packages.length} packages</Badge>
                  <Badge variant="secondary" className="text-[10px]">{g.orders} orders</Badge>
                  <Badge variant="secondary" className="text-[10px]">★ {g.rating}</Badge>
                </div>
              </div>
            </div>
            <div className="border-t border-border/50 p-4 space-y-2">
              {g.packages.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{p.label}</div>
                    {p.discount && <div className="text-[11px] text-success">-{p.discount}% discount</div>}
                  </div>
                  <div className="font-mono font-semibold">${p.price.toFixed(2)}</div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full"><Plus className="h-3 w-3" /> Add package</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGames;
