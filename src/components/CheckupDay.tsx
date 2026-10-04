import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { checkupDay } from '../data'
import { motionTokens } from '../lib/motion'
import { Icon } from './Icon'
import { Accent, Container, SectionHeading } from './ui'

// ECG trace in a 1000×210 box: four heartbeats (one per step) and a final stroke that turns into a check mark
const BASE = 120
const BEATS = [110, 300, 490, 680]
const CHECK_VERTEX = { x: 872, y: 152 }

const beat = (cx: number) =>
  `L ${cx - 46} ${BASE} Q ${cx - 38} ${BASE - 14} ${cx - 30} ${BASE} L ${cx - 14} ${BASE} L ${cx - 8} ${BASE + 10} ` +
  `L ${cx} 30 L ${cx + 8} ${BASE + 34} L ${cx + 14} ${BASE} L ${cx + 30} ${BASE} Q ${cx + 44} ${BASE - 20} ${cx + 58} ${BASE}`

const ECG_PATH = `M 0 ${BASE} ${BEATS.map(beat).join(' ')} L 840 ${BASE} L ${CHECK_VERTEX.x} ${CHECK_VERTEX.y} L 960 50`
const MARKERS_X = [...BEATS, CHECK_VERTEX.x]

const formatClock = (minutes: number) => {
  const total = Math.round(minutes)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

// Fraction of the path length at which the trace first reaches each x; x only grows along the path
function thresholdsFor(path: SVGPathElement) {
  const total = path.getTotalLength()
  return MARKERS_X.map((x) => {
    let low = 0
    let high = total
    for (let i = 0; i < 24; i++) {
      const mid = (low + high) / 2
      if (path.getPointAtLength(mid).x < x) low = mid
      else high = mid
    }
    return high / total
  })
}

// Scroll-driven checkup morning: the ECG draws as the page scrolls, each beat is a step, the last stroke is a check
export function CheckupDay() {
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const thresholds = useRef<number[]>(MARKERS_X.map((x) => x / 1000))
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [done, setDone] = useState(false)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  // Leave a little scroll before and after the trace so the start and the check mark both get a moment on screen
  const drawn = useTransform(scrollYProgress, [0.04, 0.86], [0, 1], { clamp: true })
  const overflow = useMotionValue(0)
  // On narrow screens the trace is wider than the monitor, so it pans to keep the pen in view
  const panX = useTransform(() => -drawn.get() * overflow.get())

  const clock = useTransform(drawn, (v) => {
    const t = thresholds.current
    const minutes = checkupDay.map((step) => step.minutes)
    if (v <= t[0]) return formatClock(480 + (minutes[0] - 480) * (v / t[0]))
    const next = t.findIndex((threshold) => v < threshold)
    if (next === -1) return formatClock(minutes[minutes.length - 1])
    const share = (v - t[next - 1]) / (t[next] - t[next - 1])
    return formatClock(minutes[next - 1] + (minutes[next] - minutes[next - 1]) * share)
  })

  const placeHead = (progress: number) => {
    const path = pathRef.current
    const head = headRef.current
    if (!path || !head) return
    const point = path.getPointAtLength(progress * path.getTotalLength())
    head.setAttribute('transform', `translate(${point.x} ${point.y})`)
  }

  useEffect(() => {
    if (pathRef.current) thresholds.current = thresholdsFor(pathRef.current)
    placeHead(reduce ? 1 : drawn.get())
    // placeHead only touches refs, so it is safe to leave out of the deps
  }, [reduce, drawn])

  useEffect(() => {
    const frame = frameRef.current
    const svg = svgRef.current
    if (!frame || !svg) return
    const measure = () => overflow.set(Math.max(0, svg.getBoundingClientRect().width - frame.clientWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [overflow])

  useMotionValueEvent(drawn, 'change', (v) => {
    if (reduce) return
    placeHead(v)
    setActive(Math.max(0, thresholds.current.findLastIndex((threshold) => v >= threshold - 0.005)))
    setDone(v >= 0.995)
  })

  const showAll = Boolean(reduce)
  const step = checkupDay[active]

  return (
    <section
      id="how"
      ref={sectionRef}
      aria-labelledby="how-title"
      className={`bg-ink text-paper ${showAll ? 'py-16 lg:py-24' : 'relative h-[320vh]'}`}
    >
      <div className={showAll ? '' : 'sticky top-0 flex h-svh items-center overflow-hidden pt-16'}>
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <SectionHeading
              id="how-title"
              light
              eyebrow="Как проходит чекап"
              title={
                <>
                  Одно утро — и вы <Accent className="text-lime">в порядке</Accent>
                </>
              }
              intro="Листайте вниз и пройдите чекап вместе с Саней — от анализов до разговора с врачом."
            />
            {!showAll && (
              <p className="text-right" aria-hidden="true">
                <span className="block text-sm text-paper/60">Время на часах</span>
                <motion.span className="text-4xl font-extrabold tabular-nums text-lime sm:text-5xl">{clock}</motion.span>
              </p>
            )}
          </div>

          <div className="monitor-grid mt-6 rounded-[2rem] bg-[#140f26] p-4 ring-1 ring-white/10 sm:mt-8 sm:p-6">
            <div className="flex items-center justify-between gap-4 text-sm text-paper/60">
              <span>ЭКГ · пациент: Саня, 34 года</span>
              <span className="flex items-center gap-2">
                <motion.span
                  className={`size-2 rounded-full ${done || showAll ? 'bg-lime' : 'bg-coral'}`}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: motionTokens.loop.beat, repeat: Infinity }}
                />
                {done || showAll ? 'всё в порядке' : 'идёт чекап'}
              </span>
            </div>

            <div ref={frameRef} className="mt-3 overflow-hidden">
              <motion.svg
                ref={svgRef}
                viewBox="0 0 1000 210"
                className="block w-full min-w-[44rem]"
                style={{ x: showAll ? 0 : panX }}
                role="img"
                aria-label="Кардиограмма из пяти этапов чекапа, которая заканчивается галочкой"
              >
                <path d={ECG_PATH} fill="none" stroke="#c6f06b" strokeOpacity="0.14" strokeWidth="3" strokeLinejoin="round" />
                <motion.path
                  ref={pathRef}
                  d={ECG_PATH}
                  fill="none"
                  stroke="#c6f06b"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength: showAll ? 1 : drawn }}
                />
                {MARKERS_X.map((x, index) => (
                  <text
                    key={x}
                    x={x}
                    y="200"
                    textAnchor="middle"
                    fontFamily="Onest, sans-serif"
                    fontWeight="700"
                    fontSize="20"
                    fill={showAll || index <= active ? '#c6f06b' : 'rgba(246,244,251,0.35)'}
                  >
                    {checkupDay[index].time}
                  </text>
                ))}
                <g ref={headRef} className={done || showAll ? 'opacity-0' : ''}>
                  <circle r="16" fill="#c6f06b" opacity="0.2" />
                  <circle r="7" fill="#c6f06b" />
                </g>
              </motion.svg>
            </div>
          </div>

          {showAll ? (
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {checkupDay.map((item, index) => (
                <li key={item.time} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <p className="font-bold text-lime">
                    {index + 1}. {item.time}
                  </p>
                  <p className="mt-1 text-lg font-extrabold">{item.title}</p>
                  <p className="mt-1 text-paper/70">{item.text}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-6 min-h-[8.5rem] sm:mt-8" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={done ? 'done' : active}
                  className={`flex items-start gap-4 rounded-2xl p-5 sm:p-6 ${done ? 'bg-lime text-ink' : 'bg-white/5 ring-1 ring-white/10'}`}
                  initial={{ opacity: 0, y: motionTokens.distance.md }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -motionTokens.distance.md }}
                  transition={{ duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth }}
                >
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-full text-lg font-extrabold ${
                      done ? 'bg-ink text-lime' : 'bg-lime text-ink'
                    }`}
                  >
                    {done ? <Icon name="check" className="size-6" /> : active + 1}
                  </span>
                  <div>
                    <p className={`text-sm font-bold ${done ? 'text-ink/70' : 'text-lime'}`}>
                      {done ? 'Финиш · 11:00' : `Шаг ${active + 1} из ${checkupDay.length} · ${step.time}`}
                    </p>
                    <p className="mt-1 text-xl font-extrabold sm:text-2xl">{done ? 'Саня в порядке' : step.title}</p>
                    <p className={`mt-1 ${done ? 'text-ink/80' : 'text-paper/70'}`}>{step.text}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </Container>
      </div>
    </section>
  )
}
