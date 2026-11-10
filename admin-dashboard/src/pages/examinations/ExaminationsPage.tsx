import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Eye,
  CheckCircle2,
  Calendar,
  Award,
  Edit,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { initialStudents } from '@/lib/mockData';

interface SubjectMark {
  student_id: string;
  name: string;
  admission_number: string;
  marks: number;
  remarks: string;
}

export function ExaminationsPage() {
  const { toast } = useToast();
  const [exams, setExams] = useState([
    {
      id: 'exam-01',
      name: 'First Term Summative Assessment',
      academic_year: '2026-2027',
      start_date: '2026-10-15',
      end_date: '2026-10-23',
      is_published: true,
      subjects: [
        { name: 'Mathematics', max_marks: 100, pass_marks: 35, date: '2026-10-15' },
        { name: 'English', max_marks: 100, pass_marks: 35, date: '2026-10-17' },
        { name: 'Science', max_marks: 100, pass_marks: 35, date: '2026-10-19' },
        { name: 'Tamil', max_marks: 100, pass_marks: 35, date: '2026-10-21' },
      ],
    },
    {
      id: 'exam-02',
      name: 'Mid-Term Evaluation (Formative)',
      academic_year: '2026-2027',
      start_date: '2026-11-25',
      end_date: '2026-11-30',
      is_published: false,
      subjects: [
        { name: 'Mathematics', max_marks: 50, pass_marks: 18, date: '2026-11-25' },
        { name: 'English', max_marks: 50, pass_marks: 18, date: '2026-11-27' },
      ],
    },
  ]);

  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [showMarksModal, setShowMarksModal] = useState(false);

  // Mark entry states
  const [marksRoster, setMarksRoster] = useState<SubjectMark[]>(() =>
    initialStudents.map((s, idx) => ({
      student_id: s.id,
      name: `${s.first_name} ${s.last_name}`,
      admission_number: s.admission_number,
      marks: idx === 0 ? 94.5 : idx === 1 ? 88.0 : 79.5,
      remarks: 'Good comprehension',
    }))
  );

  const calculateGrade = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 90) return { grade: 'A+', variant: 'success' as const };
    if (pct >= 80) return { grade: 'A', variant: 'success' as const };
    if (pct >= 70) return { grade: 'B', variant: 'info' as const };
    if (pct >= 50) return { grade: 'C', variant: 'warning' as const };
    return { grade: 'F', variant: 'error' as const };
  };

  const handleTogglePublish = (examId: string) => {
    setExams(
      exams.map((e) =>
        e.id === examId ? { ...e, is_published: !e.is_published } : e
      )
    );
    const target = exams.find((e) => e.id === examId);
    if (target?.is_published) {
      toast('info', 'Results Unpublished', 'Results hidden from parent mobile app.');
    } else {
      toast(
        'success',
        'Results Published to Parents',
        'Parents can now view scores and report cards in the mobile app.'
      );
    }
  };

  const openMarksEntry = (exam: any, subjectName: string) => {
    setSelectedExam(exam);
    setSelectedSubject(subjectName);
    setShowMarksModal(true);
  };

  const handleSaveMarks = () => {
    toast(
      'success',
      'Marks Saved',
      `Marks updated for ${selectedSubject} in ${selectedExam.name}.`
    );
    setShowMarksModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
            Examinations & Results
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Schedule exams, enter student test marks, and publish report cards
          </p>
        </div>
        <Button size="sm">
          <Plus size={14} /> Schedule New Exam
        </Button>
      </div>

      <div className="space-y-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden"
          >
            <div className="p-5 border-b border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC]">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-[#172033]">{exam.name}</h3>
                  <Badge variant={exam.is_published ? 'success' : 'default'}>
                    {exam.is_published ? 'Published to Parents' : 'Draft / Internal'}
                  </Badge>
                </div>
                <p className="text-xs text-[#64748B] mt-1 flex items-center gap-2">
                  <Calendar size={13} className="text-[#3B5BDB]" />
                  <span>
                    {exam.start_date} to {exam.end_date}
                  </span>
                  <span>• Academic Year {exam.academic_year}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={exam.is_published ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleTogglePublish(exam.id)}
                >
                  {exam.is_published ? 'Unpublish Results' : 'Publish Results to Parents'}
                </Button>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="p-5">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
                Exam Schedule & Subject Marks Entry
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {exam.subjects.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#3B5BDB] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <p className="font-bold text-xs text-[#172033]">{sub.name}</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">Date: {sub.date}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-1">
                        Max: {sub.max_marks} • Pass: {sub.pass_marks}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full text-xs"
                      onClick={() => openMarksEntry(exam, sub.name)}
                    >
                      <Edit size={12} /> Enter Marks
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Marks Entry Modal */}
      {selectedExam && (
        <Modal
          isOpen={showMarksModal}
          onClose={() => setShowMarksModal(false)}
          title={`Enter Marks: ${selectedSubject}`}
          description={`${selectedExam.name} • Class 5 Section A`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-[#F8FAFC] flex items-center justify-between text-xs font-bold text-[#64748B] uppercase">
                <span>Student</span>
                <div className="flex items-center gap-6">
                  <span>Marks (Out of 100)</span>
                  <span>Grade</span>
                </div>
              </div>
              {marksRoster.map((item, idx) => {
                const gradeInfo = calculateGrade(item.marks, 100);
                return (
                  <div
                    key={item.student_id}
                    className="px-4 py-3 flex items-center justify-between text-xs hover:bg-[#F8FAFC]"
                  >
                    <div>
                      <p className="font-bold text-[#172033]">{item.name}</p>
                      <p className="text-[10px] text-[#64748B] font-mono">
                        {item.admission_number}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.marks}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setMarksRoster(
                            marksRoster.map((m) =>
                              m.student_id === item.student_id ? { ...m, marks: val } : m
                            )
                          );
                        }}
                        className="w-20 px-2.5 py-1 text-center font-bold font-mono border border-[#E2E8F0] rounded-lg outline-none focus:border-[#3B5BDB]"
                      />
                      <Badge variant={gradeInfo.variant} className="w-8 justify-center">
                        {gradeInfo.grade}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowMarksModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMarks}>
                <Save size={14} /> Save & Calculate Grades
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

