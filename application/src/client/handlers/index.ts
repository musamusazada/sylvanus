import { TimelineCommandTypes } from '../../engine/types';
import { type ITimelineExecutor, type IGameContext, type CommandHandlerMap } from '../core/types';
import { createSpinHandlers } from './spinHandlers';

export function registerAllHandlers(executor: ITimelineExecutor, ctx: IGameContext): void {
  [createSpinHandlers]
    .forEach(factory => {
      const handlers: CommandHandlerMap = factory(ctx);
      Object.entries(handlers).forEach(([type, handler]) => {
        executor.register(type as TimelineCommandTypes, handler);
      });
    });
}

