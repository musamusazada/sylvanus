import type { Container } from 'pixi.js';
import type { IReelStripView } from './IReelStrip';

export interface IReel {
  // TODO: if time, move to predefined init symbols and remove all randomize symbol instances
  // This is only used to randomized initial machine symbols.
  randomizeSymbols(symbolPool: number[]): void;
  getStrip(): IReelStripView;
}

/** Pixi reel view */
export type IReelView = IReel & Container;
