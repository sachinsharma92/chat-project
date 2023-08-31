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
      name: 'Jeremy Cai',
      image: '',
    },
    selected: true
  },
  {
    image: '/assets/camp-notpot.svg',
    name: 'Camp Not Pot',
    id: 'camp-not-pot-id-test-2',
    description:
      'Welcome to my little internet campground! Enjoy the tunes and leave a message on the bulletin.',
    host: {
      name: 'Not Pot',
      image: '',
    },
    selected: false
  },
  {
    image: '/assets/camp-3.svg',
    name: 'Camp 3',
    id: 'camp-3-id-test-3',
    description:
      'Welcome to my little internet campground! Enjoy the tunes and leave a message on the bulletin.',
    host: {
      name: 'Camp 3',
      image: '',
    },
    selected: false
  },
];

export const useCampStore = create<ICampStoreState>()(set => ({
  camps: [...demoCamps],
  campSelectedId: '',
  clearCampsList: () =>
    set(state => ({ ...state, campSelectedId: '', camps: [] })),
}));
