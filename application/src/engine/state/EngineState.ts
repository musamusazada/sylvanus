import type { IGameConfig, SpinType, IEngineStateSnapshot } from '../types';


/**
 * TODO: write docs, refactor
 */
export class EngineState {
  private config: IGameConfig;
  
  // Session State
  private balance: number;
  private currentBet: number;

  // Prev state
  private previousSnapshot: IEngineStateSnapshot;

  // TODO: move hardcoded values
  constructor(initialConfig: IGameConfig, initialBalance: number = 10000) {
    this.config = JSON.parse(JSON.stringify(initialConfig));
    
    this.balance = initialBalance;
    this.currentBet = 10; // TODO: move to config, decide bet options
    
    this.previousSnapshot = this.getCurrentSnapshot();
  }

  // Config handlers
  
  public getConfig(): IGameConfig {
    return this.config;
  }

  public updateSpinType(mode: SpinType): void {
    this.config.spinType = mode;
  }

  // Actions

  public setBet(amount: number): void {
    // TODO: handle validations after deciding all config possibilities
    this.currentBet = amount;
  }

  public deductBet(): void {
    // 1. store prev state
    this.previousSnapshot = this.getCurrentSnapshot();
    
    // 2. process new request
    // TODO: validation
    this.balance -= this.currentBet;
  }

  public applyWin(amount: number): void {
    if (amount <= 0) return;
    this.balance += amount;
  }

  // Snapshots

  public getPreviousSnapshot(): IEngineStateSnapshot {
    return this.previousSnapshot;
  }

  public getCurrentSnapshot(): IEngineStateSnapshot {
    return {
      balance: this.balance,
      bet: this.currentBet,
    };
  }
}