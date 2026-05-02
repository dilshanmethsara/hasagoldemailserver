import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Home } from "lucide-react";
import { fetchOrderById } from "@/lib/db";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        // Try to fetch the actual order from database first
        const orderData = await fetchOrderById(orderId);
        if (orderData) {
          setOrder(orderData);
        } else {
          // Fallback to sessionStorage if database fetch fails
          const raw = sessionStorage.getItem("hasagoldstore:lastOrder");
          if (raw) setOrder(JSON.parse(raw));
        }
      } else {
        // Fallback to sessionStorage if no orderId in URL
        const raw = sessionStorage.getItem("hasagoldstore:lastOrder");
        if (raw) setOrder(JSON.parse(raw));
      }
    };
    
    loadOrder();
  }, [orderId]);

  return (
    <div className="container py-16 max-w-2xl">
      <div className="glass-strong rounded-3xl p-8 md:p-12 text-center animate-scale-in">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-success/30 blur-2xl rounded-full" />
          <div className="relative h-20 w-20 rounded-full bg-success/20 border border-success/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          {order?.status === "pending" ? "Order Received!" : "Payment Successful!"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {order?.status === "pending" 
            ? "Your order is pending admin verification. We'll process it shortly!" 
            : "Your top-up is being delivered. You'll see it in-game within seconds."}
        </p>

        <div className="glass rounded-2xl p-6 text-left space-y-3 text-sm mb-8">
          <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-semibold">{order?.id || orderId}</span></div>
          {order && (
            <>
              <div className="flex justify-between"><span className="text-muted-foreground">Game</span><span>{order.gameName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Package</span><span>{order.packageName || order.package?.label}</span></div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-semibold ${order.status === "pending" ? "text-primary" : "text-success"}`}>
                  {order.status === "pending" ? "Pending Verification" : "Completed"}
                </span>
              </div>
              <div className="border-t border-border/50 pt-3 flex justify-between items-baseline">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-display text-xl font-bold text-gradient">LKR {order.amount?.toLocaleString() || order.total?.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="glass" size="lg">
            <Download className="h-4 w-4" /> Receipt
          </Button>
          <Button variant="hero" size="lg" asChild>
            <Link to="/"><Home className="h-4 w-4" /> Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
