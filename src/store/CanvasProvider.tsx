import { produce } from 'immer';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { create } from 'zustand';
import { iBoard, iDirection, iSkybox } from '@/types';
import { assetsToLoad } from '@/constants';

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

export const useDirectionStore = create<iDirection>(set => ({
  direction: '',
  setDirection: (direction: string) => set({ direction }),
}));
