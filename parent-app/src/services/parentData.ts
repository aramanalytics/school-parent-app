// Data services and mock data for Parent Mobile Application
export interface ParentStudentInfo {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  admission_number: string;
  roll_number: string;
  class_name: string;
  section_name: string;
  photo_url: string;
  date_of_birth: string;
  gender: string;
  father_name: string;
  mother_name: string;
  phone: string;
  address: string;
}

export interface StudentAttendanceSummary {
  percentage: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  total_working_days: number;
}

export interface AttendanceDayRecord {
  date: string;
  day: string;
  status: 'present' | 'absent' | 'late' | 'holiday';
  remarks?: string;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  description: string;
  assigned_by: string;
  is_submitted?: boolean;
}

export interface StudentFeeSummary {
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  items: {
    id: string;
    category: string;
    amount: number;
    paid: number;
    status: 'paid' | 'pending' | 'partial' | 'overdue';
    due_date: string;
    receipt_no?: string;
    payment_date?: string;
  }[];
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  attachment?: {
    name: string;
    type: 'pdf' | 'image' | 'video' | 'audio';
    url: string;
  };
  is_read?: boolean;
}

export interface ExamResultItem {
  id: string;
  exam_name: string;
  academic_year: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  overall_grade: string;
  subjects: {
    subject: string;
    max_marks: number;
    obtained_marks: number;
    grade: string;
    remarks: string;
  }[];
}

export interface TimetableSlot {
  period: number;
  time: string;
  subject: string;
  teacher: string;
  is_break?: boolean;
}

export interface LearningMaterialItem {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'video' | 'audio' | 'image';
  file_name: string;
  file_size: string;
  uploaded_by: string;
  date: string;
}

export interface OnlineTestItem {
  id: string;
  title: string;
  subject: string;
  duration_minutes: number;
  total_marks: number;
  questions_count: number;
  status: 'active' | 'completed';
  score?: number;
  questions: {
    id: string;
    question: string;
    options: string[];
    correct_idx: number;
  }[];
}

export interface SchoolCalendarEvent {
  id: string;
  title: string;
  type: 'holiday' | 'exam' | 'event' | 'activity';
  start_date: string;
  end_date: string;
  description: string;
}

export interface FeedbackQuery {
  id: string;
  category: 'query' | 'suggestion' | 'complaint' | 'general';
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  response?: string;
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'attendance' | 'notice' | 'fee' | 'homework' | 'event';
  is_read: boolean;
}

// Mock children data for registered demo parent (Ramesh Krishnan)
export const demoStudents: ParentStudentInfo[] = [
  {
    id: '88888888-0001-8888-8888-888888888888',
    name: 'Aarav Krishnan',
    first_name: 'Aarav',
    last_name: 'Krishnan',
    admission_number: 'ADM2026-0501',
    roll_number: '01',
    class_name: 'Class 5',
    section_name: 'Section A',
    photo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&h=150&fit=crop',
    date_of_birth: '12 Apr 2016',
    gender: 'Male',
    father_name: 'Ramesh Krishnan',
    mother_name: 'Deepa Ramesh',
    phone: '+91 98840 11223',
    address: 'Plot 45, Gandhi Nagar, Adyar, Chennai 600020',
  },
  {
    id: '88888888-0002-8888-8888-888888888888',
    name: 'Diya Krishnan',
    first_name: 'Diya',
    last_name: 'Krishnan',
    admission_number: 'ADM2026-0502',
    roll_number: '02',
    class_name: 'Class 5',
    section_name: 'Section B',
    photo_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&h=150&fit=crop',
    date_of_birth: '25 Aug 2018',
    gender: 'Female',
    father_name: 'Ramesh Krishnan',
    mother_name: 'Deepa Ramesh',
    phone: '+91 98840 11223',
    address: 'Plot 45, Gandhi Nagar, Adyar, Chennai 600020',
  },
];

