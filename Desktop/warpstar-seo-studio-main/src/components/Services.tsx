import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, GraduationCap, Search, Smartphone, Zap } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: "홈페이지 제작 15만원",
      price: "단 15만원",
      description: "🚀 완벽한 SEO + 노출보장 패키지",
      features: [
        "✅ 구글 SEO 완벽 최적화",
        "✅ 네이버 SEO 완벽 최적화",
        "✅ 리치스니펫 + 구조화데이터",
        "✅ 메타태그 + 키워드분석",
        "✅ 자동사이트맵 + 서치콘솔연동",
        "✅ 반응형 모바일 완벽 대응",
        "✅ 사이트 속도 최적화",
        "✅ 100% 노출보장 (안되면 환불!)"
      ],
      highlight: "🔥 노출보장",
      variant: "hero" as const
    },
    {
      icon: GraduationCap,
      title: "홈페이지 제작 1:1강의",
      price: "55만원",
      description: "체계적인 웹개발 + SEO 마스터 과정",
      features: [
        "홈페이지 제작 A-Z 강의",
        "30가지 이상 무료 AI 툴",
        "클로드, 커서AI 완전 정복",
        "전체 프로그램 평생 무료",
        "백링크 서비스 30% 할인"
      ],
      highlight: "인기",
      variant: "accent" as const
    }
  ];

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              워프스타 서비스
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            구글과 네이버가 좋아하는 홈페이지는 따로 있습니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="relative overflow-hidden hover:shadow-primary transition-all duration-300 group">
                {service.highlight && (
                  <div className="absolute top-4 right-4">
                    <Badge variant={service.highlight === "노출보장" ? "secondary" : "destructive"}>
                      {service.highlight}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gradient-hero rounded-full w-fit">
                    <IconComponent className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{service.price}</div>
                  <CardDescription className="text-lg">{service.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-gradient-hero rounded-full"></div>
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {service.title === "홈페이지 제작 15만원" ? (
                    <a href="tel:010-8674-9948">
                      <Button 
                        variant={service.variant} 
                        size="lg" 
                        className="w-full group-hover:scale-105 transition-transform text-lg font-bold h-14"
                      >
                        🚀 지금 15만원 제작 시작!
                      </Button>
                    </a>
                  ) : (
                    <a href="https://open.kakao.com/o/sYNvVY9g" target="_blank" rel="noopener noreferrer">
                      <Button 
                        variant={service.variant} 
                        size="lg" 
                        className="w-full group-hover:scale-105 transition-transform text-lg font-bold h-14"
                      >
                        📚 55만원 마스터 강의 신청!
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Guarantee Section */}
        <div className="mt-16 space-y-8">
          <Card className="max-w-4xl mx-auto bg-gradient-hero text-primary-foreground">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Search className="h-16 w-16 mx-auto mb-4 text-accent" />
                <h3 className="text-3xl font-bold mb-4 text-accent">🔥 완벽한 노출보장 시스템</h3>
                <p className="text-xl opacity-95 mb-6 font-semibold">
                  구글, 네이버 상위 노출이 안되면 100% 환불보장!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-primary-foreground/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-accent mb-2">✅ 구글 SEO</div>
                  <div className="text-sm">리치스니펫 + 구조화데이터 + 메타태그</div>
                </div>
                <div className="bg-primary-foreground/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-accent mb-2">✅ 네이버 SEO</div>
                  <div className="text-sm">사이트맵 + 서치콘솔 + 키워드분석</div>
                </div>
                <div className="bg-primary-foreground/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-accent mb-2">✅ 기술적 SEO</div>
                  <div className="text-sm">속도최적화 + 반응형 + 보안설정</div>
                </div>
              </div>
              
              <div className="bg-accent/20 p-4 rounded-lg text-center">
                <div className="text-lg font-bold mb-2">💰 모든 SEO 작업이 포함된 가격: 단 15만원!</div>
                <div className="text-sm opacity-90">⚡ 보통 100만원 이상 가치의 SEO 작업을 15만원에!</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Trust Indicators */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="text-center p-4 bg-secondary/10">
                <div className="text-2xl font-bold text-secondary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">노출성공 사이트</div>
              </Card>
              <Card className="text-center p-4 bg-primary/10">
                <div className="text-2xl font-bold text-primary mb-1">2주</div>
                <div className="text-sm text-muted-foreground">평균 노출기간</div>
              </Card>
              <Card className="text-center p-4 bg-accent/10">
                <div className="text-2xl font-bold text-accent mb-1">99%</div>
                <div className="text-sm text-muted-foreground">고객 만족도</div>
              </Card>
              <Card className="text-center p-4 bg-secondary/10">
                <div className="text-2xl font-bold text-secondary mb-1">24H</div>
                <div className="text-sm text-muted-foreground">상담 가능</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;