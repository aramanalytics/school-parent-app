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
import { getParentBookUniformFees } from '../../src/services/bookUniformFeeData';
import {
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Shirt,
  Bell,
  Eye,
} from 'lucide-react-native';

export default function FeesScreen() {
  const { selectedStudent, t } = useAuth();
  const [activeTab, setActiveTab] = useState<'tuition' | 'books_uniform'>('tuition');

  const feeSummary = getStudentFees(selectedStudent.id);
  const bookUniformSummary = getParentBookUniformFees(selectedStudent.id);

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
      'Online Payment Gateway integration (Razorpay / PayU / UPI) is configured for production enablement by school administration.',
      [{ text: 'Understood' }]
    );
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return { bg: '#D3F9D8', text: '#16A36A', label: 'PAID' };
      case 'partial':
        return { bg: '#FFF3BF', text: '#D97706', label: 'PARTIALLY PAID' };
      case 'pending':
        return { bg: '#F1F5F9', text: '#64748B', label: 'PENDING' };
      case 'overdue':
        return { bg: '#FFE3E3', text: '#E03131', label: 'OVERDUE' };
      case 'waived':
        return { bg: '#F3E8FF', text: '#7E22CE', label: 'WAIVED' };
      default:
        return { bg: '#F1F5F9', text: '#64748B', label: status.toUpperCase() };
    }
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

      {/* Navigation Switcher: Tuition Fees vs Books & Uniform Fees */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === 'tuition' && styles.tabBtnActive,
          ]}
          onPress={() => setActiveTab('tuition')}
        >
          <CreditCard size={15} color={activeTab === 'tuition' ? '#FFFFFF' : '#64748B'} />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'tuition' && styles.tabBtnTextActive,
            ]}
          >
            Tuition Fees
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === 'books_uniform' && styles.tabBtnActive,
          ]}
          onPress={() => setActiveTab('books_uniform')}
        >
          <BookOpen size={15} color={activeTab === 'books_uniform' ? '#FFFFFF' : '#64748B'} />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'books_uniform' && styles.tabBtnTextActive,
            ]}
          >
            Books & Uniform
          </Text>
          {bookUniformSummary.totalPending > 0 && (
            <View style={styles.dueBadgePill}>
              <Text style={styles.dueBadgePillText}>Due</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* VIEW A: TUITION FEES */}
      {activeTab === 'tuition' && (
        <View>
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
        </View>
      )}

      {/* VIEW B: BOOKS & UNIFORM FEES */}
      {activeTab === 'books_uniform' && (
        <View style={styles.buContainer}>
          {/* Parent App Notification Pill */}
          <View style={styles.buNoticeBanner}>
            <Bell size={16} color="#1D4ED8" />
            <Text style={styles.buNoticeText}>
              AVK Academic Year 2026-2027 textbook packages and customized uniform kits are ready at the school distribution counter.
            </Text>
          </View>

          {/* Combined Fee Summary */}
          <View style={styles.buSummaryCard}>
            <Text style={styles.buSummaryTitle}>Fee Summary (Academic Year 2026-2027)</Text>
            <View style={styles.buSummaryGrid}>
              <View style={styles.buSummaryItem}>
                <Text style={styles.buSummaryLabel}>Book Fee</Text>
                <Text style={[styles.buSummaryValue, { color: '#0369A1' }]}>
                  {formatCurrency(bookUniformSummary.bookFee?.totalAmount || 0)}
                </Text>
              </View>
              <View style={styles.buSummaryItem}>
                <Text style={styles.buSummaryLabel}>Uniform Fee</Text>
                <Text style={[styles.buSummaryValue, { color: '#7E22CE' }]}>
                  {formatCurrency(bookUniformSummary.uniformFee?.totalAmount || 0)}
                </Text>
              </View>
            </View>

            <View style={styles.buSummaryDivider} />

            <View style={styles.buSummaryRow}>
              <View>
                <Text style={styles.buSummarySubtext}>Total Assigned</Text>
                <Text style={styles.buSummaryAmount}>{formatCurrency(bookUniformSummary.totalAssigned)}</Text>
              </View>
              <View>
                <Text style={styles.buSummarySubtext}>Amount Received</Text>
                <Text style={[styles.buSummaryAmount, { color: '#16A36A' }]}>
                  {formatCurrency(bookUniformSummary.totalReceived)}
                </Text>
              </View>
              <View>
                <Text style={styles.buSummarySubtext}>Pending Balance</Text>
                <Text style={[styles.buSummaryAmount, { color: '#E03131' }]}>
                  {formatCurrency(bookUniformSummary.totalPending)}
                </Text>
              </View>
            </View>
          </View>

          {/* CARD 1: BOOK FEE */}
          <View style={styles.buCard}>
            <View style={styles.buCardHeader}>
              <View style={styles.buCardTitleGroup}>
                <View style={[styles.buIconWrap, { backgroundColor: '#E0F2FE' }]}>
                  <BookOpen size={18} color="#0369A1" />
                </View>
                <View>
                  <Text style={styles.buCardTitle}>Book Fee</Text>
                  <Text style={styles.buCardSubtitle}>Textbooks, Workbooks & Kits</Text>
                </View>
              </View>

              {bookUniformSummary.bookFee && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBadgeStyle(bookUniformSummary.bookFee.status).bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: getStatusBadgeStyle(bookUniformSummary.bookFee.status).text },
                    ]}
                  >
                    {getStatusBadgeStyle(bookUniformSummary.bookFee.status).label}
                  </Text>
                </View>
              )}
            </View>

            {bookUniformSummary.bookFee ? (
              <View style={styles.buCardBody}>
                {/* Metrics */}
                <View style={styles.buMetricsRow}>
                  <View style={styles.buMetricCol}>
                    <Text style={styles.buMetricLabel}>Total Fee</Text>
                    <Text style={styles.buMetricVal}>
                      {formatCurrency(bookUniformSummary.bookFee.totalAmount)}
                    </Text>
                  </View>
                  <View style={styles.buMetricCol}>
                    <Text style={styles.buMetricLabel}>Received</Text>
                    <Text style={[styles.buMetricVal, { color: '#16A36A' }]}>
                      {formatCurrency(bookUniformSummary.bookFee.amountReceived)}
                    </Text>
                  </View>
                  <View style={styles.buMetricCol}>
                    <Text style={styles.buMetricLabel}>Pending</Text>
                    <Text
                      style={[
                        styles.buMetricVal,
                        {
                          color:
                            bookUniformSummary.bookFee.balanceAmount > 0
                              ? '#E03131'
                              : '#64748B',
                        },
                      ]}
                    >
                      {formatCurrency(bookUniformSummary.bookFee.balanceAmount)}
                    </Text>
                  </View>
                </View>

                <View style={styles.buDueDateRow}>
                  <Text style={styles.buDueDateLabel}>Payment Due Date:</Text>
                  <Text style={styles.buDueDateValue}>{bookUniformSummary.bookFee.dueDate}</Text>
                </View>

                {/* Package Breakdown */}
                <Text style={styles.buSubheading}>Package Components:</Text>
                <View style={styles.buItemsList}>
                  {bookUniformSummary.bookFee.items.map((it, idx) => (
                    <View key={idx} style={styles.buItemLine}>
                      <Text style={styles.buItemName}>• {it.name}</Text>
                      <Text style={styles.buItemAmount}>{formatCurrency(it.amount)}</Text>
                    </View>
                  ))}
                </View>

                {/* Payment History & Receipts */}
                <Text style={styles.buSubheading}>Payment History & Receipts:</Text>
                {bookUniformSummary.bookFee.payments.length > 0 ? (
                  bookUniformSummary.bookFee.payments.map((p) => (
                    <View key={p.id} style={styles.buPaymentCard}>
                      <View>
                        <Text style={styles.buReceiptNo}>{p.receiptNumber}</Text>
                        <Text style={styles.buPaymentMeta}>
                          {p.paymentDate} • {p.paymentMode}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.buDownloadReceiptBtn}
                        onPress={() => handleDownloadReceipt(p.receiptNumber)}
                      >
                        <Download size={12} color="#FFFFFF" />
                        <Text style={styles.buDownloadReceiptBtnText}>Receipt</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.buNoHistoryText}>No payments processed yet.</Text>
                )}
              </View>
            ) : (
              <Text style={styles.buNoHistoryText}>No book fee assigned for this student.</Text>
            )}
          </View>

          {/* CARD 2: UNIFORM FEE */}
          <View style={styles.buCard}>
            <View style={styles.buCardHeader}>
              <View style={styles.buCardTitleGroup}>
                <View style={[styles.buIconWrap, { backgroundColor: '#F3E8FF' }]}>
                  <Shirt size={18} color="#7E22CE" />
                </View>
                <View>
                  <Text style={styles.buCardTitle}>Uniform Fee</Text>
                  <Text style={styles.buCardSubtitle}>Regular, Sports & Accessories</Text>
                </View>
              </View>

              {bookUniformSummary.uniformFee && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBadgeStyle(bookUniformSummary.uniformFee.status).bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: getStatusBadgeStyle(bookUniformSummary.uniformFee.status).text },
                    ]}
                  >
                    {getStatusBadgeStyle(bookUniformSummary.uniformFee.status).label}
                  </Text>
                </View>
              )}
            </View>

            {bookUniformSummary.uniformFee ? (
              <View style={styles.buCardBody}>
                {/* Metrics */}
                <View style={styles.buMetricsRow}>
                  <View style={styles.buMetricCol}>
                    <Text style={styles.buMetricLabel}>Total Fee</Text>
                    <Text style={styles.buMetricVal}>
                      {formatCurrency(bookUniformSummary.uniformFee.totalAmount)}
                    </Text>
                  </View>
                  <View style={styles.buMetricCol}>
                    <Text style={styles.buMetricLabel}>Received</Text>
                    <Text style={[styles.buMetricVal, { color: '#16A36A' }]}>
                      {formatCurrency(bookUniformSummary.uniformFee.amountReceived)}
                    </Text>
                  </View>
                  <View style={styles.buMetricCol}>
                    <Text style={styles.buMetricLabel}>Pending</Text>
                    <Text
                      style={[
                        styles.buMetricVal,
                        {
                          color:
                            bookUniformSummary.uniformFee.balanceAmount > 0
                              ? '#E03131'
                              : '#64748B',
                        },
                      ]}
                    >
                      {formatCurrency(bookUniformSummary.uniformFee.balanceAmount)}
                    </Text>
                  </View>
                </View>

                <View style={styles.buDueDateRow}>
                  <Text style={styles.buDueDateLabel}>Payment Due Date:</Text>
                  <Text style={styles.buDueDateValue}>{bookUniformSummary.uniformFee.dueDate}</Text>
                </View>

                {/* Package Breakdown */}
                <Text style={styles.buSubheading}>Package Components:</Text>
                <View style={styles.buItemsList}>
                  {bookUniformSummary.uniformFee.items.map((it, idx) => (
                    <View key={idx} style={styles.buItemLine}>
                      <Text style={styles.buItemName}>• {it.name}</Text>
                      <Text style={styles.buItemAmount}>{formatCurrency(it.amount)}</Text>
                    </View>
                  ))}
                </View>

                {/* Payment History & Receipts */}
                <Text style={styles.buSubheading}>Payment History & Receipts:</Text>
                {bookUniformSummary.uniformFee.payments.length > 0 ? (
                  bookUniformSummary.uniformFee.payments.map((p) => (
                    <View key={p.id} style={styles.buPaymentCard}>
                      <View>
                        <Text style={styles.buReceiptNo}>{p.receiptNumber}</Text>
                        <Text style={styles.buPaymentMeta}>
                          {p.paymentDate} • {p.paymentMode}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.buDownloadReceiptBtn}
                        onPress={() => handleDownloadReceipt(p.receiptNumber)}
                      >
                        <Download size={12} color="#FFFFFF" />
                        <Text style={styles.buDownloadReceiptBtnText}>Receipt</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.buNoHistoryText}>No payments processed yet.</Text>
                )}
              </View>
            ) : (
              <Text style={styles.buNoHistoryText}>No uniform fee assigned for this student.</Text>
            )}
          </View>
        </View>
      )}
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
    marginBottom: 14,
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
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: '#172554',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  dueBadgePill: {
    backgroundColor: '#E03131',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  dueBadgePillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
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
  // Books & Uniform Specific Styles
  buContainer: {
    gap: 16,
  },
  buNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  buNoticeText: {
    flex: 1,
    fontSize: 11,
    color: '#1E3A8A',
    lineHeight: 16,
  },
  buSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buSummaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 12,
  },
  buSummaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  buSummaryItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buSummaryLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
  },
  buSummaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  buSummaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  buSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buSummarySubtext: {
    fontSize: 10,
    color: '#94A3B8',
  },
  buSummaryAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
    marginTop: 2,
  },
  buCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  buCardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
  },
  buCardSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  buCardBody: {
    marginTop: 12,
    gap: 10,
  },
  buMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buMetricCol: {
    alignItems: 'center',
    flex: 1,
  },
  buMetricLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  buMetricVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
    marginTop: 2,
  },
  buDueDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  buDueDateLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  buDueDateValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#172033',
  },
  buSubheading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#172033',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  buItemsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  buItemLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buItemName: {
    fontSize: 11,
    color: '#172033',
  },
  buItemAmount: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    fontFamily: 'monospace',
  },
  buPaymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buReceiptNo: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B5BDB',
    fontFamily: 'monospace',
  },
  buPaymentMeta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  buDownloadReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#3B5BDB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buDownloadReceiptBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  buNoHistoryText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    paddingVertical: 6,
  },
});
