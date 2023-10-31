// @ts-nocheck
import * as THREE from 'three';
import { ReactNode, useEffect, useRef } from 'react';
import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

const ThreeJSComponent = (props: { children?: ReactNode }) => {
  const initialized = useRef<boolean>(false);

  /**
   * ThreeJS blocking (do not use r3f)
   */
  useEffect(() => {
    if (initialized?.current) {
      return;
    } else {
      initialized.current = true;
    }

    // this useEffect function is set to invoke once
    // write your threejs code blocking below:

    let stats;

    let camera, scene, renderer, effect, clock, controls, skyBox, controls2;
    let particleLight, particleLightSky, rootBone, transform;
    let currentVrm = undefined;
    let devicePC = iswap();
    init();
    loadVrmModel();
    animate();

    function init() {
      var fov = 40;
      var near = 1;
      var far = 2500;

      clock = new THREE.Clock();

      const containers = document.getElementsByClassName('game-canvas');
      const canvas = containers[0];
      renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

      camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        near,
        far,
      );
      camera.position.set(-2.5, 18, 10);
      //camera.rotation.x = 45 * Math.PI / 180;

      //

      scene = new THREE.Scene();
      scene.background = '';
      scene.fog = new THREE.Fog(0x392f1c, 11, 100);

      //2nd scene where outLIneEffect will be disabled;
      skyBox = {
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(
          fov,
          window.innerWidth / window.innerHeight,
          near,
          far,
        ),
        //camera has same properties with main camera.
      };
      skyBox.camera.position.set(-2.5, 18, 10);
      //

      renderer.setClearColor(0x000000);
      renderer.setPixelRatio(canvas.clientWidth / canvas.clientHeight);
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.autoClear = false;

      //container.appendChild( renderer.domElement );

      particleLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffedca }),
      );

      scene.add(particleLight);

      particleLightSky = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffedca }),
      );

      skyBox.scene.add(particleLightSky);

      // Lights

      scene.add(new THREE.AmbientLight(0xc1c1ee, 3));
      skyBox.scene.add(new THREE.AmbientLight(0xc1c1ee, 3));

      const pointLight = new THREE.PointLight(0xffedca, 14, 20, 0.5);
      particleLight.add(pointLight);

      const pointLightSky = new THREE.PointLight(0xffedca, 14, 20, 0.5);
      particleLightSky.add(pointLightSky);

      //
      if (devicePC) effect = new OutlineEffect(renderer);

      //
      stats = new Stats();
      canvas.appendChild(stats.dom);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 17.5, 0);
      controls.minDistance = 8;
      controls.maxDistance = 100;
      controls.update();

      controls2 = new OrbitControls(skyBox.camera, renderer.domElement);
      //controls2.addEventListener('change', camRender );  // for control
      controls2.target.set(0, 17.5, 0);
      controls2.minDistance = 8;
      controls2.maxDistance = 100;
      controls2.update();

      transform = new TransformControls(camera, renderer.domElement);
      transform.addEventListener('change', render);

      transform.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value;
        controls2.enabled = !event.value;
      });

      scene.add(transform);

      window.addEventListener('resize', onWindowResize);

      window.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
          case 81: // Q
            transform.setSpace(transform.space === 'local' ? 'world' : 'local');
            break;

          case 87: // W
            transform.setMode('translate');
            break;

          case 69: // E
            transform.setMode('rotate');
            break;
        }
      });
    }

    function loadVrmModel() {
      const loader = new GLTFLoader();
      loader.crossOrigin = 'anonymous';

      loader.register(parser => {
        return new VRMLoaderPlugin(parser);
      });

      loader.load(
        './assets/model/zero_two.vrm',

        gltf => {
          const vrm = gltf.userData.vrm;

          // calling these functions greatly improves the performance
          VRMUtils.removeUnnecessaryVertices(gltf.scene);
          VRMUtils.removeUnnecessaryJoints(gltf.scene);

          // Disable frustum culling
          vrm.scene.traverse(obj => {
            if (obj.isMesh && devicePC) {
              var matArray = Array.isArray(obj.material);
              if (matArray) {
                for (var i = 0; i < obj.material.length; i++) {
                  //matChange( obj, obj.material[ i ] );
                  var diffuseMap = obj.material[i].map;
                  var side = obj.material[i].side;
                  if (side != 2) obj.userData.singleSide = 'true';

                  var _alphaTest = obj.material[i]._alphaTest;
                  var name = obj.material[i].name;
                  const toonMaterial = new THREE.MeshToonMaterial({
                    name: name,
                    color: 0xffffff,
                    map: diffuseMap,
                    side: THREE.DoubleSide,
                    alphaTest: _alphaTest,
                    //gradientMap: threeTone
                  });
                  obj.recieveShadow = true;
                  obj.castShadow = true;
                  obj.material[i] = toonMaterial;
                  obj.frustumCulled = false;
                  obj.material.needsUpdate = true;
                  obj.needsUpdate = true;
                }
              } else {
                var diffuseMap = obj.material.map;
                var side = obj.material.side;
                if (side != 2) obj.userData.singleSide = 'true';
                var _alphaTest = obj.material._alphaTest;
                const toonMaterial = new THREE.MeshToonMaterial({
                  color: 0xffffff,
                  map: diffuseMap,
                  side: THREE.DoubleSide,
                  alphaTest: _alphaTest,
                  //gradientMap: threeTone
                });
                obj.recieveShadow = true;
                obj.castShadow = true;
                //obj.material = toonMaterial;
                obj.frustumCulled = false;
                obj.needsUpdate = true;
              }
            }
          });
          vrm.scene.scale.set(12, 12, 12);
          scene.add(vrm.scene);
          console.log(scene);
          rootBone = scene.children[3].children[5].children[0];
          rootBone.rotateY(3.14);

          transform.attach(rootBone);
          scene.traverse(child => {
            if (child.isMesh && child.userData.singleSide);
            //skyBox.scene.add(child);
          });
          currentVrm = vrm;
        },

        progress =>
          console.log(
            'Loading model...',
            100.0 * (progress.loaded / progress.total),
            '%',
            'time:',
            clock.getDelta(),
          ),

        error => console.error(error),
      );
    }

    function onWindowResize() {
      const container = document.querySelector('.world');
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        container.clientWidth == 0 ? 440 : container.clientWidth,
        container.clientHeight,
      );
      renderer.render(scene, camera);
    }

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = (canvas.clientWidth * pixelRatio) | 0;
      const height = (canvas.clientHeight * pixelRatio) | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }

      return needResize;
    }

    //

    function animate() {
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      const dt = clock.getDelta();
      //if(mixer) mixer.update( dt );
      if (currentVrm) currentVrm.update(dt);
      stats.begin();
      render();
      stats.end();
      requestAnimationFrame(animate);
    }

    function render() {
      const timer = Date.now() * 0.00025;
      skyBox.camera.copy(camera);

      particleLight.position.x = Math.sin(timer * 3) * 10;
      particleLight.position.y = Math.cos(timer * 3) * 5 + 20;
      particleLight.position.z = Math.cos(timer * 3) * 20;

      particleLightSky.position.x = Math.sin(timer * 3) * 10;
      particleLightSky.position.y = Math.cos(timer * 3) * 5 + 20;
      particleLightSky.position.z = Math.cos(timer * 3) * 20;

      /* 				var azimuthalAngle = controls.getAzimuthalAngle();
			if(rootBone)rootBone.rotation.y = azimuthalAngle; */

      if (devicePC) {
        effect.render(scene, camera);
        renderer.render(skyBox.scene, skyBox.camera);
      } else {
        renderer.render(scene, camera);
        renderer.render(skyBox.scene, skyBox.camera);
      }
    }

    function iswap() {
      var uA = navigator.userAgent.toLowerCase();
      var ipad = uA.match(/ipad/i) == 'ipad';
      var iphone = uA.match(/iphone os/i) == 'iphone os';
      var midp = uA.match(/midp/i) == 'midp';
      var uc7 = uA.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
      var uc = uA.match(/ucweb/i) == 'ucweb';
      var android = uA.match(/android/i) == 'android';
      var windowsce = uA.match(/windows ce/i) == 'windows ce';
      var windowsmd = uA.match(/windows mobile/i) == 'windows mobile';
      if (
        !(
          ipad ||
          iphone ||
          midp ||
          uc7 ||
          uc ||
          android ||
          windowsce ||
          windowsmd
        )
      ) {
        return 'true';
      } else {
        return 'false';
      }
    }

    ///////////////////////////////////
    ///////////////////////////////////
    ////                           ////
    ////          End              ////
    ////                           ////
    ///////////////////////////////////
    ///////////////////////////////////
  }, []);

  return <>{props?.children || null}</>;
};

export default ThreeJSComponent;
