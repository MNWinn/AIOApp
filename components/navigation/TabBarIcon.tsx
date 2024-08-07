// components/navigation/TabBarIcon.tsx

import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

export function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  const { colors } = useTheme();
  return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} color={colors.primary} {...rest} />;
}
