import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/Icon';
import { Card } from '../components/common/Card';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      return;
    }
    setLoading(true);
    // Simulate API network loading or delay 
    setTimeout(async () => {
      setLoading(false);
      await login(phone);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.headerSpacer}>
        {/* Decorative Brand Header section */}
        <View style={styles.logoCircle}>
          <Icon name="store" color={colors.primary} size={32} />
        </View>
        <Text style={styles.brandTitle}>MODARAPID</Text>
        <Text style={styles.brandSubtitle}>Fastest Cloth Delivery Network</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.title}>Partner Login</Text>
        <Text style={styles.description}>
          Enter your registered mobile number to get online and start receiving orders.
        </Text>

        <View style={styles.inputLabelContainer}>
          <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
        </View>

        <View style={styles.phoneInputRow}>
          <View style={styles.countryCodeBox}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="98765 43210"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={(val) => setPhone(val.replace(/[^0-9]/g, ''))}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSendOtp}
          disabled={phone.length !== 10 || loading}
          style={[
            styles.actionBtn,
            phone.length !== 10 && styles.disabledBtn,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.btnText}>GET VERIFICATION CODE</Text>
          )}
        </TouchableOpacity>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerSpacer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 94, 58, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 94, 58, 0.2)',
  },
  brandTitle: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: 2,
  },
  brandSubtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 4,
  },
  card: {
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 8,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    marginBottom: 24,
  },
  inputLabelContainer: {
    marginBottom: 8,
  },
  inputLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  phoneInputRow: {
    flexDirection: 'row',
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  countryCodeBox: {
    paddingHorizontal: 16,
    borderRightWidth: 1.5,
    borderRightColor: colors.border,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  actionBtn: {
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledBtn: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
});
