import { Badge } from "@/components/ui/badge";
import { ShoppingBag, AlertTriangle, CheckCircle2, Info, Bell } from "lucide-react";

const notifs = [
  { type: "order", icon: ShoppingBag, color: "text-primary bg-primary/10 border-primary/20", title: "New order received", desc: "Order NT-83920193 — Free Fire 1060 Diamonds — $13.99", time: "Just now", unread: true },
  { type: "alert", icon: AlertTriangle, color: "text-warning bg-warning/10 border-warning/20", title: "Low stock alert", desc: "Genshin Impact 8080 Crystals supply running low.", time: "10 min ago", unread: true },
  { type: "system", icon: CheckCircle2, color: "text-success bg-success/10 border-success/20", title: "Payment gateway healthy", desc: "All providers operating normally.", time: "1 hour ago", unread: false },
  { type: "order", icon: ShoppingBag, color: "text-primary bg-primary/10 border-primary/20", title: "10 new orders in the last hour", desc: "Sales are trending up 24% vs yesterday.", time: "1 hour ago", unread: false },
  { type: "info", icon: Info, color: "text-secondary bg-secondary/10 border-secondary/20", title: "Weekly report available", desc: "Your performance report for last week is ready.", time: "Yesterday", unread: false },
];

const AdminNotifications = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm">System alerts and recent activity.</p>
        </div>
        <Badge className="bg-primary/15 text-primary border-primary/30"><Bell className="h-3 w-3" /> 2 unread</Badge>
      </div>

      <div className="glass rounded-2xl divide-y divide-border/40">
        {notifs.map((n, i) => (
          <div key={i} className={`flex gap-4 p-5 ${n.unread ? "bg-primary/[0.03]" : ""}`}>
            <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${n.color}`}>
              <n.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{n.title}</span>
                {n.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{n.desc}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;
