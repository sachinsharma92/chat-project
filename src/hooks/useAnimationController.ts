import { useInputs } from "@/canvas/Game/InputProvider";
import { useAnimations } from "@react-three/drei";
import { useEffect } from "react";
import { Object3D } from "three";

function useAnimationController(model: { animations: any; scene: Object3D }) {
  const { x, y } = useInputs();
  const { actions } = useAnimations(model.animations, model.scene);

  const animationName = x === 0 && y === 0 ? "idle" : "run";

  useEffect(() => {
    const action = actions[animationName];
    if (action) {
      action.reset().fadeIn(0.5).play();

      return () => {
        action.fadeOut(0.5);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationName]);
}

export default useAnimationController;
