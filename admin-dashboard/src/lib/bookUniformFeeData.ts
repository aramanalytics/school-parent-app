// Book & Uniform Fee Management Data Service
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
  paymentDate: string; // YYYY-MM-DD
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

export interface FeeCatalogItem {
  id: string;
  category: FeeCategory;
  name: string;
  description: string;
  defaultAmount: number;
  applicableClass: string;
}

// Standard Fee Catalog Templates
export const standardFeeCatalog: FeeCatalogItem[] = [
  // Book Category Items
  { id: 'cat-bk-1', category: 'book', name: 'CBSE Textbooks Set', description: 'Prescribed NCERT & CBSE textbooks', defaultAmount: 2200, applicableClass: 'Class 5' },
  { id: 'cat-bk-2', category: 'book', name: 'Notebooks Package (12 nos)', description: 'Long size 192 pgs ruling notebooks', defaultAmount: 950, applicableClass: 'Class 5' },
  { id: 'cat-bk-3', category: 'book', name: 'Workbooks & Activity Sheets', description: 'Mathematics, Science & English workbooks', defaultAmount: 850, applicableClass: 'Class 5' },
  { id: 'cat-bk-4', category: 'book', name: 'Study Materials & Digital Lab Book', description: 'Science lab manual, Computer study material', defaultAmount: 500, applicableClass: 'Class 5' },

  { id: 'cat-bk-5', category: 'book', name: 'CBSE Textbooks Set (Class 6)', description: 'NCERT textbooks for Secondary level', defaultAmount: 2600, applicableClass: 'Class 6' },
  { id: 'cat-bk-6', category: 'book', name: 'Notebooks Package (14 nos)', description: 'Long size deluxe ruling notebooks', defaultAmount: 1100, applicableClass: 'Class 6' },
  { id: 'cat-bk-7', category: 'book', name: 'Workbooks & Lab Manuals', description: 'Science, Maths & Language workbooks', defaultAmount: 900, applicableClass: 'Class 6' },
  { id: 'cat-bk-8', category: 'book', name: 'Supplementary Academic Guides', description: 'Reference guides & English literature', defaultAmount: 600, applicableClass: 'Class 6' },

  // Uniform Category Items
  { id: 'cat-un-1', category: 'uniform', name: 'Regular Uniform (2 Sets)', description: 'Shirt, Trousers/Skirt, Badge & Monogram', defaultAmount: 2100, applicableClass: 'All' },
  { id: 'cat-un-2', category: 'uniform', name: 'Sports House Uniform (1 Set)', description: 'House T-shirt and track pants', defaultAmount: 850, applicableClass: 'All' },
  { id: 'cat-un-3', category: 'uniform', name: 'School Leather Shoes (1 Pair)', description: 'Black formal leather shoes with buckle/lace', defaultAmount: 550, applicableClass: 'All' },
  { id: 'cat-un-4', category: 'uniform', name: 'Socks (2 Pairs) & House Socks', description: 'AVK customized navy & white socks', defaultAmount: 150, applicableClass: 'All' },
  { id: 'cat-un-5', category: 'uniform', name: 'Accessories Kit (Belt & Tie)', description: 'School crest woven belt and clip-on/regular tie', defaultAmount: 150, applicableClass: 'All' },
];

