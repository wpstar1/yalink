import { Button } from "@/components/ui/button";
import { Rocket, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <nav className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-gradient-hero p-2 rounded-lg">
            <Rocket className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            워프스타 홈페이지제작
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#services" className="text-foreground hover:text-primary transition-colors">
            서비스
          </a>
          <a href="#about" className="text-foreground hover:text-primary transition-colors">
            회사소개
          </a>
          <a href="#programs" className="text-foreground hover:text-primary transition-colors">
            프로그램
          </a>
          <a href="tel:010-8674-9948">
            <Button variant="cta" size="sm">
              문의하기
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border md:hidden">
            <div className="flex flex-col space-y-4 p-4">
              <a href="#services" className="text-foreground hover:text-primary transition-colors">
                서비스
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                회사소개
              </a>
              <a href="#programs" className="text-foreground hover:text-primary transition-colors">
                프로그램
              </a>
              <a href="tel:010-8674-9948">
                <Button variant="cta" size="sm" className="w-full">
                  문의하기
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;