import type { IGameConfig } from '../engine';
import { SpinType } from '../engine/types';

export const sampleConfig: IGameConfig = {
  spinType: SpinType.SPIN,
  gridDimensions: { cols: 3, rows: 3 },
  symbols: [
    { id: 1, name: 'Cherry', weight: 50, payouts: { 3: 5 } },
    { id: 2, name: 'Lemon', weight: 30, payouts: { 3: 10 } },
    { id: 3, name: 'Diamond', weight: 5, payouts: { 3: 50 } },
    { id: 4, name: 'Orange', weight: 5, payouts: { 3: 5 } },
    { id: 5, name: 'Plum', weight: 5, payouts: { 3: 5 } },
    { id: 6, name: 'Watermelon', weight: 5, payouts: { 3: 5 } },
    { id: 7, name: 'Bell', weight: 5, payouts: { 3: 5 } },
  ],
  paylines: [
    [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }] 
  ],
  defaultBet: 10,
  betOptions: [5, 10, 25, 50, 100]
};