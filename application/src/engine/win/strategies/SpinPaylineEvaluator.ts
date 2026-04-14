import type { ISpinPaylineWin, IWinEvaluationResult } from '../../types';
import type { IWinEvaluatorStrategy, IWinEvaluationContext } from '../types';
import { buildSymbolLookup, getPayoutMultiplier, snapshotGrid } from '../utils';

/**
 * Win evaluator for normal spin mode: each configured payline is scored as a
 * left-to-right combination of same symbols
 * 
 * The anchor symbol is taken from the first position; matching continues along the
 * line until a different symbol appears or the line ends.
 *
 * Result: `spinWins` per winning line, `cascadeSteps` empty, `finalGrid` a snapshot
 * of the evaluated grid.
 */
export class SpinPaylineEvaluator implements IWinEvaluatorStrategy {
  /**
   * Evaluates all paylines on the current grid and sums wins (payline payout mult × bet).
   */
  public evaluate(context: IWinEvaluationContext): IWinEvaluationResult {
    const { grid, config, bet } = context;
    const symbolLookup = buildSymbolLookup(config.symbols);
    const spinWins: ISpinPaylineWin[] = [];

    config.paylines.forEach((line, paylineIndex) => {
      if (line.length === 0) return;

      const firstPosition = line[0];
      const firstSymbolId = grid.getSymbolAt(firstPosition.col, firstPosition.row);
      if (firstSymbolId === -1) return;

      let matchCount = 1;
      for (let i = 1; i < line.length; i++) {
        const position = line[i];
        if (grid.getSymbolAt(position.col, position.row) === firstSymbolId) {
          matchCount += 1;
          continue;
        }
        break;
      }

      const payoutMultiplier = getPayoutMultiplier(symbolLookup.get(firstSymbolId), matchCount);
      if (payoutMultiplier <= 0) return;

      spinWins.push({
        paylineIndex,
        symbolId: firstSymbolId,
        matchCount,
        payoutMultiplier,
        winAmount: payoutMultiplier * bet,
        positions: line.slice(0, matchCount).map(({ col, row }) => ({ col, row })),
      });
    });

    const totalWin = spinWins.reduce((sum, win) => sum + win.winAmount, 0);

    return {
      totalWin,
      spinWins,
      cascadeSteps: [],
      finalGrid: snapshotGrid(grid, config.gridDimensions.cols),
    };
  }
}
