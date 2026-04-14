import { Assets, Texture } from 'pixi.js';

export class AssetLoader {
  static async load(symbolTextures: Record<number, string>): Promise<void> {
    await this.loadSymbols(symbolTextures);
  }

  static async loadSymbols(symbolTextures: Record<number, string>): Promise<void> {
    for (const [id, url] of Object.entries(symbolTextures)) {
      Assets.add({ alias: `symbol_${id}`, src: url });
    }
    const aliases = Object.keys(symbolTextures).map(id => `symbol_${id}`);
    await Assets.load(aliases);
  }

  static getSymbolTexture(id: number): Texture {
    return Assets.get(`symbol_${id}`);
  }
}
