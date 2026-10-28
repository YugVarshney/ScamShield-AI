import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];

  const handleLaunch = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(tabs)/landing');
  };

  const handleWalkthrough = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/first');
  };

  return (
    <View style={[styles.outerContainer, { backgroundColor: colorScheme === 'dark' ? '#080A0E' : '#F5F7FA' }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {/* Status Chip */}
          <View style={[styles.statusChip, { backgroundColor: theme.chipSafeBg, borderColor: theme.tint }]}>
            <View style={[styles.pulseDot, { backgroundColor: theme.tint }]} />
            <Text style={[styles.statusChipText, { color: theme.tint }]}>
              REAL-TIME AI VOICE DEFENSE
            </Text>
          </View>

          {/* Hero Emblem */}
          <View style={styles.emblemWrapper}>
            <View style={[styles.emblemOuterAura, { backgroundColor: 'rgba(0, 208, 156, 0.12)' }]}>
              <View style={[styles.emblemInnerCircle, { backgroundColor: theme.tint }]}>
                <Ionicons name="shield-checkmark" size={44} color="#FFFFFF" />
              </View>
            </View>
          </View>

          {/* Header Typography */}
          <Text style={[styles.title, { color: theme.text }]}>
            ScamShield <Text style={{ color: theme.tint }}>AI</Text>
          </Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Intelligent live call voice analysis defending against financial fraud, fake regulatory advisors, and identity phishing.
          </Text>

          {/* Feature Pillars */}
          <View style={styles.featuresList}>
            <View style={[styles.featureItem, { backgroundColor: theme.cardSubtle, borderColor: theme.cardBorder }]}>
              <View style={[styles.featureIconBox, { backgroundColor: theme.chipSafeBg }]}>
                <Ionicons name="flash" size={16} color={theme.tint} />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={[styles.featureItemTitle, { color: theme.text }]}>Sub-Second Scoring</Text>
                <Text style={[styles.featureItemDesc, { color: theme.subtext }]}>
                  Sliding audio frame inference powered by fine-tuned DistilBERT
                </Text>
              </View>
            </View>

            <View style={[styles.featureItem, { backgroundColor: theme.cardSubtle, borderColor: theme.cardBorder }]}>
              <View style={[styles.featureIconBox, { backgroundColor: 'rgba(37, 99, 235, 0.12)' }]}>
                <Ionicons name="lock-closed" size={16} color={theme.info} />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={[styles.featureItemTitle, { color: theme.text }]}>Zero-Knowledge Privacy</Text>
                <Text style={[styles.featureItemDesc, { color: theme.subtext }]}>
                  Keyed HMAC-SHA256 caller hashing and 30-day voice auto-purge
                </Text>
              </View>
            </View>

            <View style={[styles.featureItem, { backgroundColor: theme.cardSubtle, borderColor: theme.cardBorder }]}>
              <View style={[styles.featureIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                <Ionicons name="warning" size={16} color={theme.warning} />
              </View>
              <View style={styles.featureTextBox}>
                <Text style={[styles.featureItemTitle, { color: theme.text }]}>Financial Fraud Shield</Text>
                <Text style={[styles.featureItemDesc, { color: theme.subtext }]}>
                  Detects SEBI advisor claims, Demat freeze threats, and UPI PIN traps
                </Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.tint }]}
              onPress={handleLaunch}
              accessibilityRole="button"
              accessibilityLabel="Launch ScamShield protection dashboard"
            >
              <Text style={styles.primaryButtonText}>Launch Shield Protection</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: theme.cardBorder }]}
              onPress={handleWalkthrough}
              accessibilityRole="button"
              accessibilityLabel="Explore product walkthrough tour"
            >
              <Text style={[styles.secondaryButtonText, { color: theme.subtext }]}>
                Product Walkthrough
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 26,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  emblemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emblemOuterAura: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemInnerCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D09C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  featuresList: {
    width: '100%',
    gap: 10,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  featureIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextBox: {
    flex: 1,
  },
  featureItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureItemDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  actionsContainer: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#00D09C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});