import type { Container } from 'pixi.js';
import type { IReelStripView, IReelSymbolCell } from './IReelStrip';

export interface IReel {
  // TODO: if time, move to predefined init symbols and remove all randomize symbol instances
  // This is only used to randomized initial machine symbols.
  randomizeSymbols(symbolPool: number[]): void;
  getStrip(): IReelStripView;
  getVisibleSymbolView(row: number): IReelSymbolCell | undefined;
  setVisibleSymbol(row: number, symbolId: number): void;
  getVisibleRowY(row: number): number;
  getCellStepDistance(): number;
}

/** Pixi reel view */
export type IReelView = IReel & Container;
