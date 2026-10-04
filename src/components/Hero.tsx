import { motion } from 'motion/react'
import type { BookableId } from '../data'
import { motionTokens, pressable, springs } from '../lib/motion'
import { Chat } from './Chat'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { Accent, Container, buttonGhost, buttonPrimary } from './ui'

const facts: { icon: IconName; title: string; text: string }[] = [
  { icon: 'clock', title: 'Приём вовремя', text: 'или следующий бесплатно' },
  { icon: 'tube', title: 'Анализы за 1 день', text: 'результаты в Telegram' },
  { icon: 'star', title: '4,9', text: 'оценка на картах' },
]

const float = (delay: number) => ({
  animate: { y: [0, -motionTokens.distance.sm, 0] },
  transition: { duration: motionTokens.loop.float, repeat: Infinity, ease: 'easeInOut' as const, delay },
})

export function Hero({ onBook }: { onBook: (id: BookableId) => void }) {
  return (
    <section id="top" className="relative overflow-clip pt-28 pb-14 sm:pt-32 lg:pt-36 lg:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 size-[38rem] rounded-full bg-violet-soft/70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-32 size-[28rem] rounded-full bg-lime/30 blur-3xl" />

      <Container className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <motion.p
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold shadow-sm"
            initial={{ opacity: 0, y: motionTokens.distance.sm }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
          >
            <span className="size-2 rounded-full bg-lime-deep" />
            Частная клиника в Москве
          </motion.p>

          <motion.h1
            className="mt-6 text-[3.1rem] leading-[0.95] font-extrabold tracking-tight sm:text-7xl lg:text-[4.25rem] xl:text-[5rem]"
            initial={{ opacity: 0, y: motionTokens.distance.lg }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
          >
            Ты в порядке,
            <br />
            <span className="relative inline-block">
              <Accent>Саня</Accent>
              <motion.span
                className="inline-block font-serif font-semibold text-violet italic"
                animate={{ rotate: [0, -14, 10, -6, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, repeatDelay: motionTokens.loop.wobble, delay: 1.4 }}
                style={{ originX: 0.5, originY: 0.9 }}
              >
                ?
              </motion.span>
              <svg
                aria-hidden="true"
                viewBox="0 0 220 16"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-[0.22em] w-full overflow-visible"
              >
                <motion.path
                  d="M4 10 C 60 3, 150 3, 216 9"
                  fill="none"
                  stroke="#c6f06b"
                  strokeWidth="9"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: 0.5 }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            className="mt-7 max-w-xl text-lg text-ink-soft sm:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: motionTokens.duration.slow, delay: 0.3 }}
          >
            Частная клиника, где этот вопрос задают всерьёз. Терапевт, кардиолог, невролог и ещё 14 специалистов, своя
            лаборатория и чекап за одно утро.
          </motion.p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.a href="#booking" className={buttonPrimary} {...pressable}>
              Записаться к врачу
              <Icon name="arrowRight" className="size-5" />
            </motion.a>
            <motion.a href="#checkups" className={buttonGhost} {...pressable}>
              Выбрать чекап
            </motion.a>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {facts.map((fact, index) => (
              <motion.li
                key={fact.title}
                className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2"
                initial={{ opacity: 0, y: motionTokens.distance.md }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.gentle, delay: 0.5 + index * motionTokens.stagger }}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-violet shadow-sm">
                  <Icon name={fact.icon} className="size-5" />
                </span>
                <span className="leading-tight">
                  <span className="block font-extrabold">{fact.title}</span>
                  <span className="text-sm text-ink-soft">{fact.text}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-[27rem] lg:mr-0"
          initial={{ opacity: 0, y: motionTokens.distance.xl }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.2 }}
        >
          <Chat onBook={onBook} />
          <p className="mt-4 text-center text-sm text-ink-soft">Это не диагноз, а подсказка, с чего начать. Решает врач.</p>

          {/* Vitals stickers: decorative, they float around the chat */}
          <motion.div
            aria-hidden="true"
            className="absolute -top-7 -right-3 z-20 flex rotate-3 items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-paper shadow-xl xl:-right-8"
            {...float(0)}
          >
            <motion.span
              className="text-coral"
              animate={{ scale: [1, 1.25, 1, 1.15, 1] }}
              transition={{ duration: motionTokens.loop.beat, repeat: Infinity, times: [0, 0.15, 0.3, 0.45, 1] }}
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
                <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z" />
              </svg>
            </motion.span>
            <span className="leading-none">
              <span className="block text-xs text-paper/60">Пульс</span>
              <span className="text-xl font-extrabold tabular-nums">72</span>
              <span className="text-xs text-paper/60"> уд/мин</span>
            </span>
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="absolute bottom-28 -left-32 z-0 hidden -rotate-3 rounded-2xl bg-lime py-3 pr-12 pl-4 shadow-lg xl:block"
            {...float(1.2)}
          >
            <span className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-ink text-lime">
                <Icon name="check" className="size-4" />
              </span>
              <span className="leading-none">
                <span className="block text-xs font-semibold">Давление</span>
                <span className="text-lg font-extrabold tabular-nums">120/80</span>
              </span>
            </span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
