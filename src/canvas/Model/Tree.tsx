import Pine, { Instances as Pines } from './models/Pine';
import Oak, { Instances as Oaks } from './models/Oak';
import Aspen, { Instances as Aspens } from './models/Aspen';

const Tree = ({ tiltFactor }: any) => {
  return (
    <>
      <Pines castShadow receiveShadow>
        <Pine scale={1.2} position={[5.5, 0, 0]} />
        <Pine
          scale={1.2}
          rotation={[tiltFactor, 0, 0]}
          position={[-1.5, 0, 8.5]}
        />
        <Pine
          scale={1.2}
          rotation={[tiltFactor, 0, 0]}
          position={[2.1, 0, 8.7]}
        />
        <Pine scale={1.2} position={[-7, 0, -1]} />
        <Pine scale={1.2} position={[-5.5, 0, 3.5]} />
      </Pines>
      <Oaks castShadow receiveShadow>
        <Oak scale={1.6} position={[-2.5, 0, 0]} />
        <Oak scale={1.6} position={[-4, 0, 7]} />
      </Oaks>
      <Aspens castShadow receiveShadow>
        <Aspen position={[-3, 1.9, 4]} />
        <Aspen position={[4.8, 1.9, 6]} />
        <Aspen position={[7, 1.9, 1]} />
      </Aspens>
    </>
  );
};

export default Tree;
