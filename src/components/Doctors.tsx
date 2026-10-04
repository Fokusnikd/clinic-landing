import { motion } from 'motion/react'
import { doctors } from '../data'
import type { BookableId } from '../data'
import { motionTokens, springs } from '../lib/motion'
import { Avatar } from './Avatar'
import { Icon } from './Icon'
import { Accent, Container, Reveal, SectionHeading } from './ui'

export function Doctors({ onBook }: { onBook: (id: BookableId) => void }) {
  return (
    <section id="doctors" className="bg-paper-deep py-16 lg:py-24" aria-labelledby="doctors-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="doctors-title"
            eyebrow="Врачи"
            title={
              <>
                Спросят, как вы, и <Accent>правда выслушают</Accent>
              </>
            }
            intro="Средний стаж наших врачей — 13 лет. На приём закладываем 40 минут, чтобы не торопиться."
          />
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {doctors.map((doctor, index) => (
            <Reveal as="li" key={doctor.name} delay={index * motionTokens.stagger} className="h-full">
              <motion.article
                className="flex h-full flex-col items-center rounded-[2rem] bg-white p-6 text-center ring-1 ring-ink/5"
                initial="rest"
                whileHover="hover"
                variants={{ rest: { y: 0 }, hover: { y: -motionTokens.distance.sm } }}
                transition={springs.snappy}
              >
                <Avatar look={doctor.look} blinkEvery={3.6 + index * 0.9} className="size-32" />
                <h3 className="mt-5 text-lg font-extrabold">{doctor.name}</h3>
                <p className="font-semibold text-violet">{doctor.role}</p>
                <p className="text-sm text-ink-soft">{doctor.experience}</p>
                <blockquote className="mt-4 grow text-lg leading-snug">
                  <Accent className="text-ink">{doctor.quote}</Accent>
                </blockquote>
                <button
                  type="button"
                  onClick={() => onBook(doctor.service)}
                  aria-label={`Записаться к врачу: ${doctor.name}, ${doctor.role.toLowerCase()}`}
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full border-2 border-violet/25 px-5 py-2.5 font-bold text-violet transition-colors hover:border-violet hover:bg-violet hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
                >
                  Записаться
                  <Icon name="arrowRight" className="size-4" />
                </button>
              </motion.article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
