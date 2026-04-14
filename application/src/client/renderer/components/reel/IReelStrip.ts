import type { Container } from 'pixi.js';
import type { TTextureResolver } from '../symbol/ISymbolView';
import type { ISymbolView } from '../symbol/ISymbolView';
import type { TRandomGenerator } from '../../utils/symbolRandom';
import { AssetLoader } from '../../assets/AssetLoader';


// TODO: rework the ISymbolView to not have this type
export interface IReelSymbolCell extends ISymbolView {
  alpha: number;
  y: number;
}

export interface IReelStrip {
  setFinalSymbols(symbolIds: number[]): void;
  randomizeSymbols(symbolPool: number[]): void;
  shiftSymbolsDown(newTopSymbolId: number): void;
  getVisibleSymbolView(row: number): IReelSymbolCell | undefined;
  setVisibleSymbol(row: number, symbolId: number): void;
  getVisibleRowY(row: number): number;
  getCellStepDistance(): number;
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
