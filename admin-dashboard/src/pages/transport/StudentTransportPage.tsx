import React, { useState } from 'react';
import {
  Bus,
  Search,
  Plus,
  Users,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  mockStudentAssignments,
  mockBuses,
  mockRoutes,
  StudentTransportAssignment
} from '@/lib/transportData';

export function StudentTransportPage() {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<StudentTransportAssignment[]>(mockStudentAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [showAssignModal, setShowAssignModal] = useState(false);

  // New assignment form state
  const [newAssignment, setNewAssignment] = useState({
    studentName: '',
    admissionNo: '',
    classSection: 'Class 5-A',
    busId: 'bus-01',
    routeId: 'route-01',
    pickupStopId: 'stop-1-3',
    parentName: '',
    parentPhone: '',
  });

  const filteredAssignments = assignments.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pickupStopName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || item.classSection.startsWith(selectedClass);
    return matchesSearch && matchesClass;
  });

  const selectedRouteObj = mockRoutes.find((r) => r.id === newAssignment.routeId);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.studentName || !newAssignment.admissionNo) {
      toast('error', 'Incomplete Details', 'Student name and admission number are required.');
      return;
    }

    const bus = mockBuses.find((b) => b.id === newAssignment.busId);
    const route = mockRoutes.find((r) => r.id === newAssignment.routeId);
    const stop = route?.stops.find((s) => s.id === newAssignment.pickupStopId) || route?.stops[0];

    const assignment: StudentTransportAssignment = {
      id: `ta-0${assignments.length + 1}`,
      studentId: `stud-new-${Date.now()}`,
      studentName: newAssignment.studentName,
      admissionNo: newAssignment.admissionNo,
      classSection: newAssignment.classSection,
      busId: newAssignment.busId,
      busNumber: bus?.busNumber || 'AVK BUS 01',
      routeId: newAssignment.routeId,
      routeName: route?.name || 'Sankarankovil Town to Campus Route A',
      pickupStopId: stop?.id || 'stop-1-1',
      pickupStopName: stop?.name || 'Main Bus Depot',
      pickupTime: stop?.pickupTime || '07:15 AM',
      dropStopId: stop?.id || 'stop-1-1',
      dropStopName: stop?.name || 'Main Bus Depot',
      dropTime: stop?.dropTime || '04:30 PM',
      parentName: newAssignment.parentName || 'Parent / Guardian',
      parentPhone: newAssignment.parentPhone || '+91 98000 00000',
      status: 'active',
    };

    setAssignments([...assignments, assignment]);
    setShowAssignModal(false);
    toast('success', 'Transport Assigned', `${assignment.studentName} assigned to ${assignment.busNumber}.`);
  };

  const handleDelete = (id: string, name: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
    toast('info', 'Assignment Removed', `Transport assignment for ${name} removed.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
              Student Transport Assignment
            </h1>
            <Badge variant="info">Bus Passes & Allocation</Badge>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL &bull; Manage student bus seat allocations and stops
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowAssignModal(true)}>
            <Plus size={14} className="mr-1.5" /> Assign Student Transport
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search student, admission no, or stop..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#3B5BDB]/20 focus:border-[#3B5BDB]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg bg-white"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="all">All Classes</option>
            <option value="Class 3">Class 3</option>
            <option value="Class 5">Class 5</option>
            <option value="Class 6">Class 6</option>
            <option value="Class 8">Class 8</option>
          </select>

          <span className="text-xs text-[#64748B] font-medium shrink-0">
            {filteredAssignments.length} Students Allocated
          </span>
        </div>
      </div>

      {/* Student Transport Assignment Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Class / Section</th>
                <th className="p-3.5">Assigned Bus</th>
                <th className="p-3.5">Route & Boarding Stop</th>
                <th className="p-3.5">Scheduled Times</th>
                <th className="p-3.5">Parent Contact</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredAssignments.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3.5 font-semibold text-[#172033]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#DBE4FF] text-[#3B5BDB] flex items-center justify-center font-bold text-xs">
                        {item.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#172033]">{item.studentName}</p>
                        <p className="text-[11px] font-mono text-[#64748B]">{item.admissionNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="purple">{item.classSection}</Badge>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#172554]">
                      <Bus size={14} className="text-[#3B5BDB]" /> {item.busNumber}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-[#172033] flex items-center gap-1">
                      <MapPin size={12} className="text-emerald-600" /> {item.pickupStopName}
                    </p>
                    <p className="text-[11px] text-[#64748B] truncate max-w-[200px] mt-0.5">
                      {item.routeName}
                    </p>
                  </td>
                  <td className="p-3.5 text-[#172033]">
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1 text-[11px]">
                        <span className="text-[#64748B]">Pick:</span> <strong>{item.pickupTime}</strong>
                      </p>
                      <p className="flex items-center gap-1 text-[11px]">
                        <span className="text-[#64748B]">Drop:</span> <strong>{item.dropTime}</strong>
                      </p>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <p className="text-[11px] font-medium text-[#172033]">{item.parentName}</p>
                    <a
                      href={`tel:${item.parentPhone.replace(/\s+/g, '')}`}
                      className="text-[11px] text-[#3B5BDB] hover:underline flex items-center gap-1"
                    >
                      <Phone size={10} /> {item.parentPhone}
                    </a>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(item.id, item.studentName)}
                      className="p-1.5 text-[#64748B] hover:text-[#E03131] rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove Assignment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN TRANSPORT MODAL */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Student to School Bus"
        size="md"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <Input
            label="Student Full Name"
            placeholder="e.g. M. Rajesh"
            required
            value={newAssignment.studentName}
            onChange={(e) => setNewAssignment({ ...newAssignment, studentName: e.target.value })}
          />

          <Input
            label="Admission Number"
            placeholder="e.g. AVK-2025-0912"
            required
            value={newAssignment.admissionNo}
            onChange={(e) => setNewAssignment({ ...newAssignment, admissionNo: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Class & Section</label>
            <select
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg bg-white"
              value={newAssignment.classSection}
              onChange={(e) => setNewAssignment({ ...newAssignment, classSection: e.target.value })}
            >
              <option value="Class 1-A">Class 1-A</option>
              <option value="Class 2-A">Class 2-A</option>
              <option value="Class 3-B">Class 3-B</option>
              <option value="Class 5-A">Class 5-A</option>
              <option value="Class 6-B">Class 6-B</option>
              <option value="Class 8-A">Class 8-A</option>
              <option value="Class 10-A">Class 10-A</option>
              <option value="Class 12-A">Class 12-A</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Assigned Bus</label>
            <select
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg bg-white"
              value={newAssignment.busId}
              onChange={(e) => setNewAssignment({ ...newAssignment, busId: e.target.value })}
            >
              {mockBuses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.busNumber} ({b.occupiedSeats}/{b.capacity} Seats occupied)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Route</label>
            <select
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg bg-white"
              value={newAssignment.routeId}
              onChange={(e) => setNewAssignment({ ...newAssignment, routeId: e.target.value })}
            >
              {mockRoutes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Boarding & Drop Stop</label>
            <select
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg bg-white"
              value={newAssignment.pickupStopId}
              onChange={(e) => setNewAssignment({ ...newAssignment, pickupStopId: e.target.value })}
            >
              {selectedRouteObj?.stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Pick: {s.pickupTime} / Drop: {s.dropTime})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Parent / Guardian Name"
            placeholder="e.g. R. Mohan"
            value={newAssignment.parentName}
            onChange={(e) => setNewAssignment({ ...newAssignment, parentName: e.target.value })}
          />

          <Input
            label="Parent Emergency Phone"
            placeholder="e.g. +91 94432 00123"
            value={newAssignment.parentPhone}
            onChange={(e) => setNewAssignment({ ...newAssignment, parentPhone: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" type="button" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Assign Transport</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
