import { MessageRoles } from '@/ui/features/Chat/Message';
import { ArraySchema, MapSchema } from '@colyseus/schema';
import { Client, Room } from 'colyseus.js';
import { IUser } from './auth';

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
  botRoomIsResponding: boolean;
  setBotRoomIsResponding: (botRoomIsResponding: boolean) => void;
  setRoomChatMessages: (roomChatMessages: ChatMessageProps[]) => void;
  setPlayers: (players: RoomUser[]) => void;
  startConnecting: () => void;
  endConnecting: () => void;
  setBotRoom: (botRoom: BotRoom | null) => void;
  setRoom: (gameRoom: CampRoom) => void;
  setClientConnection: (clientConnection: Client) => void;
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
  id: string;
  message: string;
  role: MessageRoles;
  authorId: string;
  authorInfo?: Partial<IUser>;
  time?: string;
};
