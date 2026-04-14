import type { Container } from 'pixi.js';
import type { TTextureResolver } from '../symbol/ISymbolView';
import type { TRandomGenerator } from '../../utils/symbolRandom';
import { AssetLoader } from '../../assets/AssetLoader';

export interface IReelStrip {
  readonly visibleCount: number;
  readonly bufferCount: number;
  setFinalSymbols(symbolIds: number[]): void;
  randomizeSymbols(symbolPool: number[]): void;
  shiftSymbolsDown(newTopSymbolId: number): void;
}

/**
 * Dependencies for the ReelStrip
 */
export interface ReelStripDependencies {
  getSymbolTexture: TTextureResolver;
  random: TRandomGenerator;
}

/**
 * Default dependencies for the ReelStrip
 */
export const defaultStripDependencies = (): ReelStripDependencies => ({
  getSymbolTexture: (id: number) => AssetLoader.getSymbolTexture(id),
  random: Math.random,
});


/** Pixi reel strip view */
export type IReelStripView = IReelStrip & Container;
