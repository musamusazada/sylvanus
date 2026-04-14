import type { IMachineConfig } from '../../../../config/machineConfig';
import { SpinController } from '../../controllers/SpinController';
import { Reel } from '../reel/Reel';
import type { IReelView } from '../reel/IReel';
import type { IMachineSpin } from './IMachine';
import type { IGridDimensions } from './IMachine';


export interface MachineDeps {
  spin: IMachineSpin;
  createReel: (colIndex: number) => IReelView;
  layoutColumn: (reel: IReelView, colIndex: number) => void;
}

/**
 * Default Machine dependencies:
 * - spin: controller to spin behaviors
 * - createReel: factory to create reels
 * - layoutColumn: function to layout reels in a column
 */
export function createDefaultMachineDeps(
  config: IMachineConfig,
  gridDimensions: IGridDimensions
): MachineDeps {
  return {
    spin: new SpinController(config),
    createReel: () => new Reel(config, gridDimensions.rows),
    layoutColumn: (reel, colIndex) => {
      reel.x = colIndex * (config.reel.symbolSize.width + config.reel.spacing);
    },
  };
}

export type PartialMachineDeps = Partial<MachineDeps>;
