import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How fast is the top-up delivery?",
    a: "Most orders are delivered automatically within 30 seconds. In rare cases involving manual verification, delivery can take up to 5 minutes.",
  },
  {
    q: "Is it safe to use my Player ID?",
    a: "Absolutely. We only need your public Player ID to deliver the currency — we never ask for your password or login credentials.",
  },
  {
    q: "Which payment methods do you support?",
    a: "We support credit/debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, crypto, and local methods like UPI, GCash, and OVO.",
  },
  {
    q: "What if my top-up doesn't arrive?",
    a: "If your order isn't delivered within 10 minutes, our 24/7 support team will resolve it instantly — or refund your payment in full.",
  },
  {
    q: "What is your refund policy?",
    a: "We only refund for system-related delivery failures. We don't refund for incorrect Player IDs, wrong server selection, or user-provided errors. Full details in our <Link to=\"/terms\" className=\"text-primary hover:underline\">Terms of Service</Link>.",
  },
  {
    q: "Can I get a discount on bulk orders?",
    a: "Larger packages already include up to 18% bonus. For bulk reseller orders, contact our team for custom pricing.",
  },
  {
    q: "Where can I find your Terms of Service?",
    a: "Our complete <Link to=\"/terms\" className=\"text-primary hover:underline\">Terms of Service</Link> outlines all rules, refund policies, and user responsibilities. Please read it carefully before making a purchase.",
  },
  {
    q: "How do you protect my privacy?",
    a: "We take privacy seriously. Our <Link to=\"/privacy\" className=\"text-primary hover:underline\">Privacy Policy</Link> explains how we collect, use, and protect your personal information. We use 256-bit SSL encryption and never share your data with third parties.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="text-sm text-primary font-bold uppercase tracking-widest mb-3">FAQ</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">Got questions? We have answers.</h2>
      </div>
      <div className="max-w-3xl mx-auto glass-strong rounded-[2rem] p-4 md:p-8 border-white/5">

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/5 last:border-0">
              <AccordionTrigger className="px-4 py-6 text-left hover:no-underline hover:text-primary text-lg font-semibold transition-colors">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6 text-muted-foreground text-base leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

  );
};

