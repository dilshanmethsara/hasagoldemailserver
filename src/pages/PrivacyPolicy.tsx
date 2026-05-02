import { Shield, Eye, Lock, Database, Cookie, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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
            Privacy Policy
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
              At HASA Gold Store, we are committed to protecting the privacy and security of our customers' 
              personal information. This Privacy Policy outlines how we collect, use, and safeguard your 
              information when you visit or make a purchase on our website. By using our website, you 
              consent to the practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white mb-1">Personal Information</h3>
                  <p className="text-muted-foreground text-sm">Name, email address, and phone number when you create an account or make a purchase.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white mb-1">Game Information</h3>
                  <p className="text-muted-foreground text-sm">Player IDs, game usernames, server information, and purchase history.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white mb-1">Payment Information</h3>
                  <p className="text-muted-foreground text-sm">Payment method details are processed securely through third-party payment processors.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Process and deliver your game top-up orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Provide customer support and respond to inquiries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Improve our services and user experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Prevent fraud and ensure security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Send important updates about your orders</span>
              </li>
            </ul>
          </section>

          {/* Data Protection */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Protection</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">✓</span>
                <span>SSL encryption for all data transmissions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">✓</span>
                <span>Secure Firebase database storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">✓</span>
                <span>Limited access to personal data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">✓</span>
                <span>Regular security updates and monitoring</span>
              </li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. 
              We only share information in the following circumstances:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Payment processors for transaction processing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Game developers for order fulfillment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Legal authorities when required by law</span>
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Access your personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Correct inaccurate information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Request deletion of your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Opt-out of marketing communications</span>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or want to exercise your rights, 
              please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> support@hasa.gold</p>
              <p><strong>WhatsApp:</strong> +94763046704 (Mr. Hasa)</p>
              <p><strong>Website:</strong> www.hasagold.store</p>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <Button 
            variant="hero" 
            onClick={() => navigate(-1)}
            className="rounded-2xl px-8 py-6"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
