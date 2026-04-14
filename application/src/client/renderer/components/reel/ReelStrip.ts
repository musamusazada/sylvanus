import { Container } from 'pixi.js';
import { SymbolView } from '../symbol/SymbolView';
import type { IMachineConfig } from '../../../../config/machineConfig';
import type { IReelStrip } from './IReelStrip';
import { ReelStripState } from './stripState';
import type { ReelStripDependencies } from './IReelStrip';


export class ReelStrip extends Container implements IReelStrip {
  private readonly views: SymbolView[] = [];
  private readonly state: ReelStripState;
  private symbolHeight: number;
  private spacing: number;
  public readonly visibleCount: number;
  public readonly bufferCount: number;

  constructor(
    config: IMachineConfig,
    visibleCount: number,
    private readonly deps: ReelStripDependencies
  ) {
    super();
    this.visibleCount = visibleCount;
    this.bufferCount = config.reel.bufferSymbols;
    this.symbolHeight = config.reel.symbolSize.height;
    this.spacing = config.reel.spacing;
    this.state = new ReelStripState(visibleCount, this.bufferCount);

    const totalCount = visibleCount + this.bufferCount * 2;
    const symbolWidth = config.reel.symbolSize.width;

    for (let i = 0; i < totalCount; i++) {
      const sym = new SymbolView(symbolWidth, this.symbolHeight, deps.getSymbolTexture);
      sym.y = (i - this.bufferCount) * (this.symbolHeight + this.spacing) + this.symbolHeight / 2;
      sym.x = symbolWidth / 2;
      this.views.push(sym);
      this.addChild(sym);
    }

    this.syncViewsFromState();
  }

  /**
   * Sets the final symbols in the strip
   */
  public setFinalSymbols(symbolIds: number[]): void {
    this.state.setFinalVisible(symbolIds);
    this.syncViewsFromState();
  }

  /**
   * Randomizes all symbols in the strip
   */
  public randomizeSymbols(symbolPool: number[]): void {
    this.state.randomizeAll(symbolPool, this.deps.random);
    this.syncViewsFromState();
  }

  /**
   * Shifts symbols down by one position
   */
  public shiftSymbolsDown(newTopSymbolId: number): void {
    this.state.shiftDown(newTopSymbolId);
    this.syncViewsFromState();
  }

  /**
   * Syncs views with the state
   */
  private syncViewsFromState(): void {
    for (let i = 0; i < this.views.length; i++) {
      this.views[i].setSymbol(this.state.ids[i]);
    }
  }
}
