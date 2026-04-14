import { useMemo, useEffect, useState, useCallback } from "react";
import { SlotEngine } from "../engine";
import { gameConfig } from "../config/gameConfig";
import { GameController } from "./core/GameController";
import { TimelineExecutor } from "./core/TimelineExecutor";
import { GameControllerProvider } from "./ui/context/GameControllerContext";
import { GameLayout } from "./ui/layout/GameLayout";
import { GameCanvas } from "./ui/gameCanvas/GameCanvas";
import { machineConfig } from "../config/machineConfig";
import type { IMachine } from "./renderer";

export const App = () => {
  const [isBooted, setIsBooted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controller = useMemo(() => {
    const engine = new SlotEngine(gameConfig);
    const executor = new TimelineExecutor();
    return new GameController(engine, executor, machineConfig);
  }, []);

  useEffect(() => {
    try {
      controller.initialize();
      setIsBooted(true);
    } catch (err) {
      console.error('Failed to boot engine:', err);
      setError('Engine boot failed. Check console.');
    }
  }, [controller]);

  const onMachineReady = useCallback(
    (machine: IMachine) => {
      controller.attachMachine(machine);
    },
    [controller],
  );

  const onCanvasError = useCallback((err: unknown) => {
    console.error("GameCanvas init failed:", err);
    setError("Failed to initialize game canvas.");
  }, []);

  if (error) return <div className="error-screen">{error}</div>;
  if (!isBooted) return <div className="loading-screen">Booting Engine...</div>;

  return (
    <GameControllerProvider controller={controller}>
      <GameLayout>
        <GameCanvas
          machineConfig={machineConfig}
          gridDimensions={gameConfig.gridDimensions}
          onMachineReady={onMachineReady}
          onError={onCanvasError}
        />
      </GameLayout>
    </GameControllerProvider>
  );
};