// Student-specific dynamic data provider
export function getStudentAttendance(studentId: string): {
  summary: StudentAttendanceSummary;
  records: AttendanceDayRecord[];
} {
  const isAarav = studentId === demoStudents[0].id;

  return {
    summary: isAarav
      ? {
          percentage: 92,
          present_days: 23,
          absent_days: 1,
          late_days: 1,
          total_working_days: 25,
        }
      : {
          percentage: 88,
          present_days: 22,
          absent_days: 2,
          late_days: 1,
          total_working_days: 25,
        },
    records: [
      { date: '06 Nov 2026', day: 'Friday', status: 'present' },
      { date: '05 Nov 2026', day: 'Thursday', status: 'present' },
      { date: '04 Nov 2026', day: 'Wednesday', status: isAarav ? 'late' : 'present', remarks: isAarav ? 'Late by 15 mins (traffic)' : undefined },
      { date: '03 Nov 2026', day: 'Tuesday', status: isAarav ? 'present' : 'absent', remarks: !isAarav ? 'Medical leave requested' : undefined },
      { date: '02 Nov 2026', day: 'Monday', status: 'present' },
      { date: '31 Oct 2026', day: 'Saturday', status: 'holiday', remarks: 'Weekend' },
      { date: '30 Oct 2026', day: 'Friday', status: 'present' },
      { date: '29 Oct 2026', day: 'Thursday', status: 'present' },
      { date: '28 Oct 2026', day: 'Wednesday', status: 'present' },
      { date: '27 Oct 2026', day: 'Tuesday', status: 'present' },
    ],
  };
}

export function getStudentHomework(studentId: string): HomeworkItem[] {
  const isAarav = studentId === demoStudents[0].id;

  return isAarav
    ? [
        {
          id: 'hw-1',
          title: 'Fractions Worksheet Chapter 4',
          subject: 'Mathematics',
          due_date: '08 Nov 2026',
          description: 'Complete exercises 4.1 to 4.3 on textbook pages 58 to 61 in your homework notebook.',
          assigned_by: 'M. Saravanan',
        },
        {
          id: 'hw-2',
          title: 'The Road Not Taken - Stanza Reflection',
          subject: 'English',
          due_date: '07 Nov 2026',
          description: 'Memorize the first three stanzas of the poem and write a 100-word paragraph.',
          assigned_by: 'K. Malathi',
        },
        {
          id: 'hw-3',
          title: 'Plant Photosynthesis Diagram & Labeling',
          subject: 'Science',
          due_date: '09 Nov 2026',
          description: 'Draw chloroplast diagram with neat labels and write 5 sentences on light reactions.',
          assigned_by: 'M. Saravanan',
        },
      ]
    : [
        {
          id: 'hw-b1',
          title: 'English Vocabulary Building Sentences',
          subject: 'English',
          due_date: '08 Nov 2026',
          description: 'Write 10 sentences using new chapter vocabulary words.',
          assigned_by: 'K. Malathi',
        },
        {
          id: 'hw-b2',
          title: 'Multiplication Tables 12 to 15 Revision',
          subject: 'Mathematics',
          due_date: '07 Nov 2026',
          description: 'Practice table drills and complete page 34 test sheet.',
          assigned_by: 'R. Lakshmi',
        },
      ];
}

export function getStudentFees(studentId: string): StudentFeeSummary {
  const isAarav = studentId === demoStudents[0].id;

  return isAarav
    ? {
        total_amount: 40500,
        paid_amount: 28000,
        pending_amount: 12500,
        items: [
          {
            id: 'f-1',
            category: 'Term 1 Tuition Fee',
            amount: 28000,
            paid: 28000,
            status: 'paid',
            due_date: '20 Nov 2026',
            receipt_no: 'REC-2026-08912',
            payment_date: '28 Oct 2026',
          },
          {
            id: 'f-2',
            category: 'Transport & Special Activities Fee',
            amount: 12500,
            paid: 0,
            status: 'pending',
            due_date: '05 Dec 2026',
          },
        ],
      }
    : {
        total_amount: 28000,
        paid_amount: 15000,
        pending_amount: 13000,
        items: [
          {
            id: 'fb-1',
            category: 'Term 1 Tuition Fee',
            amount: 28000,
            paid: 15000,
            status: 'partial',
            due_date: '20 Nov 2026',
            receipt_no: 'REC-2026-08933',
            payment_date: '15 Oct 2026',
          },
        ],
      };
}

