import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

const LoadingMaterial = shaderMaterial(
  {
    uTime: 0,
    uAlpha: 1,
    uResolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    uDpr: Number(window.devicePixelRatio.toFixed(2)),
    uScale: 0,
    uTexture: null,
    uTexture2: null,
    uRes: new THREE.Vector2(1, 1),
    uImageRes: [1, 1],
    uProgress: 0,
  },
  /* glsl */ `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec3 pos = position;
        gl_Position = vec4(pos, 1.);
    }
 `,
  /* glsl */ `
    uniform float uTime;
    uniform float uAlpha;
    uniform float uScale;
    uniform vec2 uResolution;
    uniform float uDpr;
    uniform sampler2D uTexture;
    uniform sampler2D uTexture2;
    uniform vec2 uRes;
    uniform vec2 uImageRes;
    uniform float uProgress;

    varying vec2 vUv;

    //* Circle Function
    float circle(in vec2 st, in float radius, in float blurriness){
      vec2 dist = st;
      return 1.-smoothstep(radius-(radius*blurriness), radius+(radius*blurriness), dot(dist,dist)*4.0);
  }
  //* Noise Function
  //? https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1. + 3.0 * C.xxx;
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );   
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

    vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
      float rs = s.x / s.y;
      float ri = i.x / i.y; 
      vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x); 
      vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st; 
      return u * s / st + o;
    }

    void main() {
      vec2 res = uResolution.xy * uDpr;
      vec2 uv = vUv - vec2(0.5);
      uv.y *= res.y / res.x;

      vec2 circlePos = uv + vec2(0.5);
      vec2 scaledUv = uv * 2.0;

      float offsetX = uv.x + sin(uv.y + uTime * .2);
      float offsetY = uv.y - uTime * 0.1 - cos(uTime * .2) * .01;

      float c = circle(circlePos - vec2(0.5), uScale, 0.4) * 2.5;
      float noise = snoise(vec3(offsetX * 1.5, offsetY * 1.5, uTime * 0.1) * 2.0) - 1.0;
      float finalMask = smoothstep(0.4, 0.5, noise + c);

      vec4 texture1 = texture2D(uTexture, CoverUV(scaledUv + vec2(0.5), uRes, uImageRes));
      vec4 texture2 = texture2D(uTexture2, CoverUV(scaledUv + vec2(0.5), uRes, uImageRes));
      vec4 finalTexture = mix(texture1, texture2, uProgress);

      vec4 colorA = vec4(vec3(1.0), finalTexture.r * uAlpha);
      vec4 colorB = vec4(0.0);
      vec4 finalColor = mix(colorA, colorB, finalMask);
      
      gl_FragColor = finalColor;
    }
    `,
);

extend({ LoadingMaterial });

export { LoadingMaterial };
