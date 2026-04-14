import { pickRandomSymbolId, type TRandomGenerator } from '../utils/symbolRandom';

/**
 * Builds the ordered list of symbol ids provided to the strip during the stop animation.
 *
 * `finalSymbols` comes from the engine as visible column cells (e.g. top → bottom )
 * The order is reversed to match how this reel strip implementation applies `shiftSymbolsDown` step by step. 
 * A random id is appended for the obuffer cell revealed at the end of the sequence.
 */
export function buildStopFeedSequence(
  finalSymbols: number[],
  symbolPool: number[],
  random: TRandomGenerator
): number[] {
  const sequence = [...finalSymbols].reverse();
  sequence.push(pickRandomSymbolId(symbolPool, random));
  return sequence;
}
