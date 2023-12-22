import { DialogEnums, MobileDrawerEnums } from './dialog';

export enum MusicPlayerMediaType {
  youtube = 'youtube',
  spotify = 'spotify',
  notFound = 'notFound',
}

export enum SpaceContentTabEnum {
  'chat' = 'chat',
  'home' = 'home',
  'reviews' = 'reviews',
  'pastChats'= 'pastChats'
}

export interface IAppState {
  showDialog: boolean;
  showDialogType: DialogEnums;
  expandBulletinSidebar: boolean;
  showMobileDrawer: boolean;
  showMobileDrawerType: MobileDrawerEnums;
  spaceContentTab: SpaceContentTabEnum;
  setSpaceContentTab: (spaceContentTab: SpaceContentTabEnum) => void;
  setShowMobileDrawer: (
    showMobileDrawer: boolean,
    showMobileDrawerType: MobileDrawerEnums,
  ) => void;
  setShowDialog: (showDialog: boolean, showDialogType: DialogEnums) => void;
  setExpandBulletinSidebar: (expandBulletinSidebar: boolean) => void;
}

export interface iAsset {
  id: string;
  path: string | string[];
  type: string;
}
export interface iBoard {
  isBoardOpen: boolean;
  setBoardOpen: () => void;
}

export interface iSkybox {
  isNight: boolean;
  isMorning: boolean;
  isEvening: boolean;
  setNight: () => void;
  setMorning: () => void;
  setEvening: () => void;
}

export interface iDirection {
  direction: any;
  setDirection: (direction: any) => void;
}

export interface IPhaserGameState {
  phaserGame: undefined | null | Phaser.Game;
  setPhaserGame: (phaserGame: undefined | null | Phaser.Game) => void;
}

export * from './gameserver';
export * from './three';
export * from './bots';
export * from './spaces';
export * from './embeddings';
