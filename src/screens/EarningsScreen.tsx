import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Icon } from '../components/Icon';

export const EarningsScreen: React.FC = () => {
  const { earningsSummary } = useApp();

  const handleCashout = () => {
    Alert.alert(
      'Instant Cashout',
      `Transferring ₹${earningsSummary.week.toFixed(2)} to your registered bank account via UPI. Proceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Transfer', onPress: () => Alert.alert('Success', 'Payout initiated! Will reflect in 5-10 mins.') }
      ]
    );
  };

  // Mock chart data (Day name, earnings value, height percentage)
  const chartData = [
    { day: 'M', amount: 510, height: 60, current: false },
    { day: 'T', amount: 480, height: 55, current: false },
    { day: 'W', amount: 620, height: 75, current: false },
    { day: 'T', amount: 390, height: 45, current: false },
    { day: 'F', amount: 550, height: 65, current: false },
    { day: 'S', amount: 880, height: 100, current: false },
    { day: 'S', amount: earningsSummary.today, height: 48, current: true }, // Today
  ];

  const basePay = Math.round(earningsSummary.week * 0.7);
  const tips = Math.round(earningsSummary.week * 0.2);
  const incentive = Math.round(earningsSummary.week * 0.1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Wallet Balance Card */}
      <Card variant="glass" style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletLabel}>ACTIVE BALANCE</Text>
          <Icon name="wallet" color={colors.success} size={20} />
        </View>
        <Text style={styles.balanceText}>₹{earningsSummary.week.toFixed(2)}</Text>
        <Text style={styles.subtext}>Weekly total (June 17 - June 23)</Text>

        <TouchableOpacity activeOpacity={0.8} onPress={handleCashout} style={styles.cashoutBtn}>
          <Text style={styles.cashoutText}>CASHOUT EARNINGS</Text>
        </TouchableOpacity>
      </Card>

      {/* Week Performance Bar Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
        <View style={styles.chartContainer}>
          {chartData.map((item, idx) => (
            <View key={idx} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${item.height}%`,
                      backgroundColor: item.current ? colors.primary : colors.success,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, item.current && styles.currentBarLabel]}>
                {item.day}
              </Text>
              <Text style={styles.barAmountText}>₹{item.amount}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Earnings Breakdown */}
      <Card style={styles.breakdownCard}>
        <Text style={styles.sectionTitle}>Breakdown</Text>

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItemHeader}>
            <View style={[styles.circleColor, { backgroundColor: colors.success }]} />
            <Text style={styles.breakdownLabel}>Base Delivery Pay</Text>
          </View>
          <Text style={styles.breakdownValue}>₹{basePay.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItemHeader}>
            <View style={[styles.circleColor, { backgroundColor: colors.info }]} />
            <Text style={styles.breakdownLabel}>Customer Tips</Text>
          </View>
          <Text style={styles.breakdownValue}>₹{tips.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItemHeader}>
            <View style={[styles.circleColor, { backgroundColor: colors.warning }]} />
            <Text style={styles.breakdownLabel}>Peak Incentives</Text>
          </View>
          <Text style={styles.breakdownValue}>₹{incentive.toFixed(2)}</Text>
        </View>
      </Card>

      {/* Incentive promotion banner */}
      <Card variant="glass" style={styles.promoCard}>
        <View style={styles.promoRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitle}>Rain Incentive Active! 🌧️</Text>
            <Text style={styles.promoDesc}>Earn an extra ₹40 on every delivery completed before 8 PM tonight.</Text>
          </View>
          <Icon name="trending-up" color={colors.warning} size={28} />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  walletCard: {
    paddingVertical: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  balanceText: {
    color: colors.white,
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.heavy,
  },
  subtext: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 4,
    marginBottom: 20,
  },
  cashoutBtn: {
    backgroundColor: colors.success,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashoutText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  chartCard: {
    padding: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 8,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 6,
    fontWeight: typography.fontWeight.semibold,
  },
  currentBarLabel: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  barAmountText: {
    color: colors.textMuted,
    fontSize: 7,
    marginTop: 2,
  },
  breakdownCard: {
    padding: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  breakdownItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  breakdownLabel: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
  },
  breakdownValue: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  promoCard: {
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoTitle: {
    color: colors.warning,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 4,
  },
  promoDesc: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
});
