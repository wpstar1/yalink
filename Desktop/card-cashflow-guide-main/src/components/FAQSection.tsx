import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "신용카드 현금화, 불법 아닌가요?",
      answer: "물품 거래 없이 허위로 매출을 일으키는 '카드깡'은 명백한 불법입니다. 하지만 상품권을 정상적으로 구매한 후 되파는 방식은 실물 거래에 기반하기 때문에 카드깡과는 다릅니다. 합법적인 방법을 이용하는 것이 중요합니다."
    },
    {
      question: "수수료가 너무 싼 곳은 왜 의심해야 하나요?",
      answer: "업체는 카드 가맹점 수수료, 세금, 운영비 등을 고려해야 하므로 수수료가 지나치게 낮을 수 없습니다. 비정상적으로 낮은 수수료를 미끼로 고객을 유인한 뒤, 나중에 추가 수수료를 요구하거나 결제만 받고 잠적하는 사기 업체일 가능성이 매우 높습니다."
    },
    {
      question: "현금화하는데 시간은 얼마나 걸리나요?",
      answer: "정상적인 업체라면 본인 확인 후 입금까지 보통 5분~30분 이내로 완료됩니다. 1시간 이상 지체된다면 진행 상황을 확인해볼 필요가 있습니다."
    },
    {
      question: "신용불량자도 가능한가요?",
      answer: "이론적으로는 신용카드 한도만 남아있다면 가능합니다. 대출이 아니기 때문에 개인의 신용등급을 조회하지 않기 때문입니다. 하지만 연체로 인해 카드가 정지된 상태라면 불가능합니다."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-financial-navy mb-4">자주 묻는 질문</h2>
          <p className="text-lg text-muted-foreground">신용카드현금화에 대해 궁금한 점들을 해결해드립니다.</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-financial-navy">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;