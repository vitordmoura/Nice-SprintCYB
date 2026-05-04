import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const TASKS_KEY = '@taskflow:tasks';

export async function loadTasks(): Promise<Task[]> {
  const json = await AsyncStorage.getItem(TASKS_KEY);
  return json ? (JSON.parse(json) as Task[]) : [];
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}
