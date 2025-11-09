import { useGameStore } from '../state/useGameStore';
import type { PlayerControls } from '../hooks/usePlayerControls';
import { isPointInsideAABB } from '../hooks/useCollision';

export const processInteractions = ({
  controls,
  onInteract,
}: {
  controls: PlayerControls;
  onInteract: (zoneId: 'prompt-bar' | 'serving-pad') => void;
}) => {
  if (!controls.interacting) {
    return;
  }

  const { playerPosition, interactionZones } = useGameStore.getState();
  const playerPoint: [number, number, number] = [playerPosition[0], playerPosition[1], playerPosition[2]];

  interactionZones.forEach((zone) => {
    if (isPointInsideAABB(playerPoint, zone.bounds)) {
      onInteract(zone.id);
    }
  });

  controls.consumeInteraction();
};
