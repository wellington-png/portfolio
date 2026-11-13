/**
 * Rachadura que divide o hero: um zigue-zague de pontos (em % do palco) usado tanto no recorte da arte
 * (via CSS) quanto no traço luminoso desenhado aqui. A versão de celular corta na horizontal, nos 500px de baixo do hero (y em % dessa faixa).
 */
export const CRACK_DESKTOP: [number, number][] = [
  [51, 0], [47, 8], [52.5, 15], [46, 24], [50.5, 33], [44, 43], [49.5, 52], [43, 62], [48, 71], [41.5, 81], [46, 90], [42.5, 100],
]
export const CRACK_MOBILE: [number, number][] = [
  [0, 10], [9, 6], [17, 12], [27, 5], [36, 11], [46, 4], [55, 12], [65, 5], [74, 11], [84, 4], [92, 10], [100, 6],
]

const pts = (a: [number, number][]) => a.map(([x, y]) => `${x},${y}`).join(' ')

/** Ramificações curtas que saem da rachadura, para ela parecer quebra de verdade. */
const BRANCHES_DESKTOP = [
  '47,8 43,11 44,15',
  '46,24 41,26 40,31',
  '50.5,33 55,36 54,41',
  '44,43 39,46 38,50',
  '43,62 38,64 37,69',
  '48,71 52,75 51,80',
]
const BRANCHES_MOBILE = ['17,12 15,17 18,21', '36,11 38,16 35,20', '55,12 57,17 54,21', '74,11 73,16 76,20']

function Lines({ main, branches, className }: { main: [number, number][]; branches: string[]; className: string }) {
  return (
    <svg className={`crack ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false" aria-hidden="true">
      <polyline className="crack-glow" points={pts(main)} pathLength="1" />
      <polyline className="crack-line" points={pts(main)} pathLength="1" />
      <polyline className="crack-edge" points={pts(main.map(([x, y]) => [x + 0.5, y]))} pathLength="1" />
      {branches.map((b, i) => (
        <polyline key={i} className="crack-branch" points={b} pathLength="1" style={{ ['--i' as string]: i }} />
      ))}
    </svg>
  )
}

export function Crack() {
  return (
    <>
      <Lines main={CRACK_DESKTOP} branches={BRANCHES_DESKTOP} className="crack-d" />
      <Lines main={CRACK_MOBILE} branches={BRANCHES_MOBILE} className="crack-m" />
    </>
  )
}
