'use client';

import { type, Schema, MapSchema, ArraySchema } from '@colyseus/schema';

export class UserSession extends Schema {
  @type('string') userId: string = '';

  @type('string') sessionId: string = '';
}

export class ChatMessage extends Schema {
  @type('string') id: string = '';

  @type('string') authorId: string = '';

  @type('string') spaceId: string = '';

  @type('string') createdAt: string = '';

  @type('string') role: string = '';

  @type('string') message: string = '';
}

export class User extends Schema {
  @type('string') userId: string = '';

  @type('string') displayName: string = '';

  @type('string') image: string = '';

  @type('string') accessToken: string = '';

  @type('string') refreshToken: string = '';

  @type('string') authCheckedAt: string = '';

  @type('boolean') authIsValid: boolean = false;

  @type('boolean') botIsResponding: boolean = false;

  @type('boolean') fetchingChatHistory: boolean = false;

  @type('boolean') disconnected: boolean = false;

  @type([ChatMessage]) chatMessages: ArraySchema<ChatMessage> =
    new ArraySchema<ChatMessage>();
}

export class ChatRoomState extends Schema {
  @type('string') createdAt: string = '';

  @type({ map: User }) users: MapSchema<User> = new MapSchema<User>();

  @type({ map: UserSession }) sessions: MapSchema<UserSession> =
    new MapSchema<UserSession>();
}
