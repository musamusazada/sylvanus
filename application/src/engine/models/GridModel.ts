import { ReelModel } from './ReelModel';
import { VerticalReelLayout } from './layouts/VerticalReelLayout';
import type { IGridDimensions } from '../types';
import type { IReelLayout } from './layouts/types/IReelLayout';

/**
 * TODO: Write final docs 
 */
export class GridModel {
  public readonly reels: ReelModel[];
  private readonly layout: IReelLayout;

  constructor(dimensions: IGridDimensions, layout: IReelLayout = new VerticalReelLayout()) {
    this.layout = layout;
    this.reels = layout.buildReels(dimensions);
  }

  /**
   * Set the symbol at the given column and row.
   */
  public setSymbolAt(col: number, row: number, symbolId: number): void {
    const cell = this.layout.getCell(this.reels, col, row);
    if (cell) cell.symbolId = symbolId;
  }

  /**
   * Get the symbol at the given column and row.
   * Returns -1 if out of bounds
   */
  public getSymbolAt(col: number, row: number): number {
    return this.layout.getCell(this.reels, col, row)?.symbolId ?? -1;
  }

  /**
   * Extract all symbol IDs for a given reel index
   */
  public extractReelSymbols(reelIndex: number): number[] {
    return this.reels[reelIndex]?.cells.map(cell => cell.symbolId) ?? [];
  }
}