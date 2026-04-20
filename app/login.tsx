import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { loginUser, setCurrentUser } from '@/lib/storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      const user = await loginUser(email.trim(), password);
      await setCurrentUser(user);
      setError('');
      router.replace('/(tabs)');
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Unable to login right now.';
      setError(message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <Text style={styles.brand}>Little Lemon</Text>
        <Text style={styles.title}>Login</Text>

        <View style={styles.formContainer}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            style={styles.input}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.primaryButton} onPress={onLogin}>
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/signup')}>
            <Text style={styles.secondaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <Link href="/signup" style={styles.linkText}>
            Create account here
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff9ef',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2f4f4f',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    color: '#334155',
  },
  formContainer: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#111827',
    fontWeight: '700',
  },
  secondaryButton: {
    borderColor: '#f59e0b',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#92400e',
    fontWeight: '700',
  },
  linkText: {
    textAlign: 'center',
    color: '#0369a1',
    fontWeight: '600',
    marginTop: 2,
  },
});
