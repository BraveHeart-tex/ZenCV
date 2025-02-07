import Header from '@/components/landingPage/Header';
import Hero from '@/components/landingPage/Hero';
import Features from '@/components/landingPage/Features';
import Footer from '@/components/landingPage/Footer';
import Templates from './templates/Templates';
import Cta from './Cta';

const LandingPage = () => {
  return (
    <div className="bg-background text-foreground relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none">
        <div className="bg-gradient-to-b from-background via-background/90 to-background absolute inset-0" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px]  bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Features />
          <Templates />
          <Cta />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
