import type { IGameConfig, SpinType, IPlayResponse } from './types';
import { EngineState } from './state/EngineState';
import { RngService } from './math/RngService';
import { TimelineBuilder } from './sequencer/TimelineBuilder';

/**
 * TODO: Write docs
 */
export class SlotEngine {
  private state: EngineState;
  private rng: RngService;
  private sequencer: TimelineBuilder;

  constructor(initialConfig: IGameConfig) {
    this.state = new EngineState(initialConfig);

    // Setup services
    this.rng = new RngService(this.state);
    this.sequencer = new TimelineBuilder(this.state);
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

  public play(): IPlayResponse {
    // 1. Charge the bet amount
    this.state.deductBet();

    // 2. Generate the final grid
    const finalGrid = this.rng.generateGrid();

    // 3. TODO: Win Eval

    // 4. Create timeline
    const timeline = this.sequencer.build(finalGrid);

    // 5. Return generated response. 
    // TODO: Save the transactions in engine state ?
    return {
      // TODO: move the id gen
      transactionId: `play_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      state: {
        initial: this.state.getPreviousSnapshot(),
        final: this.state.getCurrentSnapshot()
      },
      timeline: timeline
    };
  }
}

export * from './types';