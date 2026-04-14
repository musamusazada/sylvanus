import type { IGameConfig } from '../../types';
import { AnticipationExtension } from './AnticipationExtension';
import type { IReelStopExtension } from './IReelStopExtension';

export function createReelStopExtensions(config: IGameConfig): IReelStopExtension[] {
  const extensions: IReelStopExtension[] = [];
  const symbolId = config.anticipation?.symbolId;
  if (symbolId !== undefined) {
    extensions.push(new AnticipationExtension(symbolId));
  }
  return extensions;
}
