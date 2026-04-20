import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

let isConfigured = false;

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function configureNotifications(): Promise<void> {
  if (isConfigured || Platform.OS === 'web') {
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0ea5e9',
    });
  }

  isConfigured = true;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  await configureNotifications();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let status = existingStatus;

  if (existingStatus !== 'granted') {
    const permissionResult = await Notifications.requestPermissionsAsync();
    status = permissionResult.status;
  }

  return status === 'granted';
}

export async function triggerTestNotification(): Promise<void> {
  if (Platform.OS === 'web') {
    throw new Error('Local notifications are not fully supported on web. Use Android or iOS for this evidence.');
  }

  await configureNotifications();

  const granted = await requestNotificationPermission();
  if (!granted) {
    throw new Error('Notification permission was not granted.');
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Little Lemon',
      body: 'This is your test notification from settings.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
    },
  });
}
