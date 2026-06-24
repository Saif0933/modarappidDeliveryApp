import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Icon } from '../components/Icon';

export const ProfileScreen: React.FC = () => {
  const { isOnline, toggleOnline, logout } = useApp();
  const [autoAccept, setAutoAccept] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [navMode, setNavMode] = useState<'inapp' | 'external'>('inapp');

  const handleEndShift = () => {
    Alert.alert(
      'End Shift',
      'This will turn off your online status and log you out of the active shift. Confirm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            if (isOnline) {
              toggleOnline();
            }
            logout();
            Alert.alert('Shift Ended', 'You are logged out of your shift. Safe riding!');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Profile Header Card */}
      <Card variant="glass" style={styles.profileHeaderCard}>
        <View style={styles.avatarBig}>
          <Text style={styles.avatarBigText}>RS</Text>
          <View style={styles.avatarStatusDot} />
        </View>
        
        <Text style={styles.nameText}>Rohan Sharma</Text>
        <Text style={styles.phoneText}>+91 98765 43210</Text>
        <Text style={styles.roleText}>Elite Delivery Partner</Text>

        {/* Rating and Acceptance Row */}
        <View style={styles.ratingRow}>
          <View style={styles.ratingBox}>
            <View style={styles.flexRow}>
              <Icon name="star" color={colors.warning} size={14} style={{ marginRight: 4 }} />
              <Text style={styles.ratingVal}>4.92</Text>
            </View>
            <Text style={styles.ratingLbl}>Rider Rating</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.ratingBox}>
            <Text style={styles.ratingVal}>98.4%</Text>
            <Text style={styles.ratingLbl}>Acceptance</Text>
          </View>
        </View>
      </Card>

      {/* Vehicle details */}
      <Text style={styles.sectionHeader}>VEHICLE & VERIFICATION</Text>
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Icon name="car" color={colors.primary} size={18} style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Hero MotoCorp Splendor Plus</Text>
            <Text style={styles.infoSub}>DL 3S AB 1234 • Black Accent</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Active</Text>
          </View>
        </View>

        <View style={styles.horizontalLine} />

        <View style={styles.infoRow}>
          <Icon name="verified" color={colors.success} size={18} style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Rider License & Documents</Text>
            <Text style={styles.infoSub}>Verified by ModarApp Team • Expires 2031</Text>
          </View>
          <Icon name="check" color={colors.success} size={16} />
        </View>
      </Card>

      {/* Rider settings/preferences */}
      <Text style={styles.sectionHeader}>RIDER PREFERENCES</Text>
      <Card style={styles.infoCard}>
        {/* Auto Accept Switch */}
        <View style={styles.settingToggleRow}>
          <View style={styles.settingDetails}>
            <Text style={styles.settingTitle}>Auto-Accept Offers</Text>
            <Text style={styles.settingSub}>Automatically accepts orders when matched</Text>
          </View>
          <Switch
            value={autoAccept}
            onValueChange={setAutoAccept}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
          />
        </View>

        <View style={styles.horizontalLine} />

        {/* Sound Switch */}
        <View style={styles.settingToggleRow}>
          <View style={styles.settingDetails}>
            <Text style={styles.settingTitle}>High-Volume Alarm</Text>
            <Text style={styles.settingSub}>Play loud sound alerts for new order cards</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
          />
        </View>

        <View style={styles.horizontalLine} />

        {/* Navigation Selector */}
        <View style={styles.navigationSelection}>
          <Text style={styles.settingTitle}>Map Navigation Mode</Text>
          <Text style={styles.settingSub}>Select default map engine for active orders</Text>
          
          <View style={styles.tabButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setNavMode('inapp')}
              style={[
                styles.tabBtn,
                navMode === 'inapp' ? styles.tabBtnActive : styles.tabBtnInactive,
              ]}
            >
              <Text style={[styles.tabBtnText, navMode === 'inapp' && styles.tabBtnTextActive]}>
                In-App vector
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setNavMode('external')}
              style={[
                styles.tabBtn,
                navMode === 'external' ? styles.tabBtnActive : styles.tabBtnInactive,
              ]}
            >
              <Text style={[styles.tabBtnText, navMode === 'external' && styles.tabBtnTextActive]}>
                Google Maps
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Shift settings */}
      <Text style={styles.sectionHeader}>SHIFT INFORMATION</Text>
      <Card style={styles.infoCard}>
        <View style={styles.shiftDetailsRow}>
          <View>
            <Text style={styles.shiftTitle}>Morning Delivery Duty</Text>
            <Text style={styles.shiftZone}>DLF Phase 1-5 Gate / Sector 43 Hub</Text>
          </View>
          <Text style={styles.shiftTime}>08:00 - 16:00</Text>
        </View>
      </Card>

      {/* Logout button */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleEndShift} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>End Shift & Go Offline</Text>
      </TouchableOpacity>
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
  profileHeaderCard: {
    alignItems: 'center',
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarBig: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    position: 'relative',
    marginBottom: 12,
  },
  avatarBigText: {
    color: colors.text,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  avatarStatusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.card,
  },
  nameText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  phoneText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  roleText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    width: '100%',
  },
  ratingBox: {
    flex: 1,
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingVal: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  ratingLbl: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  sectionHeader: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 4,
  },
  infoCard: {
    padding: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  infoSub: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  verifiedText: {
    color: colors.info,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  settingToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingDetails: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  settingSub: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  navigationSelection: {
    flexDirection: 'column',
  },
  tabButtonsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 4,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtn: {
    flex: 1,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
  tabBtnInactive: {
    backgroundColor: 'transparent',
  },
  tabBtnText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  tabBtnTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  shiftDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shiftTitle: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  shiftZone: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  shiftTime: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logoutText: {
    color: colors.danger,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
});
