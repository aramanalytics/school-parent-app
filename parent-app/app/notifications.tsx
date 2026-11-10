import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { getAppNotifications, AppNotification } from '../src/services/parentData';
import { Bell, Check, CalendarCheck, Megaphone, CreditCard, NotebookPen } from 'lucide-react-native';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>(getAppNotifications());

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'fee':
        return <CreditCard size={18} color="#D97706" />;
      case 'notice':
        return <Megaphone size={18} color="#3B5BDB" />;
      case 'homework':
        return <NotebookPen size={18} color="#7E22CE" />;
      default:
        return <CalendarCheck size={18} color="#16A36A" />;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Alerts & Activity Feed</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markReadText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {notifications.map((n) => (
          <View
            key={n.id}
            style={[
              styles.card,
              !n.is_read && styles.unreadCard,
            ]}
          >
            <View style={styles.iconCircle}>{getIcon(n.type)}</View>

            <View style={styles.info}>
              <View style={styles.topRow}>
                <Text style={styles.title}>{n.title}</Text>
                {!n.is_read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.message}>{n.message}</Text>
              <Text style={styles.date}>{n.date}</Text>
            </View>
          </View>
        ))}
      </View>
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
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
  },
  markReadText: {
    fontSize: 12,
    color: '#3B5BDB',
    fontWeight: '600',
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  unreadCard: {
    borderColor: '#3B5BDB',
    backgroundColor: '#F8FAFF',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E03131',
  },
  message: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginTop: 2,
  },
  date: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 6,
  },
});

