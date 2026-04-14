import type { ICascadeStepWin, IGridPosition, IWinEvaluationResult } from '../../types';
import type { IWinEvaluationContext, IWinEvaluatorStrategy } from '../types';
import { buildSymbolLookup, getPayoutMultiplier, snapshotGrid } from '../utils';

/**
 * Win evaluator for cascade mode: symbols that appear at least three times
 * anywhere on the grid pay as a group; those cells are cleared, new random symbols are spawned
 *
 * Repeats in steps until no symbol has three or more instances
 * 
 * Each step is increasing the multiplier by 1
 */
export class CascadeEvaluator implements IWinEvaluatorStrategy {

  public evaluate(context: IWinEvaluationContext): IWinEvaluationResult {
    const { config, bet, pickRandomSymbolId } = context;
    if (!pickRandomSymbolId) {
      throw new Error('Cascade evaluator requires pickRandomSymbolId in context');
    }
    const { cols, rows } = config.gridDimensions;
    const symbolLookup = buildSymbolLookup(config.symbols);
    const workingGrid = snapshotGrid(context.grid, cols);
    const cascadeSteps: ICascadeStepWin[] = [];

    let totalWin = 0;
    let stepIndex = 0;

    while (true) {
      const symbolPositions = this.collectSymbolPositions(workingGrid, cols, rows);
      const winningSymbols = [...symbolPositions.entries()].filter(([, positions]) => positions.length >= 3);
      if (winningSymbols.length === 0) break;

      const symbolWins = winningSymbols.map(([symbolId, positions]) => {
        const payoutMultiplier = getPayoutMultiplier(symbolLookup.get(symbolId), positions.length);
        const baseWin = payoutMultiplier * bet;
        return {
          symbolId,
          matchCount: positions.length,
          payoutMultiplier,
          baseWin,
        };
      });

      const removedPositions = winningSymbols.flatMap(([, positions]) => positions);
      const matchedSymbolIds = winningSymbols.map(([symbolId]) => symbolId);
      const stepBaseWin = symbolWins.reduce((sum, win) => sum + win.baseWin, 0);
      const multiplier = stepIndex + 1;
      const stepWin = stepBaseWin * multiplier;
      totalWin += stepWin;

      const gridAfterDrop = this.buildGridAfterDrop(workingGrid, removedPositions);
      const { moves, spawns } = this.applyCascadeDrop(
        workingGrid,
        removedPositions,
        rows,
        pickRandomSymbolId
      );

      cascadeSteps.push({
        stepIndex,
        multiplier,
        removedPositions,
        matchedSymbolIds,
        symbolWins,
        moves,
        spawns,
        stepBaseWin,
        stepWin,
        totalWinAfterStep: totalWin,
        gridAfterDrop,
        resultingGrid: workingGrid.map((column) => [...column]),
      });

      stepIndex += 1;
    }

    return {
      totalWin,
      spinWins: [],
      cascadeSteps,
      finalGrid: workingGrid.map((column) => [...column]),
    };
  }

  private collectSymbolPositions(
    grid: number[][],
    cols: number,
    rows: number
  ): Map<number, IGridPosition[]> {
    const symbols = new Map<number, IGridPosition[]>();

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const symbolId = grid[col]?.[row];
        if (symbolId === undefined || symbolId < 0) continue;

        const positions = symbols.get(symbolId) ?? [];
        positions.push({ col, row });
        symbols.set(symbolId, positions);
      }
    }

    return symbols;
  }

  private applyCascadeDrop(
    grid: number[][],
    removedPositions: IGridPosition[],
    rows: number,
    pickRandomSymbolId: () => number
  ): { moves: ICascadeStepWin['moves']; spawns: ICascadeStepWin['spawns'] } {
    const removedByColumn = new Map<number, Set<number>>();
    const moves: ICascadeStepWin['moves'] = [];
    const spawns: ICascadeStepWin['spawns'] = [];

    removedPositions.forEach(({ col, row }) => {
      const removedRows = removedByColumn.get(col) ?? new Set<number>();
      removedRows.add(row);
      removedByColumn.set(col, removedRows);
    });

    for (let col = 0; col < grid.length; col++) {
      const removedRows = removedByColumn.get(col) ?? new Set<number>();
      const previousColumn = grid[col] ?? [];
      const survivors: Array<{ symbolId: number; fromRow: number }> = [];

      for (let row = 0; row < rows; row++) {
        if (!removedRows.has(row)) {
          const symbolId = previousColumn[row];
          if (symbolId === undefined) continue;
          survivors.push({ symbolId, fromRow: row });
        }
      }

      const nextColumn = [...Array(rows)].map(() => -1);
      let writeRow = rows - 1;

      for (let survivorIndex = survivors.length - 1; survivorIndex >= 0; survivorIndex--) {
        const survivor = survivors[survivorIndex];
        nextColumn[writeRow] = survivor.symbolId;
        if (survivor.fromRow !== writeRow) {
          moves.push({
            symbolId: survivor.symbolId,
            from: { col, row: survivor.fromRow },
            to: { col, row: writeRow },
          });
        }
        writeRow -= 1;
      }

      let spawnOffset = 1;
      while (writeRow >= 0) {
        const symbolId = pickRandomSymbolId();
        nextColumn[writeRow] = symbolId;
        spawns.push({
          symbolId,
          to: { col, row: writeRow },
          fromRowAbove: -spawnOffset,
        });
        spawnOffset += 1;
        writeRow -= 1;
      }

      grid[col] = nextColumn;
    }

    return { moves, spawns };
  }

  private buildGridAfterDrop(grid: number[][], removedPositions: IGridPosition[]): number[][] {
    const droppedGrid = grid.map((column) => [...column]);
    removedPositions.forEach(({ col, row }) => {
      if (!droppedGrid[col]) return;
      droppedGrid[col][row] = -1;
    });
    return droppedGrid;
  }
}
