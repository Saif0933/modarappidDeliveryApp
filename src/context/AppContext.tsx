import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Alert } from 'react-native';

export type OrderStage = 'accepted' | 'arrived_at_store' | 'picked_up';

export interface Order {
  id: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: string[];
  totalAmount: string;
  distance: string; // e.g. "3.8 km"
  pickupDistance: string; // e.g. "1.2 km"
  earnings: number; // rider earnings e.g. 150
  tip: number;
  estTime: string; // e.g. "25 mins"
}

export interface EarningSummary {
  today: number;
  week: number;
  tripsToday: number;
  onlineHours: number;
}

export type ScreenType = 'dashboard' | 'earnings' | 'history' | 'profile';

interface AppContextType {
  isOnline: boolean;
  currentScreen: ScreenType;
  activeOrder: Order | null;
  activeOrderStage: OrderStage | null;
  incomingOffer: Order | null;
  offerTimeRemaining: number;
  earningsSummary: EarningSummary;
  orderHistory: Order[];
  toggleOnline: () => void;
  setScreen: (screen: ScreenType) => void;
  acceptOffer: () => void;
  declineOffer: () => void;
  advanceOrderStage: () => void;
  completeOrder: () => void;
  simulateOrder: () => void;
  cancelActiveOrder: () => void;
  
