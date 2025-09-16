import { useCallback } from "react";

import {
  useAvatarStore,
  useAvatarStoreActions,
} from "./streaming-avatar-store";

export const useVoiceChat = () => {
  const state = useAvatarStore();
  const { setState } = useAvatarStoreActions();

  const startVoiceChat = useCallback(
    async (isInputAudioMuted?: boolean) => {
      if (!state.avatarRef.current) return;
      setState("isVoiceChatLoading", true);

      const config: { isInputAudioMuted?: boolean } = {};
      if (isInputAudioMuted !== undefined) {
        config.isInputAudioMuted = isInputAudioMuted;
      }

      await state.avatarRef.current?.startVoiceChat(config);
      setState("isVoiceChatLoading", false);
      setState("isVoiceChatActive", true);
      setState("isMuted", !!isInputAudioMuted);
    },
    [state.avatarRef, setState]
  );

  const stopVoiceChat = useCallback(() => {
    if (!state.avatarRef.current) return;
    state.avatarRef.current?.closeVoiceChat();
    setState("isVoiceChatActive", false);
    setState("isMuted", true);
  }, [state.avatarRef, setState]);

  const muteInputAudio = useCallback(() => {
    if (!state.avatarRef.current) return;
    state.avatarRef.current?.muteInputAudio();
    setState("isMuted", true);
  }, [state.avatarRef, setState]);

  const unmuteInputAudio = useCallback(() => {
    if (!state.avatarRef.current) return;
    state.avatarRef.current?.unmuteInputAudio();
    setState("isMuted", false);
  }, [state.avatarRef, setState]);

  return {
    startVoiceChat,
    stopVoiceChat,
    muteInputAudio,
    unmuteInputAudio,
    isMuted: state.isMuted,
    isVoiceChatActive: state.isVoiceChatActive,
    isVoiceChatLoading: state.isVoiceChatLoading,
  };
};
