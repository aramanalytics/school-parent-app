import React, { useState, useMemo } from 'react';
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
  BookOpen,
  Shirt,
  Calendar,
  Layers,
  Users,
  Check,
  X,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
  DollarSign,
  Receipt,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils';
import {
  StudentBookUniformFee,
  FeeCategory,
  PaymentStatus,
  PaymentMode,
  FeePaymentRecord,
  FeeCatalogItem,
  standardFeeCatalog,
  getAllBookUniformFees,
  assignBookUniformFee,
  bulkAssignClassFee,
  recordFeePayment,
  waiveStudentFee,
  getFeeSummaryStats,
} from '@/lib/bookUniformFeeData';
import { initialStudents } from '@/lib/mockData';

export function BookUniformFeesPage() {
  const { toast } = useToast();

  // Local state initialized from service
  const [fees, setFees] = useState<StudentBookUniformFee[]>(() => getAllBookUniformFees());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'book' | 'uniform'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('2026-2027');
  const [page, setPage] = useState(1);

  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showWaiveModal, setShowWaiveModal] = useState(false);

  // Selected fee item for action
  const [selectedFee, setSelectedFee] = useState<StudentBookUniformFee | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<{
    fee: StudentBookUniformFee;
    payment: FeePaymentRecord;
  } | null>(null);

  // Form states for Assign Fee Modal
  const [assignMode, setAssignMode] = useState<'individual' | 'bulk'>('individual');
  const [assignCategory, setAssignCategory] = useState<FeeCategory>('book');
  const [assignAcademicYear, setAssignAcademicYear] = useState('2026-2027');
  const [assignStudentId, setAssignStudentId] = useState('');
  const [assignClass, setAssignClass] = useState('Class 5');
  const [assignSection, setAssignSection] = useState('Section A');
  const [assignDueDate, setAssignDueDate] = useState('2026-11-30');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [selectedCatalogItemIds, setSelectedCatalogItemIds] = useState<string[]>([
    'cat-bk-1',
    'cat-bk-2',
    'cat-bk-3',
    'cat-bk-4',
  ]);
  const [customAmount, setCustomAmount] = useState<number | ''>('');

  // Form states for Record Payment Modal
  const [payAmount, setPayAmount] = useState<string>('');
  const [payMode, setPayMode] = useState<PaymentMode>('UPI');
  const [payRef, setPayRef] = useState<string>('');
  const [payReceiptNo, setPayReceiptNo] = useState<string>('');
  const [payRemarks, setPayRemarks] = useState<string>('');

  // Form state for Waive Modal
  const [waiveReason, setWaiveReason] = useState<string>('');

  // Synchronize state refresher
  const refreshFees = () => {
    setFees(getAllBookUniformFees());
  };

  // Summary statistics
  const stats = useMemo(() => {
    const totalBookAssigned = fees
      .filter((f) => f.category === 'book')
      .reduce((sum, f) => sum + f.totalAmount, 0);

    const totalUniformAssigned = fees
      .filter((f) => f.category === 'uniform')
      .reduce((sum, f) => sum + f.totalAmount, 0);

    const totalCollected = fees.reduce((sum, f) => sum + f.amountReceived, 0);
    const totalPending = fees.reduce((sum, f) => sum + f.balanceAmount, 0);
    const partialCount = fees.filter((f) => f.status === 'partial').length;
    const overdueCount = fees.filter((f) => f.status === 'overdue').length;

    return {
      totalBookAssigned,
      totalUniformAssigned,
      totalCollected,
      totalPending,
      partialCount,
      overdueCount,
    };
  }, [fees]);

  // Catalog items filtered by assignCategory
  const availableCatalogItems = useMemo(() => {
    return standardFeeCatalog.filter((c) => c.category === assignCategory);
  }, [assignCategory]);

  // Compute calculated amount from catalog items
  const computedCatalogTotal = useMemo(() => {
    return availableCatalogItems
      .filter((item) => selectedCatalogItemIds.includes(item.id))
      .reduce((sum, item) => sum + item.defaultAmount, 0);
  }, [availableCatalogItems, selectedCatalogItemIds]);

  // Filtered fee records
  const filteredFees = useMemo(() => {
    return fees.filter((f) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.studentName.toLowerCase().includes(q) ||
        f.admissionNumber.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q);

      const matchesCat = categoryFilter === 'all' || f.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchesClass =
        classFilter === 'all' ||
        f.className.toLowerCase() === classFilter.toLowerCase() ||
        `${f.className}-${f.sectionName}`.toLowerCase().includes(classFilter.toLowerCase());
      const matchesYear = !yearFilter || f.academicYear === yearFilter;

      return matchesSearch && matchesCat && matchesStatus && matchesClass && matchesYear;
    });
  }, [fees, searchQuery, categoryFilter, statusFilter, classFilter, yearFilter]);

  // Handle opening Payment Modal
  const openPaymentModal = (fee: StudentBookUniformFee) => {
    setSelectedFee(fee);
    setPayAmount(fee.balanceAmount.toString());
    setPayMode('UPI');
    setPayRef('');
    setPayReceiptNo(`REC-BKUN-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setPayRemarks('');
    setShowPayModal(true);
  };

  // Handle Recording Payment Submission
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee) return;

    const parsedAmount = parseFloat(payAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast('error', 'Invalid Amount', 'Please specify a valid payment amount greater than zero.');
      return;
    }

    if (parsedAmount > selectedFee.balanceAmount) {
      toast('error', 'Amount Exceeds Balance', `Maximum payable balance is ${formatCurrency(selectedFee.balanceAmount)}.`);
      return;
    }

    const res = recordFeePayment({
      feeId: selectedFee.id,
      amount: parsedAmount,
      paymentMode: payMode,
      transactionReference: payRef.trim() || undefined,
      receiptNumber: payReceiptNo.trim() || undefined,
      remarks: payRemarks.trim() || undefined,
      recordedBy: 'M. Sangeetha (School Accounts)',
    });

    if (res.success && res.updatedRecord) {
      toast('success', 'Payment Recorded Successfully', res.message);
      refreshFees();
      setShowPayModal(false);

      // Open receipt preview automatically
      const latestPayment =
        res.updatedRecord.payments[res.updatedRecord.payments.length - 1];
      if (latestPayment) {
        setSelectedReceipt({
          fee: res.updatedRecord,
          payment: latestPayment,
        });
        setShowReceiptModal(true);
      }
    } else {
      toast('error', 'Payment Error', res.message);
    }
  };

  // Handle Assign Fee Submission
  const handleAssignFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedItems = availableCatalogItems
      .filter((item) => selectedCatalogItemIds.includes(item.id))
      .map((item) => ({ name: item.name, amount: item.defaultAmount }));

    const finalAmount =
      customAmount !== '' && !isNaN(Number(customAmount))
        ? Number(customAmount)
        : computedCatalogTotal;

    if (finalAmount <= 0) {
      toast('error', 'Invalid Total Amount', 'Total fee amount must be greater than zero.');
      return;
    }

    const feeDescription =
      assignCategory === 'book'
        ? `${assignClass} Academic Books, Workbooks & Stationery Package`
        : `${assignClass} Complete Uniform Kit (Regular, Sports & Accessories)`;

    if (assignMode === 'individual') {
      const student = initialStudents.find((s) => s.id === assignStudentId);
      if (!student) {
        toast('error', 'Student Required', 'Please select a valid student from the school registry.');
        return;
      }

      const res = assignBookUniformFee({
        academicYear: assignAcademicYear,
        studentId: student.id,
        studentName: `${student.first_name} ${student.last_name}`,
        admissionNumber: student.admission_number,
        className: student.class_name,
        sectionName: student.section_name,
        category: assignCategory,
        description: feeDescription,
        items: selectedItems.length > 0 ? selectedItems : [{ name: feeDescription, amount: finalAmount }],
        totalAmount: finalAmount,
        dueDate: assignDueDate,
        remarks: assignRemarks.trim() || undefined,
      });

      if (res.success) {
        toast('success', 'Fee Assigned', res.message);
        refreshFees();
        setShowAssignModal(false);
      } else {
        toast('error', 'Duplicate Fee Assignment Blocked', res.message);
      }
    } else {
      // Bulk assignment to class/section
      const eligibleStudents = initialStudents.filter(
        (s) =>
          s.class_name.toLowerCase() === assignClass.toLowerCase() &&
          (!assignSection || s.section_name.toLowerCase() === assignSection.toLowerCase())
      );

      if (eligibleStudents.length === 0) {
        toast('error', 'No Students Found', `No active students match ${assignClass} ${assignSection}.`);
        return;
      }

      const formattedStudents = eligibleStudents.map((s) => ({
        id: s.id,
        name: `${s.first_name} ${s.last_name}`,
        admissionNumber: s.admission_number,
        className: s.class_name,
        sectionName: s.section_name,
      }));

      const res = bulkAssignClassFee(
        formattedStudents,
        assignAcademicYear,
        assignCategory,
        feeDescription,
        selectedItems.length > 0 ? selectedItems : [{ name: feeDescription, amount: finalAmount }],
        finalAmount,
        assignDueDate,
        assignRemarks.trim() || `Bulk assignment for ${assignClass} ${assignSection}`
      );

      toast(
        res.assignedCount > 0 ? 'success' : 'error',
        'Bulk Assignment Complete',
        `Successfully assigned to ${res.assignedCount} students. (${res.skippedCount} skipped as already assigned)`
      );

      refreshFees();
      setShowAssignModal(false);
    }
  };

  // Handle Waive Fee Submission
  const handleWaiveFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee) return;

    if (!waiveReason.trim()) {
      toast('error', 'Reason Required', 'Please provide an official reason or approval reference for fee waiver.');
      return;
    }

    const res = waiveStudentFee(selectedFee.id, waiveReason.trim());
    if (res.success) {
      toast('success', 'Fee Waived', res.message);
      refreshFees();
      setShowWaiveModal(false);
    } else {
      toast('error', 'Waiver Error', res.message);
    }
  };

  // Handle print receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // Table columns
  const columns: Column<StudentBookUniformFee>[] = [
    {
      key: 'student',
      header: 'Student & Admission',
      render: (row) => (
        <div>
          <p className="font-bold text-xs text-[#172033]">{row.studentName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-mono text-[10px] text-[#3B5BDB] font-semibold">
              {row.admissionNumber}
            </span>
            <span className="text-[#94A3B8] text-[10px]">&bull;</span>
            <span className="text-[10px] text-[#64748B]">
              {row.className} • {row.sectionName}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Fee Category',
      render: (row) => (
        <div>
          <div className="flex items-center gap-1.5">
            {row.category === 'book' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1]">
                <BookOpen size={11} /> Book Fee
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3E8FF] text-[#7E22CE]">
                <Shirt size={11} /> Uniform Fee
              </span>
            )}
            <span className="text-[10px] font-mono text-[#94A3B8]">{row.academicYear}</span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1 max-w-[200px]" title={row.description}>
            {row.description}
          </p>
        </div>
      ),
    },
    {
      key: 'amounts',
      header: 'Total / Received / Balance',
      render: (row) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-[#64748B]">Total:</span>
            <span className="font-bold text-[#172033]">{formatCurrency(row.totalAmount)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-[#16A36A]">Paid:</span>
            <span className="font-semibold text-[#16A36A]">{formatCurrency(row.amountReceived)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[#F1F5F9] pt-0.5">
            <span className="text-[10px] font-semibold text-[#64748B]">Bal:</span>
            <span
              className={`font-bold ${
                row.balanceAmount > 0 ? 'text-[#E03131]' : 'text-[#64748B]'
              }`}
            >
              {formatCurrency(row.balanceAmount)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (row) => (
        <div className="text-xs">
          <p className="font-medium text-[#172033] flex items-center gap-1">
            <Calendar size={12} className="text-[#64748B]" />
            {row.dueDate}
          </p>
          {row.payments.length > 0 && (
            <p className="text-[10px] text-[#3B5BDB] mt-0.5 font-medium">
              {row.payments.length} payment{row.payments.length > 1 ? 's' : ''} recorded
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        switch (row.status) {
          case 'paid':
            return <Badge variant="success">PAID</Badge>;
          case 'partial':
            return <Badge variant="warning">PARTIALLY PAID</Badge>;
          case 'pending':
            return <Badge variant="default">PENDING</Badge>;
          case 'overdue':
            return <Badge variant="error">OVERDUE</Badge>;
          case 'waived':
            return <Badge variant="purple">WAIVED</Badge>;
          default:
            return <Badge variant="default">{row.status}</Badge>;
        }
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status !== 'paid' && row.status !== 'waived' && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs py-1 px-2.5 h-auto text-[#16A36A] border-[#16A36A]/30 hover:bg-[#16A36A]/10 font-bold"
              onClick={() => openPaymentModal(row)}
            >
              <CreditCard size={12} className="mr-1" />
              Pay
            </Button>
          )}

          {row.payments.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs py-1 px-2 h-auto text-[#3B5BDB] hover:bg-[#3B5BDB]/10"
              title="View Receipts"
              onClick={() => {
                const latest = row.payments[row.payments.length - 1];
                setSelectedReceipt({ fee: row, payment: latest });
                setShowReceiptModal(true);
              }}
            >
              <Receipt size={13} className="mr-1" />
              Receipt
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="text-xs py-1 px-2 h-auto text-[#64748B] hover:bg-slate-100"
            title="Payment History"
            onClick={() => {
              setSelectedFee(row);
              setShowHistoryModal(true);
            }}
          >
            <Clock size={13} />
          </Button>

          {row.status !== 'paid' && row.status !== 'waived' && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs py-1 px-2 h-auto text-[#7E22CE] hover:bg-purple-50"
              title="Waive Fee"
              onClick={() => {
                setSelectedFee(row);
                setWaiveReason('');
                setShowWaiveModal(true);
              }}
            >
              <ShieldAlert size={13} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DBE4FF] text-[#3B5BDB]">
              Financial Governance
            </span>
            <span className="text-xs font-mono text-[#64748B]">AVK CBSE • 1930319</span>
          </div>
          <h1 className="text-xl font-bold text-[#172033]">
            Books & Uniform Fee Management
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Configure textbooks, workbooks, regular uniforms, shoes, and sports kits collections with multi-installment tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            className="text-xs font-semibold"
            onClick={() => setShowCatalogModal(true)}
          >
            <Layers size={14} className="mr-1.5" />
            Pricing Catalog
          </Button>

          <Button
            className="bg-[#3B5BDB] hover:bg-[#2B4BC9] text-white text-xs font-bold shadow-sm"
            onClick={() => {
              setAssignMode('individual');
              setAssignCategory('book');
              setAssignStudentId(initialStudents[0]?.id || '');
              setSelectedCatalogItemIds(['cat-bk-1', 'cat-bk-2', 'cat-bk-3', 'cat-bk-4']);
              setCustomAmount('');
              setShowAssignModal(true);
            }}
          >
            <Plus size={14} className="mr-1.5" />
            Assign Fees (Single / Bulk)
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Book Fees</span>
            <BookOpen size={14} className="text-[#0369A1]" />
          </div>
          <p className="text-lg font-bold text-[#172033]">{formatCurrency(stats.totalBookAssigned)}</p>
          <p className="text-[10px] text-[#64748B] mt-0.5">Assigned Academic</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Uniform Fees</span>
            <Shirt size={14} className="text-[#7E22CE]" />
          </div>
          <p className="text-lg font-bold text-[#172033]">{formatCurrency(stats.totalUniformAssigned)}</p>
          <p className="text-[10px] text-[#64748B] mt-0.5">Assigned Apparel</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#16A36A] text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Total Collected</span>
            <CheckCircle2 size={14} />
          </div>
          <p className="text-lg font-bold text-[#16A36A]">{formatCurrency(stats.totalCollected)}</p>
          <p className="text-[10px] text-[#64748B] mt-0.5">Cleared Payments</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#E03131] text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Pending Balance</span>
            <AlertCircle size={14} />
          </div>
          <p className="text-lg font-bold text-[#E03131]">{formatCurrency(stats.totalPending)}</p>
          <p className="text-[10px] text-[#64748B] mt-0.5">Outstanding Invoices</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#D97706] text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Partially Paid</span>
            <Clock size={14} />
          </div>
          <p className="text-lg font-bold text-[#D97706]">{stats.partialCount} Records</p>
          <p className="text-[10px] text-[#64748B] mt-0.5">Installments Active</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#E03131] text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Overdue Fees</span>
            <ShieldAlert size={14} />
          </div>
          <p className="text-lg font-bold text-[#E03131]">{stats.overdueCount} Records</p>
          <p className="text-[10px] text-[#64748B] mt-0.5">Due Date Elapsed</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, admission number, or package..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="text-xs bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-2 font-medium text-[#172033]"
            >
              <option value="all">All Fee Categories</option>
              <option value="book">Books & Materials Fee</option>
              <option value="uniform">Uniforms & Shoes Fee</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-2 font-medium text-[#172033]"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="partial">Partially Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="waived">Waived</option>
            </select>

            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="text-xs bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-2 font-medium text-[#172033]"
            >
              <option value="all">All Classes</option>
              <option value="Class 5">Class 5 (All)</option>
              <option value="Class 5-A">Class 5-A</option>
              <option value="Class 5-B">Class 5-B</option>
              <option value="Class 6">Class 6 (All)</option>
              <option value="Class 6-A">Class 6-A</option>
            </select>

            {/* Academic Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="text-xs bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-2 font-medium text-[#172033]"
            >
              <option value="2026-2027">AY 2026-2027</option>
              <option value="2025-2026">AY 2025-2026</option>
            </select>

            {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' || classFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#E03131] hover:bg-red-50"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setClassFilter('all');
                }}
              >
                <X size={13} className="mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredFees}
        emptyMessage="No book or uniform fee assignments match your filter criteria."
      />

      {/* MODAL 1: Assign Fee (Individual or Bulk) */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Books / Uniform Fee"
        description="Allocate fee records individually or in bulk for an entire class section."
        size="lg"
      >
        <form onSubmit={handleAssignFeeSubmit} className="space-y-4 text-xs">
          {/* Assignment Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
            <button
              type="button"
              className={`py-2 px-3 rounded-lg font-bold text-center transition-all cursor-pointer ${
                assignMode === 'individual'
                  ? 'bg-white text-[#3B5BDB] shadow-xs'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
              onClick={() => setAssignMode('individual')}
            >
              Individual Student
            </button>
            <button
              type="button"
              className={`py-2 px-3 rounded-lg font-bold text-center transition-all cursor-pointer ${
                assignMode === 'bulk'
                  ? 'bg-white text-[#3B5BDB] shadow-xs'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
              onClick={() => setAssignMode('bulk')}
            >
              Bulk Class / Section
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#172033] mb-1">Academic Year</label>
              <select
                value={assignAcademicYear}
                onChange={(e) => setAssignAcademicYear(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2 font-medium"
              >
                <option value="2026-2027">2026-2027 (Current Active)</option>
                <option value="2027-2028">2027-2028</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#172033] mb-1">Fee Category</label>
              <select
                value={assignCategory}
                onChange={(e) => {
                  const cat = e.target.value as FeeCategory;
                  setAssignCategory(cat);
                  // Update default selected catalog items
                  if (cat === 'book') {
                    setSelectedCatalogItemIds(['cat-bk-1', 'cat-bk-2', 'cat-bk-3', 'cat-bk-4']);
                  } else {
                    setSelectedCatalogItemIds(['cat-un-1', 'cat-un-2', 'cat-un-3', 'cat-un-4', 'cat-un-5']);
                  }
                }}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2 font-medium"
              >
                <option value="book">Book Fee (Textbooks, Workbooks, Notebooks)</option>
                <option value="uniform">Uniform Fee (Regular, Sports, Shoes, Belt & Tie)</option>
              </select>
            </div>
          </div>

          {/* Student selection or Class selection */}
          {assignMode === 'individual' ? (
            <div>
              <label className="block font-semibold text-[#172033] mb-1">Select Student</label>
              <select
                value={assignStudentId}
                onChange={(e) => setAssignStudentId(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2 font-medium"
                required
              >
                <option value="">-- Choose student from directory --</option>
                {initialStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} {s.last_name} ({s.admission_number}) - {s.class_name} {s.section_name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#172033] mb-1">Target Class</label>
                <select
                  value={assignClass}
                  onChange={(e) => setAssignClass(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2 font-medium"
                >
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#172033] mb-1">Section</label>
                <select
                  value={assignSection}
                  onChange={(e) => setAssignSection(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2 font-medium"
                >
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                </select>
              </div>
            </div>
          )}

          {/* Package Items Selection */}
          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] space-y-2">
            <p className="font-bold text-[#172033] text-[11px] uppercase tracking-wider">
              {assignCategory === 'book' ? 'Textbook & Notebook Package' : 'Uniform & Accessories Items'}
            </p>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {availableCatalogItems.map((item) => {
                const isSelected = selectedCatalogItemIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-white border-[#3B5BDB] shadow-2xs'
                        : 'bg-white/50 border-[#E2E8F0] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCatalogItemIds([...selectedCatalogItemIds, item.id]);
                          } else {
                            setSelectedCatalogItemIds(
                              selectedCatalogItemIds.filter((id) => id !== item.id)
                            );
                          }
                        }}
                        className="rounded text-[#3B5BDB]"
                      />
                      <div>
                        <p className="font-semibold text-[#172033]">{item.name}</p>
                        <p className="text-[10px] text-[#64748B]">{item.description}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#172033] font-mono">
                      {formatCurrency(item.defaultAmount)}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
              <span className="font-bold text-[#64748B]">Computed Package Total:</span>
              <span className="text-sm font-black text-[#172033]">
                {formatCurrency(computedCatalogTotal)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#172033] mb-1">
                Custom Total Amount (₹) <span className="text-[10px] text-[#94A3B8]">(Optional override)</span>
              </label>
              <Input
                type="number"
                placeholder={`Leave blank to use ₹${computedCatalogTotal}`}
                value={customAmount}
                onChange={(e) =>
                  setCustomAmount(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172033] mb-1">Payment Due Date</label>
              <Input
                type="date"
                value={assignDueDate}
                onChange={(e) => setAssignDueDate(e.target.value)}
                required
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#172033] mb-1">Administrative Remarks</label>
            <Input
              placeholder="e.g. Approved CBSE Book kit for session 2026-27"
              value={assignRemarks}
              onChange={(e) => setAssignRemarks(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAssignModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#3B5BDB] hover:bg-[#2B4BC9] text-white font-bold"
            >
              Assign Fee Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Record Payment Received */}
      <Modal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        title="Record Payment Received"
        description="Submit fee collection and generate official AVK receipt voucher."
        size="md"
      >
        {selectedFee && (
          <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
            {/* Fee Context Summary */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#172033] text-sm">{selectedFee.studentName}</span>
                <span className="font-mono text-[10px] text-[#3B5BDB] font-semibold">
                  {selectedFee.admissionNumber}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                {selectedFee.className} • {selectedFee.sectionName} • {selectedFee.category === 'book' ? 'Book Fee' : 'Uniform Fee'}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0] text-center">
                <div>
                  <p className="text-[10px] text-[#64748B]">Total Fee</p>
                  <p className="font-bold text-[#172033]">{formatCurrency(selectedFee.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#16A36A]">Paid So Far</p>
                  <p className="font-bold text-[#16A36A]">{formatCurrency(selectedFee.amountReceived)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#E03131]">Pending Balance</p>
                  <p className="font-bold text-[#E03131]">{formatCurrency(selectedFee.balanceAmount)}</p>
                </div>
              </div>
            </div>

            {/* Payment Input Fields */}
            <div>
              <label className="block font-semibold text-[#172033] mb-1">
                Amount Received (₹) <span className="text-[#E03131]">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                max={selectedFee.balanceAmount}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder="Enter collected amount"
                className="text-sm font-bold"
                required
              />
              {payAmount && !isNaN(Number(payAmount)) && (
                <p className="text-[10px] text-[#64748B] mt-1">
                  New Remaining Balance will be:{' '}
                  <strong className="text-[#172033]">
                    {formatCurrency(Math.max(0, selectedFee.balanceAmount - Number(payAmount)))}
                  </strong>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#172033] mb-1">Payment Mode</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value as PaymentMode)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2 font-medium"
                >
                  <option value="UPI">UPI / QR (GPay, PhonePe, Paytm)</option>
                  <option value="Cash">Cash at School Counter</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                  <option value="Online">Online Parent Portal</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#172033] mb-1">Receipt Number</label>
                <Input
                  value={payReceiptNo}
                  onChange={(e) => setPayReceiptNo(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#172033] mb-1">
                Transaction Reference / UTR Number
              </label>
              <Input
                placeholder="e.g. UPI/630982145890/AVK or Cheque #9801"
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172033] mb-1">Payment Remarks</label>
              <Input
                placeholder="e.g. Term 1 books fee cleared"
                value={payRemarks}
                onChange={(e) => setPayRemarks(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPayModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#16A36A] hover:bg-[#138A5A] text-white font-bold"
              >
                <CheckCircle2 size={14} className="mr-1.5" />
                Confirm Payment & Generate Receipt
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 3: Official AVK Receipt Preview & Print */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title="Official Fee Receipt Voucher"
        description="AVK International Residential Senior Secondary School official receipt record."
        size="lg"
      >
        {selectedReceipt && (
          <div className="space-y-4 text-xs">
            {/* Printable Receipt Canvas */}
            <div
              id="printable-receipt"
              className="bg-white border-2 border-[#172554] rounded-2xl p-6 shadow-sm space-y-4 print:p-0 print:border-none"
            >
              {/* Receipt Header */}
              <div className="text-center border-b-2 border-[#172554]/20 pb-4">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <img
                      src="/avk-logo.svg"
                      alt="AVK Emblem"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[#172554] tracking-tight uppercase">
                      AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL
                    </h2>
                    <p className="text-[11px] font-bold text-amber-700">
                      Affiliated to CBSE New-Delhi &bull; Affiliation No: 1930319
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-[#64748B]">
                  Sankarankovil Main Road, Tenkasi District, Tamil Nadu &bull; Phone: +91 4636 222333
                </p>
                <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#172554] text-white font-bold text-[10px] uppercase tracking-wider">
                  Official Payment Receipt Voucher
                </div>
              </div>

              {/* Receipt Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                <div>
                  <p className="text-[10px] text-[#64748B]">Receipt Number</p>
                  <p className="font-mono font-bold text-[#172033]">{selectedReceipt.payment.receiptNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#64748B]">Payment Date</p>
                  <p className="font-semibold text-[#172033]">{selectedReceipt.payment.paymentDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#64748B]">Payment Mode</p>
                  <p className="font-semibold text-[#172033]">{selectedReceipt.payment.paymentMode}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#64748B]">Academic Year</p>
                  <p className="font-semibold text-[#172033]">{selectedReceipt.fee.academicYear}</p>
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-[#E2E8F0]">
                <div>
                  <p className="text-[10px] text-[#64748B]">Student Full Name</p>
                  <p className="font-bold text-sm text-[#172033]">{selectedReceipt.fee.studentName}</p>
                  <p className="text-[11px] text-[#64748B]">
                    Class & Section: <strong className="text-[#172033]">{selectedReceipt.fee.className} • {selectedReceipt.fee.sectionName}</strong>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#64748B]">Admission Number</p>
                  <p className="font-mono font-bold text-sm text-[#3B5BDB]">{selectedReceipt.fee.admissionNumber}</p>
                  {selectedReceipt.payment.transactionReference && (
                    <p className="text-[10px] text-[#64748B] font-mono mt-0.5">
                      Ref: {selectedReceipt.payment.transactionReference}
                    </p>
                  )}
                </div>
              </div>

              {/* Line Item Table */}
              <table className="w-full text-left border-collapse border border-[#E2E8F0] rounded-xl overflow-hidden">
                <thead className="bg-[#F1F5F9] text-[10px] font-bold uppercase text-[#64748B]">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-center">Category</th>
                    <th className="p-2.5 text-right">Fee Assessed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  <tr>
                    <td className="p-2.5">
                      <p className="font-bold text-[#172033]">{selectedReceipt.fee.description}</p>
                      <p className="text-[10px] text-[#64748B]">
                        {selectedReceipt.fee.items.map((i) => i.name).join(', ')}
                      </p>
                    </td>
                    <td className="p-2.5 text-center uppercase font-bold text-[10px] text-[#3B5BDB]">
                      {selectedReceipt.fee.category === 'book' ? 'Book Fee' : 'Uniform Fee'}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#172033]">
                      {formatCurrency(selectedReceipt.fee.totalAmount)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-[#F8FAFC] border-t-2 border-[#E2E8F0]">
                  <tr>
                    <td colSpan={2} className="p-2.5 text-right font-bold text-[#172033]">
                      Amount Received this Installment:
                    </td>
                    <td className="p-2.5 text-right font-mono font-extrabold text-[#16A36A] text-sm">
                      {formatCurrency(selectedReceipt.payment.amount)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="p-2.5 text-right font-semibold text-[#64748B]">
                      Remaining Balance Due:
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#E03131]">
                      {formatCurrency(selectedReceipt.fee.balanceAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Signatures */}
              <div className="flex items-end justify-between pt-6 border-t border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B]">
                  <p>Recorded By: {selectedReceipt.payment.recordedBy || 'Accounts Department'}</p>
                  <p className="font-mono mt-0.5">System Voucher ID: {selectedReceipt.payment.id}</p>
                </div>
                <div className="text-right">
                  <div className="w-32 border-b border-[#172033] mb-1" />
                  <p className="text-[10px] font-bold text-[#172033] uppercase">Authorized Signatory</p>
                  <p className="text-[9px] text-[#64748B]">AVK Accounts Section</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setShowReceiptModal(false)}
              >
                Close Preview
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  className="bg-[#3B5BDB] hover:bg-[#2B4BC9] text-white font-bold"
                  onClick={handlePrintReceipt}
                >
                  <Printer size={14} className="mr-1.5" />
                  Print Receipt
                </Button>
                <Button
                  variant="outline"
                  className="text-xs font-semibold"
                  onClick={() => {
                    toast(
                      'success',
                      'Receipt Downloaded',
                      `Official PDF receipt for ${selectedReceipt.payment.receiptNumber} saved to downloads.`
                    );
                  }}
                >
                  <Download size={14} className="mr-1.5" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 4: Payment History Details */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Payment & Installment History"
        description="Comprehensive audit log of all receipts issued for this fee."
        size="md"
      >
        {selectedFee && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
              <p className="font-bold text-sm text-[#172033]">{selectedFee.studentName}</p>
              <p className="text-[11px] text-[#64748B]">
                {selectedFee.admissionNumber} &bull; {selectedFee.description}
              </p>
            </div>

            {selectedFee.payments.length > 0 ? (
              <div className="space-y-2">
                {selectedFee.payments.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#3B5BDB]">{p.receiptNumber}</span>
                        <Badge variant="success">{p.paymentMode}</Badge>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Date: {p.paymentDate} &bull; Recorded by: {p.recordedBy}
                      </p>
                      {p.transactionReference && (
                        <p className="text-[10px] font-mono text-[#94A3B8]">Ref: {p.transactionReference}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-[#16A36A]">{formatCurrency(p.amount)}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[10px] py-0.5 px-1.5 h-auto text-[#3B5BDB] mt-1"
                        onClick={() => {
                          setSelectedReceipt({ fee: selectedFee, payment: p });
                          setShowReceiptModal(true);
                        }}
                      >
                        <Eye size={11} className="mr-1" /> View Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[#64748B]">
                <Clock size={28} className="mx-auto text-[#94A3B8] mb-2 opacity-50" />
                <p className="font-semibold">No payments recorded yet.</p>
                <p className="text-[11px]">Invoice is currently pending collection.</p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-[#E2E8F0]">
              <Button variant="outline" onClick={() => setShowHistoryModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 5: Standard Fee Catalog Reference */}
      <Modal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
        title="Standard Fee Pricing Catalog"
        description="Official textbook packages and uniform components approved for AVK Academic Session 2026-2027."
        size="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Book Catalog */}
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
              <h3 className="font-bold text-sm text-[#0369A1] flex items-center gap-2">
                <BookOpen size={16} /> Prescribed Academic Book Items
              </h3>
              <div className="space-y-2">
                {standardFeeCatalog
                  .filter((c) => c.category === 'book')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-white rounded-lg border border-[#E2E8F0] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-[#172033]">{item.name}</p>
                        <p className="text-[10px] text-[#64748B]">{item.description}</p>
                        <span className="text-[9px] font-semibold text-[#0369A1]">
                          Applies to: {item.applicableClass}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-[#172033]">
                        {formatCurrency(item.defaultAmount)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Uniform Catalog */}
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
              <h3 className="font-bold text-sm text-[#7E22CE] flex items-center gap-2">
                <Shirt size={16} /> Official Uniform & Kit Items
              </h3>
              <div className="space-y-2">
                {standardFeeCatalog
                  .filter((c) => c.category === 'uniform')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-white rounded-lg border border-[#E2E8F0] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-[#172033]">{item.name}</p>
                        <p className="text-[10px] text-[#64748B]">{item.description}</p>
                        <span className="text-[9px] font-semibold text-[#7E22CE]">
                          Applies to: {item.applicableClass}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-[#172033]">
                        {formatCurrency(item.defaultAmount)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#E2E8F0]">
            <Button variant="outline" onClick={() => setShowCatalogModal(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 6: Waive Fee Modal */}
      <Modal
        isOpen={showWaiveModal}
        onClose={() => setShowWaiveModal(false)}
        title="Official Fee Waiver"
        description="Waive outstanding fee under principal scholarship or management sanction."
        size="md"
      >
        {selectedFee && (
          <form onSubmit={handleWaiveFeeSubmit} className="space-y-4 text-xs">
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-900 space-y-1">
              <p className="font-bold text-sm">{selectedFee.studentName}</p>
              <p className="text-xs">
                Admission No: {selectedFee.admissionNumber} &bull; Outstanding Balance:{' '}
                <strong>{formatCurrency(selectedFee.balanceAmount)}</strong>
              </p>
              <p className="text-[11px] text-amber-800 mt-1">
                Waiving this fee sets the remaining balance to zero and marks the status as officially Waived. This action is irreversible without administrator re-assignment.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#172033] mb-1">
                Official Sanction / Waiver Reason <span className="text-[#E03131]">*</span>
              </label>
              <Input
                placeholder="e.g. Sanctioned by Principal Ref #AVK/SCHOL/2026/08"
                value={waiveReason}
                onChange={(e) => setWaiveReason(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowWaiveModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#7E22CE] hover:bg-[#6B21A8] text-white font-bold"
              >
                Confirm Official Waiver
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
