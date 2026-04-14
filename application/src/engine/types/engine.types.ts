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


// Win Evaluation types
export interface IGridPosition {
  col: number;
  row: number;
}

export interface ISpinPaylineWin {
  paylineIndex: number;
  symbolId: number;
  matchCount: number;
  payoutMultiplier: number;
  winAmount: number;
  positions: IGridPosition[];
}

export interface ICascadeSymbolWin {
  symbolId: number;
  matchCount: number;
  payoutMultiplier: number;
  baseWin: number;
}

export interface ICascadeMoveDirective {
  symbolId: number;
  from: IGridPosition;
  to: IGridPosition;
}

export interface ICascadeSpawnDirective {
  symbolId: number;
  to: IGridPosition;
  fromRowAbove: number;
}

export interface ICascadeStepWin {
  stepIndex: number;
  multiplier: number;
  removedPositions: IGridPosition[];
  matchedSymbolIds: number[];
  symbolWins: ICascadeSymbolWin[];
  moves: ICascadeMoveDirective[];
  spawns: ICascadeSpawnDirective[];
  stepBaseWin: number;
  stepWin: number;
  totalWinAfterStep: number;
  gridAfterDrop: number[][];
  resultingGrid: number[][];
}

export interface IWinEvaluationResult {
  totalWin: number;
  spinWins: ISpinPaylineWin[];
  cascadeSteps: ICascadeStepWin[];
  finalGrid: number[][];
}

export interface IPlaySuccess {
  success: true;
  transactionId: string;
  state: { initial: IEngineStateSnapshot; final: IEngineStateSnapshot };
  timeline: PlayTimeline;
  wins: IWinEvaluationResult;
}

export type PlayResult = IPlaySuccess | IPlayError;