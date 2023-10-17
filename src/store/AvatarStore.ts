import { create } from 'zustand';

export const colorStore = create(set => ({
  color: null,
  setColor: (color: string) => set({ color }),
}));

export const hairStyleStore = create(set => ({
  hairStyle: '',
  setHairStyle: (hairStyle: string) => set({ hairStyle }),
}));
