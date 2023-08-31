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
