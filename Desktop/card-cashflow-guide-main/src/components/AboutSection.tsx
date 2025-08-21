import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, CreditCard, RefreshCw } from "lucide-react";
import mobileBankingImage from "@/assets/mobile-banking.jpg";

const AboutSection = () => {
  const steps = [
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: "상품권 구매",
      description: "신용카드로 백화점 상품권 등 현금화가 쉬운 상품을 구매합니다"
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-primary" />,
      title: "업체 매입",
      description: "전문 매입 업체에서 구매한 상품을 수수료를 제외하고 매입합니다"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "현금 수령",
      description: "5분 내 계좌로 현금이 입금되어 즉시 사용 가능합니다"
    }
  ];

  const differences = [
    {
      title: "카드깡 (불법)",
      items: [
        "실제 거래 없이 허위 매출 생성",
        "여신전문금융업법 위반",
        "이용자와 업체 모두 처벌 대상",
        "법적 위험 높음"
      ],
      isLegal: false
    },
    {
      title: "합법적 현금화",
      items: [
        "실제 상품권 등 실물 거래",
        "정상적인 소유권 이전",
        "합법적인 중고거래 방식",
        "법적 위험 없음"
      ],
      isLegal: true
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-financial-navy mb-4">
            신용카드현금화란 무엇인가요?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            신용카드의 결제 기능을 활용해 현금을 확보하는 합법적인 금융 기법입니다.<br />
            카드사가 제공하는 현금서비스와는 다른 개념으로, 신용점수에 영향을 주지 않습니다.
          </p>
        </div>

        {/* How it Works */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl font-bold text-financial-navy mb-8">현금화 원리</h3>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={mobileBankingImage} 
              alt="모바일 뱅킹을 이용하는 모습" 
              className="rounded-2xl shadow-financial w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
          </div>
        </div>

        {/* Legal vs Illegal */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-financial-navy text-center mb-8">
            카드깡과 합법적 현금화의 차이점
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {differences.map((diff, index) => (
              <Card key={index} className={`border-2 ${diff.isLegal ? 'border-financial-success' : 'border-destructive'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {diff.isLegal ? (
                      <CheckCircle className="w-6 h-6 text-financial-success mr-3" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-destructive mr-3" />
                    )}
                    <h4 className="text-xl font-bold">{diff.title}</h4>
                  </div>
                  <ul className="space-y-2">
                    {diff.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="w-2 h-2 bg-current rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-card rounded-2xl p-8 border border-border shadow-elegant">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-financial-warning/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-financial-warning" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-financial-navy mb-3">중요한 안내사항</h4>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-financial-navy">실제 거래가 이루어지는 합법적인 방법을 선택하는 것이 중요합니다.</strong><br />
                정식 등록 업체를 통해 투명하고 안전한 현금화 서비스를 이용하시기 바랍니다. 
                수수료와 조건을 반드시 확인하고, 본인의 상환 능력을 고려하여 신중하게 결정하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;