  // Auth additions
  isAuthenticated: boolean;
  phoneNumber: string;
  isVerifyingOtp: boolean;
  login: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  cancelOtp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Rich mock orders data
const MOCK_OFFERS: Order[] = [
  {
    id: 'DRV-9082',
    storeName: 'Zara Flagship Store',
    storeAddress: 'Mall of India, Sector 18, Noida',
    storePhone: '+91 98765 43210',
    customerName: 'Aishwarya Sen',
    customerAddress: 'Tower B - Flat 904, Cleo County, Sector 121, Noida',
    customerPhone: '+91 91234 56789',
    items: ['1x Premium Trench Coat (M)', '2x High-Rise Slim Jeans (28)'],
    totalAmount: '₹9,497',
    distance: '4.8 km',
    pickupDistance: '0.9 km',
    earnings: 140,
    tip: 50,
    estTime: '22 mins',
  },
  {
    id: 'DRV-4531',
    storeName: 'Levi\'s Denim Co',
    storeAddress: 'Connaught Place, Inner Circle, Block E, Delhi',
    storePhone: '+91 88264 12345',
    customerName: 'Vikram Malhotra',
    customerAddress: 'H.No. 42, Golf Links Road, New Delhi',
    customerPhone: '+91 99998 88877',
    items: ['2x 511 Slim Fit Jeans', '1x Classic Denim Jacket (L)'],
    totalAmount: '₹8,199',
    distance: '6.2 km',
    pickupDistance: '1.7 km',
    earnings: 185,
    tip: 30,
    estTime: '28 mins',
  },
  {
    id: 'DRV-3312',
    storeName: 'H&M Trendhouse',
    storeAddress: 'Ambience Mall, NH 8, Gurugram',
    storePhone: '+91 70425 67890',
    customerName: 'Priya Verma',
    customerAddress: 'Flat 1205, DLF Phase 5, Club Drive, Gurugram',
    customerPhone: '+91 95600 11223',
    items: ['3x Linen Resort Shirts (S)', '1x Canvas Shoulder Bag'],
    totalAmount: '₹5,499',
    distance: '3.1 km',
    pickupDistance: '0.6 km',
    earnings: 95,
    tip: 40,
    estTime: '15 mins',
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [activeOrderStage, setActiveOrderStage] = useState<OrderStage | null>(null);
  const [incomingOffer, setIncomingOffer] = useState<Order | null>(null);
  const [offerTimeRemaining, setOfferTimeRemaining] = useState<number>(30);
  
  const [earningsSummary, setEarningsSummary] = useState<EarningSummary>({
    today: 420,
    week: 2850,
    tripsToday: 3,
    onlineHours: 4.5,
  });

  const [orderHistory, setOrderHistory] = useState<Order[]>([
    {
      id: 'DRV-1102',
      storeName: 'Nike Exclusive',
      storeAddress: 'Select Citywalk, Saket',
      storePhone: '+91 98888 77777',
      customerName: 'Aditya Roy',
      customerAddress: 'C-21, GK-1, New Delhi',
      customerPhone: '+91 98765 00000',
      items: ['1x Air Max Sneakers (UK 9)', '1x Training Shorts (L)'],
      totalAmount: '₹11,495',
      distance: '5.4 km',
      pickupDistance: '1.1 km',
      earnings: 160,
      tip: 60,
      estTime: '24 mins',
    },
    {
      id: 'DRV-1094',
      storeName: 'Adidas Originals',
      storeAddress: 'Cyber Hub, Gurugram',
      storePhone: '+91 90000 11111',
      customerName: 'Tanya Singh',
      customerAddress: 'Building 10C, Flat 4A, DLF Phase 2, Gurugram',
      customerPhone: '+91 92222 33333',
      items: ['1x Superstar Shoes (UK 6)', '1x Originals Hoody (S)'],
      totalAmount: '₹9,299',
      distance: '2.8 km',
      pickupDistance: '0.4 km',
      earnings: 110,
      tip: 20,
      estTime: '12 mins',
    },
    {
      id: 'DRV-1088',
      storeName: 'Puma Performance Store',
      storeAddress: 'South Ext Part 1, Main Market',
      storePhone: '+91 85555 44444',
      customerName: 'Kabir Kapoor',
      customerAddress: 'J-121, South Ext Part 2, New Delhi',
      customerPhone: '+91 96666 55555',
      items: ['1x Nitro Running Shoes', '3x DriFit Sports Socks'],
      totalAmount: '₹7,899',
      distance: '1.9 km',
      pickupDistance: '0.7 km',
      earnings: 90,
      tip: 0,
      estTime: '9 mins',
    }
  ]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer logic for incoming order offer
  useEffect(() => {
    if (incomingOffer) {
      setOfferTimeRemaining(30);
      timerRef.current = setInterval(() => {
        setOfferTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIncomingOffer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [incomingOffer]);

  // Periodically simulate an order if online and doesn't have an active order/offer
  useEffect(() => {
    let orderSimulationTimeout: ReturnType<typeof setTimeout>;

    const startSimulationTimer = () => {
      // Simulate an order request after 12 seconds if online, idle, and no offer
      orderSimulationTimeout = setTimeout(() => {
        if (isOnline && !activeOrder && !incomingOffer) {
          simulateOrder();
        }
      }, 12000);
    };

    if (isOnline && !activeOrder && !incomingOffer) {
      startSimulationTimer();
    }

    return () => clearTimeout(orderSimulationTimeout);
  }, [isOnline, activeOrder, incomingOffer]);

  const toggleOnline = () => {
    setIsOnline((prev) => {
      const newStatus = !prev;
      if (!newStatus) {
        // Clear incoming offer if turning offline
        setIncomingOffer(null);
      }
      return newStatus;
    });
  };

  const simulateOrder = () => {
    if (!isOnline) {
      Alert.alert('Rider Offline', 'Go Online to receive delivery orders.');
      return;
    }
    if (activeOrder) return;
    
    // Pick a random mock order
    const randomOffer = MOCK_OFFERS[Math.floor(Math.random() * MOCK_OFFERS.length)];
    // Make ID unique for simulation
    const uniqueId = `DRV-${Math.floor(1000 + Math.random() * 9000)}`;
    setIncomingOffer({
      ...randomOffer,
      id: uniqueId,
    });
  };

  const acceptOffer = () => {
    if (incomingOffer) {
      setActiveOrder(incomingOffer);
      setActiveOrderStage('accepted');
      setIncomingOffer(null);
    }
  };

  const declineOffer = () => {
    setIncomingOffer(null);
  };

  const advanceOrderStage = () => {
    if (activeOrderStage === 'accepted') {
      setActiveOrderStage('arrived_at_store');
    } else if (activeOrderStage === 'arrived_at_store') {
      setActiveOrderStage('picked_up');
    }
  };

  const completeOrder = () => {
    if (activeOrder) {
      const orderPay = activeOrder.earnings + activeOrder.tip;
      // Update statistics
      setEarningsSummary((prev) => ({
        ...prev,
        today: prev.today + orderPay,
        week: prev.week + orderPay,
        tripsToday: prev.tripsToday + 1,
      }));

      // Add to history
      setOrderHistory((prev) => [activeOrder, ...prev]);

      // Reset active order state
      setActiveOrder(null);
      setActiveOrderStage(null);

      Alert.alert('Success', `Delivery complete! Earned ₹${orderPay}`);
    }
  };

  const setScreen = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const cancelActiveOrder = () => {
    setActiveOrder(null);
    setActiveOrderStage(null);
  };

  const login = async (phone: string) => {
    if (phone.trim().length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setPhoneNumber(phone);
    setIsVerifyingOtp(true);
  };

  const verifyOtp = async (otp: string) => {
    if (otp === '123456' || otp === '654321' || otp.length === 6) {
      setIsAuthenticated(true);
      setIsVerifyingOtp(false);
      return true;
    } else {
      Alert.alert('Incorrect OTP', 'The OTP entered is incorrect. (Use 123456 for testing)');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPhoneNumber('');
    setIsVerifyingOtp(false);
  };

  const cancelOtp = () => {
    setIsVerifyingOtp(false);
  };

  return (
    <AppContext.Provider
      value={{
        isOnline,
        currentScreen,
        activeOrder,
        activeOrderStage,
        incomingOffer,
        offerTimeRemaining,
        earningsSummary,
        orderHistory,
        toggleOnline,
        setScreen,
        acceptOffer,
        declineOffer,
        advanceOrderStage,
        completeOrder,
        simulateOrder,
        cancelActiveOrder,
        isAuthenticated,
        phoneNumber,
        isVerifyingOtp,
        login,
        verifyOtp,
        logout,
        cancelOtp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
