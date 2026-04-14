import type { Texture } from "pixi.js";

export type TTextureResolver = (id: number) => Texture;

export interface ISymbolView {
  setSymbol(id: number): void;
  readonly id: number;
}
