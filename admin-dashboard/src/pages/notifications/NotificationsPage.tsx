import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, Clock, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  target: string;
  sent_at: string;
  delivered_count: number;
}

const initialNotifications: PushNotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Term 1 Fee Payment Reminder',
    message: 'Friendly reminder: Term 1 tuition fees are due on November 20th. Please settle via the Fees section.',
    target: 'All Parents',
    sent_at: '2026-11-06 09:30 AM',
    delivered_count: 580,
  },
  {
    id: 'notif-02',
    title: 'Rain Alert: School Operational As Normal',
    message: 'Despite morning rainfall, all classes and bus routes are operating on normal schedule.',
    target: 'All Parents',
    sent_at: '2026-11-05 07:15 AM',
    delivered_count: 600,
  },
];

const notifSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Notification body is required'),
  target: z.string().min(1, 'Audience is required'),
});

type NotifFormValues = z.infer<typeof notifSchema>;

export function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(initialNotifications);
  const [showSendModal, setShowSendModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NotifFormValues>({
    resolver: zodResolver(notifSchema),
    defaultValues: {
      target: 'All Parents',
    },
  });

  const handleSend = (values: NotifFormValues) => {
    const newItem: PushNotificationItem = {
      id: `notif-${Date.now()}`,
      title: values.title,
      message: values.message,
      target: values.target,
      sent_at: 'Just now',
      delivered_count: 600,
    };
    setNotifications([newItem, ...notifications]);
    toast('success', 'Push Broadcast Dispatched', 'Delivered to parent mobile devices.');
    setShowSendModal(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Broadcast Notifications</h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Send real-time alerts, emergency updates, and fee reminders directly to parent phones
          </p>
        </div>
        <Button size="sm" onClick={() => setShowSendModal(true)}>
          <Plus size={14} /> Send Broadcast Alert
        </Button>
      </div>

      <div className="space-y-3.5">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#DBE4FF] text-[#3B5BDB] flex items-center justify-center shrink-0">
                <Bell size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#172033]">{n.title}</h3>
                  <Badge variant="purple">{n.target}</Badge>
                </div>
                <p className="text-xs text-[#64748B] mt-1 max-w-2xl">{n.message}</p>
              </div>
            </div>

            <div className="text-right shrink-0 text-xs text-[#64748B] space-y-1">
              <p className="font-mono text-[11px]">{n.sent_at}</p>
              <p className="text-[10px] text-[#16A36A] font-semibold flex items-center justify-end gap-1">
                <CheckCircle2 size={12} /> {n.delivered_count} Devices Delivered
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="Send Push Broadcast"
        description="Delivered immediately via Supabase Realtime & FCM push notifications"
        size="md"
      >
        <form onSubmit={handleSubmit(handleSend)} className="space-y-4">
          <Input
            label="Alert Headline"
            placeholder="e.g. Early Dismissal Today due to Heavy Rain"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <Select
            label="Target Audience"
            options={[
              { value: 'All Parents', label: 'All Registered Parents (All School)' },
              { value: 'Class 5', label: 'Class 5 Parents Only' },
              { value: 'Class 6', label: 'Class 6 Parents Only' },
            ]}
            {...register('target')}
          />

          <div>
            <label className="text-xs font-semibold text-[#172033] uppercase tracking-wider block mb-1.5">
              Message Body (Max 250 characters)
            </label>
            <textarea
              rows={3}
              placeholder="Keep the message concise and actionable..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-xs outline-none focus:border-[#3B5BDB]"
              {...register('message')}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
            <Button variant="outline" type="button" onClick={() => setShowSendModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              <Send size={14} /> Send Broadcast Now
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

