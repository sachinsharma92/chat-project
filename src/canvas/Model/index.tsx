import React from 'react';
import Soil from './models/Soil';
import Board from './models/Board';
import Bird from './models/Bird';
import Cabin from './models/Cabin';
import Campfire from './models/Campfire';
import Log, { Instances as Logs } from './models/Log';
import Flower from './Flower';
import Tree from './Tree';
import Mountain from './models/Mountain';

const Model = () => {
  const tiltFactor: number = -0.1;
  return (
    <>
      <Flower tiltFactor={tiltFactor} />
      <Tree tiltFactor={tiltFactor} />
      <Soil />
      <Board position={[3.5, 0, 2.5]} rotation={[tiltFactor, 0, 0]} />
      <Bird position={[6, 2, 6]} rotation={[0, -Math.PI / 2, 0]} />
      <Campfire position={[0, 0, -2.3]} />
      <Cabin rotation={[tiltFactor, 0, 0]} position={[0.5, 0, 2]} />
      {/* Log */}
      <Logs castShadow receiveShadow>
        <Log position={[2, 0.1, 4.3]} rotation={[0, Math.PI / 2, 0]} />
        <Log position={[-1, 0.1, 4.3]} rotation={[0, Math.PI / 2, 0]} />
      </Logs>
      {/* mountain */}
      <Mountain  />
    </>
  );
};

export default Model;
