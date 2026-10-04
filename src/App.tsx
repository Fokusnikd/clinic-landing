import { MotionConfig, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Booking } from './components/Booking'
import { CheckupDay } from './components/CheckupDay'
import { Checkups } from './components/Checkups'
import { Doctors } from './components/Doctors'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { PulseBand } from './components/PulseBand'
import { Reviews } from './components/Reviews'
import { Services } from './components/Services'
import { Why } from './components/Why'
import type { BookableId } from './data'

export default function App() {
  const reduce = useReducedMotion()
  const [service, setService] = useState<BookableId>('check-basic')

  // Every "Записаться" on the page preselects its service, scrolls to the form and moves focus there
  const book = (id: BookableId) => {
    setService(id)
    document.getElementById('booking')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    document.getElementById('booking-title')?.focus({ preventScroll: true })
  }

  return (
    // "user" turns off transform and layout animations for people who prefer reduced motion
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-bold focus:text-paper"
      >
        Перейти к содержанию
      </a>
      <Header />
      <main id="main">
        <Hero onBook={book} />
        <PulseBand />
        <Services onBook={book} />
        <Checkups onBook={book} />
        <CheckupDay />
        <Why />
        <Doctors onBook={book} />
        <Reviews />
        <Booking service={service} onServiceChange={setService} />
        <Faq />
      </main>
      <Footer />
    </MotionConfig>
  )
}
