import { Container, Sprite, Texture } from 'pixi.js';
import type { ISymbolView, TTextureResolver } from './ISymbolView';

export class SymbolView extends Container implements ISymbolView {
  private sprite: Sprite;
  private currentId: number = -1;

  constructor(
    private symbolWidth: number,
    private symbolHeight: number,
    private getSymbolTexture: TTextureResolver
  ) {
    super();
    this.sprite = new Sprite();
    this.sprite.width = this.symbolWidth;
    this.sprite.height = this.symbolHeight;
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);
  }

  public setSymbol(id: number): void {
    if (this.currentId === id) return;
    this.currentId = id;
    if (id < 0) {
      this.sprite.texture = Texture.EMPTY;
      return;
    }
    this.sprite.texture = this.getSymbolTexture(id);
  }
}
