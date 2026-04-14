import { create } from 'zustand';
import { SpinType } from '../../engine/types';

export enum GamePhase {
  IDLE = 'idle',
  SPINNING = 'spinning',
}

export interface IWinSummarySpinEntry {
  paylineIndex: number;
  symbolId: number;
  symbolName: string;
  matchCount: number;
  winAmount: number;
}

export interface IWinSummaryCascadeEntry {
  symbolId: number;
  symbolName: string;
  matchCount: number;
  baseWin: number;
}

export interface IWinSummaryCascadeStep {
  stepIndex: number;
  multiplier: number;
  stepWin: number;
  entries: IWinSummaryCascadeEntry[];
}

export interface ILastWinSummary {
  spin: IWinSummarySpinEntry[];
  cascade: IWinSummaryCascadeStep[];
}

export interface ILiveCascadeProgress {
  stepIndex: number;
  multiplier: number;
  stepWin: number;
  totalWinAfterStep: number;
}

export interface GameState {
  balance: number;
  bet: number;
  phase: GamePhase;
  mechanic: SpinType;
  betOptions: number[];
  lastWin: number;
  lastWinSummary: ILastWinSummary | null;
  pendingWinSummary: ILastWinSummary | null;
  liveCascadeProgress: ILiveCascadeProgress | null;
  lastResult: number[][] | null;
  error: string | null;
}

export const useGameStore = create<GameState>(() => ({
  balance: 0,
  bet: 0,
  phase: GamePhase.IDLE,
  mechanic: SpinType.SPIN,
  betOptions: [],
  lastWin: 0,
  lastWinSummary: null,
  pendingWinSummary: null,
  liveCascadeProgress: null,
  lastResult: null,
  error: null,
}));

export type TGameStore = typeof useGameStore;