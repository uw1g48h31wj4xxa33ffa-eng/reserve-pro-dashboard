import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { EmpathySection } from "@/components/sections/empathy";
import { ResultsSection } from "@/components/sections/results";
import { PhilosophySection } from "@/components/sections/philosophy";
import { SystemSection } from "@/components/sections/system";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <EmpathySection />
        <ResultsSection />
        <PhilosophySection />
        <SystemSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
