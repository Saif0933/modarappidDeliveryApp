import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Button, SwipeButton } from '../common/Button';
import { Card } from '../common/Card';
import { Icon } from '../Icon';

const { height, width } = Dimensions.get('window');

export const OrderOfferModal: React.FC = () => {
  const { incomingOffer, offerTimeRemaining, acceptOffer, declineOffer } = useApp();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for the notification tag
  useEffect(() => {
    if (incomingOffer) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [incomingOffer]);

  if (!incomingOffer) return null;

  const totalPayout = incomingOffer.earnings + incomingOffer.tip;
  const progressPercent = (offerTimeRemaining / 30) * 100;

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.offerContainer}>
          {/* Pulsing Alarm Badge */}
          <Animated.View style={[styles.badgeContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.badge}>
              <Icon name="bell" color={colors.white} size={14} style={styles.bellIcon} />
              <Text style={styles.badgeText}>NEW DELIVERY OFFER</Text>
            </View>
          </Animated.View>

          <Card variant="glass" style={styles.offerCard}>
            {/* Top countdown progress bar */}
            <View style={styles.timerContainer}>
              <View
                style={[
                  styles.timerBar,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: offerTimeRemaining > 10 ? colors.primary : colors.danger,
                  },
                ]}
              />
            </View>
            <View style={styles.timerRow}>
              <Icon
                name="history"
                color={offerTimeRemaining > 10 ? colors.primary : colors.danger}
                size={14}
              />
              <Text style={[
                styles.timerText,
                { color: offerTimeRemaining > 10 ? colors.primary : colors.danger }
              ]}>
                Offer Expires in {offerTimeRemaining}s
              </Text>
            </View>

            {/* Price Tag Container */}
            <View style={styles.payoutContainer}>
              <Text style={styles.payoutLabel}>Guaranteed Earning</Text>
              <Text style={styles.payoutValue}>₹{totalPayout.toFixed(2)}</Text>
              {incomingOffer.tip > 0 && (
                <View style={styles.tipBadge}>
                  <Text style={styles.tipText}>Includes ₹{incomingOffer.tip} Tip</Text>
                </View>
              )}
            </View>

            {/* Trip Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Est. Time</Text>
                <Text style={styles.detailValue}>{incomingOffer.estTime}</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Trip Distance</Text>
                <Text style={styles.detailValue}>{incomingOffer.distance}</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>To Store</Text>
                <Text style={styles.detailValue}>{incomingOffer.pickupDistance}</Text>
              </View>
            </View>

            {/* Route Map (Stylized visual display) */}
            <View style={styles.routeContainer}>
              {/* Pickup node */}
              <View style={styles.routeRow}>
                <View style={styles.iconColumn}>
                  <View style={[styles.circleDot, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                    <Icon name="store" color={colors.info} size={12} />
                  </View>
                  <View style={styles.lineConnector} />
                </View>
                <View style={styles.addressColumn}>
                  <Text style={styles.addressTitle}>PICKUP VENDOR</Text>
                  <Text style={styles.storeName}>{incomingOffer.storeName}</Text>
                  <Text style={styles.addressText} numberOfLines={1}>
                    {incomingOffer.storeAddress}
                  </Text>
                </View>
              </View>

              {/* Dropoff node */}
              <View style={styles.routeRow}>
                <View style={styles.iconColumn}>
                  <View style={[styles.circleDot, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                    <Icon name="map-pin" color={colors.success} size={12} />
                  </View>
                </View>
                <View style={styles.addressColumn}>
                  <Text style={styles.addressTitle}>DROP CUSTOMER</Text>
                  <Text style={styles.storeName}>{incomingOffer.customerName}</Text>
                  <Text style={styles.addressText} numberOfLines={1}>
                    {incomingOffer.customerAddress}
                  </Text>
                </View>
              </View>
            </View>

            {/* Items Summary */}
            <View style={styles.itemsSummary}>
              <Icon name="check" color={colors.primary} size={14} style={{ marginRight: 6 }} />
              <Text style={styles.itemsText} numberOfLines={1}>
                {incomingOffer.items.join(', ')}
              </Text>
            </View>

            {/* Interaction Buttons */}
            <View style={styles.actionsContainer}>
              <SwipeButton
                title="Swipe to Accept Order"
                onSwipeSuccess={acceptOffer}
                color={colors.success}
                style={styles.swipeBtn}
              />
              
              <Button
                title="Decline Offer"
                onPress={declineOffer}
                variant="danger"
                style={styles.declineBtn}
              />
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 10, 13, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  offerContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  badgeContainer: {
    marginBottom: -16,
    zIndex: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFA07A',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  bellIcon: {
    marginRight: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  offerCard: {
    width: '100%',
    paddingTop: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 94, 58, 0.2)',
  },
  timerContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
  },
  timerBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 3,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  timerText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    marginLeft: 6,
  },
  payoutContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  payoutLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  payoutValue: {
    color: colors.text,
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.heavy,
  },
  tipBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.success,
  },
  tipText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
  },
  detailsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailBox: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  routeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  routeRow: {
    flexDirection: 'row',
  },
  iconColumn: {
    alignItems: 'center',
    marginRight: 12,
    width: 24,
  },
  circleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineConnector: {
    width: 1,
    height: 36,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 4,
  },
  addressColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  addressTitle: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  storeName: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  addressText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  itemsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  itemsText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    flex: 1,
  },
  actionsContainer: {
    width: '100%',
  },
  swipeBtn: {
    marginBottom: 12,
  },
  declineBtn: {
    borderWidth: 0,
  },
});
