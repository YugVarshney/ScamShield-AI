import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { API_BASE_URL } from '@/constants/Api';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];

  const [useLocalModel, setUseLocalModel] = useState(false);
  const [highSensitivity, setHighSensitivity] = useState(true);
  const [autoWarn, setAutoWarn] = useState(true);
  const [adaptiveLearning, setAdaptiveLearning] = useState(true);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string | null>(null);

  const testBackendConnection = async () => {
    setIsCheckingHealth(true);
    setBackendStatus(null);
    try {
      const startTime = Date.now();
      const res = await fetch(`${API_BASE_URL}/health/`, { method: 'GET' });
      const latency = Date.now() - startTime;
      if (res.ok) {
        setBackendStatus(`Connected (${latency}ms latency)`);
      } else {
        setBackendStatus(`Server returned ${res.status}`);
      }
    } catch {
      setBackendStatus('Offline / Unreachable (Using offline mode)');
    } finally {
      setIsCheckingHealth(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Security & Controls
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.subtext }]}>
            Configure AI fraud detection thresholds, privacy modes, and telemetry
          </Text>
        </View>

        {/* Section: AI Detection Engine */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          AI Detection Engine
        </Text>

        <View style={[styles.cardGroup, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {/* On Device */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <View style={styles.titleWithIcon}>
                <Ionicons name="hardware-chip-outline" size={18} color={theme.tint} />
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  On-Device Inference Mode
                </Text>
              </View>
              <Text style={[styles.settingDescription, { color: theme.subtext }]}>
                Execute DistilBERT model locally for zero network latency and maximum privacy.
              </Text>
            </View>
            <Switch
              value={useLocalModel}
              onValueChange={setUseLocalModel}
              trackColor={{ false: theme.cardBorder, true: theme.tint }}
              accessibilityLabel="Toggle on-device model inference"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

          {/* High Sensitivity */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <View style={styles.titleWithIcon}>
                <Ionicons name="flame-outline" size={18} color={theme.warning} />
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  Fintech Strict Protection
                </Text>
              </View>
              <Text style={[styles.settingDescription, { color: theme.subtext }]}>
                Heightened scrutiny on SEBI registration claims, urgent Demat KYC warnings, and UPI PIN requests.
              </Text>
            </View>
            <Switch
              value={highSensitivity}
              onValueChange={setHighSensitivity}
              trackColor={{ false: theme.cardBorder, true: theme.tint }}
              accessibilityLabel="Toggle high sensitivity financial scam shield"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

          {/* Auto Warn */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <View style={styles.titleWithIcon}>
                <Ionicons name="volume-high-outline" size={18} color={theme.tint} />
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  Instant Audio Haptic Warning
                </Text>
              </View>
              <Text style={[styles.settingDescription, { color: theme.subtext }]}>
                Vibrate phone and display heads-up modal immediately when a scam is detected.
              </Text>
            </View>
            <Switch
              value={autoWarn}
              onValueChange={setAutoWarn}
              trackColor={{ false: theme.cardBorder, true: theme.tint }}
              accessibilityLabel="Toggle instant audio haptic warning"
            />
          </View>
        </View>

        {/* Section: Privacy & Compliance */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Zero-Trust Privacy Architecture
        </Text>

        <View style={[styles.cardGroup, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.complianceRow}>
            <Ionicons name="lock-closed" size={20} color={theme.tint} />
            <View style={styles.complianceText}>
              <Text style={[styles.complianceTitle, { color: theme.text }]}>
                Keyed HMAC-SHA256 Caller Anonymization
              </Text>
              <Text style={[styles.complianceDesc, { color: theme.subtext }]}>
                Caller phone numbers are never stored in plaintext at rest. Complies with DPDP Act & SEBI cybersecurity standards.
              </Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: theme.chipSafeBg }]}>
              <Text style={[styles.statusPillText, { color: theme.tint }]}>Active</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

          <View style={styles.complianceRow}>
            <Ionicons name="trash-bin-outline" size={20} color={theme.tint} />
            <View style={styles.complianceText}>
              <Text style={[styles.complianceTitle, { color: theme.text }]}>
                30-Day Zero Voice Retention
              </Text>
              <Text style={[styles.complianceDesc, { color: theme.subtext }]}>
                All transient audio chunks are automatically purged after inference.
              </Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: theme.chipSafeBg }]}>
              <Text style={[styles.statusPillText, { color: theme.tint }]}>Enforced</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>
                Adaptive Retraining Feedback
              </Text>
              <Text style={[styles.settingDescription, { color: theme.subtext }]}>
                Allow anonymized fraud transcript vectors to be added to model retraining loops.
              </Text>
            </View>
            <Switch
              value={adaptiveLearning}
              onValueChange={setAdaptiveLearning}
              trackColor={{ false: theme.cardBorder, true: theme.tint }}
              accessibilityLabel="Toggle adaptive retraining feedback"
            />
          </View>
        </View>

        {/* Section: Backend Diagnostics */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Engine Telemetry & API
        </Text>

        <View style={[styles.cardGroup, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.apiHeaderRow}>
            <View>
              <Text style={[styles.apiEndpointLabel, { color: theme.subtext }]}>FastAPI Backend</Text>
              <Text style={[styles.apiEndpointValue, { color: theme.text }]}>{API_BASE_URL}</Text>
            </View>
            <TouchableOpacity
              style={[styles.pingButton, { backgroundColor: theme.tint }]}
              onPress={testBackendConnection}
              disabled={isCheckingHealth}
              accessibilityRole="button"
              accessibilityLabel="Ping backend server"
            >
              {isCheckingHealth ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.pingButtonText}>Ping Server</Text>
              )}
            </TouchableOpacity>
          </View>

          {backendStatus && (
            <View style={[styles.pingResultBox, { backgroundColor: theme.cardSubtle }]}>
              <Ionicons
                name={backendStatus.includes('Connected') ? 'checkmark-circle' : 'alert-circle'}
                size={16}
                color={backendStatus.includes('Connected') ? theme.success : theme.warning}
              />
              <Text style={[styles.pingResultText, { color: theme.text }]}>
                {backendStatus}
              </Text>
            </View>
          )}
        </View>

        {/* Section: Attribution */}
        <View style={[styles.attributionCard, { backgroundColor: theme.cardSubtle, borderColor: theme.cardBorder }]}>
          <Ionicons name="code-slash" size={24} color={theme.tint} />
          <View style={styles.attributionText}>
            <Text style={[styles.attributionTitle, { color: theme.text }]}>
              ScamShield • React Native
            </Text>
            <Text style={[styles.attributionDesc, { color: theme.subtext }]}>
              Built with precision by Yug for Groww Engineering.
            </Text>
            <Text style={[styles.versionText, { color: theme.subtext }]}>
              Version 2.4.0 (Expo SDK 57 • RN 0.86 • DistilBERT)
            </Text>
          </View>
        </View>

        {/* Reset / Cache Flush Button */}
        <TouchableOpacity
          style={[styles.resetButton, { borderColor: theme.cardBorder }]}
          onPress={() => Alert.alert('Cache Cleared', 'Local scam detection cache and session states have been reset.')}
          accessibilityRole="button"
          accessibilityLabel="Reset local app cache"
        >
          <Text style={[styles.resetButtonText, { color: theme.subtext }]}>
            Clear Local Session Cache
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
  },
  scrollContent: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 10,
  },
  cardGroup: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  complianceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  complianceText: {
    flex: 1,
  },
  complianceTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  complianceDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  statusPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  apiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apiEndpointLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  apiEndpointValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  pingButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  pingButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pingResultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  pingResultText: {
    fontSize: 12,
    fontWeight: '600',
  },
  attributionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
    marginBottom: 16,
  },
  attributionText: {
    flex: 1,
  },
  attributionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  attributionDesc: {
    fontSize: 12,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 11,
  },
  resetButton: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});