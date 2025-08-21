import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Clock } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { id: "about", label: "현금화란?" },
    { id: "methods", label: "이용방법" },
    { id: "advantages", label: "장점과 단점" },
    { id: "safety", label: "안전한 이용법" },
    { id: "faq", label: "자주묻는질문" },
    { id: "contact", label: "문의하기" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled 
          ? "shadow-financial border-b border-border" 
          : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">₩</span>
            </div>
            <span className="text-xl font-bold text-financial-navy">신용카드현금화</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>24시간 상담</span>
            </div>
            <Button 
              onClick={() => scrollToSection("contact")} 
              className="bg-gradient-primary hover:shadow-elegant transition-all duration-300"
            >
              <Phone className="w-4 h-4 mr-2" />
              상담하기
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-border shadow-lg">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 py-2"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-border">
                  <Button 
                    onClick={() => scrollToSection("contact")} 
                    className="w-full bg-gradient-primary hover:shadow-elegant transition-all duration-300"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    상담하기
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;