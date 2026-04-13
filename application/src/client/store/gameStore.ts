import { create } from 'zustand';
import { SpinType } from '../../engine/types';

export enum GamePhase {
  IDLE = 'idle',
  SPINNING = 'spinning',
}

export interface GameState {
  balance: number;
  bet: number;
  phase: GamePhase;
  mechanic: SpinType;
  betOptions: number[];
  lastWin: number;
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
  lastResult: null,
  error: null,
}));
