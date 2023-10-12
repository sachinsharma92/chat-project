import { create } from 'zustand';

interface iDirection {
  direction: any;
  setDirection: (direction: any) => void;
}

export const useDirectionStore = create<iDirection>(set => ({
  direction: '',
  setDirection: direction => set({ direction }),
}));

export const store = {
  direction: '',
  setDirection: function (direction: string) {
    this.direction = direction;
  },
};
