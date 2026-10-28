import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface FlaggedCall {
  id: string;
  number: string;
  status: 'critical' | 'suspicious' | 'safe';
  riskScore: number;
  label: string;
}

export default function CallScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];

  const [phoneNumber, setPhoneNumber] = useState('');

  const flaggedCalls: FlaggedCall[] = [
    { id: '1', number: '+91 98214 78901', status: 'critical', riskScore: 94, label: 'Fake SEBI Tip' },
    { id: '2', number: '+91 91360 45219', status: 'critical', riskScore: 91, label: 'Demat KYC Trap' },
    { id: '3', number: '+91 88002 91823', status: 'suspicious', riskScore: 58, label: 'Unsolicited Tips' },
  ];

  const handleKeyPress = (digit: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhoneNumber((prev) => (prev.length < 13 ? prev + digit : prev));
  };

  const handleDelete = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleStartCall = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/recordscam');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back to Shield dashboard"
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: theme.text }]}>Call Monitor & Dial</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Flagged Contacts List */}
      <View style={styles.flaggedSection}>
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>RECENT FLAGGED CALLERS</Text>
        <FlatList
          data={flaggedCalls}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flaggedList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.flaggedCard,
                {
                  backgroundColor: theme.card,
                  borderColor: item.status === 'critical' ? theme.danger : theme.warning,
                },
              ]}
              onPress={() => {
                setPhoneNumber(item.number.replace(/\s+/g, ''));
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Select flagged caller ${item.number}, ${item.label}`}
            >
              <View style={styles.flaggedHeader}>
                <Ionicons
                  name={item.status === 'critical' ? 'alert-circle' : 'warning'}
                  size={14}
                  color={item.status === 'critical' ? theme.danger : theme.warning}
                />
                <Text
                  style={[
                    styles.flaggedBadgeText,
                    { color: item.status === 'critical' ? theme.danger : theme.warning },
                  ]}
                >
                  {item.riskScore}%
                </Text>
              </View>
              <Text style={[styles.flaggedNumber, { color: theme.text }]}>{item.number}</Text>
              <Text style={[styles.flaggedLabel, { color: theme.subtext }]}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Phone Number Display */}
      <View style={styles.numberContainer}>
        <Text
          style={[
            styles.phoneNumberText,
            { color: phoneNumber.length > 0 ? theme.text : theme.subtext },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {phoneNumber.length > 0 ? phoneNumber : 'Enter phone number'}
        </Text>
        {phoneNumber.length > 0 && (
          <Text style={[styles.shieldNotice, { color: theme.tint }]}>
            <Ionicons name="shield-checkmark" size={12} color={theme.tint} /> AI Voice Shield Active
          </Text>
        )}
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
          <TouchableOpacity
            key={digit}
            style={[styles.key, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => handleKeyPress(digit)}
            accessibilityRole="keyboardkey"
            accessibilityLabel={`Dial ${digit}`}
          >
            <Text style={[styles.keyText, { color: theme.text }]}>{digit}</Text>
          </TouchableOpacity>
        ))}

        {/* Bottom Actions Row: Empty Spacer, Call Button, Backspace */}
        <View style={styles.emptySpacer} />

        <TouchableOpacity
          style={[styles.callActionButton, { backgroundColor: theme.tint }]}
          onPress={handleStartCall}
          accessibilityRole="button"
          accessibilityLabel="Start live call protection"
        >
          <Ionicons name="call" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete last digit"
        >
          <Ionicons name="backspace-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 24,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  flaggedSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  flaggedList: {
    gap: 10,
  },
  flaggedCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 140,
  },
  flaggedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  flaggedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  flaggedNumber: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  flaggedLabel: {
    fontSize: 11,
  },
  numberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  phoneNumberText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  shieldNotice: {
    fontSize: 12,
    fontWeight: '700',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    paddingHorizontal: 10,
  },
  key: {
    width: '30%',
    aspectRatio: 1.35,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 24,
    fontWeight: '700',
  },
  emptySpacer: {
    width: '30%',
    aspectRatio: 1.35,
  },
  callActionButton: {
    width: '30%',
    aspectRatio: 1.35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D09C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  deleteButton: {
    width: '30%',
    aspectRatio: 1.35,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});