import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
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
import { getFavoriteIds, toggleFavorite } from '@/lib/storage';
import { MenuItem } from '@/types/item';

export default function HomeScreen() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      const [menuItems, favorites] = await Promise.all([fetchMenuItems(), getFavoriteIds()]);
      if (mounted) {
        setItems(menuItems);
        setFavoriteIds(favorites);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

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
        <View>
          <Text style={styles.brand}>Little Lemon</Text>
          <Text style={styles.subtitle}>Fresh menu from API</Text>
        </View>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} contentFit="contain" />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isFavorite = favoriteIds.includes(item.id);
          const imageSource = imageErrors[item.id]
            ? require('@/assets/images/react-logo.png')
            : { uri: item.image };

          return (
            <View style={styles.card}>
              <View style={styles.cardImageWrap}>
                <Image
                  source={imageSource}
                  style={styles.cardImage}
                  contentFit="contain"
                  onError={() => {
                    setImageErrors((prev) => ({ ...prev, [item.id]: true }));
                  }}
                />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMeta}>${item.price.toFixed(2)} • {item.category}</Text>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={async () => {
                      const updated = await toggleFavorite(item.id);
                      setFavoriteIds(updated);
                    }}>
                    <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={17} color="#ef4444" />
                    <Text style={styles.favoriteButtonText}>
                      {isFavorite ? 'Saved' : 'Favorite'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.navigateButton}
                    onPress={() => router.push(`/detail/${item.id}`)}>
                    <Ionicons name="chevron-forward-circle" size={22} color="#0ea5e9" />
                    <Text style={styles.navigateText}>Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1f2937',
  },
  subtitle: {
    color: '#475569',
    marginTop: 2,
  },
  logo: {
    width: 48,
    height: 48,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  cardImageWrap: {
    width: '100%',
    height: 170,
    backgroundColor: '#f8fafc',
    padding: 12,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
  },
  cardBody: {
    padding: 12,
    gap: 8,
  },
  itemTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#0f172a',
  },
  itemMeta: {
    color: '#334155',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  favoriteButtonText: {
    color: '#334155',
    fontWeight: '600',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navigateText: {
    color: '#0284c7',
    fontWeight: '700',
  },
});
