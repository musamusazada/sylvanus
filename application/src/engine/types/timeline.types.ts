export enum TimelineCommandTypes {
    SPIN_START = "SPIN_START",
    REEL_STOP = "REEL_STOP",
}

/*
 * The generic command shape
 * Single Command consists of their type (name) and payload required for the command.
 */
export interface TimelineCommand<TType extends TimelineCommandTypes, TPayload = any> {
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

// All Valid commands for timeline
export type ValidCommands = CommandSpinStart | CommandReelStop;

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