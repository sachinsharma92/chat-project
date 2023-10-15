import { IUser } from './auth';
import { IBot } from './bots';
import { DialogEnums } from './dialog';

export enum MusicPlayerMediaType {
  youtube = 'youtube',
  spotify = 'spotify',
  notFound = 'notFound',
}

export interface ISpace {
  id: string;
  owner: string;
  spaceName?: string;
  name?: string;
  image?: string;
  description?: string;
  host?: Partial<IUser>;
  selected?: boolean;
  bots?: Partial<IBot>[];
}

export interface IAppState {
  showDialog: boolean;
  showDialogType: DialogEnums;
  expandInfoSidebar: boolean;
  expandBulletinSidebar: boolean;
  setShowDialog: (showDialog: boolean, showDialogType: DialogEnums) => void;
  setExpandBulletinSidebar: (expandBulletinSidebar: boolean) => void;
  setExpandInfoSidebar: (expandInfoSidebar: boolean) => void;
}

export interface ISpaceStoreState {
  spaces: Partial<ISpace>[];
  clearCampsList: () => void;
  setSpaceInfo: (spaceId: string, props: Partial<ISpace>) => void;
  addSpace: (space: Partial<ISpace>) => void;
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
