import Aspen, { Instances as A } from './models/Aspen';
import Oak, { Instances as O } from './models/Oak';
import Pine, { Instances as P } from './models/Pine';

const Tree = ({ tiltFactor }: any) => {
  return (
    <>
      <P castShadow receiveShadow>
        <Pine rotation-x={tiltFactor} position={[6, 0, -4]} />
        <Pine rotation-x={tiltFactor} position={[-2.8, 0, 6.5]} />
        <Pine rotation-x={tiltFactor} position={[3.3, 0, 6.5]} />
        <Pine rotation-x={tiltFactor} position={[-9, 0, -5]} />
        <Pine rotation-x={tiltFactor} position={[-8.6, 0, -1]} />
      </P>
      <O castShadow receiveShadow>
        <Oak rotation-x={tiltFactor} position={[-3.3, 0, -3]} />
        <Oak rotation-x={tiltFactor} position={[-7, 0, 3]} />
        <Oak rotation-x={tiltFactor} position={[-0.7, 0, 7.7]} />
      </O>
      <A castShadow receiveShadow>
        <Aspen rotation-x={tiltFactor} position={[-4, 0, 1]} />
        <Aspen rotation-x={tiltFactor} position={[6, 0, 4.4]} />
        <Aspen rotation-x={tiltFactor} rotation-y={-0.7} position={[9, 0, -1]} />
      </A>
    </>
  );
};

export default Tree;
