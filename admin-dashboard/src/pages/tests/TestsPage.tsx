import React, { useState } from 'react';
import { ClipboardList, Plus, Clock, Award, Users, CheckCircle2, Play, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface OnlineTestItem {
  id: string;
  title: string;
  subject: string;
  class_name: string;
  duration_minutes: number;
  total_questions: number;
  total_marks: number;
  status: 'active' | 'completed' | 'draft';
  submissions_count: number;
  average_score: number;
}

const initialTests: OnlineTestItem[] = [
  {
    id: 'test-01',
    title: 'Fractions & Arithmetic Quick Quiz',
    subject: 'Mathematics',
    class_name: 'Class 5',
    duration_minutes: 25,
    total_questions: 10,
    total_marks: 20,
    status: 'active',
    submissions_count: 32,
    average_score: 16.5,
  },
  {
    id: 'test-02',
    title: 'Plant Parts & Functions Assessment',
    subject: 'Science',
    class_name: 'Class 5',
    duration_minutes: 30,
    total_questions: 15,
    total_marks: 30,
    status: 'completed',
    submissions_count: 45,
    average_score: 24.2,
  },
];

export function TestsPage() {
  const { toast } = useToast();
  const [tests, setTests] = useState<OnlineTestItem[]>(initialTests);
  const [selectedTest, setSelectedTest] = useState<OnlineTestItem | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
            Online Tests & MCQ Assessments
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Create interactive multiple-choice tests, set timers, and analyze class performance
          </p>
        </div>
        <Button size="sm" onClick={() => toast('info', 'New Test Creator', 'Opening MCQ Test Builder.')}>
          <Plus size={14} /> Create Online Test
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-[#3B5BDB] transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant={test.status === 'active' ? 'success' : 'default'}>
                  {test.status === 'active' ? 'Live / Active' : 'Completed'}
                </Badge>
                <span className="text-[11px] text-[#64748B] font-mono flex items-center gap-1">
                  <Clock size={12} className="text-[#3B5BDB]" /> {test.duration_minutes} Mins
                </span>
              </div>

              <span className="text-[11px] font-bold text-[#3B5BDB] uppercase tracking-wider block mt-2">
                {test.subject} • {test.class_name}
              </span>

              <h3 className="text-sm font-bold text-[#172033] mt-1 leading-snug">
                {test.title}
              </h3>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                  <p className="text-[#94A3B8] text-[10px]">Questions</p>
                  <p className="font-bold text-[#172033] mt-0.5">{test.total_questions} MCQs</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                  <p className="text-[#94A3B8] text-[10px]">Total Marks</p>
                  <p className="font-bold text-[#172033] mt-0.5">{test.total_marks} Pts</p>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-[#DBE4FF]/40 border border-[#3B5BDB]/20 text-xs flex items-center justify-between">
                <span className="text-[#3B5BDB] font-semibold">
                  Submissions: {test.submissions_count}
                </span>
                <span className="text-[#172033] font-bold">
                  Avg: {test.average_score}/{test.total_marks}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-[#F1F5F9]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTest(test);
                  setShowPreviewModal(true);
                }}
              >
                <Eye size={13} /> View Questions
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedTest && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title={selectedTest.title}
          description={`${selectedTest.subject} • ${selectedTest.total_questions} Questions • ${selectedTest.duration_minutes} Minutes`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                <p className="font-bold text-[#172033]">
                  Q1. What is the sum of 3/4 and 2/4?
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-white border border-[#E2E8F0]">A) 5/8</div>
                  <div className="p-2 rounded bg-[#D3F9D8] border border-[#16A36A] font-bold text-[#16A36A]">
                    B) 5/4 (Correct)
                  </div>
                  <div className="p-2 rounded bg-white border border-[#E2E8F0]">C) 6/4</div>
                  <div className="p-2 rounded bg-white border border-[#E2E8F0]">D) 1/4</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                <p className="font-bold text-[#172033]">
                  Q2. Express 0.75 as a simplified fraction:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-[#D3F9D8] border border-[#16A36A] font-bold text-[#16A36A]">
                    A) 3/4 (Correct)
                  </div>
                  <div className="p-2 rounded bg-white border border-[#E2E8F0]">B) 7/5</div>
                  <div className="p-2 rounded bg-white border border-[#E2E8F0]">C) 75/10</div>
                  <div className="p-2 rounded bg-white border border-[#E2E8F0]">D) 1/2</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setShowPreviewModal(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

