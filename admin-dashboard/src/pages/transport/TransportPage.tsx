import React, { useState } from 'react';
import {
  Bus as BusIcon,
  Users,
  ShieldCheck,
  MapPin,
  Compass,
  Navigation,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Info,
  Calendar,
  Search,
  ArrowRight,
  Eye,
  Radio,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  mockBuses,
  mockDrivers,
  mockCaretakers,
  mockRoutes,
  Bus,
  Driver,
  Caretaker,
  BusRoute,
  GPS_SIMULATION_DISCLAIMER
} from '@/lib/transportData';

type TabKey = 'fleet' | 'buses' | 'drivers' | 'caretakers' | 'routes';

export function TransportPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('fleet');

  // State
  const [buses, setBuses] = useState<Bus[]>(mockBuses);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [caretakers, setCaretakers] = useState<Caretaker[]>(mockCaretakers);
  const [routes, setRoutes] = useState<BusRoute[]>(mockRoutes);

  // Selected bus for fleet detail / map
  const [selectedBusId, setSelectedBusId] = useState<string>('bus-01');

  // Modals
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddCaretakerModal, setShowAddCaretakerModal] = useState(false);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);

  // Form states
  const [newBus, setNewBus] = useState({
    busNumber: '',
    registrationNo: '',
    model: '',
    capacity: 40,
    routeId: 'route-01',
    driverId: 'drv-01',
    caretakerId: 'ct-01',
  });

  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    licenceNo: '',
    experienceYears: 5,
  });

  const [newCaretaker, setNewCaretaker] = useState({
    name: '',
    phone: '',
  });

  const selectedBus = buses.find((b) => b.id === selectedBusId) || buses[0];
  const selectedRoute = routes.find((r) => r.id === selectedBus?.routeId);

  const handleAddBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBus.busNumber || !newBus.registrationNo) {
      toast('error', 'Required Fields Missing', 'Please enter bus number and registration.');
      return;
    }
    const createdBus: Bus = {
      id: `bus-0${buses.length + 1}`,
      busNumber: newBus.busNumber,
      registrationNo: newBus.registrationNo,
      model: newBus.model || 'Eicher Starline (40 Seater)',
      capacity: Number(newBus.capacity) || 40,
      occupiedSeats: 0,
      status: 'at_school',
      routeId: newBus.routeId,
      routeName: routes.find((r) => r.id === newBus.routeId)?.name || 'Unassigned',
      driverId: newBus.driverId,
      driverName: drivers.find((d) => d.id === newBus.driverId)?.name || 'Unassigned',
      caretakerId: newBus.caretakerId,
      caretakerName: caretakers.find((c) => c.id === newBus.caretakerId)?.name || 'Unassigned',
      schoolName: 'AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL',
      telemetry: {
        busId: `bus-0${buses.length + 1}`,
        driverId: newBus.driverId,
        routeId: newBus.routeId,
        lat: 9.1920,
        lng: 77.5620,
        gpsTimestamp: 'Just Now (Simulated)',
        speedKmH: 0,
        heading: 'Campus Depot',
        currentStopId: 'stop-school',
        currentStopName: 'AVK Senior Secondary School Campus',
        nextStopName: 'Ready for Service',
        etaNextStopMins: 0,
        distanceRemainingKm: 0,
        trackingStatus: 'idle',
        isLiveGps: false,
      },
    };
    setBuses([...buses, createdBus]);
    setShowAddBusModal(false);
    toast('success', 'Bus Added', `${createdBus.busNumber} has been added to the fleet.`);
  };

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.phone) {
      toast('error', 'Required Fields', 'Driver name and phone are mandatory.');
      return;
    }
    const created: Driver = {
      id: `drv-0${drivers.length + 1}`,
      name: newDriver.name,
      phone: newDriver.phone,
      licenceNo: newDriver.licenceNo || 'TN-76-2024-XXXXXX',
      photo: '👨🏽‍✈️',
      assignedBusId: 'unassigned',
      assignedBusNumber: 'Unassigned',
      status: 'available',
      experienceYears: Number(newDriver.experienceYears) || 5,
    };
    setDrivers([...drivers, created]);
    setShowAddDriverModal(false);
    toast('success', 'Driver Enrolled', `${created.name} added to transport faculty.`);
  };

  const handleAddCaretaker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaretaker.name || !newCaretaker.phone) {
      toast('error', 'Required Fields', 'Caretaker name and contact number are required.');
      return;
    }
    const created: Caretaker = {
      id: `ct-0${caretakers.length + 1}`,
      name: newCaretaker.name,
      phone: newCaretaker.phone,
      photo: '👩🏽‍💼',
      assignedBusId: 'unassigned',
      assignedBusNumber: 'Unassigned',
      status: 'available',
    };
    setCaretakers([...caretakers, created]);
    setShowAddCaretakerModal(false);
    toast('success', 'Caretaker Added', `${created.name} added to transport crew.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#3B5BDB] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm mb-3">
              <BusIcon size={14} className="text-amber-300" />
              <span>AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Transport & Live Fleet Management</h1>
            <p className="text-xs text-white/80 mt-1 max-w-2xl">
              Monitor active school buses, driver rosters, route schedules, student safety compliance, and live GPS simulation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-[#172554] font-semibold shadow-md"
              onClick={() => setShowAddBusModal(true)}
            >
              <Plus size={14} className="mr-1.5" /> Enrol New Bus
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Total Buses</span>
            <div className="p-2 rounded-lg bg-[#DBE4FF] text-[#3B5BDB]">
              <BusIcon size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#172033] mt-2">{buses.length}</p>
          <p className="text-[11px] text-[#64748B] mt-0.5">AVK Transport Fleet</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Active On Route</span>
            <div className="p-2 rounded-lg bg-[#D3F9D8] text-[#16A36A]">
              <Radio size={16} className="animate-pulse" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#16A36A] mt-2">
            {buses.filter((b) => b.status === 'on_route').length}
          </p>
          <p className="text-[11px] text-[#64748B] mt-0.5">Live GPS Transmitting</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Drivers & Staff</span>
            <div className="p-2 rounded-lg bg-[#F3E8FF] text-[#7E22CE]">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#172033] mt-2">{drivers.length + caretakers.length}</p>
          <p className="text-[11px] text-[#64748B] mt-0.5">{drivers.length} Drivers • {caretakers.length} Caretakers</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Operational Routes</span>
            <div className="p-2 rounded-lg bg-[#FFF3BF] text-[#D97706]">
              <Navigation size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#172033] mt-2">{routes.length}</p>
          <p className="text-[11px] text-[#64748B] mt-0.5">Covering Tenkasi District</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'fleet'
              ? 'bg-[#3B5BDB] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:text-[#172033] border border-[#E2E8F0]'
          }`}
        >
          <Radio size={14} /> Live Fleet Tracking
        </button>

        <button
          onClick={() => setActiveTab('buses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'buses'
              ? 'bg-[#3B5BDB] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:text-[#172033] border border-[#E2E8F0]'
          }`}
        >
          <BusIcon size={14} /> Buses ({buses.length})
        </button>

        <button
          onClick={() => setActiveTab('drivers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'drivers'
              ? 'bg-[#3B5BDB] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:text-[#172033] border border-[#E2E8F0]'
          }`}
        >
          <Users size={14} /> Drivers ({drivers.length})
        </button>

        <button
          onClick={() => setActiveTab('caretakers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'caretakers'
              ? 'bg-[#3B5BDB] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:text-[#172033] border border-[#E2E8F0]'
          }`}
        >
          <ShieldCheck size={14} /> Caretakers ({caretakers.length})
        </button>

        <button
          onClick={() => setActiveTab('routes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'routes'
              ? 'bg-[#3B5BDB] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:text-[#172033] border border-[#E2E8F0]'
          }`}
        >
          <Navigation size={14} /> Routes & Stops ({routes.length})
        </button>
      </div>

      {/* TAB 1: LIVE FLEET TRACKING & SIMULATED MAP */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          {/* Hardware GPS Integration Notice Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
            <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <span className="font-semibold">Simulated GPS Fleet Telemetry: </span>
              {GPS_SIMULATION_DISCLAIMER}. The map interface and live metrics below are built to consume hardware GPS feeds (or driver mobile tracking apps) via WebSocket / Webhook once installed on campus vehicles.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bus Selector Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Select Active Bus</h3>
              {buses.map((bus) => {
                const isSelected = bus.id === selectedBusId;
                return (
                  <div
                    key={bus.id}
                    onClick={() => setSelectedBusId(bus.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#3B5BDB] bg-[#F0F4FF] shadow-sm ring-2 ring-[#3B5BDB]/20'
                        : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#172554] text-white flex items-center justify-center font-bold text-xs">
                          {bus.busNumber.replace('AVK BUS ', 'B')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#172033]">{bus.busNumber}</p>
                          <p className="text-[11px] text-[#64748B]">{bus.registrationNo}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          bus.status === 'on_route'
                            ? 'success'
                            : bus.status === 'at_school'
                            ? 'info'
                            : 'default'
                        }
                      >
                        {bus.status === 'on_route'
                          ? 'On Route'
                          : bus.status === 'at_school'
                          ? 'At School'
                          : 'Not In Service'}
                      </Badge>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#E2E8F0]/60 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[#64748B] block">Current Speed</span>
                        <span className="font-semibold text-[#172033]">
                          {bus.telemetry.speedKmH} km/h
                        </span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block">Current Location</span>
                        <span className="font-semibold text-[#172033] truncate block">
                          {bus.telemetry.currentStopName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Selected Bus Telemetry Card */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={14} className="text-[#3B5BDB]" /> Live Telemetry Feed
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Driver</span>
                    <span className="font-semibold text-[#172033]">{selectedBus.driverName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Caretaker</span>
                    <span className="font-semibold text-[#172033]">{selectedBus.caretakerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Route</span>
                    <span className="font-semibold text-[#172033] truncate max-w-[160px] text-right">
                      {selectedBus.routeName}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Heading</span>
                    <span className="font-semibold text-[#172033]">{selectedBus.telemetry.heading}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Next Scheduled Stop</span>
                    <span className="font-semibold text-[#3B5BDB]">{selectedBus.telemetry.nextStopName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">ETA to Next Stop</span>
                    <span className="font-bold text-[#16A36A]">
                      {selectedBus.status === 'on_route'
                        ? `${selectedBus.telemetry.etaNextStopMins} mins`
                        : 'Stationary'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#64748B]">Last Ping</span>
                    <span className="text-[11px] text-[#64748B] font-mono">
                      {selectedBus.telemetry.gpsTimestamp}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Simulated Map */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col">
                {/* Map Header Controls */}
                <div className="p-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-[#172033]">
                      Active Tracking: {selectedBus.busNumber}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      ({selectedBus.registrationNo})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="text-[10px]">
                      Simulated Map View
                    </Badge>
                    <span className="text-[11px] font-mono text-[#64748B] bg-white px-2 py-1 rounded border border-[#E2E8F0]">
                      Lat: {selectedBus.telemetry.lat.toFixed(4)}, Lng: {selectedBus.telemetry.lng.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Simulated Geographic Canvas */}
                <div className="relative h-[480px] bg-[#E9EEF4] overflow-hidden flex items-center justify-center select-none">
                  {/* Grid Lines resembling city road grid */}
                  <div className="absolute inset-0 opacity-40 pointer-events-none"
                       style={{
                         backgroundImage: `linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(to right, #CBD5E1 1px, transparent 1px)`,
                         backgroundSize: '40px 40px',
                       }}
                  />

                  {/* Curving Road Route Representation */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M 60 400 Q 180 320 280 280 T 420 180 T 620 90"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 60 400 Q 180 320 280 280 T 420 180 T 620 90"
                      fill="none"
                      stroke="#3B5BDB"
                      strokeWidth="4"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Stop 1: Depot */}
                  <div className="absolute left-[50px] bottom-[60px] flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-600 flex items-center justify-center text-[10px] font-bold shadow">
                      1
                    </div>
                    <span className="bg-white/95 px-2 py-0.5 rounded text-[10px] font-medium text-slate-700 shadow mt-1 whitespace-nowrap">
                      Bus Depot (07:05 AM)
                    </span>
                  </div>

                  {/* Stop 2: Temple Arch */}
                  <div className="absolute left-[170px] bottom-[140px] flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-600 shadow">
                      ✓
                    </div>
                    <span className="bg-white/95 px-2 py-0.5 rounded text-[10px] font-medium text-slate-700 shadow mt-1 whitespace-nowrap">
                      Temple Arch (07:15 AM)
                    </span>
                  </div>

                  {/* Stop 3 / Active Bus Location */}
                  <div className="absolute left-[270px] bottom-[180px] flex flex-col items-center z-20">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[#3B5BDB]/20 animate-ping absolute -inset-0" />
                      <div className="w-12 h-12 rounded-full bg-[#172554] border-2 border-amber-400 flex items-center justify-center text-white shadow-xl relative z-10">
                        <BusIcon size={20} className="text-amber-300" />
                      </div>
                    </div>
                    <div className="bg-[#172554] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-lg mt-1 whitespace-nowrap flex items-center gap-1.5">
                      <span>{selectedBus.busNumber}</span>
                      <span className="text-amber-300">({selectedBus.telemetry.speedKmH} km/h)</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[9px] font-semibold mt-0.5">
                      Current: Railway Station Feeder Rd
                    </span>
                  </div>

                  {/* Stop 4: Vadikkottai */}
                  <div className="absolute left-[400px] bottom-[270px] flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center text-[10px] font-bold text-amber-600 shadow">
                      4
                    </div>
                    <span className="bg-white/95 px-2 py-0.5 rounded text-[10px] font-medium text-slate-700 shadow mt-1 whitespace-nowrap">
                      Vadikkottai Junc (07:38 AM)
                    </span>
                  </div>

                  {/* Stop 5: AVK School Campus Destination */}
                  <div className="absolute right-[40px] top-[40px] flex flex-col items-center z-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#172554] to-[#3B5BDB] border-2 border-white flex items-center justify-center text-amber-300 shadow-xl">
                      🏫
                    </div>
                    <div className="bg-white px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#172554] shadow-md mt-1 text-center">
                      <p className="font-extrabold">AVK School Campus</p>
                      <p className="text-[9px] text-[#64748B] font-medium">Final Destination (07:55 AM)</p>
                    </div>
                  </div>

                  {/* Map Legend Overlay */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-lg border border-[#E2E8F0] shadow-md text-[10px] space-y-1">
                    <div className="font-bold text-[#172033] mb-1">Route A Progression</div>
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Passed (Stops 1 & 2)
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-blue-600" /> Bus Location (Stop 3)
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-700">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> Upcoming (Stops 4 & 5)
                    </div>
                  </div>
                </div>

                {/* Progress Bar of Current Route */}
                {selectedRoute && (
                  <div className="p-4 border-t border-[#E2E8F0] bg-white">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#172033] mb-2">
                      <span>{selectedRoute.name}</span>
                      <span className="text-[#3B5BDB]">
                        ETA to Campus: {selectedBus.status === 'on_route' ? '29 mins' : 'Arrived'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E2E8F0] -translate-y-1/2 z-0" />
                      <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-emerald-500 -translate-y-1/2 z-0" />

                      {selectedRoute.stops.map((stop, idx) => (
                        <div key={stop.id} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 ${
                              stop.status === 'passed'
                                ? 'bg-emerald-500 border-white text-white'
                                : stop.status === 'current'
                                ? 'bg-[#3B5BDB] border-white text-white ring-2 ring-[#3B5BDB]/40'
                                : 'bg-white border-[#CBD5E1] text-[#64748B]'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <span className="text-[10px] text-[#64748B] mt-1 max-w-[80px] text-center truncate">
                            {stop.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUS MANAGEMENT */}
      {activeTab === 'buses' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#172033]">School Bus Fleet</h2>
              <p className="text-xs text-[#64748B]">
                Configure registered school vehicles, seating capacities, and assigned crew.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowAddBusModal(true)}>
              <Plus size={14} className="mr-1.5" /> Enrol Bus
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
                <tr>
                  <th className="p-3.5">Bus Identification</th>
                  <th className="p-3.5">Vehicle Model</th>
                  <th className="p-3.5">Capacity / Occupancy</th>
                  <th className="p-3.5">Assigned Route</th>
                  <th className="p-3.5">Driver & Caretaker</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {buses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-3.5 font-medium text-[#172033]">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-[#DBE4FF] text-[#3B5BDB]">
                          <BusIcon size={14} />
                        </div>
                        <div>
                          <p className="font-bold text-[#172033]">{bus.busNumber}</p>
                          <p className="text-[11px] font-mono text-[#64748B]">{bus.registrationNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#64748B]">{bus.model}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#172033]">{bus.occupiedSeats}</span>
                        <span className="text-[#64748B]">/ {bus.capacity} seats</span>
                      </div>
                      <div className="w-24 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-[#3B5BDB] rounded-full"
                          style={{ width: `${(bus.occupiedSeats / bus.capacity) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-[#172033] block truncate max-w-[180px]">
                        {bus.routeName}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-[#172033]">👨‍✈️ {bus.driverName}</p>
                      <p className="text-[11px] text-[#64748B]">👩‍💼 {bus.caretakerName}</p>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          bus.status === 'on_route'
                            ? 'success'
                            : bus.status === 'at_school'
                            ? 'info'
                            : 'default'
                        }
                      >
                        {bus.status === 'on_route'
                          ? 'On Route'
                          : bus.status === 'at_school'
                          ? 'At School'
                          : 'Not In Service'}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBusId(bus.id);
                            setActiveTab('fleet');
                          }}
                        >
                          <Eye size={14} className="mr-1" /> Track
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DRIVERS */}
      {activeTab === 'drivers' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#172033]">School Bus Drivers</h2>
              <p className="text-xs text-[#64748B]">
                Licensed transport drivers certified for school passenger duty.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowAddDriverModal(true)}>
              <Plus size={14} className="mr-1.5" /> Enrol Driver
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
                <tr>
                  <th className="p-3.5">Driver Name</th>
                  <th className="p-3.5">Commercial Driving Licence</th>
                  <th className="p-3.5">Contact Number</th>
                  <th className="p-3.5">Experience</th>
                  <th className="p-3.5">Assigned Bus</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {drivers.map((drv) => (
                  <tr key={drv.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-3.5 font-semibold text-[#172033]">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{drv.photo}</span>
                        <div>
                          <p className="font-bold text-[#172033]">{drv.name}</p>
                          <p className="text-[11px] text-[#64748B]">ID: {drv.id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-xs text-[#172033] font-semibold">
                      {drv.licenceNo}
                    </td>
                    <td className="p-3.5">
                      <a
                        href={`tel:${drv.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1.5 text-[#3B5BDB] font-medium hover:underline"
                      >
                        <Phone size={12} /> {drv.phone}
                      </a>
                    </td>
                    <td className="p-3.5 text-[#64748B]">{drv.experienceYears} Years Heavy Passenger</td>
                    <td className="p-3.5">
                      <Badge variant="purple">{drv.assignedBusNumber}</Badge>
                    </td>
                    <td className="p-3.5">
                      <Badge variant={drv.status === 'on_duty' ? 'success' : 'default'}>
                        {drv.status === 'on_duty' ? 'On Duty' : 'Available'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CARETAKERS */}
      {activeTab === 'caretakers' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#172033]">Student Caretakers & Conductors</h2>
              <p className="text-xs text-[#64748B]">
                Staff dedicated to child passenger supervision, attendance check, and boarding safety.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowAddCaretakerModal(true)}>
              <Plus size={14} className="mr-1.5" /> Enrol Caretaker
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
                <tr>
                  <th className="p-3.5">Caretaker Name</th>
                  <th className="p-3.5">Contact Number</th>
                  <th className="p-3.5">Assigned Bus</th>
                  <th className="p-3.5">Safety Training</th>
                  <th className="p-3.5">Duty Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {caretakers.map((ct) => (
                  <tr key={ct.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-3.5 font-semibold text-[#172033]">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{ct.photo}</span>
                        <div>
                          <p className="font-bold text-[#172033]">{ct.name}</p>
                          <p className="text-[11px] text-[#64748B]">ID: {ct.id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <a
                        href={`tel:${ct.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1.5 text-[#3B5BDB] font-medium hover:underline"
                      >
                        <Phone size={12} /> {ct.phone}
                      </a>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="purple">{ct.assignedBusNumber}</Badge>
                    </td>
                    <td className="p-3.5 text-[#16A36A] font-medium">
                      ✓ First Aid & Child Safeguarding Certified
                    </td>
                    <td className="p-3.5">
                      <Badge variant={ct.status === 'on_duty' ? 'success' : 'default'}>
                        {ct.status === 'on_duty' ? 'On Duty' : 'Available'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ROUTES & STOPS */}
      {activeTab === 'routes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#172033]">Bus Routes & Timetabled Stops</h2>
              <p className="text-xs text-[#64748B]">
                Configure morning pickup and afternoon return itineraries for AVK students.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((rt) => (
              <div key={rt.id} className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="info" className="mb-1">{rt.code}</Badge>
                    <h3 className="font-bold text-sm text-[#172033]">{rt.name}</h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {rt.totalDistanceKm} km total &bull; Approx {rt.estimatedDurationMins} mins
                    </p>
                  </div>
                </div>

                {/* Stops Timeline */}
                <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Scheduled Stops</p>
                  <div className="space-y-2.5">
                    {rt.stops.map((stop, idx) => (
                      <div key={stop.id} className="flex items-start gap-2.5 text-xs">
                        <div className="w-5 h-5 rounded-full bg-[#DBE4FF] text-[#3B5BDB] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#172033] truncate">
                            {stop.name} {stop.isSchool && '🏫'}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-[#64748B] mt-0.5">
                            <span>Pickup: <strong className="text-[#172033]">{stop.pickupTime}</strong></span>
                            <span>Drop: <strong className="text-[#172033]">{stop.dropTime}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD BUS */}
      <Modal
        isOpen={showAddBusModal}
        onClose={() => setShowAddBusModal(false)}
        title="Enrol New School Bus"
        size="md"
      >
        <form onSubmit={handleAddBus} className="space-y-4">
          <Input
            label="Bus Number / Display Name"
            placeholder="e.g. AVK BUS 04"
            required
            value={newBus.busNumber}
            onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value })}
          />

          <Input
            label="RTO Registration Number"
            placeholder="e.g. TN 76 DD 4012"
            required
            value={newBus.registrationNo}
            onChange={(e) => setNewBus({ ...newBus, registrationNo: e.target.value })}
          />

          <Input
            label="Vehicle Model & Chassis"
            placeholder="e.g. Ashok Leyland Sunshine 42-Seater"
            value={newBus.model}
            onChange={(e) => setNewBus({ ...newBus, model: e.target.value })}
          />

          <Input
            label="Passenger Seating Capacity"
            type="number"
            value={newBus.capacity}
            onChange={(e) => setNewBus({ ...newBus, capacity: Number(e.target.value) })}
          />

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Assign Primary Driver</label>
            <select
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg bg-white"
              value={newBus.driverId}
              onChange={(e) => setNewBus({ ...newBus, driverId: e.target.value })}
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.licenceNo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Assign Primary Caretaker</label>
            <select
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg bg-white"
              value={newBus.caretakerId}
              onChange={(e) => setNewBus({ ...newBus, caretakerId: e.target.value })}
            >
              {caretakers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" type="button" onClick={() => setShowAddBusModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Enrol Bus</Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD DRIVER */}
      <Modal
        isOpen={showAddDriverModal}
        onClose={() => setShowAddDriverModal(false)}
        title="Enrol New Transport Driver"
        size="md"
      >
        <form onSubmit={handleAddDriver} className="space-y-4">
          <Input
            label="Driver Full Name"
            placeholder="e.g. K. Murugesan"
            required
            value={newDriver.name}
            onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
          />
          <Input
            label="Mobile Contact Number"
            placeholder="e.g. +91 94421 98765"
            required
            value={newDriver.phone}
            onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
          />
          <Input
            label="Commercial Driving Licence Number"
            placeholder="e.g. TN-76-2016-003412"
            required
            value={newDriver.licenceNo}
            onChange={(e) => setNewDriver({ ...newDriver, licenceNo: e.target.value })}
          />
          <Input
            label="Experience (Years)"
            type="number"
            value={newDriver.experienceYears}
            onChange={(e) => setNewDriver({ ...newDriver, experienceYears: Number(e.target.value) })}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" type="button" onClick={() => setShowAddDriverModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Driver</Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD CARETAKER */}
      <Modal
        isOpen={showAddCaretakerModal}
        onClose={() => setShowAddCaretakerModal(false)}
        title="Enrol Bus Caretaker"
        size="md"
      >
        <form onSubmit={handleAddCaretaker} className="space-y-4">
          <Input
            label="Caretaker Full Name"
            placeholder="e.g. T. Gomathi"
            required
            value={newCaretaker.name}
            onChange={(e) => setNewCaretaker({ ...newCaretaker, name: e.target.value })}
          />
          <Input
            label="Contact Mobile Number"
            placeholder="e.g. +91 96291 00412"
            required
            value={newCaretaker.phone}
            onChange={(e) => setNewCaretaker({ ...newCaretaker, phone: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" type="button" onClick={() => setShowAddCaretakerModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Caretaker</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
