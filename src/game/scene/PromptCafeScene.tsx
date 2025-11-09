import { useEffect, useMemo, useRef } from 'react';
import { Color, NearestFilter, OrthographicCamera, RepeatWrapping, TextureLoader, Vector3 } from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useGameStore } from '../state/useGameStore';
import Player from '../entities/Player';
import NPCs from '../entities/NPCs';
import Stations from '../entities/Stations';
import { updatePlayer } from '../systems/MovementSystem';
import { processInteractions } from '../systems/CollisionSystem';
import { usePlayerControls } from '../hooks/usePlayerControls';

const FLOOR_TEXTURE = '/assets/tiles/cafe_floor.png';
const WALL_TEXTURE = '/assets/tiles/cafe_walls.png';

const FLOOR_SIZE = 16;
const FLOOR_REPEAT = 8;

const Floor = () => {
  const texture = useLoader(TextureLoader, FLOOR_TEXTURE);
  const { gl } = useThree();

  useEffect(() => {
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(FLOOR_REPEAT, FLOOR_REPEAT);
    gl.setPixelRatio(1);
  }, [texture, gl]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE, FLOOR_REPEAT, FLOOR_REPEAT]} />
      <meshStandardMaterial map={texture} color="#ffffff" />
    </mesh>
  );
};

const Walls = () => {
  const texture = useLoader(TextureLoader, WALL_TEXTURE);

  useEffect(() => {
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
  }, [texture]);

  const positions: Array<{ position: Vector3; rotation: [number, number, number]; size: [number, number]; }> = useMemo(
    () => [
      { position: new Vector3(0, 4, -FLOOR_SIZE / 2), rotation: [0, 0, 0], size: [FLOOR_SIZE, 4] },
      { position: new Vector3(-FLOOR_SIZE / 2, 4, 0), rotation: [0, Math.PI / 2, 0], size: [FLOOR_SIZE, 4] },
    ],
    []
  );

  return (
    <group>
      {positions.map((wall, index) => (
        <mesh key={`wall-${index}`} position={wall.position} rotation={wall.rotation} receiveShadow>
          <planeGeometry args={[wall.size[0], wall.size[1]]} />
          <meshStandardMaterial map={texture} transparent opacity={0.95} />
        </mesh>
      ))}
    </group>
  );
};

const IsometricCamera = () => {
  const cameraRef = useRef<OrthographicCamera>(null);
  const { size } = useThree();

  useEffect(() => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    const aspect = size.width / size.height;
    const frustum = 12;
    camera.left = (-frustum * aspect) / 2;
    camera.right = (frustum * aspect) / 2;
    camera.top = frustum / 2;
    camera.bottom = -frustum / 2;
    camera.position.set(12, 12, 12);
    camera.lookAt(0, 0, 0);
    camera.near = 0.1;
    camera.far = 100;
    camera.zoom = 40;
    camera.updateProjectionMatrix();
  }, [size]);

  return <orthographicCamera ref={cameraRef} makeDefault />;
};

const PromptCafeScene = () => {
  const { scene } = useThree();
  const controls = usePlayerControls();
  const {
    setPlayerPosition,
    setPlayerFacing,
    playerPosition,
    registerInteraction,
    updateNPCMovement,
  } = useGameStore((state) => ({
    setPlayerPosition: state.setPlayerPosition,
    setPlayerFacing: state.setPlayerFacing,
    playerPosition: state.playerPosition,
    registerInteraction: state.registerInteraction,
    updateNPCMovement: state.updateNPCMovement,
  }));

  useEffect(() => {
    scene.background = new Color('#b8d4f5');
  }, [scene]);

  useFrame((_, delta) => {
    updatePlayer({
      controls,
      delta,
      playerPosition,
      setPlayerFacing,
      setPlayerPosition,
    });

    processInteractions({
      controls,
      onInteract: registerInteraction,
    });

    updateNPCMovement(delta);
  });

  return (
    <group>
      <IsometricCamera />
      <ambientLight intensity={0.8} />
      <directionalLight position={[8, 16, 10]} intensity={0.75} castShadow />
      <Floor />
      <Walls />
      <Stations />
      <Player />
      <NPCs />
    </group>
  );
};

export default PromptCafeScene;
