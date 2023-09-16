import { useDebounce } from '@/hooks';
import { serverRoomSendQueue } from '@/lib/rivet';
import { useGameServer } from '@/store';

/**
 * Hook for space chats.
 * Provides function to send & receive players chat.
 * @returns
 */
export const usePlayersChat = () => {
  const [room, userId] = useGameServer(state => [state.room, state.userId]);

  const hideLastChat = useDebounce(() => {
    if (room) {
      serverRoomSendQueue.add(async () => {
        room.send('clearChat', { userId });
      });
    }
  }, 5_000);

  /**
   * Send chat message to channel/room
   * @param message
   */
  const sendChatMessage = async (message: string) => {
    try {
      if (room && message) {
        await serverRoomSendQueue.add(async () => {
          room.send('chat', { message, authorId: userId });
        });

        if (hideLastChat) {
          hideLastChat();
        }
      }
    } catch {}
  };

  return { sendChatMessage };
};
