import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';

import { getCurrentUser } from '@/lib/storage';

export default function IndexRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadAuth = async () => {
      const user = await getCurrentUser();
      if (mounted) {
        setIsAuthenticated(Boolean(user));
        setLoading(false);
      }
    };

    loadAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;
}
