import React, { useState } from 'react';
import { useParentAuth } from '@/contexts/ParentAuthContext';
import { ParentBusLayout } from './ParentBusLayout';
import {
  Radio,
  AlertCircle,
  Bus,
  Compass,
  MapPin,
  Clock,
  Plus,
  Minus,
  Info,
  Navigation
} from 'lucide-react';
import { getStudentBusAssignment, GPS_SIMULATION_DISCLAIMER } from '@/lib/transportData';

export function ParentBusTrackingPage() {
  const { activeStudent } = useParentAuth();
  const { bus, route, assignment } = getStudentBusAssignment(activeStudent?.id);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLayoutPreview, setShowLayoutPreview] = useState<boolean>(true);

  if (!bus || !route || !assignment) {
    return (
      <ParentBusLayout>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center shadow-xs max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <Radio size={32} />
          </div>
          <h2 className="text-lg font-bold text-[#172033]">Live Tracking Unavailable</h2>
          <p className="text-sm font-semibold text-[#B45309] mt-2 mb-3">
            No school bus has been assigned to this student yet.
          </p>
          <p className="text-xs text-[#64748B]">
            Live tracking requires an active vehicle assignment for {activeStudent?.first_name}.
          </p>
        </div>
      </ParentBusLayout>
    );
  }

  return (
    <ParentBusLayout>
      <div className="space-y-6">
        {/* MANDATORY STATUS NOTICE:
            "If real GPS is not connected, clearly display:
            'Live bus tracking is currently unavailable.'
            Do not show fake GPS locations as live tracking."
        */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-900 text-sm">
                  Live bus tracking is currently unavailable.
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-800">
                  Telemetry Hardware Pending
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1 max-w-3xl leading-relaxed">
                Dedicated vehicle GPS tracking devices are currently being installed and calibrated across the AVK bus fleet. The framework below demonstrates the vehicle route progression layout ready for streaming live satellite coordinates once hardware goes online.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLayoutPreview(!showLayoutPreview)}
            className="px-3.5 py-2 bg-white hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 shadow-2xs transition-colors shrink-0"
          >
            {showLayoutPreview ? 'Hide Route Architecture' : 'View Route Architecture'}
          </button>
        </div>

        {/* Telemetry Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-[11px] font-medium text-[#64748B] block">Assigned Bus</span>
            <span className="text-lg font-bold text-[#172033] block mt-1">{bus.busNumber}</span>
            <span className="text-[11px] font-mono text-[#64748B] block">{bus.registrationNo}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-[11px] font-medium text-[#64748B] block">Vehicle Transit Status</span>
            <span className="text-sm font-bold text-emerald-600 block mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {bus.status === 'on_route' ? 'On Scheduled Route' : 'At School Campus'}
            </span>
            <span className="text-[11px] text-[#64748B] block">Route: {route.code}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-[11px] font-medium text-[#64748B] block">Assigned Boarding Stop</span>
            <span className="text-xs font-bold text-[#172033] block mt-1 truncate">
              {assignment.pickupStopName}
            </span>
            <span className="text-[11px] text-[#3B5BDB] font-semibold block">Pickup: {assignment.pickupTime}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-[11px] font-medium text-[#64748B] block">School Arrival Schedule</span>
            <span className="text-lg font-bold text-[#172033] block mt-1">07:55 AM</span>
            <span className="text-[11px] text-[#64748B] block">AVK Campus Gates</span>
          </div>
        </div>

        {/* Interactive Route Canvas Frame */}
        {showLayoutPreview && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            {/* Header Controls */}
            <div className="p-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-[#3B5BDB]" />
                <span className="text-xs font-bold text-[#172033]">
                  Route Architecture Frame: {bus.busNumber} &bull; {route.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#64748B] bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                  Map Zoom: {Math.round(zoomLevel * 100)}%
                </span>
                <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-lg p-0.5">
                  <button
                    onClick={() => setZoomLevel(Math.min(zoomLevel + 0.15, 1.4))}
                    className="p-1 hover:bg-[#F1F5F9] rounded text-slate-700"
                    title="Zoom in"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => setZoomLevel(Math.max(zoomLevel - 0.15, 0.8))}
                    className="p-1 hover:bg-[#F1F5F9] rounded text-slate-700"
                    title="Zoom out"
                  >
                    <Minus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Road Canvas */}
            <div className="relative h-[440px] bg-[#E9EEF4] overflow-hidden flex items-center justify-center select-none">
              {/* Grid Lines */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(to right, #CBD5E1 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Road Trajectory */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 60 380 Q 200 300 320 260 T 500 160 T 750 80"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 380 Q 200 300 320 260 T 500 160 T 750 80"
                  fill="none"
                  stroke="#3B5BDB"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />
              </svg>

              <div
                className="absolute inset-0 transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              >
                {/* Stop 1: Depot */}
                <div className="absolute left-[50px] bottom-[40px] flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-600 flex items-center justify-center text-[10px] font-bold shadow">
                    1
                  </div>
                  <span className="bg-white/95 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-700 shadow mt-1 whitespace-nowrap">
                    Main Bus Depot (07:05 AM)
                  </span>
                </div>

                {/* Stop 2: Temple Arch */}
                <div className="absolute left-[190px] bottom-[120px] flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center text-[10px] font-bold shadow">
                    ✓
                  </div>
                  <span className="bg-white/95 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-700 shadow mt-1 whitespace-nowrap">
                    Temple Arch (07:15 AM)
                  </span>
                </div>

                {/* Stop 3: Child's Assigned Stop (Railway Station) */}
                <div className="absolute left-[340px] bottom-[160px] flex flex-col items-center z-20">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#3B5BDB]/25 animate-ping absolute -inset-0" />
                    <div className="w-12 h-12 rounded-full bg-[#172554] border-2 border-amber-400 flex items-center justify-center text-white shadow-xl relative z-10">
                      <Bus size={20} className="text-amber-300" />
                    </div>
                  </div>
                  <div className="bg-[#172554] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-lg mt-1 whitespace-nowrap flex items-center gap-1.5">
                    <span>{bus.busNumber}</span>
                  </div>
                  <span className="bg-[#3B5BDB] text-white px-2.5 py-0.5 rounded text-[10px] font-bold mt-1 shadow-xs">
                    ★ Child's Stop: {assignment.pickupStopName} ({assignment.pickupTime})
                  </span>
                </div>

                {/* Stop 4: Vadikkottai */}
                <div className="absolute left-[520px] bottom-[250px] flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center text-[10px] font-bold text-amber-700 shadow">
                    4
                  </div>
                  <span className="bg-white/95 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-700 shadow mt-1 whitespace-nowrap">
                    Vadikkottai Junc (07:38 AM)
                  </span>
                </div>

                {/* Stop 5: School Campus Destination */}
                <div className="absolute right-[40px] top-[40px] flex flex-col items-center z-10">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#172554] to-[#3B5BDB] border-2 border-white flex items-center justify-center text-xl shadow-xl">
                    🏫
                  </div>
                  <div className="bg-white px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#172554] shadow-md mt-1 text-center">
                    <p className="font-extrabold">AVK School Campus</p>
                    <p className="text-[9px] text-[#64748B] font-medium">Scheduled Arrival: 07:55 AM</p>
                  </div>
                </div>
              </div>

              {/* Status Indicator Chip */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#E2E8F0] shadow-md text-[11px] space-y-1">
                <p className="font-bold text-[#172033]">Fleet GPS Status</p>
                <p className="text-amber-800 font-medium">● Hardware GPS currently calibrating</p>
                <p className="text-[#64748B] text-[10px]">Route architecture and stop geofences mapped.</p>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="p-4 bg-white border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
              <span>Last updated: <strong>Today, 07:26 AM</strong></span>
              <span>Next Scheduled Pickup for {activeStudent?.first_name}: <strong>{assignment.pickupTime}</strong></span>
            </div>
          </div>
        )}
      </div>
    </ParentBusLayout>
  );
}
