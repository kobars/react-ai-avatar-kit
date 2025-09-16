import { generateId } from "@react-ai-avatar-kit/core";
import { useCallback } from "react";

import {
  MessageSender,
  StreamingAvatarSessionState,
  useAvatarStore,
  useAvatarStoreActions,
} from "./streaming-avatar-store";
import {
  type ConnectionQuality,
  type InitEventCallback,
  type StartAvatarRequest,
  StreamingAvatar,
  StreamingEvents,
  type StreamingTalkingMessageEvent,
  type UserTalkingMessageEvent,
} from "./types";
import { useMessageHistory } from "./useMessageHistory";
import { useVoiceChat } from "./useVoiceChat";

let currentSender: MessageSender | null = null;

export const useStreamingAvatarSession = () => {
  const state = useAvatarStore();
  const { setState, clearMessages, addMessage, updateLastMessage } =
    useAvatarStoreActions();
  const { stopVoiceChat } = useVoiceChat();

  useMessageHistory();

  const init = useCallback(
    (
      token: string,
      {
        onStreamReady,
        onStreamDisconnected,
        onAvatarStartTalking,
        onAvatarStopTalking,
        onAvatarTalkingMessage,
        onAvatarEndMessage,
        onUserStartTalking,
        onUserStopTalking,
        onUserTalkingMessage,
        onUserEndMessage,
      }: InitEventCallback = {}
    ) => {
      const config: { token: string; basePath?: string } = { token };
      if (state.basePath !== undefined) {
        config.basePath = state.basePath;
      }

      state.avatarRef.current = new StreamingAvatar(config);

      if (onStreamReady) {
        state.avatarRef.current.on(StreamingEvents.STREAM_READY, (e) => {
          onStreamReady(e);
        });
      }

      if (onStreamDisconnected) {
        state.avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, (e) => {
          onStreamDisconnected(e);
        });
      }

      if (onAvatarStartTalking) {
        state.avatarRef.current.on(
          StreamingEvents.AVATAR_START_TALKING,
          (e) => {
            onAvatarStartTalking(e);
          }
        );
      }

      if (onAvatarStopTalking) {
        state.avatarRef.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
          onAvatarStopTalking(e);
        });
      }

      if (onAvatarTalkingMessage) {
        state.avatarRef.current.on(
          StreamingEvents.AVATAR_TALKING_MESSAGE,
          (e) => {
            onAvatarTalkingMessage(e);
          }
        );
      }

      if (onAvatarEndMessage) {
        state.avatarRef.current.on(StreamingEvents.AVATAR_END_MESSAGE, (e) => {
          onAvatarEndMessage(e);
        });
      }

      if (onUserStartTalking) {
        state.avatarRef.current.on(StreamingEvents.USER_START, (e) => {
          onUserStartTalking(e);
        });
      }

      if (onUserStopTalking) {
        state.avatarRef.current.on(StreamingEvents.USER_STOP, (e) => {
          onUserStopTalking(e);
        });
      }

      if (onUserTalkingMessage) {
        state.avatarRef.current.on(
          StreamingEvents.USER_TALKING_MESSAGE,
          (e) => {
            onUserTalkingMessage(e);
          }
        );
      }

      if (onUserEndMessage) {
        state.avatarRef.current.on(StreamingEvents.USER_END_MESSAGE, (e) => {
          onUserEndMessage(e);
        });
      }

      return state.avatarRef.current;
    },
    [state.basePath, state.avatarRef]
  );

  const handleUserTalkingMessage = useCallback(
    ({ detail }: { detail: UserTalkingMessageEvent }) => {
      if (currentSender === MessageSender.CLIENT) {
        const lastMessage = state.messages[state.messages.length - 1];

        if (lastMessage) {
          updateLastMessage([lastMessage.content, detail.message].join(""));
        }
      } else {
        currentSender = MessageSender.CLIENT;
        addMessage({
          id: generateId(),
          sender: MessageSender.CLIENT,
          content: detail.message,
        });
      }
    },
    [state.messages, addMessage, updateLastMessage]
  );

  const handleStreamingTalkingMessage = useCallback(
    ({ detail }: { detail: StreamingTalkingMessageEvent }) => {
      if (currentSender === MessageSender.AVATAR) {
        const lastMessage = state.messages[state.messages.length - 1];

        if (lastMessage) {
          updateLastMessage([lastMessage.content, detail.message].join(""));
        }
      } else {
        currentSender = MessageSender.AVATAR;
        addMessage({
          id: generateId(),
          sender: MessageSender.AVATAR,
          content: detail.message,
        });
      }
    },
    [state.messages, addMessage, updateLastMessage]
  );

  const handleEndMessage = useCallback(() => {
    currentSender = null;
  }, []);

  const handleStream = useCallback(
    ({ detail }: { detail: MediaStream }) => {
      setState("stream", detail);
      setState("sessionState", StreamingAvatarSessionState.CONNECTED);
    },
    [setState]
  );

  const stop = useCallback(async () => {
    state.avatarRef.current?.off(StreamingEvents.STREAM_READY, handleStream);
    state.avatarRef.current?.off(StreamingEvents.STREAM_DISCONNECTED, stop);
    clearMessages();
    currentSender = null;
    stopVoiceChat();
    setState("isListening", false);
    setState("isUserTalking", false);
    setState("isAvatarTalking", false);
    setState("stream", null);
    await state.avatarRef.current?.stopAvatar();
    setState("sessionState", StreamingAvatarSessionState.INACTIVE);
  }, [handleStream, setState, state.avatarRef, stopVoiceChat, clearMessages]);

  const start = useCallback(
    async (config: StartAvatarRequest, token?: string) => {
      if (state.sessionState !== StreamingAvatarSessionState.INACTIVE) {
        throw new Error("There is already an active session");
      }

      if (!state.avatarRef.current) {
        if (!token) {
          throw new Error("Token is required");
        }
        init(token);
      }

      if (!state.avatarRef.current) {
        throw new Error("Avatar is not initialized");
      }

      setState("sessionState", StreamingAvatarSessionState.CONNECTING);
      state.avatarRef.current.on(StreamingEvents.STREAM_READY, handleStream);
      state.avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, stop);
      state.avatarRef.current.on(
        StreamingEvents.CONNECTION_QUALITY_CHANGED,
        ({ detail }: { detail: ConnectionQuality }) =>
          setState("connectionQuality", detail)
      );
      state.avatarRef.current.on(StreamingEvents.USER_START, () => {
        setState("isUserTalking", true);
      });
      state.avatarRef.current.on(StreamingEvents.USER_STOP, () => {
        setState("isUserTalking", false);
      });
      state.avatarRef.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
        setState("isAvatarTalking", true);
      });
      state.avatarRef.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        setState("isAvatarTalking", false);
      });
      state.avatarRef.current.on(
        StreamingEvents.USER_TALKING_MESSAGE,
        handleUserTalkingMessage
      );
      state.avatarRef.current.on(
        StreamingEvents.AVATAR_TALKING_MESSAGE,
        handleStreamingTalkingMessage
      );
      state.avatarRef.current.on(
        StreamingEvents.USER_END_MESSAGE,
        handleEndMessage
      );
      state.avatarRef.current.on(
        StreamingEvents.AVATAR_END_MESSAGE,
        handleEndMessage
      );

      await state.avatarRef.current.createStartAvatar(config);

      return state.avatarRef.current;
    },
    [
      init,
      handleStream,
      stop,
      setState,
      state.avatarRef,
      state.sessionState,
      handleUserTalkingMessage,
      handleStreamingTalkingMessage,
      handleEndMessage,
    ]
  );

  return {
    avatarRef: state.avatarRef,
    sessionState: state.sessionState,
    stream: state.stream,
    initAvatar: init,
    startAvatar: start,
    stopAvatar: stop,
  };
};
