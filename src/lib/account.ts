import type { UserProfile } from '../types';

export async function accountRequest<Result = void>(
  userId: string, path: string, method = 'GET', body?: unknown,
): Promise<Result> {
  const response = await fetch(`/api/account/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-TripTales-Account': userId },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'same-origin',
  });
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error || 'We couldn’t save or load your data. Please try again.');
  }
  return response.status === 204 ? undefined as Result : response.json();
}

const legacyCollections = [
  { key: 'triptales_saved_trips', path: 'trips' },
  { key: 'triptales_journal_entries', path: 'journal' },
];

function localRecords<RecordType>(key: string): RecordType[] {
  const records: unknown = JSON.parse(localStorage.getItem(key) || '[]');
  return Array.isArray(records) ? records : [];
}

export async function importBrowserRecords(user: UserProfile, isCurrent: () => boolean) {
  try {
    const legacyIds = new Set(localRecords<{ email?: string; id?: string }>('triptales_users')
      .filter(profile => typeof profile?.id === 'string' && typeof profile.email === 'string'
        && profile.email.trim().toLowerCase() === user.email.toLowerCase())
      .map(profile => profile.id));
    if (!user.email || !legacyIds.size) return true;

    for (const { key, path } of legacyCollections) {
      type LegacyRecord = { id: string; userId: string; createdAt: string; updatedAt?: string };
      const records = localRecords<LegacyRecord>(key).filter(record => legacyIds.has(record?.userId));
      for (const { id, userId, createdAt, updatedAt, ...content } of records) {
        if (!isCurrent()) return false;
        await accountRequest(user.id, path, 'POST', { legacyId: id, createdAt, content });
        const remaining = localRecords<LegacyRecord>(key).filter(record => record?.id !== id || record?.userId !== userId);
        localStorage.setItem(key, JSON.stringify(remaining));
      }
    }
    return true;
  } catch {
    return false;
  }
}
