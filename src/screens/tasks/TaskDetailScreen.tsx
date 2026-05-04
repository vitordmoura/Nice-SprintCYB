import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, PencilEdit01Icon, Delete01Icon } from '@hugeicons/core-free-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { TaskContext } from '../../context/TaskContext';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import { CategoryIcon } from '../../components/CategoryIcon';
import { formatDate } from '../../utils/formatDate';
import { TaskStackParamList } from '../../types/navigation';

type NavProp = NativeStackNavigationProp<TaskStackParamList, 'TaskDetail'>;
type RoutePropType = RouteProp<TaskStackParamList, 'TaskDetail'>;

export function TaskDetailScreen() {
  const { colors } = useContext(ThemeContext);
  const { getTask, removeTask } = useContext(TaskContext);
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const insets = useSafeAreaInsets();
  const task = getTask(route.params.taskId);

  if (!task) {
    return (
      <View
        style={[
          styles.root,
          { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={[styles.notFound, { color: colors.text }]}>Tarefa não encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, fontWeight: '600', marginTop: 12 }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Excluir tarefa',
      `Deseja excluir "${task.title}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await removeTask(task.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingTop: insets.top + 10,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={22} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Detalhes</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '18' }]}>
              <CategoryIcon iconKey={task.categoryIconKey} size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.category, { color: colors.primary }]}>{task.category}</Text>
              <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </View>

          {task.description.length > 0 && (
            <View style={[styles.section, { borderTopColor: colors.border }]}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Descrição</Text>
              <Text style={[styles.description, { color: colors.text }]}>{task.description}</Text>
            </View>
          )}

          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Datas</Text>
            <View style={styles.dateRow}>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Criada em</Text>
              <Text style={[styles.dateValue, { color: colors.text }]}>
                {formatDate(task.createdAt)}
              </Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Atualizada em</Text>
              <Text style={[styles.dateValue, { color: colors.text }]}>
                {formatDate(task.updatedAt)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
            activeOpacity={0.85}
          >
            <HugeiconsIcon icon={PencilEdit01Icon} size={18} color={colors.primaryText} strokeWidth={2} />
            <Text style={[styles.actionText, { color: colors.primaryText }]}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.error }]}
            onPress={handleDelete}
            activeOpacity={0.85}
          >
            <HugeiconsIcon icon={Delete01Icon} size={18} color={colors.primaryText} strokeWidth={2} />
            <Text style={[styles.actionText, { color: colors.primaryText }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  navTitle: { fontSize: 17, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '800', lineHeight: 26 },
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  section: { borderTopWidth: 1, paddingTop: 16, marginTop: 8 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  description: { fontSize: 15, lineHeight: 22 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  dateLabel: { fontSize: 13 },
  dateValue: { fontSize: 13, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionText: { fontSize: 15, fontWeight: '700' },
  notFound: { fontSize: 16, fontWeight: '600' },
});
