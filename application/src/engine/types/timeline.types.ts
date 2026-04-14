export enum TimelineCommandTypes {
    SPIN_START = "SPIN_START",
    REEL_STOP = "REEL_STOP",
    ANTICIPATE = "ANTICIPATE",
    WIN_RESULT = "WIN_RESULT",
    DROP_SYMBOLS = "DROP_SYMBOLS",
    FILL_SYMBOLS = "FILL_SYMBOLS",
    UPDATE_MULTIPLIER = "UPDATE_MULTIPLIER",
}

/*
 * The generic command shape
 * Single Command consists of their type (name) and payload required for the command.
 */
export interface TimelineCommand<TType extends TimelineCommandTypes, TPayload = unknown> {
  type: TType;
  payload?: TPayload;
}

// Commands

// SPIN_START
/*
* Signals the start of spin
*/
export type CommandSpinStart = TimelineCommand<TimelineCommandTypes.SPIN_START, undefined>;

// REEL_STOP
/*
* Signals the stop of a reel
*/
export type CommandReelStop = TimelineCommand<TimelineCommandTypes.REEL_STOP, ReelStopPayload>;

/*
* Payload for REEL_STOP command
*/
export interface ReelStopPayload {
  reelIndex: number; // index of the reel to stop
  symbols: number[]; // final symbols for the reel
}

// ANTICIPATE
/*
 * Signals that the next reel to stop should play an anticipation effect.
 */
export type CommandAnticipate = TimelineCommand<TimelineCommandTypes.ANTICIPATE, AnticipatePayload>;

export interface AnticipatePayload {
  reelIndex: number;
}

// WIN_RESULT
/*
* Signals computed win result for the play.
*/
export type CommandWinResult = TimelineCommand<TimelineCommandTypes.WIN_RESULT, WinResultPayload>;

export interface WinResultPayload {
  totalWin: number;
  spinWinsCount: number;
  cascadeStepsCount: number;
}

// DROP_SYMBOLS
/*
* Signals symbols that should be hidden/removed for one cascade step.
*/
export type CommandDropSymbols = TimelineCommand<TimelineCommandTypes.DROP_SYMBOLS, DropSymbolsPayload>;

export interface GridPositionPayload {
  col: number;
  row: number;
}

export interface CascadeMoveDirectivePayload {
  symbolId: number;
  from: GridPositionPayload;
  to: GridPositionPayload;
}

export interface CascadeSpawnDirectivePayload {
  symbolId: number;
  to: GridPositionPayload;
  fromRowAbove: number;
}

export interface DropSymbolsPayload {
  stepIndex: number;
  removedPositions: GridPositionPayload[];
  matchedSymbolIds: number[];
  gridAfterDrop: number[][];
}

// FILL_SYMBOLS
/*
* Signals movement and spawn directives to refill the grid for one cascade step.
*/
export type CommandFillSymbols = TimelineCommand<TimelineCommandTypes.FILL_SYMBOLS, FillSymbolsPayload>;

export interface FillSymbolsPayload {
  stepIndex: number;
  moves: CascadeMoveDirectivePayload[];
  spawns: CascadeSpawnDirectivePayload[];
  resultingGrid: number[][];
}

// UPDATE_MULTIPLIER
/*
* Signals multiplier update after a cascade step is resolved.
*/
export type CommandUpdateMultiplier = TimelineCommand<TimelineCommandTypes.UPDATE_MULTIPLIER, UpdateMultiplierPayload>;

export interface UpdateMultiplierPayload {
  stepIndex: number;
  multiplier: number;
  stepWin: number;
  totalWinAfterStep: number;
}

// All Valid commands for timeline
export type ValidCommands =
  | CommandSpinStart
  | CommandReelStop
  | CommandAnticipate
  | CommandWinResult
  | CommandDropSymbols
  | CommandFillSymbols
  | CommandUpdateMultiplier;

/*
 * - TimelineBatch is array of commands
 * - Grouped commands can be executed in parallel.
 */
export type TimelineBatch = ValidCommands[];

/*
 * - PlayTimeline is array of TimelineBatch
 * - TimelineBatches are executed in order.
 */
export type PlayTimeline = TimelineBatch[];