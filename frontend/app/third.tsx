import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ThirdScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];

  const handleStart = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)/landing');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.stepBadge}>
          <Text style={[styles.stepText, { color: theme.tint }]}>STEP 3 OF 3</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Hero Illustration */}
      <View style={[styles.iconCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={[styles.iconInner, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
          <Ionicons name="shield-checkmark" size={80} color={theme.warning} />
        </View>
      </View>

      {/* Title & Description */}
      <Text style={[styles.title, { color: theme.text }]}>
        Fintech-Grade Defense Ready
      </Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        Shielding against fake SEBI advisors, unauthorized Demat liquidation threats, and UPI collect traps. You are ready to experience ScamShield.
      </Text>

      {/* Stepper Dots */}
      <View style={styles.stepperRow}>
        <View style={[styles.inactiveDot, { backgroundColor: theme.cardBorder }]} />
        <View style={[styles.inactiveDot, { backgroundColor: theme.cardBorder }]} />
        <View style={[styles.activeDot, { backgroundColor: theme.tint }]} />
      </View>

      {/* Finish Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.tint }]}
        onPress={handleStart}
        accessibilityRole="button"
        accessibilityLabel="Finish walkthrough and launch dashboard"
      >
        <Text style={styles.buttonText}>Get Started with ScamShield</Text>
        <Ionicons name="shield" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  stepText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  iconCard: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});