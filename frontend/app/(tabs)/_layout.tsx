import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Import Ionicons for the icons

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  // RN 0.85+ reports 'unspecified' when no theme is set; resolve to light.
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: colorScheme === 'dark' ? 'rgba(11, 14, 20, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            borderTopColor: Colors[colorScheme].cardBorder,
          },
          default: {
            backgroundColor: Colors[colorScheme].card,
            borderTopColor: Colors[colorScheme].cardBorder,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {/* Home / Shield Dashboard Tab */}
      <Tabs.Screen
        name="landing"
        options={{
          title: 'Shield',
          tabBarAccessibilityLabel: 'Shield Dashboard Tab',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="shield-checkmark" color={color} />,
        }}
      />

      {/* History / Fraud Logs Tab */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'Logs',
          tabBarAccessibilityLabel: 'Call Logs and Fraud Telemetry Tab',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="time-outline" color={color} />,
        }}
      />

      {/* Settings / Security Tab */}
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Security',
          tabBarAccessibilityLabel: 'Security Settings Tab',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="shield-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
