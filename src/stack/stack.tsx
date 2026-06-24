import React from 'react';

// Import all application screens for registration
import { LoginScreen } from '../screens/LoginScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

// 1. Centralized Stack Registry
export const SCREENS = {
  Login: LoginScreen,
  Otp: OtpScreen,
  Dashboard: DashboardScreen,
  Earnings: EarningsScreen,
  History: HistoryScreen,
  Profile: ProfileScreen,
} as const;

export type ScreenRegistryType = typeof SCREENS;
export type ScreenName = keyof ScreenRegistryType;
