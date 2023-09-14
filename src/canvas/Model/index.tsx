import React from 'react';
import Bird from './models/Bird';
import Log, { Instances as L } from './models/Log';
import Flower from './Flower';
import Tree from './Tree';
import Mountain from './models/Mountain';
import Cabina from './models/Cabin';
import Board from './models/Board';
import Campfire from './models/Campfire';
import Soil from './models/Soil';

const Model = () => {
  const tiltFactor: number = -0.1;
  return (
    <>
      <Flower tiltFactor={tiltFactor} />
      <Tree tiltFactor={tiltFactor} />
      <Soil position={[0.5, 0.055, 2]} />
      <Board position={[4, 0, 0.5]} rotation={[tiltFactor, 0, 0]} />
      <Bird position={[6, 2, 6]} rotation={[0, -Math.PI / 2, 0]} />
      <Campfire position={[0.5, 0, 2.5]} />
      <Cabina rotation-x={tiltFactor} position={[0.5, 0, 0]} />
      <L castShadow receiveShadow>
        <Log position={[2.4, 0.1, 2.5]} rotation={[0, Math.PI / 2, 0]} />
        <Log position={[-1.4, 0.1, 2.5]} rotation={[0, Math.PI / 2, 0]} />
      </L>
      <Mountain />
    </>
  );
};

export default Model;
