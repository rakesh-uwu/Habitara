import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';

// Import context
import { AppContext } from '../context/AppContext';

// Import theme
import { COLORS, SIZES } from '../utils/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom tab bar button component for the center button
const CustomTabBarButton = ({ children, onPress }) => (
  <View style={styles.customTabBarButtonContainer}>
    <View style={styles.customTabBarButton}>
      <Icon 
        name="add" 
        size={30} 
        color={COLORS.background} 
        onPress={onPress} 
      />
    </View>
  </View>
);

// Main tab navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar-today';
          } else if (route.name === 'Stats') {
            iconName = 'bar-chart';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return (
            <View style={focused ? styles.activeTabIcon : {}}>
              <Icon name={iconName} size={size} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen 
        name="AddHabit" 
        component={AddHabitScreen} 
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton 
              {...props} 
              onPress={() => props.navigation.navigate('AddHabit')} 
            />
          ),
        }}
      />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main app navigator
const AppNavigator = () => {
  const { isFirstLaunch } = useContext(AppContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
        }}
      >
        {isFirstLaunch ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : null}
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="HabitDetail" 
          component={HabitDetailScreen} 
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: COLORS.textPrimary,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 15,
    height: 60,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  activeTabIcon: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderRadius: 8,
    padding: 8,
  },
  customTabBarButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTabBarButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
});

export default AppNavigator;