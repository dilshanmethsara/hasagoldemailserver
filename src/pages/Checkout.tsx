import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MD5 from 'crypto-js/md5';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CreditCard, 
  Wallet, 
  Bitcoin, 
  Smartphone, 
  ArrowLeft, 
  ShieldCheck, 
  Zap,
  Check,
  Plus,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { createOrder, fetchPaymentConfigs } from "@/lib/db";
import { toast } from "sonner";
import { uploadReceiptToDiscord } from "@/lib/discord";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [method, setMethod] = useState("ezcash");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [paymentConfigs, setPaymentConfigs] = useState<any[]>([]);
  const [loadingConfigs, setLoadingConfigs] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Load live payment configs from Firestore
  useEffect(() => {
    const loadConfigs = async () => {
      const configs = await fetchPaymentConfigs();
      setPaymentConfigs(configs);
      setLoadingConfigs(false);
      
      // Default to first active method if available
      const firstActive = configs.find(c => c.status === "active");
      if (firstActive) setMethod(firstActive.id);
    };
    loadConfigs();
  }, []);

  const orderData = sessionStorage.getItem("hasagoldstore:order");
  if (!orderData) {
    navigate("/");
    return null;
  }

  const order = JSON.parse(orderData);
  const fee = order.package.price * 0.02;
  const total = order.package.price + fee;

  const saveOrderToDB = async (isManual: boolean, finalReceiptUrl: string | null) => {
    try {
      const orderData = {
        userId: user?.uid || "guest",
        userEmail: user?.email || "guest",
        userName: user?.displayName || "Valued Customer",
        gameId: order.gameId,
        gameName: order.gameName,
        packageName: order.package.label,
        amount: total,
        method: method,
        status: isManual ? "pending" : "completed",
        playerId: order.fields[Object.keys(order.fields)[0]],
        fields: order.fields,
        receipt: finalReceiptUrl
      };
      
      console.log("Creating order with data:", orderData);
      console.log("Current user:", { uid: user?.uid, email: user?.email });
      
      // Create order in Firestore and get the real ID
      const realOrderId = await createOrder(orderData);

      sessionStorage.setItem(
        "hasagoldstore:lastOrder",
        JSON.stringify({ ...order, orderId: realOrderId, method, total, status: isManual ? "pending" : "completed", date: new Date().toISOString() }),
      );
      
      toast.success("Payment successful!");
      navigate(`/order-success/${realOrderId}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong saving the order. Please try again.");
      setProcessing(false);
    }
  };

  const handleTermsClick = () => {
    navigate("/terms");
  };

  const handlePrivacyClick = () => {
    navigate("/privacy");
  };

  const handlePay = async () => {
    if (!agreedToTerms) {
      toast.error("Please agree to our Terms of Service and Privacy Policy.");
      return;
    }

    setProcessing(true);
    const config = paymentConfigs.find(c => c.id === method);
    const isManual = config?.type === "manual";
    
    if (isManual && !receipt) {
      toast.error("Please upload your payment receipt first.");
      setProcessing(false);
      return;
    }

    try {
      if (!isManual) {
        // Automatic Payment Flow (PayHere Sandbox)
        const merchantId = import.meta.env.VITE_PAYHERE_MERCHANT_ID;
        const merchantSecret = import.meta.env.VITE_PAYHERE_SECRET;
        
        if (!merchantId || !merchantSecret) {
          toast.error("Payment Gateway is not configured properly.");
          setProcessing(false);
          return;
        }

        const amountFormatted = total.toFixed(2);
        const currency = "LKR";
        
        // Generate a temporary order ID for PayHere (they need an order_id for the payment)
        const tempOrderId = `NT-${Date.now().toString().slice(-8)}`;
        
        // Use crypto-js MD5 to generate security hash
        // IMPORTANT: In production, this MUST be generated on the backend!
        const hashedSecret = MD5(merchantSecret).toString().toUpperCase();
        const hashString = merchantId + tempOrderId + amountFormatted + currency + hashedSecret;
        const hash = MD5(hashString).toString().toUpperCase();

        const payment = {
            sandbox: true,
            merchant_id: merchantId,
            return_url: `${window.location.origin}/order-success/temp`, // Will be redirected to real order after creation
            cancel_url: `${window.location.origin}/checkout`,
            notify_url: "http://example.com/notify", // Placeholder webhook
            order_id: tempOrderId,
            items: order.gameName + " - " + order.package.label,
            amount: amountFormatted,
            currency: currency,
            hash: hash,
            first_name: user?.displayName?.split(' ')[0] || "Guest",
            last_name: user?.displayName?.split(' ')[1] || "User",
            email: user?.email || "guest@example.com",
            phone: "0771234567",
            address: "No.1, Galle Road",
            city: "Colombo",
            country: "Sri Lanka"
        };

        (window as any).payhere.onCompleted = async function onCompleted() {
          toast.success("PayHere transaction completed!");
          await saveOrderToDB(isManual, null);
        };

        (window as any).payhere.onDismissed = function onDismissed() {
          setProcessing(false);
          toast.error("Payment was cancelled.");
        };

        (window as any).payhere.onError = function onError(error: any) {
          setProcessing(false);
          toast.error("Payment failed: " + error);
        };

        (window as any).payhere.startPayment(payment);
        return; // Halt here, saveOrderToDB will be called onCompleted
      }
      
      let finalReceiptUrl = receipt;
      if (isManual && receipt) {
        toast.loading("Uploading receipt for verification...", { id: "upload" });
        // For manual payments, we need to create the order first to get the real ID for Discord upload
        const tempOrderId = `temp-${Date.now()}`;
        finalReceiptUrl = await uploadReceiptToDiscord(receipt, tempOrderId);
        toast.dismiss("upload");
      }
      
      await saveOrderToDB(isManual, finalReceiptUrl);

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
      setProcessing(false);
    }
  };

  const getMethodIcon = (id: string) => {
    if (id === "ezcash") return Smartphone;
    if (id === "bank") return CreditCard;
    if (id === "card") return CreditCard;
    if (id === "wallet") return Wallet;
    if (id === "crypto") return Bitcoin;
    return CreditCard;
  };

  const activeConfigs = paymentConfigs.filter(c => c.status === "active");
  const selectedConfig = paymentConfigs.find(c => c.id === method);

  if (loadingConfigs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Selection
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-bold tracking-tight">Finalize Secure Payment</h1>
              <p className="text-muted-foreground">Select your preferred payment gateway and provide verification if required.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {activeConfigs.map((m) => {
                const Icon = getMethodIcon(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${
                      method === m.id 
                        ? "border-primary bg-primary/5 shadow-glow-sm" 
                        : "border-border bg-card/40 hover:border-primary/20"
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                      method === m.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground group-hover:text-foreground"
                    }`}>
                      {m.img || m.id === "ezcash" ? (
                        <img src={m.img || "/ezcash.jpg"} alt={m.label} className="h-8 w-8 object-contain rounded-md" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{m.label}</div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{m.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Details / Instructions */}
            {selectedConfig?.type === "manual" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {method === "ezcash" ? (
                    <div>
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Transfer to eZ Cash</h3>
                      <div className="text-2xl font-black mb-1">{selectedConfig.number}</div>
                      <div className="text-xs font-bold text-muted-foreground uppercase">{selectedConfig.name}</div>
                    </div>
                  ) : (
                    <div className="flex-1 w-full max-w-md">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Bank Transfer Details</h3>
                      <div className="grid gap-3">
                        {selectedConfig.accounts ? selectedConfig.accounts.map((acc: any, i: number) => (
                          <div key={i} className="p-4 rounded-xl bg-background/50 border border-border/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="text-sm font-black mb-1 text-white">{acc.bankName}</div>
                            <div className="text-lg font-mono font-bold text-primary mb-1">{acc.number}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{acc.name}</div>
                          </div>
                        )) : (
                          <div className="p-4 rounded-xl bg-background/50 border border-border/50 relative overflow-hidden group">
                            <div className="text-sm font-black mb-1 text-white">{selectedConfig.bankName}</div>
                            <div className="text-lg font-mono font-bold text-primary mb-1">{selectedConfig.number}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{selectedConfig.name}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1 uppercase font-bold">Total Amount</div>
                    <div className="text-2xl font-black text-primary">LKR {total.toLocaleString()}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary/10">
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-3">Upload Payment Receipt / Screenshot</label>
                  <div className="relative group cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setReceipt(reader.result as string);
                            toast.success("Receipt attached successfully!");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                      receipt ? "border-success bg-success/5" : "border-primary/20 bg-primary/5 group-hover:border-primary/40"
                    }`}>
                      {receipt ? (
                        <>
                          <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                            <Check className="h-6 w-6 text-success" />
                          </div>
                          <div className="text-sm font-bold text-success text-center">Receipt Attached</div>
                          <button onClick={(e) => { e.stopPropagation(); setReceipt(null); }} className="text-[10px] underline text-muted-foreground hover:text-destructive">Remove and re-upload</button>
                        </>
                      ) : (
                        <>
                          <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Plus className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-sm font-bold text-primary-foreground/70">Click or Drag to Upload Screenshot</div>
                          <div className="text-[10px] text-muted-foreground">PNG, JPG, or JPEG (Max 5MB)</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedConfig?.type === "automatic" && (
              <div className="p-12 rounded-2xl bg-card/40 border border-border flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">External Payment Gateway</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">You will be redirected to our secure payment processor to complete your transaction.</p>
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="glass p-6 border-white/5 space-y-6 sticky top-24">
              <h3 className="font-display font-bold text-xl">Order Summary</h3>
              
              <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{order.gameName}</div>
                  <div className="text-xs text-primary font-bold">{order.package.label}</div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                {Object.entries(order.fields).map(([key, val]: [string, any]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-muted-foreground uppercase font-bold tracking-wider">{key}</span>
                    <span className="font-mono font-bold text-white">{val}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Amount</span>
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary">LKR {total.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 border border-white/5">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      className="mt-0.5"
                    />
                    <label 
                      htmlFor="terms" 
                      className="text-sm text-muted-foreground leading-relaxed cursor-pointer hover:text-foreground transition-colors"
                    >
                      I agree to the <span onClick={handleTermsClick} className="text-primary font-bold hover:underline cursor-pointer">Terms of Service</span> and <span onClick={handlePrivacyClick} className="text-primary font-bold hover:underline cursor-pointer">Privacy Policy</span>. 
                      I understand that refunds are only issued for system-related delivery failures, not for incorrect information provided by me.
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={handlePay} 
                  disabled={processing || !agreedToTerms}
                  className="w-full h-14 rounded-xl bg-gradient-primary text-primary-foreground font-black text-lg shadow-glow-primary group"
                >
                  {processing ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="h-5 w-5 fill-current" />
                      Complete Order
                    </span>
                  )}
                </Button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  <ShieldCheck className="h-3 w-3 text-success" />
                  Secure SSL Encryption Active
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
