// Book & Uniform Fee Management Data Service for Parent App
// AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL
// Affiliated to CBSE New-Delhi • 1930319

export type FeeCategory = 'book' | 'uniform';
export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'overdue' | 'waived';
export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Online';

export interface FeeItemDetail {
  name: string;
  amount: number;
}

export interface FeePaymentRecord {
  id: string;
  receiptNumber: string;
  paymentDate: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionReference?: string;
  remarks?: string;
  recordedBy?: string;
}

export interface StudentBookUniformFee {
  id: string;
  academicYear: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  sectionName: string;
  category: FeeCategory;
  description: string;
  items: FeeItemDetail[];
  totalAmount: number;
  amountReceived: number;
  balanceAmount: number;
  dueDate: string;
  status: PaymentStatus;
  remarks?: string;
  waivedReason?: string;
  payments: FeePaymentRecord[];
}

export const mockBookUniformFees: StudentBookUniformFee[] = [
  // 1. Aarav Krishnan (Class 5-A, ADM2026-0501)
  {
    id: 'buf-01',
    academicYear: '2026-2027',
    studentId: '88888888-0001-8888-8888-888888888888',
    studentName: 'Aarav Krishnan',
    admissionNumber: 'ADM2026-0501',
    className: 'Class 5',
    sectionName: 'Section A',
    category: 'book',
    description: 'Class 5 Academic Books, Workbooks & Stationery Kit',
    items: [
      { name: 'CBSE Textbooks Set (5 subjects)', amount: 2200 },
      { name: 'Notebooks Package (12 nos)', amount: 950 },
      { name: 'Workbooks & Activity Sheets', amount: 850 },
      { name: 'Study Materials & Lab Manual', amount: 500 },
    ],
    totalAmount: 4500,
    amountReceived: 4500,
    balanceAmount: 0,
    dueDate: '2026-10-31',
    status: 'paid',
    remarks: 'Full annual book fee cleared on admission confirmation',
    payments: [
      {
        id: 'pay-01',
        receiptNumber: 'REC-BKUN-2026-0101',
        paymentDate: '2026-10-15',
        amount: 4500,
        paymentMode: 'UPI',
        transactionReference: 'UPI/630982145890/AVK',
        remarks: 'Paid via GPay by Ramesh Krishnan',
        recordedBy: 'M. Sangeetha (Cashier)',
      },
    ],
  },
  {
    id: 'buf-02',
    academicYear: '2026-2027',
    studentId: '88888888-0001-8888-8888-888888888888',
    studentName: 'Aarav Krishnan',
    admissionNumber: 'ADM2026-0501',
    className: 'Class 5',
    sectionName: 'Section A',
    category: 'uniform',
    description: 'Class 5 Complete Uniform Kit (Regular, Sports & Shoes)',
    items: [
      { name: 'Regular Uniform (2 Sets)', amount: 2100 },
      { name: 'Sports House Uniform (1 Set)', amount: 850 },
      { name: 'Black Shoes & 2 Pairs Socks', amount: 700 },
      { name: 'School Belt & Tie with Crest', amount: 150 },
    ],
    totalAmount: 3800,
    amountReceived: 2000,
    balanceAmount: 1800,
    dueDate: '2026-11-30',
    status: 'partial',
    remarks: 'First installment received. Second installment due before 30 Nov.',
    payments: [
      {
        id: 'pay-02',
        receiptNumber: 'REC-BKUN-2026-0102',
        paymentDate: '2026-10-20',
        amount: 2000,
        paymentMode: 'Cash',
        remarks: 'Cash counter deposit - Advance payment',
        recordedBy: 'M. Sangeetha (Cashier)',
      },
    ],
  },

  // 2. Diya Krishnan (Class 5-B, ADM2026-0502)
  {
    id: 'buf-03',
    academicYear: '2026-2027',
    studentId: '88888888-0002-8888-8888-888888888888',
    studentName: 'Diya Krishnan',
    admissionNumber: 'ADM2026-0502',
    className: 'Class 5',
    sectionName: 'Section B',
    category: 'book',
    description: 'Class 5 Academic Books, Workbooks & Stationery Kit',
    items: [
      { name: 'CBSE Textbooks Set (5 subjects)', amount: 2200 },
      { name: 'Notebooks Package (12 nos)', amount: 950 },
      { name: 'Workbooks & Activity Sheets', amount: 850 },
      { name: 'Study Materials & Lab Manual', amount: 500 },
    ],
    totalAmount: 4500,
    amountReceived: 0,
    balanceAmount: 4500,
    dueDate: '2026-11-25',
    status: 'pending',
    remarks: 'Invoice generated. Pending parent payment.',
    payments: [],
  },
  {
    id: 'buf-04',
    academicYear: '2026-2027',
    studentId: '88888888-0002-8888-8888-888888888888',
    studentName: 'Diya Krishnan',
    admissionNumber: 'ADM2026-0502',
    className: 'Class 5',
    sectionName: 'Section B',
    category: 'uniform',
    description: 'Class 5 Complete Uniform Kit (Regular, Sports & Shoes)',
    items: [
      { name: 'Regular Uniform (2 Sets)', amount: 2100 },
      { name: 'Sports House Uniform (1 Set)', amount: 850 },
      { name: 'Black Shoes & 2 Pairs Socks', amount: 700 },
      { name: 'School Belt & Tie with Crest', amount: 150 },
    ],
    totalAmount: 3800,
    amountReceived: 3800,
    balanceAmount: 0,
    dueDate: '2026-10-31',
    status: 'paid',
    remarks: 'Full uniform fee cleared via Net Banking transfer',
    payments: [
      {
        id: 'pay-03',
        receiptNumber: 'REC-BKUN-2026-0103',
        paymentDate: '2026-10-18',
        amount: 3800,
        paymentMode: 'Bank Transfer',
        transactionReference: 'NEFT/HDFC/994821034',
        remarks: 'Direct transfer to AVK School Account',
        recordedBy: 'K. Rajendran (Accountant)',
      },
    ],
  },
];

export function getParentBookUniformFees(studentId?: string): {
  bookFee?: StudentBookUniformFee;
  uniformFee?: StudentBookUniformFee;
  allFees: StudentBookUniformFee[];
  totalAssigned: number;
  totalReceived: number;
  totalPending: number;
} {
  if (!studentId) {
    return { allFees: [], totalAssigned: 0, totalReceived: 0, totalPending: 0 };
  }

  const fees = mockBookUniformFees.filter(
    (f) =>
      f.studentId === studentId ||
      f.admissionNumber.toLowerCase() === studentId.toLowerCase()
  );

  const bookFee = fees.find((f) => f.category === 'book');
  const uniformFee = fees.find((f) => f.category === 'uniform');

  const totalAssigned = (bookFee?.totalAmount || 0) + (uniformFee?.totalAmount || 0);
  const totalReceived = (bookFee?.amountReceived || 0) + (uniformFee?.amountReceived || 0);
  const totalPending = (bookFee?.balanceAmount || 0) + (uniformFee?.balanceAmount || 0);

  return {
    bookFee,
    uniformFee,
    allFees: fees,
    totalAssigned,
    totalReceived,
    totalPending,
  };
}
