import { useEffect } from 'react';
import { DoubleSide, NearestFilter, TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { useGameStore } from '../state/useGameStore';

const COUNTER_SPRITE = '/sprites/prompt_bar.png';
const HOLOGRAPHIC_STATION = '/sprites/holo_station.png';
const OVERWORLD_BACKDROP = '/overworld/overworld.png';

const Stations = () => {
  const counterTexture = useLoader(TextureLoader, COUNTER_SPRITE);
  const holoTexture = useLoader(TextureLoader, HOLOGRAPHIC_STATION);
  const overworldTexture = useLoader(TextureLoader, OVERWORLD_BACKDROP);
  const { barStations, servingPad } = useGameStore((state) => ({
    barStations: state.barStations,
    servingPad: state.servingPad,
  }));

  useEffect(() => {
    [counterTexture, holoTexture, overworldTexture].forEach((texture) => {
      texture.magFilter = NearestFilter;
      texture.minFilter = NearestFilter;
    });
  }, [counterTexture, holoTexture, overworldTexture]);

  return (
    <group>
      <mesh position={[0, 3.9, -7.8]} rotation={[0, 0, 0]}>
        <planeGeometry args={[16, 8]} />
        <meshBasicMaterial map={overworldTexture} transparent side={DoubleSide} />
      </mesh>

      <mesh position={[servingPad[0], 0.01, servingPad[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.25, 32]} />
        <meshStandardMaterial color="#a5f3fc" transparent opacity={0.55} />
      </mesh>

      <group>
        {barStations.map((station, index) => (
          <group key={`station-${index}`} position={[station[0], 0, station[2]]}>
            <mesh position={[0, 0.5, 0]}>
              <planeGeometry args={[1.8, 1.2]} />
              <meshBasicMaterial map={counterTexture} transparent side={DoubleSide} />
            </mesh>
            <mesh position={[0, 1.2, -0.2]}>
              <planeGeometry args={[1.6, 1.2]} />
              <meshBasicMaterial map={holoTexture} transparent side={DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

export default Stations;
