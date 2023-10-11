import { useDebounce } from '@/hooks';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { serverRoomSendQueue } from '@/lib/rivet';
import { useBotnetAuth } from '@/store/Auth';
import { guestId } from '@/store/GameServerProvider';
import { useGameServer } from '@/store/Spaces';
import { head } from 'lodash';
import camelcaseKeys from 'camelcase-keys';

/**
 * Hook for space chats.
 * Provides function to send & receive players chat.
 * @returns
 */
export const usePlayersChat = () => {
  const [gameRoom, botRoom, botRoomIsResponding] = useGameServer(state => [
    state.gameRoom,
    state.botRoom,
    state.botRoomIsResponding,
  ]);
  const [userId] = useBotnetAuth(state => [state.session?.user?.id || guestId]);
  const { spaceId, spaceInfo } = useSelectedSpace();

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
    } catch {}
  };

  /**
   * Send a chat message for 1:1 bot chat
   * @param message
   */
  const sendBotChatMessage = async (message: string) => {
    try {
      if (botRoomIsResponding) {
        return;
      }

      if (botRoom && message) {
        const channel = `chat-${userId}-send`;
        const bot = camelcaseKeys(head(spaceInfo?.bots) || {});

        await serverRoomSendQueue.add(async () => {
          botRoom.send(channel, {
            message,
            spaceId,
            botFormId: bot?.formId,
            authorId: userId,
          });
        });
      }
    } catch {}
  };

  return { sendChatMessage, sendBotChatMessage };
};
