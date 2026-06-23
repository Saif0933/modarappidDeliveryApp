import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Animated } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';
import { Icon } from '../Icon';

export const Header: React.FC = () => {
  const { isOnline, toggleOnline, earningsSummary } = useApp();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        {/* Left Side: Rider Info */}
        <View style={styles.riderInfo}>
          <View style={[styles.avatar, { borderColor: isOnline ? colors.success : colors.textMuted }]}>
            <Text style={styles.avatarText}>RS</Text>
            {isOnline && <View style={styles.activeDot} />}
          </View>
          <View style={styles.nameContainer}>
            <View style={styles.riderRow}>
              <Text style={styles.riderName}>Rohan Sharma</Text>
              <Icon name="verified" color={colors.info} size={14} style={styles.verifiedIcon} />
            </View>
            <View style={styles.statusRow}>
              <Icon name="car" color={colors.textMuted} size={12} style={styles.vehicleIcon} />
              <Text style={styles.vehicleText}>Splendor • DL 3S AB 1234</Text>
            </View>
          </View>
        </View>

        {/* Right Side: Toggle Switch */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleOnline}
          style={[
            styles.toggleButton,
            {
              backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
              borderColor: isOnline ? colors.success : colors.danger,
            },
          ]}
        >
          <View style={[styles.statusIndicator, { backgroundColor: isOnline ? colors.success : colors.danger }]} />
          <Text style={[styles.toggleText, { color: isOnline ? colors.success : colors.danger }]}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mini Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Today's Earnings</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>₹{earningsSummary.today.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Trips Completed</Text>
          <Text style={styles.statValue}>{earningsSummary.tripsToday}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Online Hours</Text>
          <Text style={styles.statValue}>{earningsSummary.onlineHours} hrs</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.card,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2D313E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.card,
  },
  avatarText: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  nameContainer: {
    marginLeft: 12,
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riderName: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  vehicleIcon: {
    marginRight: 4,
  },
  vehicleText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  toggleText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(13, 14, 18, 0.5)',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
});
