import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'public/shots'

function dims(buf) {
  const fmt = buf.toString('ascii', 12, 16)
  if (fmt === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)]
  if (fmt === 'VP8L') {
    const b = buf.readUInt32LE(21)
    return [1 + (b & 0x3fff), 1 + ((b >> 14) & 0x3fff)]
  }
  if (fmt === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff]
  throw new Error(`formato webp desconhecido: ${fmt}`)
}

const entries = readdirSync(dir)
  .filter((f) => f.endsWith('.webp'))
  .sort()
  .map((f) => {
    const [w, h] = dims(readFileSync(join(dir, f)))
    return `  '${f.replace('.webp', '')}': [${w}, ${h}],`
  })

writeFileSync(
  'src/content/shotDims.ts',
  `// Gerado por scripts/gen-shot-dims.mjs — não editar à mão.\nexport const shotDims: Record<string, [number, number]> = {\n${entries.join('\n')}\n}\n`,
)
console.log(`${entries.length} imagens`)
