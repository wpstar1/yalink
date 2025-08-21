import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MethodsSection from "@/components/MethodsSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import SafetySection from "@/components/SafetySection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <MethodsSection />
      <AdvantagesSection />
      <SafetySection />
      <FAQSection />
      <ContactSection />
      
      <footer className="bg-financial-navy text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80">© 2024 신용카드현금화. 모든 권리 보유.</p>
          <p className="text-sm text-white/60 mt-2">
            합법적이고 안전한 현금화 정보를 제공합니다.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;