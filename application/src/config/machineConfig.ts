export interface IAnimationConfig {
  duration: number;
  ease?: string;
  speed?: number;
}

export interface IMachineConfig {
  reel: {
    symbolSize: { width: number; height: number };
    spacing: number;
    bufferSymbols: number;
  };
  symbolTextures: Record<number, string>;
  animations: {
    spinStart: IAnimationConfig;
    spinLoop: IAnimationConfig;
    reelStop: IAnimationConfig;
    anticipation: IAnimationConfig;
    minSpinTimeBeforeStop: number;
    cascade: {
      fadeRemovedDuration: number;
      fillStepDuration: number;
      pauseAfterDrop: number;
      pauseAfterFill: number;
    };
  };
}

export const machineConfig: IMachineConfig = {
  reel: {
    symbolSize: { width: 100, height: 144 },
    spacing: 10,
    bufferSymbols: 1,
  },
  symbolTextures: {
    1: '/assets/symbols/ace.png',
    2: '/assets/symbols/king.png',
    3: '/assets/symbols/queen.png',
    4: '/assets/symbols/jack.png',
    5: '/assets/symbols/ten.png',
    6: '/assets/symbols/eight.png',
    7: '/assets/symbols/seven.png',
    8: '/assets/symbols/four.png',
    9: '/assets/symbols/three.png',
    10: '/assets/symbols/joker.png',
  },
  animations: {
    spinStart: { duration: 0.3, ease: 'power2.in' },
    spinLoop: { duration: 0.1 },
    reelStop: { duration: 0.3, ease: 'back.out(1)' },
    anticipation: { duration: 2, speed: 0.5, ease: 'power1.inOut' },
    minSpinTimeBeforeStop: 1,
    cascade: {
      fadeRemovedDuration: 0.3,
      fillStepDuration: 0.3,
      pauseAfterDrop: 0.5,
      pauseAfterFill: 0.5,
    },
  },
};
