import { TimelineCommandTypes, type IWinEvaluationResult, type PlayTimeline } from '../../types';

/**
 * TODO: write docs
 */
export class CascadeGenerator {
  public generate(initialGrid: number[][], wins: IWinEvaluationResult): PlayTimeline {
    const timeline: PlayTimeline = [];

    timeline.push([{ type: TimelineCommandTypes.SPIN_START }]);
    this.pushReelStops(timeline, initialGrid);

    wins.cascadeSteps.forEach((step) => {
      timeline.push([
        {
          type: TimelineCommandTypes.DROP_SYMBOLS,
          payload: {
            stepIndex: step.stepIndex,
            matchedSymbolIds: step.matchedSymbolIds,
            removedPositions: step.removedPositions,
            gridAfterDrop: step.gridAfterDrop,
          },
        }
      ]);

      timeline.push([
        {
          type: TimelineCommandTypes.FILL_SYMBOLS,
          payload: {
            stepIndex: step.stepIndex,
            moves: step.moves,
            spawns: step.spawns,
            resultingGrid: step.resultingGrid,
          },
        }
      ]);

      timeline.push([
        {
          type: TimelineCommandTypes.UPDATE_MULTIPLIER,
          payload: {
            stepIndex: step.stepIndex,
            multiplier: step.multiplier,
            stepWin: step.stepWin,
            totalWinAfterStep: step.totalWinAfterStep,
          },
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

  private pushReelStops(timeline: PlayTimeline, grid: number[][]): void {
    grid.forEach((symbols, reelIndex) => {
      timeline.push([
        {
          type: TimelineCommandTypes.REEL_STOP,
          payload: { reelIndex, symbols: [...symbols] },
        }
      ]);
    });
  }
}
