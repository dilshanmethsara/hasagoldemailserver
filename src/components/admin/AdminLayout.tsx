import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Gamepad2, Users, CreditCard, Bell, Settings, ArrowLeft } from "lucide-react";

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/games", label: "Games & Packages", icon: Gamepad2 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-[#020617]">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <aside className="hidden md:flex w-72 shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-xl flex-col relative z-20">
        <div className="h-20 flex items-center px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-500">
              <Gamepad2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display font-black text-sm tracking-tight text-white">HASA GOLD</div>
              <div className="text-[10px] text-primary font-bold uppercase tracking-widest">Admin Control</div>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 relative group overflow-hidden ${
                  isActive
                    ? "text-primary bg-primary/5 shadow-[inset_0_0_20px_rgba(var(--primary),0.05)] border border-primary/20"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`
              }
            >
              <it.icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
              {it.label}
              {/* Active Indicator */}
              <NavLink to={it.to} end={it.end} className={({ isActive }) => 
                `absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-l-full transition-all duration-500 ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`
              } />
            </NavLink>
          ))}
        </nav>

        <div className="p-6">
          <Link to="/" className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs font-bold text-muted-foreground hover:text-white hover:bg-white/10 transition-all group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Return to Store
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0 relative z-10 flex flex-col">
        {/* mobile bar */}
        <div className="md:hidden h-16 border-b border-white/5 flex items-center px-4 gap-4 overflow-x-auto scrollbar-none bg-black/80 backdrop-blur-md sticky top-0 z-50">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `text-xs font-bold whitespace-nowrap px-4 py-2 rounded-xl transition-all ${
                  isActive ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground bg-white/5"
                }`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </div>
        <main className="p-6 md:p-10 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
