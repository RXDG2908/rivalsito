const STORAGE_KEY = 'rivalsito.recentPlayers';
const MAX_RECENT = 24;

export const loadRecentPlayers = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is string => typeof n === 'string' && n.trim() !== '').slice(0, MAX_RECENT);
  } catch {
    return [];
  }
};

const persist = (names: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names.slice(0, MAX_RECENT)));
  } catch {
    // storage lleno o deshabilitado: ignorar
  }
};

/** Agrega nombres a la lista (los más recientes primero, sin duplicados). */
export const addRecentPlayers = (current: string[], names: string[]): string[] => {
  const cleaned = names.map(n => n.trim()).filter(n => n !== '');
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const name of [...cleaned, ...current]) {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(name);
    }
  }
  const result = merged.slice(0, MAX_RECENT);
  persist(result);
  return result;
};

export const removeRecentPlayer = (current: string[], name: string): string[] => {
  const result = current.filter(n => n !== name);
  persist(result);
  return result;
};
