import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { verifyPasswordResetToken, updateUserPassword, deletePasswordResetToken } from "@/lib/db";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    const verifyToken = async () => {
      setLoading(true);
      try {
        const result = await verifyPasswordResetToken(token);
        
        if (result.valid) {
          setShowPassword(true);
          setSuccess(false);
          setError("");
        } else {
          setError(result.message);
          setShowPassword(false);
        }
      } catch (err) {
        setError("Error verifying token");
        setShowPassword(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyPasswordResetToken(token);
      
      if (result.valid) {
        const updateSuccess = await updateUserPassword(result.email, password);
        
        if (updateSuccess) {
          await deletePasswordResetToken(token);
          setShowNewPassword(true);
          setSuccess(true);
          setError("");
          toast.success("Password reset successfully!");
        } else {
          setError("Failed to update password");
        }
      } else {
        setError("Invalid token");
      }
    } catch (err) {
      setError("Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0B]">
      {/* Dynamic Background */}
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
          <div className="text-center mb-8">
            <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>

          {!showPassword ? (
            <div className="text-center space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10 shadow-glow mb-6 border border-primary/20">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              
              <h2 className="font-display text-2xl font-bold mb-2">Verifying Reset Token</h2>
              <p className="text-muted-foreground">Please wait while we verify your password reset link...</p>
              
              {loading && (
                <div className="flex justify-center">
                  <div className="h-8 w-8 border-4 border-primary/30 border-t-primary/20 animate-spin"></div>
                </div>
              )}
            </div>
          ) : success ? (
            <div className="text-center space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-success/20 to-success/10 shadow-glow mb-6 border border-success/20">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              
              <h2 className="font-display text-2xl font-bold text-success mb-2">Password Reset Complete!</h2>
              <p className="text-muted-foreground">Your password has been successfully updated.</p>
              
              <Button 
                onClick={() => navigate("/auth")}
                variant="hero"
                className="w-full h-12 rounded-xl text-lg shadow-glow-accent"
              >
                Continue to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-warning/20 to-warning/10 shadow-glow mb-6 border border-warning/20">
                  <Lock className="h-8 w-8 text-warning" />
                </div>
                
                <h2 className="font-display text-2xl font-bold mb-2">Reset Password</h2>
                <p className="text-muted-foreground">Enter your new password below.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showNewPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="bg-card/50 pr-12"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="bg-card/50 pr-12"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                      <div className="h-5 w-5 border-2 border-primary-foreground border-t-primary-foreground animate-spin mr-2"></div>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowLeft className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <Button 
                  variant="glass"
                  className="w-full"
                  onClick={() => navigate("/auth")}
                >
                  Back to Login
                </Button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
