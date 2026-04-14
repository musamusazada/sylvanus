import gsap from 'gsap';
import type { IMachineConfig } from '../../../config/machineConfig';
import type { IReelStripView } from '../components/reel/IReelStrip';
import { pickRandomSymbolId, type TRandomGenerator } from '../utils/symbolRandom';
import { buildStopFeedSequence } from './reelStopFeedSequence';

/**
 * GSAP-based vertical reel motion: one “cell” equals symbol height + spacing.
 *
 * - **startSpin** schedules an infinite loop tween and returns a Promise that resolves
 *   immediately once that tween is registered
 *
 * - **stopSpin** finishes the current partial step, feeds buildStopFeedSequence
 *   ids with linear cell steps, then one “bounce” landing step.
 */

function tweenStripY(
  strip: IReelStripView,
  targetY: number,
  options: { duration: number; ease?: string }
): Promise<void> {
  return new Promise((resolve) => {
    gsap.to(strip, {
      y: targetY,
      duration: options.duration,
      ease: options.ease ?? 'none',
      onComplete: () => resolve(),
    });
  });
}

function moveDistanceForConfig(config: IMachineConfig): number {
  return config.reel.symbolSize.height + config.reel.spacing;
}

function getActiveLoopTween(strip: IReelStripView): gsap.core.Tween | undefined {
  return gsap.getTweensOf(strip).find((tween) => tween.repeat() === -1);
}

export const reelAnimations = {
  startSpin(
    strip: IReelStripView,
    config: IMachineConfig,
    symbolPool: number[],
    random: TRandomGenerator = Math.random
  ): Promise<void> {
    return new Promise((resolve) => {
      const moveDistance = moveDistanceForConfig(config);

      strip.y = 0;
      gsap.to(strip, {
        y: moveDistance,
        duration: config.animations.spinLoop.duration,
        ease: 'none',
        repeat: -1,
        onRepeat: () => {
          strip.y = 0;
          strip.shiftSymbolsDown(pickRandomSymbolId(symbolPool, random));
        },
      });
      resolve();
    });
  },

  stopSpin(
    strip: IReelStripView,
    config: IMachineConfig,
    finalSymbols: number[],
    symbolPool: number[],
    random: TRandomGenerator = Math.random
  ): Promise<void> {
    return runStopSpin(strip, config, finalSymbols, symbolPool, random);
  },

  setLoopSpeed(strip: IReelStripView, speedMultiplier: number): void {
    const tween = getActiveLoopTween(strip);
    if (!tween) return;
    const _speed = speedMultiplier > 0 ? speedMultiplier : 1;
    tween.timeScale(_speed);
  },

  resetLoopSpeed(strip: IReelStripView): void {
    const tween = getActiveLoopTween(strip);
    if (!tween) return;
    tween.timeScale(1);
  },
};

async function runStopSpin(
  strip: IReelStripView,
  config: IMachineConfig,
  finalSymbols: number[],
  symbolPool: number[],
  random: TRandomGenerator
): Promise<void> {
  reelAnimations.resetLoopSpeed(strip);
  gsap.killTweensOf(strip);

  const moveDistance = moveDistanceForConfig(config);
  const remainingY = moveDistance - strip.y;
  const timeLeft =
    config.animations.spinLoop.duration * (remainingY / moveDistance) || 0.01;

  const feedSequence = buildStopFeedSequence(finalSymbols, symbolPool, random);
  const linearSteps = feedSequence.length - 1;

  await tweenStripY(strip, moveDistance, { duration: timeLeft });

  strip.y = 0;
  strip.shiftSymbolsDown(pickRandomSymbolId(symbolPool, random));

  const loopDuration = config.animations.spinLoop.duration;
  for (let i = 0; i < linearSteps; i++) {
    await tweenStripY(strip, moveDistance, { duration: loopDuration });
    strip.y = 0;
    strip.shiftSymbolsDown(feedSequence[i]!);
  }

  await tweenStripY(strip, moveDistance, {
    duration: config.animations.reelStop.duration,
    ease: config.animations.reelStop.ease,
  });
  strip.y = 0;
  strip.shiftSymbolsDown(feedSequence[linearSteps]!);
}
