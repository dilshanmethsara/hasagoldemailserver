import { Shield, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0B] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Terms and Conditions
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
              Welcome to HASA Gold Store. These Terms and Conditions govern your use of our website 
              and the purchase of digital game top-up services from our platform. By accessing and 
              using our website, you agree to comply with these terms. Please read them carefully 
              before proceeding with any transactions.
            </p>
          </section>

          {/* Use of Website */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">2. Use of the Website</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Age Requirement:</strong> You must be at least 18 years old to use our website 
                  or make purchases. By using our services, you confirm that you meet this age requirement.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Account Security:</strong> You are responsible for maintaining the confidentiality 
                  of your account information, including your username and password.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Accurate Information:</strong> You agree to provide accurate and current information 
                  during the registration and checkout process.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Prohibited Use:</strong> You may not use our website for any unlawful or unauthorized 
                  purposes, including fraud or money laundering.
                </div>
              </div>
            </div>
          </section>

          {/* Product Information and Pricing */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">3. Product Information and Pricing</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We provide digital game top-up services for various mobile and PC games. 
                All products are digital items delivered electronically.
              </p>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Accuracy:</strong> We strive to provide accurate product descriptions and pricing. 
                  However, we do not guarantee the accuracy or completeness of such information.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Price Changes:</strong> Prices are subject to change without notice. 
                  Any promotions or discounts are valid for a limited time and may be subject to additional terms.
                </div>
              </div>
            </div>
          </section>

          {/* Orders and Payments */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">4. Orders and Payments</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Order Placement:</strong> By placing an order on our website, you are making an 
                  offer to purchase the selected digital products.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Order Cancellation:</strong> We reserve the right to refuse or cancel any order 
                  for any reason, including product availability, pricing errors, or suspected fraudulent activity.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Payment Authorization:</strong> You agree to provide valid payment information and 
                  authorize us to charge the total order amount, including applicable fees, to your chosen payment method.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Secure Processing:</strong> We use PayHere and other trusted third-party payment 
                  processors to handle your payment information securely. We do not store your full payment details.
                </div>
              </div>
            </div>
          </section>

          {/* Delivery and Fulfillment */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">5. Delivery and Fulfillment</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Digital Delivery:</strong> All products are delivered digitally to your game account. 
                  We will make reasonable efforts to ensure timely delivery.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Delivery Time:</strong> Delivery times provided are estimates and may vary based on 
                  game server status and other factors. Most deliveries are completed within 5-30 minutes.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>User Responsibility:</strong> You must provide accurate game ID and server information. 
                  We are not responsible for delivery failures due to incorrect information provided by you.
                </div>
              </div>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">6. Returns and Refunds</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Digital Products:</strong> All digital products are non-returnable and non-refundable 
                  once delivered, except in cases of delivery failure due to our system issues.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>No Refunds for User Error:</strong> We do not refund for incorrect Player IDs, 
                  wrong server selection, invalid user information, or other user-provided errors.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <strong>System Failures:</strong> If we fail to deliver your order due to system issues, 
                  you are eligible for a full refund or redelivery.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Refund Processing:</strong> Refunds will be processed within 7 business days 
                  after approval. Please refer to our detailed Refund Policy for more information.
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Website Content:</strong> All content and materials on our website, including 
                  text, images, logos, and graphics, are protected by intellectual property rights and 
                  are the property of HASA Gold Store or its licensors.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Restricted Use:</strong> You may not use, reproduce, distribute, or modify any 
                  content from our website without our prior written consent.
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Limitation:</strong> In no event shall HASA Gold Store, its directors, employees, 
                  or affiliates be liable for any direct, indirect, incidental, special, or consequential 
                  damages arising out of or in connection with your use of our website or the purchase 
                  and use of our products.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <strong>No Warranties:</strong> We make no warranties or representations, express or implied, 
                  regarding the quality, accuracy, or suitability of the products offered on our website.
                </div>
              </div>
            </div>
          </section>

          {/* Amendments and Termination */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">9. Amendments and Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify, update, or terminate these Terms and Conditions at any time 
              without prior notice. It is your responsibility to review these terms periodically for any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you have any questions or concerns regarding these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> support@hasa.gold</p>
              <p><strong>WhatsApp:</strong> +94763046704 (Mr. Hasa)</p>
              <p><strong>Website:</strong> www.hasagold.store</p>
            </div>
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

export default TermsOfService;
