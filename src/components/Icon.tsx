import type { ReactNode } from 'react'

// Line icon set: 24×24 grid, 2px stroke, round caps
const paths = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  refresh: <path d="M4.5 12a7.5 7.5 0 0 1 13-5.1L19.5 9M19.5 4.5V9H15M19.5 12a7.5 7.5 0 0 1-13 5.1L4.5 15M4.5 19.5V15H9" />,
  phone: (
    <path d="M5.5 4h3l1.5 4.25-2 1.25a11 11 0 0 0 6.5 6.5l1.25-2L20 15.5v3a1.5 1.5 0 0 1-1.6 1.5C10.6 19.5 4.5 13.4 4 5.6A1.5 1.5 0 0 1 5.5 4z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.25" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16" />
    </>
  ),
  star: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85L12 3.5z"
    />
  ),
  stethoscope: (
    <>
      <path d="M5 3v5a5 5 0 0 0 10 0V3" />
      <path d="M10 13v2a4 4 0 0 0 8 0v-3" />
      <circle cx="18" cy="10" r="2" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z" />
      <path d="M8 12.5h2l1.25-2 1.75 3.5 1.25-1.5H16" />
    </>
  ),
  brain: (
    <>
      <path d="M12 5.5A2.5 2.5 0 0 0 7.2 4.6 3 3 0 0 0 5 9.2a3 3 0 0 0 .5 5.3A3 3 0 0 0 9.5 19a2.5 2.5 0 0 0 2.5-1.5z" />
      <path d="M12 5.5a2.5 2.5 0 0 1 4.8-.9A3 3 0 0 1 19 9.2a3 3 0 0 1-.5 5.3 3 3 0 0 1-4 4.5 2.5 2.5 0 0 1-2.5-1.5" />
    </>
  ),
  stomach: (
    <path d="M9 3v3.5c0 1.5-3.5 2.5-3.5 6.5A7 7 0 0 0 12.5 20h.5a5.5 5.5 0 0 0 5.5-5.5c0-2.6-2-4-4.5-4S11 11.8 11 13.5M15 20v1.5" />
  ),
  drop: <path d="M12 3.5s-6 6.6-6 10.5a6 6 0 0 0 12 0c0-3.9-6-10.5-6-10.5z" />,
  chat: <path d="M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-8l-5 4v-4H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5z" />,
  scan: (
    <>
      <path d="M12 20.5L5.2 10a9.5 9.5 0 0 1 13.6 0z" />
      <path d="M8.6 13.5a5 5 0 0 1 6.8 0" />
    </>
  ),
  tube: (
    <>
      <path d="M8.5 3.5h7M10 3.5v13a2 2 0 0 0 4 0v-13" />
      <path d="M10 11h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  send: <path d="M20.5 3.5L3.5 10.5l6.5 2.5 2.5 6.5zM10 13l4.5-4.5" />,
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof paths

export function Icon({ name, className = 'size-6' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
