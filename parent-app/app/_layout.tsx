import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="#172554" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#172554',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#F5F7FB',
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/verify-otp" options={{ headerShown: false }} />
          <Stack.Screen name="student-profile" options={{ title: 'Student Profile' }} />
          <Stack.Screen name="notices" options={{ title: 'School Circulars' }} />
          <Stack.Screen name="timetable" options={{ title: 'Class Timetable' }} />
          <Stack.Screen name="exam-results" options={{ title: 'Examination Results' }} />
          <Stack.Screen name="learning-materials" options={{ title: 'Learning Materials' }} />
          <Stack.Screen name="online-tests" options={{ title: 'Online Tests' }} />
          <Stack.Screen name="school-calendar" options={{ title: 'School Calendar' }} />
          <Stack.Screen name="feedback" options={{ title: 'Parent Feedback' }} />
          <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

