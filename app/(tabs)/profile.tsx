import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { fetchMenuItems } from '@/lib/api';
import { getCurrentUser, getFavoriteIds } from '@/lib/storage';
import { MenuItem } from '@/types/item';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Guest');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      const [user, favoriteIds, menuItems] = await Promise.all([
        getCurrentUser(),
        getFavoriteIds(),
        fetchMenuItems(),
      ]);

      if (mounted) {
        if (user) {
          setUsername(user.username);
        }
        setFavorites(favoriteIds);
        setItems(menuItems);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const favoriteItems = useMemo(
    () => items.filter((item) => favorites.includes(item.id)),
    [items, favorites]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Hello, {username}</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Favorite items</Text>
        <Text style={styles.count}>{favoriteItems.length}</Text>
      </View>

      <FlatList
        data={favoriteItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No favorites yet. Save items from Home to see them here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/detail/${item.id}`)}>
            <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="contain" />
            <View style={styles.cardBody}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.itemMeta}>${item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    color: '#475569',
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  count: {
    minWidth: 26,
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    color: '#0f172a',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  emptyBox: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 16,
  },
  emptyText: {
    color: '#475569',
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardImage: {
    width: 64,
    height: 64,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    color: '#0f172a',
    fontWeight: '700',
  },
  itemMeta: {
    color: '#15803d',
    fontWeight: '600',
  },
});
