import type { RefObject } from "react";
import { useEffect, useState } from "react";

import type { StreamingAvatar } from "./types";
import { ConnectionQuality } from "./types";

export enum StreamingAvatarSessionState {
  INACTIVE = "inactive",
  CONNECTING = "connecting",
  CONNECTED = "connected",
}

export enum MessageSender {
  CLIENT = "CLIENT",
  AVATAR = "AVATAR",
}

export interface Message {
  id: string;
  sender: MessageSender;
  content: string;
}

interface StreamingAvatarState {
  avatarRef: RefObject<StreamingAvatar | null>;
  basePath: string | undefined;

  isMuted: boolean;
  isVoiceChatLoading: boolean;
  isVoiceChatActive: boolean;

  sessionState: StreamingAvatarSessionState;
  stream: MediaStream | null;

  messages: Message[];

  isListening: boolean;
  isUserTalking: boolean;
  isAvatarTalking: boolean;

  connectionQuality: ConnectionQuality;
}

type StateListener = () => void;

class StreamingAvatarStore {
  private state: StreamingAvatarState;
  private listeners: Set<StateListener> = new Set();

  constructor() {
    this.state = {
      avatarRef: { current: null },
      basePath: undefined,
      isMuted: true,
      isVoiceChatLoading: false,
      isVoiceChatActive: false,
      sessionState: StreamingAvatarSessionState.INACTIVE,
      stream: null,
      messages: [],
      isListening: false,
      isUserTalking: false,
      isAvatarTalking: false,
      connectionQuality: ConnectionQuality.UNKNOWN,
    };
  }

  getState(): StreamingAvatarState {
    return this.state;
  }

  setState<K extends keyof StreamingAvatarState>(
    key: K,
    value: StreamingAvatarState[K]
  ): void {
    this.state[key] = value;
    this.notifyListeners();
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  configure(config: { basePath?: string }): void {
    if (config.basePath !== undefined) {
      this.setState("basePath", config.basePath);
    }
  }

  reset(): void {
    this.state = {
      avatarRef: { current: null },
      basePath: undefined,
      isMuted: true,
      isVoiceChatLoading: false,
      isVoiceChatActive: false,
      sessionState: StreamingAvatarSessionState.INACTIVE,
      stream: null,
      messages: [],
      isListening: false,
      isUserTalking: false,
      isAvatarTalking: false,
      connectionQuality: ConnectionQuality.UNKNOWN,
    };
    this.notifyListeners();
  }

  addMessage(message: Message): void {
    this.setState("messages", [...this.state.messages, message]);
  }

  updateLastMessage(content: string): void {
    const messages = this.state.messages;

    if (messages.length > 0) {
      const updatedMessages = [...messages];

      const lastMessage = updatedMessages[updatedMessages.length - 1];
      if (lastMessage) {
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          content,
        };
      }
      this.setState("messages", updatedMessages);
    }
  }

  clearMessages(): void {
    this.setState("messages", []);
  }
}

const avatarStore = new StreamingAvatarStore();

export function useAvatarStore(): StreamingAvatarState {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = avatarStore.subscribe(() => {
      forceUpdate({});
    });

    return unsubscribe;
  }, []);

  return avatarStore.getState();
}

export function useAvatarStoreActions() {
  const setState = <K extends keyof StreamingAvatarState>(
    key: K,
    value: StreamingAvatarState[K]
  ) => {
    avatarStore.setState(key, value);
  };

  return {
    setState,
    configure: (config: { basePath?: string }) => avatarStore.configure(config),
    addMessage: (message: Message) => avatarStore.addMessage(message),
    updateLastMessage: (content: string) =>
      avatarStore.updateLastMessage(content),
    clearMessages: () => avatarStore.clearMessages(),
  };
}

export function configure(config: { basePath?: string }): void {
  avatarStore.configure(config);
}

export function reset(): void {
  avatarStore.reset();
}

export { avatarStore };
