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

import { registerUser, setCurrentUser } from '@/lib/storage';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSignup = async () => {
    if (!username || !email || !password) {
      setError('Please complete username, email, and password.');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email format.');
      return;
    }

    try {
      const user = {
        username: username.trim(),
        email: email.trim(),
        password,
      };

      await registerUser(user);
      await setCurrentUser(user);
      setError('');
      router.replace('/(tabs)');
    } catch (signupError) {
      const message = signupError instanceof Error ? signupError.message : 'Unable to sign up right now.';
      setError(message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <Text style={styles.brand}>Little Lemon</Text>
        <Text style={styles.title}>Create account</Text>

        <View style={styles.formContainer}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            style={styles.input}
          />
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

          <TouchableOpacity style={styles.primaryButton} onPress={onSignup}>
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <Link href="/login" style={styles.linkText}>
            Already have an account? Log in
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
  linkText: {
    textAlign: 'center',
    color: '#0369a1',
    fontWeight: '600',
    marginTop: 6,
  },
});
