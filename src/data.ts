import type { IconName } from './components/Icon'
import type { AvatarLook } from './components/Avatar'

// Fictional clinic: every doctor, price, review and licence on this page is demo content.
export const clinic = {
  name: 'Ты в порядке, Саня?',
  phone: '+7 (495) 000-00-00',
  phoneHref: 'tel:+74950000000',
  address: 'Москва, 5 минут пешком от м. Савёловская',
  hours: 'Пн–Пт 8:00–21:00, Сб–Вс 9:00–18:00',
}

export const navItems = [
  { label: 'Направления', href: '#services' },
  { label: 'Чекапы', href: '#checkups' },
  { label: 'Врачи', href: '#doctors' },
  { label: 'Вопросы', href: '#faq' },
  { label: 'Контакты', href: '#contacts' },
]

export type BookableKind = 'checkup' | 'doctor' | 'diagnostics'

export type Bookable<Id extends string = string> = {
  id: Id
  kind: BookableKind
  title: string
  price: number
  // Doctors and diagnostics
  icon?: IconName
  text?: string
  // Checkups
  nickname?: string
  duration?: string
  forWhom?: string
  items?: string[]
  tag?: string
}

const bookableList = [
  {
    id: 'check-basic',
    kind: 'checkup',
    nickname: 'Саня, проверься',
    title: 'Базовый чекап',
    price: 6900,
    duration: '2 часа',
    forWhom: 'Если давно не был у врача и не знаешь, с чего начать.',
    items: [
      'Терапевт до и после обследования',
      'ЭКГ',
      'УЗИ брюшной полости и почек',
      'Общий и биохимический анализ крови — 14 показателей',
      'План на год: что и когда проверять',
    ],
  },
  {
    id: 'check-40',
    kind: 'checkup',
    nickname: 'Саня, тебе за 40',
    title: 'Расширенный чекап',
    price: 14900,
    duration: '3 часа',
    tag: 'Чаще всего выбирают',
    forWhom: 'Сердце, сосуды и обмен веществ — внимательнее, чем обычно.',
    items: [
      'Всё из базового чекапа',
      'Кардиолог и УЗИ сердца',
      'Липидный профиль и гликированный гемоглобин',
      'УЗИ щитовидной железы и сосудов шеи',
      'Консультация эндокринолога',
    ],
  },
  {
    id: 'check-calm',
    kind: 'checkup',
    nickname: 'Саня, выдохни',
    title: 'Антистресс-чекап',
    price: 9900,
    duration: '2,5 часа',
    forWhom: 'Если устаёшь к обеду, плохо спишь и всё раздражает.',
    items: [
      'Невролог и психотерапевт',
      'ТТГ, витамин D, B12 и ферритин',
      'Общий анализ крови',
      'Рекомендации по сну и нагрузке',
    ],
  },
  { id: 'therapy', kind: 'doctor', title: 'Терапевт', price: 2900, icon: 'stethoscope', text: 'Первичный приём, разбор анализов, план обследования' },
  { id: 'cardio', kind: 'doctor', title: 'Кардиолог', price: 3400, icon: 'heart', text: 'Давление, ЭКГ, суточный мониторинг' },
  { id: 'neuro', kind: 'doctor', title: 'Невролог', price: 3400, icon: 'brain', text: 'Головная боль, спина, нарушения сна' },
  { id: 'gastro', kind: 'doctor', title: 'Гастроэнтеролог', price: 3400, icon: 'stomach', text: 'Изжога, боль в животе, питание' },
  { id: 'endo', kind: 'doctor', title: 'Эндокринолог', price: 3400, icon: 'drop', text: 'Щитовидная железа, сахар, вес' },
  { id: 'psycho', kind: 'doctor', title: 'Психотерапевт', price: 4500, icon: 'chat', text: 'Тревога, выгорание, бессонница' },
  { id: 'ultrasound', kind: 'diagnostics', title: 'УЗИ', price: 1900, icon: 'scan', text: 'Аппараты экспертного класса, заключение сразу' },
  { id: 'labs', kind: 'diagnostics', title: 'Анализы', price: 290, icon: 'tube', text: 'Своя лаборатория, результаты на следующий день' },
] satisfies Bookable[]

export type BookableId = (typeof bookableList)[number]['id']

export const bookables: Bookable<BookableId>[] = bookableList

type Checkup = Bookable<BookableId> & Required<Pick<Bookable, 'nickname' | 'duration' | 'forWhom' | 'items'>>

export const findBookable = (id: BookableId) => bookables.find((item) => item.id === id) ?? bookables[0]

