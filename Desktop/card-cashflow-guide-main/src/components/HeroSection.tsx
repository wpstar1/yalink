import { Button } from "@/components/ui/button";
import { ArrowDown, Shield, Clock, Zap } from "lucide-react";
import heroImage from "@/assets/hero-credit-card.jpg";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <Shield className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">합법적이고 안전한 현금화 서비스</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block">신용카드현금화</span>
            <span className="block text-financial-accent">빠르고 안전하게</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            카드깡과는 다른 <strong>100% 합법적인 현금화 방법</strong>을 안내해드립니다.<br />
            5분 내 현금확보, 신용점수에 영향 없는 안전한 서비스
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-md rounded-lg p-4">
              <Zap className="w-6 h-6 text-financial-accent" />
              <span className="font-semibold">5분 내 현금확보</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-md rounded-lg p-4">
              <Shield className="w-6 h-6 text-financial-accent" />
              <span className="font-semibold">100% 합법적 방법</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-md rounded-lg p-4">
              <Clock className="w-6 h-6 text-financial-accent" />
              <span className="font-semibold">24시간 상담가능</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              onClick={() => scrollToSection("about")}
              className="px-8 py-4 text-lg bg-financial-accent hover:bg-financial-accent/90 text-financial-navy font-semibold shadow-elegant transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              현금화 방법 알아보기
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection("contact")}
              className="px-8 py-4 text-lg border-white/30 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300"
            >
              무료 상담받기
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <button 
              onClick={() => scrollToSection("about")}
              className="text-white/70 hover:text-white transition-colors"
            >
              <ArrowDown className="w-8 h-8 mx-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-financial-accent/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
    </section>
  );
};

export default HeroSection;