// Initial mock records initialized in-memory
let bookUniformFees: StudentBookUniformFee[] = [
  // 1. Aarav Krishnan (Class 5-A, ADM2026-0501) - Ramesh Krishnan's son
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

  // 2. Diya Krishnan (Class 5-B, ADM2026-0502) - Ramesh Krishnan's daughter
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

  // 3. Karthik Senthil (Class 5-A, ADM2026-0503)
  {
    id: 'buf-05',
    academicYear: '2026-2027',
    studentId: '88888888-0003-8888-8888-888888888888',
    studentName: 'Karthik Senthil',
    admissionNumber: 'ADM2026-0503',
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
    amountReceived: 0,
    balanceAmount: 4500,
    dueDate: '2026-10-31',
    status: 'overdue',
    remarks: 'Reminder sent to parent on 05 Nov 2026',
    payments: [],
  },
  {
    id: 'buf-06',
    academicYear: '2026-2027',
    studentId: '88888888-0003-8888-8888-888888888888',
    studentName: 'Karthik Senthil',
    admissionNumber: 'ADM2026-0503',
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
    amountReceived: 0,
    balanceAmount: 0,
    dueDate: '2026-10-31',
    status: 'waived',
    remarks: 'Approved under AVK Meritorious Welfare Scheme by Principal',
    waivedReason: 'Official Principal Sanction Ref #AVK/SCHOL/2026/04',
    payments: [],
  },

  // 4. Sneha Murugan (Class 6-A, ADM2026-0601)
  {
    id: 'buf-07',
    academicYear: '2026-2027',
    studentId: '88888888-0004-8888-8888-888888888888',
    studentName: 'Sneha Murugan',
    admissionNumber: 'ADM2026-0601',
    className: 'Class 6',
    sectionName: 'Section A',
    category: 'book',
    description: 'Class 6 Secondary Academic Textbooks & Workbooks',
    items: [
      { name: 'CBSE Textbooks Set (Class 6)', amount: 2600 },
      { name: 'Notebooks Package (14 nos)', amount: 1100 },
      { name: 'Workbooks & Lab Manuals', amount: 900 },
      { name: 'Supplementary Academic Guides', amount: 600 },
    ],
    totalAmount: 5200,
    amountReceived: 3000,
    balanceAmount: 2200,
    dueDate: '2026-11-30',
    status: 'partial',
    remarks: 'Part payment done via PhonePe',
    payments: [
      {
        id: 'pay-04',
        receiptNumber: 'REC-BKUN-2026-0104',
        paymentDate: '2026-10-25',
        amount: 3000,
        paymentMode: 'UPI',
        transactionReference: 'UPI/631189400231/AVK',
        remarks: 'Installment 1',
        recordedBy: 'M. Sangeetha (Cashier)',
      },
    ],
  },
  {
    id: 'buf-08',
    academicYear: '2026-2027',
    studentId: '88888888-0004-8888-8888-888888888888',
    studentName: 'Sneha Murugan',
    admissionNumber: 'ADM2026-0601',
    className: 'Class 6',
    sectionName: 'Section A',
    category: 'uniform',
    description: 'Class 6 Senior Uniform Set, Blazer & Sports Kit',
    items: [
      { name: 'Regular Uniform (2 Sets)', amount: 2200 },
      { name: 'Sports House Uniform (1 Set)', amount: 900 },
      { name: 'Leather Shoes & Socks', amount: 800 },
      { name: 'Belt, Tie & ID Lanyard', amount: 200 },
    ],
    totalAmount: 4100,
    amountReceived: 4100,
    balanceAmount: 0,
    dueDate: '2026-10-31',
    status: 'paid',
    remarks: 'Full payment received at counter',
    payments: [
      {
        id: 'pay-05',
        receiptNumber: 'REC-BKUN-2026-0105',
        paymentDate: '2026-10-12',
        amount: 4100,
        paymentMode: 'Cash',
        remarks: 'Payment at cash counter',
        recordedBy: 'K. Rajendran (Accountant)',
      },
    ],
  },

  // 5. Varun Chakravarthy (Class 6-A, ADM2026-0602)
  {
    id: 'buf-09',
    academicYear: '2026-2027',
    studentId: '88888888-0005-8888-8888-888888888888',
    studentName: 'Varun Chakravarthy',
    admissionNumber: 'ADM2026-0602',
    className: 'Class 6',
    sectionName: 'Section A',
    category: 'book',
    description: 'Class 6 Secondary Academic Textbooks & Workbooks',
    items: [
      { name: 'CBSE Textbooks Set (Class 6)', amount: 2600 },
      { name: 'Notebooks Package (14 nos)', amount: 1100 },
      { name: 'Workbooks & Lab Manuals', amount: 900 },
      { name: 'Supplementary Academic Guides', amount: 600 },
    ],
    totalAmount: 5200,
    amountReceived: 5200,
    balanceAmount: 0,
    dueDate: '2026-10-31',
    status: 'paid',
    remarks: 'Annual fee paid online',
    payments: [
      {
        id: 'pay-06',
        receiptNumber: 'REC-BKUN-2026-0106',
        paymentDate: '2026-10-14',
        amount: 5200,
        paymentMode: 'Online',
        transactionReference: 'PG/RAZOR/89201948',
        remarks: 'School Parent App Portal Payment',
        recordedBy: 'System Gateway',
      },
    ],
  },
  {
    id: 'buf-10',
    academicYear: '2026-2027',
    studentId: '88888888-0005-8888-8888-888888888888',
    studentName: 'Varun Chakravarthy',
    admissionNumber: 'ADM2026-0602',
    className: 'Class 6',
    sectionName: 'Section A',
    category: 'uniform',
    description: 'Class 6 Senior Uniform Set, Blazer & Sports Kit',
    items: [
      { name: 'Regular Uniform (2 Sets)', amount: 2200 },
      { name: 'Sports House Uniform (1 Set)', amount: 900 },
      { name: 'Leather Shoes & Socks', amount: 800 },
      { name: 'Belt, Tie & ID Lanyard', amount: 200 },
    ],
    totalAmount: 4100,
    amountReceived: 0,
    balanceAmount: 4100,
    dueDate: '2026-11-28',
    status: 'pending',
    remarks: 'Awaiting parent confirmation on uniform sizing',
    payments: [],
  },
];

