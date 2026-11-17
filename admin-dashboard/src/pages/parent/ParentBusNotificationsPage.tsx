import React from 'react';
import { useParentAuth } from '@/contexts/ParentAuthContext';
import { ParentBusLayout } from './ParentBusLayout';
import {
  Bell,
  Bus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  mockTransportNotifications,
  getStudentBusAssignment,
  TransportNotification
} from '@/lib/transportData';

export function ParentBusNotificationsPage() {
  const { activeStudent } = useParentAuth();
  const { bus, assignment } = getStudentBusAssignment(activeStudent?.id);

  if (!bus || !assignment) {
    return (
      <ParentBusLayout>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center shadow-xs max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <Bell size={32} />
          </div>
          <h2 className="text-lg font-bold text-[#172033]">No Notifications</h2>
          <p className="text-sm font-semibold text-[#B45309] mt-2 mb-3">
            No school bus has been assigned to this student yet.
          </p>
          <p className="text-xs text-[#64748B]">
            Real-time transit alerts will appear here once {activeStudent?.first_name} is enrolled in school transport.
          </p>
        </div>
      </ParentBusLayout>
    );
  }

  // Filter or prioritize notifications relevant to the active bus
  const notifications = mockTransportNotifications;

  return (
    <ParentBusLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#172033] tracking-tight">Bus Transit Notifications</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Live transit milestones, boarding confirmations, and route alerts for {bus.busNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#64748B]">
              Total Updates: {notifications.length}
            </span>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notif: TransportNotification) => {
            const isAlert = notif.type === 'delay' || notif.type === 'emergency';
            const isSuccess = notif.type === 'picked_up' || notif.type === 'reached_school';
            const isHighPriority = notif.priority === 'high';

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                  isHighPriority
                    ? 'bg-amber-50/60 border-amber-200'
                    : notif.read
                    ? 'bg-white border-[#E2E8F0]'
                    : 'bg-[#F0F4FF] border-[#3B5BDB]/40 shadow-xs'
                }`}
              >
                {/* Icon Column */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isAlert
                      ? 'bg-red-100 text-red-600'
                      : isSuccess
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-[#DBE4FF] text-[#3B5BDB]'
                  }`}
                >
                  {isAlert ? (
                    <AlertTriangle size={18} />
                  ) : isSuccess ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Bus size={18} />
                  )}
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#172033]">{notif.title}</h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#3B5BDB]" title="New" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#64748B] font-medium">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed mb-2.5">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="font-mono font-bold text-[#3B5BDB] bg-white/80 px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {notif.busNumber}
                    </span>
                    <span className="text-[#64748B]">
                      {notif.read ? 'Status: Read' : 'Status: Unread'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ParentBusLayout>
  );
}
