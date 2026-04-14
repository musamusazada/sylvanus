import type { FC, ReactNode } from 'react';
import { BalanceDisplay } from '../displays/BalanceDisplay';
import { WinResultBar } from '../displays/WinResultBar';
import { SpinButton } from '../controls/SpinButton';
import { BetControls } from '../controls/BetControls';
import { ModeSwitch } from '../controls/ModeSwitch';

export const GameLayout: FC<{ children?: ReactNode }> = ({ children }) => {

  return (
    <div className="game-layout">

      {/* Top Bar */}
      <div className="top-bar">
        <BalanceDisplay />
        <ModeSwitch />
      </div>

      {/* Canvas Area */}
      <div className="canvas-container">{children}</div>

      {/* Controls and Win */}
      <div className="control-bar">
        <BetControls />
        <WinResultBar />
        <SpinButton />
      </div>
    </div>
  );
};
