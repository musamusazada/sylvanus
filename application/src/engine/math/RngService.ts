import { EngineState } from '../state/EngineState';
import { GridModel } from '../models/GridModel';


/**
 * TODO: Write docs
 * Tweak the generation ? 
 */
export class RngService {
  private state: EngineState;

  constructor(state: EngineState) {
    this.state = state;
  }

  /**
   * Generates new grid populated with random symbols
   */
  public generateGrid(): GridModel {
    const config = this.state.getConfig();
    const { cols, rows } = config.gridDimensions;
    
    const grid = new GridModel(config.gridDimensions);

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const randomSymbolId = this.getRandomSymbolId();
        grid.setSymbolAt(col, row, randomSymbolId);
      }
    }

    return grid;
  }

  /**
   * Get a random symbol ID based on weight distribution.
   */
  public getRandomSymbolId(): number {
    const symbols = this.state.getConfig().symbols;

    const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
    const roll = Math.random() * totalWeight;

    let acc = 0;
    const picked = symbols.find((s) => (acc += s.weight) >= roll);

    return picked?.id ?? symbols[0].id;
  }
}