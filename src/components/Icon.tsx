import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export type IconName =
  | 'dashboard'
  | 'wallet'
  | 'history'
  | 'user'
  | 'chevron-right'
  | 'chevron-left'
  | 'map-pin'
  | 'store'
  | 'phone'
  | 'navigation'
  | 'check'
  | 'close'
  | 'star'
  | 'bell'
  | 'clock'
  | 'box'
  | 'trending-up'
  | 'car'
  | 'verified';

interface IconProps {
  name: IconName;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({ name, color = '#FFFFFF', size = 24, style }) => {
  const renderIconContent = () => {
    switch (name) {
      case 'dashboard':
        return (
          <View style={[styles.dashboardContainer, { width: size, height: size }]}>
            <View style={[styles.dashboardGrid, { backgroundColor: color, opacity: 0.95 }]} />
            <View style={[styles.dashboardGrid, { backgroundColor: color, opacity: 0.6 }]} />
            <View style={[styles.dashboardGrid, { backgroundColor: color, opacity: 0.6 }]} />
            <View style={[styles.dashboardGrid, { backgroundColor: color, opacity: 0.95 }]} />
          </View>
        );

      case 'wallet':
        return (
          <View style={[styles.walletOuter, { width: size, height: size * 0.8, borderColor: color }]}>
            <View style={[styles.walletFlap, { backgroundColor: color }]} />
          </View>
        );

      case 'history':
        return (
          <View style={[styles.clockOuter, { width: size, height: size, borderColor: color }]}>
            <View style={[styles.clockHandMin, { backgroundColor: color, height: size * 0.35 }]} />
            <View style={[styles.clockHandHour, { backgroundColor: color, width: size * 0.25 }]} />
          </View>
        );

      case 'user':
        return (
          <View style={[styles.userContainer, { width: size, height: size }]}>
            <View style={[styles.userHead, { backgroundColor: color, width: size * 0.45, height: size * 0.45 }]} />
            <View style={[styles.userBody, { borderColor: color, width: size, height: size * 0.45, borderTopWidth: 2 }]} />
          </View>
        );

      case 'chevron-right':
        return (
          <View style={[styles.chevronContainer, { width: size, height: size }]}>
            <View
              style={[
                styles.chevronLine,
                {
                  borderColor: color,
                  borderRightWidth: size * 0.12,
                  borderBottomWidth: size * 0.12,
                  width: size * 0.4,
                  height: size * 0.4,
                  transform: [{ rotate: '-45deg' }],
                },
              ]}
            />
          </View>
        );

      case 'chevron-left':
        return (
          <View style={[styles.chevronContainer, { width: size, height: size }]}>
            <View
              style={[
                styles.chevronLine,
                {
                  borderColor: color,
                  borderLeftWidth: size * 0.12,
                  borderTopWidth: size * 0.12,
                  width: size * 0.4,
                  height: size * 0.4,
                  transform: [{ rotate: '-45deg' }],
                },
              ]}
            />
          </View>
        );

      case 'map-pin':
        return (
          <View style={[styles.pinContainer, { width: size, height: size }]}>
            <View style={[styles.pinCircle, { borderColor: color, width: size * 0.8, height: size * 0.8, borderWidth: 2 }]}>
              <View style={[styles.pinCenter, { backgroundColor: color, width: size * 0.25, height: size * 0.25 }]} />
            </View>
            <View
              style={[
                styles.pinPointer,
                {
                  backgroundColor: color,
                  width: size * 0.35,
                  height: size * 0.35,
                  bottom: size * 0.05,
                  transform: [{ rotate: '45deg' }],
                },
              ]}
            />
          </View>
        );

      case 'store':
        return (
          <View style={[styles.storeContainer, { width: size, height: size }]}>
            <View style={[styles.storeRoof, { borderBottomColor: color, borderBottomWidth: size * 0.3, borderLeftWidth: size * 0.5, borderRightWidth: size * 0.5 }]} />
            <View style={[styles.storeWall, { borderColor: color, width: size * 0.8, height: size * 0.6 }]} />
            <View style={[styles.storeDoor, { backgroundColor: color, width: size * 0.25, height: size * 0.3 }]} />
          </View>
        );

      case 'phone':
        return (
          <View style={[styles.centerFlex, { width: size, height: size }]}>
            <Text style={{ fontSize: size * 0.8, color }}>📞</Text>
          </View>
        );

      case 'navigation':
        return (
          <View style={[styles.centerFlex, { width: size, height: size }]}>
            <View
              style={[
                styles.navigationArrow,
                {
                  width: size,
                  height: size,
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [{ rotate: '45deg' }],
                },
              ]}
            >
              <Text style={{ fontSize: size * 0.8, color, fontWeight: 'bold' }}>▲</Text>
            </View>
          </View>
        );

      case 'check':
        return (
          <View style={[styles.centerFlex, { width: size, height: size }]}>
            <View style={[styles.checkmarkCircle, { width: size, height: size, borderColor: color, borderWidth: 2, borderRadius: size / 2 }]}>
              <Text style={[styles.checkmarkText, { fontSize: size * 0.55, color, fontWeight: 'bold' }]}>✓</Text>
            </View>
          </View>
        );

      case 'close':
        return (
          <View style={[styles.centerFlex, { width: size, height: size }]}>
            <View style={[styles.checkmarkCircle, { width: size, height: size, borderColor: color, borderWidth: 2, borderRadius: size / 2 }]}>
              <Text style={[styles.checkmarkText, { fontSize: size * 0.5, color, fontWeight: 'bold' }]}>✕</Text>
            </View>
          </View>
        );

      case 'star':
        return (
          <View style={[styles.centerFlex, { width: size, height: size }]}>
            <Text style={{ fontSize: size * 0.8, color }}>★</Text>
          </View>
        );

      case 'bell':
        return (
          <View style={[styles.bellContainer, { width: size, height: size }]}>
            <View style={[styles.bellCap, { backgroundColor: color, width: size * 0.2, height: size * 0.1 }]} />
            <View style={[styles.bellBody, { backgroundColor: color, width: size * 0.7, height: size * 0.5, borderTopLeftRadius: size * 0.3, borderTopRightRadius: size * 0.3 }]} />
            <View style={[styles.bellClapper, { backgroundColor: color, width: size * 0.25, height: size * 0.15 }]} />
          </View>
        );

      case 'clock':
        return (
          <View style={[styles.clockOuter, { width: size, height: size, borderColor: color, borderWidth: 2 }]}>
            <View style={[styles.clockHandMin, { backgroundColor: color, height: size * 0.3, width: 2, top: size * 0.15 }]} />
            <View style={[styles.clockHandHour, { backgroundColor: color, width: size * 0.2, height: 2, left: size * 0.48 }]} />
          </View>
        );

      case 'box':
        return (
          <View style={[styles.centerFlex, { width: size, height: size }]}>
            <Text style={{ fontSize: size * 0.8, color }}>📦</Text>
          </View>
        );

      case 'trending-up':
        return (
          <View style={[styles.centerFlex, { width: size, height: size }]}>
            <Text style={{ fontSize: size * 0.8, color, fontWeight: 'bold' }}>📈</Text>
          </View>
        );

      case 'car':
        return (
          <View style={[styles.centerFlex, { width: size, height: size }]}>
            <Text style={{ fontSize: size * 0.8, color }}>🛵</Text>
          </View>
        );

      case 'verified':
        return (
          <View style={[styles.centerFlex, { width: size, height: size }]}>
            <Text style={{ fontSize: size * 0.8, color }}>🛡️</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return <View style={[styles.container, style]}>{renderIconContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerFlex: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  dashboardGrid: {
    width: '45%',
    height: '45%',
    borderRadius: 2,
  },
  walletOuter: {
    borderWidth: 2,
    borderRadius: 4,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  walletFlap: {
    width: '40%',
    height: '35%',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronLine: {
    borderStyle: 'solid',
  },
  pinContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pinCircle: {
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: '#0D0E12',
  },
  pinCenter: {
    borderRadius: 99,
  },
  pinPointer: {
    position: 'absolute',
    borderRadius: 1,
    zIndex: 1,
  },
  storeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  storeRoof: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  storeWall: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  storeDoor: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  checkmarkCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  bellContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellCap: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  bellBody: {
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  bellClapper: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginTop: 1,
  },
  clockOuter: {
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  clockHandMin: {
    position: 'absolute',
    borderRadius: 1,
  },
  clockHandHour: {
    position: 'absolute',
    borderRadius: 1,
  },
  userContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userHead: {
    borderRadius: 99,
    marginBottom: 2,
  },
  userBody: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  navigationArrow: {},
});
