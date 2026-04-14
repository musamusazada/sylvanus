import type { IGameConfig } from '../engine';
import { SpinType } from '../engine/types';

export const gameConfig: IGameConfig = {
  spinType: SpinType.SPIN,
  gridDimensions: { cols: 3, rows: 3 },
  symbols: [
    { id: 1, name: 'Ace', weight: 5, payouts: { 2: 25, 3: 50 } },
    { id: 2, name: 'King', weight: 10, payouts: { 2: 15, 3: 30 } },
    { id: 3, name: 'Queen', weight: 10, payouts: { 2: 10, 3: 20 } },
    { id: 4, name: 'Jack', weight: 15, payouts: { 2: 5, 3: 15 } },
    { id: 5, name: 'Ten', weight: 15, payouts: { 2: 3, 3: 10 } },
    { id: 6, name: 'Eight', weight: 20, payouts: { 2: 2, 3: 8 } },
    { id: 7, name: 'Seven', weight: 20, payouts: { 2: 1, 3: 5 } },
    { id: 8, name: 'Four', weight: 20, payouts: { 2: 1, 3: 5 } },
    { id: 9, name: 'Three', weight: 20, payouts: { 2: 1, 3: 5 } },
    { id: 10, name: 'Joker', weight: 3, payouts: { 3: 100 } },
  ],
  paylines: [
    [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }],
    [{ col: 0, row: 1 }, { col: 1, row: 0 }, { col: 2, row: 0 }],
    [{ col: 0, row: 0 }, { col: 1, row: 1 }, { col: 2, row: 2 }],
    [{ col: 0, row: 2 }, { col: 1, row: 1 }, { col: 2, row: 0 }],
    [{ col: 0, row: 0 }, { col: 1, row: 0 }],
    [{ col: 1, row: 0 }, { col: 2, row: 0 }],
    [{ col: 1, row: 2 }, { col: 2, row: 2 }],
  ],
  defaultBet: 10,
  betOptions: [5, 10, 25, 50, 100],
  anticipation: { symbolId: 10 },
};