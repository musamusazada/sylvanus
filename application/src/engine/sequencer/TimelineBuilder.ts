import { EngineState } from '../state/EngineState';
import { GridModel } from '../models/GridModel';
import { SpinType, type IWinEvaluationResult, type PlayTimeline } from '../types';
import { SpinGenerator } from './generators/SpinGenerator';
import { CascadeGenerator } from './generators/CascadeGenerator';
import { snapshotGrid } from '../win/utils';

/**
 * TODO: write docs
 */
export class TimelineBuilder {
  private state: EngineState;
  private spinGenerator: SpinGenerator;
  private cascadeGenerator: CascadeGenerator;

  constructor(state: EngineState) {
    this.state = state;
    this.spinGenerator = new SpinGenerator();
    this.cascadeGenerator = new CascadeGenerator();
  }

  public build(grid: GridModel, wins: IWinEvaluationResult): PlayTimeline {
    const config = this.state.getConfig();

    switch (config.spinType) {
      case SpinType.SPIN:
        return this.spinGenerator.generate(grid, wins);
      case SpinType.CASCADE:
        return this.cascadeGenerator.generate(snapshotGrid(grid, config.gridDimensions.cols), wins);
      default:
        throw new Error(`Unknown spin type: ${config.spinType}`);
    }
  }
}