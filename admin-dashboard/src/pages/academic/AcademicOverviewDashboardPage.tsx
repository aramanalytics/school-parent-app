import React, { useState, useEffect } from 'react';
import {
  Layers,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KPICard } from '@/components/ui/KPICard';
import { Link } from 'react-router-dom';
import {
  academicService,
  AcademicSession,
  SchoolClass,
  ClassSection,
  AcademicSubject,
} from '@/services/academicService';

export function AcademicOverviewDashboardPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<ClassSection[]>([]);
  const [subjects, setSubjects] = useState<AcademicSubject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadOverview() {
      const [sessList, classList, secList, subList] = await Promise.all([
        academicService.getSessions(),
        academicService.getClasses(),
        academicService.getSections(),
        academicService.getSubjects(),
      ]);
      setSessions(sessList);
      setClasses(classList);
      setSections(secList);
      setSubjects(subList);
    }
    loadOverview();
  }, []);

  const activeSession = sessions.find((s) => s.is_current) || sessions[0];

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#3B5BDB] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm mb-2">
              <Layers size={14} className="text-emerald-400" />
              <span>Academic Setup & Master Architecture</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Academic Central Management</h1>
            <p className="text-xs text-white/80 mt-1 max-w-xl">
              Unified configuration of academic years, grade progressions, section capacities, curriculum subject catalogs, and student promotions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link to="/academic/sessions">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Calendar size={14} className="mr-1.5" /> Sessions
              </Button>
            </Link>
            <Link to="/academic/classes">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                <Plus size={14} className="mr-1.5" /> Manage Classes
              </Button>
            </Link>
            <Link to="/academic/promotions">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <GraduationCap size={14} className="mr-1.5" /> Promotions
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 7 Required Academic Dashboard Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <KPICard
          title="Academic Sessions"
          value={sessions.length}
          icon={Calendar}
          trend={{ value: 1, label: 'Active Cycle' }}
          color="blue"
          subtitle="Configured cycles"
        />
        <KPICard
          title="Active Session"
          value={activeSession?.name || '2026–2027'}
          icon={CheckCircle2}
          trend={{ value: 100, label: 'Current' }}
          color="green"
          subtitle="School-wide default"
        />
        <KPICard
          title="Total Classes"
          value={classes.length}
          icon={GraduationCap}
          trend={{ value: 10, label: 'Pre-KG to 12' }}
          color="blue"
          subtitle="Grade levels"
        />
        <KPICard
          title="Total Sections"
          value={sections.length}
          icon={Layers}
          trend={{ value: 40, label: 'Capacity' }}
          color="navy"
          subtitle="Active subdivisions"
        />
        <KPICard
          title="Catalog Subjects"
          value={subjects.length}
          icon={BookOpen}
          trend={{ value: 5, label: 'Core Syllabi' }}
          color="blue"
          subtitle="Curriculum disciplines"
        />
        <KPICard
          title="Class Teachers"
          value="4"
          icon={Users}
          trend={{ value: 100, label: 'Assigned' }}
          color="green"
          subtitle="Section leads"
        />
        <KPICard
          title="Enrolled Students"
          value="64"
          icon={Users}
          trend={{ value: 14, label: 'YoY Growth' }}
          color="blue"
          subtitle="Active student roster"
        />
      </div>

      {/* Searchable Classes Overview Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
          <div>
            <CardTitle className="text-base font-bold text-[#172033]">
              Academic Class & Section Directory
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Real-time summary of active grades, sections count, and teachers
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 w-60">
              <Search size={14} className="text-[#64748B]" />
              <input
                type="text"
                placeholder="Search class name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-[#172033] w-full"
              />
            </div>
            <Link to="/academic/classes">
              <Button size="sm">
                <Plus size={14} className="mr-1.5" /> New Class
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-semibold">
                  <th className="py-2.5 px-3">Class Name</th>
                  <th className="py-2.5 px-3">Academic Session</th>
                  <th className="py-2.5 px-3">Sections</th>
                  <th className="py-2.5 px-3">Class Teacher</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredClasses.map((cls) => {
                  const classSecs = sections.filter((s) => s.class_id === cls.id);
                  return (
                    <tr key={cls.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#3B5BDB]/10 text-[#3B5BDB] flex items-center justify-center font-bold text-xs">
                            {cls.numeric_order}
                          </div>
                          <div>
                            <p className="font-bold text-[#172033]">{cls.name}</p>
                            <p className="text-[10px] text-[#64748B]">{cls.code || 'Standard'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="default" className="text-[10px]">
                          {activeSession?.name || '2026–2027'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#172033]">
                        {classSecs.length > 0 ? (
                          <span className="flex items-center gap-1">
                            {classSecs.map((s) => s.name).join(', ')}
                          </span>
                        ) : (
                          <span className="text-[#94A3B8] italic">No sections</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#475569]">M. Saravanan (Lead)</td>
                      <td className="py-3 px-3">
                        <Badge variant="success" className="text-[10px]">
                          Active
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link to="/academic/classes">
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-[#3B5BDB]">
                            View Details <ExternalLink size={12} className="ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

