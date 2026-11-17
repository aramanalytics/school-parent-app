import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  Platform,
} from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';
import {
  Bus as BusIcon,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Radio,
  Bell,
  ChevronDown,
  UserCheck,
  Plus,
  Minus,
  AlertTriangle,
} from 'lucide-react-native';
import {
  getStudentBusDetails,
  mockTransportNotifications,
  GPS_STATUS_MESSAGE,
  GPS_SIMULATION_DISCLAIMER,
  TransportNotification,
} from '../src/services/transportData';

const { width } = Dimensions.get('window');

type TabType = 'overview' | 'route' | 'crew' | 'tracking' | 'alerts';

export default function SchoolBusScreen() {
  const { selectedStudent, students, switchStudent } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showSimulatedPreview, setShowSimulatedPreview] = useState<boolean>(false);

  // Retrieve transport data for active child
  const transportData = getStudentBusDetails(selectedStudent?.id);

  const handleCall = (phoneNumber: string, personName: string) => {
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
    const url = `tel:${cleanNumber}`;
    Linking.openURL(url).catch((err) => {
      console.warn('Could not open phone dialer:', err);
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. TOP OFFICIAL SCHOOL BRAND BANNER */}
      <View style={styles.heroCard}>
        <View style={styles.schoolTagRow}>
          <View style={styles.schoolPill}>
            <Text style={styles.schoolPillText}>AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL</Text>
          </View>
        </View>

        {/* 2. MULTIPLE CHILDREN SELECTOR STRIP */}
        <View style={styles.childrenSwitcherCard}>
          <Text style={styles.childrenSwitcherLabel}>Active Student / Ward:</Text>
          <View style={styles.childrenSwitcherRow}>
            {students.map((std) => {
              const isCurrent = std.id === selectedStudent?.id;
              return (
                <TouchableOpacity
                  key={std.id}
                  style={[
                    styles.childPillButton,
                    isCurrent && styles.childPillButtonActive,
                  ]}
                  onPress={() => switchStudent(std.id)}
                >
                  <UserCheck size={12} color={isCurrent ? '#172554' : '#FFFFFF'} />
                  <Text
                    style={[
                      styles.childPillButtonText,
                      isCurrent && styles.childPillButtonTextActive,
                    ]}
                  >
                    {std.name} ({std.class_name}-{std.section_name})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* If student has NO bus assigned, render the required empty state */}
        {(!transportData || !transportData.bus) ? (
          <View style={styles.emptyCardInner}>
            <View style={styles.emptyIconBg}>
              <BusIcon size={34} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitleLight}>No Bus Assigned</Text>
            <Text style={styles.emptyTextLight}>
              No school bus has been assigned to this student yet.
            </Text>
            <View style={styles.emptyHelpBoxLight}>
              <Text style={styles.emptyHelpTextLight}>
                To enrol {selectedStudent?.name} into the AVK School Transport system, please contact the campus Transport Coordinator or submit a request in Parent Feedback.
              </Text>
            </View>
          </View>
        ) : (
          <>
            {/* Bus Identification & Hero Row */}
            <View style={styles.heroMainRow}>
              <View style={styles.busAvatarBox}>
                <Text style={styles.busAvatarText}>🚌</Text>
              </View>

              <View style={styles.heroDetails}>
                <View style={styles.heroTitleRow}>
                  <Text style={styles.busNumberText}>{transportData.bus.busNumber}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      transportData.bus.status === 'on_route'
                        ? styles.statusBadgeGreen
                        : transportData.bus.status === 'at_school'
                        ? styles.statusBadgeBlue
                        : styles.statusBadgeGray,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        transportData.bus.status === 'on_route'
                          ? styles.statusDotGreen
                          : transportData.bus.status === 'at_school'
                          ? styles.statusDotBlue
                          : styles.statusDotGray,
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusBadgeText,
                        transportData.bus.status === 'on_route'
                          ? styles.statusTextGreen
                          : transportData.bus.status === 'at_school'
                          ? styles.statusTextBlue
                          : styles.statusTextGray,
                      ]}
                    >
                      {transportData.bus.status === 'on_route'
                        ? 'On Route'
                        : transportData.bus.status === 'at_school'
                        ? 'At School'
                        : 'Not In Service'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.regNoText}>Registration: {transportData.bus.registrationNo}</Text>
                <Text style={styles.modelText}>{transportData.bus.model}</Text>
              </View>
            </View>

            {/* Assigned Route & Child Stop Summary */}
            <View style={styles.heroFooter}>
              <View style={styles.heroFooterCol}>
                <Text style={styles.heroFooterLabel}>Assigned Route</Text>
                <Text style={styles.heroFooterValue} numberOfLines={1}>{transportData.route?.name}</Text>
                <Text style={styles.heroFooterSub}>Route No: {transportData.route?.routeNumber}</Text>
              </View>
              <View style={styles.heroFooterColRight}>
                <Text style={styles.heroFooterLabel}>Child Boarding Stop</Text>
                <Text style={styles.heroFooterValueHighlight} numberOfLines={1}>
                  {transportData.assignment.pickupStopName}
                </Text>
                <Text style={styles.heroFooterSubRight}>
                  Pick: {transportData.assignment.pickupTime} &bull; Drop: {transportData.assignment.dropTime}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Only show subsections if student has bus assigned */}
      {transportData && transportData.bus && (
        <>
          {/* 3. SUB-SECTION TABS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScrollView}
            contentContainerStyle={styles.tabsContainer}
          >
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'overview' && styles.tabButtonActive]}
              onPress={() => setActiveTab('overview')}
            >
              <BusIcon size={14} color={activeTab === 'overview' ? '#FFFFFF' : '#64748B'} />
              <Text style={[styles.tabButtonText, activeTab === 'overview' && styles.tabButtonTextActive]}>
                Bus Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'route' && styles.tabButtonActive]}
              onPress={() => setActiveTab('route')}
            >
              <Navigation size={14} color={activeTab === 'route' ? '#FFFFFF' : '#64748B'} />
              <Text style={[styles.tabButtonText, activeTab === 'route' && styles.tabButtonTextActive]}>
                My Bus Route
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'crew' && styles.tabButtonActive]}
              onPress={() => setActiveTab('crew')}
            >
              <ShieldCheck size={14} color={activeTab === 'crew' ? '#FFFFFF' : '#64748B'} />
              <Text style={[styles.tabButtonText, activeTab === 'crew' && styles.tabButtonTextActive]}>
                Driver & Caretaker
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'tracking' && styles.tabButtonActive]}
              onPress={() => setActiveTab('tracking')}
            >
              <Radio size={14} color={activeTab === 'tracking' ? '#FFFFFF' : '#64748B'} />
              <Text style={[styles.tabButtonText, activeTab === 'tracking' && styles.tabButtonTextActive]}>
                Live Tracking
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'alerts' && styles.tabButtonActive]}
              onPress={() => setActiveTab('alerts')}
            >
              <Bell size={14} color={activeTab === 'alerts' ? '#FFFFFF' : '#64748B'} />
              <Text style={[styles.tabButtonText, activeTab === 'alerts' && styles.tabButtonTextActive]}>
                Bus Notifications
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* TAB 1: BUS DETAILS OVERVIEW */}
          {activeTab === 'overview' && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>My Bus Details</Text>
              <Text style={styles.sectionSubtitle}>
                Official school vehicle allocated for {selectedStudent?.name}
              </Text>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Assigned School</Text>
                  <Text style={styles.infoValueBold}>AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Bus Number</Text>
                  <Text style={styles.infoValueHighlight}>{transportData.bus.busNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Vehicle Registration</Text>
                  <Text style={styles.infoValueMono}>{transportData.bus.registrationNo}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Bus Model / Make</Text>
                  <Text style={styles.infoValue}>{transportData.bus.model}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Seating Capacity</Text>
                  <Text style={styles.infoValue}>{transportData.bus.capacity} Passenger Seats ({transportData.bus.occupiedSeats} Allocated)</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Current Bus Status</Text>
                  <Text style={transportData.bus.status === 'on_route' ? styles.statusGreenText : styles.statusBlueText}>
                    {transportData.bus.status === 'on_route' ? '● On Active Route' : '● At School Campus'}
                  </Text>
                </View>
                <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.infoLabel}>Route Name & Code</Text>
                  <Text style={styles.infoValue}>{transportData.route?.name} ({transportData.route?.routeNumber})</Text>
                </View>
              </View>

              {/* Quick Timing Cards */}
              <View style={styles.timingGrid}>
                <View style={styles.timingCard}>
                  <Clock size={16} color="#3B5BDB" />
                  <Text style={styles.timingLabel}>Pickup Time</Text>
                  <Text style={styles.timingValue}>{transportData.assignment.pickupTime}</Text>
                  <Text style={styles.timingStop} numberOfLines={1}>{transportData.assignment.pickupStopName}</Text>
                </View>

                <View style={styles.timingCard}>
                  <Clock size={16} color="#D97706" />
                  <Text style={styles.timingLabel}>Evening Drop Time</Text>
                  <Text style={styles.timingValue}>{transportData.assignment.dropTime}</Text>
                  <Text style={styles.timingStop} numberOfLines={1}>{transportData.assignment.dropStopName}</Text>
                </View>
              </View>

              {/* Campus Arrival & Departure Hours */}
              <View style={styles.campusCard}>
                <Text style={styles.campusCardTitle}>Campus Transit Hours</Text>
                <View style={styles.campusTransitRow}>
                  <View style={styles.campusTransitCol}>
                    <Text style={styles.campusTransitLabel}>School Arrival</Text>
                    <Text style={styles.campusTransitValue}>{transportData.route?.schoolArrivalTime}</Text>
                  </View>
                  <View style={styles.campusDivider} />
                  <View style={styles.campusTransitCol}>
                    <Text style={styles.campusTransitLabel}>School Departure</Text>
                    <Text style={styles.campusTransitValue}>{transportData.route?.schoolDepartureTime}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* TAB 2: MY BUS ROUTE & STOPS */}
          {activeTab === 'route' && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>My Bus Route</Text>
              <Text style={styles.sectionSubtitle}>
                {transportData.route?.name} &bull; Route Number: {transportData.route?.routeNumber}
              </Text>

              {/* Legend Strip */}
              <View style={styles.legendStrip}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#3B5BDB' }]} />
                  <Text style={styles.legendText}>Student's Stop</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#16A36A' }]} />
                  <Text style={styles.legendText}>Passed</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#CBD5E1' }]} />
                  <Text style={styles.legendText}>Upcoming</Text>
                </View>
                <View style={styles.legendItem}>
                  <Text style={{ fontSize: 11 }}>🏫</Text>
                  <Text style={styles.legendText}>AVK Campus</Text>
                </View>
              </View>

              {/* Route Progression Timeline */}
              <View style={styles.stopsTimelineCard}>
                {transportData.route?.stops.map((stop, idx) => {
                  const isChildPickup = stop.id === transportData.assignment.pickupStopId;
                  const isChildDrop = stop.id === transportData.assignment.dropStopId;
                  const isChildPoint = isChildPickup || isChildDrop;
                  const isCurrent = stop.status === 'current';
                  const isPassed = stop.status === 'passed';

                  return (
                    <View key={stop.id} style={styles.timelineRow}>
                      {/* Vertical Track Column */}
                      <View style={styles.trackCol}>
                        <View
                          style={[
                            styles.trackDot,
                            isChildPoint
                              ? styles.trackDotChild
                              : isCurrent
                              ? styles.trackDotCurrent
                              : isPassed
                              ? styles.trackDotPassed
                              : styles.trackDotUpcoming,
                          ]}
                        >
                          {stop.isSchool ? (
                            <Text style={{ fontSize: 10 }}>🏫</Text>
                          ) : isPassed ? (
                            <CheckCircle2 size={10} color="#FFFFFF" />
                          ) : (
                            <Text
                              style={[
                                styles.trackDotNum,
                                isChildPoint && { color: '#FFFFFF' },
                              ]}
                            >
                              {idx + 1}
                            </Text>
                          )}
                        </View>
                        {idx < (transportData.route.stops.length - 1) && (
                          <View
                            style={[
                              styles.trackLine,
                              isPassed ? styles.trackLinePassed : styles.trackLineUpcoming,
                            ]}
                          />
                        )}
                      </View>

                      {/* Stop Information Card */}
                      <View
                        style={[
                          styles.stopInfoBox,
                          isChildPoint && styles.childStopHighlightBox,
                        ]}
                      >
                        <View style={styles.stopNameRow}>
                          <Text
                            style={[
                              styles.stopNameText,
                              isChildPoint && styles.childStopNameText,
                            ]}
                          >
                            {stop.name} {stop.isSchool && '(AVK Campus)'}
                          </Text>
                          {isChildPoint && (
                            <View style={styles.yourChildPill}>
                              <Text style={styles.yourChildPillText}>
                                {isChildPickup && isChildDrop
                                  ? "Child's Pickup & Drop Point"
                                  : isChildPickup
                                  ? "Child's Pickup Point"
                                  : "Child's Drop Point"}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.stopTimesRow}>
                          <View style={styles.timeTag}>
                            <Clock size={11} color="#64748B" />
                            <Text style={styles.timeTagText}>
                              Scheduled Pickup: <Text style={{ fontWeight: '700', color: '#172033' }}>{stop.pickupTime}</Text>
                            </Text>
                          </View>
                          <View style={styles.timeTag}>
                            <Clock size={11} color="#64748B" />
                            <Text style={styles.timeTagText}>
                              Scheduled Drop: <Text style={{ fontWeight: '700', color: '#172033' }}>{stop.dropTime}</Text>
                            </Text>
                          </View>
                        </View>

                        <View style={styles.stopStatusRow}>
                          <Text
                            style={[
                              styles.stopStatusBadge,
                              isCurrent
                                ? styles.stopStatusCurrent
                                : isPassed
                                ? styles.stopStatusPassed
                                : styles.stopStatusUpcoming,
                            ]}
                          >
                            {isCurrent ? '● Bus Currently at this Stop' : isPassed ? '✓ Stop Completed' : 'Upcoming Stop'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* TAB 3: DRIVER & CARETAKER CONTACTS */}
          {activeTab === 'crew' && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Driver & Caretaker Information</Text>
              <Text style={styles.sectionSubtitle}>
                Verified staff assigned to {transportData.bus.busNumber}
              </Text>

              {/* DRIVER CARD */}
              <View style={styles.crewCard}>
                <View style={styles.crewHeaderRow}>
                  <View style={styles.crewAvatar}>
                    <Text style={{ fontSize: 32 }}>{transportData.driver?.photo || '👨🏽‍✈️'}</Text>
                  </View>
                  <View style={styles.crewDetails}>
                    <View style={styles.crewRoleTag}>
                      <Text style={styles.crewRoleTagText}>Designated Driver</Text>
                    </View>
                    <Text style={styles.crewName}>{transportData.driver?.name}</Text>
                    <Text style={styles.crewExp}>
                      {transportData.driver?.experienceYears} Years Heavy Passenger Driving Experience
                    </Text>
                    <Text style={styles.licenceText}>
                      Commercial Licence: {transportData.driver?.licenceNo}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => transportData.driver?.phone && handleCall(transportData.driver.phone, transportData.driver.name)}
                >
                  <Phone size={16} color="#FFFFFF" />
                  <Text style={styles.callButtonText}>Call Driver ({transportData.driver?.phone})</Text>
                </TouchableOpacity>
              </View>

              {/* CARETAKER / CONDUCTOR CARD */}
              <View style={styles.crewCard}>
                <View style={styles.crewHeaderRow}>
                  <View style={styles.crewAvatar}>
                    <Text style={{ fontSize: 32 }}>{transportData.caretaker?.photo || '👩🏽‍💼'}</Text>
                  </View>
                  <View style={styles.crewDetails}>
                    <View style={[styles.crewRoleTag, { backgroundColor: '#F3E8FF' }]}>
                      <Text style={[styles.crewRoleTagText, { color: '#7E22CE' }]}>Bus Conductor / Caretaker</Text>
                    </View>
                    <Text style={styles.crewName}>{transportData.caretaker?.name}</Text>
                    <Text style={styles.crewExp}>
                      Child Safeguarding & First Aid Certified
                    </Text>
                    <Text style={styles.licenceText}>
                      Duty: Student Attendance & Boarding Safety
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.callButton, { backgroundColor: '#7E22CE' }]}
                  onPress={() => transportData.caretaker?.phone && handleCall(transportData.caretaker.phone, transportData.caretaker.name)}
                >
                  <Phone size={16} color="#FFFFFF" />
                  <Text style={styles.callButtonText}>Call Caretaker ({transportData.caretaker?.phone})</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* TAB 4: LIVE BUS LOCATION SCREEN */}
          {activeTab === 'tracking' && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Live Bus Location</Text>
              <Text style={styles.sectionSubtitle}>
                Real-time tracking feed for {transportData.bus.busNumber}
              </Text>

              {/* REQUIREMENT: Show exact message if actual GPS is not available */}
              <View style={styles.gpsUnavailableCard}>
                <View style={styles.gpsUnavailableIconBg}>
                  <AlertCircle size={32} color="#D97706" />
                </View>
                <Text style={styles.gpsUnavailableTitle}>Live GPS Status</Text>
                <Text style={styles.gpsUnavailableText}>{GPS_STATUS_MESSAGE}</Text>
                <Text style={styles.gpsUnavailableSubtext}>
                  Dedicated vehicle GPS telematics units are currently undergoing hardware installation and calibration across the AVK fleet. Once operational, real-time live GPS coordinates will stream dynamically onto the map below.
                </Text>

                <TouchableOpacity
                  style={styles.togglePreviewButton}
                  onPress={() => setShowSimulatedPreview(!showSimulatedPreview)}
                >
                  <Text style={styles.togglePreviewText}>
                    {showSimulatedPreview ? 'Hide Route Architecture Preview' : 'Show Route Architecture & Layout Preview'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Conditional Route Map Architecture */}
              {showSimulatedPreview && (
                <View style={styles.mapContainer}>
                  <View style={styles.mapHeaderBar}>
                    <View style={styles.mapHeaderLeft}>
                      <Radio size={14} color="#64748B" />
                      <Text style={styles.mapHeaderTitle}>Route Layout Frame (Ready for Hardware GPS)</Text>
                    </View>
                    <View style={styles.zoomButtonsRow}>
                      <TouchableOpacity
                        style={styles.zoomBtn}
                        onPress={() => setZoomLevel(Math.min(zoomLevel + 0.2, 1.4))}
                      >
                        <Plus size={14} color="#172554" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.zoomBtn}
                        onPress={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.8))}
                      >
                        <Minus size={14} color="#172554" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.mapCanvas,
                      { transform: [{ scale: zoomLevel }] },
                    ]}
                  >
                    {/* Visual Route Path Line */}
                    <View style={styles.mapRoadLine} />

                    {/* Stop 1 */}
                    <View style={[styles.mapNode, { top: 30, left: 30 }]}>
                      <View style={styles.mapNodeCircleGray}>
                        <Text style={styles.mapNodeText}>1</Text>
                      </View>
                      <Text style={styles.mapNodeLabel}>Depot (07:05)</Text>
                    </View>

                    {/* Stop 2 */}
                    <View style={[styles.mapNode, { top: 85, left: 110 }]}>
                      <View style={styles.mapNodeCircleGreen}>
                        <Text style={styles.mapNodeTextWhite}>✓</Text>
                      </View>
                      <Text style={styles.mapNodeLabel}>Temple Arch</Text>
                    </View>

                    {/* Student's Stop Marker */}
                    <View style={[styles.mapNode, { top: 155, left: 180 }]}>
                      <View style={styles.busMarkerOuter}>
                        <View style={styles.busMarkerInner}>
                          <MapPin size={16} color="#FFFFFF" />
                        </View>
                      </View>
                      <View style={styles.activeBusPill}>
                        <Text style={styles.activeBusPillText}>Assigned Stop: {transportData.assignment.pickupStopName}</Text>
                      </View>
                    </View>

                    {/* Stop 4 */}
                    <View style={[styles.mapNode, { top: 245, left: 120 }]}>
                      <View style={styles.mapNodeCircleOrange}>
                        <Text style={styles.mapNodeText}>4</Text>
                      </View>
                      <Text style={styles.mapNodeLabel}>Vadikkottai</Text>
                    </View>

                    {/* Destination: AVK School Campus */}
                    <View style={[styles.mapNode, { top: 290, right: 25 }]}>
                      <View style={styles.schoolDestinationBadge}>
                        <Text style={{ fontSize: 16 }}>🏫</Text>
                      </View>
                      <Text style={styles.schoolDestinationLabel}>AVK Campus</Text>
                    </View>
                  </View>

                  <View style={styles.mapFooterBar}>
                    <Text style={styles.mapFooterText}>
                      Architecture: <Text style={{ fontWeight: 'bold' }}>Native GPS WebSocket Ready</Text>
                    </Text>
                    <Text style={styles.mapFooterText}>
                      Scheduled Arrival: <Text style={{ fontWeight: 'bold' }}>{transportData.route?.schoolArrivalTime}</Text>
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* TAB 5: BUS NOTIFICATIONS & ALERTS */}
          {activeTab === 'alerts' && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Bus Notifications</Text>
              <Text style={styles.sectionSubtitle}>
                Transit milestones and alerts for {transportData.bus.busNumber}
              </Text>

              <View style={styles.notificationsList}>
                {mockTransportNotifications.map((notif: TransportNotification) => (
                  <View
                    key={notif.id}
                    style={[
                      styles.notificationCard,
                      notif.priority === 'high' && styles.notificationCardHigh,
                    ]}
                  >
                    <View style={styles.notifIconCol}>
                      <View
                        style={[
                          styles.notifIconCircle,
                          notif.type === 'approaching_pickup' || notif.type === 'approaching_drop'
                            ? styles.notifIconCircleAmber
                            : notif.type === 'picked_up' || notif.type === 'reached_school'
                            ? styles.notifIconCircleGreen
                            : notif.type === 'delay' || notif.type === 'cancelled'
                            ? styles.notifIconCircleRed
                            : styles.notifIconCircleBlue,
                        ]}
                      >
                        {notif.type === 'picked_up' || notif.type === 'reached_school' ? (
                          <CheckCircle2 size={16} color="#16A36A" />
                        ) : notif.type === 'delay' || notif.type === 'cancelled' ? (
                          <AlertTriangle size={16} color="#E03131" />
                        ) : (
                          <BusIcon size={16} color="#3B5BDB" />
                        )}
                      </View>
                    </View>

                    <View style={styles.notifContentCol}>
                      <View style={styles.notifTitleRow}>
                        <Text style={styles.notifTitle}>{notif.title}</Text>
                        <View style={styles.notifTimeTag}>
                          <Text style={styles.notifTime}>{notif.date} &bull; {notif.timestamp}</Text>
                        </View>
                      </View>
                      <Text style={styles.notifBody}>{notif.message}</Text>
                      <View style={styles.notifFooterRow}>
                        <Text style={styles.notifBusTag}>{notif.busNumber}</Text>
                        <Text style={[styles.readBadge, notif.read ? styles.readText : styles.unreadText]}>
                          {notif.read ? 'Read' : '● New'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </>
      )}

      {/* Bottom spacer */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#172554',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#172554',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 14,
  },
  schoolTagRow: {
    marginBottom: 10,
  },
  schoolPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  schoolPillText: {
    color: '#FDE047',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  childrenSwitcherCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  childrenSwitcherLabel: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  childrenSwitcherRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  childPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  childPillButtonActive: {
    backgroundColor: '#FDE047',
    borderColor: '#FDE047',
  },
  childPillButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  childPillButtonTextActive: {
    color: '#172554',
    fontWeight: 'bold',
  },
  emptyCardInner: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  emptyIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitleLight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptyTextLight: {
    fontSize: 13,
    color: '#FDE047',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  emptyHelpBoxLight: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 12,
  },
  emptyHelpTextLight: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 16,
  },
  heroMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  busAvatarBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  busAvatarText: {
    fontSize: 32,
  },
  heroDetails: {
    flex: 1,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  busNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  statusBadgeGreen: {
    backgroundColor: 'rgba(22, 163, 106, 0.25)',
  },
  statusBadgeBlue: {
    backgroundColor: 'rgba(59, 91, 219, 0.3)',
  },
  statusBadgeGray: {
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotGreen: {
    backgroundColor: '#4ADE80',
  },
  statusDotBlue: {
    backgroundColor: '#60A5FA',
  },
  statusDotGray: {
    backgroundColor: '#94A3B8',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextGreen: {
    color: '#4ADE80',
  },
  statusTextBlue: {
    color: '#93C5FD',
  },
  statusTextGray: {
    color: '#CBD5E1',
  },
  regNoText: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  modelText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  heroFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    paddingTop: 12,
    gap: 12,
  },
  heroFooterCol: {
    flex: 1,
  },
  heroFooterColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  heroFooterLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 2,
  },
  heroFooterValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroFooterSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  heroFooterValueHighlight: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FDE047',
  },
  heroFooterSubRight: {
    fontSize: 10,
    color: '#FDE047',
    marginTop: 1,
  },
  tabsScrollView: {
    marginBottom: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButtonActive: {
    backgroundColor: '#3B5BDB',
    borderColor: '#3B5BDB',
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  sectionBlock: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#172033',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#172033',
    textAlign: 'right',
    flex: 1,
  },
  infoValueBold: {
    fontSize: 11,
    fontWeight: '700',
    color: '#172554',
    textAlign: 'right',
    flex: 1,
  },
  infoValueHighlight: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B5BDB',
    textAlign: 'right',
  },
  infoValueMono: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#172033',
    textAlign: 'right',
  },
  statusGreenText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A36A',
  },
  statusBlueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B5BDB',
  },
  timingGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  timingCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timingLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  timingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172033',
    marginVertical: 2,
  },
  timingStop: {
    fontSize: 10,
    color: '#64748B',
  },
  campusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  campusCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 8,
  },
  campusTransitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  campusTransitCol: {
    flex: 1,
    alignItems: 'center',
  },
  campusTransitLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  campusTransitValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#172554',
    marginTop: 2,
  },
  campusDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  legendStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#64748B',
  },
  stopsTimelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  trackCol: {
    width: 28,
    alignItems: 'center',
  },
  trackDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackDotPassed: {
    backgroundColor: '#16A36A',
  },
  trackDotCurrent: {
    backgroundColor: '#3B5BDB',
    borderWidth: 2,
    borderColor: '#DBE4FF',
  },
  trackDotUpcoming: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  trackDotChild: {
    backgroundColor: '#3B5BDB',
    borderWidth: 2,
    borderColor: '#FDE047',
  },
  trackDotNum: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
  },
  trackLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  trackLinePassed: {
    backgroundColor: '#16A36A',
  },
  trackLineUpcoming: {
    backgroundColor: '#CBD5E1',
  },
  stopInfoBox: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  childStopHighlightBox: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B5BDB',
    borderWidth: 1.5,
  },
  stopNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stopNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
    flex: 1,
  },
  childStopNameText: {
    color: '#1E3A8A',
  },
  yourChildPill: {
    backgroundColor: '#3B5BDB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  yourChildPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  stopTimesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeTagText: {
    fontSize: 10,
    color: '#475569',
  },
  stopStatusRow: {
    marginTop: 2,
  },
  stopStatusBadge: {
    fontSize: 10,
    fontWeight: '700',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stopStatusCurrent: {
    backgroundColor: '#DBE4FF',
    color: '#1E40AF',
  },
  stopStatusPassed: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  stopStatusUpcoming: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  crewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  crewHeaderRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  crewAvatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crewDetails: {
    flex: 1,
  },
  crewRoleTag: {
    backgroundColor: '#DBE4FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  crewRoleTagText: {
    color: '#1E40AF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  crewName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#172033',
  },
  crewExp: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  licenceText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#475569',
    marginTop: 2,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16A36A',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#16A36A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  gpsUnavailableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gpsUnavailableIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gpsUnavailableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 4,
  },
  gpsUnavailableText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B45309',
    textAlign: 'center',
    marginBottom: 8,
  },
  gpsUnavailableSubtext: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 16,
  },
  togglePreviewButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  togglePreviewText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#172554',
  },
  mapContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 8,
  },
  mapHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  mapHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#172033',
  },
  zoomButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  zoomBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCanvas: {
    height: 350,
    backgroundColor: '#E9EEF4',
    position: 'relative',
    overflow: 'hidden',
  },
  mapRoadLine: {
    position: 'absolute',
    top: 50,
    left: 45,
    width: 260,
    height: 240,
    borderWidth: 8,
    borderColor: '#94A3B8',
    borderRadius: 80,
    borderTopColor: 'transparent',
    borderRightColor: '#94A3B8',
    borderBottomColor: '#94A3B8',
    borderLeftColor: '#94A3B8',
  },
  mapNode: {
    position: 'absolute',
    alignItems: 'center',
  },
  mapNodeCircleGray: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapNodeCircleGreen: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#16A36A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapNodeCircleOrange: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapNodeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#172033',
  },
  mapNodeTextWhite: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mapNodeLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#334155',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: 2,
  },
  busMarkerOuter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(59, 91, 219, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  busMarkerInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#172554',
    borderWidth: 2,
    borderColor: '#FDE047',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBusPill: {
    backgroundColor: '#172554',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  activeBusPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  schoolDestinationBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#172554',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  schoolDestinationLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#172554',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  mapFooterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  mapFooterText: {
    fontSize: 10,
    color: '#64748B',
  },
  notificationsList: {
    gap: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  notificationCardHigh: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
  },
  notifIconCol: {
    justifyContent: 'flex-start',
  },
  notifIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIconCircleAmber: {
    backgroundColor: '#FEF3C7',
  },
  notifIconCircleGreen: {
    backgroundColor: '#DCFCE7',
  },
  notifIconCircleBlue: {
    backgroundColor: '#DBE4FF',
  },
  notifIconCircleRed: {
    backgroundColor: '#FEE2E2',
  },
  notifContentCol: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#172033',
    flex: 1,
  },
  notifTimeTag: {
    marginLeft: 8,
  },
  notifTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  notifBody: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 6,
  },
  notifFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifBusTag: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3B5BDB',
    fontFamily: 'monospace',
  },
  readBadge: {
    fontSize: 9,
    fontWeight: '600',
  },
  readText: {
    color: '#94A3B8',
  },
  unreadText: {
    color: '#E03131',
    fontWeight: '700',
  },
});
