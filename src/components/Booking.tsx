import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { bookables, bookingDays, clinic, findBookable, formatPrice } from '../data'
import type { BookableId, BookableKind } from '../data'
import { formatPhone, isPhoneComplete } from '../lib/phone'
import { motionTokens, pressable, springs } from '../lib/motion'
import { Icon } from './Icon'
import { Container, Reveal, buttonPrimary } from './ui'

const groups: { kind: BookableKind; label: string }[] = [
  { kind: 'checkup', label: 'Чекапы' },
  { kind: 'doctor', label: 'Врачи' },
  { kind: 'diagnostics', label: 'Диагностика' },
]

const perks = ['Администратор перезвонит за 15 минут', 'Напомним о визите в Telegram за день', 'Перенести или отменить — одним сообщением']

type Errors = Partial<Record<'time' | 'name' | 'phone' | 'consent', string>>

const fieldClass =
  'mt-2 w-full rounded-2xl border-2 border-ink/10 bg-paper px-4 py-3.5 font-medium outline-none transition-colors focus:border-violet aria-[invalid=true]:border-coral-deep'

const serviceLabel = (id: BookableId) => {
  const item = findBookable(id)
  return item.nickname ? `«${item.nickname}»` : item.title
}

export function Booking({ service, onServiceChange }: { service: BookableId; onServiceChange: (id: BookableId) => void }) {
  const days = useMemo(() => bookingDays(), [])
  const [dayKey, setDayKey] = useState(days[0].key)
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  // The success panel is shorter than the form, so focusing it brings it into view and announces it
  const focusOnMount = useCallback((node: HTMLDivElement | null) => node?.focus(), [])

  const day = days.find((d) => d.key === dayKey) ?? days[0]
  const selected = findBookable(service)

  const pickDay = (key: string) => {
    setDayKey(key)
    const next = days.find((d) => d.key === key)
    if (!next?.slots.some((slot) => slot.time === time && !slot.busy)) setTime('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found: Errors = {}
    if (!time) found.time = 'Выберите время приёма'
    if (name.trim().length < 2) found.name = 'Как к вам обращаться?'
    if (!isPhoneComplete(phone)) found.phone = 'Введите номер полностью'
    if (!consent) found.consent = 'Нужно согласие, чтобы мы могли перезвонить'
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      const selector = first === 'time' ? 'input[name="time"]:not(:disabled)' : `[data-field="${first}"]`
      formRef.current?.querySelector<HTMLElement>(selector)?.focus()
      return
    }
    setSent(true)
  }

  const reset = () => {
    setSent(false)
    setTime('')
    setConsent(false)
  }

  return (
    <section id="booking" className="py-16 lg:py-24" aria-labelledby="booking-title">
      <Container>
        <Reveal className="grid overflow-hidden rounded-[2.5rem] bg-white shadow-[0_30px_80px_-40px_rgba(28,22,51,0.35)] ring-1 ring-ink/5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative overflow-hidden bg-violet p-7 text-white sm:p-10">
            <h2 id="booking-title" tabIndex={-1} className="text-[2rem] leading-tight font-extrabold tracking-tight outline-none sm:text-5xl">
              Записаться на приём
            </h2>
            <p className="mt-4 text-lg text-white/80">Выберите направление и удобное время — остальное администратор уточнит по телефону.</p>

            <motion.div
              key={service}
              className="mt-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15"
              initial={{ scale: motionTokens.scale.subtle, backgroundColor: 'rgba(198,240,107,0.45)' }}
              animate={{ scale: 1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}
            >
              <p className="text-sm text-white/80">Вы записываетесь</p>
              <p className="mt-1 text-xl font-extrabold">{serviceLabel(service)}</p>
              <p className="mt-1 font-semibold text-lime">
                {selected.kind === 'checkup' ? '' : 'от '}
                {formatPrice(selected.price)}
                {selected.duration ? ` · ${selected.duration}` : ''}
              </p>
            </motion.div>

            <ul className="mt-8 grid gap-3">
              {perks.map((perk) => (
                <li key={perk} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-lime text-ink">
                    <Icon name="check" className="size-3.5" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-white/80">
              Или позвоните:{' '}
              <a href={clinic.phoneHref} className="font-bold text-white underline-offset-4 hover:underline">
                {clinic.phone}
              </a>
            </p>

            <svg aria-hidden="true" viewBox="0 0 400 60" className="absolute -right-10 -bottom-2 w-[26rem] text-white/10" fill="none" stroke="currentColor" strokeWidth="4">
              <path d="M0 40 H120 L135 30 L150 40 H170 L180 52 L195 6 L210 58 L220 40 H260 Q275 26 290 40 H400" />
            </svg>
          </div>

          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="sent"
                  ref={focusOnMount}
                  tabIndex={-1}
                  className="flex min-h-[30rem] flex-col items-center justify-center text-center outline-none"
                  initial={{ opacity: 0, scale: motionTokens.scale.subtle }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                  role="status"
                >
                  <svg viewBox="0 0 96 96" className="size-24" aria-hidden="true">
                    <motion.circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="#c6f06b"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={springs.bouncy}
                    />
                    <motion.path
                      d="M28 49 l13 13 l27 -28"
                      fill="none"
                      stroke="#1c1633"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: 0.25 }}
                    />
                  </svg>
                  <h3 className="mt-6 text-3xl font-extrabold">{name.trim()}, записали!</h3>
                  <p className="mt-3 text-lg text-ink-soft">
                    {serviceLabel(service)} · {day.label}, {time}
                  </p>
                  <p className="mt-2 max-w-sm text-ink-soft">Администратор позвонит в течение 15 минут, чтобы подтвердить запись.</p>
                  <p className="mt-6 rounded-full bg-paper-deep px-4 py-2 text-sm font-semibold text-ink-soft">
                    Демо-версия: заявка никуда не отправлена
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-6 font-bold text-violet underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
                  >
                    Записаться ещё раз
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={submit}
                  className="grid gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: motionTokens.duration.fast }}
                >
                  <label className="block font-bold">
                    Направление
                    <select
                      value={service}
                      onChange={(event) => onServiceChange(event.target.value as BookableId)}
                      className={`${fieldClass} cursor-pointer`}
                    >
                      {groups.map((group) => (
                        <optgroup key={group.kind} label={group.label}>
                          {bookables
                            .filter((item) => item.kind === group.kind)
                            .map((item) => (
                              <option key={item.id} value={item.id}>
                                {serviceLabel(item.id)} — {item.kind === 'checkup' ? '' : 'от '}
                                {formatPrice(item.price)}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>

                  <fieldset>
                    <legend className="font-bold">Дата</legend>
                    <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pt-1 pb-2">
                      {days.map((d) => {
                        const checked = d.key === dayKey
                        return (
                          <label
                            key={d.key}
                            className="relative grid min-w-[4.25rem] shrink-0 cursor-pointer place-items-center rounded-2xl border-2 border-ink/10 px-2 py-2.5 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-violet"
                          >
                            <input
                              type="radio"
                              name="day"
                              value={d.key}
                              aria-label={d.label}
                              checked={checked}
                              onChange={() => pickDay(d.key)}
                              className="sr-only"
                            />
                            {checked && <motion.span layoutId="day-pill" className="absolute -inset-0.5 rounded-2xl bg-violet" transition={springs.snappy} />}
                            <span className={`relative text-sm ${checked ? 'text-white/80' : 'text-ink-soft'}`}>{d.weekday}</span>
                            <span className={`relative text-xl font-extrabold ${checked ? 'text-white' : ''}`}>{d.day}</span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>

                  <fieldset aria-describedby={errors.time ? 'error-time' : undefined}>
                    <legend className="font-bold">Время</legend>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {day.slots.map((slot) => {
                        const checked = slot.time === time
                        return (
                          <label
                            key={slot.time}
                            className={`relative grid place-items-center rounded-xl border-2 py-2.5 font-bold transition-colors has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-violet ${
                              slot.busy
                                ? 'cursor-not-allowed border-transparent bg-paper-deep text-ink-soft line-through'
                                : checked
                                  ? 'cursor-pointer border-violet bg-violet-soft text-violet'
                                  : 'cursor-pointer border-ink/10 hover:border-violet/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="time"
                              value={slot.time}
                              checked={checked}
                              disabled={slot.busy}
                              onChange={() => setTime(slot.time)}
                              className="sr-only"
                            />
                            {slot.time}
                            {slot.busy && <span className="sr-only">, занято</span>}
                          </label>
                        )
                      })}
                    </div>
                    {errors.time && (
                      <p id="error-time" className="mt-2 text-sm font-semibold text-coral-deep">
                        {errors.time}
                      </p>
                    )}
                  </fieldset>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block font-bold">
                      Имя
                      <input
                        data-field="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Саня"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'error-name' : undefined}
                        className={fieldClass}
                      />
                      {errors.name && (
                        <span id="error-name" className="mt-2 block text-sm font-semibold text-coral-deep">
                          {errors.name}
                        </span>
                      )}
                    </label>
                    <label className="block font-bold">
                      Телефон
                      <input
                        data-field="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(event) => setPhone(formatPhone(event.target.value))}
                        placeholder="+7 (___) ___-__-__"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'error-phone' : undefined}
                        className={fieldClass}
                      />
                      {errors.phone && (
                        <span id="error-phone" className="mt-2 block text-sm font-semibold text-coral-deep">
                          {errors.phone}
                        </span>
                      )}
                    </label>
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-ink-soft">
                      <input
                        data-field="consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        aria-invalid={Boolean(errors.consent)}
                        aria-describedby={errors.consent ? 'error-consent' : undefined}
                        className="mt-1 size-5 shrink-0 cursor-pointer accent-violet"
                      />
                      Согласен на обработку персональных данных и получение напоминаний о визите
                    </label>
                    {errors.consent && (
                      <p id="error-consent" className="mt-2 text-sm font-semibold text-coral-deep">
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  <motion.button type="submit" className={`${buttonPrimary} w-full`} {...pressable}>
                    Записаться{time ? ` на ${day.label}, ${time}` : ''}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
