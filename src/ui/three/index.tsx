// @ts-nocheck
import * as THREE from 'three';
import { ReactNode, useEffect, useRef } from 'react';
import { visemeLoader } from './lib/visemeLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


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

	let clock, scene, camera, renderer, controls, mixer, effect, sound;
    let devicePC = iswap();

	var vise = './audio/viseme5';
	var visemeJSON = vise.concat( '.json' );

    initGraph();
	loadMesh();

  
		function initGraph() {

			const containers = document.getElementsByClassName( 'game-canvas' );
			const canvas = containers[0];
			renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

            clock = new THREE.Clock();

            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 5000 );
            camera.position.set( - .5, 3.35, .7 );

            const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
            scene.add( hemiLight );

            const dirLight = new THREE.DirectionalLight( 0xffffff, 2 );

            dirLight.position.set( - 2, 0.75, 2 );
            dirLight.position.multiplyScalar( 10 );
            scene.add( dirLight );

            dirLight.castShadow = true;

            dirLight.shadow.mapSize.width = 2048;
            dirLight.shadow.mapSize.height = 2048;

            const d = 50;

            dirLight.shadow.camera.left = - d;
            dirLight.shadow.camera.right = d;
            dirLight.shadow.camera.top = d;
            dirLight.shadow.camera.bottom = - d;

            dirLight.shadow.camera.far = 13500;

            //Setup the renderer
			renderer.setClearColor( 0x000000);
			renderer.setPixelRatio( canvas.clientWidth / canvas.clientHeight );
			renderer.setSize( canvas.clientWidth, canvas.clientHeight );
			renderer.autoClear = false; 

            renderer.gammaInput = true;
            renderer.gammaOutput = true;

            renderer.shadowMap.enabled = true;

            effect = new OutlineEffect( renderer );

            controls = new OrbitControls( camera, renderer.domElement );
            controls.enableZoom = false;
            controls.enablePan = false;
			controls.enableRotate = false;
            controls.target.set( 0, 3.35, 0 );
            controls.update();

            window.addEventListener( 'resize', onWindowResize );

			const divElem = document.getElementsByClassName( 'world' );

			const resizeObserver = new ResizeObserver( ( entries ) => {
	
				for ( const entry of entries ) {
	
					const { target, contentRect } = entry;
					onWindowResize();
				}
	
			} );
	
			resizeObserver.observe( divElem[ 0 ] );

        }


		function onWindowResize() {

			const container = document.querySelector('.world');
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(  container.clientWidth == 0 ? 440 : container.clientWidth, container.clientHeight );
			renderer.render( scene, camera );
			effect.render( scene, camera );

		}

		function loadMesh() {

            var visemeObj, mesh;

            const loader = new GLTFLoader().setPath( './assets/model/' );

            loader.load( '02viseme.glb', function ( gltf ) {

                mesh = gltf.scene.getObjectByName( 'Face_Baked' );

                visemeObj = new visemeLoader( visemeJSON, mesh, continueWork );

                gltf.scene.traverse( function ( child ) {

                    if ( child.isMesh ) {

                        const material = new THREE.MeshToonMaterial();
                        const map = child.material.map;
                        child.material = material;
                        child.material.map = map;

                    }

                } );

                function continueWork() {

                    var blinkTrack = creatBlinkTrack( mesh, true );

                    const lipTracks = [];
                    const blinkTracks = [];
                    blinkTracks.push( blinkTrack );
                    lipTracks.push( visemeObj.track );

                    const clip = new THREE.AnimationClip( '', visemeObj.timeLaps, lipTracks );

                    var blinkTrackTimeLaps = blinkTrack.times[ blinkTrack.times.length - 1 ];
                    const blinkClip = new THREE.AnimationClip( '', blinkTrackTimeLaps, blinkTracks );

                    mixer = new THREE.AnimationMixer( mesh );


                    const action = mixer.clipAction( clip );
                    const action1 = mixer.clipAction( blinkClip );

                    action.setDuration( visemeObj.timeLaps / 1000 );

                    //audio listner
                    const listener = new THREE.AudioListener();
                    camera.add( listener );
                    sound = new THREE.Audio( listener );
                    sound.autoplay = true;

                    const loader = new THREE.AudioLoader();
                    loader.setPath( './assets/' );

                    loader.load( vise + '.mp3', function ( buffer ) {

                        //sound.stop();
						sound.setBuffer( buffer );
                        sound.duration = visemeObj.timeLaps / 1000;
                        sound.setLoop( false );
						sound.play();
                        action.loop = THREE.LoopOnce;
                        action.play();


					} );

                    action1.play();
                    animate();

                    gltf.scene.scale.set( 2, 2, 2 );
                    scene.add( gltf.scene );

                }

            } );

        }


        function creatBlinkTrack( mesh, blinkWithBrow = false, blinkInterval = 5, blinkInDuration = 0.1, blinkOutDuration = 0.1 ) {

            const blinkKey = [];
            var keys = Object.keys( mesh.morphTargetDictionary );
            var blendShapeLength = keys.length;

            keys.forEach( function ( res ) {

                if ( res.indexOf( 'Blink' ) !== - 1 ) {

                    blinkKey.push( mesh.morphTargetDictionary[ res ] );

                }

                if ( blinkWithBrow ) {

                    if ( res.indexOf( 'browDown' ) !== - 1 ) {

                        blinkKey.push( mesh.morphTargetDictionary[ res ] );

                    }

                }

            } );

            var blinkTimes = Math.round( Math.random() * 10, 0 );

            const trackTimes = [];
            trackTimes.push( 0 );

            const trackValues = [];

            var blinkEye = 0;

            for ( var i = 0; i < blinkTimes; i ++ ) {

                var blinker = Math.random() * blinkInterval / 2 + blinkInterval / 2;
                blinkEye += blinker;

                //                 open(in)        blink    blinklast        open(out)
                trackTimes.push( blinkEye - blinkInDuration, blinkEye, blinkEye + blinkOutDuration / 10, blinkEye + blinkOutDuration );

            }

            for ( var i = 0; i < trackTimes.length; i ++ ) {


                for ( var j = 0; j < blendShapeLength; j ++ ) {

                    var value;
                    // open-open(in)-blink-blink-open(out)-open(in)-blink-blink-open(out)
                    //  0      1      2     3      4          5      6      7      8
                    //  So, It is ( 2 + 2 ) % 4 == 0 , ( 3 + 1 ) % 4 = 0;
                    if ( ( blinkKey.indexOf( j ) !== - 1 ) && ( ( i + 2 ) % 4 == 0 || ( i + 1 ) % 4 == 0 ) ) {

                        value = 2;

                    } else {

                        value = 0;

                    }

                    trackValues.push( value );

                    }

            }

            const myName = mesh.name.concat( '.morphTargetInfluences' );
            const blinkTrack = new THREE.NumberKeyframeTrack( myName, trackTimes, trackValues );

            return blinkTrack;

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
			if(mixer) mixer.update( dt );
			requestAnimationFrame( animate );
			effect.render( scene, camera );

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
