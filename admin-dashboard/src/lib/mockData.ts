// Initial mock seed state consistent with Supabase seed data
export interface MockStudent {
  id: string;
  admission_number: string;
  roll_number: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  class_name: string;
  section_name: string;
  is_active: boolean;
  parent_name: string;
  parent_phone: string;
  photo_url?: string;
}

export interface MockParent {
  id: string;
  name: string;
  phone: string;
  email: string;
  children: string[];
  relationship: string;
  address: string;
  is_active: boolean;
}

export interface MockTeacher {
  id: string;
  name: string;
  employee_id: string;
  email: string;
  phone: string;
  qualification: string;
  subjects: string[];
  classes: string[];
  is_active: boolean;
}

export interface MockFee {
  id: string;
  student_name: string;
  admission_number: string;
  class_name: string;
  category: string;
  amount: number;
  paid_amount: number;
  due_date: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  receipt_number?: string;
  payment_method?: string;
}

export interface MockAttendanceEntry {
  student_id: string;
  student_name: string;
  roll_number: string;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

export interface MockNotice {
  id: string;
  title: string;
  content: string;
  target_type: 'all' | 'class' | 'section';
  target_class?: string;
  status: 'published' | 'draft';
  published_at: string;
  attachment_name?: string;
}

export interface MockHomework {
  id: string;
  title: string;
  subject: string;
  class_section: string;
  description: string;
  due_date: string;
  assigned_by: string;
}

export interface MockExam {
  id: string;
  name: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  is_published: boolean;
  subjects: {
    subject: string;
    date: string;
    max_marks: number;
    pass_marks: number;
  }[];
}

export interface MockFeedback {
  id: string;
  parent_name: string;
  student_name: string;
  category: 'query' | 'suggestion' | 'complaint' | 'general';
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  response?: string;
  created_at: string;
}

export const initialStudents: MockStudent[] = [
  {
    id: '88888888-0001-8888-8888-888888888888',
    admission_number: 'ADM2026-0501',
    roll_number: '01',
    first_name: 'Aarav',
    last_name: 'Krishnan',
    gender: 'male',
    date_of_birth: '2016-04-12',
    class_name: 'Class 5',
    section_name: 'Section A',
    is_active: true,
    parent_name: 'Ramesh Krishnan',
    parent_phone: '+91 98840 11223',
    photo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&h=150&fit=crop',
  },
  {
    id: '88888888-0002-8888-8888-888888888888',
    admission_number: 'ADM2026-0502',
    roll_number: '02',
    first_name: 'Diya',
    last_name: 'Krishnan',
    gender: 'female',
    date_of_birth: '2018-08-25',
    class_name: 'Class 5',
    section_name: 'Section B',
    is_active: true,
    parent_name: 'Ramesh Krishnan',
    parent_phone: '+91 98840 11223',
    photo_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&h=150&fit=crop',
  },
  {
    id: '88888888-0003-8888-8888-888888888888',
    admission_number: 'ADM2026-0503',
    roll_number: '03',
    first_name: 'Karthik',
    last_name: 'Senthil',
    gender: 'male',
    date_of_birth: '2016-02-18',
    class_name: 'Class 5',
    section_name: 'Section A',
    is_active: true,
    parent_name: 'Anitha Senthil',
    parent_phone: '+91 98840 22334',
    photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop',
  },
  {
    id: '88888888-0004-8888-8888-888888888888',
    admission_number: 'ADM2026-0601',
    roll_number: '01',
    first_name: 'Sneha',
    last_name: 'Murugan',
    gender: 'female',
    date_of_birth: '2015-11-09',
    class_name: 'Class 6',
    section_name: 'Section A',
    is_active: true,
    parent_name: 'Murugan Velu',
    parent_phone: '+91 98840 33445',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  },
  {
    id: '88888888-0005-8888-8888-888888888888',
    admission_number: 'ADM2026-0602',
    roll_number: '02',
    first_name: 'Varun',
    last_name: 'Chakravarthy',
    gender: 'male',
    date_of_birth: '2015-07-22',
    class_name: 'Class 6',
    section_name: 'Section A',
    is_active: true,
    parent_name: 'S. Chakravarthy',
    parent_phone: '+91 98840 44556',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
];

export const initialParents: MockParent[] = [
  {
    id: 'cccccccc-1111-cccc-cccc-cccccccc0001',
    name: 'Ramesh Krishnan',
    phone: '+91 98840 11223',
    email: 'ramesh.krishnan@gmail.com',
    children: ['Aarav Krishnan (Class 5-A)', 'Diya Krishnan (Class 5-B)'],
    relationship: 'Father',
    address: 'Plot 45, Gandhi Nagar, Adyar, Chennai',
    is_active: true,
  },
  {
    id: 'cccccccc-1111-cccc-cccc-cccccccc0002',
    name: 'Anitha Senthil',
    phone: '+91 98840 22334',
    email: 'anitha.s@gmail.com',
    children: ['Karthik Senthil (Class 5-A)'],
    relationship: 'Mother',
    address: 'Flat 3B, Sunshine Apts, Mylapore, Chennai',
    is_active: true,
  },
  {
    id: 'cccccccc-1111-cccc-cccc-cccccccc0003',
    name: 'Murugan Velu',
    phone: '+91 98840 33445',
    email: 'murugan.velu@yahoo.com',
    children: ['Sneha Murugan (Class 6-A)'],
    relationship: 'Father',
    address: '12, West Mada Street, Mylapore, Chennai',
    is_active: true,
  },
];

export const initialTeachers: MockTeacher[] = [
  {
    id: 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0001',
    name: 'M. Saravanan',
    employee_id: 'EMP-0104',
    email: 'saravanan.m@sunriseschool.edu.in',
    phone: '+91 98410 23456',
    qualification: 'M.Sc Mathematics, B.Ed',
    subjects: ['Mathematics', 'Science'],
    classes: ['Class 5-A', 'Class 6-A'],
    is_active: true,
  },
  {
    id: 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0002',
    name: 'K. Malathi',
    employee_id: 'EMP-0108',
    email: 'malathi.k@sunriseschool.edu.in',
    phone: '+91 98410 34567',
    qualification: 'M.A English Literature, M.Ed',
    subjects: ['English', 'Tamil'],
    classes: ['Class 5-A', 'Class 5-B'],
    is_active: true,
  },
  {
    id: 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0003',
    name: 'S. Jayaraman',
    employee_id: 'EMP-0112',
    email: 'jayaraman.s@sunriseschool.edu.in',
    phone: '+91 98410 45678',
    qualification: 'M.Sc Physics, B.Ed',
    subjects: ['Science', 'Computer Science'],
    classes: ['Class 6-A'],
    is_active: true,
  },
];

export const initialFees: MockFee[] = [
  {
    id: 'fee-01',
    student_name: 'Aarav Krishnan',
    admission_number: 'ADM2026-0501',
    class_name: 'Class 5-A',
    category: 'Term 1 Tuition Fee',
    amount: 28000,
    paid_amount: 28000,
    due_date: '2026-11-20',
    status: 'paid',
    receipt_number: 'REC-2026-08912',
    payment_method: 'Online UPI',
  },
  {
    id: 'fee-02',
    student_name: 'Aarav Krishnan',
    admission_number: 'ADM2026-0501',
    class_name: 'Class 5-A',
    category: 'Transport & Activity Fee',
    amount: 12500,
    paid_amount: 0,
    due_date: '2026-12-05',
    status: 'pending',
  },
  {
    id: 'fee-03',
    student_name: 'Diya Krishnan',
    admission_number: 'ADM2026-0502',
    class_name: 'Class 5-B',
    category: 'Term 1 Tuition Fee',
    amount: 28000,
    paid_amount: 15000,
    due_date: '2026-11-20',
    status: 'partial',
    receipt_number: 'REC-2026-08933',
    payment_method: 'Bank Transfer',
  },
  {
    id: 'fee-04',
    student_name: 'Karthik Senthil',
    admission_number: 'ADM2026-0503',
    class_name: 'Class 5-A',
    category: 'Term 1 Tuition Fee',
    amount: 28000,
    paid_amount: 0,
    due_date: '2026-10-31',
    status: 'overdue',
  },
];

export const initialNotices: MockNotice[] = [
  {
    id: 'not-01',
    title: 'Annual Sports Meet 2026 - Registrations Open',
    content: 'We are delighted to announce that our 18th Annual Sports Meet will take place on December 12th, 2026 at the Nehru Stadium. All track and field event selection trials begin next Monday.',
    target_type: 'all',
    status: 'published',
    published_at: '2026-11-04',
    attachment_name: 'Sports_Schedule_2026.pdf',
  },
  {
    id: 'not-02',
    title: 'Class 5 Educational Field Trip to Planetarium',
    content: 'All Class 5 students will be visiting the Birla Planetarium on Friday. Transport and lunch arrangements will be organized by the school. Signed parent consent slips are required by Wednesday.',
    target_type: 'class',
    target_class: 'Class 5',
    status: 'published',
    published_at: '2026-11-05',
    attachment_name: 'Consent_Form_FieldTrip.pdf',
  },
  {
    id: 'not-03',
    title: 'Parent-Teacher Meeting (Term 1 Review)',
    content: 'The first term PTM is scheduled for Saturday, 28th November between 9:00 AM and 1:00 PM. Time slots for each roll number have been published.',
    target_type: 'all',
    status: 'published',
    published_at: '2026-11-06',
  },
];

export const initialHomework: MockHomework[] = [
  {
    id: 'hw-01',
    title: 'Fractions Worksheet Chapter 4',
    subject: 'Mathematics',
    class_section: 'Class 5-A',
    description: 'Solve problems 4.1 to 4.3 on textbook pages 58 to 61 in your homework notebook.',
    due_date: '2026-11-08',
    assigned_by: 'M. Saravanan',
  },
  {
    id: 'hw-02',
    title: 'The Road Not Taken - Stanza Reflection',
    subject: 'English',
    class_section: 'Class 5-A',
    description: 'Memorize the first three stanzas of the poem and write a 100-word paragraph on its underlying message.',
    due_date: '2026-11-07',
    assigned_by: 'K. Malathi',
  },
  {
    id: 'hw-03',
    title: 'Plant Photosynthesis Diagram & Labeling',
    subject: 'Science',
    class_section: 'Class 5-A',
    description: 'Draw a neat diagram of chloroplast with neat labels. Highlight light and dark reactions.',
    due_date: '2026-11-09',
    assigned_by: 'M. Saravanan',
  },
];


export const initialFeedback: MockFeedback[] = [
  {
    id: 'fb-01',
    parent_name: 'Ramesh Krishnan',
    student_name: 'Aarav Krishnan (Class 5-A)',
    category: 'suggestion',
    subject: 'Bus Route Timing Adjustment',
    message: 'Could the bus stop arrival time at Adyar Depot be reviewed? The morning bus arrives 10 minutes past 8:15 AM due to traffic near Madhya Kailash.',
    status: 'resolved',
    response: 'The transport coordinator has adjusted route 14 schedule by 10 minutes starting Monday. Thank you for notifying us.',
    created_at: '2026-11-04',
  },
  {
    id: 'fb-02',
    parent_name: 'Anitha Senthil',
    student_name: 'Karthik Senthil (Class 5-A)',
    category: 'query',
    subject: 'Science Olympiad Registration',
    message: 'Kindly let us know if the school is enrolling students for the upcoming National Science Olympiad (NSO) and the fee deadline.',
    status: 'pending',
    created_at: '2026-11-06',
  },
];
