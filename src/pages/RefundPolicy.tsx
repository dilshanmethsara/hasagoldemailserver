import { Shield, AlertCircle, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const RefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0B] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Refund Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Thank you for shopping at HASA Gold Store. We value your satisfaction and strive to provide 
              you with the best online gaming top-up experience possible. If, for any reason, you are not 
              completely satisfied with your purchase, we are here to help.
            </p>
          </section>

          {/* Digital Products Policy */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">2. Digital Products Policy</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>No Returns:</strong> All digital products, including game currency, items, and top-up 
                  services, are non-returnable once delivered to your game account.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Immediate Delivery:</strong> Digital products are delivered immediately upon successful 
                  payment verification. By completing a purchase, you acknowledge the immediate nature of delivery.
                </div>
              </div>
            </div>
          </section>

          {/* Refund Eligibility */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">3. Refund Eligibility</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <strong>System Failures:</strong> You are eligible for a full refund if we fail to deliver 
                  your order due to technical issues, server problems, or system failures on our end.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Payment Processing Errors:</strong> If you are charged multiple times for the same 
                  order due to payment processing errors, you are eligible for a refund of the duplicate charges.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Service Unavailability:</strong> If the game service becomes permanently unavailable 
                  within 24 hours of purchase, you may be eligible for a refund.
                </div>
              </div>
            </div>
          </section>

          {/* Non-Refundable Situations */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">4. Non-Refundable Situations</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Incorrect Information:</strong> No refunds will be provided for orders where incorrect 
                  Player ID, server information, or other user-provided details result in failed delivery.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Wrong Game/Package:</strong> No refunds for purchasing the wrong game or package 
                  after delivery has been completed.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Account Issues:</strong> No refunds for issues related to your game account, 
                  including bans, suspensions, or account access problems.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Change of Mind:</strong> No refunds for change of mind or deciding not to use 
                  the purchased digital items.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Game Updates:</strong> No refunds due to game updates, balance changes, or 
                  modifications made by game developers.
                </div>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">5. Refund Process</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Contact Support:</strong> To request a refund, contact our customer support 
                  team within 7 days of the original purchase date.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Provide Details:</strong> Include your order ID, email address used for purchase, 
                  and a detailed explanation of why you believe you are eligible for a refund.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Investigation:</strong> Our team will investigate your claim and respond within 
                  3-5 business days.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Refund Processing:</strong> Approved refunds will be processed within 7 business 
                  days and returned to your original payment method.
                </div>
              </div>
            </div>
          </section>

          {/* Processing Time */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">6. Processing Time</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Review Period:</strong> Refund requests are reviewed within 3-5 business days 
                  of submission.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Refund Timeline:</strong> Once approved, refunds will be processed within 
                  7 business days.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Bank Processing:</strong> Please note that it may take additional time 
                  for the refund to appear in your account, depending on your payment provider.
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you have any questions or concerns regarding our Refund Policy, please contact our 
              customer support team. We are here to assist you and ensure your shopping experience 
              with us is enjoyable and hassle-free.
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> support@hasa.gold</p>
              <p><strong>WhatsApp:</strong> +94763046704 (Mr. Hasa)</p>
              <p><strong>Website:</strong> www.hasagold.store</p>
            </div>
          </section>

          {/* Important Note */}
          <section className="glass rounded-3xl p-8 border border-warning/20 bg-warning/5">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-warning" />
              Important Note
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This Refund Policy is provided as a general guideline for our digital game top-up services. 
              By making a purchase on our website, you acknowledge that you have read, understood, and 
              agree to these terms. We reserve the right to modify this policy at any time without prior notice.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="border-white/10 hover:bg-white/5 rounded-xl"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
