import { Application } from 'pixi.js';
import type { IMachineConfig } from '../../../config/machineConfig';
import { AssetLoader, Machine, type IGridDimensions } from '../../renderer';

export interface MountMachineParams {
  machineConfig: IMachineConfig;
  gridDimensions: IGridDimensions;
}

/** Center machine in Pixi.Application stage */
export function centerMachineInStage(machine: Machine, app: Application): void {
  machine.x = (app.screen.width - machine.width) / 2;
  machine.y = (app.screen.height - machine.height) / 2;
}

/**
 * Loads machine symbols, builds the Machine, centers it, and adds it to Pixi.Application stage
 */
export async function mountMachineOnStage(
  app: Application,
  params: MountMachineParams,
): Promise<Machine> {
  const { machineConfig, gridDimensions } = params;
  let machine: Machine | undefined;

  try {
    await AssetLoader.load(machineConfig.symbolTextures);
    machine = new Machine(machineConfig, gridDimensions);
    centerMachineInStage(machine, app);
    app.stage.addChild(machine);
    return machine;
  } catch (err) {
    if (machine) {
      machine.destroy({ children: true });
    }
    throw err;
  }
}
