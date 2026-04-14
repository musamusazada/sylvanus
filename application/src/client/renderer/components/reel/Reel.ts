import { Container, Graphics } from 'pixi.js';
import { ReelStrip } from './ReelStrip';
import type { IMachineConfig } from '../../../../config/machineConfig';
import type { IReel } from './IReel';
import { defaultStripDependencies, type IReelStripView, type ReelStripDependencies } from './IReelStrip';


export class Reel extends Container implements IReel {
  private strip: IReelStripView;

  constructor(
    config: IMachineConfig,
    visibleRows: number,
    stripDependencies: ReelStripDependencies = defaultStripDependencies()
  ) {
    super();

    this.strip = new ReelStrip(config, visibleRows, stripDependencies);

    const symbolWidth = config.reel.symbolSize.width;
    const symbolHeight = config.reel.symbolSize.height;
    const spacing = config.reel.spacing;

    const maskHeight = visibleRows * symbolHeight + (visibleRows - 1) * spacing;

    const mask = new Graphics();
    mask.rect(0, 0, symbolWidth, maskHeight);
    mask.fill(0xffffff);

    this.addChild(this.strip);
    this.addChild(mask);
    this.mask = mask;
  }

  public randomizeSymbols(symbolPool: number[]): void {
    this.strip.randomizeSymbols(symbolPool);
  }

  public getStrip(): IReelStripView {
    return this.strip;
  }
}
