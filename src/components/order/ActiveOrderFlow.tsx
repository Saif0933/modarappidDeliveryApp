import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ViewStyle
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SwipeButton } from '../common/Button';
import { Card } from '../common/Card';
import { Icon } from '../Icon';

const ORDER_COORDINATES: Record<string, {
  storeLat: number;
  storeLon: number;
  customerLat: number;
  customerLon: number;
  centerLat: number;
  centerLon: number;
}> = {
  'DRV-9082': {
    storeLat: 28.5672,
    storeLon: 77.3210,
    customerLat: 28.6080,
    customerLon: 77.3780,
    centerLat: 28.5876,
    centerLon: 77.3495,
  },
  'DRV-4531': {
    storeLat: 28.6304,
    storeLon: 77.2177,
    customerLat: 28.5991,
    customerLon: 77.2224,
    centerLat: 28.6148,
    centerLon: 77.2201,
  },
  'DRV-3312': {
    storeLat: 28.5041,
    storeLon: 77.0971,
    customerLat: 28.4357,
    customerLon: 77.1025,
    centerLat: 28.4699,
    centerLon: 77.0998,
  },
};

const getCoordinatesForOrder = (orderId: string) => {
  const idNum = parseInt(orderId.replace(/\D/g, ''), 10) || 0;
  const keys = Object.keys(ORDER_COORDINATES);
  const matchedKey = keys.find(k => orderId.includes(k) || k.includes(orderId));
  if (matchedKey) {
    return ORDER_COORDINATES[matchedKey];
  }
  return {
    storeLat: 28.5672 + (idNum % 10) * 0.003,
    storeLon: 77.3210 + (idNum % 7) * 0.003,
    customerLat: 28.6080 + (idNum % 5) * 0.003,
    customerLon: 77.3780 + (idNum % 3) * 0.003,
    centerLat: 28.5876 + (idNum % 6) * 0.003,
    centerLon: 77.3495 + (idNum % 4) * 0.003,
  };
};

