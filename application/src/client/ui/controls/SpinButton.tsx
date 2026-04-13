import { type FC } from 'react';
import { useGameStore, GamePhase } from '../../store/gameStore';
import { useGameController } from '../../core/GameControllerContext';

export const SpinButton: FC = () => {
  const gamePhase = useGameStore(state => state.phase);
  const controller = useGameController();

  const isSpinning = gamePhase !== GamePhase.IDLE;

  return (
    <button 
      className="spin-button" 
      onClick={() => controller.spin()} 
      disabled={isSpinning}
    >
      {isSpinning ? 'Spinning...' : 'Spin'}
    </button>
  );
};
