export function generateId(): string {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older environments
  if (crypto?.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);

    array[6] = ((array[6] ?? 0) & 0x0f) | 0x40; // Set version to 4
    array[8] = ((array[8] ?? 0) & 0x3f) | 0x80; // Set variant bits

    const hex = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join("-");
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function formatTimestamp(date: Date): string {
  return date.toISOString();
}

export function isValidApiKey(apiKey: string): boolean {
  return typeof apiKey === "string" && apiKey.length > 0;
}
