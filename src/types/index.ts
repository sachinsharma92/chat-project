export enum MusicPlayerMediaType {
  youtube = 'youtube',
  spotify = 'spotify',
  notFound = 'notFound',
}

export interface HostInfo {
  name: string;
  image: string;
}

export interface ICamp {
  id: string;
  name: string;
  image: string;
  description: string;
  host: HostInfo;
  selected: boolean;
}

export interface ICampStoreState {
  camps: ICamp[];
  campSelectedId: string;
  clearCampsList: () => void;
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
