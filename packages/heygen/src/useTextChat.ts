import { useCallback } from "react";

import { useAvatarStore } from "./streaming-avatar-store";
import { TaskMode, TaskType } from "./types";

export const useTextChat = () => {
  const state = useAvatarStore();

  const sendMessage = useCallback(
    (message: string) => {
      if (!state.avatarRef.current) return;
      state.avatarRef.current.speak({
        text: message,
        taskType: TaskType.TALK,
        taskMode: TaskMode.ASYNC,
      });
    },
    [state.avatarRef]
  );

  const sendMessageSync = useCallback(
    async (message: string) => {
      if (!state.avatarRef.current) return;

      return await state.avatarRef.current?.speak({
        text: message,
        taskType: TaskType.TALK,
        taskMode: TaskMode.SYNC,
      });
    },
    [state.avatarRef]
  );

  const repeatMessage = useCallback(
    (message: string) => {
      if (!state.avatarRef.current) return;

      return state.avatarRef.current?.speak({
        text: message,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.ASYNC,
      });
    },
    [state.avatarRef]
  );

  const repeatMessageSync = useCallback(
    async (message: string) => {
      if (!state.avatarRef.current) return;

      return await state.avatarRef.current?.speak({
        text: message,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC,
      });
    },
    [state.avatarRef]
  );

  return {
    sendMessage,
    sendMessageSync,
    repeatMessage,
    repeatMessageSync,
  };
};
