import { CellModel } from './CellModel';

/**
 * TODO: Write docs
 * Generic, orientation-agnostic reel model.
 * Cells are handled by layout strategy callback.
 */
export class ReelModel {
  public readonly index: number;
  public cells: CellModel[];

  /**
   * @param index       Position of this reel within the grid
   * @example It would be column index for vertical layout and row index for horizontal layout
   * @param cellCount   Number of cells in the reel
   * @param positionCellInReel Function that receives cell's position in layout and creates CellModel in that position
   */
  constructor(index: number, cellCount: number, positionCellInReel: (cellIndex: number) => CellModel) {
    this.index = index;
    this.cells = [...Array(cellCount).keys()].map(positionCellInReel);
  }
}