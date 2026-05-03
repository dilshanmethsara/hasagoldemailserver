import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Lock, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";

const PasswordResetAction = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const mode = searchParams.get("mode");
  const actionCode = searchParams.get("oobCode");
  const apiKey = searchParams.get("apiKey");
  const continueUrl = searchParams.get("continueUrl");

  useEffect(() => {
    // Debug: Log all URL parameters
    console.log("PasswordResetAction Debug:", {
      mode,
      actionCode,
      apiKey,
      continueUrl,
      fullUrl: window.location.href
    });
    
    if (!actionCode || mode !== "resetPassword") {
      setError("Invalid password reset link.");
      setLoading(false);
      return;
    }

    // Verify the reset code first
    verifyResetCode();
  }, []);

  const verifyResetCode = async () => {
    try {
      // First check if the action code is valid
      const info = await verifyPasswordResetCode(auth, actionCode);
      console.log("Password reset code info:", info);
      setLoading(false);
    } catch (err: any) {
      console.error("Password reset code error:", err);
      setError(err.message || "Invalid or expired reset link.");
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0B]">
        {/* Dynamic Background - matching Auth page */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-strong rounded-[2.5rem] p-8 md:p-10 border-white/5 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow mb-6">
                <Loader2 className="h-7 w-7 text-primary-foreground animate-spin" />
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">Resetting Password</h1>
              <p className="text-muted-foreground">Please wait while we verify your reset link...</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0B]">
        {/* Dynamic Background - matching Auth page */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-strong rounded-[2.5rem] p-8 md:p-10 border-white/5 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-success/20 to-success/10 shadow-glow mb-6 border border-success/20">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              
              <h1 className="font-display text-3xl font-bold mb-2">🎉 Password Reset!</h1>
              <p className="text-muted-foreground mb-8">
                Your password has been successfully updated.<br />
                You can now login with your new password.
              </p>
              
              <Button 
                onClick={() => navigate("/auth")}
                variant="hero"
                className="w-full h-12 rounded-xl text-lg shadow-glow-accent group"
              >
                Continue to Login
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0B]">
      {/* Dynamic Background - matching Auth page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-strong rounded-[2.5rem] p-8 md:p-10 border-white/5 shadow-2xl">
          <div className="text-center mb-6">
            <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>

          {error ? (
            <div className="text-center space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 shadow-glow mb-6 border border-destructive/20">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              
              <h1 className="font-display text-3xl font-bold mb-2">⚠️ Reset Failed</h1>
              <p className="text-muted-foreground mb-8">{error}</p>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/auth")}
                  variant="hero"
                  className="w-full h-12 rounded-xl text-lg shadow-glow-accent"
                >
                  Go to Login
                </Button>
                <Button 
                  onClick={() => navigate("/forgot-password")}
                  variant="glass"
                  className="w-full h-12 rounded-xl border-white/5 hover:bg-white/5"
                >
                  Request New Reset Link
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-warning/20 to-warning/10 shadow-glow mb-6 border border-warning/20">
                  <Lock className="h-8 w-8 text-warning" />
                </div>
                
                <h1 className="font-display text-3xl font-bold mb-2">Reset Password</h1>
                <p className="text-muted-foreground">Enter your new password below.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full h-12 bg-card/50 border border-white/10 rounded-xl pl-4 pr-12 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full h-12 bg-card/50 border border-white/10 rounded-xl pl-4 pr-12 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="text-destructive text-sm bg-destructive/10 rounded-lg p-3 border border-destructive/20">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="hero"
                  className="w-full h-12 rounded-xl text-lg shadow-glow-accent group"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <Lock className="h-5 w-5 ml-2 transition-transform group-hover:scale-110" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordResetAction;
