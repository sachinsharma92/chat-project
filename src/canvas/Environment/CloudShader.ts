import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const CloudShaderMaterial = shaderMaterial(
  {
    uCloudTexture: null,
    uSNoise: null,
    uMNoise: null,
    uLNoise: null,
    uTime: 0,
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main () {
        vUv = uv;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
  /* glsl */ `
  uniform sampler2D uCloudTexture;
  uniform sampler2D uSNoise;
  uniform sampler2D uMNoise;
  uniform sampler2D uLNoise;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vNormal;

  float uvScale = 3.0;
  float uSFloat = 16.0 * 4.0;
  float uMFloat = 0.25 * 4.0;
  float uLFloat = 0.1 * 4.0;
  float uCloudFloat = 1.0 * 4.0;

  float uScrollSpeed = 70.0;
  vec2 uVector = vec2(0.5, 1.0);
  float uCloudFactor = 0.42;

  float toSRGB(float value) {
    if (value <= 0.0031308) {
      return 12.92 * value;
    }
    else {
      return 1.055 * pow(value, 1.0 / 2.4) - 0.055;
  }}

  void main() {
  vec3 uSkyColor = vec3(0.2, 0.7, 0.9);
  vec3 uCloudColor = vec3(1.0, 1.0, 1.0);
  vec2 uv = vUv * uvScale;
  //SNoise Scale
  vec2 sNScale = uv * uSFloat;
  //SNoise
  vec4 sNoise = texture2D(uSNoise, sNScale);
  float g1 = sNoise.g;
  g1 = toSRGB(g1);
  float rG1 = 0.0 + (g1 - 0.0) * (0.007 - 0.0) / (1.0 - 0.0);
  vec2 xy = vec2(rG1, rG1);
  //Add SNoise to UV
  vec2 addSNToUv = uv + xy;

  //MNoise Scale
  vec2 mNScale = uv * uMFloat;
  //MNoise
  vec4 mNoise = texture2D(uMNoise, mNScale);
  float g2 = mNoise.g;
  g2 = toSRGB(g2);
  float rG2 = 0.0 + (g2 - 0.0) * (0.1 - 0.0) / (1.0 - 0.0);
  vec2 xy1 = vec2(rG2, rG2);
  //Add MNoise to UV
  vec2 addMNToUv = addSNToUv + xy1;

  //LNoise Scale
  vec2 lNScale = uv * uLFloat;
  //LNoise
  vec4 lNoise = texture2D(uLNoise, lNScale);
  float g3 = lNoise.g;
  g3 = toSRGB(g3);
  float rG3 = 0.0 + (g3 - 0.0) * (0.1 - 0.0) / (1.0 - 0.0);
  vec2 xy2 = vec2(rG3, rG3);
  //Add LNoise to UV
  vec2 addLNToUv = addMNToUv + xy2;
  float output17 = uTime / uScrollSpeed;
  vec2 xy3 = vec2(output17, uLFloat);

  //addtime to uv
  vec2 timedUv = addLNToUv + xy3;
  //make cloud flatter
  vec2 flatter = timedUv * uVector;

  //Cloud Texture
  vec4 cloudTexture = texture2D(uCloudTexture, flatter);
  float g = cloudTexture.g;
  g = toSRGB(g);
  float remappedCloud = 0.0 + (g - uCloudFactor) * (1.0 - 0.0) / (1.0 - uCloudFactor);
  float clampedCloud = clamp(remappedCloud, 0.0, 1.0);

  vec3 sunColor = vec3(1.0, 1.0, 1.0);
  vec3 shadedCloud = mix(uCloudColor, sunColor, clampedCloud);

  vec3 lerpedCloud = mix(uSkyColor, shadedCloud, clampedCloud);
  gl_FragColor = vec4(lerpedCloud, 1.0);
}

`,
);

extend({ CloudShaderMaterial });

export { CloudShaderMaterial };
