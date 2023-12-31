'use client';

import { Client, Room } from 'colyseus.js';
import { DialogEnums, MobileDrawerEnums } from './dialog';

export enum MusicPlayerMediaType {
  youtube = 'youtube',
  spotify = 'spotify',
  notFound = 'notFound',
}

export enum SpaceContentTabEnum {
  'chat' = 'chat',
  'home' = 'home',
  'world' = 'world',
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

import { IUser } from './auth';
import { OpenAIRoles } from '.';
import { ChatRoomState } from '@/colyseus/schemas';

export type ChatMessageProps = {
  id?: string;
  message: string;
  role: OpenAIRoles;
  authorId: string;
  spaceId?: string;
  authorInfo?: Partial<IUser>;
  time?: string;
  createdAt?: string;
};

export interface IBotData {
  chatMessages: ChatMessageProps[];
  botRoomIsResponding: boolean;
  fetchingChatHistory: boolean;
  botServerColyseusClient: null | Client;
  chatRoom: null | Room<ChatRoomState>;
  connectingChatroom: boolean;
  leavingChatRoom: boolean;
  recentBotChat: string;
  recentUserChat: string;
  clearChatMessages: () => void;
  setRecentUserChat: (recentUserChat: string) => void;
  setRecentBotChat: (recentBotChat: string) => void;
  setConnectingChatRoom: (connectingChatroom: boolean) => void;
  setLeavingChatRoom: (leavingChatRoom: boolean) => void;
  setChatRoom: (chatRoom: null | Room<ChatRoomState>) => void;
  setBotServerColyseusClient: (botServerColyseusClient: null | Client) => void;
  setFetchingChatHistory: (fetchingChatHistory: boolean) => void;
  clearLocalChatHistory: () => void;
  storeLocalChatHistory: () => void;
  restoreLocalChatHistory: (
    chatMessages?: ChatMessageProps[],
    local?: boolean,
  ) => void;
  setChatMessages: (roomChatMessages: ChatMessageProps[]) => void;
  setBotRoomIsResponding: (botRoomIsResponding: boolean) => void;
}

export * from './three';
export * from './bots';
export * from './spaces';
export * from './embeddings';
