import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Flag, Award, BookOpen, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'holiday' | 'exam' | 'event' | 'activity';
  start_date: string;
  end_date: string;
  description: string;
}

const initialEvents: CalendarEvent[] = [
  {
    id: 'evt-01',
    title: 'Mid-Term Summative Assessments',
    type: 'exam',
    start_date: '2026-11-20',
    end_date: '2026-11-27',
    description: 'Quarterly examinations across all grades.',
  },
  {
    id: 'evt-02',
    title: 'Annual Sports Day 2026',
    type: 'event',
    start_date: '2026-12-12',
    end_date: '2026-12-12',
    description: 'Inter-house athletic meet and track events at Nehru Stadium.',
  },
  {
    id: 'evt-03',
    title: 'Winter Vacation / Christmas Holidays',
    type: 'holiday',
    start_date: '2026-12-24',
    end_date: '2027-01-02',
    description: 'School reopens on Monday, January 4th.',
  },
  {
    id: 'evt-04',
    title: 'Science & Innovation Exhibition',
    type: 'activity',
    start_date: '2027-01-18',
    end_date: '2027-01-19',
    description: 'Annual project showcase by middle and high school students.',
  },
];

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['holiday', 'exam', 'event', 'activity']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  description: z.string().min(1, 'Description is required'),
});

type EventFormValues = z.infer<typeof eventSchema>;

export function CalendarPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: 'event',
    },
  });

  const handleAddEvent = (values: EventFormValues) => {
    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      ...values,
    };
    setEvents([...events, newEvt]);
    toast('success', 'Event Scheduled', `${values.title} added to the school calendar.`);
    setShowAddModal(false);
    reset();
  };

  const getBadgeVariant = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'holiday':
        return 'error';
      case 'exam':
        return 'warning';
      case 'event':
        return 'success';
      case 'activity':
        return 'info';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">School Calendar & Events</h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Manage academic terms, holidays, examination windows, and cultural activities
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> Add Calendar Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-xs flex items-start gap-4 hover:border-[#3B5BDB] transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col items-center justify-center shrink-0">
              <CalendarIcon size={18} className="text-[#3B5BDB]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={getBadgeVariant(evt.type)}>
                  {evt.type.toUpperCase()}
                </Badge>
                <span className="text-xs text-[#64748B] font-mono">
                  {evt.start_date} {evt.end_date !== evt.start_date && `to ${evt.end_date}`}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#172033] mt-2 leading-snug">{evt.title}</h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{evt.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule Calendar Event"
        size="md"
      >
        <form onSubmit={handleSubmit(handleAddEvent)} className="space-y-4">
          <Input
            label="Event Name"
            placeholder="e.g. Science Fair 2026"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <Select
            label="Category"
            options={[
              { value: 'event', label: 'School Event / Function' },
              { value: 'exam', label: 'Examination Schedule' },
              { value: 'holiday', label: 'Official Holiday' },
              { value: 'activity', label: 'Academic Activity' },
            ]}
            {...register('type')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              required
              error={errors.start_date?.message}
              {...register('start_date')}
            />
            <Input
              label="End Date"
              type="date"
              required
              error={errors.end_date?.message}
              {...register('end_date')}
            />
          </div>

          <Input
            label="Brief Description"
            placeholder="Details, timings, venue..."
            required
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Add to Calendar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

