import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Programs from "@/components/Programs";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Programs />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Index;
