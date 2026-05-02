import { Hero } from "@/components/home/Hero";
import { FeaturedGames } from "@/components/home/FeaturedGames";
import { Benefits } from "@/components/home/Benefits";
import { LoyaltyPoints } from "@/components/loyalty/LoyaltyPoints";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CTA } from "@/components/home/CTA";

const Index = () => {
  return (
    <>
      <Hero />
      <FeaturedGames />
      <Benefits />
      <LoyaltyPoints />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
};

export default Index;
