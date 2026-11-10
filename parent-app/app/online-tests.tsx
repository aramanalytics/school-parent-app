import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getOnlineTests, OnlineTestItem } from '../src/services/parentData';
import { Clock, Award, CheckCircle2, Play } from 'lucide-react-native';

export default function OnlineTestsScreen() {
  const tests = getOnlineTests();
  const [activeTest, setActiveTest] = useState<OnlineTestItem | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);

  const startTest = (t: OnlineTestItem) => {
    setActiveTest(t);
    setAnswers({});
    setSubmittedScore(null);
  };

  const selectOption = (qId: string, optIdx: number) => {
    setAnswers({ ...answers, [qId]: optIdx });
  };

  const submitTest = () => {
    if (!activeTest) return;

    let total = 0;
    activeTest.questions.forEach((q) => {
      if (answers[q.id] === q.correct_idx) {
        total += 4;
      }
    });

    setSubmittedScore(total);
    Alert.alert(
      'Quiz Completed!',
      `You scored ${total} out of ${activeTest.questions.length * 4} points!`,
      [{ text: 'View Results' }]
    );
  };

  if (activeTest) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.testHeader}>
          <Text style={styles.testTitle}>{activeTest.title}</Text>
          <Text style={styles.testMeta}>
            {activeTest.subject} • {activeTest.duration_minutes} Mins • Total Marks:{' '}
            {activeTest.total_marks}
          </Text>
        </View>

        {submittedScore !== null && (
          <View style={styles.scoreBanner}>
            <Text style={styles.scoreTitle}>Quiz Completed!</Text>
            <Text style={styles.scoreValue}>
              Score: {submittedScore} / {activeTest.questions.length * 4}
            </Text>
          </View>
        )}

        {activeTest.questions.map((q, idx) => (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.questionText}>
              Q{idx + 1}. {q.question}
            </Text>

            <View style={styles.optionsList}>
              {q.options.map((opt, optIdx) => {
                const isSelected = answers[q.id] === optIdx;
                const isCorrect = submittedScore !== null && q.correct_idx === optIdx;
                const isWrong = submittedScore !== null && isSelected && !isCorrect;

                return (
                  <TouchableOpacity
                    key={optIdx}
                    style={[
                      styles.optionButton,
                      isSelected && styles.optionSelected,
                      isCorrect && styles.optionCorrect,
                      isWrong && styles.optionWrong,
                    ]}
                    onPress={() => submittedScore === null && selectOption(q.id, optIdx)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        isCorrect && { color: '#16A36A', fontWeight: 'bold' },
                      ]}
                    >
                      {String.fromCharCode(65 + optIdx)}) {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {submittedScore === null ? (
          <TouchableOpacity style={styles.submitBtn} onPress={submitTest}>
            <Text style={styles.submitBtnText}>Submit Online Assessment</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setActiveTest(null)}
          >
            <Text style={styles.backBtnText}>Return to Tests List</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Available Online MCQ Assessments</Text>

      {tests.map((t) => (
        <View key={t.id} style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t.subject}</Text>
            </View>
            <View style={styles.timeRow}>
              <Clock size={12} color="#64748B" />
              <Text style={styles.timeText}>{t.duration_minutes} Mins</Text>
            </View>
          </View>

          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.desc}>
            Includes {t.questions_count} multiple-choice questions covering chapter
            concepts with immediate scoring.
          </Text>

          <TouchableOpacity style={styles.startBtn} onPress={() => startTest(t)}>
            <Play size={14} color="#FFFFFF" />
            <Text style={styles.startBtnText}>Start Test</Text>
          </TouchableOpacity>
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
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#DBE4FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B5BDB',
    textTransform: 'uppercase',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#3B5BDB',
    paddingVertical: 10,
    borderRadius: 10,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  testHeader: {
    backgroundColor: '#172554',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  testTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testMeta: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  scoreBanner: {
    backgroundColor: '#D3F9D8',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#B2F2BB',
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16A36A',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16A36A',
    marginTop: 2,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  questionText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 12,
    lineHeight: 18,
  },
  optionsList: {
    gap: 8,
  },
  optionButton: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  optionSelected: {
    borderColor: '#3B5BDB',
    backgroundColor: '#DBE4FF',
  },
  optionCorrect: {
    borderColor: '#16A36A',
    backgroundColor: '#D3F9D8',
  },
  optionWrong: {
    borderColor: '#E03131',
    backgroundColor: '#FFE3E3',
  },
  optionText: {
    fontSize: 12,
    color: '#172033',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#3B5BDB',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#16A36A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backBtn: {
    backgroundColor: '#172554',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

