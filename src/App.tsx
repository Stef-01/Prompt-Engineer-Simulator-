import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PromptCafeScene from './game/scene/PromptCafeScene';
import Hud from './ui/Hud';
import DebugPanel from './ui/DebugPanel';

const LoadingFallback = () => (
  <div className="loading-screen">
    <div className="loading-message">Loading game assets...</div>
  </div>
);

const App = () => {
  const [loadError, setLoadError] = useState(false);

  return (
    <div className="app-container">
      <ErrorBoundary onError={() => setLoadError(true)}>
        <Canvas
          className="app-canvas"
          orthographic
          dpr={[1, 1]}
          gl={{ antialias: false }}
          camera={{ position: [12, 12, 12], zoom: 45 }}
          onError={(error) => {
            console.error('Canvas error:', error);
            setLoadError(true);
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <PromptCafeScene />
          </Suspense>
        </Canvas>
        {!loadError && (
          <div className="hud-overlay">
            <Hud />
          </div>
        )}
        {!loadError && <DebugPanel />}
      </ErrorBoundary>
      {loadError && (
        <div className="error-screen">
          <div className="error-message">
            Failed to load game. Please refresh the page or check your connection.
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
