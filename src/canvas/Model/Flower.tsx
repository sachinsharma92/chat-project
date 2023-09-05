import Rose, { Instances as Roses } from './models/Rose';
import Sunflower, { Instances as Sunflowers } from './models/Sunflower';
import Whiteflower, { Instances as Whiteflowers } from './models/Whiteflower';
import Tulip, { Instances as Tulips } from './models/Tulip';

const Flower = ({ tiltFactor }: any) => {
  return (
    <>
      {/* Roses */}
      <Roses castShadow receiveShadow>
        <group position={[0.3, -0.5, -2.7]} rotation-x={tiltFactor}>
          <Rose position={[1.8, 0.0, 5]} />
          <Rose position={[2.0, 0, 5.3]} />
          <Rose position={[2.2, 0, 5]} />
        </group>
        <group position={[-3.5, 0.1, 1]}>
          <Rose position={[1.8, 0.0, 5]} />
          <Rose position={[2.0, 0, 5.3]} />
          <Rose position={[2.2, 0, 5]} />
        </group>
      </Roses>
      {/* SunFlower */}
      <Sunflowers castShadow receiveShadow rotation-x={tiltFactor}>
        <group position={[-0.3, -0.15, -2.3]}>
          <Sunflower position={[-1.5, 0, 5]} />
          <Sunflower position={[-1.8, 0, 4.9]} />
          <Sunflower position={[-1.3, 0, 4.8]} />
        </group>
        <group position={[5.5, -0.5, 0]}>
          <Sunflower position={[-1.5, 0, 5]} />
          <Sunflower position={[-1.8, 0, 4.9]} />
          <Sunflower position={[-1.3, 0, 4.8]} />
        </group>
      </Sunflowers>
      <Tulips castShadow receiveShadow>
        <group position={[2.5, -0.1, 2.0]}>
          <Tulip position={[0, 0.4, 5]} />
          <Tulip position={[0.2, 0.4, 4.7]} />
          <Tulip position={[-0.2, 0.4, 4.7]} />
        </group>
      </Tulips>
      <Whiteflowers castShadow receiveShadow rotation-x={tiltFactor}>
        <group>
          <Whiteflower position={[4.5, -0.28, 3]} />
          <Whiteflower position={[5, -0.28, 2]} />
          <Whiteflower position={[4.4, -0.28, 2.3]} />
        </group>
        <group position={[-8.3, 0, 1]}>
          <Whiteflower position={[4.5, -0.28, 3]} />
          <Whiteflower position={[5, -0.28, 2.7]} />
          <Whiteflower position={[4.4, -0.28, 2.3]} />
        </group>
      </Whiteflowers>
    </>
  );
};

export default Flower;
