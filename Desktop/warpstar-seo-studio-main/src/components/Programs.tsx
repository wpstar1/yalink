import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Image, 
  Search, 
  Copy, 
  Map, 
  Users, 
  Instagram, 
  Twitter, 
  MessageCircle, 
  Send,
  Video,
  Globe,
  TrendingUp,
  Star,
  Gift
} from "lucide-react";

const Programs = () => {
  const programCategories = [
    {
      title: "📝 콘텐츠 제작 도구",
      programs: [
        { icon: FileText, name: "상세페이지 자동 제작 프로그램", color: "text-primary" },
        { icon: Image, name: "VVIP용 이미지 자동제작 프롬프트", color: "text-secondary" },
        { icon: Search, name: "네이버 상위노출 글 자동생성기", color: "text-accent" },
        { icon: Copy, name: '"사이트따개" - 어떤 사이트든 복제 가능', color: "text-primary" },
        { icon: Map, name: "자동 사이트맵 제출 프로그램 (PC 부팅시 자동 실행)", color: "text-secondary" }
      ]
    },
    {
      title: "📱 소셜미디어 마케팅",
      programs: [
        { icon: Users, name: "스레드 자동 팔로워 증가 프로그램", color: "text-accent" },
        { icon: Instagram, name: "SMM패널 사이트 운영 도구 (반값)", color: "text-primary" },
        { icon: Twitter, name: "트위터 자동 이미지 생성", color: "text-secondary" },
        { icon: MessageCircle, name: "스레드 자동포스팅 프로그램", color: "text-accent" },
        { icon: Send, name: "텔레그램 강제초대 프로그램", color: "text-primary" }
      ]
    },
    {
      title: "🎬 콘텐츠 제작",
      programs: [
        { icon: Video, name: "유튜브 쇼츠/릴스/틱톡 영상 자동생성", color: "text-secondary" },
        { icon: Globe, name: "워드프레스 자동 SEO 최적화", color: "text-accent" }
      ]
    },
    {
      title: "🔍 SEO & 최적화",
      programs: [
        { icon: Search, name: "SEO 프롬프트 생성기 - 구글 상위노출 완벽 도구", color: "text-primary" },
        { icon: TrendingUp, name: "구글 순위용 자동 SEO 최적화", color: "text-secondary" },
        { icon: Star, name: "백링크 자동 프로그램", color: "text-accent" },
        { icon: Gift, name: "워프스타 독점 MTS", color: "text-primary" }
      ]
    }
  ];

  const benefits = [
    "워프스타 전체 프로그램 평생 무료 사용",
    "향후 출시 프로그램 모두 평생 무료",
    "백링크 서비스 30% 할인된 가격으로 평생 제공",
    "평생 무료 업데이트 및 기술 지원"
  ];

  return (
    <section id="programs" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            강의신청시 무료 제공
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              30가지 이상
            </span>
            <br />
            무료 AI 툴 & 프로그램
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            클로드코드부터 커서AI까지 모든 기능을 한땀한땀 가르쳐드립니다
          </p>
        </div>

        {/* Programs Grid */}
        <div className="space-y-12">
          {programCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-2xl font-bold mb-6 text-center">
                {category.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.programs.map((program, programIndex) => {
                  const IconComponent = program.icon;
                  return (
                    <Card key={programIndex} className="hover:shadow-primary transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <IconComponent className={`h-5 w-5 text-primary-foreground`} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {program.name}
                            </h4>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Special Benefits */}
        <div className="mt-16">
          <Card className="bg-gradient-hero text-primary-foreground max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">💰 특별 혜택</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                강의 신청하시면 아래 모든 혜택을 드립니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-primary-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-6">
                <a href="https://open.kakao.com/o/sYNvVY9g" target="_blank" rel="noopener noreferrer">
                  <Button variant="accent" size="lg" className="text-lg px-8">
                    🎯 55만원 강의 신청하기
                  </Button>
                </a>
                <p className="text-sm text-primary-foreground/60 mt-3">
                  ⭐ 평생 무료 업데이트 및 기술 지원
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Programs;