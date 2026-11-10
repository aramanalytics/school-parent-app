import React, { useState } from 'react';
import {
  Plus,
  Search,
  GraduationCap,
  Phone,
  Mail,
  BookOpen,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { initialTeachers, MockTeacher } from '@/lib/mockData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const teacherSchema = z.object({
  name: z.string().min(1, 'Teacher name is required'),
  employee_id: z.string().min(1, 'Employee ID is required'),
  email: z.string().email('Official email is required'),
  phone: z.string().min(10, 'Phone number is required'),
  qualification: z.string().min(1, 'Qualification is required'),
  subjects: z.string().min(1, 'At least one subject is required'),
  classes: z.string().min(1, 'At least one assigned class is required'),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

export function TeachersPage() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<MockTeacher[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<MockTeacher | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [page, setPage] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
  });

  const filteredTeachers = teachers.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(query) ||
      t.employee_id.toLowerCase().includes(query) ||
      t.subjects.some((s) => s.toLowerCase().includes(query))
    );
  });

  const handleAddTeacher = (values: TeacherFormValues) => {
    const newTeacher: MockTeacher = {
      id: `teacher-${Date.now()}`,
      name: values.name,
      employee_id: values.employee_id,
      email: values.email,
      phone: values.phone,
      qualification: values.qualification,
      subjects: values.subjects.split(',').map((s) => s.trim()),
      classes: values.classes.split(',').map((c) => c.trim()),
      is_active: true,
    };

    setTeachers([newTeacher, ...teachers]);
    toast('success', 'Teacher Added', `${values.name} added to school faculty.`);
    setShowAddModal(false);
    reset();
  };

  const handleToggleStatus = (id: string) => {
    setTeachers(
      teachers.map((t) => (t.id === id ? { ...t, is_active: !t.is_active } : t))
    );
    toast('info', 'Status Updated', 'Teacher status updated.');
  };

  const columns: Column<MockTeacher>[] = [
    {
      key: 'employee_id',
      header: 'Emp ID',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-[#3B5BDB]">
          {row.employee_id}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Faculty Member',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#3B5BDB]/10 text-[#3B5BDB] flex items-center justify-center font-bold text-xs">
            {row.name[0]}
          </div>
          <div>
            <p className="font-semibold text-xs text-[#172033]">{row.name}</p>
            <p className="text-[10px] text-[#64748B]">{row.qualification}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subjects',
      header: 'Subjects Taught',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.subjects.map((sub, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#172033] text-[11px] font-medium"
            >
              {sub}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'classes',
      header: 'Assigned Classes',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.classes.map((cls, i) => (
            <Badge key={i} variant="info">
              {cls}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (row) => (
        <div className="text-xs">
          <p className="text-[#172033] font-medium">{row.phone}</p>
          <p className="text-[#64748B] text-[10px]">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.is_active ? 'success' : 'error'}>
          {row.is_active ? 'Active' : 'On Leave'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTeacher(row);
              setShowViewModal(true);
            }}
          >
            <Eye size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(row.id)}
          >
            Toggle
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Faculty & Teachers</h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Manage teacher profiles, subject assignments, and timetable allocations
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> Add Faculty Member
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xs max-w-md">
        <Search size={15} className="text-[#64748B]" />
        <input
          type="text"
          placeholder="Search by teacher name, employee ID, or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-xs w-full"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredTeachers}
        page={page}
        totalPages={Math.ceil(filteredTeachers.length / 10) || 1}
        onPageChange={setPage}
        totalItems={filteredTeachers.length}
      />

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Faculty Member"
        description="Assign subjects and classrooms to the teacher"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleAddTeacher)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. M. Saravanan"
              required
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Employee ID"
              placeholder="e.g. EMP-0115"
              required
              error={errors.employee_id?.message}
              {...register('employee_id')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Official Email"
              type="email"
              placeholder="saravanan@sunriseschool.edu.in"
              required
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Mobile Number"
              placeholder="+91 98410 23456"
              required
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <Input
            label="Academic Qualification"
            placeholder="e.g. M.Sc Mathematics, B.Ed"
            required
            error={errors.qualification?.message}
            {...register('qualification')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Assigned Subjects (Comma Separated)"
              placeholder="e.g. Mathematics, Science"
              required
              error={errors.subjects?.message}
              {...register('subjects')}
            />
            <Input
              label="Assigned Classes (Comma Separated)"
              placeholder="e.g. Class 5-A, Class 6-A"
              required
              error={errors.classes?.message}
              {...register('classes')}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Add Faculty Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      {selectedTeacher && (
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Faculty Profile"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <h3 className="text-sm font-bold text-[#172033]">{selectedTeacher.name}</h3>
              <p className="text-xs font-mono font-semibold text-[#3B5BDB] mt-0.5">
                {selectedTeacher.employee_id}
              </p>
              <p className="text-[#64748B] mt-1">{selectedTeacher.qualification}</p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#172033] uppercase tracking-wider">
                Subjects & Classes
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedTeacher.subjects.map((s, i) => (
                  <Badge key={i} variant="info">{s}</Badge>
                ))}
                {selectedTeacher.classes.map((c, i) => (
                  <Badge key={i} variant="purple">{c}</Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setShowViewModal(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

