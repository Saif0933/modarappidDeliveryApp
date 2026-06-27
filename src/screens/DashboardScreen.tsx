import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ActiveOrderFlow } from '../components/order/ActiveOrderFlow';
import { Icon } from '../components/Icon';

export const DashboardScreen: React.FC = () => {
  const { isOnline, activeOrder, toggleOnline, simulateOrder } = useApp();
  
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let anim1: Animated.CompositeAnimation | null = null;
    let anim2: Animated.CompositeAnimation | null = null;

    if (isOnline && !activeOrder) {
      // Loop pulse 1
      anim1 = Animated.loop(
        Animated.timing(pulse1, {
          toValue: 1,
          duration: 2400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      );
      anim1.start();

      // Loop pulse 1 (staggered delay)
      anim2 = Animated.loop(
        Animated.sequence([
          Animated.delay(1200),
          Animated.timing(pulse2, {
            toValue: 1,
            duration: 2400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      anim2.start();
    } else {
      pulse1.setValue(0);
      pulse2.setValue(0);
    }

    return () => {
      if (anim1) anim1.stop();
      if (anim2) anim2.stop();
    };
  }, [isOnline, activeOrder]);

  if (activeOrder) {
    return <ActiveOrderFlow />;
  }

  // Interpolations for radar waves feature
  const scale1 = pulse1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2.8],
  });
  const opacity1 = pulse1.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0.6, 0.3, 0],
  });

  const scale2 = pulse2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2.8],
  });
  const opacity2 = pulse2.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0.6, 0.3, 0],
  });

  return (
    <View style={styles.container}>
      {!isOnline ? (
        /* Offline State */
        <View style={styles.offlineContainer}>
          <Card variant="glass" style={styles.offlineCard}>
            <View style={styles.offlineIconBg}>
              <Icon name="car" color={colors.textMuted} size={48} />
              <View style={styles.offlineCross}>
                <Text style={styles.crossText}>✕</Text>
              </View>
            </View>
            <Text style={styles.offlineTitle}>You are Offline</Text>
            <Text style={styles.offlineSubtitle}>
              Go online to start receiving clothing delivery orders from Zara, H&M, Levi's and more near your location.
            </Text>
            <Button
              title="GO ONLINE"
              onPress={toggleOnline}
              variant="success"
              style={styles.actionBtn}
            />
          </Card>
        </View>
      ) : (
        /* Online, Idle State (Radar Scan) */
        <View style={styles.onlineContainer}>
          {/* Active Status Badge */}
          <View style={styles.activeZoneBanner}>
            <View style={styles.greenPulseDot} />
            <Text style={styles.activeZoneText}>Active • Sector 43 Market Zone</Text>
          </View>

          <View style={styles.radarContainer}>
            {/* Pulsing rings */}
            <Animated.View
              style={[
                styles.radarRing,
                {
                  transform: [{ scale: scale1 }],
                  opacity: opacity1,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.radarRing,
                {
                  transform: [{ scale: scale2 }],
                  opacity: opacity2,
                },
              ]}
            />
            {/* Center Core */}
            <View style={styles.radarCore}>
              <Icon name="navigation" color={colors.white} size={28} style={{ transform: [{ rotate: '45deg' }] }} />
            </View>
          </View>

          <Text style={styles.searchingTitle}>Looking for Orders...</Text>
          <Text style={styles.searchingSubtitle}>
            Position yourself near DLF Mall or Sector 18 Market to get quick order assignments.
          </Text>

          {/* Developer Quick Simulation panel */}
          <Card style={styles.simulationCard}>
            <Text style={styles.simTitle}>Testing Controls</Text>
            <Text style={styles.simText}>
              Simulate an incoming rider order offer to preview accept/decline flows, checklists, and active GPS map indicators.
            </Text>
            <Button
              title="Simulate Order Offer"
              onPress={simulateOrder}
              variant="primary"
              icon="bell"
              style={styles.simButton}
            />
          </Card>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 16,
  },
  // Offline Styles
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineCard: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  offlineIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  offlineCross: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  crossText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  offlineTitle: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 12,
  },
  offlineSubtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  actionBtn: {
    width: '100%',
  },

  // Online Idle Styles
  onlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeZoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 40,
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 8,
  },
  activeZoneText: {
    color: colors.success,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  radarContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 32,
    overflow: 'visible',
  },
  radarRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: colors.success,
  },
  radarCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  searchingTitle: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 8,
  },
  searchingSubtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  simulationCard: {
    width: '100%',
    maxWidth: 340,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 16,
  },
  simTitle: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 6,
  },
  simText: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 16,
  },
  simButton: {
    height: 40,
  },
});
