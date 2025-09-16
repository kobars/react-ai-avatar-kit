import { useAvatarStore } from "./streaming-avatar-store";

export const useConnectionQuality = () => {
  const state = useAvatarStore();

  return {
    connectionQuality: state.connectionQuality,
  };
};