export function getSchoolNotices(): NoticeItem[] {
  return [
    {
      id: 'not-01',
      title: 'Annual Sports Meet 2026 - Event Schedule',
      content: 'We are delighted to announce that our 18th Annual Sports Meet will take place on December 12th, 2026 at Nehru Stadium. Parents are cordially invited to encourage the students.',
      date: '04 Nov 2026',
      category: 'Sports & Cultural',
      attachment: {
        name: 'Sports_Schedule_2026.pdf',
        type: 'pdf',
        url: 'https://example.com/sports.pdf',
      },
    },
    {
      id: 'not-02',
      title: 'Class 5 Educational Field Trip to Planetarium',
      content: 'All Class 5 students will be visiting the Birla Planetarium on Friday. Transport and lunch arrangements will be organized by the school. Please submit signed consent slips.',
      date: '05 Nov 2026',
      category: 'Excursion',
      attachment: {
        name: 'Field_Trip_Consent.pdf',
        type: 'pdf',
        url: 'https://example.com/fieldtrip.pdf',
      },
    },
    {
      id: 'not-03',
      title: 'Term 1 Parent-Teacher Meeting (PTM)',
      content: 'The first term parent-teacher meeting is scheduled for Saturday, 28th November between 9:00 AM and 1:00 PM. Please consult student report cards.',
      date: '06 Nov 2026',
      category: 'Academic',
    },
  ];
}

export function getExamResults(studentId: string): ExamResultItem[] {
  return [
    {
      id: 'er-1',
      exam_name: 'First Term Summative Assessment',
      academic_year: '2026-2027',
      total_marks: 400,
      obtained_marks: 362,
      percentage: 90.5,
      overall_grade: 'A+',
      subjects: [
        { subject: 'Mathematics', max_marks: 100, obtained_marks: 94.5, grade: 'A+', remarks: 'Outstanding problem solving' },
        { subject: 'English', max_marks: 100, obtained_marks: 88.0, grade: 'A', remarks: 'Creative writing is very good' },
        { subject: 'Science', max_marks: 100, obtained_marks: 91.5, grade: 'A+', remarks: 'Excellent diagrams and concepts' },
        { subject: 'Tamil', max_marks: 100, obtained_marks: 88.0, grade: 'A', remarks: 'Good grammar and handwriting' },
      ],
    },
  ];
}

export function getTimetableSchedule(): Record<string, TimetableSlot[]> {
  return {
    Monday: [
      { period: 1, time: '09:00 - 09:45', subject: 'English', teacher: 'K. Malathi' },
      { period: 2, time: '09:45 - 10:30', subject: 'Mathematics', teacher: 'M. Saravanan' },
      { period: 0, time: '10:30 - 10:45', subject: 'Morning Interval', teacher: '', is_break: true },
      { period: 3, time: '10:45 - 11:30', subject: 'Science', teacher: 'M. Saravanan' },
      { period: 4, time: '11:30 - 12:15', subject: 'Tamil', teacher: 'K. Malathi' },
      { period: 0, time: '12:15 - 13:00', subject: 'Lunch Break', teacher: '', is_break: true },
      { period: 5, time: '13:00 - 13:45', subject: 'Social Science', teacher: 'S. Jayaraman' },
    ],
    Tuesday: [
      { period: 1, time: '09:00 - 09:45', subject: 'Mathematics', teacher: 'M. Saravanan' },
      { period: 2, time: '09:45 - 10:30', subject: 'Science', teacher: 'M. Saravanan' },
      { period: 0, time: '10:30 - 10:45', subject: 'Morning Interval', teacher: '', is_break: true },
      { period: 3, time: '10:45 - 11:30', subject: 'English', teacher: 'K. Malathi' },
      { period: 4, time: '11:30 - 12:15', subject: 'Computer Lab', teacher: 'S. Jayaraman' },
      { period: 0, time: '12:15 - 13:00', subject: 'Lunch Break', teacher: '', is_break: true },
      { period: 5, time: '13:00 - 13:45', subject: 'Tamil', teacher: 'K. Malathi' },
    ],
    Wednesday: [
      { period: 1, time: '09:00 - 09:45', subject: 'Science Lab', teacher: 'M. Saravanan' },
      { period: 2, time: '09:45 - 10:30', subject: 'English', teacher: 'K. Malathi' },
      { period: 0, time: '10:30 - 10:45', subject: 'Morning Interval', teacher: '', is_break: true },
      { period: 3, time: '10:45 - 11:30', subject: 'Mathematics', teacher: 'M. Saravanan' },
      { period: 4, time: '11:30 - 12:15', subject: 'Arts & Craft', teacher: 'Ananya S.' },
      { period: 0, time: '12:15 - 13:00', subject: 'Lunch Break', teacher: '', is_break: true },
      { period: 5, time: '13:00 - 13:45', subject: 'Tamil', teacher: 'K. Malathi' },
    ],
  };
}

