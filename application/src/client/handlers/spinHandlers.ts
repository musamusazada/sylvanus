import {
  TimelineCommandTypes,
  type AnticipatePayload,
  type DropSymbolsPayload,
  type FillSymbolsPayload,
  type UpdateMultiplierPayload,
  type WinResultPayload
} from '../../engine/types';
import type { IMachineConfig } from '../../config/machineConfig';
import { GameElement, type CommandHandlerMap, type IGameContext } from '../core/types';
import type { IWinControllerTimelineActions } from '../core/win/WinController';
import { waitFor } from '../renderer/utils/GsapUtils';

export function createSpinHandlers(
  ctx: IGameContext,
  winController: IWinControllerTimelineActions,
  machineConfig: IMachineConfig
): CommandHandlerMap {
  const cascadeTiming = machineConfig.animations.cascade;

  return {
    [TimelineCommandTypes.SPIN_START]: async () => {
      winController.clearWinState();
      await ctx.get(GameElement.MACHINE).startSpin();
    },

    [TimelineCommandTypes.REEL_STOP]: async (payload: { reelIndex: number; symbols: number[] }) =>
      ctx.get(GameElement.MACHINE).stopReel(payload.reelIndex, payload.symbols),

    [TimelineCommandTypes.ANTICIPATE]: async (payload: AnticipatePayload) =>
      ctx.get(GameElement.MACHINE).anticipateReel(payload.reelIndex),

    [TimelineCommandTypes.DROP_SYMBOLS]: async (payload: DropSymbolsPayload) => {
      await ctx.get(GameElement.MACHINE).dropSymbols(payload.removedPositions);
      await waitFor(cascadeTiming.pauseAfterDrop);
    },

    [TimelineCommandTypes.FILL_SYMBOLS]: async (payload: FillSymbolsPayload) => {
      await ctx.get(GameElement.MACHINE).fillSymbols(payload.moves, payload.spawns, payload.resultingGrid);
      await waitFor(cascadeTiming.pauseAfterFill);
    },

    [TimelineCommandTypes.UPDATE_MULTIPLIER]: async (payload: UpdateMultiplierPayload) =>
      winController.updateCascadeProgress(payload),
    
    [TimelineCommandTypes.WIN_RESULT]: async (payload: WinResultPayload) =>
      winController.saveWinState(payload),
  };
}

