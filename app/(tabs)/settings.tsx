import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SettingsMenu } from '@/components/settings-menu';
import { requestNotificationPermission, triggerTestNotification } from '@/lib/notifications';
import { AppSettings, clearCurrentUser, getAppSettings, getCurrentUser, saveAppSettings } from '@/lib/storage';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    notificationsEnabled: false,
    marketingEmails: false,
  });
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    const loadData = async () => {
      const [savedSettings, currentUser] = await Promise.all([getAppSettings(), getCurrentUser()]);
      setSettings(savedSettings);
      if (currentUser) {
        setUsername(currentUser.username);
      }
    };

    loadData();
  }, []);

  const updateSetting = async (next: AppSettings) => {
    setSettings(next);
    await saveAppSettings(next);
  };

  const onMenuSelect = async (item: string) => {
    if (item === 'Logout') {
      await clearCurrentUser();
      router.replace('/login');
      return;
    }

    Alert.alert('Menu item selected', item);
  };

  const onNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert('Permission denied', 'Please allow notification permission in your device settings.');
        return;
      }
    }

    await updateSetting({ ...settings, notificationsEnabled: enabled });
  };

  const onSendTestNotification = async () => {
    try {
      await triggerTestNotification();
      Alert.alert('Success', 'Test notification triggered successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to trigger notification.';
      Alert.alert('Notification error', message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Welcome, {username}</Text>
          </View>
          <SettingsMenu onSelect={onMenuSelect} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Enable Notifications</Text>
            <Switch value={settings.notificationsEnabled} onValueChange={onNotificationToggle} />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Marketing Emails</Text>
            <Switch
              value={settings.marketingEmails}
              onValueChange={(value) => updateSetting({ ...settings, marketingEmails: value })}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.notificationButton} onPress={onSendTestNotification}>
          <Text style={styles.notificationButtonText}>Send Test Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await clearCurrentUser();
            router.replace('/login');
          }}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    color: '#475569',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    color: '#1e293b',
    fontSize: 15,
  },
  notificationButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  notificationButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#f87171',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#dc2626',
    fontWeight: '700',
  },
});
