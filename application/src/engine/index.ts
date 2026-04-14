import type { IGameConfig, SpinType, PlayResult, IBootResponse } from './types';
import { EngineState } from './state/EngineState';
import { RngService } from './math/RngService';
import { TimelineBuilder } from './sequencer/TimelineBuilder';
import { WinEvaluatorFactory } from './win/WinEvaluatorFactory';

/**
 * TODO: Write docs
 */
export class SlotEngine {
  private state: EngineState;
  private rng: RngService;
  private sequencer: TimelineBuilder;
  private winEvaluatorFactory: WinEvaluatorFactory;

  constructor(initialConfig: IGameConfig) {
    this.state = new EngineState(initialConfig);

    // Setup services
    this.rng = new RngService(this.state);
    this.sequencer = new TimelineBuilder(this.state);
    this.winEvaluatorFactory = new WinEvaluatorFactory();
  }

  public boot(): IBootResponse {
    return {
      state: this.state.getCurrentSnapshot(),
      config: {
        gridDimensions: this.state.getConfig().gridDimensions,
        symbols: this.state.getConfig().symbols,
        spinType: this.state.getConfig().spinType,
        betOptions: this.state.getConfig().betOptions,
      },
    };
  }

  // TODO: TEMP API

  public toggleMechanic(mode: SpinType): void {
    this.state.updateSpinType(mode);
  }

  public setBet(amount: number): void {
    this.state.setBet(amount);
  }

  public getStateSnapshot() {
    return this.state.getCurrentSnapshot();
  }

  // TODO: clean up

  public play(): PlayResult {
    // Validate if play can be made
    const snapshot = this.state.getCurrentSnapshot();
    if (snapshot.balance < snapshot.bet) {
      // TODO: add response messages enum
      return { success: false, error: 'INSUFFICIENT_FUNDS' };
    }

    // 1. Charge the bet amount
    this.state.deductBet();

    // 2. Generate the final grid
    const finalGrid = this.rng.generateGrid();

    // 3. Evaluate wins based on selected spin mode
    const config = this.state.getConfig();
    const evaluator = this.winEvaluatorFactory.get(config);
    const wins = evaluator.evaluate({
      grid: finalGrid,
      config,
      bet: snapshot.bet,
      pickRandomSymbolId: () => this.rng.getRandomSymbolId(),
    });
    this.state.applyWin(wins.totalWin);

    // 4. Create timeline
    const timeline = this.sequencer.build(finalGrid, wins);

    // 5. Return generated response. 
    // TODO: Save the transactions in engine state ?
    return {
      success: true,
      // TODO: move the id gen
      transactionId: `play_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      state: {
        initial: this.state.getPreviousSnapshot(),
        final: this.state.getCurrentSnapshot()
      },
      timeline: timeline,
      wins,
    };
  }
}

export * from './types';