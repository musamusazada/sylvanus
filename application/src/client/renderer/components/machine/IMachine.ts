import type { Container } from 'pixi.js';
import type { IReel } from '../reel/IReel';
import type { TRandomGenerator } from '../../utils/symbolRandom';

// TODO: move away ?
export interface IGridDimensions {
  cols: number;
  rows: number;
}

/**
 * Definitions of Machine API and behaviours
 */
export interface IMachine {
  startSpin(): Promise<void>;
  stopReel(index: number, symbols: number[]): Promise<void>;
}

/**
 * Spin orchestration for IMachine
 */
export interface IMachineSpin {
  startAll(reels: IReel[], symbolPool: number[], random?: TRandomGenerator): Promise<void>;
  stopReel(reel: IReel, symbols: number[], symbolPool: number[], random?: TRandomGenerator): Promise<void>;
}

/** Pixi machine root */
export type IMachineView = IMachine & Container;
