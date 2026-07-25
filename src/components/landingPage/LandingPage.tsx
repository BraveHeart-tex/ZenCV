import { Features } from '@/components/landingPage/Features';
import { Footer } from '@/components/landingPage/Footer';
import { Header } from '@/components/landingPage/Header';
import { Hero } from '@/components/landingPage/Hero';
import { Cta } from './Cta';
import { Templates } from './templates/Templates';

export const LandingPage = () => {
  return (
    <div className='relative min-h-screen bg-background text-foreground'>
      <div className='relative z-10'>
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
