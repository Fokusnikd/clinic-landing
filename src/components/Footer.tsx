import { motion } from 'motion/react'
import { clinic, navItems } from '../data'
import { motionTokens } from '../lib/motion'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { Accent, Container, Logo, Reveal } from './ui'

const contacts: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: 'phone', label: 'Телефон', value: clinic.phone, href: clinic.phoneHref },
  { icon: 'mapPin', label: 'Адрес', value: clinic.address },
  { icon: 'clock', label: 'Часы работы', value: clinic.hours },
]

// Abstract city block with a pulsing pin; a real project would embed Yandex Maps here
function MapArt() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Схема проезда: клиника в пяти минутах от метро">
      <rect width="400" height="300" fill="#ece8f8" />
      <g stroke="#ffffff" strokeWidth="18" strokeLinecap="round">
        <path d="M-10 90 H410" />
        <path d="M-10 210 C 120 200, 260 230, 410 215" />
        <path d="M120 -10 V310" />
        <path d="M290 -10 C 280 100, 300 200, 285 310" />
      </g>
      <g fill="#ded6ff">
        <rect x="20" y="20" width="80" height="50" rx="10" />
        <rect x="140" y="20" width="130" height="50" rx="10" />
        <rect x="20" y="110" width="80" height="80" rx="10" />
        <rect x="310" y="110" width="80" height="85" rx="10" />
        <rect x="140" y="235" width="125" height="55" rx="10" />
      </g>
      <rect x="140" y="110" width="130" height="80" rx="12" fill="#c6f06b" />
      <g fill="none" stroke="#5b3fd1" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round">
        <path d="M60 255 C 90 240, 110 220, 120 190 S 150 160, 190 150" />
      </g>
      <g transform="translate(60 262)">
        <circle r="13" fill="#c0392b" />
        <text y="5" textAnchor="middle" fontFamily="Onest, sans-serif" fontWeight="800" fontSize="14" fill="#ffffff">
          М
        </text>
      </g>
      <g transform="translate(205 140)">
        <motion.circle
          r="14"
          fill="#5b3fd1"
          animate={{ scale: [1, 2.6], opacity: [0.35, 0] }}
          transition={{ duration: motionTokens.loop.beat * 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
        <path d="M0 8 C -14 -6, -16 -14, -16 -20 a16 16 0 0 1 32 0 c0 6 -2 14 -16 28z" fill="#5b3fd1" transform="translate(0 -12)" />
        <path d="M-6 -33 l4 4 l8 -9" fill="none" stroke="#c6f06b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

export function Footer() {
  return (
    <>
      <section id="contacts" className="py-16 lg:py-24" aria-labelledby="contacts-title">
        <Container>
          <Reveal className="grid overflow-hidden rounded-[2.5rem] bg-white ring-1 ring-ink/5 lg:grid-cols-2">
            <div className="p-7 sm:p-10">
              <h2 id="contacts-title" className="text-[2rem] leading-tight font-extrabold tracking-tight sm:text-5xl">
                Приходите, <Accent>Саня</Accent>. Мы рядом
              </h2>
              <ul className="mt-8 grid gap-6">
                {contacts.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-violet-soft text-violet">
                      <Icon name={item.icon} className="size-6" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink-soft">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="text-xl font-extrabold underline-offset-4 hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-lg font-bold">{item.value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 flex items-center gap-2 text-ink-soft">
                <Icon name="send" className="size-5 text-violet" />
                Результаты анализов и напоминания приходят в Telegram
              </p>
            </div>
            <div className="min-h-[18rem]">
              <MapArt />
            </div>
          </Reveal>
        </Container>
      </section>

      <footer className="bg-ink pt-12 pb-10 text-paper">
        <Container className="grid gap-8">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
            <Logo light />
            <nav aria-label="Навигация в подвале" className="md:justify-self-end">
              <ul className="flex flex-wrap gap-x-6 gap-y-3 font-semibold text-paper/75">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="hover:text-paper">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Medical ads in Russia must carry this warning (Federal Law "On Advertising", art. 24) */}
          <p className="border-y border-paper/15 py-6 text-center text-xl leading-tight font-extrabold tracking-tight text-paper/85 uppercase sm:text-3xl">
            Имеются противопоказания. Необходима консультация специалиста
          </p>

          <div className="grid gap-2 text-sm text-paper/60">
            <p>© 2026 Клиника «{clinic.name}». Лицензия на медицинскую деятельность: номер не указан — это демо.</p>
            <p>
              Демо-проект для портфолио: клиника вымышленная, врачи, цены и отзывы придуманы, заявки никуда не отправляются.
              Информация на сайте не является публичной офертой.
            </p>
          </div>
        </Container>
      </footer>
    </>
  )
}