export const checkups = bookables.filter((item): item is Checkup => item.kind === 'checkup')
export const services = bookables.filter((item) => item.kind !== 'checkup')

export const formatPrice = (price: number) => `${price.toLocaleString('ru-RU')} ₽`

export type ChatNode = {
  bot: string[]
  replies?: { label: string; next: string }[]
  result?: BookableId
}

// Branching script for the hero chat; every branch ends with a suggestion to book
export const chatScript: Record<string, ChatNode> = {
  start: {
    bot: ['Привет! Это клиника «Ты в порядке, Саня?»', 'Саня, ты в порядке?'],
    replies: [
      { label: 'Да, всё норм', next: 'fine' },
      { label: 'Ну, так себе', next: 'meh' },
      { label: 'Давно не был у врача', next: 'long' },
    ],
  },
  fine: {
    bot: ['Отлично! А анализы когда сдавал последний раз?'],
    replies: [
      { label: 'В этом году', next: 'fine-recent' },
      { label: 'Даже не помню', next: 'fine-forgot' },
    ],
  },
  'fine-recent': {
    bot: ['Красавчик. Тогда просто заглядывай раз в год — проверить, что «норм» никуда не делось.'],
    result: 'check-basic',
  },
  'fine-forgot': {
    bot: ['Понял. Давай убедимся, что «норм» — это правда норм. Займёт одно утро.'],
    result: 'check-basic',
  },
  meh: {
    bot: ['Понимаю. Что беспокоит больше всего?'],
    replies: [
      { label: 'Голова или давление', next: 'meh-head' },
      { label: 'Устаю и плохо сплю', next: 'meh-tired' },
      { label: 'Живот', next: 'meh-stomach' },
      { label: 'Тревожно', next: 'meh-anxious' },
    ],
  },
  'meh-head': {
    bot: ['Начнём с терапевта: измерим давление, снимем ЭКГ и решим, нужен ли кардиолог или невролог.'],
    result: 'therapy',
  },
  'meh-tired': {
    bot: ['Усталость часто прячется в анализах: щитовидка, железо, витамин D. Для этого есть программа «Саня, выдохни».'],
    result: 'check-calm',
  },
  'meh-stomach': {
    bot: ['Тогда к гастроэнтерологу. УЗИ можно сделать в тот же день — врач посмотрит результат сразу.'],
    result: 'gastro',
  },
  'meh-anxious': {
    bot: ['Хорошо, что сказал. Психотерапевт поможет разобраться, что происходит, — без диагнозов с порога.'],
    result: 'psycho',
  },
  long: {
    bot: ['Так бывает у всех Сань. Сколько тебе лет, если не секрет?'],
    replies: [
      { label: 'Меньше 40', next: 'long-young' },
      { label: '40 и больше', next: 'long-40' },
    ],
  },
  'long-young': {
    bot: ['Тогда начнём с базового чекапа: все врачи и анализы за одно утро, без беготни по кабинетам.'],
    result: 'check-basic',
  },
  'long-40': {
    bot: ['После 40 сердце и сосуды стоит проверять чуть внимательнее. Для этого есть программа «Саня, тебе за 40».'],
    result: 'check-40',
  },
}

export const checkupDay = [
  { time: '08:30', minutes: 510, title: 'Анализы', text: 'Приходите натощак. Кровь берём за 10 минут — почти не больно.' },
  { time: '09:00', minutes: 540, title: 'ЭКГ и УЗИ', text: 'Кабинеты забронированы под вас: без очереди и ожидания в коридоре.' },
  { time: '09:40', minutes: 580, title: 'Завтрак', text: 'Кофе и сырники в нашем лаунже, пока лаборатория работает.' },
  { time: '10:30', minutes: 630, title: 'Врачи', text: 'Терапевт и специалисты по программе смотрят вас и первые результаты.' },
  { time: '11:00', minutes: 660, title: 'Саня в порядке', text: 'Врач объясняет результаты простыми словами и составляет план на год.' },
]

export const advantages: { icon: IconName; title: string; text: string }[] = [
  { icon: 'clock', title: 'Приём вовремя', text: 'Если врач задержался больше чем на 10 минут, следующий приём — за наш счёт.' },
  { icon: 'chat', title: 'Объясняем по-человечески', text: 'Без «ну, это возрастное». Врач расскажет, что происходит и что с этим делать.' },
  { icon: 'shield', title: 'Ничего лишнего', text: 'Каждое назначение врач обосновывает. Если анализ не нужен — так и скажем.' },
  { icon: 'send', title: 'Результаты в Telegram', text: 'Анализы — на следующий день, заключения и рекомендации — в личном кабинете.' },
]

