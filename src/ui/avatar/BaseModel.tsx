import * as THREE from 'three';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';

interface iVisemes {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
  G: string;
  H: string;
  X: string;
}

const visemes : iVisemes = {
  A: 'viseme_pp',
  B: 'viseme_kk',
  C: 'viseme_I',
  D: 'viseme_aa',
  E: 'viseme_O',
  F: 'viseme_U',
  G: 'viseme_FF',
  H: 'viseme_TH',
  X: 'viseme_pp',
};

type GLTFResult = GLTF & {
  nodes: {
    Body: THREE.SkinnedMesh;
    Body001: THREE.SkinnedMesh;
    Body002: THREE.SkinnedMesh;
    Body003: THREE.SkinnedMesh;
    Body004: THREE.SkinnedMesh;
    Hair: THREE.SkinnedMesh;
    Brow: THREE.SkinnedMesh;
    Eye: THREE.SkinnedMesh;
    Eyeline: THREE.SkinnedMesh;
    ['Face_(merged)(Clone)baked004']: THREE.SkinnedMesh;
    ['Face_(merged)(Clone)baked004_1']: THREE.SkinnedMesh;
    ['Face_(merged)(Clone)baked004_2']: THREE.SkinnedMesh;
    Hightlight: THREE.SkinnedMesh;
    Mouth: THREE.SkinnedMesh;
    Root: THREE.Bone;
    neutral_bone: THREE.Bone;
  };
  materials: {
    ['N00_006_01_Shoes_01_CLOTH (Instance)']: THREE.MeshStandardMaterial;
    ['N00_000_00_Body_00_SKIN (Instance)']: THREE.MeshStandardMaterial;
    ['N00_001_01_Bottoms_01_CLOTH (Instance)']: THREE.MeshStandardMaterial;
    ['N00_001_01_Tops_01_CLOTH (Instance)']: THREE.MeshStandardMaterial;
    ['N00_000_00_HairBack_00_HAIR (Instance)']: THREE.MeshStandardMaterial;
    ['N00_000_Hair_00_HAIR (Instance)']: THREE.MeshStandardMaterial;
    ['N00_000_00_FaceBrow_00_FACE (Instance)']: THREE.MeshStandardMaterial;
    ['N00_000_00_EyeIris_00_EYE (Instance)']: THREE.MeshStandardMaterial;
    ['N00_000_00_FaceEyeline_00_FACE (Instance)']: THREE.MeshStandardMaterial;
    ['N00_000_00_Face_00_SKIN (Instance)']: THREE.MeshStandardMaterial;
    ['N00_000_00_EyeWhite_00_EYE (Instance)']: THREE.MeshStandardMaterial;
    ['N00_000_00_FaceMouth_00_FACE (Instance)']: THREE.MeshStandardMaterial;
    ['N00_000_00_EyeHighlight_00_EYE (Instance)']: THREE.MeshStandardMaterial;
  };
};

