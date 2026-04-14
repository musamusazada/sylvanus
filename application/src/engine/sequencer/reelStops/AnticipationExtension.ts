import { TimelineCommandTypes, type TimelineBatch } from '../../types';
import type { AfterReelStopContext, IReelStopExtension } from './IReelStopExtension';

/**
 * When the "bonus" symbol appears on at least two consecutive reels from the left (any cell),
 * emits ANTICIPATE for the next reel index. Chain is reset if reel doesnt contain the "bonus" symbol
 */
export class AnticipationExtension implements IReelStopExtension {
  public readonly priority = 0;

  private chainLength = 0;

  constructor(private readonly symbolId: number) {}

  public afterReelStop(ctx: AfterReelStopContext): TimelineBatch[] {
    if (ctx.symbols.includes(this.symbolId)) {
      this.chainLength += 1;
    } else {
      this.chainLength = 0;
    }

    if (!ctx.hasMoreReels || this.chainLength < 2) {
      return [];
    }

    return [
      [
        {
          type: TimelineCommandTypes.ANTICIPATE,
          payload: { reelIndex: ctx.reelIndex + 1 },
        },
      ],
    ];
  }
}
