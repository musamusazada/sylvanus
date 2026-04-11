import { EngineState } from '../state/EngineState';
import { GridModel } from '../models/GridModel';
import { SpinType, type PlayTimeline } from '../types';
import { SpinGenerator } from './generators/SpinGenerator';

/**
 * TODO: write docs
 */
export class TimelineBuilder {
  private state: EngineState;
  private spinGenerator: SpinGenerator;

  constructor(state: EngineState) {
    this.state = state;
    this.spinGenerator = new SpinGenerator();
  }

  public build(grid: GridModel): PlayTimeline {
    const spinType = this.state.getConfig().spinType;

    switch (spinType) {
      case SpinType.SPIN:
        return this.spinGenerator.generate(grid);
      default:
        throw new Error(`Unknown spin type: ${spinType}`);
    }
  }
}