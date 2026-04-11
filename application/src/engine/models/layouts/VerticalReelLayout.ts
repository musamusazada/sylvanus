import type { IGridDimensions } from '../../types';
import { ReelModel } from '../ReelModel';
import { CellModel } from '../CellModel';
import type { IReelLayout } from './types/IReelLayout';

/**
 * Vertically (L->R) positioned Reels Layout builder
 */
export class VerticalReelLayout implements IReelLayout {
  /**
   * Build the reels for the given dimensions
   * @param dimensions - The dimensions of the grid
   * @returns Array of ReelModel instances
   */
  buildReels(dimensions: IGridDimensions): ReelModel[] {
    return [...Array(dimensions.cols).keys()]
      .map(col => new ReelModel(col, dimensions.rows, (row) => new CellModel(col, row)));
  }

  getCell(reels: ReelModel[], col: number, row: number): CellModel | undefined {
    return reels[col]?.cells[row];
  }
}
