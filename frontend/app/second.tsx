import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SecondScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];

  const handleNext = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/third');
  };

  const handleSkip = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)/landing');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Bar with Skip */}
      <View style={styles.topBar}>
        <View style={styles.stepBadge}>
          <Text style={[styles.stepText, { color: theme.tint }]}>STEP 2 OF 3</Text>
        </View>
        <TouchableOpacity
          onPress={handleSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip walkthrough to dashboard"
        >
          <Text style={[styles.skipText, { color: theme.subtext }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Illustration */}
      <View style={[styles.iconCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={[styles.iconInner, { backgroundColor: 'rgba(37, 99, 235, 0.15)' }]}>
          <Ionicons name="lock-closed" size={80} color={theme.info} />
        </View>
      </View>

      {/* Title & Description */}
      <Text style={[styles.title, { color: theme.text }]}>
        Zero-Trust Voice & Privacy Architecture
      </Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        Your security shouldn't sacrifice your privacy. Caller identities are anonymized using keyed HMAC-SHA256, and transient voice chunks are purged under a 30-day window.
      </Text>

      {/* Stepper Dots */}
      <View style={styles.stepperRow}>
        <View style={[styles.inactiveDot, { backgroundColor: theme.cardBorder }]} />
        <View style={[styles.activeDot, { backgroundColor: theme.tint }]} />
        <View style={[styles.inactiveDot, { backgroundColor: theme.cardBorder }]} />
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.tint }]}
        onPress={handleNext}
        accessibilityRole="button"
        accessibilityLabel="Go to next slide"
      >
        <Text style={styles.buttonText}>Next</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
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
  skipText: {
    fontSize: 13,
    fontWeight: '600',
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