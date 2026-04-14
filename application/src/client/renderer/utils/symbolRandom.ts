export type TRandomGenerator = () => number;

export function pickRandomSymbolId(symbolPool: number[], random: TRandomGenerator): number {
  if (symbolPool.length === 0) {
    throw new Error('symbolPool must not be empty');
  }
  const index = Math.floor(random() * symbolPool.length);
  return symbolPool[index];
}
