import { atlasGrotesk } from '@/app/fonts';
import { Html } from '@react-three/drei';
import { Object3D, Group } from 'three';
import { isEmpty } from 'lodash';
import { Ref, forwardRef } from 'react';
import './PlayerText.css';

const PlayerText = forwardRef(
  (props: { character: Object3D; message?: string }, ref: Ref<Group> | any) => {
    const { character, message } = props;

    return (
      <group ref={ref}>
        {character && !isEmpty(message) && (
          <Html
            as="div"
            center
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'transparent',
            }}
          >
            <div className="player-message">
              <p className={atlasGrotesk.className}> {message}</p>
            </div>
          </Html>
        )}
      </group>
    );
  },
);

PlayerText.displayName = 'PlayerText';

export default PlayerText;
