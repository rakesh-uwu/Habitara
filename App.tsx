import React, { useContext, useEffect } from 'react';
import { StatusBar, LogBox, AppState, AppStateStatus } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AppContext } from './src/context/AppContext';
import { COLORS } from './src/utils/theme';
import ErrorBoundary from './src/components/ErrorBoundary';
import { initializeErrorTracking } from './src/utils/errorUtils';
import { initializeNotifications } from './src/utils/NotificationService';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import StatsScreen from './src/screens/StatsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HabitDetailScreen from './src/screens/HabitDetailScreen';

// Ignore specific LogBox warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'help-outline'; // Default icon if none of the conditions match

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar-today';
          } else if (route.name === 'Stats') {
            iconName = 'bar-chart';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          if (route.name === 'AddHabit') {
            return <FontAwesome name="paw" size={40} color={color} />;
          }
          
          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: 'rgba(18, 18, 18, 0.95)',
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          elevation: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen 
        name="AddHabit" 
        component={AddHabitScreen} 
        options={{
          tabBarLabel: '',
          tabBarIconStyle: {
            position: 'relative',
            top: 0,
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome 
              name="paw" 
              size={40} 
              color={COLORS.primary} 
              style={{
                shadowColor: COLORS.primary,
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,
                elevation: 10,
              }}
            />
          ),
        }}
      />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  const { isFirstLaunch, updateLastOpenedDate } = useContext(AppContext);

  // Initialize error tracking system
  useEffect(() => {
    initializeErrorTracking();
    
    // Initialize notifications
    initializeNotifications();
    
    // Track app state changes for notification purposes
    const appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App has come to the foreground
        updateLastOpenedDate(new Date().toISOString());
      }
    });
    
    return () => {
      appStateSubscription.remove();
    };
  }, [updateLastOpenedDate]);

  // Note: loadUserData and loadHabits are already called in AppContext's useEffect
  // We don't need to call them here as they're handled in the context

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          {isFirstLaunch ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : null}
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default App;
