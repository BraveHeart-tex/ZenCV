import { Features } from '@/components/landingPage/Features';
import { Footer } from '@/components/landingPage/Footer';
import { Header } from '@/components/landingPage/Header';
import { Hero } from '@/components/landingPage/Hero';
import { LazyMotionWrapper } from '@/components/ui/LazyMotionWrapper';
import { Cta } from './Cta';
import { Templates } from './templates/Templates';

export const LandingPage = () => {
  return (
    <LazyMotionWrapper>
      <div className='min-h-screen bg-background text-foreground'>
        <Header />
        <main>
          <Hero />
          <Features />
          <Templates />
          <Cta />
        </main>
        <Footer />
      </div>
    </LazyMotionWrapper>
  );
};
