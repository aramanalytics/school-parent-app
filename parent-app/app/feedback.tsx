import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react-native';

interface FeedbackRecord {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved';
  response?: string;
  date: string;
}

export default function FeedbackScreen() {
  const [records, setRecords] = useState<FeedbackRecord[]>([
    {
      id: 'fb-1',
      category: 'Suggestion',
      subject: 'Bus Route Timing Adjustment',
      message: 'Could the bus stop arrival time at Adyar Depot be reviewed? The morning bus arrives 10 minutes past 8:15 AM.',
      status: 'resolved',
      response: 'The transport coordinator has adjusted route 14 schedule by 10 minutes starting Monday. Thank you for notifying us.',
      date: '04 Nov 2026',
    },
  ]);

  const [category, setCategory] = useState<'Query' | 'Suggestion' | 'Complaint'>('Query');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Incomplete Form', 'Please enter a subject and message.');
      return;
    }

    const newFb: FeedbackRecord = {
      id: `fb-${Date.now()}`,
      category,
      subject,
      message,
      status: 'pending',
      date: 'Today',
    };

    setRecords([newFb, ...records]);
    setSubject('');
    setMessage('');
    Alert.alert(
      'Feedback Submitted',
      'Your communication has been forwarded to the school administrative desk.'
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Compose Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Submit Query or Feedback</Text>
        <Text style={styles.cardSub}>
          Send questions, transport notes, or suggestions directly to administration
        </Text>

        <Text style={styles.label}>Select Category</Text>
        <View style={styles.categoryRow}>
          {(['Query', 'Suggestion', 'Complaint'] as const).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                category === cat && styles.categoryChipActive,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Science Olympiad Enrollment"
          placeholderTextColor="#94A3B8"
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={styles.label}>Detailed Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your inquiry or observation..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Send size={15} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>Submit to School</Text>
        </TouchableOpacity>
      </View>

      {/* History */}
      <Text style={styles.sectionHeader}>Feedback & Responses History</Text>
      {records.map((item) => (
        <View key={item.id} style={styles.historyCard}>
          <View style={styles.historyTop}>
            <View style={styles.catPill}>
              <Text style={styles.catPillText}>{item.category}</Text>
            </View>
            <View
              style={[
                styles.statusPill,
                item.status === 'resolved'
                  ? { backgroundColor: '#D3F9D8' }
                  : { backgroundColor: '#FFF3BF' },
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  item.status === 'resolved'
                    ? { color: '#16A36A' }
                    : { color: '#D97706' },
                ]}
              >
                {item.status === 'resolved' ? 'Resolved' : 'Pending Response'}
              </Text>
            </View>
          </View>

          <Text style={styles.historySubject}>{item.subject}</Text>
          <Text style={styles.historyMessage}>{item.message}</Text>

          {item.response && (
            <View style={styles.responseBox}>
              <Text style={styles.responseTitle}>School Administrative Response:</Text>
              <Text style={styles.responseText}>{item.response}</Text>
            </View>
          )}

          <Text style={styles.historyDate}>Submitted: {item.date}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172033',
  },
  cardSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#3B5BDB',
    borderColor: '#3B5BDB',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#172033',
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#3B5BDB',
    paddingVertical: 12,
    borderRadius: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  catPill: {
    backgroundColor: '#DBE4FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  catPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B5BDB',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  historySubject: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 4,
  },
  historyMessage: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  responseBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  responseTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B5BDB',
    marginBottom: 2,
  },
  responseText: {
    fontSize: 12,
    color: '#172033',
    lineHeight: 17,
  },
  historyDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 8,
  },
});

