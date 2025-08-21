import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, X } from "lucide-react";
import { useState } from "react";

const FloatingContact = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Banner */}
      <Card className={`mb-4 bg-gradient-accent text-accent-foreground shadow-glow transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <CardContent className="p-4 relative">
          <button 
            onClick={() => setIsExpanded(false)}
            className="absolute top-2 right-2 text-accent-foreground/60 hover:text-accent-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="space-y-3 pr-6">
            <h3 className="font-bold text-lg">🚀 무료 상담</h3>
            <p className="text-sm opacity-90">
              홈페이지 제작 및 SEO 상담
            </p>
            
            <div className="space-y-2">
              <a 
                href="tel:010-8674-9948"
                className="flex items-center space-x-2 text-sm hover:opacity-80 transition-opacity"
              >
                <Phone className="h-4 w-4" />
                <span>010-8674-9948</span>
              </a>
              
              <a 
                href="https://open.kakao.com/o/sYNvVY9g"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm hover:opacity-80 transition-opacity"
              >
                <MessageCircle className="h-4 w-4" />
                <span>카카오톡 상담</span>
              </a>
            </div>
            
            <a href="tel:010-8674-9948">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full bg-accent-foreground text-accent hover:bg-accent-foreground/90"
              >
                지금 문의하기
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Toggle Button */}
      <Button
        variant="cta"
        size="lg"
        className="rounded-full w-16 h-16 shadow-glow animate-pulse hover:animate-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Phone className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default FloatingContact;