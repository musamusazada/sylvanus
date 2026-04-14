import type { GridModel } from '../models/GridModel';
import type { ISymbolDefinition } from '../types';

// TODO: better way of generating symbols map 
export function buildSymbolLookup(symbols: ISymbolDefinition[]): Map<number, ISymbolDefinition> {
  return new Map(symbols.map(symbol => [symbol.id, symbol]));
}

export function getPayoutMultiplier(symbol: ISymbolDefinition | undefined, matchCount: number): number {
  if (!symbol) return 0;

  const directMatch = symbol.payouts[matchCount];
  if (directMatch !== undefined) return directMatch;

  const fallbackThreshold = Object.keys(symbol.payouts)
    .map(Number)
    .filter((threshold) => threshold <= matchCount)
    .sort((a, b) => b - a)[0];

  return fallbackThreshold !== undefined ? symbol.payouts[fallbackThreshold] ?? 0 : 0;
}

export function snapshotGrid(grid: GridModel, cols: number): number[][] {
  return [...Array(cols).keys()].map((col) => grid.extractReelSymbols(col));
}
