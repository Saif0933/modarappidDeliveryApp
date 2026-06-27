import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/common/Card';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const EarningsScreen: React.FC = () => {
  const { earningsSummary, orderHistory } = useApp();

  const handleCashout = () => {
    Alert.alert(
      'Instant Cashout',
      `Transferring ₹${earningsSummary.week.toFixed(2)} to your registered bank account via UPI. Proceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Transfer', onPress: () => Alert.alert('Success', 'Payout initiated! Will reflect in your bank account shortly.') }
      ]
    );
  };

  // Mock chart data (Day name, earnings value, height percentage)
  const chartData = [
    { day: 'Mon', amount: 510, height: 60, current: false },
    { day: 'Tue', amount: 480, height: 55, current: false },
    { day: 'Wed', amount: 620, height: 75, current: false },
    { day: 'Thu', amount: 390, height: 45, current: false },
    { day: 'Fri', amount: 550, height: 65, current: false },
    { day: 'Sat', amount: 880, height: 100, current: false },
    { day: 'Sun', amount: earningsSummary.today, height: 48, current: true }, // Today
  ];

  const basePay = Math.round(earningsSummary.week * 0.7);
  const tips = Math.round(earningsSummary.week * 0.2);
  const incentive = Math.round(earningsSummary.week * 0.1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Page Title Header */}
      <View style={styles.headerBlock}>
        <Text style={styles.mainTitle}>My Payouts</Text>
        <Text style={styles.subTitle}>Manage and track your delivery earnings</Text>
      </View>

      {/* Wallet Card - Premium Titanium Card Style */}
      <View style={styles.walletCardWrapper}>
        <View style={styles.walletCard}>
          {/* Abstract glows and decoration */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
          <View style={styles.cardGlow} />

          <View style={styles.walletHeader}>
            <View style={styles.brandContainer}>
              <View style={styles.brandBadgeIcon}>
                <Icon name="verified" color={colors.primary} size={10} />
              </View>
              <Text style={styles.cardBrandText}>MODARAPID PAY</Text>
            </View>
            <View style={styles.cardChip} />
          </View>

          <Text style={styles.balanceLabel}>ACTIVE BALANCE</Text>
          <Text style={styles.balanceText}>₹{earningsSummary.week.toFixed(2)}</Text>
          <Text style={styles.billingCycleText}>Current Cycle: Jun 17 - Jun 23</Text>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardRiderLabel}>DELIVERY PARTNER</Text>
              <Text style={styles.cardRiderName}>Rohan Sharma</Text>
            </View>
            <View style={styles.bankBadge}>
              <View style={styles.bankDot} />
              <Text style={styles.bankText}>SBI Linked</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cashout Button */}
      <TouchableOpacity activeOpacity={0.85} onPress={handleCashout} style={styles.cashoutBtn}>
        <Icon name="wallet" color={colors.white} size={18} style={styles.cashoutIcon} />
        <Text style={styles.cashoutText}>INSTANT CASHOUT TO BANK</Text>
      </TouchableOpacity>

      {/* Performance Mini Stats Row */}
      <View style={styles.statsRow}>
        <Card style={styles.statMiniCard}>
          <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
            <Icon name="car" color={colors.info} size={14} />
          </View>
          <Text style={styles.statMiniLabel}>Trips Today</Text>
          <Text style={styles.statMiniValue}>{earningsSummary.tripsToday}</Text>
        </Card>

        <Card style={styles.statMiniCard}>
          <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <Icon name="clock" color={colors.success} size={14} />
          </View>
          <Text style={styles.statMiniLabel}>Hours Online</Text>
          <Text style={styles.statMiniValue}>{earningsSummary.onlineHours} hrs</Text>
        </Card>

        <Card style={styles.statMiniCard}>
          <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(255, 94, 58, 0.1)' }]}>
            <Icon name="trending-up" color={colors.primary} size={14} />
          </View>
          <Text style={styles.statMiniLabel}>Avg. per Trip</Text>
          <Text style={styles.statMiniValue}>
            ₹{earningsSummary.tripsToday > 0 ? Math.round(earningsSummary.today / earningsSummary.tripsToday) : 0}
          </Text>
        </Card>
      </View>

      {/* Week Performance Bar Chart */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
            <Text style={styles.chartSubtitle}>Daily payout summary</Text>
          </View>
          <View style={styles.legendContainer}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
        </View>

        <View style={styles.chartBody}>
          {/* Gridlines */}
          <View style={styles.gridLines}>
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
          </View>

          <View style={styles.chartContainer}>
            {chartData.map((item, idx) => (
              <View key={idx} style={styles.barColumn}>
                <Text style={styles.barAmountText}>₹{item.amount}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${item.height}%`,
                        backgroundColor: item.current ? colors.primary : colors.success,
                      },
                    ]}
                  >
                    {item.current && <View style={styles.barCapDot} />}
                  </View>
                </View>
                <Text style={[styles.barLabel, item.current && styles.currentBarLabel]}>
                  {item.day}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card>

      {/* Earnings Breakdown Card */}
      <Card style={styles.breakdownCard}>
        <Text style={styles.sectionTitle}>Payout Breakdown</Text>
        <Text style={styles.breakdownSubtitle}>Proportion of earnings from current shift cycle</Text>

        {/* Base pay */}
        <View style={styles.breakdownItem}>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItemHeader}>
              <View style={[styles.bulletIndicator, { backgroundColor: colors.success }]} />
              <Icon name="box" color={colors.success} size={14} style={styles.breakdownIcon} />
              <Text style={styles.breakdownLabel}>Base Delivery Pay</Text>
              <View style={styles.percentageBadge}>
                <Text style={styles.percentageText}>70%</Text>
              </View>
            </View>
            <Text style={styles.breakdownValue}>₹{basePay.toFixed(2)}</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '70%', backgroundColor: colors.success }]} />
          </View>
        </View>

        {/* Tips */}
        <View style={styles.breakdownItem}>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItemHeader}>
              <View style={[styles.bulletIndicator, { backgroundColor: colors.info }]} />
              <Icon name="star" color={colors.info} size={14} style={styles.breakdownIcon} />
              <Text style={styles.breakdownLabel}>Customer Tips</Text>
              <View style={styles.percentageBadge}>
                <Text style={styles.percentageText}>20%</Text>
              </View>
            </View>
            <Text style={styles.breakdownValue}>₹{tips.toFixed(2)}</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '20%', backgroundColor: colors.info }]} />
          </View>
        </View>

        {/* Incentive */}
        <View style={styles.breakdownItem}>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItemHeader}>
              <View style={[styles.bulletIndicator, { backgroundColor: colors.warning }]} />
              <Icon name="trending-up" color={colors.warning} size={14} style={styles.breakdownIcon} />
              <Text style={styles.breakdownLabel}>Peak Incentives</Text>
              <View style={styles.percentageBadge}>
                <Text style={styles.percentageText}>10%</Text>
              </View>
            </View>
            <Text style={styles.breakdownValue}>₹{incentive.toFixed(2)}</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '10%', backgroundColor: colors.warning }]} />
          </View>
        </View>
      </Card>

      {/* Incentive Promotion Banner */}
      <Card variant="glass" style={styles.promoCard}>
        <View style={styles.promoRow}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoTitle}>Rain Incentive Active! 🌧️</Text>
            <Text style={styles.promoDesc}>Earn an extra ₹40 on every delivery completed before 8 PM tonight.</Text>
          </View>
          <View style={styles.promoRight}>
            <Icon name="trending-up" color={colors.warning} size={28} />
          </View>
        </View>
      </Card>

      {/* Recent Transactions List */}
      <View style={styles.transactionsHeaderRow}>
        <Text style={styles.transactionsSectionTitle}>Recent Completed Trips</Text>
        <Text style={styles.transactionsSubtitle}>Shift payout history</Text>
      </View>

      {orderHistory.length === 0 ? (
        <Card style={styles.emptyTransactionsCard}>
          <Icon name="box" color={colors.textMuted} size={32} style={{ marginBottom: 8 }} />
          <Text style={styles.emptyTransactionsText}>No transactions in this cycle</Text>
        </Card>
      ) : (
        orderHistory.slice(0, 3).map((item) => {
          const totalPayout = item.earnings + item.tip;
          return (
            <Card key={item.id} style={styles.transactionCard}>
              <View style={styles.transactionContent}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIconWrapper}>
                    <Text style={styles.transactionIconEmoji}>💰</Text>
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionStore} numberOfLines={1}>{item.storeName}</Text>
                    <Text style={styles.transactionId}>{item.id} • Completed</Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>+₹{totalPayout.toFixed(2)}</Text>
                  <Text style={styles.transactionDate}>Today</Text>
                </View>
              </View>
            </Card>
          );
        })
      )}
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
  headerBlock: {
    marginBottom: 16,
  },
  mainTitle: {
    color: colors.text,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
  },
  subTitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  walletCardWrapper: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 16,
    marginBottom: 16,
  },
  walletCard: {
    backgroundColor: '#1E2229',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 94, 58, 0.15)',
  },
  decorCircle2: {
    position: 'absolute',
    left: -50,
    bottom: -50,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  cardGlow: {
    position: 'absolute',
    right: 40,
    bottom: 20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBadgeIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardBrandText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1.5,
  },
  cardChip: {
    width: 32,
    height: 24,
    borderRadius: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  balanceText: {
    color: colors.white,
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: 0.5,
  },
  billingCycleText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    marginTop: 6,
    marginBottom: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardRiderLabel: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 7,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardRiderName: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  bankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  bankDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  bankText: {
    color: colors.success,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  cashoutBtn: {
    backgroundColor: colors.success,
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  cashoutIcon: {
    marginRight: 8,
  },
  cashoutText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statMiniCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  statIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statMiniLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: typography.fontWeight.medium,
    marginBottom: 2,
  },
  statMiniValue: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  chartSubtitle: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 94, 58, 0.08)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  chartBody: {
    position: 'relative',
    height: 160,
    justifyContent: 'flex-end',
  },
  gridLines: {
    position: 'absolute',
    width: '100%',
    height: '80%',
    top: 10,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderStyle: 'dashed',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 140,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 2,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barAmountText: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: typography.fontWeight.medium,
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
    position: 'relative',
  },
  barCapDot: {
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
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
  breakdownCard: {
    padding: 16,
    marginBottom: 16,
  },
  breakdownSubtitle: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    marginBottom: 16,
  },
  breakdownItem: {
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  breakdownItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  breakdownIcon: {
    marginRight: 6,
  },
  breakdownLabel: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  percentageBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    marginLeft: 6,
  },
  percentageText: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: typography.fontWeight.bold,
  },
  breakdownValue: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  promoCard: {
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.15)',
    marginBottom: 20,
    padding: 14,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoLeft: {
    flex: 1,
    paddingRight: 8,
  },
  promoRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoTitle: {
    color: colors.warning,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 2,
  },
  promoDesc: {
    color: colors.textMuted,
    fontSize: 10.5,
    lineHeight: 15,
  },
  transactionsHeaderRow: {
    marginTop: 8,
    marginBottom: 10,
  },
  transactionsSectionTitle: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  transactionsSubtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  emptyTransactionsCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  emptyTransactionsText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  transactionCard: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionIconEmoji: {
    fontSize: 14,
  },
  transactionDetails: {
    flex: 1,
    paddingRight: 8,
  },
  transactionStore: {
    color: colors.text,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  transactionId: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    color: colors.success,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  transactionDate: {
    color: colors.textMuted,
    fontSize: 8,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
});
