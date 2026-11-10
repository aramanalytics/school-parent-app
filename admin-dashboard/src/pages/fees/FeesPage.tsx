import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { initialFees, MockFee } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const paymentSchema = z.object({
  amount_paid: z.string().min(1, 'Amount paid is required'),
  payment_method: z.string().min(1, 'Select a payment method'),
  receipt_number: z.string().min(1, 'Receipt number is required'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function FeesPage() {
  const { toast } = useToast();
  const [fees, setFees] = useState<MockFee[]>(initialFees);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedFee, setSelectedFee] = useState<MockFee | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [page, setPage] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: 'Online UPI',
      receipt_number: `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    },
  });

  const totalCollected = fees.reduce((sum, f) => sum + f.paid_amount, 0);
  const totalPending = fees.reduce(
    (sum, f) => sum + (f.amount - f.paid_amount),
    0
  );

  const filteredFees = fees.filter((f) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      f.student_name.toLowerCase().includes(query) ||
      f.admission_number.toLowerCase().includes(query) ||
      f.category.toLowerCase().includes(query);
    const matchesStatus = statusFilter ? f.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleRecordPayment = (values: PaymentFormValues) => {
    if (!selectedFee) return;

    const paidNum = parseFloat(values.amount_paid);
    const newPaidAmount = selectedFee.paid_amount + paidNum;
    const newStatus =
      newPaidAmount >= selectedFee.amount
        ? 'paid'
        : newPaidAmount > 0
        ? 'partial'
        : 'pending';

    const updated = fees.map((f) =>
      f.id === selectedFee.id
        ? {
            ...f,
            paid_amount: newPaidAmount,
            status: newStatus as any,
            receipt_number: values.receipt_number,
            payment_method: values.payment_method,
          }
        : f
    );

    setFees(updated);
    toast(
      'success',
      'Payment Recorded',
      `Recorded ${formatCurrency(paidNum)} for ${selectedFee.student_name}. Receipt: ${values.receipt_number}`
    );
    setShowPayModal(false);
    reset();
  };

  const openReceipt = (fee: MockFee) => {
    setSelectedFee(fee);
    setShowReceiptModal(true);
  };

  const openPay = (fee: MockFee) => {
    setSelectedFee(fee);
    reset({
      amount_paid: String(fee.amount - fee.paid_amount),
      payment_method: 'Online UPI',
      receipt_number: `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    });
    setShowPayModal(true);
  };

  const columns: Column<MockFee>[] = [
    {
      key: 'student',
      header: 'Student & Admission',
      render: (row) => (
        <div>
          <p className="font-semibold text-xs text-[#172033]">{row.student_name}</p>
          <p className="text-[10px] text-[#64748B] font-mono">
            {row.admission_number} • {row.class_name}
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Fee Category',
      render: (row) => <span className="text-xs font-medium">{row.category}</span>,
    },
    {
      key: 'amount',
      header: 'Total Fee',
      render: (row) => (
        <span className="text-xs font-semibold">{formatCurrency(row.amount)}</span>
      ),
    },
    {
      key: 'paid_amount',
      header: 'Amount Paid',
      render: (row) => (
        <span className="text-xs font-semibold text-[#16A36A]">
          {formatCurrency(row.paid_amount)}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Due Balance',
      render: (row) => {
        const balance = row.amount - row.paid_amount;
        return (
          <span
            className={`text-xs font-semibold ${
              balance > 0 ? 'text-[#E03131]' : 'text-[#64748B]'
            }`}
          >
            {formatCurrency(balance)}
          </span>
        );
      },
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (row) => <span className="text-xs">{row.due_date}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const map = {
          paid: 'success',
          partial: 'warning',
          pending: 'info',
          overdue: 'error',
        } as const;
        return <Badge variant={map[row.status]}>{row.status.toUpperCase()}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status !== 'paid' && (
            <Button variant="outline" size="sm" onClick={() => openPay(row)}>
              Collect
            </Button>
          )}
          {row.paid_amount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => openReceipt(row)} title="Print Receipt">
              <Printer size={14} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
            Fee Management & Receipts
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Fee categories, payment collections, invoice generation, and pending balances
          </p>
        </div>
        <Button size="sm">
          <Plus size={14} /> Assign Fee Category
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Total Collections
          </p>
          <p className="text-2xl font-bold text-[#16A36A]">{formatCurrency(totalCollected)}</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">Verified via Bank & UPI</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Outstanding Dues
          </p>
          <p className="text-2xl font-bold text-[#E03131]">{formatCurrency(totalPending)}</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">Term 1 Pending Balances</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Collection Efficiency
          </p>
          <p className="text-2xl font-bold text-[#3B5BDB]">
            {Math.round((totalCollected / (totalCollected + totalPending)) * 100)}%
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1">Target for month: 85%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 w-72">
          <Search size={15} className="text-[#64748B]" />
          <input
            type="text"
            placeholder="Search by student, admission no, or fee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full"
          />
        </div>

        <div className="w-40">
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'paid', label: 'Paid' },
              { value: 'partial', label: 'Partial' },
              { value: 'pending', label: 'Pending' },
              { value: 'overdue', label: 'Overdue' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredFees}
        page={page}
        totalPages={Math.ceil(filteredFees.length / 10) || 1}
        onPageChange={setPage}
        totalItems={filteredFees.length}
      />

      {/* Record Payment Modal */}
      {selectedFee && (
        <Modal
          isOpen={showPayModal}
          onClose={() => setShowPayModal(false)}
          title="Record Fee Payment"
          description={`Student: ${selectedFee.student_name} (${selectedFee.admission_number})`}
          size="md"
        >
          <form onSubmit={handleSubmit(handleRecordPayment)} className="space-y-4">
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
              <p>
                <span className="font-semibold text-[#172033]">Fee Item:</span>{' '}
                {selectedFee.category}
              </p>
              <p>
                <span className="font-semibold text-[#172033]">Total Amount:</span>{' '}
                {formatCurrency(selectedFee.amount)}
              </p>
              <p>
                <span className="font-semibold text-[#172033]">Remaining Balance:</span>{' '}
                <span className="text-[#E03131] font-bold">
                  {formatCurrency(selectedFee.amount - selectedFee.paid_amount)}
                </span>
              </p>
            </div>

            <Input
              label="Amount Received (INR)"
              type="number"
              required
              error={errors.amount_paid?.message}
              {...register('amount_paid')}
            />

            <Select
              label="Payment Mode"
              options={[
                { value: 'Online UPI', label: 'Online UPI (GPay / PhonePe / Paytm)' },
                { value: 'Bank Transfer', label: 'NEFT / RTGS Bank Transfer' },
                { value: 'Cash', label: 'Cash at Cashier Desk' },
                { value: 'Cheque', label: 'Cheque / Demand Draft' },
              ]}
              {...register('payment_method')}
            />

            <Input
              label="Receipt / Reference Number"
              required
              error={errors.receipt_number?.message}
              {...register('receipt_number')}
            />

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
              <Button variant="outline" type="button" onClick={() => setShowPayModal(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Confirm & Issue Receipt
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Printable Receipt Preview Modal */}
      {selectedFee && (
        <Modal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          title="Official Fee Receipt Preview"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-white space-y-4 shadow-xs">
              <div className="text-center border-b border-[#E2E8F0] pb-4">
                <h3 className="text-base font-bold text-[#172554]">
                  SUNRISE INTERNATIONAL SCHOOL
                </h3>
                <p className="text-[11px] text-[#64748B]">142, Anna Salai, Chennai, TN 600002</p>
                <p className="text-[10px] text-[#3B5BDB] font-mono mt-1">
                  OFFICIAL PAYMENT RECEIPT
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[#64748B]">Receipt No:</p>
                  <p className="font-bold text-[#172033] font-mono">
                    {selectedFee.receipt_number || 'REC-2026-08912'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#64748B]">Date of Issue:</p>
                  <p className="font-bold text-[#172033]">
                    {new Date().toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-lg space-y-1">
                <p>
                  <span className="text-[#64748B]">Student Name:</span>{' '}
                  <span className="font-bold text-[#172033]">{selectedFee.student_name}</span>
                </p>
                <p>
                  <span className="text-[#64748B]">Admission No:</span>{' '}
                  <span className="font-mono font-bold text-[#172033]">
                    {selectedFee.admission_number}
                  </span>
                </p>
                <p>
                  <span className="text-[#64748B]">Class & Section:</span>{' '}
                  <span className="font-bold text-[#172033]">{selectedFee.class_name}</span>
                </p>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[11px] text-[#64748B]">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#F1F5F9]">
                    <td className="py-2.5 font-medium">{selectedFee.category}</td>
                    <td className="py-2.5 text-right font-bold text-[#16A36A]">
                      {formatCurrency(selectedFee.paid_amount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#64748B]">
                  Payment Method: {selectedFee.payment_method || 'Online'}
                </span>
                <span className="text-xs font-bold text-[#16A36A]">STATUS: PAID</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  window.print();
                  toast('info', 'Print Dialog', 'Print dispatched to local printer.');
                }}
              >
                <Printer size={14} /> Print Receipt
              </Button>
              <Button onClick={() => setShowReceiptModal(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

