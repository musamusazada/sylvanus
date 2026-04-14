import { GridModel } from '../../models/GridModel';
import { TimelineCommandTypes, type IGameConfig, type IWinEvaluationResult, type PlayTimeline } from '../../types';
import { appendReelStopSequence, createReelStopExtensions } from '../reelStops';

/**
 * TODO: write docs
 * Extract future common logics from Spin and Cascade ? 
 */
export class SpinGenerator {
  
  public generate(grid: GridModel, wins: IWinEvaluationResult, config: IGameConfig): PlayTimeline {
    const timeline: PlayTimeline = [];

    // 1. Command the machine to start spinning
    timeline.push([
      { type: TimelineCommandTypes.SPIN_START }
    ]);

    const symbolsPerReel = grid.reels.map((reel) => grid.extractReelSymbols(reel.index));
    appendReelStopSequence(timeline, symbolsPerReel, createReelStopExtensions(config));

    timeline.push([
      {
        type: TimelineCommandTypes.WIN_RESULT,
        payload: {
          totalWin: wins.totalWin,
          spinWinsCount: wins.spinWins.length,
          cascadeStepsCount: wins.cascadeSteps.length,
        },
      }
    ]);

    return timeline;
  }
}