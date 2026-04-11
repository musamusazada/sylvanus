export enum SpinType {
    SPIN = 'SPIN',
    CASCADE = 'CASCADE'
}

export interface IGridDimensions {
  cols: number;
  rows: number;
}

export interface ISymbolDefinition {
  id: number;
  name: string;
  weight: number;
  payouts: Record<number, number>;
}

export interface ISymbolPosition {
  col: number;
  row: number;
}

// TODO: tidy it up
export interface IGameConfig {
  gridDimensions: IGridDimensions;
  spinType: SpinType;
  symbols: ISymbolDefinition[];
  paylines: ISymbolPosition[][];
  defaultBet: number;
  betOptions: number[];
}