import gsap from 'gsap';
import type {
  CascadeMoveDirectivePayload,
  CascadeSpawnDirectivePayload,
  GridPositionPayload
} from '../../../engine/types';
import type { IReel } from '../components/reel/IReel';

/** Removes(fade outs) winning cells, empty the cell */
export async function fadeOutRemovedSymbols(
  reels: IReel[],
  removedPositions: GridPositionPayload[],
  duration: number
): Promise<void> {
  const animations = removedPositions.map(({ col, row }) => {
    const reel = reels[col];
    const view = reel?.getVisibleSymbolView(row);
    if (!reel || !view) return Promise.resolve();

    return new Promise<void>((resolve) => {
      gsap.to(view, {
        alpha: 0,
        duration,
        onComplete: () => {
          reel.setVisibleSymbol(row, -1);
          view.y = reel.getVisibleRowY(row);
          view.alpha = 1;
          resolve();
        },
      });
    });
  });

  await Promise.all(animations);
}

function tweenViewY(view: { y: number }, targetY: number, duration: number): Promise<void> {
  return new Promise((resolve) => {
    gsap.to(view, {
      y: targetY,
      duration,
      ease: 'none',
      onComplete: () => resolve(),
    });
  });
}

/**
 * Handles single cascade step:
 * - survivors slide down
 * - new symbols fall in
 * - strip is synced to the result grid
 */
export async function fillSymbolsFromTop(
  reels: IReel[],
  moves: CascadeMoveDirectivePayload[],
  spawns: CascadeSpawnDirectivePayload[],
  resultGrid: number[][],
  stepDuration: number
): Promise<void> {
  const movesByColumn = new Map<number, CascadeMoveDirectivePayload[]>();
  moves.forEach((m) => {
    if (m.from.col !== m.to.col) return;
    const list = movesByColumn.get(m.from.col) ?? [];
    list.push(m);
    movesByColumn.set(m.from.col, list);
  });

  const spawnsByColumn = new Map<number, CascadeSpawnDirectivePayload[]>();
  spawns.forEach((spawn) => {
    const columnSpawns = spawnsByColumn.get(spawn.to.col) ?? [];
    columnSpawns.push(spawn);
    spawnsByColumn.set(spawn.to.col, columnSpawns);
  });

  await Promise.all(
    reels.map(async (reel, col) => {
      const strip = reel.getStrip();
      const columnMoves = movesByColumn.get(col) ?? [];
      const columnSpawns = spawnsByColumn.get(col) ?? [];
      const stepDistance = reel.getCellStepDistance();

      // Drop: animate the *destination* row’s view from the old row Y (keeps textures aligned with resultingGrid).
      for (const move of columnMoves) {
        const fromRow = move.from.row;
        const toRow = move.to.row;
        const toView = reel.getVisibleSymbolView(toRow);
        if (!toView) continue;

        reel.setVisibleSymbol(fromRow, -1);
        reel.setVisibleSymbol(toRow, move.symbolId);
        toView.y = reel.getVisibleRowY(fromRow);
        await tweenViewY(toView, reel.getVisibleRowY(toRow), stepDuration);
      }

      // New symbols: start above the reel, tween into place.
      const spawnTasks: Promise<void>[] = [];
      for (const spawn of columnSpawns) {
        const view = reel.getVisibleSymbolView(spawn.to.row);
        if (!view) continue;
        reel.setVisibleSymbol(spawn.to.row, spawn.symbolId);
        const finalY = reel.getVisibleRowY(spawn.to.row);
        const startY = finalY + spawn.fromRowAbove * stepDistance;
        view.y = startY;
        spawnTasks.push(tweenViewY(view, finalY, stepDuration));
      }
      await Promise.all(spawnTasks);

      strip.setFinalSymbols(resultGrid[col]);
    })
  );
}
