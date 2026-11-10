import React, { useState } from 'react';
import { Clock, Plus, BookOpen, Coffee, Edit, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

interface PeriodSlot {
  period: number;
  time: string;
  subject: string;
  teacher: string;
  is_break?: boolean;
}

const defaultSchedule: Record<string, PeriodSlot[]> = {
  Monday: [
    { period: 1, time: '09:00 - 09:45', subject: 'English', teacher: 'K. Malathi' },
    { period: 2, time: '09:45 - 10:30', subject: 'Mathematics', teacher: 'M. Saravanan' },
    { period: 0, time: '10:30 - 10:45', subject: 'Morning Interval', teacher: '', is_break: true },
    { period: 3, time: '10:45 - 11:30', subject: 'Science', teacher: 'M. Saravanan' },
    { period: 4, time: '11:30 - 12:15', subject: 'Tamil', teacher: 'K. Malathi' },
    { period: 0, time: '12:15 - 13:00', subject: 'Lunch Break', teacher: '', is_break: true },
    { period: 5, time: '13:00 - 13:45', subject: 'Social Science', teacher: 'S. Jayaraman' },
    { period: 6, time: '13:45 - 14:30', subject: 'Physical Education', teacher: 'R. Kannan' },
  ],
  Tuesday: [
    { period: 1, time: '09:00 - 09:45', subject: 'Mathematics', teacher: 'M. Saravanan' },
    { period: 2, time: '09:45 - 10:30', subject: 'Science', teacher: 'M. Saravanan' },
    { period: 0, time: '10:30 - 10:45', subject: 'Morning Interval', teacher: '', is_break: true },
    { period: 3, time: '10:45 - 11:30', subject: 'English', teacher: 'K. Malathi' },
    { period: 4, time: '11:30 - 12:15', subject: 'Computer Science', teacher: 'S. Jayaraman' },
    { period: 0, time: '12:15 - 13:00', subject: 'Lunch Break', teacher: '', is_break: true },
    { period: 5, time: '13:00 - 13:45', subject: 'Tamil', teacher: 'K. Malathi' },
    { period: 6, time: '13:45 - 14:30', subject: 'Library & Reading', teacher: 'Librarian' },
  ],
  Wednesday: [
    { period: 1, time: '09:00 - 09:45', subject: 'Science Lab', teacher: 'M. Saravanan' },
    { period: 2, time: '09:45 - 10:30', subject: 'English', teacher: 'K. Malathi' },
    { period: 0, time: '10:30 - 10:45', subject: 'Morning Interval', teacher: '', is_break: true },
    { period: 3, time: '10:45 - 11:30', subject: 'Mathematics', teacher: 'M. Saravanan' },
    { period: 4, time: '11:30 - 12:15', subject: 'Social Science', teacher: 'S. Jayaraman' },
    { period: 0, time: '12:15 - 13:00', subject: 'Lunch Break', teacher: '', is_break: true },
    { period: 5, time: '13:00 - 13:45', subject: 'Arts & Craft', teacher: 'Ananya S.' },
    { period: 6, time: '13:45 - 14:30', subject: 'Tamil', teacher: 'K. Malathi' },
  ],
  Thursday: [
    { period: 1, time: '09:00 - 09:45', subject: 'Tamil', teacher: 'K. Malathi' },
    { period: 2, time: '09:45 - 10:30', subject: 'Social Science', teacher: 'S. Jayaraman' },
    { period: 0, time: '10:30 - 10:45', subject: 'Morning Interval', teacher: '', is_break: true },
    { period: 3, time: '10:45 - 11:30', subject: 'Mathematics', teacher: 'M. Saravanan' },
    { period: 4, time: '11:30 - 12:15', subject: 'Science', teacher: 'M. Saravanan' },
    { period: 0, time: '12:15 - 13:00', subject: 'Lunch Break', teacher: '', is_break: true },
    { period: 5, time: '13:00 - 13:45', subject: 'English', teacher: 'K. Malathi' },
    { period: 6, time: '13:45 - 14:30', subject: 'Yoga & Value Ed', teacher: 'R. Kannan' },
  ],
  Friday: [
    { period: 1, time: '09:00 - 09:45', subject: 'Mathematics', teacher: 'M. Saravanan' },
    { period: 2, time: '09:45 - 10:30', subject: 'Science', teacher: 'M. Saravanan' },
    { period: 0, time: '10:30 - 10:45', subject: 'Morning Interval', teacher: '', is_break: true },
    { period: 3, time: '10:45 - 11:30', subject: 'English', teacher: 'K. Malathi' },
    { period: 4, time: '11:30 - 12:15', subject: 'Tamil', teacher: 'K. Malathi' },
    { period: 0, time: '12:15 - 13:00', subject: 'Lunch Break', teacher: '', is_break: true },
    { period: 5, time: '13:00 - 13:45', subject: 'Music / Drama', teacher: 'Sangeetha R.' },
    { period: 6, time: '13:45 - 14:30', subject: 'Club Activity', teacher: 'Class Teacher' },
  ],
};

export function TimetablePage() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [activeDay, setActiveDay] = useState('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const daySchedule = defaultSchedule[activeDay] || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Class Timetable</h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Manage period slots, assign subject teachers, and prevent faculty scheduling overlaps
          </p>
        </div>
        <Button size="sm" onClick={() => toast('info', 'Edit Mode', 'Timetable slot editor opened.')}>
          <Plus size={14} /> Add Period Slot
        </Button>
      </div>

      {/* Select Class & Day */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-40">
            <Select
              options={[
                { value: 'Class 5', label: 'Class 5' },
                { value: 'Class 6', label: 'Class 6' },
              ]}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Select
              options={[
                { value: 'Section A', label: 'Section A' },
                { value: 'Section B', label: 'Section B' },
              ]}
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            />
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeDay === day
                  ? 'bg-[#3B5BDB] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Period Cards Grid */}
      <div className="space-y-3">
        {daySchedule.map((slot, idx) => {
          if (slot.is_break) {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]"
              >
                <div className="flex items-center gap-2.5">
                  <Coffee size={16} className="text-[#F2A93B]" />
                  <span className="font-semibold text-[#172033]">{slot.subject}</span>
                </div>
                <span className="font-mono">{slot.time}</span>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#3B5BDB] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-xl bg-[#DBE4FF] text-[#3B5BDB] flex items-center justify-center font-bold text-xs">
                  P{slot.period}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#172033]">{slot.subject}</h4>
                  <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
                    <span>Teacher:</span>
                    <span className="font-medium text-[#172033]">{slot.teacher}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-mono">
                  <Clock size={14} className="text-[#94A3B8]" />
                  <span>{slot.time}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast('info', 'Edit Slot', `Modifying Period ${slot.period}`)}
                >
                  <Edit size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

