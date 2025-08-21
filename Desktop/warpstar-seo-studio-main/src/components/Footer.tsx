import { Rocket, Phone, MessageCircle, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-accent p-2 rounded-lg">
                <Rocket className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">워프스타</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              홈페이지 제작부터 구글·네이버 SEO 전문으로 하는 기업입니다. 
              노출에 최적화된 홈페이지로 고객의 성공을 함께 만들어갑니다.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">서비스</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <div>홈페이지 제작 (15만원)</div>
              <div>1:1 강의 (55만원)</div>
              <div>SEO 최적화</div>
              <div>백링크 서비스</div>
              <div>30가지 AI 툴 제공</div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">문의하기</h3>
            <div className="space-y-3">
              <a 
                href="tel:010-8674-9948"
                className="flex items-center space-x-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>010-8674-9948</span>
              </a>
              
              <a 
                href="https://open.kakao.com/o/sYNvVY9g"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>카카오톡 상담</span>
              </a>
              
              <div className="flex items-center space-x-3 text-primary-foreground/80">
                <Mail className="h-5 w-5" />
                <span>24시간 상담 가능</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <div className="space-y-2 text-primary-foreground/60">
            <p>© 2024 워프스타. 모든 권리 보유.</p>
            <p className="text-sm">
              노출 보장 약속 - 구글, 네이버 상위 노출이 안되면 100% 환불
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;