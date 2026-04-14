import { SpinType, type IGameConfig } from '../types';
import type { IWinEvaluatorStrategy } from './types';
import { SpinPaylineEvaluator } from './strategies/SpinPaylineEvaluator';
import { CascadeEvaluator } from './strategies/CascadeEvaluator';

/**
 * Stores available win evaluators for different spin types.
 */
export class WinEvaluatorFactory {
  private spinEvaluator: SpinPaylineEvaluator;
  private cascadeEvaluator: CascadeEvaluator;

  constructor() {
    this.spinEvaluator = new SpinPaylineEvaluator();
    this.cascadeEvaluator = new CascadeEvaluator();
  }

  public get(config: IGameConfig): IWinEvaluatorStrategy {
    switch (config.spinType) {
      case SpinType.SPIN:
        return this.spinEvaluator;
      case SpinType.CASCADE:
        return this.cascadeEvaluator;
      default:
        throw new Error(`Unsupported spin type: ${config.spinType}`);
    }
  }
}
