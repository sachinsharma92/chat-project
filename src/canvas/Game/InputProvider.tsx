'use client';

import { useDirectionStore } from '@/store/CanvasProvider';
import { isChatFocused } from '@/ui/features/Chat/ChatInput';
import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  useContext,
  PropsWithChildren,
} from 'react';

type ContextType = {
  x: number;
  y: number;
};

const InputContext = createContext({} as ContextType);

export const useInputs = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('useInputs must be used within an AssetProvider');
  }
  return context;
};

function InputProvider({ children }: PropsWithChildren<{}>) {
  const [movementInputs, setMovementInputs] = useState({ x: 0, y: 0 });
  const [keyPressed, setKeyPressed] = useState<{ [key: string]: boolean }>({});
  //
  const direction = useDirectionStore(state => state.direction);

  useEffect(() => {
    if (direction.direction === 'FORWARD') {
      setMovementInputs(draft => ({ ...draft, y: direction.y }));
    }
    if (direction.direction === 'BACKWARD') {
      setMovementInputs(draft => ({ ...draft, y: direction.y }));
    }
    if (direction.direction === 'LEFT') {
      setMovementInputs(draft => ({ ...draft, x: direction.x }));
    }
    if (direction.direction === 'RIGHT') {
      setMovementInputs(draft => ({ ...draft, x: direction.x }));
    }

    if (!direction.direction) {
      setMovementInputs({ x: 0, y: 0 });
    }
  }, [direction]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (isChatFocused()) {
      return;
    }

    if (!keyPressed[event.code]) {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovementInputs(draft => ({ ...draft, y: draft.y + 1 }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovementInputs(draft => ({ ...draft, y: draft.y - 1 }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovementInputs(draft => ({ ...draft, x: draft.x - 1 }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovementInputs(draft => ({ ...draft, x: draft.x + 1 }));
          break;
        default:
          break;
      }

      setKeyPressed(draft => ({ ...draft, [event.code]: true }));
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (isChatFocused()) {
      return;
    }

    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        setMovementInputs(draft => ({ ...draft, y: draft.y - 1 }));
        break;
      case 'KeyS':
      case 'ArrowDown':
        setMovementInputs(draft => ({ ...draft, y: draft.y + 1 }));
        break;
      case 'KeyA':
      case 'ArrowLeft':
        setMovementInputs(draft => ({ ...draft, x: draft.x + 1 }));
        break;
      case 'KeyD':
      case 'ArrowRight':
        setMovementInputs(draft => ({ ...draft, x: draft.x - 1 }));
        break;
      default:
        break;
    }
    setKeyPressed(draft => ({ ...draft, [event.code]: false }));
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown, false);
      window.removeEventListener('keyup', onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyPressed]);

  const value = useMemo(() => movementInputs, [movementInputs]);

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
}

export default InputProvider;
