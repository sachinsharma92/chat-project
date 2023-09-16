import {
  Bloom,
  BrightnessContrast,
  EffectComposer,
  HueSaturation,
  SMAA,
  Sepia,
} from '@react-three/postprocessing';

const Effects = () => {
 
  return (
    <>
      <EffectComposer disableNormalPass multisampling={0}>
        <SMAA />
        <HueSaturation saturation={-0.15} />
        <Sepia intensity={0.28} />
        <BrightnessContrast brightness={0.01} contrast={0.3} />
        <Bloom mipmapBlur luminanceThreshold={1} />
      </EffectComposer>
    </>
  );
};

export default Effects;
