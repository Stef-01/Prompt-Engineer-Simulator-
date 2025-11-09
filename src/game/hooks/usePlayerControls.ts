import { useCallback, useEffect, useRef, useState } from 'react';
import { Vector2 } from 'three';

type FacingDirection =
  | 'idle-up-left'
  | 'idle-up-right'
  | 'idle-down-left'
  | 'idle-down-right'
  | 'walk-up-left'
  | 'walk-up-right'
  | 'walk-down-left'
  | 'walk-down-right';

type PlayerControls = {
  movement: Vector2;
  facing: FacingDirection;
  interacting: boolean;
  consumeInteraction: () => void;
};

const directionFromVector = (vector: Vector2, isMoving: boolean): FacingDirection => {
  if (!isMoving) {
    if (vector.y >= 0 && vector.x <= 0) return 'idle-up-left';
    if (vector.y >= 0 && vector.x >= 0) return 'idle-up-right';
    if (vector.y < 0 && vector.x <= 0) return 'idle-down-left';
    return 'idle-down-right';
  }

  if (vector.y >= 0 && vector.x <= 0) return 'walk-up-left';
  if (vector.y >= 0 && vector.x >= 0) return 'walk-up-right';
  if (vector.y < 0 && vector.x <= 0) return 'walk-down-left';
  return 'walk-down-right';
};

export const usePlayerControls = (): PlayerControls => {
  const [movement, setMovement] = useState(() => new Vector2());
  const [facing, setFacing] = useState<FacingDirection>('idle-down-right');
  const [interacting, setInteracting] = useState(false);
  const keys = useRef<Record<string, boolean>>({});
  const lastDirection = useRef(new Vector2(1, -1));

  const updateMovement = useCallback(() => {
    const direction = new Vector2();
    if (keys.current['ArrowUp'] || keys.current['KeyW']) direction.y += 1;
    if (keys.current['ArrowDown'] || keys.current['KeyS']) direction.y -= 1;
    if (keys.current['ArrowLeft'] || keys.current['KeyA']) direction.x -= 1;
    if (keys.current['ArrowRight'] || keys.current['KeyD']) direction.x += 1;
    direction.clampLength(0, 1);
    setMovement(direction);

    if (direction.lengthSq() > 0) {
      lastDirection.current.copy(direction);
      setFacing(directionFromVector(direction, true));
    } else {
      setFacing(directionFromVector(lastDirection.current, false));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current[event.code] = true;
      if (event.code === 'Space') {
        setInteracting(true);
      }
      updateMovement();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.code] = false;
      updateMovement();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [updateMovement]);

  const consumeInteraction = useCallback(() => {
    setInteracting(false);
  }, []);

  return {
    movement,
    facing,
    interacting,
    consumeInteraction,
  };
};

export type { PlayerControls };
