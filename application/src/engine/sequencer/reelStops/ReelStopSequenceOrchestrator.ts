import { TimelineCommandTypes, type PlayTimeline } from '../../types';
import type { IReelStopExtension } from './IReelStopExtension';

/**
 * Creates REEL_STOP for each column left-to-right, then runs reel-stop extensions
 */
export function appendReelStopSequence(
  timeline: PlayTimeline,
  symbolsPerReel: number[][],
  extensions: IReelStopExtension[]
): void {
  const colCount = symbolsPerReel.length;
  const sorted = [...extensions].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  for (let r = 0; r < colCount; r++) {
    const symbols = symbolsPerReel[r] ?? [];
    timeline.push([
      {
        type: TimelineCommandTypes.REEL_STOP,
        payload: { reelIndex: r, symbols: [...symbols] },
      },
    ]);

    const ctx = {
      reelIndex: r,
      symbols,
      colCount,
      hasMoreReels: r < colCount - 1,
    };

    for (const ext of sorted) {
      const batches = ext.afterReelStop(ctx);
      for (const batch of batches) {
        timeline.push(batch);
      }
    }
  }
}
