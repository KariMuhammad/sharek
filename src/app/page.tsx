import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { TrendingProjects } from '@/components/home/TrendingProjects'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Stats } from '@/components/home/Stats'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <TrendingProjects />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}