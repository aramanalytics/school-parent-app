import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  BookOpen,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  Filter,
  UserCheck,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import {
  academicService,
  AcademicSubject,
  TeacherAssignmentRecord,
  AcademicSession,
  SchoolClass,
  ClassSection,
} from '@/services/academicService';
import { useAuth } from '@/contexts/AuthContext';

export function TeacherAssignmentsPage() {
  const { userRole } = useAuth();
  const { addToast } = useToast();

  const [assignments, setAssignments] = useState<TeacherAssignmentRecord[]>([]);
  const [subjects, setSubjects] = useState<AcademicSubject[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<ClassSection[]>([]);

  // Filter & Search
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Add Assignment Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0001');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // Add Subject Modal
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');

  const isSuperOrSchoolAdmin =
    userRole?.role === 'super_admin' || userRole?.role === 'school_admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [sessList, subList, classList] = await Promise.all([
      academicService.getSessions(),
      academicService.getSubjects(),
      academicService.getClasses(),
    ]);

    setSessions(sessList);
    setSubjects(subList);
    setClasses(classList);

    const activeSess = sessList.find((s) => s.is_current) || sessList[0];
    if (activeSess) {
      setSelectedSessionId(activeSess.id);
      loadAssignments(activeSess.id);
    }

    if (classList.length > 0) {
      setSelectedClassId(classList[0].id);
      const secs = await academicService.getSections(classList[0].id);
      setSections(secs);
      if (secs.length > 0) setSelectedSectionId(secs[0].id);
    }

    if (subList.length > 0) {
      setSelectedSubjectId(subList[0].id);
    }
  };

  const loadAssignments = async (sessionId: string) => {
    const list = await academicService.getTeacherAssignments(sessionId);
    setAssignments(list);
  };

  const handleClassChangeInModal = async (classId: string) => {
    setSelectedClassId(classId);
    const secs = await academicService.getSections(classId);
    setSections(secs);
    if (secs.length > 0) setSelectedSectionId(secs[0].id);
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSectionId || !selectedSubjectId || !selectedSessionId) {
      addToast('Please select all required fields', 'error');
      return;
    }

    const currentTeacher =
      selectedTeacherId === 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0001'
        ? 'M. Saravanan'
        : 'K. Malathi';
    const currentClass = classes.find((c) => c.id === selectedClassId)?.name || 'Class 5';
    const currentSection = sections.find((s) => s.id === selectedSectionId)?.name || 'Section A';
    const currentSubject = subjects.find((s) => s.id === selectedSubjectId)?.name || 'Mathematics';

    try {
      await academicService.assignTeacher({
        teacher_id: selectedTeacherId,
        section_id: selectedSectionId,
        subject_id: selectedSubjectId,
        academic_year_id: selectedSessionId,
        teacher_name: currentTeacher,
        class_name: currentClass,
        section_name: currentSection,
        subject_name: currentSubject,
      });

      addToast(`Teacher ${currentTeacher} assigned to ${currentSubject}`, 'success');
      setIsAddModalOpen(false);
      loadAssignments(selectedSessionId);
    } catch {
      addToast('Failed to assign teacher', 'error');
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName) {
      addToast('Subject Name is required', 'error');
      return;
    }

    try {
      await academicService.createSubject({
        school_id: userRole?.school_id || '11111111-1111-1111-1111-111111111111',
        name: newSubName.trim(),
        code: newSubCode.trim() || `SUB-${subjects.length + 1}`,
        description: newSubDesc,
      });

      addToast(`Subject ${newSubName} added to curriculum catalog`, 'success');
      setIsAddSubjectModalOpen(false);
      setNewSubName('');
      setNewSubCode('');
      setNewSubDesc('');
      const subList = await academicService.getSubjects();
      setSubjects(subList);
    } catch {
      addToast('Failed to create subject', 'error');
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    const text = `${a.teacher_name} ${a.class_name} ${a.section_name} ${a.subject_name}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
              Subject Catalog & Teacher Assignments
            </h1>
            <Badge variant="purple">Curriculum Mapping</Badge>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Map faculty instructors to grades, sections and academic subjects for the active session.
          </p>
        </div>

        {isSuperOrSchoolAdmin && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsAddSubjectModalOpen(true)}>
              <BookOpen size={14} className="mr-1.5" /> Add Subject
            </Button>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={14} className="mr-1.5" /> Assign Teacher
            </Button>
          </div>
        )}
      </div>

      {/* Main Grid: Subject Catalog & Active Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Directory on Left */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-[#172033]">
              Curriculum Catalog ({subjects.length})
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Standardized course codes & syllabi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 max-h-[550px] overflow-y-auto">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#3B5BDB]/40 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#172033]">{sub.name}</span>
                  <Badge variant="default" className="text-[10px] font-mono">
                    {sub.code}
                  </Badge>
                </div>
                <p className="text-[11px] text-[#64748B] line-clamp-2">
                  {sub.description || 'Core academic discipline'}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assignments Table on Right */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
            <div>
              <CardTitle className="text-base font-bold text-[#172033]">
                Assigned Subject Instructors
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Faculty teaching roster for session {sessions.find((s) => s.id === selectedSessionId)?.name || '2026-27'}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg px-2.5 py-1">
                <Search size={13} className="text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Filter teacher, class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-[#172033] w-36"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-semibold">
                    <th className="py-2.5 px-3">Faculty Instructor</th>
                    <th className="py-2.5 px-3">Class & Section</th>
                    <th className="py-2.5 px-3">Assigned Subject</th>
                    <th className="py-2.5 px-3">Role Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredAssignments.map((a) => (
                    <tr key={a.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#3B5BDB]/10 text-[#3B5BDB] flex items-center justify-center font-bold text-xs">
                            <Users size={14} />
                          </div>
                          <span className="font-bold text-[#172033]">{a.teacher_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="default" className="text-[10px]">
                          {a.class_name} - {a.section_name}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#3B5BDB]">{a.subject_name}</td>
                      <td className="py-3 px-3">
                        <Badge variant="success" className="text-[10px]">
                          Assigned
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Teacher Assignment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Assign Faculty to Class & Subject"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Select Teacher *
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:border-[#3B5BDB]"
            >
              <option value="bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0001">
                M. Saravanan (M.Sc, B.Ed)
              </option>
              <option value="bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0002">
                K. Malathi (M.A, M.Ed)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Select Class *
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => handleClassChangeInModal(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:border-[#3B5BDB]"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Select Section *
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:border-[#3B5BDB]"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Select Subject *
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:border-[#3B5BDB]"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm Assignment</Button>
          </div>
        </form>
      </Modal>

      {/* Add New Subject Modal */}
      <Modal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        title="Add Subject to Catalog"
      >
        <form onSubmit={handleCreateSubject} className="space-y-3.5">
          <Input
            label="Subject Name *"
            placeholder="e.g. Computer Science, Hindi, Environmental Science"
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
            required
          />

          <Input
            label="Subject Code"
            placeholder="e.g. CS-06, HIN-02"
            value={newSubCode}
            onChange={(e) => setNewSubCode(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Subject Overview / Syllabus
            </label>
            <textarea
              className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:border-[#3B5BDB]"
              rows={2}
              placeholder="Curriculum guidelines, weekly periods..."
              value={newSubDesc}
              onChange={(e) => setNewSubDesc(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="ghost" onClick={() => setIsAddSubjectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Subject</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

