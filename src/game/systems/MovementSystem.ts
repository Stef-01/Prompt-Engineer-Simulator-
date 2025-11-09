import { Vector3 } from 'three';
import type { PlayerControls } from '../hooks/usePlayerControls';
import { useGameStore } from '../state/useGameStore';

const PLAYER_SPEED = 4.2;

export const updatePlayer = ({
  controls,
  delta,
  playerPosition,
  setPlayerPosition,
  setPlayerFacing,
}: {
  controls: PlayerControls;
  delta: number;
  playerPosition: [number, number, number];
  setPlayerPosition: (position: [number, number, number]) => void;
  setPlayerFacing: (facing: PlayerControls['facing']) => void;
}) => {
  const velocity = new Vector3(controls.movement.x, 0, -controls.movement.y);
  if (velocity.lengthSq() === 0) {
    setPlayerFacing(controls.facing);
    return;
  }

  const next = new Vector3(...playerPosition).addScaledVector(velocity.normalize(), PLAYER_SPEED * delta);
  setPlayerPosition([next.x, next.y, next.z]);
  setPlayerFacing(controls.facing);
};

export const stepNPCQueue = (delta: number) => {
  const { updateNPCMovement } = useGameStore.getState();
  updateNPCMovement(delta);
};