// Helper methods for Admin Dashboard & Parent App
export function getAllBookUniformFees(): StudentBookUniformFee[] {
  return [...bookUniformFees];
}

export function getStudentBookUniformFees(studentIdOrAdmNo?: string): {
  bookFee?: StudentBookUniformFee;
  uniformFee?: StudentBookUniformFee;
  allFees: StudentBookUniformFee[];
  totalAssigned: number;
  totalReceived: number;
  totalPending: number;
} {
  if (!studentIdOrAdmNo) {
    return { allFees: [], totalAssigned: 0, totalReceived: 0, totalPending: 0 };
  }

  const fees = bookUniformFees.filter(
    (f) =>
      f.studentId === studentIdOrAdmNo ||
      f.admissionNumber.toLowerCase() === studentIdOrAdmNo.toLowerCase() ||
      f.studentName.toLowerCase().includes(studentIdOrAdmNo.toLowerCase())
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

export interface AssignFeePayload {
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
  dueDate: string;
  remarks?: string;
}

export function assignBookUniformFee(payload: AssignFeePayload): {
  success: boolean;
  message: string;
  record?: StudentBookUniformFee;
} {
  // Check for duplicate assignment
  const existing = bookUniformFees.find(
    (f) =>
      (f.studentId === payload.studentId || f.admissionNumber === payload.admissionNumber) &&
      f.category === payload.category &&
      f.academicYear === payload.academicYear
  );

  if (existing) {
    return {
      success: false,
      message: `A ${payload.category === 'book' ? 'Book' : 'Uniform'} Fee is already assigned to ${payload.studentName} for academic year ${payload.academicYear}.`,
    };
  }

  const newRecord: StudentBookUniformFee = {
    id: `buf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...payload,
    amountReceived: 0,
    balanceAmount: payload.totalAmount,
    status: 'pending',
    payments: [],
  };

  bookUniformFees = [newRecord, ...bookUniformFees];
  return {
    success: true,
    message: `${payload.category === 'book' ? 'Book' : 'Uniform'} Fee assigned successfully to ${payload.studentName}.`,
    record: newRecord,
  };
}

export function bulkAssignClassFee(
  students: { id: string; name: string; admissionNumber: string; className: string; sectionName: string }[],
  academicYear: string,
  category: FeeCategory,
  description: string,
  items: FeeItemDetail[],
  totalAmount: number,
  dueDate: string,
  remarks?: string
): { assignedCount: number; skippedCount: number; messages: string[] } {
  let assignedCount = 0;
  let skippedCount = 0;
  const messages: string[] = [];

  students.forEach((std) => {
    const res = assignBookUniformFee({
      academicYear,
      studentId: std.id,
      studentName: std.name,
      admissionNumber: std.admissionNumber,
      className: std.className,
      sectionName: std.sectionName,
      category,
      description,
      items,
      totalAmount,
      dueDate,
      remarks,
    });

    if (res.success) {
      assignedCount++;
    } else {
      skippedCount++;
      messages.push(`${std.name}: ${res.message}`);
    }
  });

  return { assignedCount, skippedCount, messages };
}

export interface RecordPaymentPayload {
  feeId: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionReference?: string;
  receiptNumber?: string;
  remarks?: string;
  recordedBy?: string;
}

export function recordFeePayment(payload: RecordPaymentPayload): {
  success: boolean;
  message: string;
  receiptNumber?: string;
  updatedRecord?: StudentBookUniformFee;
} {
  const index = bookUniformFees.findIndex((f) => f.id === payload.feeId);
  if (index === -1) {
    return { success: false, message: 'Fee record not found.' };
  }

  const fee = bookUniformFees[index];

  if (fee.status === 'waived') {
    return { success: false, message: 'Cannot record payment for an officially waived fee.' };
  }

  if (payload.amount <= 0) {
    return { success: false, message: 'Payment amount must be greater than zero.' };
  }

  if (payload.amount > fee.balanceAmount) {
    return {
      success: false,
      message: `Payment amount (₹${payload.amount.toLocaleString()}) cannot exceed remaining balance (₹${fee.balanceAmount.toLocaleString()}).`,
    };
  }

  const receiptNo =
    payload.receiptNumber ||
    `REC-BKUN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newPayment: FeePaymentRecord = {
    id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    receiptNumber: receiptNo,
    paymentDate: new Date().toISOString().split('T')[0],
    amount: payload.amount,
    paymentMode: payload.paymentMode,
    transactionReference: payload.transactionReference,
    remarks: payload.remarks || 'Counter collection',
    recordedBy: payload.recordedBy || 'Authorized School Accountant',
  };

  const newAmountReceived = fee.amountReceived + payload.amount;
  const newBalanceAmount = Math.max(0, fee.totalAmount - newAmountReceived);
  const newStatus: PaymentStatus = newBalanceAmount === 0 ? 'paid' : 'partial';

  const updatedRecord: StudentBookUniformFee = {
    ...fee,
    amountReceived: newAmountReceived,
    balanceAmount: newBalanceAmount,
    status: newStatus,
    payments: [...fee.payments, newPayment],
  };

  bookUniformFees[index] = updatedRecord;

  return {
    success: true,
    message: `Payment of ₹${payload.amount.toLocaleString()} recorded successfully with Receipt #${receiptNo}.`,
    receiptNumber: receiptNo,
    updatedRecord,
  };
}

export function waiveStudentFee(feeId: string, reason: string): { success: boolean; message: string } {
  const index = bookUniformFees.findIndex((f) => f.id === feeId);
  if (index === -1) {
    return { success: false, message: 'Fee record not found.' };
  }

  const fee = bookUniformFees[index];
  if (fee.status === 'paid') {
    return { success: false, message: 'Cannot waive a fee that has already been fully paid.' };
  }

  bookUniformFees[index] = {
    ...fee,
    balanceAmount: 0,
    status: 'waived',
    waivedReason: reason,
  };

  return {
    success: true,
    message: `Fee for ${fee.studentName} has been officially waived.`,
  };
}

export function getFeeSummaryStats() {
  const all = bookUniformFees;

  const totalBookAssigned = all
    .filter((f) => f.category === 'book')
    .reduce((sum, f) => sum + f.totalAmount, 0);

  const totalUniformAssigned = all
    .filter((f) => f.category === 'uniform')
    .reduce((sum, f) => sum + f.totalAmount, 0);

  const totalCollected = all.reduce((sum, f) => sum + f.amountReceived, 0);
  const totalPending = all.reduce((sum, f) => sum + f.balanceAmount, 0);

  const partiallyPaidCount = all.filter((f) => f.status === 'partial').length;
  const overdueCount = all.filter((f) => f.status === 'overdue').length;

  return {
    totalBookAssigned,
    totalUniformAssigned,
    totalCollected,
    totalPending,
    partiallyPaidCount,
    overdueCount,
    totalRecords: all.length,
  };
}
