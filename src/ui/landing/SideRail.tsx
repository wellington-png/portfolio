interface Item {
  id: string
  label: string
}

/** Trilho lateral com a posição atual na página, em números. */
export function SideRail({ items, active }: { items: Item[]; active: number }) {
  return (
    <nav className="rail" aria-label="Posição na página">
      {items.map((it, i) => (
        <a key={it.id} href={`#${it.id}`} className="rail-item" data-active={i === active || undefined} aria-label={it.label}>
          <span className="rail-label">{it.label}</span>
          <span className="rail-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="rail-tick" />
        </a>
      ))}
    </nav>
  )
}
