export type ChatApiResponse = {
  reply: string;
  currentMood: string | null;
  category: string;
  isCrisis: boolean;
  sessionId: string;
  requiresFollowup: boolean;
  followupPrompt: string | null;
};

export type MoodHistoryEntry = {
  mood: string;
  note: string | null;
  created_at: string;
};

type ApiErrorPayload = {
  error?: string;
  message?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!API_BASE_URL) {
    return normalizedPath;
  }

  return `${API_BASE_URL}${normalizedPath}`;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const payload = await response.json() as ApiErrorPayload;
      message = payload.error || payload.message || message;
    } catch {
      // Keep the generic status-based error when the body is not JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function createSession() {
  return requestJson<{ sessionId: string; message: string }>('/api/session/new', {
    method: 'POST',
  });
}

export async function sendChatMessage(message: string, sessionId?: string) {
  return requestJson<ChatApiResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, sessionId }),
  });
}

export async function getMoodHistory(sessionId: string) {
  return requestJson<{ sessionId: string; history: MoodHistoryEntry[] }>(
    `/api/mood/history/${encodeURIComponent(sessionId)}`,
  );
}

export async function logMoodEntry(sessionId: string, mood: string, note?: string) {
  return requestJson<{ sessionId: string; mood: string; note: string | null; created_at: string }>(
    '/api/mood/log',
    {
      method: 'POST',
      body: JSON.stringify({ sessionId, mood, note }),
    },
  );
}