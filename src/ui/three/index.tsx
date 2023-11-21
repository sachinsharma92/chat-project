// @ts-nocheck
import * as THREE from 'three';
import { ReactNode, useEffect, useRef } from 'react';
import { visemeLoader } from './lib/visemeLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { BotChatEvents } from '@/ui/features/Chat/hooks/useBotChat';

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

	let clock, scene, camera, renderer, controls, mixer, effect, sound, action;
    let devicePC = iswap();
/*     var isPlaying = false; */


/* 	var vise = './audio/viseme5';
	var visemeJSON = vise.concat( '.json' ); */

    initGraph();
	loadMesh();
    animate();
  
		function initGraph() {

			const containers = document.getElementsByClassName( 'game-canvas' );
            containers[0].addEventListener( 'click', playViseme );
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


        function playViseme(){
/* 
            if ( isPlaying == false ) {

                sound.play();
                action.reset();
                action.setLoop ( THREE.LoopOnce );
                action.play();
                isPlaying = true;


            } */
            console.log(mixer);
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
                mixer = new THREE.AnimationMixer( mesh );
                //mixer.addEventListener( 'finished', restoreState );


                gltf.scene.traverse( function ( child ) {

                    if ( child.isMesh ) {

                        const material = new THREE.MeshToonMaterial();
                        const map = child.material.map;
                        child.material = material;
                        child.material.map = map;

                    }

                } );

                gltf.scene.scale.set( 2, 2, 2 );
                scene.add( gltf.scene );

                BotChatEvents.on('audio', ({ visemes }) => {

                    console.log(visemes);
                    const visemeIdOffset = 53;
                    const trackTimes = [];
                    const trackValues = [];
            
                    const morphDict = mesh.morphTargetDictionary;
            
                    const shapeKeyLength = Object.getOwnPropertyNames( morphDict ).length;
            
                    const myName = mesh.name.concat( '.morphTargetInfluences' );
            
                    for ( var i = 0; i < visemes.length; i ++ ) {
            
                        for ( var j = 0; j < shapeKeyLength; j ++ ) {
            
                            var amplitude = 1;
            
                            if ( i < visemes.length - 1 ) {
            
                                var temp = visemes[ i + 1 ].AudioOffset - visemes[ i ].AudioOffset;
                                amplitude = temp > 1000000 ? 1 : temp / 1000000 * 1.5;
            
                            }
            
                            var value = visemes[ i ].VisemeId + visemeIdOffset == j ? amplitude : 0;
            
                            value = j == 53 ? 0 : value;
                            trackValues.push( value );
            
                        }
            
                        var duration = visemes[ i ].AudioOffset;
                        trackTimes.push( duration / 10000 );
            
                    }
            
                    const visemeTrack = new THREE.NumberKeyframeTrack( myName, trackTimes, trackValues );
                    console.log(visemeTrack);
                    const visemeTimeLaps = visemeTrack.times[ visemeTrack.times.length - 1 ];



                    var blinkTrack = creatBlinkTrack( mesh, true );
                    const lipTracks = [];
                    const blinkTracks = [];
                    blinkTracks.push( blinkTrack );
                    lipTracks.push( visemeTrack ); 
        
                    const clip = new THREE.AnimationClip( '', visemeTimeLaps, lipTracks );

        
                    var blinkTrackTimeLaps = blinkTrack.times[ blinkTrack.times.length - 1 ];
                    const blinkClip = new THREE.AnimationClip( '', blinkTrackTimeLaps, blinkTracks );
        
                    action = mixer.clipAction( clip );
                    const action1 = mixer.clipAction( blinkClip );
        
                    action.setDuration( visemeTimeLaps / 1000 );
                    action.loop = THREE.LoopOnce;
                    action.play();
                    action1.play();
        
                });

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
