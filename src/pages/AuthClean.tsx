import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { saveUser, generateOTPCode } from "@/lib/db";
import { shouldBypassEmailVerification } from "@/lib/emailVerification";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+94");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");

  // Real-time password validation
  useState(() => {
    if (!isLogin && confirmPassword) {
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match");
      } else if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword, isLogin]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const otpCode = await generateOTPCode("temp-user-id", email);
      
      if (otpCode) {
        // Send custom email with OTP via Vercel server
        try {
          console.log('DEBUG: Attempting to send OTP email to:', email);
          console.log('DEBUG: OTP Code:', otpCode);
          console.log('DEBUG: User ID: temp-user-id');
          
          const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'otp',
              to: email,
              userName: name || 'Valued Customer',
              otpCode: otpCode,
              verificationLink: `https://hasagold.store/verify-otp?email=${encodeURIComponent(email)}&userId=temp-user-id&otp=${otpCode}`
            })
          });
          
          console.log('DEBUG: Email server response status:', response.status);
          
          const result = await response.json();
          console.log('DEBUG: Email server response:', result);
          
          if (result.success) {
            console.log('✅ Custom OTP email sent to:', email);
            setOtpSent(true);
            toast.success("OTP sent! Please check your email for verification code.");
          } else {
            console.error('❌ Failed to send OTP email:', result);
            toast.error("Failed to send OTP. Please try again.");
          }
        } catch (error) {
          console.error('❌ Network error sending OTP email:', error);
          toast.error("Network error. Please check your connection and try again.");
        }
      } else {
        toast.error("Failed to generate OTP code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

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
          } else {
            console.log('Email not verified for:', email);
            toast.error("Please verify your email before logging in. Check your inbox for the verification link.");
            navigate("/auth?message=verify_email");
            return;
          }
        }
        
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        // Validate passwords match
        if (password !== confirmPassword) {
          toast.error("Passwords do not match!");
          setLoading(false);
          return;
        }
        
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters!");
          setLoading(false);
          return;
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await saveUser(userCredential.user.uid, {
          name,
          email,
          whatsapp: `${countryCode}${phoneNumber}`,
          tier: "Bronze",
          spent: 0,
          orders: 0,
          emailVerified: false,
        });
        
        // Don't generate OTP automatically on signup
        
        // Check if email should bypass verification
        if (shouldBypassEmailVerification(email)) {
          console.log('Email verification bypassed for:', email);
          toast.success("Account created! Email verification completed.");
          navigate("/dashboard");
          return;
        }
        
        // Send user to OTP verification page with instructions
        navigate(`/verify-otp?email=${encodeURIComponent(email)}&userId=${userCredential.user.uid}&mode=new-user`);
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
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user) {
        await updateProfile(user, { displayName: user.displayName || user.email?.split('@')[0] });
        await saveUser(user.uid, {
          name: user.displayName || user.email?.split('@')[0],
          email: user.email || "",
          tier: "Bronze",
          spent: 0,
          orders: 0,
          emailVerified: user.emailVerified || false,
        });
        
        toast.success(`Welcome ${user.displayName || user.email}!`);
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    
    setResendLoading(true);
    try {
      const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'verification',
          to: email,
          userName: 'Gamer',
          verificationLink: `https://hasagold.store/email-action`
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        toast.error("Failed to send verification email. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-strong rounded-[2.5rem] p-8 md:p-10 border-white/5 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow mb-6">
              <Gamepad2 className="h-8 w-8 text-primary-foreground" />
            </div>
            
            <h1 className="font-display text-3xl font-black mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {isLogin ? "Enter your credentials to access your account" : "Join HASA GOLD STORE and start gaming"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Full Name</Label>
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
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">WhatsApp Number *</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select 
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20 pl-3 pr-8 appearance-none"
                          required
                        >
                          <option value="+94">+94</option>
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7 7v5a2 2 0 0 0 2-2h-10a2 2 0 0 0 2-2v-5a2 2 0 0 0 2 2z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="relative flex-2">
                        <Input 
                          type="tel" 
                          placeholder="712345678" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                          required
                          pattern="[0-9]{8,12}"
                          title="Please enter a valid phone number"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isLogin && !otpSent && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-2"
                      >
                        <Button 
                          type="button"
                          variant="glass"
                          onClick={handleSendOTP}
                          disabled={loading}
                          className="w-full h-12 rounded-xl border-white/5 hover:bg-white/10 transition-colors"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              Sending OTP...
                            </>
                          ) : (
                            <>
                              <Lock className="h-5 w-5 mr-2" />
                              Send OTP
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Email Address</Label>
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
                <Label className="text-sm font-medium">Password</Label>
                {isLogin && (
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot Password?
                  </Link>
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

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 h-12 bg-white/5 border rounded-xl focus:ring-primary/20 ${
                        passwordError ? 'border-destructive/50 focus:ring-destructive/20' : 'border-white/10'
                      }`}
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                  {passwordError && (
                    <div className="text-destructive text-sm font-medium animate-pulse">
                      {passwordError}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              type="submit" 
              variant="hero" 
              className="w-full h-12 rounded-xl text-lg shadow-glow-accent group"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {message === "verify_email" && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl bg-success/10 border border-success/20"
            >
              <div className="text-center">
                <div className="h-8 w-8 text-success mx-auto mb-2 flex items-center justify-center">
                  ✓
                </div>
                <h3 className="font-bold text-success mb-2">Verification Email Sent!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please check your email and click the verification link to complete your account setup.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResendVerification}
                  disabled={resendLoading || !email}
                  className="h-8 text-xs border-success/20 text-success hover:bg-success/20"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link to="/auth" className="text-primary hover:underline font-medium">
                {isLogin ? "Create Account" : "Sign In"}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
