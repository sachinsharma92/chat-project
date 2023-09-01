import { Physics } from '@react-three/rapier';
import InputProvider from '../Game/InputProvider';
import Environment from '../Environment';
import Player from '../Game/Player';

const Scene = () => {
  return (
    <>
      <Physics>
        <InputProvider>
          <Environment />
          <Player />
        </InputProvider>
      </Physics>
    </>
  );
};

export default Scene;
