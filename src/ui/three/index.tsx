// @ts-nocheck
import * as THREE from 'three';
import { ReactNode, useEffect, useRef } from 'react';
//import { visemeLoader } from './lib/visemeLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { BotChatEvents } from '@/hooks/useBotChat';
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js';
import {
  VRMSpringBoneManager,
  VRMSpringBoneJoint,
  VRMSpringBoneJointHelper,
  VRMSpringBoneColliderShapeSphere,
  VRMSpringBoneCollider,
  VRMSpringBoneColliderHelper,
} from './lib/three-vrm.module.min.js';

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

    let clock,
      scene,
      camera,
      renderer,
      controls,
      blendShapeMixer,
      amatureMixer,
      effect;
    let anchorABone, anchorBBone, sharedSkeleton, faceMesh;
    var sklHelper = false;
    var jointHelper = false;
    var colliderHelper = false;

    const colliders = [];
    const collidersAgent = [];
    const collidersAgentName = [];
    const hairBones = [];
    const hairBonesName = [];
    const springBoneNameGroup = [];
    const springBoneHelperNameGroup = [];

    let devicePC = iswap();

    const springBoneManager = new VRMSpringBoneManager();
    initGraph();
    loadModel('body-1.glb');
    loadModel('hair.glb', 1);
    animate();

    function initGraph() {
      const containers = document.getElementsByClassName('game-canvas');
      const canvas = containers[0];
      renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

      clock = new THREE.Clock();

      scene = new THREE.Scene();
      const envMap = new THREE.TextureLoader().load(
        'https://qxdiuckdrgtbrqtewqcp.supabase.co/storage/v1/object/public/botnet-assets/model/robotech_internal.png?t=2023-12-19T12%3A28%3A19.453Z' ||
          './assets/robotech_internal.png',
      );
      const skybox = new GroundProjectedSkybox(envMap);
      skybox.scale.setScalar(20);
      skybox.height = 3;
      skybox.radius = 8;
      skybox.material.userData.outlineParameters = { visible: false };
      scene.add(skybox);

      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.2,
        5000,
      );
      camera.position.set(-0.3, 1.5, 0.5);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 2);

      dirLight.position.set(1, 1, 3);
      dirLight.position.multiplyScalar(5);
      scene.add(dirLight);

      //Setup the renderer
      renderer.setClearColor(0x000000);
      renderer.setPixelRatio(canvas.clientWidth / canvas.clientHeight);
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.autoClear = false;

      renderer.gammaInput = true;
      renderer.gammaOutput = true;
      renderer.shadowMap.enabled = true;

      effect = new OutlineEffect(renderer);

      controls = new OrbitControls(camera, renderer.domElement);
      //controls.enableZoom = false;
      controls.minDistance = 0.5;
      controls.maxDistance = 5;
      controls.enablePan = false;
      //controls.enableRotate = false;
      controls.target.set(0, 1.5, 0);
      controls.maxPolarAngle = (Math.PI * 18) / 36;
      controls.minPolarAngle = (Math.PI * 18) / 36;
      controls.enableDamping = true;
      controls.dampingFactor = 0.04;
      controls.update();

      window.addEventListener('resize', onWindowResize);

      const divElem = document.getElementsByClassName('world');

      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { target, contentRect } = entry;
          onWindowResize();
        }
      });

      resizeObserver.observe(divElem[0]);
    }

    //skeletonType: 0, Skeleton Sharing类型；
    //skeletonType: 1, 挂载型；
    function loadModel(modelFile, skeletonType = 0, part) {
      var animation;

      const loader = new GLTFLoader().setPath(
        'https://qxdiuckdrgtbrqtewqcp.supabase.co/storage/v1/object/public/botnet-assets/model/' ||
          './assets/model/',
      );
      loader.load(modelFile, function (gltf) {
        const model = gltf.scene;

        scene.add(model);

        const tempMesh = gltf.scene.getObjectByName('face');
        if (tempMesh) {
          faceMesh = tempMesh;
          blendShapeMixer = new THREE.AnimationMixer(faceMesh);
          creatBlinkTrack(faceMesh, true);
          /*                     BotChatEvents.on('audio', ({ visemes }) => {
     
                        creatVisemeTrack( faceMesh, visemes )
    
                    }); */

          BotChatEvents.on('visemes', value => {
            creatVisemeTrack(faceMesh, value.visemes);
          });
        }

        model.traverse(function (object) {
          if (object.isMesh) {
            object.geometry.attributes.uv2 = object.geometry.attributes.uv;
            const aoMap = object.material.aoMap;
            const map = object.material.map;
            const material = new THREE.MeshToonMaterial();
            //////for future hair shader;
            /* 							const material = new NodeToyMaterial( {
                                data
                                } ); */
            object.material = material;
            object.material.map = map;
            object.material.aoMap = aoMap;
            object.castShadow = true;
            object.receiveShadow = true;
          }

          ///////////////////////////////////////////////////Any amature type root shouldn't be anchorA, so here should be && not ||
          if (
            object.isSkinnedMesh &&
            object.skeleton.bones[0].name.indexOf('Root') == -1 &&
            object.skeleton.bones[0].name.indexOf('root') == -1 &&
            object.skeleton.bones[0].name.indexOf('hips') == -1
          ) {
            anchorABone = object.skeleton.bones[0];
          }

          if (
            object.name.indexOf('J_Sec') !== -1 &&
            hairBonesName.indexOf(object.name) == -1
          ) {
            hairBones.push(object);
            hairBonesName.push(object.name);
          }

          if (
            (object.name.indexOf('Collider') !== -1 ||
              object.name.indexOf('collider') !== -1) &&
            collidersAgentName.indexOf(object.name) == -1
          ) {
            collidersAgent.push(object);
            collidersAgentName.push(object.name);
          }
        });

        var nowModel = [];
        var nowModel = model.getObjectsByProperty('type', 'SkinnedMesh');

        if (skeletonType == 0) {
          if (gltf.animations.length > 0) {
            animation = gltf.animations[0];
            sharedSkeleton = nowModel[0].skeleton;
          }

          /////////////////////////Skeleton Sharing                  skeletonSharing();
          for (var i = 0; i < nowModel.length; i++) {
            const oldSkeleton = nowModel[i].skeleton;
            nowModel[i].bind(sharedSkeleton, nowModel[i].matrixWorld);
            if (oldSkeleton !== sharedSkeleton) oldSkeleton.dispose(); //This has some mistake?
          }
        }

        if (anchorABone && sharedSkeleton) {
          anchorBBone = sharedSkeleton.getBoneByName(anchorABone.name);
        }

        ///////////////////////////挂载型，这里需要根据挂载的骨骼进行修改；
        if (anchorBBone && anchorBBone !== anchorABone) {
          anchorBBone.add(anchorABone);
          anchorABone.position.y = 0;
          anchorABone.position.x = 0;
          anchorABone.position.z = 0;
        }

        //////////////////////////创建动力学骨骼
        createPhysicsBone();

        ////////////////Skeleton Helper
        if (sklHelper) {
          var skeletonHelper = new THREE.SkeletonHelper(model);
          scene.add(skeletonHelper);
        }

        /////////////////////////Aniamtion Setup
        if (animation) {
          var action;
          amatureMixer = new THREE.AnimationMixer(nowModel[0]);
          action = amatureMixer.clipAction(animation);
          action.play();
        }
      });
    }

    function createPhysicsBone() {
      ///////////////////////////////////Filter out Collider Helpers
      for (var i = 0; i < collidersAgent.length; i++) {
        if (collidersAgent[i].children.length == 0) {
          const sizeAgent = [];
          sizeAgent.push('_A_', '_B_', '_C_');
          const sizeArray = [];
          sizeArray.push(0.75, 0.25, 0.1);
          var radius;
          for (var j = 0; j < sizeAgent.length; j++) {
            radius =
              collidersAgent[i].name.indexOf(sizeAgent[j]) !== -1
                ? sizeArray[j]
                : 0.05;
          }

          const colliderShape = new VRMSpringBoneColliderShapeSphere({
            radius: radius,
          });
          const collider = new VRMSpringBoneCollider(colliderShape);
          var pos = new THREE.Vector3();
          collider.position.copy(collidersAgent[i].getWorldPosition(pos));
          collidersAgent[i].attach(collider);
          colliders.push(collider);

          //////////Collider helpers Processing
          if (colliderHelper) {
            const helper = new VRMSpringBoneColliderHelper(collider);
            helper.name = helper.collider.name = helper.collider.parent.name;
            scene.add(helper);
          }
        }
      }

      //////////////////////////////Spring bone processing
      for (var i = 0; i < hairBones.length; i++) {
        var hairCluster = [];
        hairBones[i].traverse(function (child) {
          if (child.isBone) hairCluster.push(child);
        });

        for (var j = 0; j < hairCluster.length; j++) {
          if (springBoneNameGroup.indexOf(hairCluster[j].name) == -1) {
            const springBone = new VRMSpringBoneJoint(
              hairCluster[j],
              hairCluster[j + 1],
              { hitRadius: 0.02, stiffness: 0.1, gravityPower: 0.3 },
            );
            springBone.name = hairCluster[j].name;
            springBone.colliderGroups = [{ colliders }];
            springBoneNameGroup.push(springBone.name);
            springBoneManager.addJoint(springBone);
          }
        }
      }

      //Spring Bone Helper Processing
      if (jointHelper) {
        springBoneManager.joints.forEach(bone => {
          if (springBoneHelperNameGroup.indexOf(bone.name) == -1) {
            const helper = new VRMSpringBoneJointHelper(bone);
            helper.name = helper.springBone.bone.name;
            springBoneHelperNameGroup.push(helper.name);
            scene.add(helper);
          }
        });
      }

      springBoneManager.setInitState();
    }

    function creatVisemeTrack(mesh, visemes) {
      const visemeIdOffset = 52;
      const trackTimes = [];
      const trackValues = [];
      var duration = 0;

      const morphDict = mesh.morphTargetDictionary;

      const shapeKeyLength = Object.getOwnPropertyNames(morphDict).length;

      const myName = mesh.name.concat('.morphTargetInfluences');

      for (var i = 0; i < visemes.length; i++) {
        for (var j = 0; j < shapeKeyLength; j++) {
          var amplitude = 1;

          /*                     if ( i < visemes.length - 1 ) {
    
                        var temp = visemes[ i + 1 ].AudioOffset - visemes[ i ].AudioOffset;
                        amplitude = temp > 1000000 ? 1 : temp / 1000000 * 1.5;
    
                    } */

          var value = visemes[i].VisemeId + visemeIdOffset == j ? amplitude : 0;

          value = j == 53 ? 0 : value;
          trackValues.push(value);
        }

        /*                 var duration = visemes[ i ].AudioOffset;
                trackTimes.push( duration / 10000 ); */

        duration += 400 / visemes.length;
        trackTimes.push(duration);
      }

      const visemeTrack = new THREE.NumberKeyframeTrack(
        myName,
        trackTimes,
        trackValues,
      );
      const visemeTimeLaps = visemeTrack.times[visemeTrack.times.length - 1];
      const lipTracks = [];
      lipTracks.push(visemeTrack);
      const clip = new THREE.AnimationClip('', visemeTimeLaps, lipTracks);
      const action = blendShapeMixer.clipAction(clip);
      action.setDuration(visemeTimeLaps / 1000);
      action.loop = THREE.LoopOnce;
      action.play();
    }

    function creatBlinkTrack(
      mesh,
      blinkWithBrow = false,
      blinkInterval = 5,
      blinkInDuration = 0.1,
      blinkOutDuration = 0.1,
    ) {
      const blinkKey = [];
      var keys = Object.keys(mesh.morphTargetDictionary);
      var blendShapeLength = keys.length;

      keys.forEach(function (res) {
        if (res.indexOf('Blink') !== -1) {
          blinkKey.push(mesh.morphTargetDictionary[res]);
        }

        if (blinkWithBrow) {
          if (res.indexOf('browDown') !== -1) {
            blinkKey.push(mesh.morphTargetDictionary[res]);
          }
        }
      });

      var blinkTimes = Math.round(Math.random() * 10, 0);

      const trackTimes = [];
      trackTimes.push(0);

      const trackValues = [];

      var blinkEye = 0;

      for (var i = 0; i < blinkTimes; i++) {
        var blinker = (Math.random() * blinkInterval) / 2 + blinkInterval / 2;
        blinkEye += blinker;

        //                 open(in)        blink    blinklast        open(out)
        trackTimes.push(
          blinkEye - blinkInDuration,
          blinkEye,
          blinkEye + blinkOutDuration / 10,
          blinkEye + blinkOutDuration,
        );
      }

      for (var i = 0; i < trackTimes.length; i++) {
        for (var j = 0; j < blendShapeLength; j++) {
          var value;
          // open-open(in)-blink-blink-open(out)-open(in)-blink-blink-open(out)
          //  0      1      2     3      4          5      6      7      8
          //  So, It is ( 2 + 2 ) % 4 == 0 , ( 3 + 1 ) % 4 = 0;
          if (
            blinkKey.indexOf(j) !== -1 &&
            ((i + 2) % 4 == 0 || (i + 1) % 4 == 0)
          ) {
            value = 2;
          } else {
            value = 0;
          }

          trackValues.push(value);
        }
      }

      const myName = mesh.name.concat('.morphTargetInfluences');
      const blinkTrack = new THREE.NumberKeyframeTrack(
        myName,
        trackTimes,
        trackValues,
      );

      const blinkTracks = [];
      blinkTracks.push(blinkTrack);
      var blinkTrackTimeLaps = blinkTrack.times[blinkTrack.times.length - 1];
      const blinkClip = new THREE.AnimationClip(
        '',
        blinkTrackTimeLaps,
        blinkTracks,
      );
      const action1 = blendShapeMixer.clipAction(blinkClip);
      action1.play();
    }

    function onWindowResize() {
      const container = document.querySelector('.world');
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      //renderer.render( scene, camera );
      effect.render(scene, camera);
    }

    function animate() {
      const dt = clock.getDelta();
      controls.update();
      springBoneManager.update(dt);
      if (blendShapeMixer) blendShapeMixer.update(dt);
      if (amatureMixer) amatureMixer.update(dt);
      requestAnimationFrame(animate);
      effect.render(scene, camera);
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
