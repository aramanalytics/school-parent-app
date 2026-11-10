import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Filter,
  Users,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { initialStudents } from '@/lib/mockData';

interface StudentAttendanceState {
  id: string;
  admission_number: string;
  name: string;
  roll_number: string;
  status: 'present' | 'absent' | 'late';
  remarks: string;
}

export function AttendancePage() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  // Initialize students attendance roster for the selected class/section
  const [roster, setRoster] = useState<StudentAttendanceState[]>(() =>
    initialStudents.map((s) => ({
      id: s.id,
      admission_number: s.admission_number,
      name: `${s.first_name} ${s.last_name}`,
      roll_number: s.roll_number,
      status: 'present',
      remarks: '',
    }))
  );

  const [saving, setSaving] = useState(false);

  const presentCount = roster.filter((s) => s.status === 'present').length;
  const absentCount = roster.filter((s) => s.status === 'absent').length;
  const lateCount = roster.filter((s) => s.status === 'late').length;
  const percentage = Math.round((presentCount / roster.length) * 100) || 0;

  const setStatus = (id: string, status: 'present' | 'absent' | 'late') => {
    setRoster(roster.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const setRemarks = (id: string, remarks: string) => {
    setRoster(roster.map((s) => (s.id === id ? { ...s, remarks } : s)));
  };

  const markAll = (status: 'present' | 'absent') => {
    setRoster(roster.map((s) => ({ ...s, status })));
    toast('info', 'Bulk Updated', `Marked all students as ${status}.`);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast(
        'success',
        'Attendance Recorded',
        `Attendance saved for ${selectedClass} - ${selectedSection} on ${selectedDate} (${presentCount} Present, ${absentCount} Absent).`
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
            Attendance Register
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Daily roll call, late arrival tracking, and monthly attendance computation
          </p>
        </div>
        <Button onClick={handleSave} loading={saving} size="sm">
          <Save size={15} /> Save Attendance Records
        </Button>
      </div>

      {/* Class & Date Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <Select
            label="Class"
            options={[
              { value: 'Class 5', label: 'Class 5' },
              { value: 'Class 6', label: 'Class 6' },
            ]}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          />
        </div>
        <div>
          <Select
            label="Section"
            options={[
              { value: 'Section A', label: 'Section A' },
              { value: 'Section B', label: 'Section B' },
            ]}
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#172033] uppercase tracking-wider block mb-1.5">
            Attendance Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-sm bg-white outline-none focus:border-[#3B5BDB]"
          />
        </div>
        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-9.5"
            onClick={() => markAll('present')}
          >
            All Present
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-9.5 text-[#E03131]"
            onClick={() => markAll('absent')}
          >
            All Absent
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64748B] font-medium">Total Roll</p>
            <p className="text-xl font-bold text-[#172033]">{roster.length}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#F1F5F9] text-[#172033]">
            <Users size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64748B] font-medium">Present</p>
            <p className="text-xl font-bold text-[#16A36A]">{presentCount}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#D3F9D8] text-[#16A36A]">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64748B] font-medium">Absent</p>
            <p className="text-xl font-bold text-[#E03131]">{absentCount}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FFE3E3] text-[#E03131]">
            <XCircle size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64748B] font-medium">Attendance %</p>
            <p className="text-xl font-bold text-[#3B5BDB]">{percentage}%</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#DBE4FF] text-[#3B5BDB]">
            <CalendarCheck size={18} />
          </div>
        </div>
      </div>

      {/* Roll Call Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <h2 className="text-sm font-bold text-[#172033]">
            Roster: {selectedClass} - {selectedSection} ({selectedDate})
          </h2>
          <span className="text-xs text-[#64748B] font-medium">
            Click status pill to toggle
          </span>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {roster.map((student) => (
            <div
              key={student.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC]/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#172033] flex items-center justify-center font-mono font-bold text-xs">
                  {student.roll_number}
                </span>
                <div>
                  <p className="text-xs font-bold text-[#172033]">{student.name}</p>
                  <p className="text-[10px] text-[#64748B] font-mono">
                    {student.admission_number}
                  </p>
                </div>
              </div>

              {/* Status Radio Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatus(student.id, 'present')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    student.status === 'present'
                      ? 'bg-[#16A36A] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                  }`}
                >
                  <CheckCircle2 size={13} /> Present
                </button>

                <button
                  type="button"
                  onClick={() => setStatus(student.id, 'absent')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    student.status === 'absent'
                      ? 'bg-[#E03131] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                  }`}
                >
                  <XCircle size={13} /> Absent
                </button>

                <button
                  type="button"
                  onClick={() => setStatus(student.id, 'late')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    student.status === 'late'
                      ? 'bg-[#F2A93B] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                  }`}
                >
                  <Clock size={13} /> Late
                </button>

                {/* Remarks Input */}
                <input
                  type="text"
                  placeholder="Optional remarks..."
                  value={student.remarks}
                  onChange={(e) => setRemarks(student.id, e.target.value)}
                  className="px-2.5 py-1 text-xs border border-[#E2E8F0] rounded-lg outline-none w-44 focus:border-[#3B5BDB]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

