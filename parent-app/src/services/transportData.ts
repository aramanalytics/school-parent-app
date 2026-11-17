// AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL
// Transport Management & Live Bus Tracking Module (Parent App Service)

export interface BusStop {
  id: string;
  name: string;
  pickupTime: string;
  dropTime: string;
  status: 'passed' | 'current' | 'upcoming';
  lat: number;
  lng: number;
  isSchool?: boolean;
}

export interface BusRoute {
  id: string;
  name: string;
  code: string;
  routeNumber: string;
  busId: string;
  totalDistanceKm: number;
  estimatedDurationMins: number;
  schoolArrivalTime: string;
  schoolDepartureTime: string;
  stops: BusStop[];
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenceNo: string;
  photo: string;
  assignedBusId: string;
  assignedBusNumber: string;
  status: 'available' | 'on_duty' | 'off_duty';
  experienceYears: number;
}

export interface Caretaker {
  id: string;
  name: string;
  phone: string;
  photo: string;
  assignedBusId: string;
  assignedBusNumber: string;
  status: 'available' | 'on_duty' | 'off_duty';
}

export interface BusTelemetry {
  busId: string;
  driverId: string;
  routeId: string;
  lat: number;
  lng: number;
  gpsTimestamp: string;
  speedKmH: number;
  heading: string;
  currentStopId: string;
  currentStopName: string;
  nextStopName: string;
  etaNextStopMins: number;
  distanceRemainingKm: number;
  trackingStatus: 'simulated_active' | 'idle' | 'offline';
  isLiveGps: boolean; // Set to false when hardware GPS device is not transmitting live data
}

export interface Bus {
  id: string;
  busNumber: string;
  registrationNo: string;
  model: string;
  capacity: number;
  occupiedSeats: number;
  status: 'on_route' | 'at_school' | 'not_in_service';
  routeId: string;
  routeName: string;
  driverId: string;
  driverName: string;
  caretakerId: string;
  caretakerName: string;
  schoolName: string;
  telemetry: BusTelemetry;
}

export interface StudentTransportAssignment {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classSection: string;
  busId: string;
  busNumber: string;
  routeId: string;
  routeName: string;
  pickupStopId: string;
  pickupStopName: string;
  pickupTime: string;
  dropStopId: string;
  dropStopName: string;
  dropTime: string;
  parentName: string;
  parentPhone: string;
  status: 'active' | 'suspended';
}

export interface TransportNotification {
  id: string;
  type:
    | 'started_school'
    | 'approaching_pickup'
    | 'picked_up'
    | 'reached_school'
    | 'departed_school'
    | 'approaching_drop'
    | 'delay'
    | 'cancelled';
  title: string;
  message: string;
  timestamp: string;
  date: string;
  busNumber: string;
  read: boolean;
  priority: 'normal' | 'high' | 'urgent';
}

export const GPS_STATUS_MESSAGE = 'Live bus tracking is not currently available.';
export const GPS_SIMULATION_DISCLAIMER =
  'Live bus tracking is not currently available. Dedicated hardware GPS devices are currently being fitted onto AVK transport vehicles. The interface below represents the live telemetry framework ready for streaming vehicle coordinates.';

