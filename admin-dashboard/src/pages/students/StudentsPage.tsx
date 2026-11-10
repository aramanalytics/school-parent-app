import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  User,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Phone,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { initialStudents, MockStudent } from '@/lib/mockData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const studentSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  admission_number: z.string().min(1, 'Admission number is required'),
  roll_number: z.string().min(1, 'Roll number is required'),
  gender: z.enum(['male', 'female', 'other']),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  class_name: z.string().min(1, 'Class is required'),
  section_name: z.string().min(1, 'Section is required'),
  parent_name: z.string().min(1, 'Parent / Guardian name is required'),
  parent_phone: z.string().min(10, 'Valid 10-digit phone number is required'),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export function StudentsPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<MockStudent[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<MockStudent | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [page, setPage] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: 'male',
      class_name: 'Class 5',
      section_name: 'Section A',
    },
  });

  const filteredStudents = students.filter((std) => {
    const fullName = `${std.first_name} ${std.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      fullName.includes(query) || std.admission_number.toLowerCase().includes(query);
    const matchesClass = classFilter ? std.class_name === classFilter : true;
    return matchesSearch && matchesClass;
  });

  const handleAddStudent = (values: StudentFormValues) => {
    const newStudent: MockStudent = {
      id: `std-${Date.now()}`,
      ...values,
      is_active: true,
      photo_url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&h=150&fit=crop`,
    };

    setStudents([newStudent, ...students]);
    toast('success', 'Student Enrolled', `${values.first_name} has been enrolled successfully.`);
    setShowAddModal(false);
    reset();
  };

  const handleToggleStatus = (id: string) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
    toast('info', 'Status Updated', 'Student enrollment status toggled.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to deactivate and remove this student?')) {
      setStudents(students.filter((s) => s.id !== id));
      toast('warning', 'Student Removed', 'Record removed from active register.');
    }
  };

  const exportCSV = () => {
    const headers = ['Adm No', 'First Name', 'Last Name', 'Class', 'Section', 'Roll No', 'Parent', 'Phone'];
    const rows = filteredStudents.map((s) => [
      s.admission_number,
      s.first_name,
      s.last_name,
      s.class_name,
      s.section_name,
      s.roll_number,
      s.parent_name,
      s.parent_phone,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('success', 'Export Complete', 'Downloaded student roster as CSV.');
  };

  const columns: Column<MockStudent>[] = [
    {
      key: 'admission_number',
      header: 'Adm No.',
      render: (row) => (
        <span className="font-semibold text-[#3B5BDB] font-mono text-xs">
          {row.admission_number}
        </span>
      ),
    },
    {
      key: 'student',
      header: 'Student Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.photo_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop'}
            alt={row.first_name}
            className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]"
          />
          <div>
            <p className="font-semibold text-xs text-[#172033]">
              {row.first_name} {row.last_name}
            </p>
            <p className="text-[10px] text-[#64748B]">DOB: {row.date_of_birth}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'class',
      header: 'Class & Sec',
      render: (row) => (
        <span className="text-xs font-medium">
          {row.class_name} • {row.section_name}
        </span>
      ),
    },
    {
      key: 'roll_number',
      header: 'Roll No',
      render: (row) => <span className="text-xs font-mono">{row.roll_number}</span>,
    },
    {
      key: 'parent',
      header: 'Parent / Contact',
      render: (row) => (
        <div>
          <p className="text-xs font-medium text-[#172033]">{row.parent_name}</p>
          <p className="text-[10px] text-[#64748B]">{row.parent_phone}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.is_active ? 'success' : 'error'}>
          {row.is_active ? 'Active' : 'Inactive'}
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
              setSelectedStudent(row);
              setShowViewModal(true);
            }}
            title="View Details"
          >
            <Eye size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(row.id)}
            title="Toggle Status"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#E03131] hover:text-[#E03131]"
            onClick={() => handleDelete(row.id)}
            title="Delete"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Student Directory</h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Manage student registrations, classroom assignments, and parent linkages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download size={14} /> Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Enroll New Student
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 w-72">
          <Search size={15} className="text-[#64748B]" />
          <input
            type="text"
            placeholder="Search by name or admission no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full"
          />
        </div>

        <div className="w-40">
          <Select
            options={[
              { value: '', label: 'All Classes' },
              { value: 'Class 5', label: 'Class 5' },
              { value: 'Class 6', label: 'Class 6' },
            ]}
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          />
        </div>

        <div className="ml-auto text-xs font-semibold text-[#64748B]">
          Total: <span className="text-[#172033]">{filteredStudents.length}</span> students
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredStudents}
        page={page}
        totalPages={Math.ceil(filteredStudents.length / 10) || 1}
        onPageChange={setPage}
        totalItems={filteredStudents.length}
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Enroll New Student"
        description="Add a student record and link to their parent profile"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleAddStudent)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="e.g. Aarav"
              required
              error={errors.first_name?.message}
              {...register('first_name')}
            />
            <Input
              label="Last Name"
              placeholder="e.g. Krishnan"
              required
              error={errors.last_name?.message}
              {...register('last_name')}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Admission Number"
              placeholder="e.g. ADM2026-0504"
              required
              error={errors.admission_number?.message}
              {...register('admission_number')}
            />
            <Input
              label="Roll Number"
              placeholder="e.g. 04"
              required
              error={errors.roll_number?.message}
              {...register('roll_number')}
            />
            <Select
              label="Gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              {...register('gender')}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              required
              error={errors.date_of_birth?.message}
              {...register('date_of_birth')}
            />
            <Select
              label="Class"
              options={[
                { value: 'Class 5', label: 'Class 5' },
                { value: 'Class 6', label: 'Class 6' },
              ]}
              {...register('class_name')}
            />
            <Select
              label="Section"
              options={[
                { value: 'Section A', label: 'Section A' },
                { value: 'Section B', label: 'Section B' },
              ]}
              {...register('section_name')}
            />
          </div>

          <div className="pt-2 border-t border-[#F1F5F9]">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
              Parent / Guardian Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Parent Name"
                placeholder="e.g. Ramesh Krishnan"
                required
                error={errors.parent_name?.message}
                {...register('parent_name')}
              />
              <Input
                label="Parent Mobile Phone"
                placeholder="+91 98840 11223"
                required
                error={errors.parent_phone?.message}
                {...register('parent_phone')}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Complete Enrollment
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Student Profile Modal */}
      {selectedStudent && (
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Student Profile Overview"
          size="md"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <img
                src={selectedStudent.photo_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop'}
                alt={selectedStudent.first_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#3B5BDB]"
              />
              <div>
                <h3 className="text-base font-bold text-[#172033]">
                  {selectedStudent.first_name} {selectedStudent.last_name}
                </h3>
                <p className="text-xs font-semibold text-[#3B5BDB] font-mono mt-0.5">
                  {selectedStudent.admission_number}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={selectedStudent.is_active ? 'success' : 'error'}>
                    {selectedStudent.is_active ? 'Enrolled' : 'Inactive'}
                  </Badge>
                  <span className="text-xs text-[#64748B]">
                    {selectedStudent.class_name} • {selectedStudent.section_name}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-[#F1F5F9] bg-white">
                <p className="text-[#64748B] font-medium">Roll Number</p>
                <p className="font-bold text-[#172033] mt-0.5">{selectedStudent.roll_number}</p>
              </div>
              <div className="p-3 rounded-lg border border-[#F1F5F9] bg-white">
                <p className="text-[#64748B] font-medium">Date of Birth</p>
                <p className="font-bold text-[#172033] mt-0.5">{selectedStudent.date_of_birth}</p>
              </div>
              <div className="p-3 rounded-lg border border-[#F1F5F9] bg-white">
                <p className="text-[#64748B] font-medium">Gender</p>
                <p className="font-bold text-[#172033] mt-0.5 capitalize">{selectedStudent.gender}</p>
              </div>
              <div className="p-3 rounded-lg border border-[#F1F5F9] bg-white">
                <p className="text-[#64748B] font-medium">Academic Year</p>
                <p className="font-bold text-[#172033] mt-0.5">2026 - 2027</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white space-y-2">
              <p className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
                <Phone size={14} className="text-[#3B5BDB]" /> Guardian Information
              </p>
              <div className="text-xs text-[#64748B] space-y-1">
                <p><span className="font-medium text-[#172033]">Name:</span> {selectedStudent.parent_name}</p>
                <p><span className="font-medium text-[#172033]">Mobile:</span> {selectedStudent.parent_phone}</p>
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

