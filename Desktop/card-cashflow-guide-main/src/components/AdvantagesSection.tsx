import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, TrendingUp, Clock, Shield, Zap, CreditCard, DollarSign } from "lucide-react";

const AdvantagesSection = () => {
  const advantages = [
    {
      icon: <Zap className="w-6 h-6 text-financial-success" />,
      title: "높은 접근성",
      description: "신용카드만 있다면 직업, 소득과 무관하게 누구나 이용 가능"
    },
    {
      icon: <Clock className="w-6 h-6 text-financial-success" />,
      title: "놀라운 속도",
      description: "신청 후 현금을 받기까지 30분도 채 걸리지 않아 비상 상황에 유용"
    },
    {
      icon: <Shield className="w-6 h-6 text-financial-success" />,
      title: "신용점수 보호",
      description: "대출이 아니므로 이용 기록이 남지 않아 신용점수에 영향 없음"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-financial-success" />,
      title: "부담 없는 상환",
      description: "무이자 할부 기능을 활용하면 매달 납부 부담을 크게 줄일 수 있음"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-financial-success" />,
      title: "간편한 절차",
      description: "복잡한 서류 제출이나 심사 과정 없이 비대면으로 빠르게 진행"
    }
  ];

  const disadvantages = [
    {
      icon: <DollarSign className="w-6 h-6 text-financial-warning" />,
      title: "수수료 부담",
      description: "현금화 금액의 일부를 수수료로 지불하므로 받는 현금이 적음"
    },
    {
      icon: <CreditCard className="w-6 h-6 text-financial-warning" />,
      title: "신용카드 필수",
      description: "본인 명의의 신용카드가 없다면 이용 자체가 불가능"
    },
    {
      icon: <XCircle className="w-6 h-6 text-financial-warning" />,
      title: "법적 위험 가능성",
      description: "방법을 잘못 선택하면 자신도 모르게 불법에 연루될 수 있음"
    }
  ];

  const feeStructure = [
    { category: "상품권 현금화", fee: "5-15%", description: "상품권 종류와 수요에 따라 차이" },
    { category: "카드론", fee: "연 15-25%", description: "신용등급에 따른 이자율" },
    { category: "중고거래", fee: "10-20%", description: "감가상각 및 거래 수수료 포함" }
  ];

  return (
    <section id="advantages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-financial-navy mb-4">
            장점과 단점, 솔직하게 알려드립니다
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            신용카드현금화를 고려하고 계신다면 반드시 알아두어야 할 장단점들입니다.
          </p>
        </div>

        {/* Advantages */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-financial-success/10 rounded-lg flex items-center justify-center mr-3">
              <CheckCircle className="w-5 h-5 text-financial-success" />
            </div>
            <h3 className="text-2xl font-bold text-financial-navy">👍 주요 장점</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, index) => (
              <Card key={index} className="border-0 shadow-financial hover:shadow-elegant transition-all duration-300 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-financial-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {advantage.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-financial-navy mb-2">
                        {advantage.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Disadvantages */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-financial-warning/10 rounded-lg flex items-center justify-center mr-3">
              <XCircle className="w-5 h-5 text-financial-warning" />
            </div>
            <h3 className="text-2xl font-bold text-financial-navy">👎 주요 단점</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {disadvantages.map((disadvantage, index) => (
              <Card key={index} className="border-0 shadow-financial bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-financial-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {disadvantage.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-financial-navy mb-2">
                        {disadvantage.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {disadvantage.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fee Structure */}
        <div className="bg-gradient-card rounded-2xl p-8 border border-border shadow-elegant">
          <h3 className="text-2xl font-bold text-financial-navy text-center mb-8">
            💰 수수료 구조 이해하기
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {feeStructure.map((fee, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-border">
                <h4 className="font-semibold text-lg text-financial-navy mb-2">{fee.category}</h4>
                <div className="text-2xl font-bold text-primary mb-2">{fee.fee}</div>
                <p className="text-sm text-muted-foreground">{fee.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-financial-warning/10 rounded-lg p-6 border border-financial-warning/20">
            <h4 className="font-semibold text-financial-navy mb-3">수수료가 발생하는 이유</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-start">
                <span className="w-2 h-2 bg-financial-warning rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>업체의 중개 마진:</strong> 상품 매입 및 재판매 과정에서 발생하는 이익</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-financial-warning rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>세금 및 카드 수수료:</strong> 가맹점 수수료와 사업 소득에 대한 세금</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;