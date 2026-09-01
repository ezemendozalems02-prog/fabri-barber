import { About } from '@/components/about'
import { BookingProvider } from '@/components/booking-provider'
import { Experience } from '@/components/experience'
import { Faq } from '@/components/faq'
import { FinalCta } from '@/components/final-cta'
import { Footer } from '@/components/footer'
import { ForWho } from '@/components/for-who'
import { Hero } from '@/components/hero'
import { Instagram } from '@/components/instagram'
import { Marquee } from '@/components/marquee'
import { Methodology } from '@/components/methodology'
import { MobileCta } from '@/components/mobile-cta'
import { Navbar } from '@/components/navbar'
import { RecoveryMenu } from '@/components/recovery-menu'
import { Services } from '@/components/services'
import { Testimonials } from '@/components/testimonials'

export default function Page() {
  return (
    <BookingProvider>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <RecoveryMenu />
        <ForWho />
        <Methodology />
        <Experience />
        <Testimonials />
        <Instagram />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileCta />
    </BookingProvider>
  )
}
