import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type FilterType = 'all' | 'scam' | 'suspicious' | 'safe';

interface CallRecord {
  id: string;
  caller: string;
  date: string;
  time: string;
  status: 'scam' | 'suspicious' | 'safe';
  riskScore: number;
  category: string;
  transcriptSnippet: string;
  actionTaken: string;
  userVerified?: boolean;
}

const INITIAL_CALL_LOGS: CallRecord[] = [
  {
    id: 'log-1',
    caller: '+91 98214 *****',
    date: 'Today',
    time: '14:20',
    status: 'scam',
    riskScore: 94,
    category: 'SEBI Impersonation & VIP Tips',
    transcriptSnippet:
      '"Sir, we have inside SEBI allotment tips for the upcoming IPO. Transfer ₹25,000 to our reserve pool immediately..."',
    actionTaken: 'Call Dropped & Reported (1930)',
  },
  {
    id: 'log-2',
    caller: '+91 91360 *****',
    date: 'Yesterday',
    time: '17:45',
    status: 'scam',
    riskScore: 91,
    category: 'Urgent Demat KYC Freeze Scare',
    transcriptSnippet:
      '"Your trading demat account will be permanently frozen by 5 PM. Install QuickSupport to verify your PAN..."',
    actionTaken: 'Blocked by ScamShield',
  },
  {
    id: 'log-3',
    caller: '+91 88002 *****',
    date: '25 Oct',
    time: '11:30',
    status: 'suspicious',
    riskScore: 58,
    category: 'Unsolicited Commodity Tips',
    transcriptSnippet:
      '"Guaranteed 10% daily return on gold commodity futures. Join our exclusive WhatsApp channel today..."',
    actionTaken: 'Flagged with Caution Banner',
  },
  {
    id: 'log-4',
    caller: '+91 22 6982 ****',
    date: '24 Oct',
    time: '09:15',
    status: 'safe',
    riskScore: 2,
    category: 'Groww Transaction Notification',
    transcriptSnippet:
      '"Automated confirmation for your scheduled Groww Mutual Fund SIP deduction of ₹5,000..."',
    actionTaken: 'Passed Verification',
  },
  {
    id: 'log-5',
    caller: '+91 98711 *****',
    date: '22 Oct',
    time: '16:10',
    status: 'scam',
    riskScore: 89,
    category: 'UPI PIN Collect Request Phishing',
    transcriptSnippet:
      '"We are refunding your failed stock order payment. Please approve the collect request and enter your UPI PIN..."',
    actionTaken: 'Blocked by ScamShield',
  },
];

