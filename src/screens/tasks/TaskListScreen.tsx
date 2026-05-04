import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { TaskContext } from '../../context/TaskContext';
import { Header } from '../../components/Header';
import { TaskCard } from '../../components/TaskCard';
import { FilterBar } from '../../components/FilterBar';
import { EmptyState } from '../../components/EmptyState';
import { useTasks } from '../../hooks/useTasks';
import { TaskStatus } from '../../types/task';
import { TaskStackParamList } from '../../types/navigation';

type NavProp = NativeStackNavigationProp<TaskStackParamList, 'TaskList'>;
type FilterOption = TaskStatus | 'todas';

export function TaskListScreen() {
  const { colors } = useContext(ThemeContext);
  const { removeTask } = useContext(TaskContext);
  const navigation = useNavigation<NavProp>();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('todas');
  const { filtered, counts } = useTasks(activeFilter);

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Excluir tarefa',
      `Deseja excluir "${title}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => removeTask(id) },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <Header title="Tarefas" />
      <FilterBar active={activeFilter} onChange={setActiveFilter} counts={counts} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma tarefa encontrada"
            subtitle={
              activeFilter === 'todas'
                ? 'Toque no + para criar sua primeira tarefa.'
                : `Não há tarefas com status "${activeFilter}".`
            }
          />
        }
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('TaskForm', {})}
        activeOpacity={0.85}
      >
        <HugeiconsIcon icon={Add01Icon} size={28} color={colors.primaryText} strokeWidth={2} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { paddingVertical: 8, paddingBottom: 96 },
  emptyContainer: { flex: 1 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