export const ActiveOrderFlow: React.FC = () => {
  const { activeOrder, activeOrderStage, advanceOrderStage, completeOrder, cancelActiveOrder } = useApp();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [mapProvider, setMapProvider] = useState<'google' | 'ola' | 'simulated'>('google');
  const [googleKey, setGoogleKey] = useState<string>('');
  const [olaKey, setOlaKey] = useState<string>('');
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [riderProgress, setRiderProgress] = useState<number>(0);

  useEffect(() => {
    setRiderProgress(0);
    const interval = setInterval(() => {
      setRiderProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.025; // Smooth incremental steps
      });
    }, 300);
    return () => clearInterval(interval);
  }, [activeOrderStage]);

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

  const coords = getCoordinatesForOrder(activeOrder.id);
  const zoom = 13;

  // Determine current rider coordinates (interpolated along the Ola Map / Google Map path)
  let riderLat = coords.storeLat;
  let riderLon = coords.storeLon;
  
  if (activeOrderStage === 'accepted') {
    // Rider starts 1.2km away southwest from store and heads to store
    const startLat = coords.storeLat - 0.007;
    const startLon = coords.storeLon - 0.007;
    riderLat = startLat + riderProgress * 0.007;
    riderLon = startLon + riderProgress * 0.007;
  } else if (activeOrderStage === 'picked_up') {
    // Rider travels from store to customer
    riderLat = coords.storeLat + riderProgress * (coords.customerLat - coords.storeLat);
    riderLon = coords.storeLon + riderProgress * (coords.customerLon - coords.storeLon);
  }

  const getPercentPos = (lat: number, lon: number) => {
    const latDiff = lat - coords.centerLat;
    const lonDiff = lon - coords.centerLon;
    const latSpan = 0.024; // Visual bounding box span
    const lonSpan = 0.024;
    
    const left = 50 + (lonDiff / lonSpan) * 50;
    const top = 50 - (latDiff / latSpan) * 50;
    
    return {
      left: `${Math.max(6, Math.min(94, left))}%`,
      top: `${Math.max(6, Math.min(94, top))}%`
    };
  };

  const getMapUrl = () => {
    if (mapProvider === 'google') {
      if (googleKey.trim()) {
        return `https://maps.googleapis.com/maps/api/staticmap?center=${coords.centerLat},${coords.centerLon}&zoom=${zoom}&size=500x220&scale=2&maptype=roadmap&markers=color:red%7Clabel:S%7C${coords.storeLat},${coords.storeLon}&markers=color:green%7Clabel:C%7C${coords.customerLat},${coords.customerLon}&path=color:0x3b82f6%7Cweight:5%7C${coords.storeLat},${coords.storeLon}%7C${coords.customerLat},${coords.customerLon}&key=${googleKey}`;
      }
      return `https://static-maps.yandex.ru/1.x/?ll=${coords.centerLon},${coords.centerLat}&z=${zoom}&l=map&size=450,220&pt=${coords.storeLon},${coords.storeLat},pm2rdm~${coords.customerLon},${coords.customerLat},pm2gld`;
    } else if (mapProvider === 'ola') {
      if (olaKey.trim()) {
        return `https://api.olamaps.io/tiles/v1/styles/default-light-standard/static/${coords.centerLon},${coords.centerLat},${zoom}/500x220.png?api_key=${olaKey}`;
      }
      return `https://static-maps.yandex.ru/1.x/?ll=${coords.centerLon},${coords.centerLat}&z=${zoom}&l=map&size=450,220&pt=${coords.storeLon},${coords.storeLat},pm2rdm~${coords.customerLon},${coords.customerLat},pm2gld`;
    }
    return '';
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
        {/* Dynamic Stage Progress Bar Tracker */}
        <View style={styles.trackerContainer}>
          <View style={styles.trackerLine}>
            <View
              style={[
                styles.trackerLineActive,
                {
                  width:
                    activeOrderStage === 'accepted'
                      ? '15%'
                      : activeOrderStage === 'arrived_at_store'
                      ? '50%'
                      : '100%',
                },
              ]}
            />
          </View>
          <View style={styles.trackerStepsRow}>
            <View style={styles.trackerStep}>
              <View
                style={[
                  styles.trackerDotShape,
                  (activeOrderStage === 'accepted' ||
                    activeOrderStage === 'arrived_at_store' ||
                    activeOrderStage === 'picked_up') &&
                    styles.trackerDotShapeActive,
                ]}
              >
                {activeOrderStage !== 'accepted' &&
                (activeOrderStage === 'arrived_at_store' || activeOrderStage === 'picked_up') ? (
                  <Text style={styles.trackerStepCheck}>✓</Text>
                ) : (
                  <View style={[styles.trackerStepInnerDot, activeOrderStage === 'accepted' && { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text style={styles.trackerStepLabel}>Accept</Text>
            </View>

            <View style={styles.trackerStep}>
              <View
                style={[
                  styles.trackerDotShape,
                  (activeOrderStage === 'arrived_at_store' || activeOrderStage === 'picked_up') &&
                    styles.trackerDotShapeActive,
                ]}
              >
                {activeOrderStage === 'picked_up' ? (
                  <Text style={styles.trackerStepCheck}>✓</Text>
                ) : (
                  <View style={[styles.trackerStepInnerDot, activeOrderStage === 'arrived_at_store' && { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text style={styles.trackerStepLabel}>Merchant</Text>
            </View>

            <View style={styles.trackerStep}>
              <View
                style={[
                  styles.trackerDotShape,
                  activeOrderStage === 'picked_up' && styles.trackerDotShapeActive,
                ]}
              >
                <View style={[styles.trackerStepInnerDot, activeOrderStage === 'picked_up' && { backgroundColor: colors.primary }]} />
              </View>
              <Text style={styles.trackerStepLabel}>Customer</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Stylized Map Section for Navigation stages */}
        {(activeOrderStage === 'accepted' || activeOrderStage === 'picked_up') && (
          <>
            <Card variant="glass" style={styles.mapCard}>
              {/* Map Provider Tabs */}
              <View style={styles.mapTabs}>
                <TouchableOpacity
                  style={[styles.mapTab, mapProvider === 'google' && styles.mapTabActive]}
                  onPress={() => setMapProvider('google')}
                >
                  <Text style={[styles.mapTabText, mapProvider === 'google' && styles.mapTabTextActive]}>Google Map</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mapTab, mapProvider === 'ola' && styles.mapTabActive]}
                  onPress={() => setMapProvider('ola')}
                >
                  <Text style={[styles.mapTabText, mapProvider === 'ola' && styles.mapTabTextActive]}>Ola Map</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mapTab, mapProvider === 'simulated' && styles.mapTabActive]}
                  onPress={() => setMapProvider('simulated')}
                >
                  <Text style={[styles.mapTabText, mapProvider === 'simulated' && styles.mapTabTextActive]}>Simulated</Text>
                </TouchableOpacity>
                
                {/* Settings Gear */}
                <TouchableOpacity
                  style={styles.settingsIcon}
                  onPress={() => setShowConfig(!showConfig)}
                >
                  <Icon name="verified" color={showConfig ? colors.primary : colors.textMuted} size={14} />
                </TouchableOpacity>
              </View>

              <View style={styles.mapPlaceholder}>
                {mapProvider === 'simulated' ? (
                  <>
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

                    {/* Store Pin (Simulated) */}
                    <View style={[styles.pinWrapper, { left: '75%', top: '45%' }]}>
                      <Icon name="store" color={colors.info} size={16} />
                      <View style={styles.pinShadow} />
                    </View>

                    {/* Customer Pin (Simulated) */}
                    <View style={[styles.pinWrapper, { left: '78%', top: '22%' }]}>
                      <Icon name="map-pin" color={colors.success} size={16} />
                      <View style={styles.pinShadow} />
                    </View>

                    {/* Animated Rider Dot (Simulated) */}
                    <View
                      style={[
                        styles.riderDot,
                        activeOrderStage === 'accepted'
                          ? {
                              left: `${20 + riderProgress * (75 - 20)}%`,
                              top: `${40 + riderProgress * (45 - 40)}%`,
                            }
                          : {
                              left: `${75 + riderProgress * (78 - 75)}%`,
                              top: `${45 + riderProgress * (22 - 45)}%`,
                            },
                      ]}
                    >
                      <View style={styles.riderRadar} />
                    </View>
                  </>
                ) : (
                  <View style={{ flex: 1, position: 'relative' }}>
                    <Image
                      source={{ uri: getMapUrl() }}
                      style={styles.mapImage}
                      resizeMode="cover"
                    />
                    
                    {/* Real coordinates mapped pins overlay */}
                    {/* Store Pin */}
                    <View style={[styles.pinWrapper, { position: 'absolute', ...getPercentPos(coords.storeLat, coords.storeLon) } as ViewStyle]}>
                      <Icon name="store" color={colors.info} size={18} />
                      <View style={styles.pinShadow} />
                    </View>

                    {/* Customer Pin */}
                    <View style={[styles.pinWrapper, { position: 'absolute', ...getPercentPos(coords.customerLat, coords.customerLon) } as ViewStyle]}>
                      <Icon name="map-pin" color={colors.success} size={18} />
                      <View style={styles.pinShadow} />
                    </View>

                    {/* Animated Rider Dot */}
                    <View
                      style={[
                        styles.riderDot,
                        {
                          position: 'absolute',
                          ...getPercentPos(riderLat, riderLon),
                        } as ViewStyle,
                      ]}
                    >
                      <View style={styles.riderRadar} />
                    </View>

                    {/* Floating API status / Marker overlay */}
                    <View style={styles.mapInfoBadge}>
                      <Text style={styles.mapInfoBadgeText}>
                        {mapProvider === 'google'
                          ? (googleKey.trim() ? 'Google Maps Live API' : 'Google Map (Ola GPS Tracking)')
                          : (olaKey.trim() ? 'Ola Maps Live API' : 'Ola Map Tracking Active')}
                      </Text>
                    </View>
                  </View>
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

            {/* API Config Panel */}
            {showConfig && (
              <Card style={styles.configCard}>
                <Text style={styles.configTitle}>Map API Credentials</Text>
                <Text style={styles.configSubtitle}>Enter your API keys to query live endpoints:</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Google Maps API Key</Text>
                  <TextInput
                    style={styles.textInput}
                    value={googleKey}
                    onChangeText={setGoogleKey}
                    placeholder="AIzaSy..."
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Ola Maps API Key</Text>
                  <TextInput
                    style={styles.textInput}
                    value={olaKey}
                    onChangeText={setOlaKey}
                    placeholder="Enter Ola API Key"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity style={styles.closeConfigBtn} onPress={() => setShowConfig(false)}>
                  <Text style={styles.closeConfigBtnText}>Done</Text>
                </TouchableOpacity>
              </Card>
            )}
          </>
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
    height: 250,
    marginBottom: 16,
  },
  mapTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  mapTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  mapTabActive: {
    backgroundColor: colors.primary,
  },
  mapTabText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
  },
  mapTabTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  settingsIcon: {
    marginLeft: 'auto',
    padding: 6,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapInfoBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    zIndex: 10,
  },
  mapInfoBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  configCard: {
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  configTitle: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 2,
  },
  configSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    marginBottom: 4,
  },
  textInput: {
    height: 36,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 11,
    color: colors.text,
    backgroundColor: colors.background,
  },
  closeConfigBtn: {
    backgroundColor: colors.success,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  closeConfigBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
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
  trackerContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trackerLine: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    position: 'absolute',
    left: 45,
    right: 45,
    top: 28,
  },
  trackerLineActive: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  trackerStepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackerStep: {
    alignItems: 'center',
    width: 70,
  },
  trackerDotShape: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    zIndex: 2,
  },
  trackerDotShapeActive: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  trackerStepInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  trackerStepCheck: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  trackerStepLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.semibold,
  },
});
