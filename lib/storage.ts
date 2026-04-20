import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@littlelemon/users';
const CURRENT_USER_KEY = '@littlelemon/current_user';
const FAVORITES_KEY = '@littlelemon/favorites';
const SETTINGS_KEY = '@littlelemon/settings';

export type UserRecord = {
  username: string;
  email: string;
  password: string;
};

export type AppSettings = {
  notificationsEnabled: boolean;
  marketingEmails: boolean;
};

const defaultSettings: AppSettings = {
  notificationsEnabled: false,
  marketingEmails: false,
};

async function getJson<T>(key: string, fallback: T): Promise<T> {
  const value = await AsyncStorage.getItem(key);
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function setJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getUsers(): Promise<UserRecord[]> {
  return getJson<UserRecord[]>(USERS_KEY, []);
}

export async function registerUser(user: UserRecord): Promise<void> {
  const users = await getUsers();
  const exists = users.some((existing) => existing.email.toLowerCase() === user.email.toLowerCase());
  if (exists) {
    throw new Error('An account already exists for this email.');
  }

  users.push(user);
  await setJson(USERS_KEY, users);
}

export async function loginUser(email: string, password: string): Promise<UserRecord> {
  const users = await getUsers();
  const user = users.find(
    (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  return user;
}

export async function setCurrentUser(user: UserRecord): Promise<void> {
  await setJson(CURRENT_USER_KEY, user);
}

export async function getCurrentUser(): Promise<UserRecord | null> {
  return getJson<UserRecord | null>(CURRENT_USER_KEY, null);
}

export async function clearCurrentUser(): Promise<void> {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

export async function getFavoriteIds(): Promise<string[]> {
  return getJson<string[]>(FAVORITES_KEY, []);
}

export async function toggleFavorite(id: string): Promise<string[]> {
  const ids = await getFavoriteIds();
  const hasId = ids.includes(id);
  const updated = hasId ? ids.filter((favoriteId) => favoriteId !== id) : [...ids, id];
  await setJson(FAVORITES_KEY, updated);
  return updated;
}

export async function getAppSettings(): Promise<AppSettings> {
  return getJson<AppSettings>(SETTINGS_KEY, defaultSettings);
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  await setJson(SETTINGS_KEY, settings);
}