export default function BaseModel(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations, scene } = useGLTF(
    '/base-transformed.glb',
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const [blink, setBlink] = useState(false);

  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    scene.traverse(child => {
      if (
        child instanceof THREE.SkinnedMesh &&
        child.morphTargetDictionary
      ) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed,
        );
      }
    });
  };

  useEffect(() => {
    if (!actions['idle']) {
      return;
    }
    actions['idle'].play();
  }, []);

  const { playAudio, script } = useControls({
    playAudio: false,
    script: {
      value: 'sam',
    },
  });

  const audio = useMemo(() => new Audio(`/audio/${script}.mp3`), [script]);
  const jsonFile = useLoader(THREE.FileLoader, `/audio/${script}.json`);
  const lipSync = JSON.parse(jsonFile as string);

  useFrame(() => {
    //eye blink
    const morphTargets = nodes.Eye.morphTargetDictionary as { [key: string]: number };
    Object.keys(morphTargets).forEach(key => {
      if (key === 'eyeBlinkLeft' || key === 'eyeBlinkRight') {
        return;
      }
    });

    lerpMorphTarget('eyeBlinkLeft', blink ? 1 : 0, 0.5);
    lerpMorphTarget('eyeBlinkRight', blink ? 1 : 0, 0.5);

    const appliedMorphTargets: string[] = [];
    const currentAudioTime = audio.currentTime;

    Object.values(visemes).forEach(value => {
      if (appliedMorphTargets.includes(value)) {
        return;
      }
      lerpMorphTarget(value, 0, 0.1);
    });

    for (let i = 0; i < lipSync.mouthCues.length; i++) {
      const mouthCue = lipSync.mouthCues[i];
      if (
        currentAudioTime >= mouthCue.start &&
        currentAudioTime <= mouthCue.end
      ) {
        const visemeKey = mouthCue.value as keyof iVisemes;
        appliedMorphTargets.push(visemes[visemeKey]);
        lerpMorphTarget(visemes[visemeKey], 1, 0.2);
        break;
      }
    }
  });

  useEffect(() => {
    if (playAudio) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [playAudio, script]);

  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 100);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature">
          <primitive object={nodes.Root} />
          <primitive object={nodes.neutral_bone} />
          <skinnedMesh
            name="Body"
            geometry={nodes.Body.geometry}
            material={materials['N00_006_01_Shoes_01_CLOTH (Instance)']}
            skeleton={nodes.Body.skeleton}
          />
          <skinnedMesh
            name="Body001"
            geometry={nodes.Body001.geometry}
            material={materials['N00_000_00_Body_00_SKIN (Instance)']}
            skeleton={nodes.Body001.skeleton}
          />
          <skinnedMesh
            name="Body002"
            geometry={nodes.Body002.geometry}
            material={materials['N00_001_01_Bottoms_01_CLOTH (Instance)']}
            skeleton={nodes.Body002.skeleton}
          />
          <skinnedMesh
            name="Body003"
            geometry={nodes.Body003.geometry}
            material={materials['N00_001_01_Tops_01_CLOTH (Instance)']}
            skeleton={nodes.Body003.skeleton}
          />
          <skinnedMesh
            name="Body004"
            geometry={nodes.Body004.geometry}
            material={materials['N00_000_00_HairBack_00_HAIR (Instance)']}
            skeleton={nodes.Body004.skeleton}
          />
          <skinnedMesh
            name="Hair"
            geometry={nodes.Hair.geometry}
            material={materials['N00_000_Hair_00_HAIR (Instance)']}
            skeleton={nodes.Hair.skeleton}
          />
          <skinnedMesh
            name="Brow"
            geometry={nodes.Brow.geometry}
            material={materials['N00_000_00_FaceBrow_00_FACE (Instance)']}
            skeleton={nodes.Brow.skeleton}
            morphTargetDictionary={nodes.Brow.morphTargetDictionary}
            morphTargetInfluences={nodes.Brow.morphTargetInfluences}
          />
          <skinnedMesh
            name="Eye"
            geometry={nodes.Eye.geometry}
            material={materials['N00_000_00_EyeIris_00_EYE (Instance)']}
            skeleton={nodes.Eye.skeleton}
            morphTargetDictionary={nodes.Eye.morphTargetDictionary}
            morphTargetInfluences={nodes.Eye.morphTargetInfluences}
          />
          <skinnedMesh
            name="Eyeline"
            geometry={nodes.Eyeline.geometry}
            material={materials['N00_000_00_FaceEyeline_00_FACE (Instance)']}
            skeleton={nodes.Eyeline.skeleton}
            morphTargetDictionary={nodes.Eyeline.morphTargetDictionary}
            morphTargetInfluences={nodes.Eyeline.morphTargetInfluences}
          />
          <group name="Face">
            <skinnedMesh
              name="Face_(merged)(Clone)baked004"
              geometry={nodes['Face_(merged)(Clone)baked004'].geometry}
              material={materials['N00_000_00_Face_00_SKIN (Instance)']}
              skeleton={nodes['Face_(merged)(Clone)baked004'].skeleton}
              morphTargetDictionary={
                nodes['Face_(merged)(Clone)baked004'].morphTargetDictionary
              }
              morphTargetInfluences={
                nodes['Face_(merged)(Clone)baked004'].morphTargetInfluences
              }
            />
            <skinnedMesh
              name="Face_(merged)(Clone)baked004_1"
              geometry={nodes['Face_(merged)(Clone)baked004_1'].geometry}
              material={materials['N00_000_00_EyeWhite_00_EYE (Instance)']}
              skeleton={nodes['Face_(merged)(Clone)baked004_1'].skeleton}
              morphTargetDictionary={
                nodes['Face_(merged)(Clone)baked004_1'].morphTargetDictionary
              }
              morphTargetInfluences={
                nodes['Face_(merged)(Clone)baked004_1'].morphTargetInfluences
              }
            />
            <skinnedMesh
              name="Face_(merged)(Clone)baked004_2"
              geometry={nodes['Face_(merged)(Clone)baked004_2'].geometry}
              material={materials['N00_000_00_FaceMouth_00_FACE (Instance)']}
              skeleton={nodes['Face_(merged)(Clone)baked004_2'].skeleton}
              morphTargetDictionary={
                nodes['Face_(merged)(Clone)baked004_2'].morphTargetDictionary
              }
              morphTargetInfluences={
                nodes['Face_(merged)(Clone)baked004_2'].morphTargetInfluences
              }
            />
          </group>
          <skinnedMesh
            name="Hightlight"
            geometry={nodes.Hightlight.geometry}
            material={materials['N00_000_00_EyeHighlight_00_EYE (Instance)']}
            skeleton={nodes.Hightlight.skeleton}
            morphTargetDictionary={nodes.Hightlight.morphTargetDictionary}
            morphTargetInfluences={nodes.Hightlight.morphTargetInfluences}
          />
          <skinnedMesh
            name="Mouth"
            geometry={nodes.Mouth.geometry}
            material={materials['N00_000_00_FaceMouth_00_FACE (Instance)']}
            skeleton={nodes.Mouth.skeleton}
            morphTargetDictionary={nodes.Mouth.morphTargetDictionary}
            morphTargetInfluences={nodes.Mouth.morphTargetInfluences}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/base-transformed.glb');
