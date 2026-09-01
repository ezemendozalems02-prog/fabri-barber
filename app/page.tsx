import { About } from '@/components/about'
import { BookingSection } from '@/components/booking-section'
import { Contact } from '@/components/contact'
import { Details } from '@/components/details'
import { Faq } from '@/components/faq'
import { Footer } from '@/components/footer'
import { Haircuts } from '@/components/haircuts'
import { Hero } from '@/components/hero'
import { Marquee } from '@/components/marquee'
import { MobileCta } from '@/components/mobile-cta'
import { Navbar } from '@/components/navbar'
import { Products } from '@/components/products'
import { Services } from '@/components/services'
import { Testimonials } from '@/components/testimonials'

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Haircuts />
        <Details />
        <Products />
        <BookingSection />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </>
  )
}
