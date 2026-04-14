import type { PlayTimeline, TimelineCommandTypes } from '../../engine/types';
import type { IBootResponse } from '../../engine/types';
import type { SpinType } from '../../engine/types';
import type { IMachine } from '../renderer';

// --- Timeline Executor 

/**
 * An async function that handles a single timeline command payload.
 * @template T  The shape of the command payload
 */
export type CommandHandler<T = any> = (payload: T) => Promise<void>;

/**
 * Maps command types to their handlers.
 * Used by handler factories to declare which commands they handle.
 */
export type CommandHandlerMap = Partial<Record<TimelineCommandTypes, CommandHandler>>;

/**
 * Contract for the timeline execution system.
 * Accepts handler registrations and sequentially executes timeline batches,
 * running commands within each batch in parallel.
 */
export interface ITimelineExecutor {
  /** Register a handler for a specific command type */
  register<T>(type: TimelineCommandTypes, handler: CommandHandler<T>): void;
  /** Execute a full play timeline (batches in sequence, commands in parallel) */
  execute(timeline: PlayTimeline): Promise<void>;
}


// --- Game Context

/**
 * Keys for attachable game elements.
 */
export enum GameElement {
  MACHINE = 'machine',
}

/**
 * Map of existing game elements
 * Info: for new elements, need to define it here first and add appropriate attach handling in controller
 */
export interface GameElementMap {
  [GameElement.MACHINE]: IMachine;
}

/**
 * Game Elements context(registry)
 * Handlers use this context to access game elements
 */
export interface IGameContext {
  /** Attach a game element instance to the context */
  attach<K extends GameElement>(key: K, instance: GameElementMap[K]): void;
  /** Retrieve a game element by key (throws if not yet attached) */
  get<K extends GameElement>(key: K): GameElementMap[K];
}


// --- Game Controller

/**
 * High Level Game controller.
 * Bridges the engine, executor, and store(state).
 */
export interface IGameController {
  /** Boot the engine and sync initial state to the store(state) */
  initialize(): IBootResponse;
  /** Register the machine visual in the game context
   * Info: new elements require type setup and attach method in controller
   */
  attachMachine(machine: IMachine): void;
  /** Trigger a spin action*/
  spin(): Promise<void>;
  /** Update the bet amount on both engine and UI store */
  setBet(amount: number): void;
  /** Switch the spin mechanic mode */
  setMechanic(mode: SpinType): void;
}
