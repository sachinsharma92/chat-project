import Sunflower, { Instances as S } from './models/Sunflower';
import Whiteflower, { Instances as W } from './models/Whiteflower';
import Rose, { Instances as R } from './models/Rose';
import Tulip, { Instances as T } from './models/Tulip';

const Flower = ({ tiltFactor }: any) => {
  return (
    <>
      {/* Roses */}
      <R castShadow receiveShadow>
        {/* Top roses */}
        <group position={[0.8, 0, -1.6]}>
          <Rose rotation-x={tiltFactor} position={[1.6, 0.0, 0]} />
          <Rose rotation-x={tiltFactor} position={[1.9, 0, 0.5]} />
          <Rose rotation-x={tiltFactor} position={[2.2, 0, 0]} />
        </group>
        <group position={[-4, 0, -1.4]}>
          <Rose rotation-x={tiltFactor} position={[1.8, 0.0, 5]} />
          <Rose rotation-x={tiltFactor} position={[2.0, 0, 5.3]} />
          <Rose rotation-x={tiltFactor} position={[2.2, 0, 5]} />
        </group>
      </R>
      {/* SunFlower */}
      <S castShadow receiveShadow >
        <group position={[-3.5, 0, -0.8]}>
          <Sunflower rotation-x={tiltFactor} position={[0.5, 0, 0]} />
          <Sunflower rotation-x={tiltFactor} position={[0.9, 0, 0.5]} />
          <Sunflower rotation-x={tiltFactor} position={[1.3, 0, 0]} />
        </group>
        <group position={[4, 0, 2]}>
          <Sunflower rotation-x={tiltFactor} position={[0.5, 0, 0]} />
          <Sunflower rotation-x={tiltFactor} position={[0.9, 0, 0.5]} />
          <Sunflower rotation-x={tiltFactor} position={[1.3, 0, 0]} />
        </group>
      </S>
      <T castShadow receiveShadow>
        <group position={[3, 0, 3]}>
          <Tulip position={[0, 0, 0]} />
          <Tulip position={[0.4, 0, 0.3]} />
          <Tulip position={[0.8, 0, 0]} />
        </group>
      </T>
      <W castShadow receiveShadow>
        {/* top flower */}
        <group position={[1, 0, -1]}>
          <Whiteflower rotation-x={tiltFactor} position={[4.3, 0, 0]} />
          <Whiteflower rotation-x={tiltFactor} position={[4.7, 0, 0.3]} />
          <Whiteflower rotation-x={tiltFactor} position={[5.1, 0, 0]} />
        </group>
        <group position={[-6, 0, 0.3]}>
          <Whiteflower rotation-x={tiltFactor} position={[0.3, 0, 0]} />
          <Whiteflower rotation-x={tiltFactor} position={[0.7, 0, 0.3]} />
          <Whiteflower rotation-x={tiltFactor} position={[1, 0, 0]} />
        </group>
      </W>
    </>
  );
};

export default Flower;
