import type { FC } from 'react';
import { useGameStore } from '../../store/gameStore';

export const WinDisplay: FC = () => {
  const lastWin = useGameStore((state) => state.lastWin);

  if (lastWin <= 0) {
    return null;
  }

  return (
    <div className="win-display-wrapper">
      <div className="win-display">WIN ${lastWin.toLocaleString()}!</div>
    </div>
  );
};
