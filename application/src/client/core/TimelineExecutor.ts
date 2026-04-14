import type { PlayTimeline, TimelineCommandTypes } from '../../engine/types';
import type { ITimelineExecutor, CommandHandler } from './types';

/**
 * Executes timelines by dispatching commands to registered handlers.
 * Commands within a batch run in parallel; batches run in sequence.
 */
export class TimelineExecutor implements ITimelineExecutor {
  private handlers = new Map<TimelineCommandTypes, CommandHandler[]>();

  public register<T>(type: TimelineCommandTypes, handler: CommandHandler<T>): void {
    const existing = this.handlers.get(type) ?? [];
    existing.push(handler);
    this.handlers.set(type, existing);
  }

  public async execute(timeline: PlayTimeline): Promise<void> {
    for (const batch of timeline) {
      await Promise.all(
        batch.flatMap(command => {
          const handlers = this.handlers.get(command.type) ?? [];
          return handlers.map(handler => handler(command.payload));
        })
      );
    }
  }
}
