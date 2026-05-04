import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { NoteIcon } from '@hugeicons/core-free-icons';
import { IconSvgElement } from '@hugeicons/react-native';
import { ThemeContext } from '../context/ThemeContext';

interface Props {
  icon?: IconSvgElement;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon = NoteIcon, title, subtitle }: Props) {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
        <HugeiconsIcon icon={icon} size={40} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
