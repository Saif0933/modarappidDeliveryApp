import React, { useState, useEffect, useRef } from 'react';
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

export const OtpScreen: React.FC = () => {
  const { verifyOtp, phoneNumber, cancelOtp } = useApp();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const otpInputRef = useRef<TextInput>(null);

  // Resend OTP countdown timer feature
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-focus input on mount section
  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      otpInputRef.current?.focus();
    }, 150);
    return () => clearTimeout(focusTimeout);
  }, []);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      const success = await verifyOtp(otp);
      if (!success) {
        setOtp('');
        otpInputRef.current?.focus();
      }
    }, 1200);
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    setTimer(30);
    setOtp('');
    otpInputRef.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.headerSpacer}>
        {/* Decorative Brand Header */}
        <View style={styles.logoCircle}>
          <Icon name="store" color={colors.primary} size={32} />
        </View>
        <Text style={styles.brandTitle}>MODARAPID</Text>
        <Text style={styles.brandSubtitle}>Fastest Cloth Delivery Network</Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.otpHeaderRow}>
          <TouchableOpacity onPress={cancelOtp} style={styles.backBtn}>
            <Icon name="chevron-left" color={colors.primary} size={16} />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.titleCentered}>Verify Code</Text>
          <View style={{ width: 50 }} /> {/* balance layout */}
        </View>

        <Text style={styles.description}>
          We sent a 6-digit OTP code to <Text style={styles.boldText}>+91 {phoneNumber}</Text>.
        </Text>

        {/* Hidden Input field carrying the focus */}
        <TextInput
          ref={otpInputRef}
          style={styles.hiddenOtpInput}
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={(val) => {
            const cleaned = val.replace(/[^0-9]/g, '');
            setOtp(cleaned);
          }}
          editable={!loading}
        />

        {/* Visual Box grid representing separate letters */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => otpInputRef.current?.focus()}
          style={styles.otpBoxGrid}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const digit = otp.charAt(index);
            const isCurrent = otp.length === index;
            return (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  digit ? styles.otpBoxFilled : null,
                  isCurrent ? styles.otpBoxFocus : null,
                ]}
              >
                <Text style={styles.otpBoxText}>{digit || ''}</Text>
              </View>
            );
          })}
        </TouchableOpacity>

        <View style={styles.timerRow}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend code in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendText}>Resend OTP Code</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleVerifyOtp}
          disabled={otp.length !== 6 || loading}
          style={[
            styles.actionBtn,
            otp.length !== 6 && styles.disabledBtn,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.btnText}>VERIFY & PROCEED</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.testModeHelper}>
          Testing Mode: Type 123456 to bypass
        </Text>
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
  titleCentered: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  otpHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
  },
  backBtnText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: 2,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    marginBottom: 24,
  },
  boldText: {
    color: colors.text,
    fontWeight: 'bold',
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
  hiddenOtpInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  otpBoxGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  otpBoxFilled: {
    borderColor: colors.text,
  },
  otpBoxFocus: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 94, 58, 0.02)',
  },
  otpBoxText: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  timerRow: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  resendText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  testModeHelper: {
    color: colors.textMuted,
    fontSize: 9,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
});
