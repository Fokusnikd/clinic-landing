import { motion } from 'motion/react'
import { formatPrice, services } from '../data'
import type { BookableId } from '../data'
import { motionTokens, springs } from '../lib/motion'
import { Icon } from './Icon'
import { Accent, Container, Reveal, SectionHeading } from './ui'

export function Services({ onBook }: { onBook: (id: BookableId) => void }) {
  return (
    <section id="services" className="py-16 lg:py-24" aria-labelledby="services-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="services-title"
            eyebrow="Направления"
            title={
              <>
                Врачи, которые <Accent>дослушают</Accent> до конца
              </>
            }
            intro="17 специалистов, своя лаборатория и УЗИ в одном здании. Не знаете, к кому идти, — начните с терапевта."
          />
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {services.map((service, index) => (
            <Reveal as="li" key={service.id} delay={(index % 4) * motionTokens.stagger} className="h-full">
              <motion.div
                className="group flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_1px_0_rgba(28,22,51,0.06)] ring-1 ring-ink/5"
                initial="rest"
                whileHover="hover"
                variants={{ rest: { y: 0 }, hover: { y: -motionTokens.distance.xs } }}
                transition={springs.snappy}
              >
                <motion.span
                  className="grid size-14 place-items-center rounded-2xl bg-violet-soft text-violet transition-colors group-hover:bg-violet group-hover:text-white"
                  variants={{ rest: { rotate: 0 }, hover: { rotate: -8 } }}
                  transition={springs.bouncy}
                >
                  {service.icon && <Icon name={service.icon} className="size-7" />}
                </motion.span>
                <h3 className="mt-5 text-xl font-extrabold">{service.title}</h3>
                <p className="mt-2 grow text-ink-soft">{service.text}</p>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink/5 pt-4">
                  <span className="font-extrabold">от {formatPrice(service.price)}</span>
                  <button
                    type="button"
                    onClick={() => onBook(service.id)}
                    aria-label={`Записаться: ${service.title}`}
                    className="inline-flex items-center gap-1 font-bold text-violet underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
                  >
                    Записаться
                    <Icon name="arrowRight" className="size-4" />
                  </button>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
