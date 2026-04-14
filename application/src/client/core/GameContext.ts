import { GameElement, type GameElementMap, type IGameContext } from './types';

/**
 * Stores references to game elements.
 * Used by handlers to access game elements to dictate actions.
 */
export class GameContext implements IGameContext {
  private elements = new Map<GameElement, any>();

  public attach<K extends GameElement>(key: K, instance: GameElementMap[K]): void {
    this.elements.set(key, instance);
  }

  public get<K extends GameElement>(key: K): GameElementMap[K] {
    const el = this.elements.get(key);
    if (!el) throw new Error(`## GameContext: "${key}" not yet attached`);
    return el;
  }
}

