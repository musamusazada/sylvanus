import type { PlayTimeline } from './timeline.types';

/*
* Shape of the engine state
*/ 
export interface IEngineStateSnapshot {
  balance: number;
  bet: number;
}

/*
 * Response of the play action
 */
export interface IPlayResponse {
  transactionId: string;
  state: {
    initial: IEngineStateSnapshot;
    final: IEngineStateSnapshot;
  };
  timeline: PlayTimeline;
}