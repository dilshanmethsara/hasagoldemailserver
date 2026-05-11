import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gamepad2, Shield, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in as admin
  useEffect(() => {
    const isAdmin = user && (
      user.email === "admin@hasa.gold" || 
      user.email === "dmcreatorstudio04@gmail.com"
    );
    if (isAdmin) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShow2FA(true);
      toast.success("Login successful. Please enter 2FA code.");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    try {
      const API_BASE_URL = 'https://hasagold-email-server.vercel.app';
      const response = await fetch(`${API_BASE_URL}/api/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: twoFactorCode })
      });

      const result = await response.json();

      if (result.success) {
        (window as any).admin_2fa_verified = true;
        toast.success("Welcome back, Administrator");
        navigate("/admin-panel-xcb88");
      } else {
        toast.error(result.error || "Invalid 2FA code. Please try again.");
      }
    } catch (error: any) {
      toast.error("Verification failed: " + error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-strong rounded-[2.5rem] p-8 md:p-12 border-white/5 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow mb-6">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">Admin Portal</h1>
            <p className="text-muted-foreground">Authorized Personnel Only</p>
          </div>

          {!show2FA ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Email Address</label>
                <div className="relative">
                  <Input 
                    type="email" 
                    placeholder="admin@hasa.gold" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                  />
                  <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Password</label>
                <div className="relative">
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full h-12 rounded-xl text-lg shadow-glow-accent group">
                Sign In to Dashboard
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify2FA} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">2FA Verification Code</label>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="000000" 
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20 text-center text-2xl tracking-[0.5em] font-mono"
                  />
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Enter the 6-digit code from your authenticator app.
                </p>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                disabled={isVerifying || twoFactorCode.length !== 6}
                className="w-full h-12 rounded-xl text-lg shadow-glow-accent group"
              >
                {isVerifying ? "Verifying..." : "Verify & Continue"}
                {!isVerifying && <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />}
              </Button>

              <button 
                type="button"
                onClick={() => setShow2FA(false)}
                className="w-full text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Back to Login
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Secured by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
