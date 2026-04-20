import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type SettingsMenuProps = {
  onSelect: (item: string) => void;
};

const items = ['Profile', 'Favorites', 'Notifications', 'Logout'];

export function SettingsMenu({ onSelect }: SettingsMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable style={styles.iconButton} onPress={() => setOpen((prev) => !prev)}>
        <Ionicons name="menu" size={24} color="#1f2937" />
      </Pressable>

      {open ? (
        <View style={styles.menuBox}>
          {items.map((item) => (
            <Pressable
              key={item}
              style={styles.menuItem}
              onPress={() => {
                setOpen(false);
                onSelect(item);
              }}>
              <Text style={styles.menuText}>{item}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  iconButton: {
    backgroundColor: '#fde68a',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBox: {
    marginTop: 8,
    width: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuText: {
    color: '#111827',
    fontWeight: '600',
  },
});
