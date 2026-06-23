import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp, ScreenType } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { DashboardScreen } from '../screens/DashboardScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { OrderOfferModal } from '../components/order/OrderOfferModal';
import { Icon, IconName } from '../components/Icon';

export const AppNavigator: React.FC = () => {
  const { currentScreen, setScreen, activeOrder, incomingOffer } = useApp();
  const insets = useSafeAreaInsets();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'earnings':
        return <EarningsScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  // Check if we should hide headers/tabs (e.g. during active order navigation workflow)
  const isNavigatingOrder = activeOrder !== null;

  // Helper to render Tab Bar items
  const renderTabItem = (screenName: ScreenType, icon: IconName, label: string) => {
    const isActive = currentScreen === screenName;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setScreen(screenName)}
        style={styles.tabItem}
      >
        <Icon
          name={icon}
          color={isActive ? colors.primary : colors.textMuted}
          size={20}
          style={styles.tabIcon}
        />
        <Text style={[styles.tabLabel, { color: isActive ? colors.text : colors.textMuted }]}>
          {label}
        </Text>
        {isActive && <View style={styles.activeDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.appWrapper, { paddingBottom: insets.bottom }]}>
      {/* Global incoming order modal popup */}
      <OrderOfferModal />

      {/* Main Top Header: Hidden only during active deliveries */}
      {!isNavigatingOrder && <Header />}

      {/* Screen container */}
      <View style={styles.screenContainer}>
        {renderActiveScreen()}
      </View>

      {/* Custom Bottom Tab Bar: Hidden only during active deliveries */}
      {!isNavigatingOrder && (
        <View style={styles.tabBar}>
          {renderTabItem('dashboard', 'dashboard', 'Radar')}
          {renderTabItem('earnings', 'wallet', 'Earnings')}
          {renderTabItem('history', 'history', 'History')}
          {renderTabItem('profile', 'user', 'Profile')}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
});
