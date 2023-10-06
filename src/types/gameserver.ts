import { MessageRoles } from '@/ui/features/Chat/Message';
import { ArraySchema, MapSchema } from '@colyseus/schema';
import { Client, Room } from 'colyseus.js';
import { IUser } from './auth';

export interface CampRoom
  extends Room<{
    users: MapSchema<RoomUser>;
    chatMessages: ArraySchema<ChatMessageProps>;
  }> {}

export interface IGameServerState {
  room: Room | null;
  userId: string;
  roomChatMessages: ChatMessageProps[];
  clientConnection: Client | null;
  isConnecting: boolean;
  players: RoomUser[];

  setRoomChatMessages: (roomChatMessages: ChatMessageProps[]) => void;
  setPlayers: (players: RoomUser[]) => void;
  setUserId: (userId: string) => void;
  startConnecting: () => void;
  endConnecting: () => void;
  setRoom: (room: CampRoom) => void;
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
};
