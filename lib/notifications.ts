import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let status = existingStatus;

  if (existingStatus !== 'granted') {
    const permissionResult = await Notifications.requestPermissionsAsync();
    status = permissionResult.status;
  }

  return status === 'granted';
}

export async function triggerTestNotification(): Promise<void> {
  const granted = await requestNotificationPermission();
  if (!granted) {
    throw new Error('Notification permission was not granted.');
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Little Lemon',
      body: 'This is your test notification from settings.',
    },
    trigger: null,
  });
}
