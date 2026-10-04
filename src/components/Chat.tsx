import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { chatScript, findBookable, formatPrice } from '../data'
import type { BookableId } from '../data'
import { motionTokens, pressable, springs } from '../lib/motion'
import { Icon } from './Icon'
import { LogoMark } from './ui'

type Message = { id: number; from: 'bot' | 'me'; text: string } | { id: number; from: 'result'; bookable: BookableId }

type NewMessage = { from: 'bot' | 'me'; text: string } | { from: 'result'; bookable: BookableId }

const bubbleMotion = {
  initial: { opacity: 0, y: motionTokens.distance.md, scale: 0.94 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: springs.snappy,
}

// Messenger-style triage: the clinic asks "Саня, ты в порядке?" and suggests where to start
export function Chat({ onBook }: { onBook: (id: BookableId) => void }) {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const repliesRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const nextId = useRef(0)
  // Focus follows the conversation only after the visitor has answered, never on page load
  const userActed = useRef(false)
  const inView = useInView(rootRef, { once: true, amount: 0.4 })

  const [messages, setMessages] = useState<Message[]>([])
  const [node, setNode] = useState('start')
  const [typing, setTyping] = useState(false)
  const [settled, setSettled] = useState(false)

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }

  const push = (message: NewMessage) => {
    const id = nextId.current++
    setMessages((current) => [...current, { ...message, id }])
  }

  // Only schedules timers; callers reset node and settled state themselves
  const play = useCallback(
    (nodeId: string) => {
      const script = chatScript[nodeId]
      const typingTime = reduce ? 150 : motionTokens.typingDelay
      const later = (fn: () => void, at: number) => timers.current.push(window.setTimeout(fn, at))

      let at = 350
      for (const text of script.bot) {
        later(() => setTyping(true), at)
        at += typingTime
        later(() => {
          setTyping(false)
          push({ from: 'bot', text })
        }, at)
        at += 300
      }
      const result = script.result
      if (result) {
        later(() => push({ from: 'result', bookable: result }), at)
        at += 300
      }
      later(() => setSettled(true), at)
    },
    [reduce],
  )

  useEffect(() => {
    if (!inView) return
    play('start')
    return clearTimers
  }, [inView, play])

  // Keep the newest message in view by scrolling the log itself, not the page
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [messages, typing, reduce])

  useEffect(() => {
    if (settled && userActed.current) repliesRef.current?.querySelector('button')?.focus({ preventScroll: true })
  }, [settled])

  const goTo = (nodeId: string) => {
    userActed.current = true
    clearTimers()
    setNode(nodeId)
    setSettled(false)
    play(nodeId)
  }

  const answer = (label: string, next: string) => {
    push({ from: 'me', text: label })
    goTo(next)
  }

  const restart = () => {
    setTyping(false)
    setMessages([])
    goTo('start')
  }

  const script = chatScript[node]
  const resultId = script.result

  return (
    <div ref={rootRef} className="relative z-10 overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(28,22,51,0.45)] ring-1 ring-ink/5">
      <div className="flex items-center gap-3 border-b border-ink/5 px-5 py-4">
        <LogoMark className="size-10 shrink-0" />
        <div className="min-w-0">
          <p className="truncate font-bold leading-tight">Клиника «Саня»</p>
          <p className="flex items-center gap-1.5 text-sm text-ink-soft">
            <span className="relative flex size-2">
              <motion.span
                className="absolute inset-0 rounded-full bg-lime-deep"
                animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                transition={{ duration: motionTokens.loop.beat * 1.6, repeat: Infinity, ease: 'easeOut' }}
              />
              <span className="relative size-2 rounded-full bg-lime-deep" />
            </span>
            на связи, отвечаем сразу
          </p>
        </div>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Диалог с клиникой"
        className="flex h-[19rem] flex-col gap-2.5 overflow-y-auto bg-paper-deep/70 px-4 py-5 sm:h-[21rem]"
      >
        {messages.map((message) => {
          if (message.from === 'result') {
            const item = findBookable(message.bookable)
            return (
              <motion.div
                key={message.id}
                {...bubbleMotion}
                style={{ originX: 0, originY: 1 }}
                className="max-w-[88%] self-start rounded-2xl rounded-bl-md bg-white p-4 ring-2 ring-violet/25"
              >
                <p className="inline-flex rounded-full bg-lime px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">Рекомендуем</p>
                <p className="mt-2 text-lg leading-snug font-extrabold">
                  {item.nickname ? `«${item.nickname}»` : `Приём: ${item.title.toLowerCase()}`}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{item.nickname ? `${item.title} · ${item.duration}` : item.text}</p>
                <p className="mt-2 font-extrabold text-violet">
                  {item.kind === 'checkup' ? '' : 'от '}
                  {formatPrice(item.price)}
                </p>
              </motion.div>
            )
          }
          const mine = message.from === 'me'
          return (
            <motion.p
              key={message.id}
              {...bubbleMotion}
              style={{ originX: mine ? 1 : 0, originY: 1 }}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-snug ${
                mine ? 'self-end rounded-br-md bg-violet text-white' : 'self-start rounded-bl-md bg-white'
              }`}
            >
              {message.text}
            </motion.p>
          )
        })}

        <AnimatePresence>
          {typing && (
            <motion.p
              key="typing"
              className="flex gap-1 self-start rounded-2xl rounded-bl-md bg-white px-4 py-3.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: motionTokens.duration.instant } }}
              style={{ originX: 0, originY: 1 }}
            >
              <span className="sr-only">Клиника печатает</span>
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  aria-hidden="true"
                  className="size-2 rounded-full bg-ink/35"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: motionTokens.loop.typing, repeat: Infinity, delay: dot * 0.15 }}
                />
              ))}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div ref={repliesRef} className="flex min-h-[5.5rem] flex-wrap content-center gap-2 border-t border-ink/5 px-4 py-4">
        {!settled && <p className="px-1 text-sm text-ink-soft">Клиника печатает…</p>}
        {settled &&
          script.replies?.map((reply, index) => (
            <motion.button
              key={reply.next}
              type="button"
              onClick={() => answer(reply.label, reply.next)}
              initial={{ opacity: 0, y: motionTokens.distance.sm }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.snappy, delay: index * motionTokens.stagger }}
              whileTap={{ scale: motionTokens.scale.press }}
              className="rounded-full border-2 border-violet/30 bg-white px-4 py-2 font-semibold text-violet transition-colors hover:border-violet hover:bg-violet hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
            >
              {reply.label}
            </motion.button>
          ))}
        {settled && resultId && (
          <>
            <motion.button
              type="button"
              onClick={() => onBook(resultId)}
              initial={{ opacity: 0, y: motionTokens.distance.sm }}
              animate={{ opacity: 1, y: 0 }}
              {...pressable}
              className="inline-flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 font-bold text-white transition-colors hover:bg-violet-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
            >
              Записаться
              <Icon name="arrowRight" className="size-4" />
            </motion.button>
            <motion.button
              type="button"
              onClick={restart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Icon name="refresh" className="size-4" />
              Начать заново
            </motion.button>
          </>
        )}
      </div>
    </div>
  )
}
