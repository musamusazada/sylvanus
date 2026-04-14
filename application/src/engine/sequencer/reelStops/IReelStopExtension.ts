import type { TimelineBatch } from '../../types';

/**
 * Context after a reel has been stopped in the left-to-right sequence.
 */
export interface AfterReelStopContext {
  reelIndex: number;
  symbols: number[];
  colCount: number;
  /** True while there is still at least one more reel that will receive REEL_STOP */
  hasMoreReels: boolean;
}

/**
 * ReelStop extensions
 * higher priority is executed first, kind of bad design (TODO: fix priority system)
 */
export interface IReelStopExtension {
  readonly priority?: number;
  afterReelStop(ctx: AfterReelStopContext): TimelineBatch[];
}
