import { TimelineCommandTypes } from '../../engine/types';
import type { IMachineConfig } from '../../config/machineConfig';
import { type ITimelineExecutor, type IGameContext, type CommandHandlerMap } from '../core/types';
import { createSpinHandlers } from './spinHandlers';
import type { IWinControllerTimelineActions } from '../core/win/WinController';

export function registerAllHandlers(
  executor: ITimelineExecutor,
  ctx: IGameContext,
  winController: IWinControllerTimelineActions,
  machineConfig: IMachineConfig
): void {
  [createSpinHandlers]
    .forEach(factory => {
      const handlers: CommandHandlerMap = factory(ctx, winController, machineConfig);
      Object.entries(handlers).forEach(([type, handler]) => {
        executor.register(type as TimelineCommandTypes, handler);
      });
    });
}

