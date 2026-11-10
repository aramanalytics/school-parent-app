import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { verifyOtp, sendOtp, pendingPhone, t } = useAuth();
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    const result = await verifyOtp(otp);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setErrorMessage(result.error || 'Invalid OTP code');
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      setTimer(30);
      await sendOtp(pendingPhone);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{t.auth.verifyOtpTitle}</Text>
        <Text style={styles.subtitle}>
          {t.auth.verifySubtitle}{' '}
          <Text style={styles.boldPhone}>{pendingPhone}</Text>
        </Text>

        {Boolean(errorMessage) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <Text style={styles.inputLabel}>Enter 6-Digit OTP</Text>
        <TextInput
          style={styles.otpInput}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="••••••"
          placeholderTextColor="#94A3B8"
          value={otp}
          onChangeText={setOtp}
          autoFocus
        />

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>{t.auth.verifyButton}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend code in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>{t.auth.resendOtp}</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Change Phone Number</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#172554',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 24,
    lineHeight: 18,
  },
  boldPhone: {
    fontWeight: 'bold',
    color: '#3B5BDB',
  },
  errorBox: {
    backgroundColor: '#FFE3E3',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFC9C9',
  },
  errorText: {
    color: '#E03131',
    fontSize: 12,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: '#3B5BDB',
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 12,
    textAlign: 'center',
    color: '#172033',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#3B5BDB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3B5BDB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 18,
  },
  timerText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  resendLink: {
    fontSize: 13,
    color: '#3B5BDB',
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});

