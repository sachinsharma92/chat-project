import Sunflowera, { Instances as S } from './models/Sunflower';
import Whiteflower, { Instances as W } from './models/Whiteflower';
import Rose, { Instances as R } from './models/Rose';

const Flower = ({ tiltFactor }: any) => {
  return (
    <>
      {/* Roses */}
      <R castShadow receiveShadow>
        <group position={[0.6, -0.5, -4.7]} rotation-x={tiltFactor}>
          <Rose position={[1.8, 0.0, 5]} />
          <Rose position={[2.0, 0, 5.3]} />
          <Rose position={[2.2, 0, 5]} />
        </group>
        <group position={[-4, 0.1, -0.5]}>
          <Rose position={[1.8, 0.0, 5]} />
          <Rose position={[2.0, 0, 5.3]} />
          <Rose position={[2.2, 0, 5]} />
        </group>
      </R>
      {/* SunFlower */}
      <S castShadow receiveShadow rotation-x={tiltFactor}>
        <group position={[-1, 0, -4]}>
          <Sunflowera position={[-1.5, 0, 5]} />
          <Sunflowera position={[-1.8, 0, 4.9]} />
          <Sunflowera position={[-1.3, 0, 4.8]} />
        </group>
        <group position={[5.5, -0.5, 0]}>
          <Sunflowera position={[-1.5, 0, 5]} />
          <Sunflowera position={[-1.8, 0, 4.9]} />
          <Sunflowera position={[-1.3, 0, 4.8]} />
        </group>
      </S>

      {/* <Tulips castShadow receiveShadow>
        <group position={[2.5, -0.1, 2.0]}>
          <Tulip position={[0, 0.4, 5]} />
          <Tulip position={[0.2, 0.4, 4.7]} />
          <Tulip position={[-0.2, 0.4, 4.7]} />
        </group>
      </Tulips> */}
      <W castShadow receiveShadow rotation-x={tiltFactor}>
        <group position={[0.5, 0.2, -2]}>
          <Whiteflower position={[4.5, -0.28, 3]} />
          <Whiteflower position={[5, -0.28, 2]} />
          <Whiteflower position={[4.4, -0.28, 2.3]} />
        </group>
        <group position={[-8.7, 0.2, -0.7]}>
          <Whiteflower position={[4.5, -0.28, 3]} />
          <Whiteflower position={[5, -0.28, 2.7]} />
          <Whiteflower position={[4.4, -0.28, 2.3]} />
        </group>
      </W>
    </>
  );
};

export default Flower;
