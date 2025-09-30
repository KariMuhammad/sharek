import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import TrendingProjects from '@/components/home/TrendingProjects';
import Stats from '@/components/home/Stats';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <TrendingProjects />
      <Stats />
    </main>
  );
}