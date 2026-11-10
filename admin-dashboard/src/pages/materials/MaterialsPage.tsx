import React, { useState } from 'react';
import { BookOpen, Plus, FileText, Video, Music, Image as ImageIcon, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface MaterialItem {
  id: string;
  title: string;
  subject: string;
  class_name: string;
  type: 'pdf' | 'video' | 'audio' | 'image';
  file_name: string;
  file_size: string;
  uploaded_by: string;
  date: string;
}

const initialMaterials: MaterialItem[] = [
  {
    id: 'mat-01',
    title: 'Chapter 4: Fractions and Decimals Revision Notes',
    subject: 'Mathematics',
    class_name: 'Class 5',
    type: 'pdf',
    file_name: 'Math_Ch4_Fractions_Notes.pdf',
    file_size: '2.4 MB',
    uploaded_by: 'M. Saravanan',
    date: '2026-11-03',
  },
  {
    id: 'mat-02',
    title: 'Plant Cells and Photosynthesis Animated Video Lecture',
    subject: 'Science',
    class_name: 'Class 5',
    type: 'video',
    file_name: 'Photosynthesis_Concept_Explainer.mp4',
    file_size: '18.6 MB',
    uploaded_by: 'M. Saravanan',
    date: '2026-11-04',
  },
  {
    id: 'mat-03',
    title: 'The Road Not Taken - Audio Pronunciation & Recitation',
    subject: 'English',
    class_name: 'Class 5',
    type: 'audio',
    file_name: 'Frost_Poem_Recitation.mp3',
    file_size: '4.1 MB',
    uploaded_by: 'K. Malathi',
    date: '2026-11-05',
  },
];

const materialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  class_name: z.string().min(1, 'Class is required'),
  type: z.enum(['pdf', 'video', 'audio', 'image']),
  file_name: z.string().min(1, 'Document / Resource file name is required'),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

export function MaterialsPage() {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<MaterialItem[]>(initialMaterials);
  const [showAddModal, setShowAddModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      type: 'pdf',
      class_name: 'Class 5',
      subject: 'Mathematics',
    },
  });

  const filteredMaterials = materials.filter((m) =>
    typeFilter ? m.type === typeFilter : true
  );

  const handleUpload = (values: MaterialFormValues) => {
    const newItem: MaterialItem = {
      id: `mat-${Date.now()}`,
      title: values.title,
      subject: values.subject,
      class_name: values.class_name,
      type: values.type,
      file_name: values.file_name,
      file_size: '3.2 MB',
      uploaded_by: 'Faculty Staff',
      date: new Date().toISOString().slice(0, 10),
    };
    setMaterials([newItem, ...materials]);
    toast('success', 'Study Material Uploaded', 'Shared with parents & students.');
    setShowAddModal(false);
    reset();
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
    toast('info', 'File Deleted', 'Resource removed from study library.');
  };

  const getIcon = (type: MaterialItem['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} className="text-[#E03131]" />;
      case 'video':
        return <Video size={20} className="text-[#3B5BDB]" />;
      case 'audio':
        return <Music size={20} className="text-[#16A36A]" />;
      case 'image':
        return <ImageIcon size={20} className="text-[#F2A93B]" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
            Study Materials & Digital Library
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Upload and organize subject textbooks, worksheets, lecture videos, and audio notes
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> Upload Study Material
        </Button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['', 'pdf', 'video', 'audio', 'image'].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer uppercase transition-all ${
              typeFilter === t
                ? 'bg-[#3B5BDB] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
          >
            {t === '' ? 'All Types' : t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-[#3B5BDB] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  {getIcon(mat.type)}
                </div>
                <Badge variant="purple">{mat.class_name}</Badge>
              </div>

              <span className="text-[11px] font-bold text-[#3B5BDB] uppercase tracking-wider block mt-3">
                {mat.subject}
              </span>

              <h3 className="text-sm font-bold text-[#172033] mt-1 leading-snug line-clamp-2">
                {mat.title}
              </h3>

              <div className="mt-3 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9] text-xs text-[#64748B] space-y-0.5">
                <p className="truncate font-medium text-[#172033]">{mat.file_name}</p>
                <p className="text-[10px] text-[#94A3B8]">
                  Size: {mat.file_size} • Date: {mat.date}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#F1F5F9]">
              <span className="text-[10px] text-[#94A3B8]">By {mat.uploaded_by}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast('info', 'Download', `Downloading ${mat.file_name}`)}
                >
                  <Download size={13} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#E03131]"
                  onClick={() => handleDelete(mat.id)}
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Upload Study Material"
        description="Stored securely on Supabase Storage bucket and accessible to students"
        size="md"
      >
        <form onSubmit={handleSubmit(handleUpload)} className="space-y-4">
          <Input
            label="Title / Topic Name"
            placeholder="e.g. Chapter 4 Fractions Revision Sheet"
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
              label="Class"
              options={[
                { value: 'Class 5', label: 'Class 5' },
                { value: 'Class 6', label: 'Class 6' },
              ]}
              {...register('class_name')}
            />
          </div>

          <Select
            label="Resource Format"
            options={[
              { value: 'pdf', label: 'PDF Document / Worksheet' },
              { value: 'video', label: 'Video Lecture (MP4)' },
              { value: 'audio', label: 'Audio Lesson / Pronunciation (MP3)' },
              { value: 'image', label: 'Diagram / Infographic (PNG/JPG)' },
            ]}
            {...register('type')}
          />

          <Input
            label="File Name / Cloud Storage Asset"
            placeholder="e.g. Science_Ch3_Notes.pdf"
            required
            error={errors.file_name?.message}
            {...register('file_name')}
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Upload Resource
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

