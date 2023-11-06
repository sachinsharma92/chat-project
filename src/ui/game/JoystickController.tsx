import { useDirectionStore } from '@/store/Joystick';
import { Joystick } from 'react-joystick-component';

const JoystickController = () => {
  const setDirection = useDirectionStore(state => state.setDirection);
  return (
    <div className="absolute bottom-2 left-2">
      <Joystick
        baseColor="gray"
        stickColor="white"
        size={112}
        stickSize={50}
        move={e => setDirection(e)}
        stop={e => setDirection(e)}
      />
    </div>
  );
};

export default JoystickController;
