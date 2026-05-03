import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gamepad2, Lock, Shield } from "lucide-react";

const AdminSettings = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const DEVELOPER_PASSWORD = "@pathum1234";

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEVELOPER_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password. Access denied.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6 max-w-md">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-destructive/20 to-destructive/10 flex items-center justify-center border border-destructive/20">
              <Lock className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Developer Access</h1>
              <p className="text-muted-foreground text-sm">Settings require developer authorization</p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-destructive" />
              <h2 className="font-display font-bold text-destructive">Restricted Area</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Developer Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter developer password"
                className="bg-card/50"
                required
              />
            </div>
            
            {error && (
              <div className="text-destructive text-sm bg-destructive/10 rounded-lg p-3 border border-destructive/20">
                {error}
              </div>
            )}
            
            <Button type="submit" variant="hero" className="w-full">
              Access Settings
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-success/20 to-success/10 flex items-center justify-center border border-success/20">
            <Shield className="h-6 w-6 text-success" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Developer Settings</h1>
            <p className="text-muted-foreground text-sm">Configure store settings and developer options.</p>
          </div>
        </div>
      </div>

      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold">Branding</h2>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Gamepad2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <Button variant="glass" size="sm">Upload logo</Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Store Name</Label>
            <Input defaultValue="HASA GOLD STORE" className="bg-card/50" />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input defaultValue="Instant Game Top-Up" className="bg-card/50" />
          </div>
        </div>
      </section>

      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold">Currency & Region</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Default Currency</Label>
            <Input defaultValue="USD" className="bg-card/50" />
          </div>
          <div className="space-y-2">
            <Label>Default Country</Label>
            <Input defaultValue="United States" className="bg-card/50" />
          </div>
          <div className="space-y-2">
            <Label>Tax Rate (%)</Label>
            <Input type="number" defaultValue="0" className="bg-card/50" />
          </div>
          <div className="space-y-2">
            <Label>Service Fee (%)</Label>
            <Input type="number" defaultValue="2" className="bg-card/50" />
          </div>
        </div>
      </section>

      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold">Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input defaultValue="support@hasagoldstore.gg" className="bg-card/50" />
          </div>
          <div className="space-y-2">
            <Label>Live Chat Webhook</Label>
            <Input placeholder="https://..." className="bg-card/50" />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button variant="glass">Cancel</Button>
        <Button variant="hero">Save changes</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
