import { produce } from 'immer';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { create } from 'zustand';
import { iAsset, iBoard, iSkybox } from '@/types';

const assetsToLoad: iAsset[] = [
  //* Models
  {
    id: 'pine',
    path: '/assets/models/pine.glb',
    type: 'model',
  },
  {
    id: 'log',
    path: '/assets/models/log.glb',
    type: 'model',
  },
  {
    id: 'villager',
    path: '/assets/models/villager.glb',
    type: 'model',
  },
  {
    id: 'aspen',
    path: '/assets/models/aspen.glb',
    type: 'model',
  },
  { id: 'sunflower', path: '/assets/models/sunflower.glb', type: 'model' },
  {
    id: 'cabin',
    path: '/assets/models/cabin.glb',
    type: 'model',
  },
  {
    id: 'avatar',
    path: '/assets/models/avatar.glb',
    type: 'model',
  },

  {
    id: 'oak',
    path: '/assets/models/oak.glb',
    type: 'model',
  },
  {
    id: 'rose',
    path: '/assets/models/rose.glb',
    type: 'model',
  },
  {
    id: 'tulip',
    path: '/assets/models/tulip.glb',
    type: 'model',
  },
  {
    id: 'whiteflower',
    path: '/assets/models/whiteflower.glb',
    type: 'model',
  },
  {
    id: 'soil',
    path: '/assets/models/soil.glb',
    type: 'model',
  },
  {
    id: 'board',
    path: '/assets/models/board.glb',
    type: 'model',
  },
  {
    id: 'bird',
    path: '/assets/models/bird.glb',
    type: 'model',
  },
  {
    id: 'campfire',
    path: '/assets/models/campfire.glb',
    type: 'model',
  },
  //* Textures
  {
    id: 'grass',
    path: '/assets/textures/grass.jpg',
    type: 'texture',
  },
  {
    id: 'bigcloud',
    path: '/assets/textures/bigCloud.png',
    type: 'texture',
  },
  {
    id: 'mediumcloud',
    path: '/assets/textures/middleCloud.png',
    type: 'texture',
  },
  {
    id: 'smallcloud',
    path: '/assets/textures/smallCloud.jpg',
    type: 'texture',
  },
];

const immer = (config: any) => (set: any, get: any, api: any) =>
  config((fn: any) => set(produce(fn)), get, api);
// const immer =
//   <T extends State>(
//     config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>,
//   ): StateCreator<T> =>
//   (set, get, api) =>
//     config(fn => set(produce<T>(fn)), get, api);

export const useWorldStore = createWithEqualityFn(
  // immer function as createWithEqualityFn first argument or as initializer
  immer((set: boolean | any) => ({
    isStarted: false,
    start: () =>
      set((draft: any) => {
        draft.isStarted = true;
      }),
  })),
  //  default eqality function as createWithEqualityFn second argument
  Object.is,
);

export const useAssetStore = createWithEqualityFn(
  immer((set: any, get: any) => ({
    assetsToLoad,
    loadedAssets: {},
    loadingAssetsPromises: {},
    addLoadedAsset: (id: string, asset: string) => {
      set((draft: any) => {
        draft.loadedAssets[id] = asset;
      });
    },
    setLoadingAssetPromise: (id: string, promise: boolean | string) => {
      set((draft: any) => {
        draft.loadingAssetsPromises[id] = promise;
      });
    },
    getLoadedAsset: (id: string) => {
      const loaded = get().loadedAssets[id];
      if (!loaded) {
        const promise = get().loadingAssetsPromises[id];
        if (promise) throw promise;
        throw new Error('Asset not found and not loading.');
      }
      return loaded;
    },
  })),
  Object.is,
);

export const useLoadingProgress = () => {
  const loadedAssets = useAssetStore(state => state.loadedAssets, shallow);
  const progress = Object.keys(loadedAssets).length / assetsToLoad.length;
  const progressPercent = Math.round(progress * 100);
  return progressPercent;
};

export const useAsset = (id: string) => {
  const asset = useAssetStore(state => state.getLoadedAsset(id), shallow);
  return asset;
};

export const useSkyboxStore = create<iSkybox>(set => ({
  isMorning: false,
  setMorning: () => set(state => ({ isMorning: !state.isMorning })),
  isEvening: false,
  setEvening: () => set(state => ({ isEvening: !state.isEvening })),
  isNight: false,
  setNight: () => set(state => ({ isNight: !state.isNight })),
}));

export const useBoardStore = create<iBoard>(set => ({
  isBoardOpen: false,
  setBoardOpen: () => set(state => ({ isBoardOpen: !state.isBoardOpen })),
}));


