import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { ServiceSection } from "@/components/sections/service";
import { FeaturesSection } from "@/components/sections/features";
import { ResultsSection } from "@/components/sections/results";
import { AiSection } from "@/components/sections/ai";
import { FaqSection } from "@/components/sections/faq";
import { CtaSection } from "@/components/sections/cta";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-turquoise-50 py-3 px-4 text-center border-b border-turquoise-100 mt-16 md:mt-20">
          <a href="/improvement" className="text-turquoise-700 font-bold hover:underline flex items-center justify-center gap-2 text-sm md:text-base">
            🚀 新機能：問い合わせを予約につなげる「予約率改善サービス」はこちら <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <HeroSection />
        <ResultsSection />
        <ServiceSection />
        <FeaturesSection />
        <AiSection />
        <FaqSection />
        <CtaSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
