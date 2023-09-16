import React from 'react';
import Bird from './models/Bird';
import Log, { Instances as L } from './models/Log';
import Flower from './Flower';
import Tree from './Tree';
import Mountain from './models/Mountain';
import Cabin from './models/Cabin';
import Board from './models/Board';
import Campfire from './models/Campfire';
import Soil from './models/Soil';

const Model = () => {
  const tiltFactor: number = -0.2;
  return (
    <>
      <Flower tiltFactor={tiltFactor} />
      <Tree tiltFactor={tiltFactor} />
      <Soil scale={3.7} position={[0.5, 0.055, 0.8]} />
      <Board position={[4.2, 0, -1.1]} rotation={[tiltFactor, 0, 0]} />
      <Bird position={[6, 2, 6]} rotation={[0, -Math.PI / 2, 0]} />
      <Campfire scale={1.3} position={[0.5, 0, 1]} />
      <Cabin scale={1.2} rotation-x={tiltFactor} position={[0.5, 0, -2]} />
      <L castShadow receiveShadow>
        <Log position={[2.7, 0.15, 1.1]} rotation={[0, Math.PI / 2, 0]} />
        <Log position={[-1.7, 0.15, 1.1]} rotation={[0, Math.PI / 2, 0]} />
      </L>
      <Mountain position={[0, -1.5, 0]} />
    </>
  );
};

export default Model;
