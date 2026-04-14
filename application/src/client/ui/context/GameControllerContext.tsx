import { type FC, type ReactNode, createContext, useContext } from 'react';
import type { IGameController } from '../../core/types';

const GameControllerContext = createContext<IGameController | null>(null);

interface GameControllerProviderProps {
  controller: IGameController;
  children: ReactNode;
}

/**
 * Provides the GameController to its children.
 */
export const GameControllerProvider: FC<GameControllerProviderProps> = ({ 
  controller, 
  children 
}) => {
  return (
    <GameControllerContext.Provider value={controller}>
      {children}
    </GameControllerContext.Provider>
  );
};

/**
 * Hook to access the GameController.
 */
export const useGameController = (): IGameController => {
  const context = useContext(GameControllerContext);
  if (!context) {
    throw new Error('useGameController cant be called outside of GameControllerProvider');
  }
  return context;
};

