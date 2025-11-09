import { useEffect } from 'react';
import { DoubleSide, NearestFilter, TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { useGameStore } from '../state/useGameStore';

const NPC_SPRITE = '/sprites/npc_generic.png';

const NPCs = () => {
  const texture = useLoader(TextureLoader, NPC_SPRITE);
  const npcs = useGameStore((state) => state.npcs);

  useEffect(() => {
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
  }, [texture]);

  return (
    <group>
      {npcs.map((npc) => (
        <group key={npc.id} position={npc.position}>
          <mesh position={[0, 0.45, 0]}>
            <planeGeometry args={[1.1, 1.5]} />
            <meshBasicMaterial map={texture} transparent side={DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default NPCs;
