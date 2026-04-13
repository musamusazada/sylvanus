import type { FC } from 'react';
import { useGameStore } from '../../store/gameStore';

export const BalanceDisplay: FC = () => {
  const balance = useGameStore(state => state.balance);

  return (
    <div className="balance-display flex-col">
      <span className="label">Balance</span>
      <span className="value">${balance.toLocaleString()}</span>
    </div>
  );
};
