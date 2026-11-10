import React, { useState } from 'react';
import { NotebookPen, Plus, Calendar, BookOpen, Clock, CheckCircle2, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { initialHomework, MockHomework } from '@/lib/mockData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const homeworkSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  subject: z.string().min(1, 'Subject is required'),
  class_section: z.string().min(1, 'Class and section is required'),
  due_date: z.string().min(1, 'Due date is required'),
  description: z.string().min(1, 'Description is required'),
  assigned_by: z.string().min(1, 'Teacher name is required'),
});

type HomeworkFormValues = z.infer<typeof homeworkSchema>;

export function DiaryPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<MockHomework[]>(initialHomework);
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HomeworkFormValues>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: {
      subject: 'Mathematics',
      class_section: 'Class 5-A',
      assigned_by: 'M. Saravanan',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  });

  const handleCreateTask = (values: HomeworkFormValues) => {
    const newTask: MockHomework = {
      id: `hw-${Date.now()}`,
      ...values,
    };
    setTasks([newTask, ...tasks]);
    toast('success', 'Diary Task Assigned', 'Homework added to students daily diary.');
    setShowAddModal(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Student Diary & Homework</h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Daily homework assignments, teacher observations, and task deadlines
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> Assign Homework
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-[#3B5BDB] transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="purple">{task.class_section}</Badge>
                <span className="text-[11px] font-semibold text-[#E03131] flex items-center gap-1">
                  <Clock size={12} /> Due: {task.due_date}
                </span>
              </div>

              <span className="text-[11px] font-bold text-[#3B5BDB] uppercase tracking-wider block mb-1">
                {task.subject}
              </span>

              <h3 className="text-sm font-bold text-[#172033] leading-snug">{task.title}</h3>

              <p className="text-xs text-[#64748B] mt-2 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#F1F5F9]">
                {task.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#F1F5F9] text-[11px] text-[#64748B]">
              <span className="flex items-center gap-1">
                <User size={13} className="text-[#3B5BDB]" /> By {task.assigned_by}
              </span>
              <Badge variant="info">Assigned</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Assign Daily Homework"
        description="Pushed immediately to parents on their daily diary tab"
        size="md"
      >
        <form onSubmit={handleSubmit(handleCreateTask)} className="space-y-4">
          <Input
            label="Homework / Assignment Title"
            placeholder="e.g. Fractions Chapter 4 Exercises"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Subject"
              options={[
                { value: 'Mathematics', label: 'Mathematics' },
                { value: 'English', label: 'English' },
                { value: 'Science', label: 'Science' },
                { value: 'Tamil', label: 'Tamil' },
                { value: 'Social Science', label: 'Social Science' },
              ]}
              {...register('subject')}
            />

            <Select
              label="Class & Section"
              options={[
                { value: 'Class 5-A', label: 'Class 5-A' },
                { value: 'Class 5-B', label: 'Class 5-B' },
                { value: 'Class 6-A', label: 'Class 6-A' },
              ]}
              {...register('class_section')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Submission Due Date"
              type="date"
              required
              error={errors.due_date?.message}
              {...register('due_date')}
            />
            <Input
              label="Assigned By (Faculty Name)"
              required
              error={errors.assigned_by?.message}
              {...register('assigned_by')}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172033] uppercase tracking-wider block mb-1.5">
              Task Instructions & Exercises
            </label>
            <textarea
              rows={3}
              placeholder="Specify questions, notebook pages, or exercises..."
              className="w-full px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-xs outline-none focus:border-[#3B5BDB]"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-[#E03131] mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Publish to Diary
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

