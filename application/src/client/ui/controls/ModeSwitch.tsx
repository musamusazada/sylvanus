import { type FC } from 'react';
import { useGameStore, GamePhase } from '../../store/gameStore';
import { useGameController } from '../../core/GameControllerContext';
import { SpinType } from '../../../engine/types';

export const ModeSwitch: FC = () => {
  const mechanic = useGameStore(state => state.mechanic);
  const gamePhase = useGameStore(state => state.phase);
  const controller = useGameController();

  const isIdle = gamePhase === GamePhase.IDLE;

  return (
    <div className="mode-switch">
      <button
        className={`mode-btn ${mechanic === SpinType.SPIN ? 'active' : ''}`}
        onClick={() => controller.setMechanic(SpinType.SPIN)}
        disabled={!isIdle}
      >
        SPIN
      </button>
      <button
        className={`mode-btn ${mechanic === SpinType.CASCADE ? 'active' : ''}`}
        onClick={() => controller.setMechanic(SpinType.CASCADE)}
        disabled={!isIdle}
      >
        CASCADE
      </button>
    </div>
  );
};
