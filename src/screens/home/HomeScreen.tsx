import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  CheckListIcon,
  Clock01Icon,
  Loading03Icon,
  CheckmarkCircle01Icon,
  QuoteUpIcon,
  Alert01Icon,
  RefreshIcon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { useTasks } from '../../hooks/useTasks';
import { fetchQuote, Quote } from '../../services/api';
import { TabParamList } from '../../types/navigation';
import { IconSvgElement } from '@hugeicons/react-native';

type NavProp = BottomTabNavigationProp<TabParamList, 'Home'>;

export function HomeScreen() {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<NavProp>();
  const { counts } = useTasks();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadQuote = async () => {
    setQuoteError(false);
    setQuoteLoading(true);
    try {
      const q = await fetchQuote();
      setQuote(q);
    } catch {
      setQuoteError(true);
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => { loadQuote(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuote();
    setRefreshing(false);
  };

  const stats: { label: string; value: number; color: string; icon: IconSvgElement }[] = [
    { label: 'Total', value: counts.total, color: colors.primary, icon: CheckListIcon },
    { label: 'Pendente', value: counts.pendente, color: colors.statusPendente, icon: Clock01Icon },
    { label: 'Em andamento', value: counts.em_andamento, color: colors.statusEmAndamento, icon: Loading03Icon },
    { label: 'Concluída', value: counts.concluida, color: colors.statusConcluida, icon: CheckmarkCircle01Icon },
  ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top']}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={[styles.welcome, { color: colors.text }]}>
          Olá, {user?.treatment} {user?.name.split(' ')[0]}! 👋
        </Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Veja o resumo das suas tarefas hoje
        </Text>

        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View
              key={s.label}
              style={[
                styles.statCard,
                { backgroundColor: colors.card, borderColor: s.color + '44' },
              ]}
            >
              <View style={[styles.statIconBox, { backgroundColor: s.color + '18' }]}>
                <HugeiconsIcon icon={s.icon} size={22} color={s.color} strokeWidth={1.8} />
              </View>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <HugeiconsIcon icon={QuoteUpIcon} size={18} color={colors.primary} strokeWidth={1.8} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Frase do dia</Text>
        </View>

        <View style={[styles.quoteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {quoteLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : quoteError ? (
            <View style={styles.quoteError}>
              <HugeiconsIcon icon={Alert01Icon} size={20} color={colors.error} strokeWidth={1.8} />
              <Text style={[styles.quoteErrorText, { color: colors.error }]}>
                Não foi possível carregar a frase.
              </Text>
              <TouchableOpacity onPress={loadQuote} style={styles.retryBtn}>
                <HugeiconsIcon icon={RefreshIcon} size={14} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.retry, { color: colors.primary }]}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : quote ? (
            <>
              <Text style={[styles.quoteText, { color: colors.text }]}>"{quote.content}"</Text>
              <Text style={[styles.quoteAuthor, { color: colors.primary }]}>— {quote.author}</Text>
            </>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.goToTasks, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Tasks')}
          activeOpacity={0.85}
        >
          <Text style={[styles.goToTasksText, { color: colors.primaryText }]}>
            Ver minhas tarefas
          </Text>
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} color={colors.primaryText} strokeWidth={2} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  welcome: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  sub: { fontSize: 14, marginBottom: 24 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 32, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  quoteCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
    minHeight: 80,
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  quoteText: { fontSize: 15, fontStyle: 'italic', lineHeight: 22, marginBottom: 8 },
  quoteAuthor: { fontSize: 13, fontWeight: '600' },
  quoteError: { alignItems: 'center', gap: 8 },
  quoteErrorText: { fontSize: 13 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  retry: { fontSize: 13, fontWeight: '600' },
  goToTasks: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  goToTasksText: { fontSize: 16, fontWeight: '700' },
});
