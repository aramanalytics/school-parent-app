import React, { useState } from 'react';
import {
  Plus,
  Search,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Eye,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { initialParents, MockParent } from '@/lib/mockData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const parentSchema = z.object({
  name: z.string().min(1, 'Parent name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  email: z.string().email('Valid email address is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  address: z.string().min(1, 'Address is required'),
  children_input: z.string().min(1, 'At least one student name/adm no is required'),
});

type ParentFormValues = z.infer<typeof parentSchema>;

export function ParentsPage() {
  const { toast } = useToast();
  const [parents, setParents] = useState<MockParent[]>(initialParents);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState<MockParent | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [page, setPage] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ParentFormValues>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      relationship: 'Father',
    },
  });

  const filteredParents = parents.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.phone.includes(query) ||
      p.email.toLowerCase().includes(query)
    );
  });

  const handleAddParent = (values: ParentFormValues) => {
    const newParent: MockParent = {
      id: `parent-${Date.now()}`,
      name: values.name,
      phone: values.phone,
      email: values.email,
      relationship: values.relationship,
      address: values.address,
      children: values.children_input.split(',').map((c) => c.trim()),
      is_active: true,
    };

    setParents([newParent, ...parents]);
    toast('success', 'Parent Registered', `${values.name} added to parent registry.`);
    setShowAddModal(false);
    reset();
  };

  const handleToggleStatus = (id: string) => {
    setParents(
      parents.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    );
    toast('info', 'Status Updated', 'Parent access status updated.');
  };

  const columns: Column<MockParent>[] = [
    {
      key: 'name',
      header: 'Parent Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#172554]/10 text-[#172554] flex items-center justify-center font-bold text-xs">
            {row.name[0]}
          </div>
          <div>
            <p className="font-semibold text-xs text-[#172033]">{row.name}</p>
            <p className="text-[10px] text-[#64748B]">{row.relationship}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Details',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="flex items-center gap-1.5 text-[#172033]">
            <Phone size={12} className="text-[#3B5BDB]" /> {row.phone}
          </p>
          <p className="flex items-center gap-1.5 text-[#64748B]">
            <Mail size={12} className="text-[#94A3B8]" /> {row.email}
          </p>
        </div>
      ),
    },
    {
      key: 'children',
      header: 'Linked Wards / Students',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.children.map((child, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#DBE4FF]/60 text-[#3B5BDB] text-[11px] font-medium"
            >
              <GraduationCap size={12} />
              {child}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'App Access',
      render: (row) => (
        <Badge variant={row.is_active ? 'success' : 'error'}>
          {row.is_active ? 'Active' : 'Disabled'}
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
              setSelectedParent(row);
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
            Toggle Access
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Parent Registry</h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Manage guardian accounts, verify mobile OTP access, and link children
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> Register Parent
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xs max-w-md">
        <Search size={15} className="text-[#64748B]" />
        <input
          type="text"
          placeholder="Search by parent name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-xs w-full"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredParents}
        page={page}
        totalPages={Math.ceil(filteredParents.length / 10) || 1}
        onPageChange={setPage}
        totalItems={filteredParents.length}
      />

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register Parent Account"
        description="Parents authenticate via Phone OTP using their registered phone number"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleAddParent)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Ramesh Krishnan"
              required
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Registered Phone Number (For OTP Login)"
              placeholder="+91 98840 11223"
              required
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="ramesh@gmail.com"
              required
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Relationship"
              placeholder="e.g. Father / Mother"
              required
              error={errors.relationship?.message}
              {...register('relationship')}
            />
          </div>

          <Input
            label="Residential Address"
            placeholder="Plot / Street / City"
            required
            error={errors.address?.message}
            {...register('address')}
          />

          <Input
            label="Linked Children (Comma Separated)"
            placeholder="e.g. Aarav Krishnan (Class 5-A), Diya Krishnan (Class 5-B)"
            required
            error={errors.children_input?.message}
            {...register('children_input')}
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Register Parent
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      {selectedParent && (
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Parent & Guardian Details"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <h3 className="text-sm font-bold text-[#172033]">{selectedParent.name}</h3>
              <p className="text-[#3B5BDB] font-medium mt-0.5">{selectedParent.relationship}</p>
              <div className="mt-3 space-y-1.5 text-[#64748B]">
                <p className="flex items-center gap-2">
                  <Phone size={13} className="text-[#3B5BDB]" /> {selectedParent.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={13} className="text-[#3B5BDB]" /> {selectedParent.email}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#3B5BDB]" /> {selectedParent.address}
                </p>
              </div>
            </div>

            <div>
              <p className="font-bold text-[#172033] uppercase tracking-wider mb-2">
                Enrolled Children
              </p>
              <div className="space-y-2">
                {selectedParent.children.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-[#E2E8F0] flex items-center justify-between"
                  >
                    <span className="font-semibold text-[#172033]">{c}</span>
                    <Badge variant="info">Linked</Badge>
                  </div>
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