export function getLearningMaterials(): LearningMaterialItem[] {
  return [
    {
      id: 'lm-1',
      title: 'Chapter 4: Fractions and Decimals Revision Notes',
      subject: 'Mathematics',
      type: 'pdf',
      file_name: 'Math_Ch4_Fractions_Notes.pdf',
      file_size: '2.4 MB',
      uploaded_by: 'M. Saravanan',
      date: '03 Nov 2026',
    },
    {
      id: 'lm-2',
      title: 'Plant Photosynthesis Concept Video Explainer',
      subject: 'Science',
      type: 'video',
      file_name: 'Photosynthesis_Concept_Explainer.mp4',
      file_size: '18.6 MB',
      uploaded_by: 'M. Saravanan',
      date: '04 Nov 2026',
    },
    {
      id: 'lm-3',
      title: 'The Road Not Taken - Poem Audio Recitation',
      subject: 'English',
      type: 'audio',
      file_name: 'Frost_Poem_Recitation.mp3',
      file_size: '4.1 MB',
      uploaded_by: 'K. Malathi',
      date: '05 Nov 2026',
    },
  ];
}

export function getOnlineTests(): OnlineTestItem[] {
  return [
    {
      id: 'ot-1',
      title: 'Fractions & Arithmetic Quick Quiz',
      subject: 'Mathematics',
      duration_minutes: 20,
      total_marks: 20,
      questions_count: 5,
      status: 'active',
      questions: [
        {
          id: 'q1',
          question: 'What is 3/4 + 2/4 equal to?',
          options: ['5/8', '5/4', '6/4', '1/4'],
          correct_idx: 1,
        },
        {
          id: 'q2',
          question: 'Express 0.75 as a fraction in simplest terms:',
          options: ['3/4', '7/5', '75/10', '1/2'],
          correct_idx: 0,
        },
        {
          id: 'q3',
          question: 'Which of the following is an improper fraction?',
          options: ['2/3', '5/7', '9/4', '1/8'],
          correct_idx: 2,
        },
      ],
    },
  ];
}

export function getSchoolEvents(): SchoolCalendarEvent[] {
  return [
    {
      id: 'se-1',
      title: 'Mid-Term Summative Assessments',
      type: 'exam',
      start_date: '20 Nov 2026',
      end_date: '27 Nov 2026',
      description: 'Quarterly examinations across all subjects.',
    },
    {
      id: 'se-2',
      title: 'Annual Sports Day 2026',
      type: 'event',
      start_date: '12 Dec 2026',
      end_date: '12 Dec 2026',
      description: 'Track and field athletics at Nehru Stadium.',
    },
    {
      id: 'se-3',
      title: 'Winter Holidays / Christmas Vacation',
      type: 'holiday',
      start_date: '24 Dec 2026',
      end_date: '02 Jan 2027',
      description: 'School reopens on Monday, January 4th.',
    },
  ];
}

export function getAppNotifications(): AppNotification[] {
  return [
    {
      id: 'notif-1',
      title: 'Term 1 Fee Payment Confirmed',
      message: 'Tuition fee payment of ₹28,000 for Aarav Krishnan has been verified.',
      date: '28 Oct 2026',
      type: 'fee',
      is_read: true,
    },
    {
      id: 'notif-2',
      title: 'Circular: Annual Sports Meet 2026',
      message: 'New circular published on the notice board regarding registration dates.',
      date: '04 Nov 2026',
      type: 'notice',
      is_read: false,
    },
    {
      id: 'notif-3',
      title: 'New Homework: Mathematics Fractions',
      message: 'M. Saravanan assigned Fractions Worksheet due on Nov 8th.',
      date: '06 Nov 2026',
      type: 'homework',
      is_read: false,
    },
  ];
}

