import { GridModel } from '../../models/GridModel';
import { TimelineCommandTypes, type IWinEvaluationResult, type PlayTimeline } from '../../types';

/**
 * TODO: write docs
 * Extract future common logics from Spin and Cascade ? 
 */
export class SpinGenerator {
  
  public generate(grid: GridModel, wins: IWinEvaluationResult): PlayTimeline {
    const timeline: PlayTimeline = [];

    // 1. Command the machine to start spinning
    timeline.push([
      { type: TimelineCommandTypes.SPIN_START }
    ]);

    // 2. Stop each reel in order
    // Each reel is stopped separately.
    // TODO: prolly need to add some generic handlers(effects ?) to handle e.g anticipation ?
    grid.reels.forEach((reel) => {
      timeline.push([
        { 
          type: TimelineCommandTypes.REEL_STOP, 
          payload: { 
            reelIndex: reel.index, 
            symbols: grid.extractReelSymbols(reel.index) 
          } 
        }
      ]);
    });

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