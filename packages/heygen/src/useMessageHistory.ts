import { useAvatarStore } from "./streaming-avatar-store";

export const useMessageHistory = () => {
  const state = useAvatarStore();

  return { messages: state.messages };
};
