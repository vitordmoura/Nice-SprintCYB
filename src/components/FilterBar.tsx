import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  CheckListIcon,
  Clock01Icon,
  Loading03Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';
import { IconSvgElement } from '@hugeicons/react-native';
import { ThemeContext } from '../context/ThemeContext';
import { TaskStatus } from '../types/task';

type FilterOption = TaskStatus | 'todas';

interface Props {
  active: FilterOption;
  onChange: (filter: FilterOption) => void;
  counts: { total: number; pendente: number; em_andamento: number; concluida: number };
}

const OPTIONS: { label: string; value: FilterOption; icon: IconSvgElement }[] = [
  { label: 'Todas', value: 'todas', icon: CheckListIcon },
  { label: 'Pendente', value: 'pendente', icon: Clock01Icon },
  { label: 'Em Andamento', value: 'em_andamento', icon: Loading03Icon },
  { label: 'Concluída', value: 'concluida', icon: CheckmarkCircle01Icon },
];

const COUNT_MAP: Record<FilterOption, keyof Props['counts']> = {
  todas: 'total',
  pendente: 'pendente',
  em_andamento: 'em_andamento',
  concluida: 'concluida',
};

export function FilterBar({ active, onChange, counts }: Props) {
  const { colors } = useContext(ThemeContext);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {OPTIONS.map((opt) => {
        const isActive = active === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.primary : colors.surface,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
          >
            <HugeiconsIcon
              icon={opt.icon}
              size={15}
              color={isActive ? colors.primaryText : colors.textSecondary}
              strokeWidth={1.8}
            />
            <Text
              style={[styles.label, { color: isActive ? colors.primaryText : colors.text }]}
            >
              {opt.label}
            </Text>
            <View
              style={[
                styles.count,
                { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : colors.border },
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  { color: isActive ? colors.primaryText : colors.textSecondary },
                ]}
              >
                {counts[COUNT_MAP[opt.value]]}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  label: { fontSize: 13, fontWeight: '600' },
  count: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  countText: { fontSize: 11, fontWeight: '700' },
});
