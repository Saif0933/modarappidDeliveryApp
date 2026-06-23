import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp, Order } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Icon } from '../components/Icon';

// Enable layout animations on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const HistoryScreen: React.FC = () => {
  const { orderHistory } = useApp();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpandOrder = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedOrderId === id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(id);
    }
  };

  const renderHistoryItem = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrderId === item.id;
    const totalPayout = item.earnings + item.tip;

    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => toggleExpandOrder(item.id)}>
        <Card variant={isExpanded ? 'accent' : 'normal'} style={styles.historyCard}>
          {/* Card Header Row */}
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.orderIdText}>{item.id}</Text>
              <Text style={styles.dateText}>Today • Completed</Text>
            </View>
            <View style={styles.payoutCol}>
              <Text style={styles.payoutText}>₹{totalPayout.toFixed(2)}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Delivered</Text>
              </View>
            </View>
          </View>

          {/* Core Info Summary */}
          <View style={styles.addressSection}>
            <View style={styles.row}>
              <Icon name="store" color={colors.info} size={14} style={styles.rowIcon} />
              <Text style={styles.addressText} numberOfLines={1}>
                {item.storeName}
              </Text>
            </View>
            <View style={styles.addressLine} />
            <View style={styles.row}>
              <Icon name="map-pin" color={colors.success} size={14} style={styles.rowIcon} />
              <Text style={styles.addressText} numberOfLines={1}>
                {item.customerAddress}
              </Text>
            </View>
          </View>

          {/* Expanded detailed breakdown */}
          {isExpanded && (
            <View style={styles.expandedDetails}>
              <View style={styles.divider} />
              
              <Text style={styles.detailsLabel}>DELIVERED ITEMS</Text>
              {item.items.map((goods, idx) => (
                <View key={idx} style={styles.itemBulletRow}>
                  <Text style={styles.bulletSymbol}>•</Text>
                  <Text style={styles.itemTitle}>{goods}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.expandedStatsRow}>
                <View style={styles.expandedStat}>
                  <Text style={styles.expandedStatLabel}>Distance</Text>
                  <Text style={styles.expandedStatVal}>{item.distance}</Text>
                </View>
                <View style={styles.expandedStat}>
                  <Text style={styles.expandedStatLabel}>Base Pay</Text>
                  <Text style={styles.expandedStatVal}>₹{item.earnings}</Text>
                </View>
                <View style={styles.expandedStat}>
                  <Text style={styles.expandedStatLabel}>Tip Awarded</Text>
                  <Text style={[styles.expandedStatVal, { color: colors.success }]}>₹{item.tip}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Folding indicator chevron */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              {isExpanded ? 'Tap to collapse' : 'Tap for details'}
            </Text>
            <Icon
              name={isExpanded ? 'chevron-left' : 'chevron-right'}
              color={colors.textMuted}
              size={12}
              style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip History</Text>
      <Text style={styles.subtitle}>Showing list of completed trips for this shift</Text>

      {orderHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="box" color={colors.textMuted} size={48} style={{ marginBottom: 12 }} />
          <Text style={styles.emptyText}>No completed orders yet</Text>
          <Text style={styles.emptySubtext}>Your deliveries will appear here once finished.</Text>
        </View>
      ) : (
        <FlatList
          data={orderHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginBottom: 20,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 40,
  },
  historyCard: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderIdText: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  dateText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  payoutCol: {
    alignItems: 'flex-end',
  },
  payoutText: {
    color: colors.success,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginTop: 4,
  },
  statusBadgeText: {
    color: colors.success,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  addressSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 8,
  },
  addressText: {
    color: colors.text,
    fontSize: typography.fontSize.xs,
    flex: 1,
  },
  addressLine: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginLeft: 14,
    marginVertical: 4,
  },
  expandedDetails: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  detailsLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    marginBottom: 8,
  },
  itemBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingLeft: 6,
  },
  bulletSymbol: {
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 8,
  },
  itemTitle: {
    color: colors.text,
    fontSize: typography.fontSize.xs,
  },
  expandedStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    padding: 10,
    borderRadius: 8,
  },
  expandedStat: {
    alignItems: 'center',
    flex: 1,
  },
  expandedStatLabel: {
    color: colors.textMuted,
    fontSize: 8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  expandedStatVal: {
    color: colors.text,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 4,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 4,
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },
});
