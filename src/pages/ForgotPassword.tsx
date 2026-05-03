import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    
    try {
      console.log("DEBUG: Sending Firebase password reset email to:", email);
      
      // Use Firebase's built-in password reset functionality
      await sendPasswordResetEmail(auth, email, {
        url: `https://hasagold.store/password-reset-action`, // Redirect to custom password reset handler
        handleCodeInApp: false,
      });
      
      setSent(true);
      toast.success("Password reset link sent to your email!");
      console.log("Firebase password reset email sent successfully to:", email);
      
    } catch (error: any) {
      console.error("Firebase password reset error:", error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        toast.error("No account found with this email address.");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Invalid email address format.");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error("Failed to send password reset email. Please try again.");
      }
      
      console.error("Full error details:", {
        code: error.code,
        message: error.message,
        email: email
      });
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
            <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
            
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10 shadow-glow mb-6 border border-primary/20">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            
            <h1 className="font-display text-3xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="bg-card/50"
                  required
                />
              </div>

              <Button 
                type="submit" 
                variant="hero"
                className="w-full h-12 rounded-xl text-lg shadow-glow-accent group"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <Mail className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-success/20 to-success/10 shadow-glow mb-6 border border-success/20">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              
              <h2 className="font-display text-2xl font-bold text-success mb-4">Reset Link Sent!</h2>
              <p className="text-muted-foreground text-lg mb-4">
                We've sent a password reset link to:
              </p>
              <p className="font-mono text-primary text-sm bg-primary/10 rounded-lg p-3 border border-primary/20">
                {email}
              </p>
              <p className="text-muted-foreground text-sm mt-4">
                Check your email and click the link to reset your password. The link will expire in 1 hour.
              </p>
              
              <div className="space-y-3 pt-4">
                <Button 
                  variant="glass"
                  className="w-full"
                  onClick={() => setSent(false)}
                >
                  Send Another Link
                </Button>
                <Link to="/auth">
                  <Button variant="hero" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
