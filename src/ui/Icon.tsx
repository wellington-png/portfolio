import type { ReactNode } from 'react'

const P = (d: string) => <path d={d} />

const ICONS: Record<string, ReactNode> = {
  play: <path d="M7 4.5v15l12-7.5z" fill="currentColor" />,
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  copy: <path d="M9 9h10v10H9zM5 15V5h10" />,
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8" />,
  pause: <path d="M8 5v14M16 5v14" />,
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  'arrow-up-right': <path d="M7 17L17 7M8 7h9v9" />,
  'arrow-down': <path d="M12 5v14M6 13l6 6 6-6" />,
  'arrow-left': <path d="M19 12H5M11 6l-6 6 6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor" />,
  sparkle: <path d="M12 3c.6 5 3 7.4 9 9-6 1.6-8.4 4-9 9-.6-5-3-7.4-9-9 6-1.6 8.4-4 9-9z" fill="currentColor" />,
  flag: <path d="M5 21V4M5 4h11l-2 4 2 4H5" />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M21 16l-5-5-9 9" />
    </>
  ),
  layers: <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />,
  map: <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" />,
  pencil: <path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4" />,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z" />,
  rocket: (
    <>
      <path d="M12 3c4 2 6 6 5 11l-3 3h-4l-3-3C6 9 8 5 12 3zM9 17l-3 4 4-1M15 17l3 4-4-1" />
      <circle cx="12" cy="10" r="1.6" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  github: (
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </>
  ),
  braces: P('M8 4c-2 0-3 1-3 3v2c0 1.5-1 3-2 3 1 0 2 1.5 2 3v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1.5 1 3 2 3-1 0-2 1.5-2 3v2c0 2-1 3-3 3'),
  phone: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 10l3 2-3 2M12 15h5" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
  plug: P('M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4'),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  list: P('M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'),
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  box: P('M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8'),
  branch: (
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="8" r="2" />
      <path d="M6 7v10M18 10c0 4-4 5-12 7" />
    </>
  ),
  flame: P('M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-10z'),
  video: (
    <>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M16 10l6-3v10l-6-3" />
    </>
  ),
  triangle: <path d="M12 4l9 16H3z" />,
  swap: <path d="M4 8h13M13 4l4 4-4 4M20 16H7M11 12l-4 4 4 4" />,
  code: P('M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16'),
}

export const hasIcon = (name: string) => name in ICONS

export type IconName = keyof typeof ICONS

/** Ícone em linha (SVG), herda a cor e o tamanho do texto. Nomes desconhecidos viram "code". */
export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name] ?? ICONS.code}
    </svg>
  )
}
