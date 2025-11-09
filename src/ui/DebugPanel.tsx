import { useMemo } from 'react';
import { useGameStore } from '../game/state/useGameStore';

const DebugPanel = () => {
  const state = useGameStore((store) => ({
    playerPosition: store.playerPosition,
    playerFacing: store.playerFacing,
    queueLength: store.queue.length,
    npcs: store.npcs,
  }));

  const position = useMemo(
    () => state.playerPosition.map((coord) => coord.toFixed(2)).join(', '),
    [state.playerPosition]
  );

  return (
    <div className="debug-panel">
      <div>
        <strong>Player:</strong> {position}
      </div>
      <div>
        <strong>Facing:</strong> {state.playerFacing}
      </div>
      <div>
        <strong>Queue:</strong> {state.queueLength} NPCs
      </div>
      <div>
        <strong>NPC Targets:</strong> {state.npcs.map((npc) => npc.targetIndex).join(', ')}
      </div>
    </div>
  );
};

export default DebugPanel;
