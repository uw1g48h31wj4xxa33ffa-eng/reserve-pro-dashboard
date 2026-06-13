import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { ProblemsSection } from "@/components/sections/problems";
import { ResultsSection } from "@/components/sections/results";
import { ServicesSection } from "@/components/sections/service";
import { FlowSection } from "@/components/sections/flow";
import { PricingSection } from "@/components/sections/pricing";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* TOP */}
        <HeroSection />
        {/* 運営課題 */}
        <ProblemsSection />
        {/* 実績 */}
        <ResultsSection />
        {/* 支援内容 */}
        <ServicesSection />
        {/* 改善フロー */}
        <FlowSection />
        {/* 料金プラン */}
        <PricingSection />
        {/* お問い合わせ */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
