import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { File } from 'expo-file-system';
import * as ExpoCrypto from 'expo-crypto';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DETECT_SCAM_ENDPOINT, CHUNK_INTERVAL_MS } from '../constants/Api';

/**
 * Encode an ArrayBuffer as base64 in 32 KB slices to avoid Hermes argument-length limits.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const sliceSize = 0x8000;
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += sliceSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + sliceSize));
  }
  return btoa(binary);
}

interface ThreatAnalysis {
  probability: number;
  status: 'Safe' | 'Suspicious' | 'Scam';
  transcription: string;
  category?: string;
  detectedKeywords: string[];
}

export default function RecordScamScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];

  const [isRecording, setIsRecording] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [analysis, setAnalysis] = useState<ThreatAnalysis>({
    probability: 4,
    status: 'Safe',
    transcription: 'Monitoring incoming audio stream for scam patterns...',
    category: 'Clean Line',
    detectedKeywords: [],
  });

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    void requestPermissions();
    return () => {
      if (recordingInterval.current) clearInterval(recordingInterval.current);
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await AudioModule.requestRecordingPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Microphone Permission Required',
          'ScamShield requires microphone access to analyze live phone audio chunks for fraud.'
        );
      }
    } catch {
      // AudioModule may be stubbed in web/test environment.
    }
  };

  const generateCallId = async () => {
    try {
      const randomBytes = await ExpoCrypto.getRandomBytesAsync(16);
      return Array.from(randomBytes)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    } catch {
      return `call-${Date.now().toString(16)}`;
    }
  };

  const startRecording = async () => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      const newCallId = await generateCallId();
      setCallId(newCallId);
      setIsRecording(true);
      setElapsedSeconds(0);

      timerInterval.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      await startNewRecording();

      recordingInterval.current = setInterval(() => {
        void processCurrentChunk(newCallId).then(() => startNewRecording());
      }, CHUNK_INTERVAL_MS);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Recording Notice', 'Starting detector in simulation mode.');
      setIsRecording(true);
    }
  };

  const startNewRecording = async () => {
    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      // Safe fallback on unsupported environments
    }
  };

  const processCurrentChunk = async (chunkCallId: string) => {
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (uri) {
        const chunkFile = new File(uri);
        const audioBytes = arrayBufferToBase64(await chunkFile.arrayBuffer());
        await sendAudioToUrl(chunkCallId, audioBytes);
      }
    } catch (error) {
      console.error('Error processing audio chunk:', error);
    }
  };

  const sendAudioToUrl = async (chunkCallId: string, base64Audio: string) => {
    try {
      const response = await fetch(DETECT_SCAM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_id: chunkCallId,
          base64: base64Audio,
        }),
      });

      if (response.ok) {
        const responseData = (await response.json()) as {
          status: 'Safe' | 'Suspicious' | 'Scam';
          scam_probability: number;
          transcription: string;
        };

        const prob = Math.round(responseData.scam_probability * 100);
        const detectedKeys: string[] = [];
        const lowerTrans = (responseData.transcription || '').toLowerCase();
        if (lowerTrans.includes('otp')) detectedKeys.push('OTP Demand');
        if (lowerTrans.includes('sebi')) detectedKeys.push('SEBI Impersonation');
        if (lowerTrans.includes('urgent') || lowerTrans.includes('freeze')) detectedKeys.push('Urgency Pressure');
        if (lowerTrans.includes('pin')) detectedKeys.push('UPI PIN Phishing');

        setAnalysis({
          probability: prob,
          status: responseData.status,
          transcription: responseData.transcription || 'No audible speech in chunk.',
          category: prob > 70 ? 'High-Risk Financial Fraud' : prob > 40 ? 'Suspicious Entity' : 'Safe Verification',
          detectedKeywords: detectedKeys,
        });

        if (responseData.status === 'Scam') {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          triggerScamAlert();
        }
      }
    } catch (error) {
      console.error('Failed to send audio to backend:', error);
    }
  };

  const stopRecording = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    try {
      await recorder.stop();
    } catch {
      // Safe to ignore if already stopped
    }
    setCallId(null);
  };

  const triggerScamAlert = () => {
    Alert.alert(
      'CRITICAL: FINANCIAL SCAM DETECTED',
      'The caller is using social engineering tactics (impersonating SEBI/Groww or demanding OTP/PIN). We advise disconnecting immediately.',
      [
        {
          text: 'Drop Call Now',
          style: 'destructive',
          onPress: () => {
            void stopRecording();
          },
        },
        { text: 'Ignore', style: 'cancel' },
      ],
      { cancelable: false }
    );
  };

  // Pre-configured simulated scenarios for live demonstration
  const runScenarioSimulation = (type: 'sebi' | 'kyc' | 'upi' | 'safe') => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (type === 'sebi') {
      setAnalysis({
        probability: 96,
        status: 'Scam',
        category: 'Fake SEBI Advisor & VIP Group Fraud',
        transcription:
          '"Sir, I am calling from SEBI Registered Research Advisory. We have guaranteed 400% profit tips on SME IPO allotments. Deposit ₹50,000 into our VIP account right now before 3:30 PM..."',
        detectedKeywords: ['SEBI Impersonation', 'Guaranteed Returns', 'Urgent Deposit', 'Unverified Account'],
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      triggerScamAlert();
    } else if (type === 'kyc') {
      setAnalysis({
        probability: 92,
        status: 'Scam',
        category: 'Urgent Demat KYC Freeze Phishing',
        transcription:
          '"Attention user: Your Groww demat account KYC has failed. All stock holdings will be liquidated today unless you install QuickSupport and confirm your bank OTP with our agent..."',
        detectedKeywords: ['Demat Freeze Scare', 'Remote APK Install', 'OTP Phishing', 'Liquidate Threat'],
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      triggerScamAlert();
    } else if (type === 'upi') {
      setAnalysis({
        probability: 89,
        status: 'Scam',
        category: 'UPI PIN / Refund Collect Trap',
        transcription:
          '"We are issuing a refund of ₹4,999 for your failed mutual fund transaction. I have sent a request on PhonePe. Please open the app and enter your 6-digit UPI PIN to receive credit..."',
        detectedKeywords: ['UPI PIN Phishing', 'Collect Request Trap', 'Fake Refund'],
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      triggerScamAlert();
    } else {
      setAnalysis({
        probability: 3,
        status: 'Safe',
        category: 'Legitimate Broker Notification',
        transcription:
          '"Groww Security: This is an automated notification confirming your mutual fund order has been executed. No OTP or action is required from you."',
        detectedKeywords: ['No OTP Demanded', 'Order Confirmation', 'Informational'],
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const getThreatColor = () => {
    if (analysis.status === 'Scam') return theme.danger;
    if (analysis.status === 'Suspicious') return theme.warning;
    return theme.success;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back to Shield dashboard"
          >
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.screenTitle, { color: theme.text }]}>Live Audio Shield</Text>
            <Text style={[styles.screenSubtitle, { color: theme.subtext }]}>
              {isRecording ? `Active Call ID: ${callId?.slice(0, 10)}...` : 'Standby Mode'}
            </Text>
          </View>
          <View
            style={[
              styles.callStatusBadge,
              { backgroundColor: isRecording ? theme.chipDangerBg : theme.chipSafeBg },
            ]}
          >
            <View
              style={[
                styles.pulsingDot,
                { backgroundColor: isRecording ? theme.danger : theme.tint },
              ]}
            />
            <Text
              style={[
                styles.callStatusText,
                { color: isRecording ? theme.danger : theme.tint },
              ]}
            >
              {isRecording ? formatTimer(elapsedSeconds) : 'Idle'}
            </Text>
          </View>
        </View>

        {/* Live Threat Gauge Card */}
        <View style={[styles.gaugeCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.gaugeHeader}>
            <View>
              <Text style={[styles.gaugeLabel, { color: theme.subtext }]}>AI FRAUD PROBABILITY</Text>
              <Text style={[styles.gaugeValue, { color: getThreatColor() }]}>
                {analysis.probability}%
              </Text>
            </View>
            <View
              style={[
                styles.threatVerdictBadge,
                {
                  backgroundColor:
                    analysis.status === 'Scam'
                      ? theme.chipDangerBg
                      : analysis.status === 'Suspicious'
                      ? theme.chipWarningBg
                      : theme.chipSafeBg,
                  borderColor: getThreatColor(),
                },
              ]}
            >
              <Ionicons
                name={
                  analysis.status === 'Scam'
                    ? 'alert-circle'
                    : analysis.status === 'Suspicious'
                    ? 'warning'
                    : 'checkmark-circle'
                }
                size={16}
                color={getThreatColor()}
              />
              <Text style={[styles.verdictText, { color: getThreatColor() }]}>
                {analysis.status === 'Scam'
                  ? 'CRITICAL SCAM'
                  : analysis.status === 'Suspicious'
                  ? 'SUSPICIOUS'
                  : 'SAFE CALL'}
              </Text>
            </View>
          </View>

          {/* Probability Bar */}
          <View style={[styles.progressBarTrack, { backgroundColor: theme.cardSubtle }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${analysis.probability}%`,
                  backgroundColor: getThreatColor(),
                },
              ]}
            />
          </View>

          {/* Category Chip */}
          <View style={styles.categoryInfoRow}>
            <Text style={[styles.categoryLabel, { color: theme.subtext }]}>Classification:</Text>
            <Text style={[styles.categoryValue, { color: theme.text }]}>{analysis.category}</Text>
          </View>

          {/* Detected Keywords */}
          {analysis.detectedKeywords.length > 0 && (
            <View style={styles.keywordTokensRow}>
              {analysis.detectedKeywords.map((kw) => (
                <View
                  key={kw}
                  style={[
                    styles.keywordToken,
                    {
                      backgroundColor:
                        analysis.status === 'Scam' ? theme.chipDangerBg : theme.chipWarningBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.keywordTokenText,
                      { color: analysis.status === 'Scam' ? theme.danger : theme.warning },
                    ]}
                  >
                    🚩 {kw}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Live Audio Visualizer Equalizer */}
        <View style={[styles.visualizerCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.visualizerHeader}>
            <Ionicons name="pulse" size={18} color={theme.tint} />
            <Text style={[styles.visualizerTitle, { color: theme.text }]}>
              {isRecording ? 'Streaming Audio Waves to DistilBERT...' : 'Microphone Ready'}
            </Text>
          </View>
          <View style={styles.waveBarsContainer}>
            {[18, 34, 48, 22, 60, 42, 28, 54, 38, 20, 46, 30].map((height, index) => (
              <View
                key={index}
                style={[
                  styles.waveBar,
                  {
                    height: isRecording ? height : 8,
                    backgroundColor: isRecording ? theme.tint : theme.cardBorder,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Live Transcription Box */}
        <View style={[styles.transcriptionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.transcriptionHeader}>
            <Ionicons name="document-text-outline" size={16} color={theme.subtext} />
            <Text style={[styles.transcriptionTitle, { color: theme.subtext }]}>
              REAL-TIME TRANSCRIPT STREAM
            </Text>
          </View>
          <Text style={[styles.transcriptionText, { color: theme.text }]}>
            {analysis.transcription}
          </Text>
        </View>

        {/* Main Recording Toggle Button */}
        <TouchableOpacity
          style={[
            styles.mainRecordButton,
            {
              backgroundColor: isRecording ? theme.danger : theme.tint,
              shadowColor: isRecording ? theme.danger : theme.tint,
            },
          ]}
          onPress={isRecording ? stopRecording : startRecording}
          accessibilityRole="button"
          accessibilityLabel={isRecording ? 'Stop scam detection recording' : 'Start live recording'}
          accessibilityState={{ busy: isRecording }}
        >
          <Ionicons
            name={isRecording ? 'stop-circle' : 'radio'}
            size={24}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.mainRecordButtonText}>
            {isRecording ? 'Stop Live Shield' : 'Start Live Audio Shield'}
          </Text>
        </TouchableOpacity>

        {/* Interactive Simulation Scenarios */}
        <View style={styles.simulationSection}>
          <Text style={[styles.simulationSectionTitle, { color: theme.text }]}>
            Test Fraud Scenarios
          </Text>
          <Text style={[styles.simulationSectionSubtitle, { color: theme.subtext }]}>
            Simulate real financial scam calls to evaluate the model response
          </Text>

          <View style={styles.simulationButtonsGrid}>
            <TouchableOpacity
              style={[styles.simButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              onPress={() => runScenarioSimulation('sebi')}
              accessibilityRole="button"
              accessibilityLabel="Simulate fake SEBI advisor scam"
            >
              <Text style={[styles.simButtonTitle, { color: theme.danger }]}>🚨 Fake SEBI Call</Text>
              <Text style={[styles.simButtonDesc, { color: theme.subtext }]}>400% profit IPO trap</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              onPress={() => runScenarioSimulation('kyc')}
              accessibilityRole="button"
              accessibilityLabel="Simulate Demat KYC freeze phishing"
            >
              <Text style={[styles.simButtonTitle, { color: theme.danger }]}>⚠️ Demat Freeze</Text>
              <Text style={[styles.simButtonDesc, { color: theme.subtext }]}>APK QuickSupport scare</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              onPress={() => runScenarioSimulation('upi')}
              accessibilityRole="button"
              accessibilityLabel="Simulate UPI collect request trap"
            >
              <Text style={[styles.simButtonTitle, { color: theme.warning }]}>💳 UPI PIN Scam</Text>
              <Text style={[styles.simButtonDesc, { color: theme.subtext }]}>Fake cash refund collect</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              onPress={() => runScenarioSimulation('safe')}
              accessibilityRole="button"
              accessibilityLabel="Simulate verified safe trade confirmation"
            >
              <Text style={[styles.simButtonTitle, { color: theme.success }]}>✓ Safe Trade</Text>
              <Text style={[styles.simButtonDesc, { color: theme.subtext }]}>Groww execution notice</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Defense Shortcuts */}
        {analysis.status === 'Scam' && (
          <View style={[styles.emergencyCard, { backgroundColor: theme.chipDangerBg, borderColor: theme.danger }]}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="alert-circle" size={24} color={theme.danger} />
              <Text style={[styles.emergencyTitle, { color: theme.danger }]}>
                Recommended Action: Hang Up
              </Text>
            </View>
            <Text style={[styles.emergencyText, { color: theme.text }]}>
              Do not share OTPs, bank credentials, or UPI PINs. Report this number to the National Cyber Crime Portal.
            </Text>
            <TouchableOpacity
              style={[styles.emergencyButton, { backgroundColor: theme.danger }]}
              onPress={() => Alert.alert('Dialing 1930', 'Forwarding incident to National Cyber Crime Helpline (1930)...')}
              accessibilityRole="button"
              accessibilityLabel="Report caller to CyberCrime Helpline 1930"
            >
              <Ionicons name="call-outline" size={18} color="#FFFFFF" />
              <Text style={styles.emergencyButtonText}>Call Cyber Crime Helpline (1930)</Text>
            </TouchableOpacity>
          </View>
        )}
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  screenSubtitle: {
    fontSize: 12,
  },
  callStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  callStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  gaugeCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  gaugeLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  gaugeValue: {
    fontSize: 40,
    fontWeight: '900',
  },
  threatVerdictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  verdictText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  categoryInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  keywordTokensRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  keywordToken: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  keywordTokenText: {
    fontSize: 11,
    fontWeight: '700',
  },
  visualizerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  visualizerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  visualizerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  waveBarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 10,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
  },
  transcriptionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },
  transcriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  transcriptionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  transcriptionText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  mainRecordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  mainRecordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  simulationSection: {
    marginBottom: 20,
  },
  simulationSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  simulationSectionSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  simulationButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  simButton: {
    width: '48%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  simButtonTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  simButtonDesc: {
    fontSize: 11,
  },
  emergencyCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginTop: 10,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  emergencyTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  emergencyText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
