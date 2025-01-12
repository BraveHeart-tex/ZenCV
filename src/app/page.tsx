import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Templates from '@/components/Templates';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Features from '@/components/Features';

export default function Home() {
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
}
