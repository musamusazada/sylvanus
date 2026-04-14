import { TimelineCommandTypes } from '../../engine/types';
import { GameElement, type CommandHandlerMap, type IGameContext } from '../core/types';

export function createSpinHandlers(ctx: IGameContext): CommandHandlerMap {
  return {
    [TimelineCommandTypes.SPIN_START]: async () => ctx.get(GameElement.MACHINE).startSpin(),
    [TimelineCommandTypes.DELAY]: async (payload: { duration: number }) => {
      await new Promise(resolve => setTimeout(resolve, payload.duration));
    },
    [TimelineCommandTypes.REEL_STOP]: async (payload: { reelIndex: number; symbols: number[] }) =>
      ctx.get(GameElement.MACHINE).stopReel(payload.reelIndex, payload.symbols),
  };
}

