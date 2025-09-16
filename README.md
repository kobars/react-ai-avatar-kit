# React AI Avatar Kit

A TypeScript-first React library providing streamlined interfaces for multiple AI avatar streaming providers like HeyGen, Tavus, and Simli.

## How to Use

### Install a provider package:

```bash
npm install @react-ai-avatar-kit/heygen
```

### Basic Usage:

```tsx
import { useStreamingAvatarSession, useTextChat } from "@react-ai-avatar-kit/heygen";

function AvatarChat() {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } = useStreamingAvatarSession();
  const { sendMessage } = useTextChat();

  const handleStart = async () => {
    // Initialize with your token
    await initAvatar("your-access-token");

    // Start avatar with configuration
    await startAvatar({
      newSessionRequest: {
        quality: "medium",
        avatarName: "your-avatar-id"
      }
    });
  };

  const handleSendMessage = () => {
    sendMessage("Hello, how are you today?");
  };

  return (
    <div>
      <video
        ref={(video) => {
          if (video && stream) {
            video.srcObject = stream;
          }
        }}
        autoPlay
        playsInline
      />

      <div>Status: {sessionState}</div>

      <button onClick={handleStart}>Start Avatar</button>
      <button onClick={handleSendMessage}>Send Message</button>
      <button onClick={stopAvatar}>Stop Avatar</button>
    </div>
  );
}
```

### Available Hooks:

- `useStreamingAvatarSession()` - Core avatar session management
- `useTextChat()` - Send text messages to avatar
- `useVoiceChat()` - Voice conversation with avatar
- `useMessageHistory()` - Access conversation history
- `useConnectionQuality()` - Monitor connection status
- `useConversationState()` - Track conversation state
- `useInterrupt()` - Interrupt avatar speech