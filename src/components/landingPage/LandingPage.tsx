import Header from '@/components/landingPage/Header';
import Hero from '@/components/landingPage/Hero';
import Features from '@/components/landingPage/Features';
import Templates from '@/components/landingPage/Templates';
import FAQ from '@/components/landingPage/FAQ';
import Footer from '@/components/landingPage/Footer';

const LandingPage = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Templates />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
