import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, ArrowRight, Loader2, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
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
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");

  // Real-time password validation
  useEffect(() => {
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
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters!");
          setLoading(false);
          return;
        }
        
        // Check if OTP is sent and valid before creating account
        if (!otpSent && !showOTPInput) {
          toast.error("Please verify your email first or click Send OTP button");
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
        
        // Check if email should bypass verification
        if (shouldBypassEmailVerification(email)) {
          console.log('Email verification bypassed for:', email);
          toast.success("Account created! Email verification completed.");
          navigate("/dashboard");
          return;
        }
        
        // Generate OTP and send email
        const otpCode = await generateOTPCode(userCredential.user.uid, email);
        
        if (otpCode) {
          // Send custom email with OTP via Vercel server
          try {
            console.log('DEBUG: Attempting to send OTP email to:', email);
            console.log('DEBUG: OTP Code:', otpCode);
            console.log('DEBUG: User ID:', userCredential.user.uid);
            
            const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'otp',
                to: email,
                userName: name || 'Valued Customer',
                otpCode: otpCode,
                verificationLink: `https://hasagold.store/verify-otp?email=${encodeURIComponent(email)}&userId=${userCredential.user.uid}&otp=${otpCode}`
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
        
        // Show OTP input after sending OTP
        setShowOTPInput(true);
        setLoading(false);
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

          <form onSubmit={handleAuth} className="space-y-4">
            {/* Sign Up Fields */}
            {!isLogin && (
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">WhatsApp Number *</Label>
                  <div className="flex gap-2">
                    <div className="relative w-20">
                      <select 
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20 pl-2 pr-6 appearance-none text-sm"
                        required
                      >
                        <option value="+94">+94</option>
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                    </div>
                    <div className="relative flex-1">
                      <Input 
                        type="tel" 
                        placeholder="7XXXXXXXX" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                        required
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {/* Email Verification - Sign Up Only */}
            {!isLogin && (
              <div className="space-y-2">
                {!otpSent ? (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleSendOTP}
                    disabled={loading || !email}
                    className="w-full h-10 rounded-lg border-primary/30 text-primary hover:bg-primary/10 text-sm font-medium"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Verify Email Address
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-xs text-success bg-success/10 px-3 py-2 rounded-lg">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Code sent! Check your email
                    </div>
                    <div className="relative">
                      <Input 
                        type="text" 
                        placeholder="Enter 6-digit code" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20 text-center tracking-widest font-mono"
                        maxLength={6}
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
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
                  className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {/* Confirm Password - Sign Up Only */}
            {!isLogin && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 h-11 bg-white/5 border rounded-xl focus:ring-primary/20 ${
                      passwordError ? 'border-destructive/50 focus:ring-destructive/20' : 'border-white/10'
                    }`}
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                {passwordError && (
                  <div className="text-destructive text-xs font-medium">
                    {passwordError}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button 
                type="submit" 
                variant="hero" 
                className="w-full h-11 rounded-xl text-base shadow-glow-accent group"
                disabled={loading || (!isLogin && !otpSent)}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0A0A0B] px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="glass"
                onClick={() => handleSocialLogin('google')}
                disabled={socialLoading !== null}
                className="h-12 rounded-xl border-white/5 hover:bg-white/10"
              >
                {socialLoading === 'google' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="glass"
                onClick={() => handleSocialLogin('github')}
                disabled={socialLoading !== null}
                className="h-12 rounded-xl border-white/5 hover:bg-white/10"
              >
                {socialLoading === 'github' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </>
                )}
              </Button>
            </div>
          </div>

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

          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary font-bold hover:underline transition-colors"
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
