import React from 'react';
import { Link } from 'react-router-dom';
import { useParentAuth } from '@/contexts/ParentAuthContext';
import { ParentBusLayout } from './ParentBusLayout';
import {
  Bus,
  Phone,
  Clock,
  ShieldCheck,
  Navigation,
  Radio,
  Bell,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Info
} from 'lucide-react';
import { getStudentBusAssignment } from '@/lib/transportData';

export function ParentBusOverviewPage() {
  const { activeStudent } = useParentAuth();
  const { bus, route, driver, caretaker, assignment } = getStudentBusAssignment(activeStudent?.id);

  if (!bus || !assignment) {
    return (
      <ParentBusLayout>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center shadow-xs max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <Bus size={32} />
          </div>
          <h2 className="text-lg font-bold text-[#172033]">Transport Status</h2>
          <p className="text-sm font-semibold text-[#B45309] mt-2 mb-3">
            No school bus has been assigned to this student yet.
          </p>
          <p className="text-xs text-[#64748B] leading-relaxed mb-6">
            {activeStudent?.first_name} does not have an active school bus allocation for academic session 2026-2027. If your ward requires transport assistance, please contact the AVK Transport Coordinator.
          </p>
          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] text-xs text-[#64748B] text-left">
            <p className="font-semibold text-[#172033] mb-1">How to enrol in AVK Transport:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Submit a transport route request at the Administrative Office.</li>
              <li>Or drop a message to school administration via the Circulars/Feedback portal.</li>
            </ul>
          </div>
        </div>
      </ParentBusLayout>
    );
  }

  return (
    <ParentBusLayout>
      <div className="space-y-6">
        {/* Hero Card */}
        <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#3B5BDB] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl shadow-inner shrink-0">
                🚌
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl font-black tracking-tight">{bus.busNumber}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      bus.status === 'on_route'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : bus.status === 'at_school'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                        : 'bg-white/10 text-white/80 border-white/20'
                    }`}
                  >
                    {bus.status === 'on_route'
                      ? '● On Route'
                      : bus.status === 'at_school'
                      ? '● At School Campus'
                      : 'Not in Service'}
                  </span>
                </div>
                <p className="text-xs text-white/80 font-mono">
                  Registration: <span className="font-bold text-white">{bus.registrationNo}</span>
                </p>
                <p className="text-xs text-white/80 mt-0.5">{bus.model}</p>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/parent/bus/route"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
              >
                <Navigation size={14} /> View Stops & Route
              </Link>
              <Link
                to="/parent/bus/tracking"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-[#172554] text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Radio size={14} className="animate-pulse" /> Live Tracking
              </Link>
            </div>
          </div>
        </div>

        {/* Primary Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Bus & Allocation Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bus Specifications Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wider flex items-center gap-2">
                <Bus size={16} className="text-[#3B5BDB]" /> Assigned Vehicle Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Bus Identification</span>
                  <span className="font-bold text-[#172033] text-sm mt-0.5 block">{bus.busNumber}</span>
                  <span className="font-mono text-[#64748B] text-[11px] block">{bus.registrationNo}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Assigned School</span>
                  <span className="font-bold text-[#172033] text-xs mt-0.5 block">
                    AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL
                  </span>
                  <span className="text-[11px] text-[#3B5BDB] font-semibold block">CBSE Affiliation No: 1930319</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Vehicle Chassis & Model</span>
                  <span className="font-bold text-[#172033] mt-0.5 block">{bus.model}</span>
                  <span className="text-[11px] text-[#64748B] block">{bus.capacity} Seats ({bus.occupiedSeats} Allocated)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Assigned Route</span>
                  <span className="font-bold text-[#172033] mt-0.5 block">{route?.name}</span>
                  <span className="text-[11px] text-[#3B5BDB] font-semibold block">
                    {route?.stops.length} Stops &bull; {route?.totalDistanceKm} km
                  </span>
                </div>
              </div>
            </div>

            {/* Child Boarding & Timings Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} className="text-amber-500" /> Student Transit Schedule
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-blue-100 bg-[#EFF6FF]">
                  <span className="text-[#3B5BDB] font-bold uppercase tracking-wider text-[10px] block">
                    Morning Pickup Point
                  </span>
                  <p className="font-bold text-sm text-[#172033] mt-1">{assignment.pickupStopName}</p>
                  <p className="text-xs text-[#64748B] mt-1">
                    Scheduled Boarding: <strong className="text-[#172033] font-mono text-sm">{assignment.pickupTime}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-amber-100 bg-[#FFFBEB]">
                  <span className="text-amber-800 font-bold uppercase tracking-wider text-[10px] block">
                    Evening Drop-off Point
                  </span>
                  <p className="font-bold text-sm text-[#172033] mt-1">{assignment.dropStopName}</p>
                  <p className="text-xs text-[#64748B] mt-1">
                    Scheduled Return: <strong className="text-[#172033] font-mono text-sm">{assignment.dropTime}</strong>
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                <span>School Campus Arrival: <strong className="text-[#172033]">07:55 AM</strong></span>
                <span>School Campus Departure: <strong className="text-[#172033]">04:00 PM</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Driver & Caretaker Cards */}
          <div className="space-y-6">
            {/* Driver Contact Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] text-2xl flex items-center justify-center shrink-0">
                  {driver?.photo || '👨🏽‍✈️'}
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DBE4FF] text-[#3B5BDB]">
                    Designated Driver
                  </span>
                  <h4 className="text-sm font-bold text-[#172033] mt-1">{driver?.name}</h4>
                  <p className="text-[11px] text-[#64748B]">{driver?.experienceYears} Years Heavy Passenger</p>
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-2 border-t border-[#F1F5F9]">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748B]">Driving Licence</span>
                  <span className="font-mono font-bold text-[#172033]">{driver?.licenceNo}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748B]">Status</span>
                  <span className="text-emerald-600 font-semibold">Active On Duty</span>
                </div>
              </div>

              <a
                href={`tel:${driver?.phone.replace(/\s+/g, '')}`}
                className="w-full py-2.5 px-4 bg-[#16A36A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={14} /> Call Driver ({driver?.phone})
              </a>
            </div>

            {/* Caretaker Contact Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] text-2xl flex items-center justify-center shrink-0">
                  {caretaker?.photo || '👩🏽‍💼'}
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F3E8FF] text-[#7E22CE]">
                    Bus Caretaker / Conductor
                  </span>
                  <h4 className="text-sm font-bold text-[#172033] mt-1">{caretaker?.name}</h4>
                  <p className="text-[11px] text-[#16A36A] font-semibold">✓ First Aid & Child Safeguarding</p>
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-2 border-t border-[#F1F5F9]">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748B]">Duty</span>
                  <span className="font-semibold text-[#172033]">Boarding & Seat Checklist</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748B]">Assigned Vehicle</span>
                  <span className="font-bold text-[#3B5BDB]">{bus.busNumber}</span>
                </div>
              </div>

              <a
                href={`tel:${caretaker?.phone.replace(/\s+/g, '')}`}
                className="w-full py-2.5 px-4 bg-[#7E22CE] hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={14} /> Call Caretaker ({caretaker?.phone})
              </a>
            </div>
          </div>
        </div>
      </div>
    </ParentBusLayout>
  );
}
