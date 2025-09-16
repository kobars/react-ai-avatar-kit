# @react-ai-avatar-kit/heygen

React hooks for integrating HeyGen streaming avatars into your applications.

## Installation

```bash
npm install @react-ai-avatar-kit/heygen
```

## 1. Init and Start Avatar

### Server-side Token Generation (Next.js API Route example)

```typescript
// app/api/get-access-token/route.ts
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export async function POST() {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error("API key is missing from .env");
    }
    const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

    const res = await fetch(`${baseApiUrl}/v1/streaming.create_token`, {
      method: "POST",
      headers: {
        "x-api-key": HEYGEN_API_KEY,
      },
    });

    const data = await res.json();

    return new Response(data.data.token, {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving access token:", error);

    return new Response("Failed to retrieve access token", {
      status: 500,
    });
  }
}
```

### Client-side Implementation

```tsx
import React, { useRef, useEffect } from "react";
import { useStreamingAvatarSession, AvatarQuality } from "@react-ai-avatar-kit/heygen";

function AvatarApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { initAvatar, startAvatar, sessionState, stream } = useStreamingAvatarSession();

  const fetchToken = async () => {
    const response = await fetch("/api/get-access-token", { method: "POST" });
    return await response.text();
  };

  const startSession = async () => {
    const token = await fetchToken();
    await initAvatar(token);
    await startAvatar({
      quality: AvatarQuality.High,
      avatarName: "your-avatar-id"
    });
  };

  // Auto-play stream when ready
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current!.play();
      };
    }
  }, [stream]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={startSession}>Start Avatar</button>
    </div>
  );
}
```

## 2. Event Handlers

### Using Callback in initAvatar

```tsx
const avatar = initAvatar(token, {
  onStreamReady: (e) => console.log("Stream ready", e),
  onAvatarStartTalking: (e) => console.log("Avatar talking", e),
  onAvatarStopTalking: (e) => console.log("Avatar stopped", e),
  onUserStartTalking: (e) => console.log("User talking", e),
  onUserStopTalking: (e) => console.log("User stopped", e),
});
```

### Alternatively Using Ref from initAvatar

```tsx
import { StreamingEvents } from "@react-ai-avatar-kit/heygen";

const avatar = initAvatar(token);
avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
  console.log("Custom handler", e);
});
avatar.on(StreamingEvents.STREAM_DISCONNECTED, (e) => {
  console.log("Disconnected", e);
});
```

## 3. Message History

```tsx
import { useMessageHistory, MessageSender } from "@react-ai-avatar-kit/heygen";

function MessageDisplay() {
  const { messages } = useMessageHistory();

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.sender === MessageSender.AVATAR ? "Avatar" : "You"}:</strong>
          {message.content}
        </div>
      ))}
    </div>
  );
}
```

## 4. Session Management

```tsx
import { useStreamingAvatarSession, useInterrupt, useConversationState } from "@react-ai-avatar-kit/heygen";

function SessionControls() {
  const { stopAvatar, sessionState } = useStreamingAvatarSession();
  const { interrupt } = useInterrupt();
  const { isUserTalking, isAvatarTalking } = useConversationState();

  return (
    <div>
      <div>Status: {sessionState}</div>
      <div>User talking: {isUserTalking ? "Yes" : "No"}</div>
      <div>Avatar talking: {isAvatarTalking ? "Yes" : "No"}</div>
      <button onClick={stopAvatar}>Stop Avatar</button>
      <button onClick={interrupt}>Interrupt</button>
    </div>
  );
}
```

## 5. Voice Chat

```tsx
import { useVoiceChat } from "@react-ai-avatar-kit/heygen";

function VoiceControls() {
  const {
    startVoiceChat,
    stopVoiceChat,
    muteInputAudio,
    unmuteInputAudio,
    isMuted,
    isVoiceChatActive
  } = useVoiceChat();

  return (
    <div>
      <button onClick={() => startVoiceChat()}>Start Voice Chat</button>
      <button onClick={stopVoiceChat}>Stop Voice Chat</button>
      {isVoiceChatActive && (
        <button onClick={isMuted ? unmuteInputAudio : muteInputAudio}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
      )}
    </div>
  );
}
```

## 6. Text Conversation

```tsx
import { useTextChat, TaskType, TaskMode } from "@react-ai-avatar-kit/heygen";

function TextControls() {
  const { sendMessage, repeatMessage } = useTextChat();

  return (
    <div>
      <button onClick={() => sendMessage("Hello avatar!")}>
        Send Message (Reply)
      </button>
      <button onClick={() => repeatMessage("Repeat this text")}>
        Repeat Text
      </button>
    </div>
  );
}
```

### Advanced Text Options

```tsx
const { sendMessageSync, repeatMessageSync } = useTextChat();

// Synchronous operations
await sendMessageSync("Wait for response");
await repeatMessageSync("Wait for repeat");
```

## 7. Connection Quality

```tsx
import { useConnectionQuality } from "@react-ai-avatar-kit/heygen";

function ConnectionStatus() {
  const { connectionQuality } = useConnectionQuality();

  return (
    <div style={{ color: connectionQuality === "good" ? "green" : "red" }}>
      Connection: {connectionQuality}
    </div>
  );
}
```