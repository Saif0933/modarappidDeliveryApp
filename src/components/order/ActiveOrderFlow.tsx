import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SwipeButton } from '../common/Button';
import { Card } from '../common/Card';
import { Icon } from '../Icon';

export const ActiveOrderFlow: React.FC = () => {
  const { activeOrder, activeOrderStage, advanceOrderStage, completeOrder, cancelActiveOrder } = useApp();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  if (!activeOrder) return null;

  const handleCall = (name: string, phone: string) => {
    Alert.alert('Simulating Call', `Dialing ${name} at ${phone}...`);
  };

  const toggleItemCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const allItemsChecked = () => {
    return activeOrder.items.every((_, idx) => checkedItems[idx]);
  };

  const getStageHeader = () => {
    switch (activeOrderStage) {
      case 'accepted':
        return 'Headed to Merchant';
      case 'arrived_at_store':
        return 'Pickup in Progress';
      case 'picked_up':
        return 'Heading to Customer';
      default:
        return 'Delivery Active';
    }
  };

  const getStageBadgeColor = () => {
    switch (activeOrderStage) {
      case 'accepted':
        return colors.info;
      case 'arrived_at_store':
        return colors.warning;
      case 'picked_up':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Status Header */}
      <View style={styles.statusHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={cancelActiveOrder} style={styles.backButton}>
            <Icon name="chevron-left" color={colors.text} size={20} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.orderIdText}>Order {activeOrder.id}</Text>
            <View style={[styles.stageBadge, { backgroundColor: getStageBadgeColor() }]}>
              <Text style={styles.stageBadgeText}>{getStageHeader()}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.estTimeText}>Est. Arrival: {activeOrder.estTime}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dynamic Stylized Map Section for Navigation stages */}
        {(activeOrderStage === 'accepted' || activeOrderStage === 'picked_up') && (
          <Card variant="glass" style={styles.mapCard}>
            <View style={styles.mapPlaceholder}>
              {/* Decorative Map Features: Parks & Lakes */}
              <View style={styles.mapPark} />
              <View style={[styles.mapPark, { right: '8%', top: '55%', width: 70, height: 40 }]} />
              <View style={styles.mapLake} />
              
              {/* Decorative Map Features: Buildings */}
              <View style={styles.mapBuilding} />
              <View style={[styles.mapBuilding, { left: '10%', top: '70%', width: 50, height: 30 }]} />
              <View style={[styles.mapBuilding, { left: '80%', top: '8%', width: 40, height: 40 }]} />

              {/* Grid Lines simulating streets */}
              <View style={styles.streetHorizontal} />
              <View style={[styles.streetHorizontal, { top: '65%' }]} />
              <View style={styles.streetVertical} />
              <View style={[styles.streetVertical, { left: '75%' }]} />

              {/* Route line */}
              <View
                style={[
                  styles.routeLine,
                  activeOrderStage === 'accepted'
                    ? { width: '60%', height: 4, left: '20%', top: '48%', transform: [{ rotate: '15deg' }] }
                    : { width: '70%', height: 4, left: '15%', top: '35%', transform: [{ rotate: '-25deg' }] },
                ]}
              />

              {/* Store & Customer Pins */}
              {activeOrderStage === 'accepted' ? (
                <>
                  {/* Rider Dot */}
                  <View style={[styles.riderDot, { left: '20%', top: '40%' }]}>
                    <View style={styles.riderRadar} />
                  </View>
                  {/* Store Pin */}
                  <View style={[styles.pinWrapper, { left: '75%', top: '45%' }]}>
                    <Icon name="store" color={colors.info} size={16} />
                    <View style={styles.pinShadow} />
                  </View>
                </>
              ) : (
                <>
                  {/* Rider Dot */}
                  <View style={[styles.riderDot, { left: '15%', top: '50%' }]}>
                    <View style={styles.riderRadar} />
                  </View>
                  {/* Customer Pin */}
                  <View style={[styles.pinWrapper, { left: '78%', top: '22%' }]}>
                    <Icon name="map-pin" color={colors.success} size={16} />
                    <View style={styles.pinShadow} />
                  </View>
                </>
              )}

              {/* Compass Card overlay */}
              <View style={styles.mapOverlayInfo}>
                <Icon name="navigation" color={colors.primary} size={16} />
                <Text style={styles.mapOverlayDistance}>
                  {activeOrderStage === 'accepted' ? activeOrder.pickupDistance : activeOrder.distance}
                </Text>
              </View>
            </View>
            <View style={styles.directionGuide}>
              <Text style={styles.directionText} numberOfLines={1}>
                {activeOrderStage === 'accepted'
                  ? `Navigate to: ${activeOrder.storeName}`
                  : `Navigate to: ${activeOrder.customerAddress}`}
              </Text>
            </View>
          </Card>
        )}

        {/* Address and Contacts Section */}
        {activeOrderStage === 'accepted' && (
          <Card style={styles.detailCard}>
            <Text style={styles.sectionLabel}>STORE DETAILS</Text>
            <View style={styles.contactRow}>
              <View style={styles.addressInfo}>
                <Text style={styles.storeNameText}>{activeOrder.storeName}</Text>
                <Text style={styles.addressDescText}>{activeOrder.storeAddress}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleCall(activeOrder.storeName, activeOrder.storePhone)}
                style={styles.callButton}
              >
                <Icon name="phone" color={colors.white} size={18} />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Items Checklist Verification at Store */}
        {activeOrderStage === 'arrived_at_store' && (
          <Card style={styles.detailCard}>
            <View style={styles.verificationHeader}>
              <Text style={styles.sectionLabel}>VERIFY GARMENTS ({activeOrder.items.length})</Text>
              <Text style={styles.subtextLabel}>Verify sizes and tick items below</Text>
            </View>

            {activeOrder.items.map((item, index) => {
              const sizeMatch = item.match(/\(([^)]+)\)/);
              const size = sizeMatch ? sizeMatch[1] : null;
              const cleanName = item.replace(/\s*\([^)]+\)/g, '');
              
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => toggleItemCheck(index)}
                  style={[
                    styles.itemVerifyRow,
                    checkedItems[index]
                      ? { backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }
                      : { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.itemTitleCol}>
                    <View style={styles.itemTitleRow}>
                      <Icon
                        name="check"
                        color={checkedItems[index] ? colors.success : colors.textMuted}
                        size={14}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={[styles.itemText, checkedItems[index] && styles.checkedText]}>
                        {cleanName}
                      </Text>
                    </View>
                    {size && (
                      <View style={styles.sizeBadge}>
                        <Text style={styles.sizeBadgeText}>Size {size}</Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: checkedItems[index] ? colors.success : colors.border,
                        backgroundColor: checkedItems[index] ? colors.success : 'transparent',
                      },
                    ]}
                  >
                    {checkedItems[index] && <Text style={styles.checkboxCheck}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}

            <View style={styles.merchantNote}>
              <Icon name="verified" color={colors.warning} size={14} style={{ marginRight: 6 }} />
              <Text style={styles.merchantNoteText}>
                Note: Standard hanger-loop packing required. Ask merchant for a raincoat carry bag.
              </Text>
            </View>
          </Card>
        )}

        {/* Customer Details Screen when out for delivery */}
        {activeOrderStage === 'picked_up' && (
          <Card style={styles.detailCard}>
            <Text style={styles.sectionLabel}>CUSTOMER DETAILS</Text>
            <View style={styles.contactRow}>
              <View style={styles.addressInfo}>
                <Text style={styles.storeNameText}>{activeOrder.customerName}</Text>
                <Text style={styles.addressDescText}>{activeOrder.customerAddress}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleCall(activeOrder.customerName, activeOrder.customerPhone)}
                style={styles.callButton}
              >
                <Icon name="phone" color={colors.white} size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.dividerLine} />

            <View style={styles.deliveryNoteContainer}>
              <Text style={styles.deliveryNoteTitle}>Customer Instructions</Text>
              <Text style={styles.deliveryNoteText}>
                "Leave package at reception/security gate if not reachable. Call before arriving."
              </Text>
            </View>
          </Card>
        )}

        {/* Earnings Card Summary */}
        <Card style={styles.miniEarningCard}>
          <View style={styles.miniEarningRow}>
            <View style={styles.earningsCol}>
              <Text style={styles.earningsLabel}>Base Delivery Pay</Text>
              <Text style={styles.earningsValue}>₹{activeOrder.earnings.toFixed(2)}</Text>
            </View>
            <View style={styles.verticalBorder} />
            <View style={styles.earningsCol}>
              <Text style={styles.earningsLabel}>Customer Tip</Text>
              <Text style={[styles.earningsValue, { color: colors.success }]}>₹{activeOrder.tip.toFixed(2)}</Text>
            </View>
            <View style={styles.verticalBorder} />
            <View style={styles.earningsCol}>
              <Text style={styles.earningsLabel}>Total Payout</Text>
              <Text style={[styles.earningsValue, { color: colors.primary }]}>
                ₹{(activeOrder.earnings + activeOrder.tip).toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Swipe Action Controls Bottom bar */}
      <View style={styles.bottomBarContainer}>
        {activeOrderStage === 'accepted' && (
          <SwipeButton
            title="Swipe to Arrive at Store"
            onSwipeSuccess={advanceOrderStage}
            color={colors.info}
          />
        )}

        {activeOrderStage === 'arrived_at_store' && (
          <View style={styles.actionColumnWrapper}>
            {!allItemsChecked() && (
              <Text style={styles.checkAlertText}>Please verify all items to continue</Text>
            )}
            <SwipeButton
              title="Swipe to Confirm Pickup"
              onSwipeSuccess={advanceOrderStage}
              color={colors.warning}
              style={{ opacity: allItemsChecked() ? 1 : 0.4 }}
            />
          </View>
        )}

        {activeOrderStage === 'picked_up' && (
          <SwipeButton
            title="Swipe to Complete Delivery"
            onSwipeSuccess={completeOrder}
            color={colors.success}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginLeft: -4,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIdText: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  stageBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  stageBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  estTimeText: {
    color: colors.warning,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Cushion for bottom bar
  },
  mapCard: {
    padding: 0,
    overflow: 'hidden',
    height: 220,
    marginBottom: 16,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E4E9F0',
    position: 'relative',
    overflow: 'hidden',
  },
  streetHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '30%',
    height: 12,
    backgroundColor: '#FFFFFF',
  },
  streetVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '25%',
    width: 12,
    backgroundColor: '#FFFFFF',
  },
  routeLine: {
    position: 'absolute',
    backgroundColor: colors.info,
    shadowColor: colors.info,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  riderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    position: 'absolute',
    zIndex: 10,
  },
  riderRadar: {
    position: 'absolute',
    left: -12,
    top: -12,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 94, 58, 0.3)',
    backgroundColor: 'rgba(255, 94, 58, 0.1)',
  },
  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pinShadow: {
    width: 6,
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 3,
    marginTop: 2,
  },
  mapOverlayInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapOverlayDistance: {
    color: colors.text,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginLeft: 6,
  },
  directionGuide: {
    backgroundColor: colors.card,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  directionText: {
    color: colors.text,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  detailCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    marginBottom: 12,
  },
  subtextLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: -8,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressInfo: {
    flex: 1,
    marginRight: 16,
  },
  storeNameText: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  addressDescText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 4,
    lineHeight: 16,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  verificationHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  itemVerifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemTitleCol: {
    flex: 1,
  },
  itemText: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  checkedText: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCheck: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  merchantNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  merchantNoteText: {
    color: colors.warning,
    fontSize: 10,
    flex: 1,
    lineHeight: 14,
  },
  dividerLine: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  deliveryNoteContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deliveryNoteTitle: {
    color: colors.text,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: 4,
  },
  deliveryNoteText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  miniEarningCard: {
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  miniEarningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningsCol: {
    flex: 1,
    alignItems: 'center',
  },
  earningsLabel: {
    color: colors.textMuted,
    fontSize: 9,
    marginBottom: 4,
  },
  earningsValue: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  verticalBorder: {
    width: 1,
    backgroundColor: colors.border,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionColumnWrapper: {
    width: '100%',
  },
  checkAlertText: {
    color: colors.danger,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: typography.fontWeight.semibold,
  },
  mapPark: {
    position: 'absolute',
    width: 80,
    height: 45,
    backgroundColor: '#E1EFE0',
    borderRadius: 8,
    left: '8%',
    top: '12%',
  },
  mapLake: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#E0EEF9',
    borderRadius: 25,
    left: '35%',
    top: '58%',
  },
  mapBuilding: {
    position: 'absolute',
    width: 45,
    height: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 4,
    left: '55%',
    top: '15%',
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 94, 58, 0.08)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    marginLeft: 22,
  },
  sizeBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
});
