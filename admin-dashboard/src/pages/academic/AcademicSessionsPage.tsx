import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  Archive,
  Edit,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { academicService, AcademicSession } from '@/services/academicService';
import { useAuth } from '@/contexts/AuthContext';

export function AcademicSessionsPage() {
  const { userRole } = useAuth();
  const { addToast } = useToast();
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [setActiveNow, setSetActiveNow] = useState(false);

  // Confirm Activation Modal
  const [sessionToActivate, setSessionToActivate] = useState<AcademicSession | null>(null);

  const isSuperOrSchoolAdmin =
    userRole?.role === 'super_admin' || userRole?.role === 'school_admin';

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(false);
    const data = await academicService.getSessions();
    setSessions(data);
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName || !startDate || !endDate) {
      addToast('Please fill all required dates and name', 'error');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      addToast('End date must be after the start date', 'error');
      return;
    }

    try {
      await academicService.createSession({
        school_id: userRole?.school_id || '11111111-1111-1111-1111-111111111111',
        name: sessionName,
        start_date: startDate,
        end_date: endDate,
        is_current: setActiveNow,
        status: setActiveNow ? 'active' : 'upcoming',
        description,
      });

      addToast(`Academic Session ${sessionName} created successfully`, 'success');
      setIsAddModalOpen(false);
      resetForm();
      loadSessions();
    } catch {
      addToast('Failed to create academic session', 'error');
    }
  };

  const confirmActivation = async () => {
    if (!sessionToActivate) return;
    try {
      await academicService.setActiveSession(sessionToActivate.id);
      addToast(`${sessionToActivate.name} is now the active academic session`, 'success');
      setSessionToActivate(null);
      loadSessions();
    } catch {
      addToast('Failed to change active session', 'error');
    }
  };

  const resetForm = () => {
    setSessionName('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setSetActiveNow(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
              Academic Session Management
            </h1>
            <Badge variant="purple">Institutional Cycles</Badge>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Configure academic years, enforce single active session constraint, and archive historical periods.
          </p>
        </div>

        {isSuperOrSchoolAdmin && (
          <Button onClick={() => setIsAddModalOpen(true)} size="sm">
            <Plus size={14} className="mr-1.5" /> Add Academic Session
          </Button>
        )}
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sessions.map((sess) => (
          <Card
            key={sess.id}
            className={
              sess.is_current
                ? 'border-2 border-[#3B5BDB] shadow-md relative overflow-hidden'
                : 'border border-[#E2E8F0]'
            }
          >
            {sess.is_current && (
              <div className="absolute top-0 right-0 bg-[#3B5BDB] text-white px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={12} /> Active Cycle
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#3B5BDB]/10 text-[#3B5BDB] flex items-center justify-center font-bold">
                  <Calendar size={20} />
                </div>
                <Badge
                  variant={
                    sess.status === 'active'
                      ? 'success'
                      : sess.status === 'upcoming'
                      ? 'info'
                      : 'default'
                  }
                  className="text-[10px] uppercase"
                >
                  {sess.status}
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-[#172033] mt-2">
                Session {sess.name}
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                {sess.description || 'Regular school academic calendar'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex justify-between text-[#64748B]">
                  <span>Starts:</span>
                  <span className="font-semibold text-[#172033]">{sess.start_date}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Ends:</span>
                  <span className="font-semibold text-[#172033]">{sess.end_date}</span>
                </div>
              </div>

              {isSuperOrSchoolAdmin && !sess.is_current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSessionToActivate(sess)}
                  className="w-full text-xs text-[#3B5BDB] hover:bg-[#3B5BDB]/5"
                >
                  <Check size={14} className="mr-1.5" /> Make Active Session
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog before changing active session */}
      {sessionToActivate && (
        <Modal
          isOpen={Boolean(sessionToActivate)}
          onClose={() => setSessionToActivate(null)}
          title="Confirm Active Session Change"
        >
          <div className="space-y-4 text-xs text-[#475569]">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2">
              <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold">Important Academic Switch</p>
                <p className="text-[11px] mt-0.5">
                  Setting <strong>{sessionToActivate.name}</strong> as the active session will
                  archive the current session. Historical marks, attendance, and student logs will
                  remain strictly preserved.
                </p>
              </div>
            </div>

            <p>Are you sure you want to activate session {sessionToActivate.name}?</p>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setSessionToActivate(null)}>
                Cancel
              </Button>
              <Button onClick={confirmActivation} className="bg-[#3B5BDB] text-white">
                Yes, Set Active
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add New Session Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Academic Session"
      >
        <form onSubmit={handleCreateSession} className="space-y-3.5">
          <Input
            label="Session Name *"
            placeholder="e.g. 2027–2028"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date *"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date *"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg outline-none focus:border-[#3B5BDB]"
              rows={3}
              placeholder="Session notes, affiliation details, or admissions cycle..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-[#172033] cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={setActiveNow}
              onChange={(e) => setSetActiveNow(e.target.checked)}
              className="rounded text-[#3B5BDB]"
            />
            <span className="font-semibold">Set as active academic session immediately</span>
          </label>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Session</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

