import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outlines, useGLTF, useTexture } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';
import { colorStore, hairStyleStore } from '@/store/Avatar';

const corresponding = {
  A: 'Fcl_MTH_Close',
  B: 'Fcl_MTH_E',
  C: 'Fcl_MTH_A',
  D: 'Fcl_MTH_O',
  E: 'viseme_O',
  F: 'viseme_U',
  G: 'viseme_FF',
  H: 'viseme_TH',
  X: 'viseme_pp',
};

export default function ZeroTwo(props) {
  const { nodes, materials, scene } = useGLTF('/vrm-transformed.glb');

  const [blink, setBlink] = useState(false);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse(child => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
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

  const { playAudio, script } = useControls({
    playAudio: false,
    script: {
      value: 'sam',
      options: ['sam', 'gigi', 'josh'],
    },
  });

  const audio = useMemo(() => new Audio(`/audio/${script}.mp3`), [script]);
  const jsonFile = useLoader(THREE.FileLoader, `/audio/${script}.json`);
  const lipSync = JSON.parse(jsonFile);

  useFrame(() => {
    lerpMorphTarget('Fcl_EYE_Close_L', blink ? 1 : 0, 0.5);
    lerpMorphTarget('Fcl_EYE_Close_R', blink ? 1 : 0, 0.5);

    const appliedMorphTargets = [];
    const currentAudioTime = audio.currentTime;

    Object.values(corresponding).forEach(value => {
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
        appliedMorphTargets.push(corresponding[mouthCue.value]);
        lerpMorphTarget(corresponding[mouthCue.value], 1, 0.2);
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
    let blinkTimeout;
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

  useEffect(() => {
    console.log(nodes['Face_(merged)baked'].morphTargetDictionary);
  }, []);

  const color = colorStore(state => state.color);
  const hairstyle = hairStyleStore(state => state.hairStyle);

  const geo = new THREE.SphereGeometry(0.12, 32, 32);
  geo.translate(0, 1.75, 0);

  return (
    <group {...props} dispose={null}>
      <primitive object={nodes.Root} />
      <skinnedMesh
        name="hair"
        geometry={hairstyle ? geo : nodes.Hair.geometry}
        material={materials['N00_000_Hair_00_HAIR (Instance)']}
        skeleton={nodes.Hair.skeleton}
        material-color={color}
      ></skinnedMesh>
      <skinnedMesh
        name="neck"
        geometry={nodes['Body_(merged)baked'].geometry}
        material={materials['N00_000_00_Body_00_SKIN (Instance)']}
        skeleton={nodes['Body_(merged)baked'].skeleton}
      />
      <skinnedMesh
        geometry={nodes['Body_(merged)baked_1'].geometry}
        material={materials['N00_008_01_Shoes_01_CLOTH (Instance)']}
        skeleton={nodes['Body_(merged)baked_1'].skeleton}
      />
      <skinnedMesh
        geometry={nodes['Body_(merged)baked_2'].geometry}
        material={materials['N00_002_04_Tops_01_CLOTH (Instance)']}
        skeleton={nodes['Body_(merged)baked_2'].skeleton}
      />
      <skinnedMesh
        geometry={nodes['Body_(merged)baked_3'].geometry}
        material={materials['N00_001_01_Accessory_Tie_01_CLOTH (Instance)']}
        skeleton={nodes['Body_(merged)baked_3'].skeleton}
      />
      <skinnedMesh
        geometry={nodes['Body_(merged)baked_4'].geometry}
        material={materials['N00_000_00_HairBack_00_HAIR (Instance)']}
        skeleton={nodes['Body_(merged)baked_4'].skeleton}
      />
      <skinnedMesh
        geometry={nodes.Hair001baked025.geometry}
        material={materials.F00_000_Hair_00_HAIR_03}
        skeleton={nodes.Hair001baked025.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Hair001baked025_1.geometry}
        material={materials.F00_000_Hair_00_HAIR_04}
        skeleton={nodes.Hair001baked025_1.skeleton}
      />
      <skinnedMesh
        name="Face_(merged)baked"
        geometry={nodes['Face_(merged)baked'].geometry}
        material={materials['N00_000_00_FaceMouth_00_FACE (Instance)']}
        skeleton={nodes['Face_(merged)baked'].skeleton}
        morphTargetDictionary={
          nodes['Face_(merged)baked'].morphTargetDictionary
        }
        morphTargetInfluences={
          nodes['Face_(merged)baked'].morphTargetInfluences
        }
      />
      <skinnedMesh
        name="Face_(merged)baked_1"
        geometry={nodes['Face_(merged)baked_1'].geometry}
        material={materials['N00_000_00_EyeIris_00_EYE (Instance)']}
        skeleton={nodes['Face_(merged)baked_1'].skeleton}
        morphTargetDictionary={
          nodes['Face_(merged)baked_1'].morphTargetDictionary
        }
        morphTargetInfluences={
          nodes['Face_(merged)baked_1'].morphTargetInfluences
        }
      />
      <skinnedMesh
        name="Face_(merged)baked_2"
        geometry={nodes['Face_(merged)baked_2'].geometry}
        material={materials['N00_000_00_EyeHighlight_00_EYE (Instance)']}
        skeleton={nodes['Face_(merged)baked_2'].skeleton}
        morphTargetDictionary={
          nodes['Face_(merged)baked_2'].morphTargetDictionary
        }
        morphTargetInfluences={
          nodes['Face_(merged)baked_2'].morphTargetInfluences
        }
      />
      <skinnedMesh
        name="Face_(merged)baked_3"
        geometry={nodes['Face_(merged)baked_3'].geometry}
        material={materials['N00_000_00_Face_00_SKIN (Instance)']}
        skeleton={nodes['Face_(merged)baked_3'].skeleton}
        morphTargetDictionary={
          nodes['Face_(merged)baked_3'].morphTargetDictionary
        }
        morphTargetInfluences={
          nodes['Face_(merged)baked_3'].morphTargetInfluences
        }
      />
      <skinnedMesh
        name="Face_(merged)baked_4"
        geometry={nodes['Face_(merged)baked_4'].geometry}
        material={materials['N00_000_00_EyeWhite_00_EYE (Instance)']}
        skeleton={nodes['Face_(merged)baked_4'].skeleton}
        morphTargetDictionary={
          nodes['Face_(merged)baked_4'].morphTargetDictionary
        }
        morphTargetInfluences={
          nodes['Face_(merged)baked_4'].morphTargetInfluences
        }
      />
      <skinnedMesh
        name="Face_(merged)baked_5"
        geometry={nodes['Face_(merged)baked_5'].geometry}
        material={materials['N00_000_00_FaceBrow_00_FACE (Instance)']}
        skeleton={nodes['Face_(merged)baked_5'].skeleton}
        morphTargetDictionary={
          nodes['Face_(merged)baked_5'].morphTargetDictionary
        }
        morphTargetInfluences={
          nodes['Face_(merged)baked_5'].morphTargetInfluences
        }
      />
      <skinnedMesh
        name="Face_(merged)baked_6"
        geometry={nodes['Face_(merged)baked_6'].geometry}
        material={materials['N00_000_00_FaceEyelash_00_FACE (Instance)']}
        skeleton={nodes['Face_(merged)baked_6'].skeleton}
        morphTargetDictionary={
          nodes['Face_(merged)baked_6'].morphTargetDictionary
        }
        morphTargetInfluences={
          nodes['Face_(merged)baked_6'].morphTargetInfluences
        }
      />
      <skinnedMesh
        name="Face_(merged)baked_7"
        geometry={nodes['Face_(merged)baked_7'].geometry}
        material={materials['N00_000_00_FaceEyeline_00_FACE (Instance)']}
        skeleton={nodes['Face_(merged)baked_7'].skeleton}
        morphTargetDictionary={
          nodes['Face_(merged)baked_7'].morphTargetDictionary
        }
        morphTargetInfluences={
          nodes['Face_(merged)baked_7'].morphTargetInfluences
        }
      />
    </group>
  );
}

useGLTF.preload('/vrm-transformed.glb');
