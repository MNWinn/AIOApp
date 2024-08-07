// hooks/useThemeColor.ts
import { useColorScheme } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ThemeColors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ThemeColors
) {
  const theme = useColorScheme() ?? 'light';
  const { colors } = useTheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return colors[colorName];
  }
}
