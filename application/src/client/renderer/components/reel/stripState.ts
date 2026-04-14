import { pickRandomSymbolId, type TRandomGenerator } from '../../utils/symbolRandom';

/**
 * Pure reel-column symbol ids: index 0 is top (including top buffer),
 * visible window starts at `bufferCount`.
 */
export class ReelStripState {
  readonly ids: number[];
  readonly visibleCount: number;
  readonly bufferCount: number;

  constructor(visibleCount: number, bufferCount: number) {
    const total = visibleCount + bufferCount * 2;
    this.visibleCount = visibleCount;
    this.bufferCount = bufferCount;
    this.ids = Array.from({ length: total }, () => -1);
  }

  /**
   * Shifts symbols down by one position and sets the new top symbol
   */
  shiftDown(newTopSymbolId: number): void {
    for (let i = this.ids.length - 1; i > 0; i--) {
      this.ids[i] = this.ids[i - 1]!;
    }
    this.ids[0] = newTopSymbolId;
  }

  /** Writes visible-row ids into the strip */
  setFinalVisible(symbolIds: number[]): void {
    for (let i = 0; i < this.visibleCount; i++) {
      const id = symbolIds[i];
      if (id !== undefined) {
        this.ids[i + this.bufferCount] = id;
      }
    }
  }

  // TODO: if init symbols are added, remove this
  randomizeAll(symbolPool: number[], random: TRandomGenerator): void {
    for (let i = 0; i < this.ids.length; i++) {
      this.ids[i] = pickRandomSymbolId(symbolPool, random);
    }
  }
}
