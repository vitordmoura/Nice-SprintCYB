import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { TaskStatus, TaskPriority } from '../types/task';

interface StatusProps {
  status: TaskStatus;
}

interface PriorityProps {
  priority: TaskPriority;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  concluida: 'Concluída',
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

export function StatusBadge({ status }: StatusProps) {
  const { colors } = useContext(ThemeContext);

  const color = {
    pendente: colors.statusPendente,
    em_andamento: colors.statusEmAndamento,
    concluida: colors.statusConcluida,
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

export function PriorityBadge({ priority }: PriorityProps) {
  const { colors } = useContext(ThemeContext);

  const color = {
    baixa: colors.priorityBaixa,
    media: colors.priorityMedia,
    alta: colors.priorityAlta,
  }[priority];

  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{PRIORITY_LABELS[priority]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11, fontWeight: '600' },
});
