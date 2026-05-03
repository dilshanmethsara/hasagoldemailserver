import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { verifyOTPCode, markOTPUsedAndUpdateUser } from "@/lib/db";
import { auth } from "@/lib/firebase";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await verifyOTPCode(otp, email || "");
      
      if (result.valid) {
        // Mark OTP as used and update user verification
        const userId = searchParams.get("userId");
        if (userId) {
          await markOTPUsedAndUpdateUser(otp, userId);
        }
        
        setVerified(true);
        toast.success("Email verified successfully!");
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
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
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow mb-6">
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              
              <h1 className="font-display text-3xl font-bold mb-2">🎉 Email Verified!</h1>
              <p className="text-muted-foreground mb-8">
                Your email has been successfully verified.<br />
                You can now login to your account.
              </p>
              
              <Button 
                onClick={() => navigate("/auth")}
                variant="hero"
                className="w-full h-12 rounded-xl text-lg shadow-glow-accent group"
              >
                Continue to Login
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
              <ArrowRight className="h-4 w-4" />
              Back to Login
            </Link>
          </div>

          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow mb-6">
                <Lock className="h-8 w-8 text-primary-foreground" />
              </div>
              
              <h1 className="font-display text-3xl font-bold mb-2">🔐 Verify Your Email</h1>
              <p className="text-muted-foreground mb-4">
                Enter the 6-digit verification code sent to your email
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email Address</Label>
                <Input
                  type="email"
                  value={email || ""}
                  readOnly
                  className="h-12 bg-white/5 border-white/10 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">OTP Code</Label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className={`h-12 bg-white/5 border rounded-xl text-center text-lg font-mono tracking-widest ${
                    error ? 'border-destructive/50 focus:ring-destructive/20' : 'border-white/10 focus:ring-primary/20'
                  }`}
                  required
                />
              </div>

              {error && (
                <div className="text-destructive text-sm font-medium animate-pulse">
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
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email
                    <Lock className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
