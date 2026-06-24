import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp, ScreenType } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { SCREENS } from '../stack/stack';
import { OrderOfferModal } from '../components/order/OrderOfferModal';
import { Icon, IconName } from '../components/Icon';

interface TabItemProps {
  screenName: ScreenType;
  icon: IconName;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ icon, label, isActive, onPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.88,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1.06,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={styles.tabItem}
    >
      <Animated.View style={[
        styles.iconContainer, 
        isActive && styles.iconContainerActive,
        { transform: [{ scale: scaleValue }] }
      ]}>
        <Icon
          name={icon}
          color={isActive ? colors.primary : colors.textMuted}
          size={18}
        />
      </Animated.View>
      <Text style={[
        styles.tabLabel, 
        { color: isActive ? colors.primary : colors.textMuted },
        isActive && styles.tabLabelActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const AppNavigator: React.FC = () => {
  const { currentScreen, setScreen, activeOrder, isAuthenticated, isVerifyingOtp } = useApp();
  const insets = useSafeAreaInsets();

  if (!isAuthenticated) {
    if (isVerifyingOtp) {
      return <SCREENS.Otp />;
    }
    return <SCREENS.Login />;
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <SCREENS.Dashboard />;
      case 'earnings':
        return <SCREENS.Earnings />;
      case 'history':
        return <SCREENS.History />;
      case 'profile':
        return <SCREENS.Profile />;
      default:
        return <SCREENS.Dashboard />;
    }
  };

  const isNavigatingOrder = activeOrder !== null;

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
          <TabItem
            screenName="dashboard"
            icon="dashboard"
            label="Radar"
            isActive={currentScreen === 'dashboard'}
            onPress={() => setScreen('dashboard')}
          />
          <TabItem
            screenName="earnings"
            icon="wallet"
            label="Earnings"
            isActive={currentScreen === 'earnings'}
            onPress={() => setScreen('earnings')}
          />
          <TabItem
            screenName="history"
            icon="history"
            label="History"
            isActive={currentScreen === 'history'}
            onPress={() => setScreen('history')}
          />
          <TabItem
            screenName="profile"
            icon="user"
            label="Profile"
            isActive={currentScreen === 'profile'}
            onPress={() => setScreen('profile')}
          />
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
    height: 68,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  iconContainer: {
    width: 56,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255, 94, 58, 0.08)',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
  },
  tabLabelActive: {
    fontWeight: typography.fontWeight.bold,
  },
});
