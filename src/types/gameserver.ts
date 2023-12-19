import { ArraySchema, MapSchema } from '@colyseus/schema';
import { Client, Room } from 'colyseus.js';
import { IUser } from './auth';
import { OpenAIRoles } from '.';

export interface CampRoom
  extends Room<{
    users: MapSchema<RoomUser>;
    chatMessages: ArraySchema<ChatMessageProps>;
  }> {}
export interface BotRoom extends Room<{}> {}

export interface IGameServerState {
  gameRoom: CampRoom | null; // for gameserver
  botRoom: BotRoom | null; // for 1:1 bot chat
  roomChatMessages: ChatMessageProps[];
  clientConnection: Client | null;
  isConnecting: boolean;
  players: RoomUser[];
  setRoomChatMessages: (roomChatMessages: ChatMessageProps[]) => void;
  setPlayers: (players: RoomUser[]) => void;
  startConnecting: () => void;
  endConnecting: () => void;
  setBotRoom: (botRoom: BotRoom | null) => void;
  setRoom: (gameRoom: CampRoom) => void;
  setClientConnection: (clientConnection: Client) => void;
}

export interface IBotData {
  chatMessages: ChatMessageProps[];
  botRoomIsResponding: boolean;
  fetchingChatHistory: boolean;
  setFetchingChatHistory: (fetchingChatHistory: boolean) => void;
  storeChatHistory: (chatMessages: ChatMessageProps[]) => void;
  restoreChatHistory: (chatMessages?: ChatMessageProps[]) => void;
  setChatMessages: (roomChatMessages: ChatMessageProps[]) => void;
  setBotRoomIsResponding: (botRoomIsResponding: boolean) => void;
}

export type RoomUser = {
  userId?: string;
  posX?: number;
  posY?: number;
  posZ?: number;
  x: number;
  y: number;
  z: number;
  displayName: string;
  recentChatMessage?: string;
  recentChatSentDate?: string;
};

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
