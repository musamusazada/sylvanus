import type { PlayTimeline } from './timeline.types';
import type { IGridDimensions, ISymbolDefinition, SpinType } from './config.types';

/*
* Shape of the engine state
*/ 
export interface IEngineStateSnapshot {
  balance: number;
  bet: number;
}

export interface IBootResponse {
  state: IEngineStateSnapshot;
  config: {
    gridDimensions: IGridDimensions;
    symbols: ISymbolDefinition[];
    spinType: SpinType;
    betOptions: number[];
  };
}

export interface IPlayError {
  success: false;
  error: string;
}

export interface IPlaySuccess {
  success: true;
  transactionId: string;
  state: { initial: IEngineStateSnapshot; final: IEngineStateSnapshot };
  timeline: PlayTimeline;
}

export type PlayResult = IPlaySuccess | IPlayError;