// AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL
// Transport Management & Live Bus Tracking Module (Mock Data & Architecture)

export interface BusStop {
  id: string;
  name: string;
  pickupTime: string;   // e.g. "07:15 AM"
  dropTime: string;     // e.g. "04:15 PM"
  status: 'passed' | 'current' | 'upcoming';
  lat: number;
  lng: number;
  isSchool?: boolean;
}

export interface BusRoute {
  id: string;
  name: string;
  code: string;
  busId: string;
  totalDistanceKm: number;
  estimatedDurationMins: number;
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
  isLiveGps: false; // Ready for hardware live GPS integration
}

export interface Bus {
  id: string;
  busNumber: string;          // e.g. "AVK BUS 01"
  registrationNo: string;     // e.g. "TN 76 AV 1930"
  model: string;              // e.g. "Ashok Leyland Sunshine (40 Seater)"
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
  type: 'started' | 'approaching_pickup' | 'picked_up' | 'reached_school' | 'departed_school' | 'approaching_drop' | 'delay' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  busNumber: string;
  read: boolean;
  priority: 'normal' | 'high' | 'urgent';
}

export const GPS_SIMULATION_DISCLAIMER = "Demo Location – Not Live GPS (Ready for hardware GPS device)";

// Mock Routes around Sankarankovil / Tenkasi (AVK School vicinity)
export const mockRoutes: BusRoute[] = [
  {
    id: 'route-01',
    name: 'Sankarankovil Town to Campus Route A',
    code: 'ROUTE-A',
    busId: 'bus-01',
    totalDistanceKm: 18.5,
    estimatedDurationMins: 45,
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
    busId: 'bus-02',
    totalDistanceKm: 24.0,
    estimatedDurationMins: 55,
    stops: [
      { id: 'stop-2-1', name: 'Kalugumalai Bus Stand', pickupTime: '06:50 AM', dropTime: '05:00 PM', status: 'passed', lat: 9.1430, lng: 77.7050 },
      { id: 'stop-2-2', name: 'Kuruvikulam Panchayat Union', pickupTime: '07:10 AM', dropTime: '04:40 PM', status: 'passed', lat: 9.1550, lng: 77.6420 },
      { id: 'stop-2-3', name: 'Thiruvengadam Crossing', pickupTime: '07:25 AM', dropTime: '04:25 PM', status: 'passed', lat: 9.1680, lng: 77.5950 },
      { id: 'stop-2-4', name: 'Vanniconendal Bypass', pickupTime: '07:40 AM', dropTime: '04:15 PM', status: 'passed', lat: 9.1820, lng: 77.5750 },
      { id: 'stop-2-5', name: 'AVK Senior Secondary School Campus', pickupTime: '07:50 AM', dropTime: '04:00 PM', status: 'passed', lat: 9.1920, lng: 77.5620, isSchool: true },
    ],
  },
  {
    id: 'route-03',
    name: 'Rajapalayam Border Suburban Route C',
    code: 'ROUTE-C',
    busId: 'bus-03',
    totalDistanceKm: 21.0,
    estimatedDurationMins: 50,
    stops: [
      { id: 'stop-3-1', name: 'Seithur Bus Stop', pickupTime: '06:55 AM', dropTime: '04:55 PM', status: 'upcoming', lat: 9.3800, lng: 77.5200 },
      { id: 'stop-3-2', name: 'Devadanam Cross', pickupTime: '07:12 AM', dropTime: '04:38 PM', status: 'upcoming', lat: 9.3100, lng: 77.5300 },
      { id: 'stop-3-3', name: 'Karivalamvandanallur Bazar', pickupTime: '07:28 AM', dropTime: '04:22 PM', status: 'upcoming', lat: 9.2400, lng: 77.5450 },
      { id: 'stop-3-4', name: 'Sankarankovil North Ring Road', pickupTime: '07:42 AM', dropTime: '04:10 PM', status: 'upcoming', lat: 9.1950, lng: 77.5510 },
      { id: 'stop-3-5', name: 'AVK Senior Secondary School Campus', pickupTime: '07:55 AM', dropTime: '04:00 PM', status: 'upcoming', lat: 9.1920, lng: 77.5620, isSchool: true },
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
  {
    id: 'drv-03',
    name: 'S. Anthony Raj',
    phone: '+91 97890 23411',
    licenceNo: 'TN-76-2018-001290',
    photo: '👨🏻‍✈️',
    assignedBusId: 'bus-03',
    assignedBusNumber: 'AVK BUS 03',
    status: 'available',
    experienceYears: 8,
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
  {
    id: 'ct-03',
    name: 'R. Karpagam',
    phone: '+91 95002 88765',
    photo: '👩🏻‍💼',
    assignedBusId: 'bus-03',
    assignedBusNumber: 'AVK BUS 03',
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
      gpsTimestamp: 'Today, 07:26 AM (Simulated)',
      speedKmH: 34,
      heading: 'North-East (towards Vadikkottai)',
      currentStopId: 'stop-1-3',
      currentStopName: 'Railway Station Feeder Road',
      nextStopName: 'Vadikkottai Junction (Rajapalayam Rd)',
      etaNextStopMins: 11,
      distanceRemainingKm: 6.8,
      trackingStatus: 'simulated_active',
      isLiveGps: false,
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
      gpsTimestamp: 'Today, 07:51 AM (Simulated)',
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
  {
    id: 'bus-03',
    busNumber: 'AVK BUS 03',
    registrationNo: 'TN 76 CC 3108',
    model: 'Force Traveller Monobus (32 Seater)',
    capacity: 32,
    occupiedSeats: 0,
    status: 'not_in_service',
    routeId: 'route-03',
    routeName: 'Rajapalayam Border Suburban Route C',
    driverId: 'drv-03',
    driverName: 'S. Anthony Raj',
    caretakerId: 'ct-03',
    caretakerName: 'R. Karpagam',
    schoolName: 'AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL',
    telemetry: {
      busId: 'bus-03',
      driverId: 'drv-03',
      routeId: 'route-03',
      lat: 9.3800,
      lng: 77.5200,
      gpsTimestamp: 'Scheduled for Afternoon / Standby',
      speedKmH: 0,
      heading: 'Stationary (Depot)',
      currentStopId: 'stop-3-1',
      currentStopName: 'Seithur Bus Stop',
      nextStopName: 'Not In Service',
      etaNextStopMins: 0,
      distanceRemainingKm: 21.0,
      trackingStatus: 'offline',
      isLiveGps: false,
    },
  },
];

export const mockStudentAssignments: StudentTransportAssignment[] = [
  {
    id: 'ta-01',
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
  {
    id: 'ta-03',
    studentId: 'stud-001',
    studentName: 'S. Adhithya',
    admissionNo: 'AVK-2024-0412',
    classSection: 'Class 5-A',
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
    parentName: 'Sundar Rajan',
    parentPhone: '+91 98840 11223',
    status: 'active',
  },
  {
    id: 'ta-02',
    studentId: 'stud-002',
    studentName: 'S. Ananya',
    admissionNo: 'AVK-2025-0819',
    classSection: 'Class 3-B',
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
    parentName: 'Sundar Rajan',
    parentPhone: '+91 98840 11223',
    status: 'active',
  },
  {
    id: 'ta-03',
    studentId: 'stud-003',
    studentName: 'M. Kavin',
    admissionNo: 'AVK-2023-0102',
    classSection: 'Class 8-A',
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
    parentName: 'Murugan V.',
    parentPhone: '+91 98840 22334',
    status: 'active',
  },
  {
    id: 'ta-04',
    studentId: 'stud-004',
    studentName: 'R. Diya',
    admissionNo: 'AVK-2024-0310',
    classSection: 'Class 6-B',
    busId: 'bus-01',
    busNumber: 'AVK BUS 01',
    routeId: 'route-01',
    routeName: 'Sankarankovil Town to Campus Route A',
    pickupStopId: 'stop-1-2',
    pickupStopName: 'Gomathi Amman Temple Arch',
    pickupTime: '07:15 AM',
    dropStopId: 'stop-1-2',
    dropStopName: 'Gomathi Amman Temple Arch',
    dropTime: '04:35 PM',
    parentName: 'Ramesh K.',
    parentPhone: '+91 97890 54321',
    status: 'active',
  },
];

export const mockTransportNotifications: TransportNotification[] = [
  {
    id: 'notif-01',
    type: 'approaching_pickup',
    title: 'Bus Approaching Pickup Point',
    message: 'AVK BUS 01 is 2 km away from Railway Station Feeder Road stop. Expected arrival in 4 minutes.',
    timestamp: 'Today, 07:22 AM',
    busNumber: 'AVK BUS 01',
    read: false,
    priority: 'high',
  },
  {
    id: 'notif-02',
    type: 'picked_up',
    title: 'Child Boarded School Bus',
    message: 'Adhithya has safely boarded AVK BUS 01 at Railway Station Feeder Road stop.',
    timestamp: 'Today, 07:26 AM',
    busNumber: 'AVK BUS 01',
    read: true,
    priority: 'normal',
  },
  {
    id: 'notif-03',
    type: 'started',
    title: 'Morning Route Started',
    message: 'AVK BUS 01 has departed from Main Bus Depot for morning pickup service.',
    timestamp: 'Today, 07:05 AM',
    busNumber: 'AVK BUS 01',
    read: true,
    priority: 'normal',
  },
  {
    id: 'notif-04',
    type: 'reached_school',
    title: 'Bus Safely Reached Campus',
    message: 'AVK BUS 02 has safely arrived at AVK School Campus. All students deboarded under staff care.',
    timestamp: 'Today, 07:51 AM',
    busNumber: 'AVK BUS 02',
    read: true,
    priority: 'normal',
  },
  {
    id: 'notif-05',
    type: 'delay',
    title: 'Minor Route Traffic Notice',
    message: 'Route A is experiencing mild traffic congestion near Rajapalayam Junction (+6 mins expected).',
    timestamp: 'Yesterday, 07:35 AM',
    busNumber: 'AVK BUS 01',
    read: true,
    priority: 'high',
  },
  {
    id: 'notif-06',
    type: 'departed_school',
    title: 'Evening Trip Started',
    message: 'AVK BUS 01 has departed from AVK Campus on the evening return route.',
    timestamp: 'Yesterday, 04:02 PM',
    busNumber: 'AVK BUS 01',
    read: true,
    priority: 'normal',
  },
];

// Helper to look up student bus details
export function getStudentBusAssignment(studentId?: string): {
  assignment?: StudentTransportAssignment;
  bus?: Bus;
  route?: BusRoute;
  driver?: Driver;
  caretaker?: Caretaker;
} {
  if (!studentId) return {};
  const assignment = mockStudentAssignments.find(
    (a) =>
      a.studentId === studentId ||
      a.admissionNo === studentId ||
      a.studentName.toLowerCase().includes(studentId.toLowerCase())
  );
  if (!assignment) return {};

  const bus = mockBuses.find((b) => b.id === assignment.busId);
  const route = mockRoutes.find((r) => r.id === assignment.routeId);
  const driver = mockDrivers.find((d) => d.id === bus?.driverId);
  const caretaker = mockCaretakers.find((c) => c.id === bus?.caretakerId);

  return { assignment, bus, route, driver, caretaker };
}
