import React from 'react';
import { Tabs } from 'expo-router';
import { Home, CalendarCheck, NotebookPen, CreditCard, Menu } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function TabsLayout() {
  const { t } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#172554',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 16,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#3B5BDB',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.home,
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: t.tabs.attendance,
          headerTitle: t.attendance.title,
          tabBarIcon: ({ color, size }) => <CalendarCheck color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: t.tabs.diary,
          headerTitle: t.diary.title,
          tabBarIcon: ({ color, size }) => <NotebookPen color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="fees"
        options={{
          title: t.tabs.fees,
          headerTitle: t.fees.title,
          tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t.tabs.more,
          headerTitle: t.more.title,
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size - 2} />,
        }}
      />
    </Tabs>
  );
}

