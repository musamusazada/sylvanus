import type {
  ISymbolDefinition,
  IWinEvaluationResult,
  UpdateMultiplierPayload,
  WinResultPayload
} from '../../../engine/types';
import {
  useGameStore,
  type ILastWinSummary,
  type IWinSummaryCascadeStep,
  type IWinSummarySpinEntry
} from '../../store/gameStore';

export interface IWinControllerTimelineActions {
  clearWinState(): void;
  saveWinState(payload: WinResultPayload): void;
  updateCascadeProgress(payload: UpdateMultiplierPayload): void;
}

export class WinController implements IWinControllerTimelineActions {
  private symbolNameById = new Map<number, string>();

  public initialize(symbols: ISymbolDefinition[]): void {
    this.symbolNameById = new Map(symbols.map((symbol) => [symbol.id, symbol.name]));
  }

  public preparePendingSummary(wins: IWinEvaluationResult): void {
    useGameStore.setState({
      pendingWinSummary: this.mapWinsToSummary(wins),
      lastResult: wins.finalGrid,
    });
  }

  public clearWinState(): void {
    useGameStore.setState({
      lastWin: 0,
      lastWinSummary: null,
      liveCascadeProgress: null,
      error: null,
    });
  }

  public saveWinState(payload: WinResultPayload): void {
    useGameStore.setState((state) => ({
      lastWin: payload.totalWin,
      lastWinSummary: state.pendingWinSummary,
      pendingWinSummary: null,
      liveCascadeProgress: null,
    }));
  }

  public updateCascadeProgress(payload: UpdateMultiplierPayload): void {
    useGameStore.setState({
      liveCascadeProgress: {
        stepIndex: payload.stepIndex,
        multiplier: payload.multiplier,
        stepWin: payload.stepWin,
        totalWinAfterStep: payload.totalWinAfterStep,
      },
    });
  }

  public clearPending(): void {
    useGameStore.setState({ pendingWinSummary: null, liveCascadeProgress: null });
  }

  private mapWinsToSummary(wins: IWinEvaluationResult): ILastWinSummary | null {
    const spin: IWinSummarySpinEntry[] = wins.spinWins
      .filter((win) => win.winAmount > 0)
      .map((win) => ({
        paylineIndex: win.paylineIndex,
        symbolId: win.symbolId,
        symbolName: this.getSymbolName(win.symbolId),
        matchCount: win.matchCount,
        winAmount: win.winAmount,
      }));

    const cascade: IWinSummaryCascadeStep[] = wins.cascadeSteps
      .map((step) => ({
        stepIndex: step.stepIndex,
        multiplier: step.multiplier,
        stepWin: step.stepWin,
        entries: step.symbolWins
          .filter((entry) => entry.baseWin > 0)
          .map((entry) => ({
            symbolId: entry.symbolId,
            symbolName: this.getSymbolName(entry.symbolId),
            matchCount: entry.matchCount,
            baseWin: entry.baseWin,
          })),
      }))
      .filter((step) => step.entries.length > 0);

    if (spin.length === 0 && cascade.length === 0) {
      return null;
    }

    return { spin, cascade };
  }

  private getSymbolName(symbolId: number): string {
    return this.symbolNameById.get(symbolId) ?? `Symbol ${symbolId}`;
  }
}
