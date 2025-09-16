export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatTimestamp(date: Date): string {
  return date.toISOString();
}

export function isValidApiKey(apiKey: string): boolean {
  return typeof apiKey === "string" && apiKey.length > 0;
}