export const mockRoutes: BusRoute[] = [
  {
    id: 'route-01',
    name: 'Sankarankovil Town to Campus Route A',
    code: 'ROUTE-A',
    routeNumber: 'AVK-RT-01',
    busId: 'bus-01',
    totalDistanceKm: 18.5,
    estimatedDurationMins: 45,
    schoolArrivalTime: '07:55 AM',
    schoolDepartureTime: '04:00 PM',
    stops: [
      { id: 'stop-1-1', name: 'Main Bus Depot, Sankarankovil', pickupTime: '07:05 AM', dropTime: '04:45 PM', status: 'passed', lat: 9.1720, lng: 77.5350 },
      { id: 'stop-1-2', name: 'Gomathi Amman Temple Arch', pickupTime: '07:15 AM', dropTime: '04:35 PM', status: 'passed', lat: 9.1745, lng: 77.5410 },
      { id: 'stop-1-3', name: 'Railway Station Feeder Road', pickupTime: '07:25 AM', dropTime: '04:25 PM', status: 'current', lat: 9.1790, lng: 77.5480 },
      { id: 'stop-1-4', name: 'Vadikkottai Junction (Rajapalayam Rd)', pickupTime: '07:38 AM', dropTime: '04:12 PM', status: 'upcoming', lat: 9.1860, lng: 77.5540 },
      { id: 'stop-1-5', name: 'AVK Senior Secondary School Campus', pickupTime: '07:55 AM', dropTime: '04:00 PM', status: 'upcoming', lat: 9.1920, lng: 77.5620, isSchool: true },
    ],
  },
  {
    id: 'route-02',
    name: 'Kalugumalai - Kuruvikulam Express Route B',
    code: 'ROUTE-B',
    routeNumber: 'AVK-RT-02',
    busId: 'bus-02',
    totalDistanceKm: 24.0,
    estimatedDurationMins: 55,
    schoolArrivalTime: '07:50 AM',
    schoolDepartureTime: '04:00 PM',
    stops: [
      { id: 'stop-2-1', name: 'Kalugumalai Bus Stand', pickupTime: '06:50 AM', dropTime: '05:00 PM', status: 'passed', lat: 9.1430, lng: 77.7050 },
      { id: 'stop-2-2', name: 'Kuruvikulam Panchayat Union', pickupTime: '07:10 AM', dropTime: '04:40 PM', status: 'passed', lat: 9.1550, lng: 77.6420 },
      { id: 'stop-2-3', name: 'Thiruvengadam Crossing', pickupTime: '07:25 AM', dropTime: '04:25 PM', status: 'passed', lat: 9.1680, lng: 77.5950 },
      { id: 'stop-2-4', name: 'Vanniconendal Bypass', pickupTime: '07:40 AM', dropTime: '04:15 PM', status: 'passed', lat: 9.1820, lng: 77.5750 },
      { id: 'stop-2-5', name: 'AVK Senior Secondary School Campus', pickupTime: '07:50 AM', dropTime: '04:00 PM', status: 'passed', lat: 9.1920, lng: 77.5620, isSchool: true },
    ],
  },
];

export const mockDrivers: Driver[] = [
  {
    id: 'drv-01',
    name: 'M. Shanmuganathan',
    phone: '+91 94432 10892',
    licenceNo: 'TN-76-2012-004312',
    photo: '👨🏽‍✈️',
    assignedBusId: 'bus-01',
    assignedBusNumber: 'AVK BUS 01',
    status: 'on_duty',
    experienceYears: 14,
  },
  {
    id: 'drv-02',
    name: 'K. Perumal',
    phone: '+91 98421 87654',
    licenceNo: 'TN-72-2015-009811',
    photo: '👨🏾‍✈️',
    assignedBusId: 'bus-02',
    assignedBusNumber: 'AVK BUS 02',
    status: 'available',
    experienceYears: 11,
  },
];

export const mockCaretakers: Caretaker[] = [
  {
    id: 'ct-01',
    name: 'S. Muthulakshmi',
    phone: '+91 96291 55432',
    photo: '👩🏽‍💼',
    assignedBusId: 'bus-01',
    assignedBusNumber: 'AVK BUS 01',
    status: 'on_duty',
  },
  {
    id: 'ct-02',
    name: 'P. Saraswathi',
    phone: '+91 99441 33211',
    photo: '👩🏾‍💼',
    assignedBusId: 'bus-02',
    assignedBusNumber: 'AVK BUS 02',
    status: 'available',
  },
];

