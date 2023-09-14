import {
  BrightnessContrast,
  EffectComposer,
  SMAA,
  Sepia,
} from '@react-three/postprocessing';

const Effects = () => {
  return (
    <>
      <EffectComposer disableNormalPass multisampling={0}>
        <SMAA />
        <Sepia intensity={0.28} />
        <BrightnessContrast brightness={0.07} contrast={0.35} />
      </EffectComposer>
    </>
  );
};

export default Effects;
