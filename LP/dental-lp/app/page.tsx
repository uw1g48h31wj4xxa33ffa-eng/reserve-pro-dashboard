import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { ProblemsSection } from "@/components/sections/problems";
import { ResultsSection } from "@/components/sections/results";
import { ServicesSection } from "@/components/sections/service";
import { FlowSection } from "@/components/sections/flow";
import { FutureSection } from "@/components/sections/future";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemsSection />
        <ResultsSection />
        <ServicesSection />
        <FlowSection />
        <FutureSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
