import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface FraudScenario {
  id: string;
  title: string;
  category: string;
  tagColor: string;
  scamTactic: string;
  defenseAction: string;
  redFlags: string[];
}

export default function ScamStudyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];

  const [expandedId, setExpandedId] = useState<string | null>('tactic-1');
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const fraudTactics: FraudScenario[] = [
    {
      id: 'tactic-1',
      title: 'Fake SEBI Advisors & Guaranteed Returns',
      category: 'HIGH IMPACT',
      tagColor: '#EF4444',
      scamTactic:
        'Fraudsters present fake or stolen SEBI registration numbers, promising 300% to 500% guaranteed returns on upcoming SME IPOs or high-frequency F&O trades in private VIP channels.',
      defenseAction:
        'SEBI registered advisors never guarantee fixed returns or solicit direct bank transfers to personal accounts. Always verify the registration code on the official SEBI SCORES portal.',
      redFlags: [
        'Guaranteed profit promises on equity or options',
        'Requests to transfer capital to personal or private bank accounts',
        'High-pressure claims of "exclusive pre-IPO allotment"',
      ],
    },
    {
      id: 'tactic-2',
      title: 'Urgent Demat KYC Freeze Scare',
      category: 'PHISHING',
      tagColor: '#F59E0B',
      scamTactic:
        'A caller masquerades as Groww or Depository (CDSL/NSDL) support, warning your demat account will be permanently frozen unless you download an APK or share an OTP immediately.',
      defenseAction:
        'Groww never asks users to install remote management apps (QuickSupport, AnyDesk, TeamViewer) or disclose OTPs. KYC re-verification is completed solely in-app.',
      redFlags: [
        'Artificial deadline (e.g., "within 2 hours")',
        'Instruction to install APK or screen-sharing application',
        'Demanding incoming SMS OTP codes over voice call',
      ],
    },
    {
      id: 'tactic-3',
      title: 'Digital Arrest & Police / Customs Extortion',
      category: 'EXTORTION',
      tagColor: '#DC2626',
      scamTactic:
        'Scammers impersonate police, CBI, or customs officials claiming illegal packages or money laundering linked to your Aadhaar/PAN, demanding continuous video call monitoring and fund transfers for "verification".',
      defenseAction:
        'No law enforcement agency in India conducts "digital arrests" or demands fund transfers over Skype/WhatsApp video calls. Hang up immediately and dial 1930.',
      redFlags: [
        'Threats of imminent arrest over phone or video call',
        'Directing you to transfer savings to "RBI safety accounts"',
        'Insisting you stay isolated without telling family',
      ],
    },
    {
      id: 'tactic-4',
      title: 'UPI "Receive Money" PIN Phishing',
      category: 'FINANCIAL',
      tagColor: '#38BDF8',
      scamTactic:
        'Fraudsters claim to process an order refund or dividend payout. They send a UPI collect request and tell you to "enter your UPI PIN to approve the incoming credit".',
      defenseAction:
        'Rule of Thumb: YOU NEVER ENTER YOUR UPI PIN TO RECEIVE MONEY. Entering your UPI PIN will only ever debit funds from your account.',
      redFlags: [
        'Claiming PIN entry is necessary to receive credit',
        'Unsolicited collect requests on PhonePe/GooglePay/BHIM',
        'Caller refusing to let you check balance first',
      ],
    },
  ];

  const handleQuizAnswer = (optionIndex: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedQuizOption(optionIndex);
    setQuizAnswered(true);
    if (optionIndex === 1) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
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
            <Text style={[styles.screenTitle, { color: theme.text }]}>Fintech Fraud Academy</Text>
            <Text style={[styles.screenSubtitle, { color: theme.subtext }]}>
              Master the red flags of financial & investment fraud
            </Text>
          </View>
        </View>

        {/* Hero Card */}
        <View style={[styles.academyHero, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.academyHeroContent}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.chipSafeBg }]}>
              <Ionicons name="school" size={26} color={theme.tint} />
            </View>
            <View style={styles.heroText}>
              <Text style={[styles.heroHeading, { color: theme.text }]}>
                Protect Your Portfolio
              </Text>
              <Text style={[styles.heroSub, { color: theme.subtext }]}>
                Scammers target retail investors with psychological urgency, fake regulatory identities, and tech traps.
              </Text>
            </View>
          </View>
        </View>

        {/* Core Tactic Accordions */}
        <Text style={[styles.sectionHeading, { color: theme.text }]}>
          Common Investment Scam Playbooks
        </Text>

        {fraudTactics.map((tactic) => {
          const isExpanded = expandedId === tactic.id;
          return (
            <TouchableOpacity
              key={tactic.id}
              style={[
                styles.tacticCard,
                { backgroundColor: theme.card, borderColor: isExpanded ? theme.tint : theme.cardBorder },
              ]}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setExpandedId(isExpanded ? null : tactic.id);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Tactic: ${tactic.title}`}
            >
              <View style={styles.tacticHeader}>
                <View style={[styles.tagBadge, { backgroundColor: `${tactic.tagColor}20` }]}>
                  <Text style={[styles.tagBadgeText, { color: tactic.tagColor }]}>
                    {tactic.category}
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.subtext}
                />
              </View>

              <Text style={[styles.tacticTitle, { color: theme.text }]}>{tactic.title}</Text>

              {isExpanded && (
                <View style={styles.expandedBody}>
                  <Text style={[styles.bodySubtitle, { color: theme.subtext }]}>HOW THE SCAM OPERATES:</Text>
                  <Text style={[styles.bodyText, { color: theme.text }]}>{tactic.scamTactic}</Text>

                  <Text style={[styles.bodySubtitle, { color: theme.subtext }]}>CRITICAL RED FLAGS:</Text>
                  {tactic.redFlags.map((flag, idx) => (
                    <View key={idx} style={styles.flagBulletRow}>
                      <Ionicons name="alert-circle" size={14} color={theme.danger} />
                      <Text style={[styles.flagBulletText, { color: theme.text }]}>{flag}</Text>
                    </View>
                  ))}

                  <View style={[styles.defenseBox, { backgroundColor: theme.chipSafeBg, borderColor: theme.tint }]}>
                    <Ionicons name="shield-checkmark" size={18} color={theme.tint} />
                    <View style={styles.defenseTextContainer}>
                      <Text style={[styles.defenseTitle, { color: theme.tint }]}>HOW TO RESPOND:</Text>
                      <Text style={[styles.defenseText, { color: theme.text }]}>{tactic.defenseAction}</Text>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Interactive Scam Spotting Quiz */}
        <View style={[styles.quizCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.quizHeader}>
            <Ionicons name="help-circle" size={22} color={theme.warning} />
            <Text style={[styles.quizTitle, { color: theme.text }]}>
              Quick Quiz: Can You Spot the Trap?
            </Text>
          </View>
          <Text style={[styles.quizQuestion, { color: theme.text }]}>
            A caller claiming to be Groww Customer Care calls you: "Your KYC expired. We sent a PhonePe request of ₹1 to verify your active UPI account. Enter your PIN to confirm." What should you do?
          </Text>

          {[
            'Enter the UPI PIN since it is only ₹1.',
            'Refuse and hang up: entering a UPI PIN always sends money, never verifies receiving.',
            'Ask the caller for their employee ID and then enter the PIN.',
          ].map((option, idx) => {
            const isSelected = selectedQuizOption === idx;
            let optionBg = theme.cardSubtle;
            let optionBorder = theme.cardBorder;

            if (quizAnswered) {
              if (idx === 1) {
                optionBg = theme.chipSafeBg;
                optionBorder = theme.tint;
              } else if (isSelected) {
                optionBg = theme.chipDangerBg;
                optionBorder = theme.danger;
              }
            }

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.quizOptionButton,
                  { backgroundColor: optionBg, borderColor: optionBorder },
                ]}
                onPress={() => handleQuizAnswer(idx)}
                accessibilityRole="button"
                accessibilityLabel={`Option ${idx + 1}: ${option}`}
              >
                <Text style={[styles.quizOptionText, { color: theme.text }]}>
                  {idx === 1 && quizAnswered ? '✓ ' : ''}
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}

          {quizAnswered && (
            <View style={[styles.quizFeedback, { backgroundColor: selectedQuizOption === 1 ? theme.chipSafeBg : theme.chipDangerBg }]}>
              <Text
                style={[
                  styles.quizFeedbackText,
                  { color: selectedQuizOption === 1 ? theme.tint : theme.danger },
                ]}
              >
                {selectedQuizOption === 1
                  ? 'Correct! UPI PIN is solely used for authorizing outgoing payments. Groww or banks never request PIN authorization for verification.'
                  : 'Incorrect. Entering a UPI PIN will instantly debit funds from your linked bank account.'}
              </Text>
            </View>
          )}
        </View>

        {/* Emergency Help Hotlines */}
        <View style={[styles.helplineCard, { backgroundColor: theme.cardSubtle, borderColor: theme.cardBorder }]}>
          <Text style={[styles.helplineHeading, { color: theme.text }]}>
            National Cyber Crime Hotlines (India)
          </Text>
          <View style={styles.helplineRow}>
            <View>
              <Text style={[styles.helplineName, { color: theme.tint }]}>Cyber Crime Helpline</Text>
              <Text style={[styles.helplineDesc, { color: theme.subtext }]}>Toll-free immediate financial freeze</Text>
            </View>
            <TouchableOpacity
              style={[styles.dialButton, { backgroundColor: theme.tint }]}
              onPress={() => Alert.alert('Dial 1930', 'Directing to National Cyber Crime Reporting Hotline...')}
              accessibilityRole="button"
              accessibilityLabel="Call 1930"
            >
              <Ionicons name="call" size={14} color="#FFFFFF" />
              <Text style={styles.dialButtonText}>1930</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  screenSubtitle: {
    fontSize: 12,
  },
  academyHero: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  academyHeroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroText: {
    flex: 1,
  },
  heroHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  tacticCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  tacticHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tacticTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  expandedBody: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 12,
  },
  bodySubtitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 8,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  flagBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  flagBulletText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  defenseBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
  },
  defenseTextContainer: {
    flex: 1,
  },
  defenseTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  defenseText: {
    fontSize: 12,
    lineHeight: 16,
  },
  quizCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginVertical: 16,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  quizTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  quizQuestion: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  quizOptionButton: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  quizOptionText: {
    fontSize: 12,
    lineHeight: 16,
  },
  quizFeedback: {
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  quizFeedbackText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  helplineCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  helplineHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  helplineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helplineName: {
    fontSize: 14,
    fontWeight: '700',
  },
  helplineDesc: {
    fontSize: 11,
  },
  dialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  dialButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});