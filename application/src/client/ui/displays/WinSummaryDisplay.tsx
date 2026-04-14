import type { FC } from 'react';
import { useGameStore } from '../../store/gameStore';

export const WinSummaryDisplay: FC = () => {
  const summary = useGameStore((state) => state.lastWinSummary);
  const liveCascadeProgress = useGameStore((state) => state.liveCascadeProgress);

  const lastCascadeStep =
    summary && summary.cascade.length > 0
      ? summary.cascade[summary.cascade.length - 1]
      : null;

  const hasSpinWins = !!summary && summary.spin.length > 0;

  if (
    !liveCascadeProgress &&
    (!summary || (!hasSpinWins && !lastCascadeStep))
  ) {
    return null;
  }

  return (
    <div className="win-summary-display">
      {liveCascadeProgress && (
        <div className="win-summary-section">
          <div className="win-summary-row">
            <span>Multplier: x{liveCascadeProgress.multiplier}</span>
            <span>${liveCascadeProgress.stepWin.toLocaleString()}</span>
          </div>
          <div className="win-summary-row is-detail">
            <span>Running Total</span>
            <span>${liveCascadeProgress.totalWinAfterStep.toLocaleString()}</span>
          </div>
        </div>
      )}

      {summary && summary.spin.length > 0 && (
        <div className="win-summary-section">
          {summary.spin.map((entry) => (
            <div className="win-summary-row" key={`spin-${entry.paylineIndex}-${entry.symbolId}`}>
              <span>{entry.symbolName} x{entry.matchCount}</span>
              <span>${entry.winAmount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {lastCascadeStep && (
        <div className="win-summary-section">
          <div className="win-summary-step" key={`cascade-step-${lastCascadeStep.stepIndex}`}>
            <div className="win-summary-row">
              <span>Multiplier: x{lastCascadeStep.multiplier}</span>
              <span>${lastCascadeStep.stepWin.toLocaleString()}</span>
            </div>
            {lastCascadeStep.entries.map((entry) => (
              <div
                className="win-summary-row is-detail"
                key={`cascade-${lastCascadeStep.stepIndex}-${entry.symbolId}`}
              >
                <span>{entry.symbolName} x{entry.matchCount}</span>
                <span>${entry.baseWin.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
