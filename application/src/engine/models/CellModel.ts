/**
 * Represents a single cell in the grid
 * @param col - The column index of the cell
 * @param row - The row index of the cell
 * @param symbolId - ID of symbol in the cell.
 */
export class CellModel {
  public readonly col: number;
  public readonly row: number;
  public symbolId: number;

  constructor(col: number, row: number, symbolId: number = -1) {
    this.col = col;
    this.row = row;
    this.symbolId = symbolId;
  }
}