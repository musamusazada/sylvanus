import { SlotEngine } from '../../engine';
import { type IBootResponse, SpinType } from '../../engine/types';
import { registerAllHandlers } from '../handlers';
import { useGameStore, GamePhase } from '../store/gameStore';
import { GameContext } from './GameContext';
import { GameElement, type IGameController, type ITimelineExecutor } from './types';
import type { IMachine } from '../renderer';

/**
 * Orchestrates the game:
 * - Initializes the engine
 * - Wires the GameContext with game elements
 * - Registers handlers to run engine timeline commands
 *
 * All gameplay interactions (spin, bet, mechanic) go through this controller.
 */
export class GameController implements IGameController {
  private engine: SlotEngine;
  private gameContext: GameContext;
  private executor: ITimelineExecutor;

  constructor(engine: SlotEngine, executor: ITimelineExecutor) {
    this.engine = engine;
    this.executor = executor;
    this.gameContext = new GameContext();

    registerAllHandlers(this.executor, this.gameContext);
  }

  public initialize(): IBootResponse {
    const bootData = this.engine.boot();
    this.syncStore();
    useGameStore.setState({
      mechanic: bootData.config.spinType,
      betOptions: bootData.config.betOptions,
    });
    return bootData;
  }

  public attachMachine(machine: IMachine): void {
    this.gameContext.attach(GameElement.MACHINE, machine);
  }

  public async spin(): Promise<void> {
    if (useGameStore.getState().phase !== GamePhase.IDLE) return;

    useGameStore.setState({ phase: GamePhase.SPINNING });
    const result = this.engine.play();
    if (!result.success) {
      // TODO: fix engine response
      //@ts-ignore
      useGameStore.setState({ phase: GamePhase.IDLE, error: result.error });
      return;
    }

    this.syncStore();
    await this.executor.execute(result.timeline);
    useGameStore.setState({ phase: GamePhase.IDLE, error: null });
  }

  public setBet(amount: number): void {
    this.engine.setBet(amount);
    this.syncStore();
  }

  public setMechanic(mode: SpinType): void {
    this.engine.toggleMechanic(mode);
    useGameStore.setState({ mechanic: mode });
  }

  /**
   * Syncs client store with engine state
   */
  private syncStore(): void {
    const snapshot = this.engine.getStateSnapshot();
    useGameStore.setState({ balance: snapshot.balance, bet: snapshot.bet });
  }
}

