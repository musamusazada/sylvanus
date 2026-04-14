import { type FC, useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import type { IMachineConfig } from '../../../config/machineConfig';
import { Machine, type IGridDimensions, type IMachineView } from '../../renderer';
import {
  createPixiApplication,
  mountMachineOnStage,
  type CanvasInitOptions,
} from '.';

interface GameCanvasProps {
  machineConfig: IMachineConfig;
  gridDimensions: IGridDimensions;
  onMachineReady: (machine: IMachineView) => void;
  onError?: (error: unknown) => void;
  canvas?: CanvasInitOptions;
}

export const GameCanvas: FC<GameCanvasProps> = ({
  machineConfig,
  gridDimensions,
  onMachineReady,
  onError,
  canvas,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let app: Application | null = null;
    let machine: Machine | undefined;
    let isDestroyed = false;

    const disposeGraphics = () => {
      if (app) {
        app.destroy(true, { children: true, texture: false });
        app = null;
      }
    };

    const init = async () => {
      try {
        const newApp = await createPixiApplication(container, canvas);

        if (isDestroyed) {
          newApp.destroy(true, { children: true, texture: false });
          return;
        }

        app = newApp;

        const newMachine = await mountMachineOnStage(app, {
          machineConfig,
          gridDimensions,
        });

        if (isDestroyed) {
          newMachine.destroy({ children: true, texture: false });
          app.destroy(true, { children: true, texture: false });
          app = null;
          return;
        }

        machine = newMachine;

        onMachineReady(machine);
      } catch (err) {
        if (app) {
          app.destroy(true, { children: true, texture: false });
          app = null;
        }
        if (!isDestroyed) {
          onError?.(err);
        }
      }
    };

    void init();

    return () => {
      isDestroyed = true;
      disposeGraphics();
    };
  }, [machineConfig, gridDimensions, onMachineReady, onError, canvas]);

  return (
    <div
      ref={containerRef}
      className="game-canvas"
    />
  );
};
