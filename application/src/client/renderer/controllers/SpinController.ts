import { reelAnimations } from '../animations/reelAnimations';
import { waitFor } from '../utils/GsapUtils';
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
    await waitFor(this.config.animations.minSpinTimeBeforeStop);
  }

  public async stopReel(
    reel: IReel,
    symbols: number[],
    symbolPool: number[],
    random: TRandomGenerator = Math.random
  ): Promise<void> {
    await reelAnimations.stopSpin(reel.getStrip(), this.config, symbols, symbolPool, random);
  }

  public async anticipateReel(reel: IReel): Promise<void> {
    const strip = reel.getStrip();
    const speed = this.config.animations.anticipation.speed!;
    const duration = this.config.animations.anticipation.duration;
    reelAnimations.setLoopSpeed(strip, speed);

    try {
      await waitFor(duration);
    } finally {
      reelAnimations.resetLoopSpeed(strip);
    }
  }
}
