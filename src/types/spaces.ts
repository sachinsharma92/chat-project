import { IUser } from './auth';
import { IBot } from './bots';

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
  links?: { data: ISpaceLink[] };
}

export interface ISpaceLink {
  id?: string;
  name: string;
  link: string;
  hidden?: boolean;
}

export interface ISpaceStoreState {
  spaces: Partial<ISpace>[];
  clearCampsList: () => void;
  setSpaceInfo: (spaceId: string, props: Partial<ISpace>) => void;
  addSpace: (space: Partial<ISpace>) => void;
}