export const mockBuses: Bus[] = [
  {
    id: 'bus-01',
    busNumber: 'AVK BUS 01',
    registrationNo: 'TN 76 AV 1930',
    model: 'Ashok Leyland Sunshine (42 Seater)',
    capacity: 42,
    occupiedSeats: 36,
    status: 'on_route',
    routeId: 'route-01',
    routeName: 'Sankarankovil Town to Campus Route A',
    driverId: 'drv-01',
    driverName: 'M. Shanmuganathan',
    caretakerId: 'ct-01',
    caretakerName: 'S. Muthulakshmi',
    schoolName: 'AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL',
    telemetry: {
      busId: 'bus-01',
      driverId: 'drv-01',
      routeId: 'route-01',
      lat: 9.1790,
      lng: 77.5480,
      gpsTimestamp: 'Today, 07:26 AM',
      speedKmH: 34,
      heading: 'North-East (towards Vadikkottai)',
      currentStopId: 'stop-1-3',
      currentStopName: 'Railway Station Feeder Road',
      nextStopName: 'Vadikkottai Junction (Rajapalayam Rd)',
      etaNextStopMins: 11,
      distanceRemainingKm: 6.8,
      trackingStatus: 'simulated_active',
      isLiveGps: false, // Flag indicating live hardware GPS is currently pending
    },
  },
  {
    id: 'bus-02',
    busNumber: 'AVK BUS 02',
    registrationNo: 'TN 76 BB 2045',
    model: 'Tata Starbus Ultra (48 Seater)',
    capacity: 48,
    occupiedSeats: 44,
    status: 'at_school',
    routeId: 'route-02',
    routeName: 'Kalugumalai - Kuruvikulam Express Route B',
    driverId: 'drv-02',
    driverName: 'K. Perumal',
    caretakerId: 'ct-02',
    caretakerName: 'P. Saraswathi',
    schoolName: 'AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL',
    telemetry: {
      busId: 'bus-02',
      driverId: 'drv-02',
      routeId: 'route-02',
      lat: 9.1920,
      lng: 77.5620,
      gpsTimestamp: 'Today, 07:51 AM',
      speedKmH: 0,
      heading: 'Parked in Campus Bay 2',
      currentStopId: 'stop-2-5',
      currentStopName: 'AVK Senior Secondary School Campus',
      nextStopName: 'Trip Completed (At School)',
      etaNextStopMins: 0,
      distanceRemainingKm: 0,
      trackingStatus: 'idle',
      isLiveGps: false,
    },
  },
];

// Student transport assignments mapped to demo children in Parent App
export const mockStudentAssignments: StudentTransportAssignment[] = [
  {
    id: 'ta-01',
    // Child 1 (Aarav Krishnan)
    studentId: '88888888-0001-8888-8888-888888888888',
    studentName: 'Aarav Krishnan',
    admissionNo: 'ADM2026-0501',
    classSection: 'Class 5 • Section A',
    busId: 'bus-01',
    busNumber: 'AVK BUS 01',
    routeId: 'route-01',
    routeName: 'Sankarankovil Town to Campus Route A',
    pickupStopId: 'stop-1-3',
    pickupStopName: 'Railway Station Feeder Road',
    pickupTime: '07:25 AM',
    dropStopId: 'stop-1-3',
    dropStopName: 'Railway Station Feeder Road',
    dropTime: '04:25 PM',
    parentName: 'Ramesh Krishnan',
    parentPhone: '+91 98840 11223',
    status: 'active',
  },
  {
    id: 'ta-02',
    // Child 2 (Diya Krishnan)
    studentId: '88888888-0002-8888-8888-888888888888',
    studentName: 'Diya Krishnan',
    admissionNo: 'ADM2026-0502',
    classSection: 'Class 5 • Section B',
    busId: 'bus-02',
    busNumber: 'AVK BUS 02',
    routeId: 'route-02',
    routeName: 'Kalugumalai - Kuruvikulam Express Route B',
    pickupStopId: 'stop-2-2',
    pickupStopName: 'Kuruvikulam Panchayat Union',
    pickupTime: '07:10 AM',
    dropStopId: 'stop-2-2',
    dropStopName: 'Kuruvikulam Panchayat Union',
    dropTime: '04:40 PM',
    parentName: 'Ramesh Krishnan',
    parentPhone: '+91 98840 11223',
    status: 'active',
  },
];

