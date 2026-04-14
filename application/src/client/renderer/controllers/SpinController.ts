import { reelAnimations } from '../animations/reelAnimations';
import type { IMachineConfig } from '../../../config/machineConfig';
import type { IReel } from '../components/reel/IReel';
import type { IMachineSpin } from '../components/machine/IMachine';
import type { TRandomGenerator } from '../utils/symbolRandom';

export class SpinController implements IMachineSpin {
  constructor(private config: IMachineConfig) {}

  public async startAll(
    reels: IReel[],
    symbolPool: number[],
    random: TRandomGenerator = Math.random
  ): Promise<void> {
    const promises = reels.map((reel) =>
      reelAnimations.startSpin(reel.getStrip(), this.config, symbolPool, random)
    );
    await Promise.all(promises);
  }

  public async stopReel(
    reel: IReel,
    symbols: number[],
    symbolPool: number[],
    random: TRandomGenerator = Math.random
  ): Promise<void> {
    await reelAnimations.stopSpin(reel.getStrip(), this.config, symbols, symbolPool, random);
  }
}
