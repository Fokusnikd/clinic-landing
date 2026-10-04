const items = ['Терапия', 'Кардиология', 'Неврология', 'Гастроэнтерология', 'Эндокринология', 'Психотерапия', 'УЗИ', 'Анализы за 1 день', 'Чекапы']

function Beat() {
  return (
    <svg viewBox="0 0 80 24" className="h-6 w-20 shrink-0 text-lime" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 14 H22 L26 10 L30 14 H34 L37 18 L41 3 L45 22 L48 14 H56 Q60 9 64 14 H80" />
    </svg>
  )
}

// Tilted ticker between the hero and services: specialties separated by heartbeats
export function PulseBand() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-5 pr-5 text-lg font-bold whitespace-nowrap sm:text-xl">
          {item}
          <Beat />
        </li>
      ))}
    </ul>
  )

  return (
    <div className="overflow-clip py-6">
      <div className="-mx-4 -rotate-2 bg-ink py-4 text-paper sm:py-5">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  )
}
