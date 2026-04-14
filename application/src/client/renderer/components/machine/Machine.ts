import gsap from 'gsap';
import { Container, type DestroyOptions } from 'pixi.js';
import type { IMachineConfig } from '../../../../config/machineConfig';
import type {
  CascadeMoveDirectivePayload,
  CascadeSpawnDirectivePayload,
  GridPositionPayload
} from '../../../../engine/types';
import type { IReelView } from '../reel/IReel';
import type { IGridDimensions, IMachineSpin, IMachineView } from './IMachine';
import { createDefaultMachineDeps, type PartialMachineDeps } from './MachineDeps';
import { fadeOutRemovedSymbols, fillSymbolsFromTop } from '../../animations/cascadeAnimations';

export class Machine extends Container implements IMachineView {
  private reels: IReelView[] = [];
  private readonly config: IMachineConfig;
  private readonly spin: IMachineSpin;
  private readonly symbolPool: number[];

  constructor(
    config: IMachineConfig,
    gridDimensions: IGridDimensions,
    deps?: PartialMachineDeps
  ) {
    super();
    this.config = config;
    this.symbolPool = Object.keys(config.symbolTextures).map(Number);

    const defaults = createDefaultMachineDeps(config, gridDimensions);
    this.spin = deps?.spin ?? defaults.spin;
    const createReel = deps?.createReel ?? defaults.createReel;
    const layoutColumn = deps?.layoutColumn ?? defaults.layoutColumn;

    this.buildReels(gridDimensions.cols, createReel, layoutColumn);
  }

  private buildReels(
    cols: number,
    createReel: (colIndex: number) => IReelView,
    layoutColumn: (reel: IReelView, colIndex: number) => void
  ): void {
    for (let i = 0; i < cols; i++) {
      const reel = createReel(i);
      layoutColumn(reel, i);
      // TODO: init config ?
      reel.randomizeSymbols(this.symbolPool);
      this.reels.push(reel);
      this.addChild(reel);
    }
  }

  public async startSpin(): Promise<void> {
    await this.spin.startAll(this.reels, this.symbolPool);
  }

  public async stopReel(index: number, symbols: number[]): Promise<void> {
    const reel = this.reels[index];
    if (!reel) {
      if (import.meta.env.DEV) {
        console.warn(`[Machine] stopReel: invalid reel index ${index}`);
      }
      return;
    }
    await this.spin.stopReel(reel, symbols, this.symbolPool);
  }

  public async dropSymbols(removedPositions: GridPositionPayload[]): Promise<void> {
    await fadeOutRemovedSymbols(
      this.reels,
      removedPositions,
      this.config.animations.cascade.fadeRemovedDuration
    );
  }

  public async fillSymbols(
    moves: CascadeMoveDirectivePayload[],
    spawns: CascadeSpawnDirectivePayload[],
    resultingGrid: number[][]
  ): Promise<void> {
    await fillSymbolsFromTop(
      this.reels,
      moves,
      spawns,
      resultingGrid,
      this.config.animations.cascade.fillStepDuration
    );
  }

  public override destroy(options?: DestroyOptions): void {
    for (const reel of this.reels) {
      gsap.killTweensOf(reel.getStrip());
    }
    super.destroy(options);
  }
}
