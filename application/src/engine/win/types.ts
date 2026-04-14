import type { GridModel } from '../models/GridModel';
import type { IGameConfig, IWinEvaluationResult } from '../types';

export interface IWinEvaluationContext {
  grid: GridModel;
  config: IGameConfig;
  bet: number;
  pickRandomSymbolId?: () => number;
}

export interface IWinEvaluatorStrategy<TContext extends IWinEvaluationContext = IWinEvaluationContext> {
  evaluate(context: TContext): IWinEvaluationResult;
}
