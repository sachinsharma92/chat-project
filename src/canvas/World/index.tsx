'use client';

import { Canvas } from '@react-three/fiber';
import LoadingReveal from '../LoadingReveal';
import Scene from '../Scene';
import { useState } from 'react';
import { Perf } from 'r3f-perf';
import { useHotkeys } from 'react-hotkeys-hook';
import { Leva, useControls } from 'leva';
import Effects from '../Effects';
import JoystickController from '../Game/JoystickController';

const World = () => {
  const [adminPanelControls, setAdminPanelControls] = useState({
    showLevaControls: false,
    showThreeJsPerformance: false,
  });

  useHotkeys(
    'cmd+.,ctrl+.',
    () => {
      setAdminPanelControls({
        ...adminPanelControls,
        showThreeJsPerformance: !adminPanelControls?.showThreeJsPerformance,
      });
    },
    { enabled: true },
  );

  useHotkeys(
    'cmd+/,ctrl+/',
    () => {
      setAdminPanelControls({
        ...adminPanelControls,
        showLevaControls: !adminPanelControls?.showLevaControls,
      });
    },
    { enabled: true },
  );

  const { enableFog } = useControls('Fog', {
    enableFog: false,
  });

  return (
    <>
      {adminPanelControls.showLevaControls && <Leva collapsed />}
      <Canvas
        shadows
        gl={{ antialias: false }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        {adminPanelControls.showThreeJsPerformance && (
          <Perf position="bottom-right" />
        )}
        {enableFog && <fog attach="fog" near={10} far={50} />}
        <Scene />
        <LoadingReveal />
        <Effects />
      </Canvas>
      <JoystickController />
    </>
  );
};

export default World;
