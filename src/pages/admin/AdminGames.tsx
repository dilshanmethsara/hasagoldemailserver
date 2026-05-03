import { Button } from "@/components/ui/button";
import { Gamepad2, Clock, Lock } from "lucide-react";

const AdminGames = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Games & Packages</h1>
          <p className="text-muted-foreground text-sm">Manage your catalog of games and top-up packages.</p>
        </div>
      </div>

      <div className="glass-strong rounded-3xl p-12 text-center border-white/5">
        <div className="max-w-md mx-auto space-y-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 shadow-glow border border-yellow-500/20">
            <Clock className="h-10 w-10 text-yellow-500" />
          </div>
          
          <div className="space-y-3">
            <h2 className="font-display text-3xl font-bold text-yellow-500">Coming Soon</h2>
            <p className="text-muted-foreground text-lg">
              Games & Packages management is currently under development
            </p>
            <p className="text-muted-foreground text-sm">
              This feature will allow you to add, edit, and manage games and their top-up packages in your store.
            </p>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-xl p-4 border-white/5">
              <h3 className="font-bold text-sm mb-2">🎮 What's Coming:</h3>
              <ul className="text-left text-sm text-muted-foreground space-y-1">
                <li>• Add new games to your catalog</li>
                <li>• Create and manage top-up packages</li>
                <li>• Set pricing and discounts</li>
                <li>• Track game performance metrics</li>
                <li>• Bulk package management</li>
              </ul>
            </div>

            <div className="glass rounded-xl p-4 border-white/5">
              <h3 className="font-bold text-sm mb-2">🔒 Current Status:</h3>
              <ul className="text-left text-sm text-muted-foreground space-y-1">
                <li>• Games are managed via code configuration</li>
                <li>• Package data is static for now</li>
                <li>• Full management interface in development</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Developer access required for configuration changes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGames;