// Rich set of transport notifications covering all required event types
export const mockTransportNotifications: TransportNotification[] = [
  {
    id: 'notif-01',
    type: 'approaching_pickup',
    title: 'Bus Approaching Pickup Stop',
    message: 'AVK BUS 01 is 1.8 km away from Railway Station Feeder Road stop. Expected arrival in 4 minutes.',
    timestamp: '07:21 AM',
    date: 'Today',
    busNumber: 'AVK BUS 01',
    read: false,
    priority: 'high',
  },
  {
    id: 'notif-02',
    type: 'picked_up',
    title: 'Student Boarding Confirmed',
    message: 'Aarav has safely boarded AVK BUS 01 at Railway Station Feeder Road stop under caretaker supervision.',
    timestamp: '07:26 AM',
    date: 'Today',
    busNumber: 'AVK BUS 01',
    read: true,
    priority: 'normal',
  },
  {
    id: 'notif-03',
    type: 'reached_school',
    title: 'Bus Safely Reached School',
    message: 'AVK BUS 02 has safely arrived at AVK School Campus. Diya and all student passengers deboarded safely.',
    timestamp: '07:51 AM',
    date: 'Today',
    busNumber: 'AVK BUS 02',
    read: true,
    priority: 'normal',
  },
  {
    id: 'notif-04',
    type: 'started_school',
    title: 'Morning Route Started from Depot',
    message: 'AVK BUS 01 has departed from Sankarankovil Main Depot for morning student pickup operations.',
    timestamp: '07:05 AM',
    date: 'Today',
    busNumber: 'AVK BUS 01',
    read: true,
    priority: 'normal',
  },
  {
    id: 'notif-05',
    type: 'approaching_drop',
    title: 'Bus Approaching Drop-off Stop',
    message: 'AVK BUS 01 is 5 minutes away from your evening drop-off point at Railway Station Feeder Road.',
    timestamp: '04:20 PM',
    date: 'Yesterday',
    busNumber: 'AVK BUS 01',
    read: true,
    priority: 'high',
  },
  {
    id: 'notif-06',
    type: 'departed_school',
    title: 'Bus Departed from School',
    message: 'AVK BUS 01 has departed from AVK Campus on the evening return route.',
    timestamp: '04:02 PM',
    date: 'Yesterday',
    busNumber: 'AVK BUS 01',
    read: true,
    priority: 'normal',
  },
  {
    id: 'notif-07',
    type: 'delay',
    title: 'Route Delay Alert',
    message: 'Route A is experiencing mild traffic congestion near Rajapalayam Crossing (+8 mins expected).',
    timestamp: '07:35 AM',
    date: '14 Nov',
    busNumber: 'AVK BUS 01',
    read: true,
    priority: 'high',
  },
  {
    id: 'notif-08',
    type: 'cancelled',
    title: 'Service Advisory (Advance Notice)',
    message: 'No service cancellations scheduled. Fleet operating on full academic timetable.',
    timestamp: '06:00 AM',
    date: '10 Nov',
    busNumber: 'AVK Fleet',
    read: true,
    priority: 'normal',
  },
];

/**
 * Returns the exact transport assignment, bus, route, driver, and caretaker
 * for the currently selected student.
 * If the student is not enrolled in transport, returns null.
 */
export function getStudentBusDetails(studentId?: string | number) {
  if (!studentId) return null;
  const sId = String(studentId).trim();

  // Find assignment matching studentId (supports both UUID or shorthand '1' / '2')
  const assignment = mockStudentAssignments.find((a) => {
    if (a.studentId === sId) return true;
    if (sId === '1' && a.studentId === '88888888-0001-8888-8888-888888888888') return true;
    if (sId === '2' && a.studentId === '88888888-0002-8888-8888-888888888888') return true;
    return false;
  });

  if (!assignment) return null;

  const bus = mockBuses.find((b) => b.id === assignment.busId);
  const route = mockRoutes.find((r) => r.id === assignment.routeId);
  const driver = mockDrivers.find((d) => d.id === bus?.driverId);
  const caretaker = mockCaretakers.find((c) => c.id === bus?.caretakerId);

  return { assignment, bus, route, driver, caretaker };
}
