import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Task } from '../types/task';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { formatDateShort } from '../utils/formatDate';

interface Props {
  task: Task;
  onPress: () => void;
}

export function TaskCard({ task, onPress }: Props) {
  const { colors } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.top}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary + '18' }]}>
          <CategoryIcon iconKey={task.categoryIconKey} size={22} color={colors.primary} />
        </View>
        <View style={styles.badges}>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </View>
      </View>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {task.title}
      </Text>

      {task.description.length > 0 && (
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {task.description}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={[styles.category, { color: colors.primary }]}>{task.category}</Text>
        <View style={styles.dates}>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatDateShort(task.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 1,
    marginLeft: 8,
  },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  description: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  category: { fontSize: 13, fontWeight: '600' },
  dates: { flexDirection: 'row', gap: 8 },
  date: { fontSize: 11 },
});
