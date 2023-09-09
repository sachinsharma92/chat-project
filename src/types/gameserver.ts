import { MapSchema } from '@colyseus/schema';
import { Client, Room } from 'colyseus.js';

export interface CampRoom
  extends Room<{
    users: MapSchema<RoomUser>;
  }> {}

export interface IGameServerState {
  room: Room | null;
  userId: string;
  clientConnection: Client | null;
  isConnecting: boolean;
  players: RoomUser[];

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
};
