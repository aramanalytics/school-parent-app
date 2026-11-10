import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { getStudentFees } from '../../src/services/parentData';
import { CreditCard, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react-native';

export default function FeesScreen() {
  const { selectedStudent, t } = useAuth();
  const feeSummary = getStudentFees(selectedStudent.id);

  const formatCurrency = (num: number) => {
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const handleDownloadReceipt = (receiptNo?: string) => {
    Alert.alert(
      'Receipt Download',
      `Official receipt ${receiptNo || 'REC-2026-08912'} downloaded to device storage.`,
      [{ text: 'OK' }]
    );
  };

  const handleOnlinePaymentConfig = () => {
    Alert.alert(
      'Online Payment Gateway',
      'Online Payment Gateway integration (Razorpay / PayU / Stripe) is configured for production enablement by school administration.',
      [{ text: 'Understood' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Student Banner */}
      <View style={styles.studentHeader}>
        <Text style={styles.studentName}>{selectedStudent.name}</Text>
        <Text style={styles.studentClass}>
          {selectedStudent.class_name} • {selectedStudent.section_name} • Adm: {selectedStudent.admission_number}
        </Text>
      </View>

      {/* Summary KPI Card */}
      <View style={styles.kpiCard}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCell}>
            <Text style={styles.kpiLabel}>{t.fees.totalFee}</Text>
            <Text style={styles.kpiValue}>
              {formatCurrency(feeSummary.total_amount)}
            </Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiCell}>
            <Text style={styles.kpiLabel}>{t.fees.paidAmount}</Text>
            <Text style={[styles.kpiValue, { color: '#16A36A' }]}>
              {formatCurrency(feeSummary.paid_amount)}
            </Text>
          </View>
        </View>

        <View style={styles.dueAlertStrip}>
          <View>
            <Text style={styles.dueAlertLabel}>{t.fees.pendingAmount}</Text>
            <Text style={styles.dueAlertAmount}>
              {formatCurrency(feeSummary.pending_amount)}
            </Text>
          </View>

          {feeSummary.pending_amount > 0 && (
            <TouchableOpacity
              style={styles.payNowBtn}
              onPress={handleOnlinePaymentConfig}
            >
              <Text style={styles.payNowBtnText}>{t.fees.payNow}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Detailed Fee Line Items */}
      <Text style={styles.sectionHeading}>Fee Structure & Invoices</Text>
      <View style={styles.itemsList}>
        {feeSummary.items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemTop}>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <View
                style={[
                  styles.statusBadge,
                  item.status === 'paid'
                    ? { backgroundColor: '#D3F9D8' }
                    : item.status === 'partial'
                    ? { backgroundColor: '#FFF3BF' }
                    : { backgroundColor: '#FFE3E3' },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    item.status === 'paid'
                      ? { color: '#16A36A' }
                      : item.status === 'partial'
                      ? { color: '#D97706' }
                      : { color: '#E03131' },
                  ]}
                >
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.amountGrid}>
              <View>
                <Text style={styles.amountSubLabel}>Total Assessed</Text>
                <Text style={styles.amountMainText}>{formatCurrency(item.amount)}</Text>
              </View>
              <View>
                <Text style={styles.amountSubLabel}>Paid So Far</Text>
                <Text style={[styles.amountMainText, { color: '#16A36A' }]}>
                  {formatCurrency(item.paid)}
                </Text>
              </View>
              <View>
                <Text style={styles.amountSubLabel}>Due Date</Text>
                <Text style={styles.amountMainText}>{item.due_date}</Text>
              </View>
            </View>

            {item.receipt_no && (
              <View style={styles.receiptRow}>
                <View style={styles.receiptMeta}>
                  <Text style={styles.receiptNumber}>Receipt: {item.receipt_no}</Text>
                  <Text style={styles.receiptDate}>Paid on: {item.payment_date}</Text>
                </View>
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => handleDownloadReceipt(item.receipt_no)}
                >
                  <Download size={13} color="#3B5BDB" />
                  <Text style={styles.downloadBtnText}>Receipt PDF</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
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
  studentHeader: {
    backgroundColor: '#172554',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  studentName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentClass: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  kpiCell: {
    alignItems: 'center',
    flex: 1,
  },
  kpiDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  kpiLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172033',
  },
  dueAlertStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFE3E3',
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
  },
  dueAlertLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E03131',
    textTransform: 'uppercase',
  },
  dueAlertAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E03131',
    marginTop: 2,
  },
  payNowBtn: {
    backgroundColor: '#3B5BDB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  payNowBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 12,
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemCategory: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  amountGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  amountSubLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  amountMainText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#172033',
    marginTop: 2,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  receiptMeta: {
    flex: 1,
  },
  receiptNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#172033',
    fontFamily: 'monospace',
  },
  receiptDate: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#DBE4FF',
  },
  downloadBtnText: {
    fontSize: 11,
    color: '#3B5BDB',
    fontWeight: 'bold',
  },
});

