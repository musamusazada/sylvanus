import type { FC } from 'react';
import { useGameStore } from '../../store/gameStore';

export const WinDisplay: FC = () => {
  const lastWin = useGameStore(state => state.lastWin);

  return (
    <div className="win-display-wrapper">
      {lastWin > 0 && (
        <div className="win-display">
          WIN ${lastWin.toLocaleString()}!
        </div>
      )}
    </div>
  );
};
