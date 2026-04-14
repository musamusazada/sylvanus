import { Application } from 'pixi.js';

/** Defaults */
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;
export const DEFAULT_BACKGROUND_COLOR = 0x1a1a2e;

export interface CanvasInitOptions {
  backgroundColor?: number;
  width?: number;
  height?: number;
  resolution?: number;
}

function getInitialAppDimensions(
  container: HTMLElement,
  canvas: CanvasInitOptions,
): { width: number; height: number } {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const width = containerWidth > 0 ? containerWidth : (canvas.width ?? DEFAULT_CANVAS_WIDTH);
  const height = containerHeight > 0 ? containerHeight : (canvas.height ?? DEFAULT_CANVAS_HEIGHT);
  return {
    width: Math.max(1, Math.floor(width)),
    height: Math.max(1, Math.floor(height)),
  };
}

/**
 * Create Pixi.Application instance
 */
export async function createPixiApplication(
  container: HTMLElement,
  options: CanvasInitOptions = {},
): Promise<Application> {
  const { width, height } = getInitialAppDimensions(container, options);
  let app: Application | null = null;

  try {
    app = new Application();
    await app.init({
      width,
      height,
      backgroundColor: options.backgroundColor ?? DEFAULT_BACKGROUND_COLOR,
      resolution: options.resolution ?? (window.devicePixelRatio || 1),
      autoDensity: true,
    });
    container.appendChild(app.canvas);
    return app;
  } catch (err) {
    if (app) {
      app.destroy(true, { children: true });
    }
    throw err;
  }
}
