import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Layers,
  Users,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  School,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import {
  academicService,
  SchoolClass,
  ClassSection,
  AcademicSession,
  AcademicSubject,
} from '@/services/academicService';
import { useAuth } from '@/contexts/AuthContext';

export function ClassesPage() {
  const { userRole } = useAuth();
  const { addToast } = useToast();

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [subjects, setSubjects] = useState<AcademicSubject[]>([]);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);

  // New Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [numericOrder, setNumericOrder] = useState<number>(1);
  const [classDescription, setClassDescription] = useState('');

  // New Section Form State
  const [newSectionName, setNewSectionName] = useState('');
  const [maxCapacity, setMaxCapacity] = useState<number>(40);
  const [sectionDescription, setSectionDescription] = useState('');

  const isSuperOrSchoolAdmin =
    userRole?.role === 'super_admin' || userRole?.role === 'school_admin';

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      loadClasses(selectedSessionId);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    if (selectedClass) {
      loadSectionsForClass(selectedClass.id);
    }
  }, [selectedClass]);

  const loadInitialData = async () => {
    const sessionList = await academicService.getSessions();
    setSessions(sessionList);

    const activeSession = sessionList.find((s) => s.is_current) || sessionList[0];
    if (activeSession) {
      setSelectedSessionId(activeSession.id);
      loadClasses(activeSession.id);
    }

    const subList = await academicService.getSubjects();
    setSubjects(subList);
  };

  const loadClasses = async (sessionId: string) => {
    const list = await academicService.getClasses(sessionId);
    setClasses(list);
    if (list.length > 0 && !selectedClass) {
      setSelectedClass(list[0]);
    }
  };

  const loadSectionsForClass = async (classId: string) => {
    const secs = await academicService.getSections(classId);
    setClassSections(secs);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName || !selectedSessionId) {
      addToast('Class Name and Academic Session are required', 'error');
      return;
    }

    // Check duplicate
    const exists = classes.some(
      (c) => c.name.toLowerCase() === newClassName.trim().toLowerCase()
    );
    if (exists) {
      addToast(`Class "${newClassName}" already exists in this academic session`, 'error');
      return;
    }

    try {
      const created = await academicService.createClass({
        school_id: userRole?.school_id || '11111111-1111-1111-1111-111111111111',
        academic_year_id: selectedSessionId,
        name: newClassName.trim(),
        code: newClassCode.trim() || `CLS-${numericOrder}`,
        numeric_order: Number(numericOrder),
        status: 'active',
        description: classDescription,
      });

      addToast(`Class ${created.name} added successfully`, 'success');
      setIsAddClassModalOpen(false);
      resetClassForm();
      loadClasses(selectedSessionId);
      setSelectedClass(created);
    } catch {
      addToast('Failed to create class', 'error');
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !newSectionName) {
      addToast('Section Name is required', 'error');
      return;
    }

    // Check duplicate
    const exists = classSections.some(
      (s) => s.name.toLowerCase() === newSectionName.trim().toLowerCase()
    );
    if (exists) {
      addToast(`Section "${newSectionName}" already exists for ${selectedClass.name}`, 'error');
      return;
    }

    try {
      await academicService.createSection({
        class_id: selectedClass.id,
        name: newSectionName.trim(),
        max_capacity: Number(maxCapacity),
        status: 'active',
        description: sectionDescription,
      });

      addToast(`Section ${newSectionName} added to ${selectedClass.name}`, 'success');
      setIsAddSectionModalOpen(false);
      resetSectionForm();
      loadSectionsForClass(selectedClass.id);
    } catch {
      addToast('Failed to create section', 'error');
    }
  };

  const resetClassForm = () => {
    setNewClassName('');
    setNewClassCode('');
    setNumericOrder(1);
    setClassDescription('');
  };

  const resetSectionForm = () => {
    setNewSectionName('');
    setMaxCapacity(40);
    setSectionDescription('');
  };

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
              Class & Section Architecture
            </h1>
            <Badge variant="info">Academic Master</Badge>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Dynamic grades, section capacities, class teacher allocations, and academic curriculum catalogs.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Session Switcher */}
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#172033] shadow-xs outline-none focus:border-[#3B5BDB]"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                Session {s.name} {s.is_current ? '(Active)' : ''}
              </option>
            ))}
          </select>

          {isSuperOrSchoolAdmin && (
            <Button onClick={() => setIsAddClassModalOpen(true)} size="sm">
              <Plus size={14} className="mr-1.5" /> Add Class
            </Button>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout: Classes List & Selected Class Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Classes Roster */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-[#172033]">
                Configured Classes ({classes.length})
              </CardTitle>
            </div>
            {/* Search Input */}
            <div className="mt-2 flex items-center gap-2 bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5">
              <Search size={14} className="text-[#64748B]" />
              <input
                type="text"
                placeholder="Search class by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-[#172033] w-full"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredClasses.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#94A3B8]">
                No classes configured yet for this session.
              </div>
            ) : (
              filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClass(cls)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedClass?.id === cls.id
                      ? 'border-[#3B5BDB] bg-[#3B5BDB]/5 shadow-xs'
                      : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        selectedClass?.id === cls.id
                          ? 'bg-[#3B5BDB] text-white'
                          : 'bg-[#F1F5F9] text-[#172554]'
                      }`}
                    >
                      {cls.numeric_order}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#172033]">{cls.name}</p>
                      <p className="text-[10px] text-[#64748B]">{cls.code || 'Standard'}</p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={selectedClass?.id === cls.id ? 'text-[#3B5BDB]' : 'text-[#94A3B8]'}
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Right Column: Class Details & Sections */}
        <div className="lg:col-span-2 space-y-5">
          {selectedClass ? (
            <>
              {/* Class Header Banner */}
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#172554] to-[#3B5BDB] text-white flex items-center justify-center font-bold text-lg shadow-md">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-[#172033]">{selectedClass.name}</h2>
                      <Badge variant="success">Active Grade</Badge>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Code: {selectedClass.code} • Order: {selectedClass.numeric_order} •{' '}
                      {selectedClass.description || 'General Standard Curriculum'}
                    </p>
                  </div>
                </div>

                {isSuperOrSchoolAdmin && (
                  <Button
                    size="sm"
                    onClick={() => setIsAddSectionModalOpen(true)}
                    className="bg-[#16A36A] hover:bg-[#138355] text-white"
                  >
                    <Plus size={14} className="mr-1.5" /> Add Section
                  </Button>
                )}
              </div>

              {/* Sections under this Class */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-[#172033]">
                        Class Sections ({classSections.length})
                      </CardTitle>
                      <CardDescription className="text-xs text-[#64748B]">
                        Subdivisions, capacity limits, and assigned class teacher leaders
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {classSections.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[#94A3B8]">
                      No sections created for {selectedClass.name} yet. Click "Add Section" above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {classSections.map((sec) => (
                        <div
                          key={sec.id}
                          className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 hover:border-[#3B5BDB]/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-[#172033]">
                              {selectedClass.name} - {sec.name}
                            </span>
                            <Badge variant="default" className="text-[10px]">
                              Cap: {sec.max_capacity}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#64748B]">
                            {sec.description || 'Standard classroom assignment'}
                          </p>
                          <div className="pt-2 border-t border-[#EEF2F6] flex justify-between items-center text-[11px] text-[#475569]">
                            <span>Class Teacher:</span>
                            <span className="font-semibold text-[#3B5BDB]">
                              {sec.class_teacher_id ? 'M. Saravanan' : 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Subject Curriculum Catalog for this Class */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold text-[#172033]">
                    Curriculum Subjects
                  </CardTitle>
                  <CardDescription className="text-xs text-[#64748B]">
                    Active subjects instructed in {selectedClass.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {subjects.slice(0, 5).map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-xl border border-[#E2E8F0] bg-white flex items-center gap-2.5 text-xs shadow-xs"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#3B5BDB]/10 text-[#3B5BDB] flex items-center justify-center font-bold shrink-0">
                          <BookOpen size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#172033] truncate">{sub.name}</p>
                          <p className="text-[10px] text-[#64748B]">{sub.code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-[#94A3B8]">
              Select a class on the left to view sections and details.
            </div>
          )}
        </div>
      </div>

      {/* Add Class Modal */}
      <Modal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        title="Add New Custom Class"
      >
        <form onSubmit={handleCreateClass} className="space-y-3.5">
          <Input
            label="Class / Grade Name *"
            placeholder="e.g. Grade 1, Grade 7, Pre-KG"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Class Code"
              placeholder="e.g. GR-01"
              value={newClassCode}
              onChange={(e) => setNewClassCode(e.target.value)}
            />
            <Input
              label="Sort / Numeric Order *"
              type="number"
              value={numericOrder}
              onChange={(e) => setNumericOrder(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Class Description
            </label>
            <textarea
              className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:border-[#3B5BDB]"
              rows={2}
              placeholder="Standard level, syllabus track..."
              value={classDescription}
              onChange={(e) => setClassDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="ghost" onClick={() => setIsAddClassModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Class</Button>
          </div>
        </form>
      </Modal>

      {/* Add Section Modal */}
      <Modal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        title={`Add Section to ${selectedClass?.name || 'Class'}`}
      >
        <form onSubmit={handleCreateSection} className="space-y-3.5">
          <Input
            label="Section Name *"
            placeholder="e.g. Section A, Section B, Section C"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            required
          />

          <Input
            label="Maximum Student Capacity *"
            type="number"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(Number(e.target.value))}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Section Remarks / Room Number
            </label>
            <textarea
              className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:border-[#3B5BDB]"
              rows={2}
              placeholder="Room 102, Science block..."
              value={sectionDescription}
              onChange={(e) => setSectionDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="ghost" onClick={() => setIsAddSectionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Section</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

