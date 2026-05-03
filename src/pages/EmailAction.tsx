import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { applyActionCode, checkActionCode } from "firebase/auth";
import { auth } from "@/lib/firebase";

const EmailAction = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mode = searchParams.get("mode");
  const actionCode = searchParams.get("oobCode");
  const apiKey = searchParams.get("apiKey");
  const continueUrl = searchParams.get("continueUrl");

  useEffect(() => {
    // Debug: Log all URL parameters
    console.log("EmailAction Debug:", {
      mode,
      actionCode,
      apiKey,
      continueUrl,
      fullUrl: window.location.href
    });
    handleEmailAction();
  }, []);

  const handleEmailAction = async () => {
    if (!actionCode || mode !== "verifyEmail") {
      setError("Invalid verification link.");
      setLoading(false);
      return;
    }

    try {
      // First check if the action code is valid
      const info = await checkActionCode(auth, actionCode);
      console.log("Action code info:", info);
      
      // Then apply the action code
      await applyActionCode(auth, actionCode);
      setSuccess(true);
      toast.success("Email verified successfully!");
    } catch (err: any) {
      console.error("Email action error:", err);
      setError(err.message || "Verification failed.");
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
              <h1 className="font-display text-3xl font-bold mb-2">Verifying Email</h1>
              <p className="text-muted-foreground">Please wait while we verify your account...</p>
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
              
              <h1 className="font-display text-3xl font-bold mb-2">🎉 Email Verified!</h1>
              <p className="text-muted-foreground mb-8">
                Welcome to <span className="text-primary font-bold">HASA GOLD STORE</span>!<br />
                Your email has been successfully verified.
              </p>

              <div className="bg-success/10 rounded-xl p-6 mb-8 border border-success/20">
                <h3 className="font-bold text-success mb-3">✨ What You Get:</h3>
                <ul className="text-left text-muted-foreground space-y-2 text-sm">
                  <li>✅ Instant game top-ups with exclusive discounts</li>
                  <li>✅ VIP member rewards and bonuses</li>
                  <li>✅ 24/7 premium customer support</li>
                  <li>✅ Secure payment processing</li>
                </ul>
              </div>
              
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
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 shadow-glow mb-6 border border-destructive/20">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            
            <h1 className="font-display text-3xl font-bold mb-2">⚠️ Verification Failed</h1>
            <p className="text-muted-foreground mb-8">{error}</p>

            <div className="bg-destructive/10 rounded-xl p-6 mb-8 border border-destructive/20">
              <p className="text-destructive text-sm">
                This link may have expired or already been used. Please try logging in or request a new verification email.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/auth")}
                variant="hero"
                className="w-full h-12 rounded-xl text-lg shadow-glow-accent"
              >
                Go to Login
              </Button>
              <Button 
                onClick={() => navigate("/auth?message=verify_email")}
                variant="glass"
                className="w-full h-12 rounded-xl border-white/5 hover:bg-white/5"
              >
                Resend Verification Email
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailAction;
