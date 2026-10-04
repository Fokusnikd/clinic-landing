import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { advantages, stats } from '../data'
import { motionTokens } from '../lib/motion'
import { Icon } from './Icon'
import { Accent, Container, Reveal, SectionHeading } from './ui'

const formatStat = (v: number, decimals: number, prefix: string, suffix: string) =>
  `${prefix}${v.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`

function CountUp({ value, decimals = 0, prefix = '', suffix = '' }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const format = (v: number) => formatStat(v, decimals, prefix, suffix)

  useEffect(() => {
    const node = ref.current
    if (!inView || !node || reduce) return
    const controls = animate(0, value, {
      duration: motionTokens.duration.crawl * 1.4,
      ease: motionTokens.easing.smooth,
      onUpdate: (v) => {
        node.textContent = formatStat(v, decimals, prefix, suffix)
      },
    })
    return () => controls.stop()
  }, [inView, reduce, value, decimals, prefix, suffix])

  return (
    <>
      <span className="sr-only">{format(value)}</span>
      <span ref={ref} aria-hidden="true">
        {format(reduce ? value : 0)}
      </span>
    </>
  )
}

export function Why() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="why-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              id="why-title"
              eyebrow="Почему к нам"
              title={
                <>
                  Здесь не скажут «<Accent>ну, это возрастное</Accent>»
                </>
              }
              intro="Мы открыли клинику для тех, кто годами откладывает врачей, потому что там очереди, спешка и непонятные слова."
            />
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2">
            {advantages.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * motionTokens.stagger} className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
                <span className="grid size-12 place-items-center rounded-2xl bg-lime text-ink">
                  <Icon name={item.icon} className="size-6" />
                </span>
                <h3 className="mt-4 text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 text-ink-soft">{item.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="mt-12 lg:mt-16">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] bg-ink/10 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1 bg-paper-deep p-6 sm:p-8">
                <dt className="text-ink-soft">{stat.label}</dt>
                <dd className="text-4xl font-extrabold tracking-tight text-violet tabular-nums sm:text-5xl">
                  <CountUp value={stat.value} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  )
}
