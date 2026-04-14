import type { Application } from 'pixi.js';

export const PIXI_FPS_HUD_CLASS = 'pixi-fps-hud';

/**
 * Adds Pixi Ticker FPS Hud to the document body
 */
export function attachPixiFpsHud(app: Application): () => void {
  const el = document.createElement('div');
  el.className = 'pixi-fps-hud';
  el.textContent = 'FPS: —';

  const parent = window.document.body;
  if (parent) {
    parent.appendChild(el);
  }

  const update = () => {
    el.textContent = `FPS: ${Math.round(app.ticker.FPS)}`;
  };
  app.ticker.add(update);

  return () => {
    app.ticker.remove(update);
    el.remove();
  };
}
