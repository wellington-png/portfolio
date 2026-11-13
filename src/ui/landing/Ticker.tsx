/** Faixa que anda sozinha e também acompanha a rolagem da página. */
export function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items, ...items]
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <div className="ticker-run">
          {row.map((t, i) => (
            <span key={i}>
              {t}
              <b>///</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
