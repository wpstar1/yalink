import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Star, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-seo.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-accent" />
              <span>구글과 네이버가 좋아하는 홈페이지</span>
            </div>
            <div className="bg-gradient-hero text-primary-foreground p-6 rounded-2xl mb-6 text-center">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                <span className="text-accent text-5xl md:text-7xl">15만원</span>
                <br />
                <span className="text-2xl md:text-4xl">홈페이지제작</span>
                <br />
                <span className="text-accent text-3xl md:text-5xl font-black">100% 노출보장</span>
              </h1>
              <div className="text-lg md:text-xl font-semibold opacity-95">
                ✅ 구글 SEO ✅ 네이버 SEO ✅ 사이트맵
                <br />
                ✅ 리치스니펫 ✅ 구조화데이터 ✅ 메타태그
              </div>
            </div>
            <p className="text-xl text-center font-semibold text-secondary">
              🎯 노출 안되면 100% 환불보장!
              <br />
              <span className="text-foreground">SEO 전문가가 직접 제작하는 반응형 홈페이지</span>
            </p>
          </div>

          {/* Features */}
          <div className="bg-muted/50 p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-bold text-primary text-center mb-4">🚀 포함된 SEO 서비스</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "✅ 구글 SEO 최적화 완료",
                "✅ 네이버 SEO 최적화 완료", 
                "✅ 자동 사이트맵 제출",
                "✅ 리치스니펫 구조화데이터",
                "✅ 메타태그 완벽 최적화",
                "✅ 키워드 분석 & 적용",
                "✅ 구글서치콘솔 연동",
                "✅ 네이버서치콘솔 연동"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 bg-background p-3 rounded-lg">
                  <span className="text-sm font-semibold text-foreground">{feature}</span>
                </div>
              ))}
            </div>
            <div className="text-center pt-4">
              <div className="text-lg font-bold text-secondary">💰 모든 것이 포함된 가격: 단 15만원!</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary mb-2">🎯 지금 바로 시작하세요!</div>
              <div className="text-sm text-muted-foreground">24시간 상담 가능 | 당일 견적 제공</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:010-8674-9948" className="flex-1">
                <Button variant="hero" size="lg" className="text-lg px-4 w-full h-16 font-bold flex flex-col">
                  <div>🚀 15만원 홈페이지 제작 문의</div>
                  <div className="text-sm font-normal">노출보장 + SEO 완료</div>
                </Button>
              </a>
              <a href="https://open.kakao.com/o/sYNvVY9g" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="accent" size="lg" className="text-lg px-4 w-full h-16 font-bold flex flex-col">
                  <div>📚 55만원 마스터 강의</div>
                  <div className="text-sm font-normal">30가지 AI툴 + 평생지원</div>
                </Button>
              </a>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-gradient-hero text-primary-foreground p-6 rounded-xl">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-accent mb-2">🔥 검증된 노출 성과</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-black text-accent">500+</div>
                <div className="text-sm font-semibold">노출성공 사이트</div>
              </div>
              <div>
                <div className="text-3xl font-black text-accent">99%</div>
                <div className="text-sm font-semibold">구글 상위노출</div>
              </div>
              <div>
                <div className="text-3xl font-black text-accent">100%</div>
                <div className="text-sm font-semibold">환불보장</div>
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="text-sm font-semibold opacity-90">⚡ 평균 2주내 구글 1페이지 노출 달성!</div>
            </div>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-glow">
            <img 
              src={heroImage} 
              alt="SEO 최적화 홈페이지 제작 서비스"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-hero/10"></div>
          </div>
          
          {/* Floating Cards */}
          <Card className="absolute -top-6 -left-6 p-4 animate-float bg-background/95 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <div>
                <div className="font-semibold text-sm">SEO 점수</div>
                <div className="text-2xl font-bold text-secondary">95/100</div>
              </div>
            </div>
          </Card>
          
          <Card className="absolute -bottom-6 -right-6 p-4 animate-float bg-background/95 backdrop-blur-sm" style={{animationDelay: "1s"}}>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">평균 로딩 속도</div>
              <div className="text-xl font-bold text-primary">0.8초</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;