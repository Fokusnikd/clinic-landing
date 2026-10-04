import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { motionTokens, springs } from '../lib/motion'

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4'

export const buttonPrimary = `${buttonBase} bg-violet px-7 py-4 text-white hover:bg-violet-dark focus-visible:outline-violet`

export const buttonGhost = `${buttonBase} border-2 border-ink/15 px-7 py-4 text-ink hover:border-ink/40 focus-visible:outline-ink`

export const buttonLime = `${buttonBase} bg-lime px-7 py-4 text-ink hover:bg-white focus-visible:outline-lime`

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
}

// The italic serif accent used for "Саня" and other warm words across the page
export function Accent({ children, className = 'text-violet' }: { children: ReactNode; className?: string }) {
  return <span className={`font-serif font-semibold italic ${className}`}>{children}</span>
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  light = false,
}: {
  id: string
  eyebrow: string
  title: ReactNode
  intro?: string
  light?: boolean
}) {
  return (
    <div className="max-w-2xl">
      <p className={`text-sm font-bold uppercase tracking-[0.18em] ${light ? 'text-lime' : 'text-violet'}`}>{eyebrow}</p>
      <h2 id={id} className="mt-3 text-[2rem] font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg ${light ? 'text-paper/75' : 'text-ink-soft'}`}>{intro}</p>}
    </div>
  )
}

// Speech bubble with a check mark: the clinic's answer to its own question. The check redraws on hover of a parent with whileHover="hover"
export function LogoMark({ className = 'size-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path fill="#5b3fd1" d="M6 3h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H14l-6 5v-5H6a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" />
      <motion.path
        d="M10 14.5l4 4 8-8.5"
        fill="none"
        stroke="#c6f06b"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{ rest: { pathLength: 1 }, hover: { pathLength: [0, 1] } }}
        transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}
      />
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[1.05rem] font-extrabold leading-tight tracking-tight">
        Ты в порядке, <Accent className={light ? 'text-lime' : 'text-violet'}>Саня?</Accent>
      </span>
    </span>
  )
}

// Fades content up once it scrolls into view; as="li" keeps list markup valid
export function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li'
}) {
  const Tag = as === 'li' ? motion.li : motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: motionTokens.distance.lg }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        y: { ...springs.gentle, delay },
        opacity: { duration: motionTokens.duration.normal, delay },
      }}
    >
      {children}
    </Tag>
  )
}
