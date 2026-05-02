import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gamepad2 } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your store branding and preferences.</p>
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
