import { ICampStoreState } from '@/types';
import { create } from 'zustand';

export const useCampStore = create<ICampStoreState>()(set => ({
  camps: [],
  campSelectedId: '',
  clearCampsList: () =>
    set(state => ({ ...state, campSelectedId: '', camps: [] })),
}));
