import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Home01Icon,
  CheckListIcon,
  Settings01Icon,
} from '@hugeicons/core-free-icons';
import { IconSvgElement } from '@hugeicons/react-native';
import { HomeScreen } from '../screens/home/HomeScreen';
import { TaskStackRoutes } from './TaskStackRoutes';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ThemeContext } from '../context/ThemeContext';
import { TabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  icon: IconSvgElement;
  focused: boolean;
  color: string;
}

function TabIcon({ icon, focused, color }: TabIconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={focused ? 24 : 22}
      color={color}
      strokeWidth={focused ? 2 : 1.6}
    />
  );
}

export function TabRoutes() {
  const { colors } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={Home01Icon} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskStackRoutes}
        options={{
          tabBarLabel: 'Tarefas',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={CheckListIcon} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={Settings01Icon} focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
