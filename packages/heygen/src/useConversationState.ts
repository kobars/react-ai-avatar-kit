import { useCallback } from "react";

import { useAvatarStore } from "./streaming-avatar-store";

export const useConversationState = () => {
  const state = useAvatarStore();

  const startListening = useCallback(() => {
    if (!state.avatarRef.current) return;
    state.avatarRef.current.startListening();
  }, [state.avatarRef]);

  const stopListening = useCallback(() => {
    if (!state.avatarRef.current) return;
    state.avatarRef.current.stopListening();
  }, [state.avatarRef]);

  return {
    isAvatarListening: state.isListening,
    startListening,
    stopListening,
    isUserTalking: state.isUserTalking,
    isAvatarTalking: state.isAvatarTalking,
  };
};
