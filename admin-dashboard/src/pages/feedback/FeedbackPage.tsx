import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, Clock, Send, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { initialFeedback, MockFeedback } from '@/lib/mockData';

export function FeedbackPage() {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<MockFeedback[]>([
    {
      id: 'fb-01',
      parent_name: 'Ramesh Krishnan',
      student_name: 'Aarav Krishnan (Class 5-A)',
      category: 'suggestion',
      subject: 'Bus Route Timing Adjustment',
      message: 'Could the bus stop arrival time at Adyar Depot be reviewed? The morning bus arrives 10 minutes past 8:15 AM due to traffic near Madhya Kailash.',
      status: 'resolved',
      response: 'The transport coordinator has adjusted route 14 schedule by 10 minutes starting Monday. Thank you for notifying us.',
      created_at: '2026-11-04',
    },
    {
      id: 'fb-02',
      parent_name: 'Anitha Senthil',
      student_name: 'Karthik Senthil (Class 5-A)',
      category: 'query',
      subject: 'Science Olympiad Registration',
      message: 'Kindly let us know if the school is enrolling students for the upcoming National Science Olympiad (NSO) and the fee deadline.',
      status: 'pending',
      created_at: '2026-11-06',
    },
  ]);

  const [selectedFb, setSelectedFb] = useState<MockFeedback | null>(null);
  const [responseText, setResponseText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredFeedbacks = feedbacks.filter((f) =>
    statusFilter ? f.status === statusFilter : true
  );

  const handleSendResponse = () => {
    if (!selectedFb || !responseText.trim()) return;

    setFeedbacks(
      feedbacks.map((f) =>
        f.id === selectedFb.id
          ? { ...f, response: responseText, status: 'resolved' }
          : f
      )
    );
    toast('success', 'Response Sent', 'Response delivered to the parent mobile app.');
    setSelectedFb(null);
    setResponseText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Parent Feedback & Queries</h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Review parent questions, respond to concerns, and track resolution statuses
          </p>
        </div>
        <div className="w-44">
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'pending', label: 'Pending Only' },
              { value: 'resolved', label: 'Resolved Only' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredFeedbacks.map((fb) => (
          <div
            key={fb.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={fb.category === 'complaint' ? 'error' : fb.category === 'suggestion' ? 'warning' : 'info'}>
                  {fb.category.toUpperCase()}
                </Badge>
                <h3 className="text-sm font-bold text-[#172033]">{fb.subject}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={fb.status === 'resolved' ? 'success' : 'warning'}>
                  {fb.status === 'resolved' ? 'Resolved' : 'Pending Response'}
                </Badge>
                <span className="text-[11px] text-[#94A3B8]">{fb.created_at}</span>
              </div>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed bg-[#F8FAFC] p-3.5 rounded-xl border border-[#F1F5F9]">
              {fb.message}
            </p>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="text-[11px] text-[#64748B]">
                <span className="font-semibold text-[#172033]">{fb.parent_name}</span> • {fb.student_name}
              </div>

              {fb.status !== 'resolved' ? (
                <Button size="sm" onClick={() => setSelectedFb(fb)}>
                  Respond to Parent
                </Button>
              ) : (
                <span className="text-[11px] text-[#16A36A] font-medium flex items-center gap-1">
                  <CheckCircle2 size={13} /> Addressed
                </span>
              )}
            </div>

            {fb.response && (
              <div className="mt-2 p-3 bg-[#DBE4FF]/40 border border-[#3B5BDB]/20 rounded-xl text-xs space-y-1">
                <p className="font-bold text-[#3B5BDB]">Official School Response:</p>
                <p className="text-[#172033]">{fb.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Response Modal */}
      {selectedFb && (
        <Modal
          isOpen={Boolean(selectedFb)}
          onClose={() => setSelectedFb(null)}
          title={`Respond to ${selectedFb.parent_name}`}
          description={`Subject: ${selectedFb.subject}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="font-semibold text-[#172033]">Parent's Message:</p>
              <p className="text-[#64748B] mt-1">{selectedFb.message}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172033] uppercase tracking-wider block mb-1.5">
                School Response
              </label>
              <textarea
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your official reply here..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-xs outline-none focus:border-[#3B5BDB]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedFb(null)}>
                Cancel
              </Button>
              <Button onClick={handleSendResponse}>
                <Send size={14} /> Send Official Reply
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

