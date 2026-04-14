import type { FC } from 'react';
import { useGameStore } from '../../store/gameStore';
import { WinDisplay } from './WinDisplay';
import { WinSummaryDisplay } from './WinSummaryDisplay';

export const WinResultBar: FC = () => {
  const lastWin = useGameStore((state) => state.lastWin);
  const summary = useGameStore((state) => state.lastWinSummary);
  const liveCascadeProgress = useGameStore((state) => state.liveCascadeProgress);

  const hasSummaryContent =
    !!summary && (summary.spin.length > 0 || summary.cascade.length > 0);

  if (lastWin <= 0 && !liveCascadeProgress && !hasSummaryContent) {
    return null;
  }

  return (
    <div className="result-bar">
      <WinDisplay />
      <WinSummaryDisplay />
    </div>
  );
};
