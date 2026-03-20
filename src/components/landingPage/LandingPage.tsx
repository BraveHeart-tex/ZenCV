import { Features } from '@/components/landingPage/Features';
import { Footer } from '@/components/landingPage/Footer';
import { Header } from '@/components/landingPage/Header';
import { Hero } from '@/components/landingPage/Hero';
import { Cta } from './Cta';
import { Templates } from './templates/Templates';

export const LandingPage = () => {
  return (
    <div className='bg-background text-foreground relative min-h-screen'>
      {/* Grain texture overlay */}
      <div
        className='fixed inset-0 pointer-events-none z-0 opacity-[0.035] dark:opacity-[0.06]'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
      {/* Subtle radial glow */}
      <div className='fixed inset-0 pointer-events-none z-0'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 h-150 w-200 bg-primary/5 blur-[120px] rounded-full' />
      </div>
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
