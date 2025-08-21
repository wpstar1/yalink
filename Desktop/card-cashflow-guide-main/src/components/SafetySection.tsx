import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, AlertTriangle, Shield, Users, FileCheck, CreditCard, Calendar, Lock } from "lucide-react";
import securityImage from "@/assets/security-finance.jpg";

const SafetySection = () => {
  const checklistItems = [
    {
      icon: <CheckSquare className="w-5 h-5 text-financial-success" />,
      title: "수수료 비교는 필수",
      description: "최소 2~3곳의 업체를 비교해 가장 합리적인 수수료를 제시하는 곳을 선택하세요.",
      warning: "터무니없이 낮은 수수료(ex: 무조건 5%)를 내세우는 곳은 사기일 가능성이 높습니다."
    },
    {
      icon: <FileCheck className="w-5 h-5 text-financial-success" />,
      title: "정식 사업자 확인",
      description: "반드시 홈페이지 하단 등에 사업자등록번호가 명시된 정식 등록 업체를 이용하세요.",
      warning: "사업자등록번호가 없거나 확인이 어려운 업체는 '먹튀' 위험이 높습니다."
    },
    {
      icon: <CreditCard className="w-5 h-5 text-financial-success" />,
      title: "추가 비용 요구 확인",
      description: "정상적인 업체는 최초 안내된 수수료 외에 어떤 추가 비용도 요구하지 않습니다.",
      warning: "진행 중 갑작스런 추가 수수료를 요구하는 업체는 즉시 거래를 중단하세요."
    },
    {
      icon: <Calendar className="w-5 h-5 text-financial-success" />,
      title: "상환 계획 세우기",
      description: "'현금화는 빚이다'라는 사실을 잊지 마세요. 본인의 상환 능력을 고려해 감당할 수 있는 금액만 이용하세요.",
      warning: "무분별한 이용은 카드 대금 연체로 이어질 수 있습니다."
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-financial-success" />,
      title: "절대 연체는 금물",
      description: "카드 대금 연체는 신용등급에 치명적입니다. 무이자 할부 등을 활용해 상환 부담을 줄이세요.",
      warning: "연체 기록은 신용점수를 크게 떨어뜨리며 향후 금융거래에 악영향을 미칩니다."
    },
    {
      icon: <Lock className="w-5 h-5 text-financial-success" />,
      title: "개인정보 유출 주의",
      description: "신분증 전체나 카드 비밀번호, CVC 번호 등 과도한 개인정보를 요구하는 업체는 즉시 거래를 중단하세요.",
      warning: "정상적인 현금화에는 과도한 개인정보가 필요하지 않습니다."
    }
  ];

  const alternatives = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "비상금 대출",
      description: "1금융권과 2금융권에서 취급하는 소액 신용대출",
      details: ["앱을 통해 5분 내외로 신청", "한도: 50만 원 ~ 300만 원", "신용등급에 따른 금리"]
    },
    {
      icon: <CreditCard className="w-6 h-6 text-primary" />,
      title: "자동차 담보대출",
      description: "본인 명의의 차량이 있다면 낮은 금리로 이용 가능",
      details: ["담보가 있어 낮은 금리", "차량 가치에 따른 한도", "빠른 승인 과정"]
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "정부지원 대출",
      description: "저신용·저소득자를 위한 햇살론 등 정부 지원 상품",
      details: ["낮은 금리", "정부 보증", "소득 조건 확인 필요"]
    },
    {
      icon: <CheckSquare className="w-6 h-6 text-primary" />,
      title: "소액결제 현금화",
      description: "휴대폰 소액결제 한도를 이용하는 방법",
      details: ["신용카드 없어도 가능", "월 한도 제한", "통신사별 차이"]
    }
  ];

  return (
    <section id="safety" className="py-20 bg-financial-light/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-financial-navy mb-4">
            🚨 안전한 이용을 위한 필수 체크리스트
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            급한 마음에 아무 업체나 이용했다가는 사기를 당하거나 과도한 수수료를 물 수 있습니다.
            아래 6가지는 반드시 확인하세요.
          </p>
        </div>

        {/* Safety Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            {checklistItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-financial bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-financial-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-financial-navy mb-2">
                        ✅ {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="bg-financial-warning/10 rounded-lg p-3 border border-financial-warning/20">
                        <p className="text-xs text-financial-warning leading-relaxed">
                          <strong>주의:</strong> {item.warning}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="relative">
            <img 
              src={securityImage} 
              alt="안전한 금융 거래" 
              className="rounded-2xl shadow-financial w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-financial-success" />
                <div>
                  <h4 className="font-semibold text-financial-navy">안전한 거래의 핵심</h4>
                  <p className="text-sm text-muted-foreground">신뢰할 수 있는 정식 업체 선택</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternatives */}
        <div>
          <h3 className="text-2xl font-bold text-financial-navy text-center mb-8">
            현금화 말고 다른 방법은 없나요?
          </h3>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            신용카드 현금화가 망설여진다면, 다음과 같은 대안을 고려해볼 수 있습니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {alternatives.map((alternative, index) => (
              <Card key={index} className="border-0 shadow-financial bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {alternative.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-financial-navy">{alternative.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{alternative.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {alternative.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetySection;