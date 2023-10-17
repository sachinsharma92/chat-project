import { useDebounce } from '@/hooks';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { serverRoomSendQueue } from '@/lib/rivet';
import { useBotnetAuth } from '@/store/Auth';
import { guestId } from '@/store/GameServerProvider';
import { useGameServer } from '@/store/Spaces';

/**
 * Hook for space chats.
 * Provides function to send & receive players chat.
 * @returns
 */
export const usePlayersChat = () => {
  const [gameRoom] = useGameServer(state => [state.gameRoom]);
  const [userId] = useBotnetAuth(state => [state.session?.user?.id || guestId]);
  const { spaceId } = useSelectedSpace();

  /**
   * Hide most recent chat from player bubble
   */
  const hideLastChat = useDebounce(() => {
    if (gameRoom) {
      serverRoomSendQueue.add(async () => {
        gameRoom.send('clearChat', { userId });
      });
    }
  }, 5_000);

  /**
   * Send chat message to channel/gameRoom
   * @param message
   */
  const sendChatMessage = async (message: string) => {
    try {
      if (gameRoom && message) {
        await serverRoomSendQueue.add(async () => {
          gameRoom.send('chat', {
            message,
            spaceId,
            // todo replace with actual host's space id
            authorId: userId,
          });
        });

        if (hideLastChat) {
          hideLastChat();
        }
      }
    } catch (err: any) {
      console.log('sendChatMessage() err:', err?.message);
    }
  };

  return { sendChatMessage };
};
