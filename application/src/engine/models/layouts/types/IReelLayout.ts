import type { IGridDimensions } from '../../../types';
import type { ReelModel } from '../../ReelModel';
import type { CellModel } from '../../CellModel';

/**
 * Interface for reel layout strategies for 2D grids.
 */
export interface IReelLayout {
  /**
   * Build the full set of reels for a given grid dimension.
  */
  buildReels(dimensions: IGridDimensions): ReelModel[];

  /**
   * Get the cell at the given column and row.
  */
  getCell(reels: ReelModel[], col: number, row: number): CellModel | undefined;
}
