import { iAsset } from '@/types';

// @todo custom domain
export const cabinModelPath = '/assets/model/cabin.glb';

export const avatarModelPath = '/assets/model/avatar.glb';

export const campfireModelPath = '/assets/model/campfire.glb';

export const aspenModelPath = '/assets/model/aspen.glb';

export const birdModelPath = '/assets/model/bird.glb';

export const boardModelPath = '/assets/model/board.glb';

export const pineModelPath = '/assets/model/pine.glb';

export const logModelPath = '/assets/model/log.glb';

export const villagerModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/villager.glb';

export const sunflowerModelPath = '/assets/model/sunflower.glb';

export const oakModelPath = '/assets/model/oak.glb';

export const roseModelPath = '/assets/model/rose.glb';

export const tulipModelPath = '/assets/model/tulip.glb';

export const whiteflowerModelPath = '/assets/model/whiteflower.glb';

export const soilModelPath = '/assets/model/soil.glb';

export const mountainModelPath = '/assets/model/mountain.glb';

export const grassTexturePath = '/assets/textures/grass.jpg';

export const bigCloudTexturePath = '/assets/textures/bigCloud.png';

export const middleCloudTexturePath = '/assets/textures/middleCloud.png';

export const smallCloudTexturePath = '/assets/textures/smallCloud.jpg';

export const assetsToLoad: iAsset[] = [
  //* Models
  {
    id: 'pine',
    path: pineModelPath,
    type: 'model',
  },
  {
    id: 'log',
    path: logModelPath,
    type: 'model',
  },
  {
    id: 'villager',
    path: villagerModelPath,
    type: 'model',
  },
  {
    id: 'aspen',
    path: aspenModelPath,
    type: 'model',
  },
  { id: 'sunflower', path: sunflowerModelPath, type: 'model' },
  {
    id: 'cabin',
    path: cabinModelPath,
    type: 'model',
  },
  {
    id: 'avatar',
    path: avatarModelPath,
    type: 'model',
  },
  {
    id: 'oak',
    path: oakModelPath,
    type: 'model',
  },
  {
    id: 'rose',
    path: roseModelPath,
    type: 'model',
  },
  {
    id: 'tulip',
    path: tulipModelPath,
    type: 'model',
  },
  {
    id: 'whiteflower',
    path: whiteflowerModelPath,
    type: 'model',
  },
  {
    id: 'soil',
    path: soilModelPath,
    type: 'model',
  },
  {
    id: 'board',
    path: boardModelPath,
    type: 'model',
  },
  {
    id: 'bird',
    path: birdModelPath,
    type: 'model',
  },
  {
    id: 'campfire',
    path: campfireModelPath,
    type: 'model',
  },
  {
    id: 'mountain',
    path: mountainModelPath,
    type: 'model',
  },
  //* Textures
  {
    id: 'grass',
    path: grassTexturePath,
    type: 'texture',
  },
  {
    id: 'bigcloud',
    path: bigCloudTexturePath,
    type: 'texture',
  },
  {
    id: 'mediumcloud',
    path: middleCloudTexturePath,
    type: 'texture',
  },
  {
    id: 'smallcloud',
    path: smallCloudTexturePath,
    type: 'texture',
  },
];
