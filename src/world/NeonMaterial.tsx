/** Material emissivo: valores > 1 de luminância é o que o Bloom (threshold 1) realça. */
export function NeonMaterial({ color, intensity = 2.5 }: { color: string; intensity?: number }) {
  return <meshStandardMaterial color="#000000" emissive={color} emissiveIntensity={intensity} toneMapped={false} />
}
