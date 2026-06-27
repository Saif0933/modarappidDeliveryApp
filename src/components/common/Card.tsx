import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'normal' | 'glass' | 'accent';
}
// cart style 
export const Card: React.FC<CardProps> = ({ children, style, variant = 'normal' }) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'glass':
        return styles.glassCard;
      case 'accent':
        return styles.accentCard;
      case 'normal':
      default:
        return styles.normalCard;
    }
  };

  return <View style={[styles.cardBase, getCardStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  normalCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    shadowColor: colors.black,
  },
  glassCard: {
    backgroundColor: colors.glass,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: colors.black,
  },
  accentCard: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
  },
});
