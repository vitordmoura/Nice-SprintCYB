import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CheckmarkCircle01Icon, Alert01Icon } from '@hugeicons/core-free-icons';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export function LoginScreen() {
  const { colors } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const shake = React.useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      triggerShake();
      return;
    }
    setLoading(true);
    setError('');
    const ok = await login(username.trim(), password);
    setLoading(false);
    if (!ok) {
      setError('Usuário ou senha inválidos.');
      triggerShake();
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <View style={[styles.logoBox, { backgroundColor: colors.primary + '18' }]}>
              <HugeiconsIcon
                icon={CheckmarkCircle01Icon}
                size={52}
                color={colors.primary}
                strokeWidth={1.5}
              />
            </View>
            <Text style={[styles.appName, { color: colors.primary }]}>TaskFlow</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              Organize suas tarefas com eficiência
            </Text>
          </View>

          <Animated.View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
              { transform: [{ translateX: shake }] },
            ]}
          >
            <Text style={[styles.heading, { color: colors.text }]}>Entrar</Text>

            <CustomInput
              label="Usuário"
              placeholder="Digite seu usuário"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <CustomInput
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error.length > 0 && (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: colors.error + '15', borderColor: colors.error },
                ]}
              >
                <HugeiconsIcon icon={Alert01Icon} size={16} color={colors.error} strokeWidth={2} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}

            <CustomButton label="Entrar" onPress={handleLogin} loading={loading} />

            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              admin / 123 · user / 123
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  hero: { alignItems: 'center', marginBottom: 32 },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  tagline: { fontSize: 14, marginTop: 4 },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 24 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { fontSize: 13, fontWeight: '500', flex: 1 },
  hint: { fontSize: 12, textAlign: 'center', marginTop: 16, opacity: 0.7 },
});
