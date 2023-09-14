import Aspen, { Instances as A } from './models/Aspen';
import Oak, { Instances as O } from './models/Oak';
import Pine, { Instances as P } from './models/Pine';

const Tree = ({ tiltFactor }: any) => {
  return (
    <>
      <P castShadow receiveShadow>
        <Pine rotation-x={tiltFactor} position={[5.5, 0, -3]} />
        <Pine rotation-x={tiltFactor} position={[-1.5, 0, 8.5]} />
        <Pine rotation-x={tiltFactor} position={[2.1, 0, 8.7]} />
        <Pine rotation-x={tiltFactor} position={[-7, 0, -1]} />
        <Pine rotation-x={tiltFactor} position={[-5.5, 0, 3.5]} />
        <Pine rotation-x={tiltFactor} position={[7, 0, 3]} />
      </P>
      <O castShadow receiveShadow>
        <Oak rotation-x={tiltFactor} position={[-3, 0, -2]} />
        <Oak rotation-x={tiltFactor} position={[-4, 0, 7]} />
        <Oak rotation-x={tiltFactor} position={[10, 0, -2]} />
      </O>
      <A castShadow receiveShadow>
        <Aspen rotation-x={tiltFactor} position={[-2.5, 0, 3]} />
        <Aspen rotation-x={tiltFactor} position={[6, 0, 6]} />
        <Aspen rotation-x={tiltFactor} position={[7, 0, 1]} />
      </A>
    </>
  );
};

export default Tree;
