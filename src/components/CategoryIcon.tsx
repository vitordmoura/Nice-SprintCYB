import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Briefcase01Icon,
  BookOpen01Icon,
  Activity01Icon,
  UserIcon,
  DollarCircleIcon,
  GameController01Icon,
  ShoppingBag01Icon,
  GridIcon,
} from '@hugeicons/core-free-icons';
import { IconSvgElement } from '@hugeicons/react-native';

const ICON_MAP: Record<string, IconSvgElement> = {
  briefcase: Briefcase01Icon,
  book: BookOpen01Icon,
  activity: Activity01Icon,
  user: UserIcon,
  dollar: DollarCircleIcon,
  game: GameController01Icon,
  shopping: ShoppingBag01Icon,
  grid: GridIcon,
};

interface Props {
  iconKey: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function CategoryIcon({ iconKey, size = 24, color = '#6C63FF', strokeWidth = 1.8 }: Props) {
  const icon = ICON_MAP[iconKey] ?? GridIcon;
  return <HugeiconsIcon icon={icon} size={size} color={color} strokeWidth={strokeWidth} />;
}
