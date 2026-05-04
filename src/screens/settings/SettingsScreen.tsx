import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Moon01Icon,
  Sun01Icon,
  CrownIcon,
  UserIcon,
  Logout01Icon,
} from '@hugeicons/core-free-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { Treatment } from '../../types/user';

const TREATMENTS: Treatment[] = ['Sr.', 'Sra.', 'Srta.'];

export function SettingsScreen() {
  const { colors, theme, toggleTheme } = useContext(ThemeContext);
  const { user, updateTreatment, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert('Logout', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top']}>
      <Header title="Configurações" />
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PERFIL</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '22' }]}>
              <HugeiconsIcon
                icon={user?.role === 'admin' ? CrownIcon : UserIcon}
                size={28}
                color={colors.primary}
                strokeWidth={1.8}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
              <Text style={[styles.userUsername, { color: colors.textSecondary }]}>
                @{user?.username}
              </Text>
              <View style={[styles.roleBadge, { backgroundColor: colors.primary + '22' }]}>
                <Text style={[styles.roleText, { color: colors.primary }]}>
                  {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERÊNCIAS</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <HugeiconsIcon
                icon={theme === 'dark' ? Moon01Icon : Sun01Icon}
                size={20}
                color={colors.primary}
                strokeWidth={1.8}
              />
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Tema</Text>
                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                  {theme === 'dark' ? 'Modo escuro ativo' : 'Modo claro ativo'}
                </Text>
              </View>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.primaryText}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Tratamento</Text>
          </View>
          <View style={styles.treatmentRow}>
            {TREATMENTS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.treatmentChip,
                  {
                    backgroundColor: user?.treatment === t ? colors.primary : colors.surface,
                    borderColor: user?.treatment === t ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => updateTreatment(t)}
              >
                <Text
                  style={{
                    color: user?.treatment === t ? colors.primaryText : colors.text,
                    fontWeight: '600',
                    fontSize: 14,
                  }}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CONTA</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} activeOpacity={0.7}>
            <HugeiconsIcon icon={Logout01Icon} size={20} color={colors.error} strokeWidth={1.8} />
            <Text style={[styles.logoutText, { color: colors.error }]}>Sair da conta</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: colors.textSecondary }]}>TaskFlow v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 20,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: { fontSize: 17, fontWeight: '700' },
  userUsername: { fontSize: 13, marginTop: 2 },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
  },
  roleText: { fontSize: 12, fontWeight: '600' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 15, fontWeight: '600' },
  settingDesc: { fontSize: 12, marginTop: 2 },
  treatmentRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 16 },
  treatmentChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  logoutText: { fontSize: 15, fontWeight: '600' },
  version: { fontSize: 12, textAlign: 'center', marginTop: 32 },
});
