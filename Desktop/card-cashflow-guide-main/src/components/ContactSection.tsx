import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, Clock, Shield } from "lucide-react";
import customerServiceImage from "@/assets/customer-service.jpg";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-hero text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">무료 상담 받기</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            전문 상담원이 24시간 대기하고 있습니다. 안전하고 합법적인 현금화 방법을 상담받으세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src={customerServiceImage} 
              alt="전문 상담원" 
              className="rounded-2xl shadow-elegant w-full"
            />
          </div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-financial-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">전화 상담</h3>
                  <p className="text-sm text-white/80">즉시 연결</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-financial-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">온라인 상담</h3>
                  <p className="text-sm text-white/80">실시간 채팅</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-5 h-5 text-financial-accent" />
                <span className="font-semibold">운영시간</span>
              </div>
              <p className="text-white/90">24시간 연중무휴 상담 가능</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-5 h-5 text-financial-accent" />
                <span className="font-semibold">안전 보장</span>
              </div>
              <p className="text-white/90">정식 등록 업체를 통한 합법적인 현금화만 안내</p>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-financial-accent hover:bg-financial-accent/90 text-financial-navy font-semibold text-lg py-4"
            >
              지금 무료 상담받기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;