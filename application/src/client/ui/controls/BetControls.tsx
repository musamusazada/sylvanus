import type { FC } from 'react';
import { useGameStore, GamePhase } from '../../store/gameStore';
import { useGameController } from '../context/GameControllerContext';

export const BetControls: FC = () => {
  const bet = useGameStore(state => state.bet);
  const betOptions = useGameStore(state => state.betOptions);
  const gamePhase = useGameStore(state => state.phase);
  const controller = useGameController();

  const isIdle = gamePhase === GamePhase.IDLE;

  const handlePrev = () => {
    const idx = betOptions.indexOf(bet);
    if (idx > 0) {
      controller.setBet(betOptions[idx - 1]);
    }
  };

  const handleNext = () => {
    const idx = betOptions.indexOf(bet);
    if (idx !== -1 && idx < betOptions.length - 1) {
      controller.setBet(betOptions[idx + 1]);
    } else if (idx === -1 && betOptions.length > 0) {
      controller.setBet(betOptions[0]);
    }
  };

  return (
    <div className="bet-controls">
      <button 
        className="bet-btn" 
        onClick={handlePrev} 
        disabled={!isIdle || betOptions.indexOf(bet) <= 0}
      >
        -
      </button>
      <div className="flex-col">
        <span className="label">Total Bet</span>
        <span className="bet-amount">${bet}</span>
      </div>
      <button 
        className="bet-btn" 
        onClick={handleNext} 
        disabled={!isIdle || betOptions.indexOf(bet) >= betOptions.length - 1}
      >
        +
      </button>
    </div>
  );
};