export const stats = [
  { value: 17, label: 'врачей в штате' },
  { value: 12, suffix: ' лет', label: 'лечим в Москве' },
  { value: 4.9, decimals: 1, label: 'средняя оценка на картах' },
  { value: 10, prefix: '≤ ', suffix: ' мин', label: 'ожидание в холле' },
]

export type Doctor = { name: string; role: string; experience: string; quote: string; service: BookableId; look: AvatarLook }

export const doctors: Doctor[] = [
  {
    name: 'Анна Миронова',
    role: 'Терапевт',
    experience: 'Стаж 14 лет',
    quote: 'Спрошу, как вы, — и дослушаю ответ до конца.',
    service: 'therapy',
    look: { skin: '#f2c7a5', hair: '#6b3f2a', style: 'bob', bg: '#ded6ff', scrubs: '#5b3fd1' },
  },
  {
    name: 'Игорь Белов',
    role: 'Кардиолог, к. м. н.',
    experience: 'Стаж 19 лет',
    quote: 'Сердцу полезно, когда о нём вспоминают не только 14 февраля.',
    service: 'cardio',
    look: { skin: '#e8b48f', hair: '#9a9aa8', style: 'short', beard: true, glasses: true, bg: '#e6f7c4', scrubs: '#3b7212' },
  },
  {
    name: 'Екатерина Соколова',
    role: 'Невролог',
    experience: 'Стаж 11 лет',
    quote: 'Головная боль — не норма, даже если «всегда так было».',
    service: 'neuro',
    look: { skin: '#f5d0b5', hair: '#2b2233', style: 'bun', glasses: true, bg: '#ffe2dc', scrubs: '#c0392b' },
  },
  {
    name: 'Дмитрий Рябов',
    role: 'Психотерапевт',
    experience: 'Стаж 9 лет',
    quote: '«Я в порядке» — самая частая фраза в моём кабинете. С неё и начнём.',
    service: 'psycho',
    look: { skin: '#c98e68', hair: '#1f1a24', style: 'curly', bg: '#fff1c2', scrubs: '#1c1633' },
  },
]

export const reviews = [
  {
    name: 'Саня, 34 года',
    text: 'Жена записала меня на «Саня, проверься». Думал, я в порядке. Оказалось — почти. Через месяц пересдал анализы: теперь точно в порядке.',
  },
  {
    name: 'Ольга',
    text: 'Пять лет терпела мигрень. Невролог слушала меня сорок минут и ни разу не посмотрела на часы. Наконец понятно, что делать.',
  },
  {
    name: 'Александр (тоже Саня)',
    text: 'Пришёл из-за названия, остался из-за врачей. Приём начался минута в минуту, анализы прислали в Telegram на следующий день.',
  },
]

export const faq = [
  {
    q: 'Нужно ли направление?',
    a: 'Нет. Можно сразу записаться к узкому специалисту или начать с терапевта — он подскажет, к кому идти дальше.',
  },
  {
    q: 'Вы принимаете по ДМС?',
    a: 'Да, работаем с основными страховыми компаниями. Администратор проверит, входит ли приём в ваш полис, ещё до визита.',
  },
  {
    q: 'Как подготовиться к чекапу?',
    a: 'Не есть 8–12 часов, утром можно пить воду. Накануне — без алкоголя и тяжёлых тренировок. Памятку пришлём в Telegram после записи.',
  },
  {
    q: 'Можно вернуть 13% за лечение?',
    a: 'Да. Выдадим справку об оплате медицинских услуг для налогового вычета — по запросу на ресепшене или в личном кабинете.',
  },
  {
    q: 'А если я не Саня?',
    a: 'Тоже примем. Саня — это не имя, а состояние: когда на «как дела?» всегда отвечаешь «нормально».',
  },
]

// Appointment slots; on weekends the clinic closes at 18:00
const slots = ['09:00', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00']
const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

export type BookingDay = { key: string; weekday: string; day: string; label: string; slots: { time: string; busy: boolean }[] }

export function bookingDays(from = new Date(), count = 7): BookingDay[] {
  return Array.from({ length: count }, (_, offset) => {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset + 1)
    const weekend = date.getDay() === 0 || date.getDay() === 6
    return {
      key: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      weekday: weekdays[date.getDay()],
      day: String(date.getDate()),
      label: `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`,
      slots: slots
        .filter((time) => !weekend || time < '18:00')
        // Deterministic "busy" slots so the demo looks lived-in without randomness between renders
        .map((time, index) => ({ time, busy: (date.getDate() * 7 + index * 3) % 5 === 0 })),
    }
  })
}
