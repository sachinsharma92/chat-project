import { ICampStoreState } from '@/types';
import { create } from 'zustand';

// for demo purposes only
const demoCamps = [
  {
    image: '/assets/camp-tonari.png',
    name: 'Camp Cai',
    id: 'camp-cai-id-test-1',
    description:
      'Welcome to my little internet campground! Enjoy the tunes and leave a message on the bulletin.',
    host: {
      name: 'Jemery Cai',
      image: '',
    },
  },
];

export const useCampStore = create<ICampStoreState>()(set => ({
  camps: [...demoCamps],
  campSelectedId: '',
  clearCampsList: () =>
    set(state => ({ ...state, campSelectedId: '', camps: [] })),
}));
