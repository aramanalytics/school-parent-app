import React from 'react';
import { useParentAuth } from '@/contexts/ParentAuthContext';
import { ParentBusLayout } from './ParentBusLayout';
import {
  Navigation,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Bus,
  Calendar,
  Info
} from 'lucide-react';
import { getStudentBusAssignment } from '@/lib/transportData';

export function ParentBusRoutePage() {
  const { activeStudent } = useParentAuth();
  const { bus, route, assignment } = getStudentBusAssignment(activeStudent?.id);

  if (!bus || !route || !assignment) {
    return (
      <ParentBusLayout>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center shadow-xs max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <Navigation size={32} />
          </div>
          <h2 className="text-lg font-bold text-[#172033]">No Route Assigned</h2>
          <p className="text-sm font-semibold text-[#B45309] mt-2 mb-3">
            No school bus has been assigned to this student yet.
          </p>
          <p className="text-xs text-[#64748B]">
            Route itinerary and stop sequences will appear here once {activeStudent?.first_name} is allocated to an AVK school bus.
          </p>
        </div>
      </ParentBusLayout>
    );
  }

  return (
    <ParentBusLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DBE4FF] text-[#3B5BDB]">
                {route.code}
              </span>
              <span className="text-xs font-mono text-[#64748B]">Vehicle: {bus.busNumber}</span>
            </div>
            <h1 className="text-xl font-bold text-[#172033] tracking-tight">{route.name}</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Total Route Distance: <strong>{route.totalDistanceKm} km</strong> &bull; Total Trip Duration: ~<strong>{route.estimatedDurationMins} minutes</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center text-xs">
              <span className="text-[#64748B] text-[10px] uppercase font-bold block">Campus Arrival</span>
              <strong className="text-[#172033] text-sm">07:55 AM</strong>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center text-xs">
              <span className="text-[#64748B] text-[10px] uppercase font-bold block">Campus Departure</span>
              <strong className="text-[#172033] text-sm">04:00 PM</strong>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-3 px-4 shadow-xs flex flex-wrap items-center gap-6 text-xs text-[#64748B]">
          <span className="font-bold text-[#172033]">Timeline Key:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#3B5BDB] ring-2 ring-[#3B5BDB]/20" />
            <span>Assigned Child Stop ({assignment.pickupStopName})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Completed Stop</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span>Upcoming Stop</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏫</span>
            <span>AVK School Campus</span>
          </div>
        </div>

        {/* Stops Vertical Timeline Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-[#172033] uppercase tracking-wider">
            Sequential Route Stops ({route.stops.length} Stops)
          </h2>

          <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E2E8F0]">
            {route.stops.map((stop, idx) => {
              const isChildPickup = stop.id === assignment.pickupStopId;
              const isChildDrop = stop.id === assignment.dropStopId;
              const isChildStop = isChildPickup || isChildDrop;
              const isPassed = stop.status === 'passed';
              const isCurrent = stop.status === 'current';

              return (
                <div key={stop.id} className="relative flex items-start gap-5">
                  {/* Timeline Badge Node */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 border-2 transition-all ${
                      stop.isSchool
                        ? 'bg-[#172554] border-amber-400 text-white shadow-md text-base'
                        : isChildStop
                        ? 'bg-[#3B5BDB] border-white text-white shadow-md ring-4 ring-[#3B5BDB]/20'
                        : isPassed
                        ? 'bg-emerald-500 border-white text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#3B5BDB] border-white text-white animate-pulse'
                        : 'bg-white border-[#CBD5E1] text-[#64748B]'
                    }`}
                  >
                    {stop.isSchool ? (
                      '🏫'
                    ) : isPassed ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Stop Details Box */}
                  <div
                    className={`flex-1 rounded-xl p-4 border transition-all ${
                      isChildStop
                        ? 'bg-[#EFF6FF] border-[#3B5BDB] shadow-xs ring-1 ring-[#3B5BDB]/10'
                        : stop.isSchool
                        ? 'bg-[#F8FAFC] border-[#172554]/30'
                        : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#172033]">
                          {stop.name} {stop.isSchool && '(Final Destination)'}
                        </h3>
                        {isChildStop && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3B5BDB] text-white">
                            ★ Assigned Child Boarding Stop
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCurrent
                            ? 'bg-blue-100 text-blue-800'
                            : isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isCurrent
                          ? '● Bus Currently At Stop'
                          : isPassed
                          ? '✓ Departed'
                          : 'Upcoming Stop'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-3 pt-3 border-t border-slate-200/60">
                      <div className="flex items-center gap-2 text-[#64748B]">
                        <Clock size={14} className="text-[#3B5BDB]" />
                        <span>
                          Morning Pickup: <strong className="text-[#172033] font-mono text-xs">{stop.pickupTime}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#64748B]">
                        <Clock size={14} className="text-[#D97706]" />
                        <span>
                          Evening Drop-off: <strong className="text-[#172033] font-mono text-xs">{stop.dropTime}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ParentBusLayout>
  );
}
