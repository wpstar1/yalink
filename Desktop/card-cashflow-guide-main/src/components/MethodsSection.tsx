import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Smartphone, CreditCard, ShoppingCart } from "lucide-react";

const MethodsSection = () => {
  const methods = [
    {
      icon: <Gift className="w-8 h-8 text-primary" />,
      title: "상품권 현금화",
      badge: "가장 보편적",
      description: "백화점 상품권이나 온라인 상품권을 구매 후 전문 매입업체에 판매",
      features: [
        "신세계, 롯데 백화점 상품권",
        "컬쳐랜드, 해피머니 등",
        "수요가 많을수록 수수료 저렴",
        "5~15% 수수료율"
      ],
      pros: ["빠른 처리", "높은 접근성", "다양한 상품권 선택"],
      cons: ["수수료 발생", "상품권별 수수료 차이"]
    },
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: "상테크 (상품권 재테크)",
      badge: "고수들의 비법",
      description: "카드 혜택을 극대화하면서 상품권을 통해 현금화하는 방법",
      features: [
        "카드 실적 채우기",
        "포인트 적립 혜택",
        "할인 혜택 활용",
        "페이 포인트 전환"
      ],
      pros: ["카드 혜택 최대화", "추가 적립", "실적 달성"],
      cons: ["복잡한 과정", "카드별 혜택 파악 필요"]
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: "카드론",
      badge: "공식 대출",
      description: "신용카드사에서 제공하는 공식적인 대출 상품으로 즉시 이용 가능",
      features: [
        "별도 심사 없음",
        "앱으로 즉시 신청",
        "전화 신청 가능",
        "신용한도 내 이용"
      ],
      pros: ["공식적인 서비스", "빠른 승인", "투명한 이자율"],
      cons: ["신용점수 하락", "높은 이자율", "대출 기록"]
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-primary" />,
      title: "중고 물품 거래",
      badge: "IT 기기 추천",
      description: "고가의 IT 기기를 구매 후 중고 거래 플랫폼에서 재판매",
      features: [
        "스마트폰, 노트북, 태블릿",
        "중고가 방어 가능 제품",
        "무이자 할부 활용",
        "당근, 중고나라 등 이용"
      ],
      pros: ["무이자 할부 가능", "높은 중고가", "다양한 제품 선택"],
      cons: ["감가상각", "판매 시간 소요", "거래 번거로움"]
    }
  ];

  const useCases = [
    "병원비, 경조사비 등 예상치 못한 지출",
    "은행 대출 절차가 복잡하고 시간이 오래 걸릴 때",
    "신용점수 하락이 걱정될 때",
    "현금서비스 한도를 모두 사용했을 때",
    "가족이나 지인에게 부탁하기 어려울 때"
  ];

  return (
    <section id="methods" className="py-20 bg-financial-light/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-financial-navy mb-4">
            안전한 현금화 방법 4가지
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            각각의 방법은 고유한 특징과 장단점을 가지고 있습니다. 
            본인의 상황에 맞는 최적의 방법을 선택하세요.
          </p>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {methods.map((method, index) => (
            <Card key={index} className="border-0 shadow-financial hover:shadow-elegant transition-all duration-300 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {method.icon}
                    </div>
                    <CardTitle className="text-xl text-financial-navy">{method.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-financial-accent/10 text-financial-navy">
                    {method.badge}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {method.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                <div>
                  <h4 className="font-semibold text-sm text-financial-navy mb-3">주요 특징</h4>
                  <ul className="space-y-2">
                    {method.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-xs text-financial-success mb-2">장점</h5>
                    <ul className="space-y-1">
                      {method.pros.map((pro, proIndex) => (
                        <li key={proIndex} className="text-xs text-muted-foreground">
                          • {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-financial-warning mb-2">단점</h5>
                    <ul className="space-y-1">
                      {method.cons.map((con, conIndex) => (
                        <li key={conIndex} className="text-xs text-muted-foreground">
                          • {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-2xl p-8 shadow-financial">
          <h3 className="text-2xl font-bold text-financial-navy text-center mb-8">
            이런 상황에서 주로 이용합니다
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-card rounded-lg border border-border">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodsSection;