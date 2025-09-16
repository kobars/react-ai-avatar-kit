import { useCallback } from "react";

import { useAvatarStore } from "./streaming-avatar-store";

export const useInterrupt = () => {
  const state = useAvatarStore();

  const interrupt = useCallback(() => {
    if (!state.avatarRef.current) return;
    state.avatarRef.current.interrupt();
  }, [state.avatarRef]);

  return { interrupt };
};
