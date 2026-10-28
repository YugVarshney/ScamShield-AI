import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function LandingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];

  const recentAlerts = [
    {
      id: 'alert-1',
      type: 'critical',
      title: 'Fake SEBI "Guaranteed Profit" Calls',
      desc: 'Callers impersonating SEBI research analysts promising 200% intraday returns.',
      time: '12m ago',
    },
    {
      id: 'alert-2',
      type: 'warning',
      title: 'Urgent Demat KYC Freeze Scare',
      desc: 'Fraudulent SMS and calls claiming your demat portfolio is locked pending APK download.',
      time: '1h ago',
    },
    {
      id: 'alert-3',
      type: 'warning',
      title: 'UPI "Receive Money" Refund Trap',
      desc: 'Fraudsters sending collect requests claiming to refund failed mutual fund orders.',
      time: '3h ago',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.brandSubtitle, { color: theme.tint }]}>
              FINANCIAL VOICE DEFENSE
            </Text>
            <Text style={[styles.brandTitle, { color: theme.text }]}>
              ScamShield AI
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: theme.chipSafeBg, borderColor: theme.tint }]}>
            <View style={[styles.statusDot, { backgroundColor: theme.tint }]} />
            <Text style={[styles.statusBadgeText, { color: theme.tint }]}>Active Shield</Text>
          </View>
        </View>

        {/* Hero Shield Banner */}
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.heroHeader}>
            <View style={[styles.iconCircle, { backgroundColor: theme.chipSafeBg }]}>
              <Ionicons name="shield-checkmark" size={28} color={theme.tint} />
            </View>
            <View style={styles.heroHeaderText}>
              <Text style={[styles.heroCardTitle, { color: theme.text }]}>
                Real-Time Voice Call Protection
              </Text>
              <Text style={[styles.heroCardSubtitle, { color: theme.subtext }]}>
                DistilBERT NLP engine scoring live call audio for financial scams
              </Text>
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={[styles.metricsRow, { borderTopColor: theme.cardBorder }]}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: theme.tint }]}>99.2%</Text>
              <Text style={[styles.metricLabel, { color: theme.subtext }]}>Accuracy</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: theme.cardBorder }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: theme.text }]}>18</Text>
              <Text style={[styles.metricLabel, { color: theme.subtext }]}>Blocked Scams</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: theme.cardBorder }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: theme.tint }]}>₹4.8L+</Text>
              <Text style={[styles.metricLabel, { color: theme.subtext }]}>Capital Saved</Text>
            </View>
          </View>
        </View>

        {/* Main Action Grid */}
        <Text style={[styles.sectionHeading, { color: theme.text }]}>
          Quick Actions
        </Text>

        <View style={styles.actionsGrid}>
          {/* Live Call Detector */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => router.push('/recordscam')}
            accessibilityRole="button"
            accessibilityLabel="Open live scam call detector"
          >
            <View style={[styles.actionIconBg, { backgroundColor: 'rgba(0, 208, 156, 0.15)' }]}>
              <Ionicons name="mic" size={24} color={theme.tint} />
            </View>
            <Text style={[styles.actionCardTitle, { color: theme.text }]}>
              Live Detector
            </Text>
            <Text style={[styles.actionCardDesc, { color: theme.subtext }]}>
              Stream live audio chunks for real-time scam scoring
            </Text>
            <View style={styles.actionArrowRow}>
              <Text style={[styles.actionLinkText, { color: theme.tint }]}>Start detector</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.tint} />
            </View>
          </TouchableOpacity>

          {/* Dial & Check */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => router.push('/call')}
            accessibilityRole="button"
            accessibilityLabel="Open dialer and call monitor"
          >
            <View style={[styles.actionIconBg, { backgroundColor: 'rgba(37, 99, 235, 0.15)' }]}>
              <Ionicons name="keypad" size={24} color={theme.info} />
            </View>
            <Text style={[styles.actionCardTitle, { color: theme.text }]}>
              Call Monitor
            </Text>
            <Text style={[styles.actionCardDesc, { color: theme.subtext }]}>
              Inspect caller history and verify unknown contacts
            </Text>
            <View style={styles.actionArrowRow}>
              <Text style={[styles.actionLinkText, { color: theme.info }]}>Open keypad</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.info} />
            </View>
          </TouchableOpacity>

          {/* Fintech Fraud Academy */}
          <TouchableOpacity
            style={[styles.actionCardFull, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => router.push('/studyscam')}
            accessibilityRole="button"
            accessibilityLabel="Open financial scam education module"
          >
            <View style={[styles.actionIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="school" size={24} color={theme.warning} />
            </View>
            <View style={styles.actionCardFullContent}>
              <Text style={[styles.actionCardTitle, { color: theme.text }]}>
                Fintech Fraud Academy
              </Text>
              <Text style={[styles.actionCardDesc, { color: theme.subtext }]}>
                Interactive playbooks on SEBI impersonation, Demat freeze threats, and UPI scams
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
        </View>

        {/* Live Threat Intelligence Feed */}
        <View style={styles.threatFeedHeader}>
          <Text style={[styles.sectionHeading, { color: theme.text }]}>
            Live Threat Radar
          </Text>
          <Text style={[styles.threatFeedSub, { color: theme.subtext }]}>
            Active scams reported in India
          </Text>
        </View>

        {recentAlerts.map((alert) => (
          <View
            key={alert.id}
            style={[styles.alertCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <View style={styles.alertHeaderRow}>
              <View style={[
                styles.alertTag,
                { backgroundColor: alert.type === 'critical' ? theme.chipDangerBg : theme.chipWarningBg }
              ]}>
                <Text style={[
                  styles.alertTagText,
                  { color: alert.type === 'critical' ? theme.danger : theme.warning }
                ]}>
                  {alert.type === 'critical' ? 'CRITICAL RISK' : 'SUSPICIOUS'}
                </Text>
              </View>
              <Text style={[styles.alertTime, { color: theme.subtext }]}>{alert.time}</Text>
            </View>
            <Text style={[styles.alertTitle, { color: theme.text }]}>{alert.title}</Text>
            <Text style={[styles.alertDesc, { color: theme.subtext }]}>{alert.desc}</Text>
          </View>
        ))}

        {/* Security Assurance Footer */}
        <View style={[styles.assuranceCard, { backgroundColor: theme.cardSubtle, borderColor: theme.cardBorder }]}>
          <Ionicons name="lock-closed" size={20} color={theme.tint} />
          <Text style={[styles.assuranceText, { color: theme.subtext }]}>
            Zero-Knowledge Privacy: Caller numbers are hashed with keyed HMAC-SHA256. Voice audio is purged under a 30-day retention window.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 24,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroHeaderText: {
    flex: 1,
  },
  heroCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroCardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 14,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricDivider: {
    width: 1,
    height: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  actionIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionCardDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
    minHeight: 32,
  },
  actionArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  actionCardFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  actionCardFullContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  threatFeedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  threatFeedSub: {
    fontSize: 12,
  },
  alertCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  alertTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  alertTime: {
    fontSize: 11,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  assuranceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  assuranceText: {
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 10,
    flex: 1,
  },
});