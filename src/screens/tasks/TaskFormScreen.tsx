import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { TaskContext } from '../../context/TaskContext';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { CategoryIcon } from '../../components/CategoryIcon';
import { TaskStatus, TaskPriority } from '../../types/task';
import { TaskStackParamList } from '../../types/navigation';
import { fetchCategories, Category } from '../../services/api';

type NavProp = NativeStackNavigationProp<TaskStackParamList, 'TaskForm'>;
type RoutePropType = RouteProp<TaskStackParamList, 'TaskForm'>;

const STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
  { label: 'Pendente', value: 'pendente' },
  { label: 'Em Andamento', value: 'em_andamento' },
  { label: 'Concluída', value: 'concluida' },
];

const PRIORITY_OPTIONS: { label: string; value: TaskPriority; color: string }[] = [
  { label: 'Baixa', value: 'baixa', color: '#10B981' },
  { label: 'Média', value: 'media', color: '#F59E0B' },
  { label: 'Alta', value: 'alta', color: '#EF4444' },
];

export function TaskFormScreen() {
  const { colors } = useContext(ThemeContext);
  const { addTask, updateTask, getTask } = useContext(TaskContext);
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const insets = useSafeAreaInsets();
  const taskId = route.params?.taskId;
  const isEditing = Boolean(taskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pendente');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [category, setCategory] = useState('');
  const [categoryIconKey, setCategoryIconKey] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; category?: string }>({});

  useEffect(() => {
    if (isEditing && taskId) {
      const task = getTask(taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setCategory(task.category);
        setCategoryIconKey(task.categoryIconKey);
      }
    }
    fetchCategories()
      .then(setCategories)
      .finally(() => setCatsLoading(false));
  }, []);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!title.trim()) e.title = 'O título é obrigatório.';
    if (!category) e.category = 'Selecione uma categoria.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEditing && taskId) {
        await updateTask(taskId, { title: title.trim(), description, status, priority, category, categoryIconKey });
      } else {
        await addTask({ title: title.trim(), description, status, priority, category, categoryIconKey });
      }
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
        <Text style={[styles.navTitle, { color: colors.text }]}>
          {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <CustomInput
          label="Título *"
          placeholder="Ex: Revisar relatório"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
          maxLength={80}
        />

        <CustomInput
          label="Descrição"
          placeholder="Descreva os detalhes da tarefa..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Status</Text>
        <View style={styles.optionRow}>
          {STATUS_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.optionChip,
                {
                  backgroundColor: status === opt.value ? colors.primary : colors.surface,
                  borderColor: status === opt.value ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setStatus(opt.value)}
            >
              <Text
                style={{
                  color: status === opt.value ? colors.primaryText : colors.text,
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Prioridade</Text>
        <View style={styles.optionRow}>
          {PRIORITY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.optionChip,
                {
                  backgroundColor: priority === opt.value ? opt.color + '22' : colors.surface,
                  borderColor: priority === opt.value ? opt.color : colors.border,
                },
              ]}
              onPress={() => setPriority(opt.value)}
            >
              <Text
                style={{
                  color: priority === opt.value ? opt.color : colors.text,
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Categoria *
          {errors.category ? (
            <Text style={{ color: colors.error }}> — {errors.category}</Text>
          ) : null}
        </Text>
        {catsLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
        ) : (
          <View style={styles.catGrid}>
            {categories.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: isSelected ? colors.primary + '18' : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    setCategory(cat.name);
                    setCategoryIconKey(cat.iconKey);
                  }}
                >
                  <CategoryIcon
                    iconKey={cat.iconKey}
                    size={18}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.catName,
                      { color: isSelected ? colors.primary : colors.text },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 16 }} />
        <CustomButton
          label={isEditing ? 'Salvar alterações' : 'Criar tarefa'}
          onPress={handleSave}
          loading={saving}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  catName: { fontSize: 13, fontWeight: '600' },
});
