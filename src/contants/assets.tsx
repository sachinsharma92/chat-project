import { iAsset } from '@/types';

// @todo custom domain
export const cabinModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/cabin.glb';

export const avatarModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/avatar.glb';

export const campfireModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/campfire.glb';

export const aspenModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/aspen.glb';

export const birdModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/bird.glb';

export const boardModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/board.glb';

export const pineModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/pine.glb';

export const logModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/log.glb';

export const villagerModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/villager.glb';

export const sunflowerModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/sunflower.glb';

export const oakModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/oak.glb';

export const roseModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/rose.glb';

export const tulipModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/tulip.glb';

export const whiteflowerModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/whiteflower.glb';

export const soilModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/soil.glb';

export const mountainModelPath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/models/mountain.glb';

export const grassTexturePath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/textures/grass.jpg';

export const bigCloudTexturePath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/textures/bigCloud.png';

export const middleCloudTexturePath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/textures/middleCloud.png';

export const smallCloudTexturePath =
  'https://fdutmyyqilwqjuhjgeth.supabase.co/storage/v1/object/public/botnet-assets/assets/textures/smallCloud.jpg';

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
