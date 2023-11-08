// @ts-nocheck
import * as THREE from 'three';
import { ReactNode, useEffect, useRef } from 'react';
import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

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
    let particleLight, particleLightSky, rootBone;
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

			camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, near, far );
			camera.position.set(-3.4,18.3, 10);
			//camera.rotation.x = 45 * Math.PI / 180;

			//

			scene = new THREE.Scene();
			scene.background = '';
			scene.fog = new THREE.Fog( 0x392F1C, 11, 100 );


			//2nd scene where outLIneEffect will be disabled;
			skyBox = {
				scene: new THREE.Scene(),
				camera: new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, near, far  )
			//camera has same properties with main camera.
			};
			skyBox.camera.position.set(-3.4,18.3, 10);
			//

			renderer.setClearColor( 0x000000);
			renderer.setPixelRatio( canvas.clientWidth / canvas.clientHeight );
			renderer.setSize( canvas.clientWidth, canvas.clientHeight );
			renderer.autoClear = false; 

			//container.appendChild( renderer.domElement );



			// Lights

			scene.add( new THREE.AmbientLight( 0xc1c1ee, 3 ) );
			skyBox.scene.add( new THREE.AmbientLight( 0xc1c1ee, 3 ) );


			const pointLight = new THREE.PointLight( 0xFFEDCA, 14, 20, 0.5 );
			pointLight.position.set(-8.0,17,-11);
			scene.add(pointLight);

			const pointLightSky = new THREE.PointLight( 0xFFEDCA, 14, 20, 0.5 );
			pointLightSky.position.set(-8.0,17,-11);
			skyBox.scene.add(pointLightSky);


			//
			if(devicePC)	effect = new OutlineEffect( renderer );

			//
			stats = new Stats();
			canvas.appendChild( stats.dom );

			controls = new OrbitControls( camera, renderer.domElement );
			controls.target.set( 0, 18.6, 0 );
			//controls.minDistance = 8;
			//controls.maxDistance = 100;
			controls.enablePan = false;
			controls.enableZoom  = false;
			controls.maxPolarAngle = Math.PI * 18 / 36;
			controls.minPolarAngle = Math.PI * 18 / 36;
			controls.update();



			controls2 = new OrbitControls( skyBox.camera, renderer.domElement );
			//controls2.addEventListener('change', camRender );  // for control
			controls2.target.set( 0, 18.6, 0 );
			//controls2.minDistance = 8;
			//controls2.maxDistance = 100;
			controls2.enablePan = false;
			controls2.enableZoom  = false;
			controls2.maxPolarAngle = Math.PI * 18 / 36;
			controls2.minPolarAngle = Math.PI * 18 / 36;
			controls2.update();




			window.addEventListener( 'resize', onWindowResize );


		}

		function loadVrmModel(){

			const loader = new GLTFLoader();
			loader.crossOrigin = 'anonymous';

			loader.register( ( parser ) => {

				return new VRMLoaderPlugin( parser );

			} );

			loader.load(

				'./assets/model/zero_two.vrm',

				( gltf ) => {

					const vrm = gltf.userData.vrm;

					// calling these functions greatly improves the performance
					VRMUtils.removeUnnecessaryVertices( gltf.scene );
					VRMUtils.removeUnnecessaryJoints( gltf.scene );

					// Disable frustum culling
					vrm.scene.traverse( ( obj ) => {
						if ( obj.isMesh && devicePC ){
							var matArray = Array.isArray(obj.material);
							if(matArray){
								for(var i=0; i<obj.material.length; i++){
									//matChange( obj, obj.material[ i ] );
									var diffuseMap = obj.material[i].map;
									var side = obj.material[i].side;
									if(side!=2)
									obj.userData.singleSide = "true";

									var _alphaTest = obj.material[i]._alphaTest;
									var name = obj.material[i].name;
									const toonMaterial = new THREE.MeshToonMaterial( {
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

							}else{

								var diffuseMap = obj.material.map;
								var side = obj.material.side;
								if(side!=2)
									obj.userData.singleSide = "true";
								var _alphaTest = obj.material._alphaTest;
								const toonMaterial = new THREE.MeshToonMaterial( {
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
					vrm.scene.scale.set(12,12,12);
					scene.add( vrm.scene );
					console.log(scene);
					rootBone = scene.children[2].children[5].children[0];
					rootBone.rotateY(3.14);

					scene.traverse( ( child ) => {

						if(child.isMesh && child.userData.singleSide);
						//skyBox.scene.add(child);

					});
					currentVrm = vrm;

				},

				( progress ) => (console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ,'time:',clock.getDelta())),

				( error ) => console.error( error )

			);
		}

		function onWindowResize() {

			const container = document.querySelector('.world');
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(  container.clientWidth == 0 ? 440 : container.clientWidth, container.clientHeight );
			renderer.render( scene, camera );

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
			if ( currentVrm ) currentVrm.update(dt);
			stats.begin();
			render();
			stats.end();
			requestAnimationFrame( animate );
		}

		function render() {

			const timer = Date.now() * 0.00025;
			skyBox.camera.copy(camera);

			var azimuthalAngle = controls.getAzimuthalAngle();
			if(rootBone)rootBone.rotation.y = azimuthalAngle;

			if(devicePC){  
				effect.render(scene,camera);
				renderer.render(skyBox.scene, skyBox.camera);
			}else{
				renderer.render( scene, camera );
				renderer.render( skyBox.scene, skyBox.camera );
			}

		}


		function iswap() {
			var uA = navigator.userAgent.toLowerCase();
			var ipad = uA.match(/ipad/i) == "ipad";
			var iphone = uA.match(/iphone os/i) == "iphone os";
			var midp = uA.match(/midp/i) == "midp";
			var uc7 = uA.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
			var uc = uA.match(/ucweb/i) == "ucweb";
			var android = uA.match(/android/i) == "android";
			var windowsce = uA.match(/windows ce/i) == "windows ce";
			var windowsmd = uA.match(/windows mobile/i) == "windows mobile"; 
			if (!(ipad || iphone || midp || uc7 || uc || android || windowsce || windowsmd)) {
				return 'true';
			}else{
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
