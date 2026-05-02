import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gamepad2, Mail, Lock, User, ArrowRight, Github, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendEmailVerification,
  signOut
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { saveUser } from "@/lib/db";
import { shouldBypassEmailVerification } from "@/lib/emailVerification";



const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check if email is verified (with bypass system)
        if (!userCredential.user.emailVerified) {
          if (shouldBypassEmailVerification(email)) {
            console.log('Email verification bypassed for:', email);
            toast.success("Welcome back! Email verification completed.");
            navigate("/dashboard");
            return;
          }
          
          await signOut(auth);
          toast.error("Please verify your email before logging in. Check your inbox for the verification link.");
          return;
        }
        
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await saveUser(userCredential.user.uid, {
          name,
          email,
          tier: "Bronze",
          spent: 0,
          orders: 0,
          emailVerified: false,
        });
        
        // Check if email should bypass verification
        if (shouldBypassEmailVerification(email)) {
          console.log('Email verification bypassed for:', email);
          toast.success("Account created! Email verification completed.");
          navigate("/dashboard");
          return;
        }
        
        // Send Firebase email verification
        await sendEmailVerification(userCredential.user, {
          url: `https://hasagoldstore.web.app/auth?message=email_verified`,
          handleCodeInApp: true,
        });
        
        // Sign out user until they verify email
        await signOut(auth);
        toast.success("Account created! Please check your email and verify your account.");
        navigate("/auth?message=verify_email");
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'github') => {
    setSocialLoading(providerName);
    try {
      const provider = providerName === 'google' 
        ? new GoogleAuthProvider() 
        : new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    setResendLoading(true);
    try {
      // Try to sign in the user to get their user object
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Send Firebase verification email
      await sendEmailVerification(userCredential.user, {
        url: `https://hasagoldstore.web.app/auth?message=email_verified`,
        handleCodeInApp: true,
      });
      
      // Sign them out again
      await signOut(auth);
      
      toast.success("Verification email resent! Please check your inbox.");
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        toast.error("No account found with this email address.");
      } else if (error.code === 'auth/wrong-password') {
        toast.error("Incorrect password. Please check your credentials.");
      } else {
        toast.error("Failed to resend verification email: " + error.message);
      }
    } finally {
      setResendLoading(false);
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
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-strong rounded-[2.5rem] p-8 md:p-10 border-white/5 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow mb-6">
              <Gamepad2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">
              {isLogin ? "Welcome Back" : "Join the Elite"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "Enter your credentials to access your account" : "Create an account to start your journey"}
            </p>
          </div>

          {message === "verify_email" && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center"
            >
              <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-bold text-primary mb-1">Check Your Email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We've sent a verification link to your email. Please verify your account before logging in.
              </p>
              {isLogin && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Didn't receive the email? Enter your credentials below to resend.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleResendVerification}
                    disabled={resendLoading || !email || !password}
                    className="h-8 text-xs border-primary/20 text-primary hover:bg-primary/20"
                  >
                    {resendLoading ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : null}
                    Resend Verification
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {message === "email_verified" && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-success/10 border border-success/20 text-center"
            >
              <div className="h-8 w-8 text-success mx-auto mb-2 flex items-center justify-center">
                ✓
              </div>
              <h3 className="font-bold text-success mb-1">Email Verified!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your email has been successfully verified. You can now log in to your account.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLogin(true)}
                className="h-8 text-xs border-success/20 text-success hover:bg-success/20"
              >
                Sign In Now
              </Button>
            </motion.div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium ml-1">Full Name</label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Email Address</label>
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs text-primary hover:underline">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              className="w-full h-12 rounded-xl text-lg shadow-glow-accent group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="glass" 
              className="h-11 rounded-xl border-white/5 hover:bg-white/5" 
              onClick={() => handleSocialLogin('google')}
              disabled={socialLoading !== null}
            >
              {socialLoading === 'google' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4 mr-2" />
              )}
              {socialLoading === 'google' ? 'Connecting...' : 'Google'}
            </Button>
            <Button 
              variant="glass" 
              className="h-11 rounded-xl border-white/5 hover:bg-white/5" 
              onClick={() => handleSocialLogin('github')}
              disabled={socialLoading !== null}
            >
              {socialLoading === 'github' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Github className="h-4 w-4 mr-2" />
              )}
              {socialLoading === 'github' ? 'Connecting...' : 'GitHub'}
            </Button>
          </div>


          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
