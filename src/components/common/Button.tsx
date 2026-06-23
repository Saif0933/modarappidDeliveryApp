import React, { useRef, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
  PanResponder,
  Animated,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Icon, IconName } from '../Icon';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          button: styles.secondaryButton,
          text: styles.secondaryText,
          iconColor: colors.text,
        };
      case 'danger':
        return {
          button: styles.dangerButton,
          text: styles.dangerText,
          iconColor: colors.danger,
        };
      case 'success':
        return {
          button: styles.successButton,
          text: styles.successText,
          iconColor: colors.white,
        };
      case 'primary':
      default:
        return {
          button: styles.primaryButton,
          text: styles.primaryText,
          iconColor: colors.white,
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.baseButton, vStyles.button, disabled && styles.disabledButton, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.text : colors.white} size="small" />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <Icon name={icon} color={vStyles.iconColor} size={18} style={styles.iconStyle} />}
          <Text style={[styles.baseText, vStyles.text, disabled && styles.disabledText]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Custom Swipe Button
interface SwipeButtonProps {
  title: string;
  onSwipeSuccess: () => void;
  color?: string;
  style?: ViewStyle;
}

export const SwipeButton: React.FC<SwipeButtonProps> = ({
  title,
  onSwipeSuccess,
  color = colors.primary,
  style,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;
  const isSwiping = useRef(false);

  const handleLayout = (e: any) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const buttonSize = 52;
  const maxSwipeDistance = containerWidth - buttonSize - 8; // 4px padding on each side

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isSwiping.current = true;
      },
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx < 0) {
          pan.x.setValue(0);
        } else if (gestureState.dx > maxSwipeDistance) {
          pan.x.setValue(maxSwipeDistance);
        } else {
          pan.x.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        isSwiping.current = false;
        if (gestureState.dx >= maxSwipeDistance * 0.8) {
          // Swipe success! Snap to end
          Animated.spring(pan.x, {
            toValue: maxSwipeDistance,
            useNativeDriver: false,
            tension: 50,
          }).start(() => {
            onSwipeSuccess();
            // Reset after transition
            setTimeout(() => {
              pan.x.setValue(0);
            }, 800);
          });
        } else {
          // Swipe failed, snap back
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: false,
            friction: 6,
          }).start();
        }
      },
    })
  ).current;

  // Animate text opacity based on swipe percentage
  const textOpacity = pan.x.interpolate({
    inputRange: [0, maxSwipeDistance > 0 ? maxSwipeDistance / 2 : 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.swipeContainer,
        {
          borderColor: color,
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
        },
        style,
      ]}
    >
      {/* Background Animated Text */}
      <Animated.Text style={[styles.swipeText, { opacity: textOpacity }]}>
        {title}
      </Animated.Text>

      {/* Swipe Handle Wrapper */}
      <Animated.View
        style={[
          styles.swipeHandleWrapper,
          {
            transform: [{ translateX: pan.x }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.swipeHandle, { backgroundColor: color }]}>
          <Icon name="chevron-right" color={colors.white} size={20} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  iconStyle: {
    marginRight: 8,
  },
  // Primary Styles
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.white,
  },
  // Secondary Styles
  secondaryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.text,
  },
  // Success Styles
  successButton: {
    backgroundColor: colors.success,
  },
  successText: {
    color: colors.white,
  },
  // Danger Styles
  dangerButton: {
    backgroundColor: 'transparent',
    borderColor: colors.danger,
    borderWidth: 1.5,
  },
  dangerText: {
    color: colors.danger,
  },
  // Disabled
  disabledButton: {
    backgroundColor: '#E5E7EB',
    borderColor: 'transparent',
    opacity: 0.5,
  },
  disabledText: {
    color: colors.textMuted,
  },

  // Swipe Button Styles
  swipeContainer: {
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  swipeText: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  swipeHandleWrapper: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    justifyContent: 'center',
    zIndex: 10,
  },
  swipeHandle: {
    width: 52,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
