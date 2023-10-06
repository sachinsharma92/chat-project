import { produce } from 'immer';
import { createWithEqualityFn } from 'zustand/traditional';
import { create } from 'zustand';
import { iBoard, iDirection, iSkybox } from '@/types';

const immer = (config: any) => (set: any, get: any, api: any) =>
  config((fn: any) => set(produce(fn)), get, api);

export const useWorldStore = createWithEqualityFn<{
  isStarted: boolean;
  start: () => void;
}>(
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
