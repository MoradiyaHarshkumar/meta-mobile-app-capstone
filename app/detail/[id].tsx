import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getMenuItemById } from '@/lib/api';
import { getFavoriteIds, toggleFavorite } from '@/lib/storage';
import { MenuItem } from '@/types/item';

export default function DetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const itemId = params.id ?? '';

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      const [menuItem, savedFavorites] = await Promise.all([getMenuItemById(itemId), getFavoriteIds()]);
      if (mounted) {
        setItem(menuItem);
        setFavorites(savedFavorites);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [itemId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <Text style={styles.errorText}>Item not found.</Text>
      </SafeAreaView>
    );
  }

  const isFavorite = favorites.includes(item.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={async () => {
              const updated = await toggleFavorite(item.id);
              setFavorites(updated);
            }}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={18} color="#ffffff" />
            <Text style={styles.favoriteButtonText}>
              {isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingBottom: 28,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  category: {
    color: '#475569',
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#15803d',
  },
  description: {
    color: '#334155',
    lineHeight: 21,
  },
  favoriteButton: {
    marginTop: 8,
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  favoriteButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  errorText: {
    color: '#dc2626',
    fontWeight: '700',
  },
});