export default function HistoryScreen() {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<CallRecord[]>(INITIAL_CALL_LOGS);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'scam' && log.status === 'scam') ||
        (activeFilter === 'suspicious' && log.status === 'suspicious') ||
        (activeFilter === 'safe' && log.status === 'safe');

      const matchesSearch =
        searchQuery.trim() === '' ||
        log.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.transcriptSnippet.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [logs, activeFilter, searchQuery]);

  const handleFeedback = (id: string, currentStatus: string) => {
    Alert.alert(
      'Verify AI Verdict',
      `Was our classification of this call as "${currentStatus.toUpperCase()}" accurate? Your feedback helps retrain the DistilBERT model.`,
      [
        {
          text: 'Correct Verdict',
          onPress: () => {
            setLogs((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, userVerified: true } : item
              )
            );
            Alert.alert('Thank You', 'Your feedback has been logged to retrain the scam detection model.');
          },
        },
        {
          text: 'False Alarm',
          style: 'destructive',
          onPress: () => {
            setLogs((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, status: 'safe', userVerified: true } : item
              )
            );
            Alert.alert('Updated', 'Call marked as safe. Retraining feedback saved.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderStatusBadge = (status: CallRecord['status'], riskScore: number) => {
    let bg = theme.chipSafeBg;
    let textColor = theme.success;
    let label = `SAFE (${riskScore}%)`;

    if (status === 'scam') {
      bg = theme.chipDangerBg;
      textColor = theme.danger;
      label = `CRITICAL FRAUD (${riskScore}%)`;
    } else if (status === 'suspicious') {
      bg = theme.chipWarningBg;
      textColor = theme.warning;
      label = `SUSPICIOUS (${riskScore}%)`;
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bg }]}>
        <Text style={[styles.statusBadgeText, { color: textColor }]}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>
          Call Logs & Telemetry
        </Text>
        <Text style={[styles.screenSubtitle, { color: theme.subtext }]}>
          Real-time transcripts, risk probabilities, and defensive actions
        </Text>
      </View>

      {/* Search Input */}
      <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Ionicons name="search" size={18} color={theme.subtext} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by caller, category, or keyword..."
          placeholderTextColor={theme.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Search call history"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={18} color={theme.subtext} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'scam', 'suspicious', 'safe'] as FilterType[]).map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? theme.tint : theme.card,
                  borderColor: isActive ? theme.tint : theme.cardBorder,
                },
              ]}
              onPress={() => setActiveFilter(filter)}
              accessibilityRole="tab"
              accessibilityLabel={`Filter by ${filter}`}
              accessibilityState={{ selected: isActive }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: isActive ? '#FFFFFF' : theme.text },
                ]}
              >
                {filter === 'all'
                  ? 'All Logs'
                  : filter === 'scam'
                  ? 'Flagged'
                  : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Call Logs List */}
      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="shield-checkmark-outline" size={48} color={theme.subtext} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No call records found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
              All incoming calls monitored by ScamShield are verified safe.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            accessible
            accessibilityLabel={`Call from ${item.caller}, status: ${item.status}, risk: ${item.riskScore} percent, category: ${item.category}`}
          >
            {/* Top Row: Caller & Status */}
            <View style={styles.cardTopRow}>
              <View>
                <Text style={[styles.callerNumber, { color: theme.text }]}>{item.caller}</Text>
                <Text style={[styles.dateTime, { color: theme.subtext }]}>
                  {item.date} • {item.time}
                </Text>
              </View>
              {renderStatusBadge(item.status, item.riskScore)}
            </View>

            {/* Category */}
            <View style={styles.categoryRow}>
              <Ionicons
                name={
                  item.status === 'scam'
                    ? 'alert-circle'
                    : item.status === 'suspicious'
                    ? 'warning'
                    : 'checkmark-circle'
                }
                size={16}
                color={
                  item.status === 'scam'
                    ? theme.danger
                    : item.status === 'suspicious'
                    ? theme.warning
                    : theme.success
                }
              />
              <Text style={[styles.categoryText, { color: theme.text }]}>
                {item.category}
              </Text>
            </View>

            {/* Transcript Snippet */}
            <View style={[styles.transcriptBox, { backgroundColor: theme.cardSubtle }]}>
              <Text style={[styles.transcriptText, { color: theme.subtext }]}>
                {item.transcriptSnippet}
              </Text>
            </View>

            {/* Footer Action & Verification */}
            <View style={styles.cardFooter}>
              <View style={styles.actionTakenRow}>
                <Ionicons name="shield" size={14} color={theme.tint} />
                <Text style={[styles.actionTakenText, { color: theme.tint }]}>
                  {item.actionTaken}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.feedbackButton,
                  { borderColor: item.userVerified ? theme.tint : theme.cardBorder },
                ]}
                onPress={() => handleFeedback(item.id, item.status)}
                accessibilityRole="button"
                accessibilityLabel="Verify or give feedback on this detection"
              >
                <Text style={[styles.feedbackButtonText, { color: item.userVerified ? theme.tint : theme.subtext }]}>
                  {item.userVerified ? 'Verified ✓' : 'Feedback'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  callerNumber: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  dateTime: {
    fontSize: 12,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  transcriptBox: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  transcriptText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionTakenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  actionTakenText: {
    fontSize: 12,
    fontWeight: '600',
  },
  feedbackButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  feedbackButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 18,
  },
});