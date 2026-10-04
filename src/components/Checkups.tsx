import { motion } from 'motion/react'
import { checkups, formatPrice } from '../data'
import type { BookableId } from '../data'
import { motionTokens, pressable, springs } from '../lib/motion'
import { Icon } from './Icon'
import { Accent, Container, Reveal, SectionHeading, buttonLime, buttonPrimary } from './ui'

export function Checkups({ onBook }: { onBook: (id: BookableId) => void }) {
  return (
    <section id="checkups" className="bg-paper-deep py-16 lg:py-24" aria-labelledby="checkups-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="checkups-title"
            eyebrow="Чекапы"
            title={
              <>
                Программы для всех, кто «вроде <Accent>норм</Accent>»
              </>
            }
            intro="Все врачи и анализы — за одно утро и по фиксированной цене. Результаты врач объяснит в тот же день."
          />
        </Reveal>

        <ul className="mt-10 grid items-stretch gap-5 lg:mt-14 lg:grid-cols-3">
          {checkups.map((checkup, index) => {
            const featured = Boolean(checkup.tag)
            return (
              <Reveal as="li" key={checkup.id} delay={index * motionTokens.stagger} className="h-full">
                <motion.div
                  className={`relative flex h-full flex-col rounded-[2rem] p-7 sm:p-8 ${
                    featured ? 'bg-violet text-white shadow-[0_30px_60px_-30px_rgba(91,63,209,0.8)]' : 'bg-white ring-1 ring-ink/5'
                  }`}
                  whileHover={{ y: -motionTokens.distance.sm }}
                  transition={springs.snappy}
                >
                  {checkup.tag && (
                    <motion.span
                      className="absolute -top-3.5 right-6 rotate-3 rounded-full bg-lime px-3.5 py-1.5 text-sm font-bold text-ink"
                      animate={{ rotate: [3, -3, 3] }}
                      transition={{ duration: motionTokens.loop.float, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {checkup.tag}
                    </motion.span>
                  )}
                  <p className={`text-sm font-bold uppercase tracking-[0.14em] ${featured ? 'text-lime' : 'text-violet'}`}>
                    {checkup.title} · {checkup.duration}
                  </p>
                  <h3 className="mt-3 text-[2rem] leading-tight">
                    <Accent className={featured ? 'text-white' : 'text-ink'}>«{checkup.nickname}»</Accent>
                  </h3>
                  <p className={`mt-3 ${featured ? 'text-white/80' : 'text-ink-soft'}`}>{checkup.forWhom}</p>

                  <ul className="mt-6 grid grow content-start gap-3">
                    {checkup.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${
                            featured ? 'bg-lime text-ink' : 'bg-violet-soft text-violet'
                          }`}
                        >
                          <Icon name="check" className="size-3.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className={`mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6 ${featured ? 'border-white/15' : 'border-ink/10'}`}>
                    <p className="text-3xl font-extrabold">{formatPrice(checkup.price)}</p>
                    <motion.button
                      type="button"
                      onClick={() => onBook(checkup.id)}
                      aria-label={`Записаться на чекап «${checkup.nickname}»`}
                      className={`${featured ? buttonLime : buttonPrimary} !px-6 !py-3`}
                      {...pressable}
                    >
                      Записаться
                    </motion.button>
                  </div>
                </motion.div>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
