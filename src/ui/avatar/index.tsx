import { Canvas } from '@react-three/fiber';
import React from 'react';
import BaseModel from './BaseModel';
// import ZeroTwo from './Vrm';

const Avatar = () => {
  return (
    <>
      <Canvas>
        <Experience />
      </Canvas>
    </>
  );
};

const Experience = () => {
  return (
    <>
      <ambientLight intensity={1} />
      {/* <directionalLight position={[10, 10, 10]} intensity={1} /> */}
      <BaseModel position={[0, -1.5, 4.6]} />
      {/* <ZeroTwo rotation-y={Math.PI} position={[0, -1.6, 4.5]} /> */}
    </>
  );
};

export default Avatar;
