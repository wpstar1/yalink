import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Target, Users, Award } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, label: "고객 만족도", value: "99%", color: "text-secondary" },
    { icon: Target, label: "상위 노출률", value: "98%", color: "text-primary" },
    { icon: Award, label: "프로젝트 완료", value: "500+", color: "text-accent" },
    { icon: Building2, label: "운영 경력", value: "5년+", color: "text-secondary" }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                SEO 전문 기업
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  워프스타
                </span>
                <br />
                홈페이지 제작 전문가
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                워프스타는 홈페이지 제작부터 구글·네이버 SEO 전문으로 하는 기업입니다. 
                노출에 최적화된 SEO와 구글서치콘솔, 네이버서치콘솔 자동사이트맵까지 
                모든 것을 완벽하게 처리해드립니다.
              </p>
            </div>

            {/* What We Do */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">우리가 제공하는 서비스</h3>
              <div className="space-y-3">
                {[
                  "노출에 최적화된 SEO 설정",
                  "구글서치콘솔 & 네이버서치콘솔 연동",
                  "자동 사이트맵 제출 시스템",
                  "백링크 서비스 (원하시는 경우)",
                  "노출 보장 (안되면 환불)"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-gradient-hero rounded-full"></div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Information */}
            <Card className="bg-gradient-hero text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-3 w-3 bg-accent rounded-full animate-pulse"></div>
                  <h4 className="font-semibold text-accent">SEO 핵심 정보</h4>
                </div>
                <div className="space-y-4">
                  <p className="text-primary-foreground/95 leading-relaxed font-semibold text-lg">
                    구글 상위노출, 네이버 상위노출의 가장 빠른 길은<br/>
                    <span className="text-accent text-xl font-black">홈페이지 제작 + SEO 최적화</span>만 해놔도 충분합니다!
                  </p>
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-accent font-black text-lg mb-2">💰 우리가 15만원에 제공하는 모든 것!</div>
                      <div className="text-sm opacity-90">대형 업체 100만원+ 상당의 SEO 작업을 단 15만원에!</div>
                    </div>
                  </div>
                  <p className="text-primary-foreground/90 text-center">
                    더 자세한 정보는 
                    <a 
                      href="https://btg1.net" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 font-bold ml-1 underline decoration-accent/70 hover:decoration-accent transition-colors text-lg"
                    >
                      btg1.net
                    </a>
                    에서 확인하세요.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Guarantee */}
            <Card className="bg-muted/50 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-3 w-3 bg-secondary rounded-full animate-pulse"></div>
                  <h4 className="font-semibold text-secondary">노출 보장 약속</h4>
                </div>
                <p className="text-muted-foreground">
                  구글과 네이버에서 노출이 되지 않으면 100% 환불해드립니다. 
                  우리는 결과로 말하는 회사입니다.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="hover:shadow-primary transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <div className="mx-auto w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;