import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Users,
  AlertTriangle,
  History,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  academicService,
  AcademicSession,
  SchoolClass,
  ClassSection,
  PromotionRecord,
} from '@/services/academicService';
import { useAuth } from '@/contexts/AuthContext';

interface StudentToPromote {
  id: string;
  name: string;
  admissionNumber: string;
  rollNumber: string;
  currentGrade: string;
  attendancePercent: string;
}

export function StudentPromotionsPage() {
  const { userRole } = useAuth();
  const { addToast } = useToast();

  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [destSections, setDestSections] = useState<ClassSection[]>([]);
  const [promotionsHistory, setPromotionsHistory] = useState<PromotionRecord[]>([]);

  // Selection states
  const [fromSessionId, setFromSessionId] = useState('');
  const [toSessionId, setToSessionId] = useState('');
  const [fromClassId, setFromClassId] = useState('');
  const [toClassId, setToClassId] = useState('');
  const [toSectionId, setToSectionId] = useState('');

  // Sample student candidates for promotion
  const [candidates, setCandidates] = useState<StudentToPromote[]>([
    {
      id: '88888888-0001-8888-8888-888888888888',
      name: 'Aarav Krishnan',
      admissionNumber: 'ADM2026-0501',
      rollNumber: '01',
      currentGrade: 'A+',
      attendancePercent: '95.6%',
    },
    {
      id: '88888888-0002-8888-8888-888888888888',
      name: 'Diya Krishnan',
      admissionNumber: 'ADM2026-0502',
      rollNumber: '02',
      currentGrade: 'A',
      attendancePercent: '92.4%',
    },
    {
      id: '88888888-0003-8888-8888-888888888888',
      name: 'Karthik Senthil',
      admissionNumber: 'ADM2026-0503',
      rollNumber: '03',
      currentGrade: 'B+',
      attendancePercent: '88.5%',
    },
  ]);

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isPromoting, setIsPromoting] = useState(false);

  const isSuperOrSchoolAdmin =
    userRole?.role === 'super_admin' || userRole?.role === 'school_admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [sessList, classList, history] = await Promise.all([
      academicService.getSessions(),
      academicService.getClasses(),
      academicService.getPromotionHistory(),
    ]);

    setSessions(sessList);
    setClasses(classList);
    setPromotionsHistory(history);

    if (sessList.length >= 2) {
      setFromSessionId(sessList[0].id);
      setToSessionId(sessList[1].id);
    } else if (sessList.length === 1) {
      setFromSessionId(sessList[0].id);
      setToSessionId(sessList[0].id);
    }

    if (classList.length >= 2) {
      setFromClassId(classList[0].id);
      setToClassId(classList[1].id);
      loadSectionsForDestClass(classList[1].id);
    } else if (classList.length === 1) {
      setFromClassId(classList[0].id);
      setToClassId(classList[0].id);
      loadSectionsForDestClass(classList[0].id);
    }
  };

  const loadSectionsForDestClass = async (classId: string) => {
    const secs = await academicService.getSections(classId);
    setDestSections(secs);
    if (secs.length > 0) setToSectionId(secs[0].id);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudentIds(candidates.map((c) => c.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDestClassChange = (classId: string) => {
    setToClassId(classId);
    loadSectionsForDestClass(classId);
  };

  const executePromotion = async () => {
    if (!isSuperOrSchoolAdmin) {
      addToast('Unauthorized: Only administrators can promote students', 'error');
      return;
    }

    if (selectedStudentIds.length === 0) {
      addToast('Please select at least one student to promote', 'error');
      return;
    }

    try {
      setIsPromoting(true);
      const fromSessName = sessions.find((s) => s.id === fromSessionId)?.name || '2026–2027';
      const toSessName = sessions.find((s) => s.id === toSessionId)?.name || '2027–2028';
      const fromClassName = classes.find((c) => c.id === fromClassId)?.name || 'Class 5';
      const toClassName = classes.find((c) => c.id === toClassId)?.name || 'Class 6';
      const toSecName = destSections.find((s) => s.id === toSectionId)?.name || 'Section A';

      const studentsToPromote = candidates
        .filter((c) => selectedStudentIds.includes(c.id))
        .map((c) => ({ id: c.id, name: c.name, admissionNumber: c.admissionNumber }));

      await academicService.promoteStudents(
        studentsToPromote,
        fromSessName,
        toSessName,
        fromClassName,
        toClassName,
        'Section A',
        toSecName,
        remarks
      );

      addToast(
        `Successfully promoted ${studentsToPromote.length} students to ${toClassName} (${toSecName})! Historical records preserved.`,
        'success'
      );

      setIsConfirmModalOpen(false);
      setSelectedStudentIds([]);
      setRemarks('');
      const updatedHistory = await academicService.getPromotionHistory();
      setPromotionsHistory(updatedHistory);
    } catch {
      addToast('Failed to execute promotion batch', 'error');
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
              Student Promotion & Progression
            </h1>
            <Badge variant="success">Year-End Progression</Badge>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Bulk-promote eligible students to their next grade while strictly preserving historical academic and attendance records.
          </p>
        </div>
      </div>

      {/* Promotion Config Banner Card */}
      <Card className="border border-[#3B5BDB]/30 bg-gradient-to-r from-white via-[#F8FAFC] to-[#EFF6FF]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-[#172033]">
            Progression Parameters Setup
          </CardTitle>
          <CardDescription className="text-xs text-[#64748B]">
            Specify the origin and destination classes for this batch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Source Session
              </label>
              <select
                value={fromSessionId}
                onChange={(e) => setFromSessionId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2E8F0] rounded-lg outline-none font-medium"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    Session {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Source Class
              </label>
              <select
                value={fromClassId}
                onChange={(e) => setFromClassId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2E8F0] rounded-lg outline-none font-medium"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden lg:flex justify-center pb-2 text-[#3B5BDB]">
              <ArrowRight size={22} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Destination Session
              </label>
              <select
                value={toSessionId}
                onChange={(e) => setToSessionId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2E8F0] rounded-lg outline-none font-medium text-[#3B5BDB] font-bold"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    Session {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Destination Class & Section
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={toClassId}
                  onChange={(e) => handleDestClassChange(e.target.value)}
                  className="px-2 py-1.5 text-xs bg-white border border-[#E2E8F0] rounded-lg outline-none font-bold"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  value={toSectionId}
                  onChange={(e) => setToSectionId(e.target.value)}
                  className="px-2 py-1.5 text-xs bg-white border border-[#E2E8F0] rounded-lg outline-none font-bold"
                >
                  {destSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eligible Students Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
          <div>
            <CardTitle className="text-base font-bold text-[#172033]">
              Eligible Students Roster ({candidates.length})
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Select students individually or in bulk to promote
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B]">
              Selected: <strong>{selectedStudentIds.length}</strong> of {candidates.length}
            </span>
            {isSuperOrSchoolAdmin && (
              <Button
                size="sm"
                disabled={selectedStudentIds.length === 0}
                onClick={() => setIsConfirmModalOpen(true)}
                className="bg-[#16A36A] hover:bg-[#138355] text-white shadow-xs"
              >
                <Sparkles size={14} className="mr-1.5" /> Promote Selected
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-semibold">
                  <th className="py-2.5 px-3 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedStudentIds.length === candidates.length && candidates.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded text-[#3B5BDB]"
                    />
                  </th>
                  <th className="py-2.5 px-3">Admission No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Academic Performance</th>
                  <th className="py-2.5 px-3">Annual Attendance</th>
                  <th className="py-2.5 px-3">Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {candidates.map((std) => (
                  <tr key={std.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(std.id)}
                        onChange={() => handleToggleStudent(std.id)}
                        className="rounded text-[#3B5BDB]"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono text-[#3B5BDB] font-semibold">
                      {std.admissionNumber}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#172033]">{std.name}</td>
                    <td className="py-3 px-3 text-[#64748B]">{std.rollNumber}</td>
                    <td className="py-3 px-3">
                      <Badge variant="purple" className="text-[10px]">
                        Grade {std.currentGrade}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-600">
                      {std.attendancePercent}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 size={13} /> Eligible
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Promotion History Audit Ledger */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History size={18} className="text-[#3B5BDB]" />
            <CardTitle className="text-base font-bold text-[#172033]">
              Promotion History & Progression Audit
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-[#64748B]">
            Verifiable log of previous student class movements across academic sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-semibold">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Student Name</th>
                  <th className="py-2 px-3">From Cycle</th>
                  <th className="py-2 px-3">To Cycle</th>
                  <th className="py-2 px-3">Progression Details</th>
                  <th className="py-2 px-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {promotionsHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-3 text-[#64748B] font-mono">{h.promotion_date}</td>
                    <td className="py-2.5 px-3 font-bold text-[#172033]">{h.student_name}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="default" className="text-[10px]">
                        {h.from_session} • {h.from_class}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant="success" className="text-[10px]">
                        {h.to_session} • {h.to_class} ({h.to_section})
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-[#475569]">
                      {h.from_class} {h.from_section} $\to$ {h.to_class} {h.to_section}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-[#64748B] italic">
                      {h.remarks || 'Standard promotion'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Confirm Student Batch Promotion"
        >
          <div className="space-y-4 text-xs text-[#475569]">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2">
              <ShieldCheck size={18} className="shrink-0 text-[#3B5BDB] mt-0.5" />
              <div>
                <p className="font-bold">Historical Integrity Guarantee</p>
                <p className="text-[11px] mt-0.5">
                  Promoting these <strong>{selectedStudentIds.length}</strong> students will enroll
                  them into the new class while strictly retaining all previous marks, homework and
                  attendance records in the historical archives.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Promotion Batch Remarks / Circular Reference
              </label>
              <textarea
                className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:border-[#3B5BDB]"
                rows={2}
                placeholder="e.g. Annual Term 2 Board Promotion 2026-27"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={executePromotion}
                loading={isPromoting}
                className="bg-[#16A36A] hover:bg-[#138355] text-white"
              >
                Execute Promotion
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

