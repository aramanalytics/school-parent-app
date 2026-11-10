import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Paperclip,
  Calendar,
  Eye,
  CheckCircle2,
  Trash2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { initialNotices, MockNotice } from '@/lib/mockData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Notice content is required'),
  target_type: z.enum(['all', 'class', 'section']),
  target_class: z.string().optional(),
  attachment_name: z.string().optional(),
});

type NoticeFormValues = z.infer<typeof noticeSchema>;

export function NoticesPage() {
  const { toast } = useToast();
  const [notices, setNotices] = useState<MockNotice[]>(initialNotices);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<MockNotice | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      target_type: 'all',
    },
  });

  const selectedTargetType = watch('target_type');

  const handleCreateNotice = (values: NoticeFormValues) => {
    const newNotice: MockNotice = {
      id: `not-${Date.now()}`,
      title: values.title,
      content: values.content,
      target_type: values.target_type,
      target_class: values.target_class || 'All Classes',
      status: 'published',
      published_at: new Date().toISOString().slice(0, 10),
      attachment_name: values.attachment_name || undefined,
    };

    setNotices([newNotice, ...notices]);
    toast('success', 'Circular Published', 'Sent to student diaries and parent mobile notices.');
    setShowAddModal(false);
    reset();
  };

  const handleDelete = (id: string) => {
    setNotices(notices.filter((n) => n.id !== id));
    toast('info', 'Notice Archived', 'Circular removed from active board.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
            School Notice Board & Circulars
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Broadcast official circulars, event notifications, and holiday declarations
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> Compose New Circular
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <Badge variant={notice.target_type === 'all' ? 'purple' : 'info'}>
                  {notice.target_type === 'all' ? 'All School' : notice.target_class || 'Class'}
                </Badge>
                <span className="text-[10px] text-[#94A3B8] flex items-center gap-1 font-medium">
                  <Calendar size={12} /> {notice.published_at}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#172033] leading-snug line-clamp-2">
                {notice.title}
              </h3>

              <p className="text-xs text-[#64748B] mt-2 line-clamp-3 leading-relaxed">
                {notice.content}
              </p>

              {notice.attachment_name && (
                <div className="mt-3 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 text-xs text-[#3B5BDB] font-medium">
                  <FileText size={14} />
                  <span className="truncate">{notice.attachment_name}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F1F5F9]">
              <Badge variant="success">Published</Badge>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedNotice(notice);
                    setShowPreviewModal(true);
                  }}
                >
                  <Eye size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#E03131]"
                  onClick={() => handleDelete(notice.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Compose Official Circular"
        description="Notices appear instantly on the Parent App notice board"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleCreateNotice)} className="space-y-4">
          <Input
            label="Circular Title"
            placeholder="e.g. Annual Sports Meet 2026 - Schedule"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Target Audience"
              options={[
                { value: 'all', label: 'All Parents & Students' },
                { value: 'class', label: 'Specific Grade / Class' },
                { value: 'section', label: 'Specific Section' },
              ]}
              {...register('target_type')}
            />

            {selectedTargetType !== 'all' && (
              <Select
                label="Target Grade"
                options={[
                  { value: 'Class 5', label: 'Class 5' },
                  { value: 'Class 6', label: 'Class 6' },
                ]}
                {...register('target_class')}
              />
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172033] uppercase tracking-wider block mb-1.5">
              Notice Content
            </label>
            <textarea
              rows={4}
              placeholder="Write the full circular announcement..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-xs outline-none focus:border-[#3B5BDB] placeholder:text-[#94A3B8]"
              {...register('content')}
            />
            {errors.content && (
              <p className="text-xs text-[#E03131] mt-1">{errors.content.message}</p>
            )}
          </div>

          <Input
            label="Attachment Document Name (PDF/Doc)"
            placeholder="e.g. Sports_Schedule_2026.pdf"
            {...register('attachment_name')}
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Publish Announcement
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      {selectedNotice && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title="Circular Preview"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <Badge variant={selectedNotice.target_type === 'all' ? 'purple' : 'info'}>
                Target: {selectedNotice.target_type === 'all' ? 'All School' : selectedNotice.target_class}
              </Badge>
              <span className="text-[#64748B]">Date: {selectedNotice.published_at}</span>
            </div>

            <h3 className="text-base font-bold text-[#172033]">{selectedNotice.title}</h3>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs leading-relaxed text-[#172033] whitespace-pre-wrap">
              {selectedNotice.content}
            </div>

            {selectedNotice.attachment_name && (
              <div className="p-3 rounded-lg border border-[#3B5BDB]/20 bg-[#DBE4FF]/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#3B5BDB] font-semibold">
                  <FileText size={16} />
                  <span>{selectedNotice.attachment_name}</span>
                </div>
                <Button size="sm" variant="outline">
                  Download
                </Button>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button onClick={() => setShowPreviewModal(false)}>Close Preview</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

