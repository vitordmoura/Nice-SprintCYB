import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Logout01Icon, CrownIcon, UserIcon } from '@hugeicons/core-free-icons';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

interface Props {
  title?: string;
}

export function Header({ title }: Props) {
  const { colors } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.header, paddingTop: insets.top + 10 },
      ]}
    >
      <View style={styles.left}>
        <HugeiconsIcon
          icon={user?.role === 'admin' ? CrownIcon : UserIcon}
          size={18}
          color={colors.primaryText}
          strokeWidth={1.8}
        />
        <View style={styles.userInfo}>
          <Text style={[styles.greeting, { color: colors.primaryText }]}>
            {user?.treatment} {user?.name}
          </Text>
          <Text style={[styles.role, { color: colors.primaryText + 'BB' }]}>
            {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        {title && (
          <Text style={[styles.title, { color: colors.primaryText }]}>{title}</Text>
        )}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.primaryText + '55' }]}
          onPress={logout}
          activeOpacity={0.7}
        >
          <HugeiconsIcon
            icon={Logout01Icon}
            size={18}
            color={colors.primaryText}
            strokeWidth={1.8}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  userInfo: { flexDirection: 'column' },
  greeting: { fontSize: 14, fontWeight: '600' },
  role: { fontSize: 11, marginTop: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 16, fontWeight: '700' },
  logoutBtn: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
  },
});
