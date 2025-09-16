import type { EventHandler } from "@heygen/streaming-avatar";

export type {
  EventHandler,
  StartAvatarRequest,
  StreamingAvatarApiConfig,
  StreamingTalkingMessageEvent,
  UserTalkingMessageEvent,
} from "@heygen/streaming-avatar";
export {
  AvatarQuality,
  ConnectionQuality,
  default as StreamingAvatar,
  ElevenLabsModel,
  STTProvider,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceChatTransport,
  VoiceEmotion,
} from "@heygen/streaming-avatar";

export interface InitEventCallback {
  onStreamReady?: EventHandler;
  onStreamDisconnected?: EventHandler;
  onAvatarStartTalking?: EventHandler;
  onAvatarStopTalking?: EventHandler;
  onAvatarTalkingMessage?: EventHandler;
  onAvatarEndMessage?: EventHandler;
  onUserStartTalking?: EventHandler;
  onUserStopTalking?: EventHandler;
  onUserTalkingMessage?: EventHandler;
  onUserEndMessage?: EventHandler;
}
