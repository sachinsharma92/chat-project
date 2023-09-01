import { useLayoutEffect, useRef } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { TextureLoader, CubeTextureLoader } from "three";
import * as THREE from "three";
import { useAssetStore } from "@/store/CanvasProvider";

function useAssetLoader() {
  const {
    assetsToLoad,
    setLoadingAssetPromise,
    addLoadedAsset,
    loadingAssetsPromises,
  } = useAssetStore();

  const createGLTFLoader = () => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    return loader;
  };

  const gltfLoader = useRef(createGLTFLoader());
  const textureLoader = useRef(new TextureLoader());
  const cubeTextureLoader = useRef(new CubeTextureLoader());

  const loadAsset = (asset: any) => {
    if (loadingAssetsPromises[asset.id]) {
      return;
    }
    if (asset.type === "texture") {
      const promise = new Promise((resolve, reject) => {
        textureLoader.current.load(
          asset.path,
          (loadedAsset) => {
            addLoadedAsset(asset.id, loadedAsset);
            resolve(true);
          },
          undefined,
          reject
        );
      });
      setLoadingAssetPromise(asset.id, promise);
    }

    if (asset.type === "cubeTexture") {
      const promise = new Promise((resolve, reject) => {
        cubeTextureLoader.current.load(
          asset.path,
          (loadedAsset) => {
            addLoadedAsset(asset.id, loadedAsset);
            resolve(true);
          },
          undefined,
          reject
        );
      });
      setLoadingAssetPromise(asset.id, promise);
    }

    if (asset.type === "model") {
      const promise = new Promise((resolve, reject) => {
        gltfLoader.current.load(
          asset.path,
          async (loadedAsset) => {
            const nodes: { [name: string]: THREE.Object3D } = {};
            loadedAsset.scene.traverse((child: any) => {
              if (child?.isObject3D) {
                nodes[child.name] = child;
              }
            });
            //@ts-ignore
            loadedAsset.nodes = nodes;

            const materialsArray = await loadedAsset.parser.getDependencies(
              "material"
            );
            const materials = materialsArray.reduce(
              (acc, material: THREE.Material) => {
                acc[material.name] = material;
                return acc;
              },
              {}
            );
            //@ts-ignore
            loadedAsset.materials = materials;

            addLoadedAsset(asset.id, loadedAsset);
            resolve(true);
          },
          undefined,
          reject
        );
      });
      setLoadingAssetPromise(asset.id, promise);
    }
  };

  useLayoutEffect(() => {
    console.log("useAssetLoader");
    assetsToLoad.forEach((asset: any) => {
      loadAsset(asset);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useAssetLoader;
