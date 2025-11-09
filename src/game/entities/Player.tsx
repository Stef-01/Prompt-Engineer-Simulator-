import { useEffect, useMemo, useRef, useState } from 'react';
import { DoubleSide, NearestFilter, TextureLoader } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGameStore } from '../state/useGameStore';

const PLAYER_SPRITE = '/sprites/player_sheet.png';
const SPRITE_COLS = 4;
const SPRITE_ROWS = 8;
const IDLE_FRAME = 0;
const FRAME_DURATION = 0.15;

const Player = () => {
  const [textureError, setTextureError] = useState(false);
  const texture = useLoader(TextureLoader, PLAYER_SPRITE, undefined, (error) => {
    console.error('Failed to load player texture:', error);
    setTextureError(true);
  });
  
  const { playerPosition, playerFacing } = useGameStore((state) => ({
    playerPosition: state.playerPosition,
    playerFacing: state.playerFacing,
  }));

  if (textureError) {
    return null;
  }

  const [frame, setFrame] = useState(0);
  const accumulator = useRef(0);

  const rowLookup = useMemo(
    () => ({
      'idle-up-left': 0,
      'walk-up-left': 0,
      'idle-up-right': 1,
      'walk-up-right': 1,
      'idle-down-left': 2,
      'walk-down-left': 2,
      'idle-down-right': 3,
      'walk-down-right': 3,
    }),
    []
  );

  useEffect(() => {
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.needsUpdate = true;
    texture.repeat.set(1 / SPRITE_COLS, 1 / SPRITE_ROWS);
  }, [texture]);

  useEffect(() => {
    setFrame(IDLE_FRAME);
    accumulator.current = 0;
  }, [playerFacing]);

  useFrame((_, delta) => {
    const isWalking = playerFacing.startsWith('walk');
    if (!isWalking) {
      setFrame(IDLE_FRAME);
      return;
    }
    accumulator.current += delta;
    if (accumulator.current > FRAME_DURATION) {
      accumulator.current = 0;
      setFrame((prev) => (prev + 1) % SPRITE_COLS);
    }
  });

  const row = rowLookup[playerFacing] ?? 0;
  const frameWidth = 1 / SPRITE_COLS;
  const frameHeight = 1 / SPRITE_ROWS;

  useEffect(() => {
    texture.offset.set(frame * frameWidth, 1 - frameHeight * (row + 1));
  }, [texture, frame, frameWidth, frameHeight, row]);

  return (
    <group position={playerPosition}>
      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[1.2, 1.6]} />
        <meshBasicMaterial map={texture} transparent side={DoubleSide} />
      </mesh>
    </group>
  );
};

export default Player;
