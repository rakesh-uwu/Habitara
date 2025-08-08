import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, CARD_STYLES } from '../utils/theme';
import { shouldCompleteToday, getTodayDate, isHabitCompletedOnDate, calculateCompletionRate, isPastDate, isFutureDate, getMotivationalMessage } from '../utils/habitUtils';
import MotivationalContent from '../components/MotivationalContent';
import StreakHighlights from '../components/StreakHighlights';
import UserNotes from '../components/UserNotes';
import MoodTracker from '../components/MoodTracker';
import HabitCard from '../components/HabitCard';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user, habits, markHabitCompleted, unmarkHabitCompleted, deleteHabit, updateLastOpenedDate } = useContext(AppContext);
  const [todayHabits, setTodayHabits] = useState([]);
  const [otherHabits, setOtherHabits] = useState([]);
  const scrollY = useSharedValue(0);
  const today = getTodayDate();

  // Filter habits for today and others
  useEffect(() => {
    if (habits && Array.isArray(habits) && habits.length > 0) {
      // Filter out any invalid habits
      const validHabits = habits.filter(habit => habit && habit.id);
      
      const forToday = validHabits.filter(habit => shouldCompleteToday(habit));
      const others = validHabits.filter(habit => !shouldCompleteToday(habit));
      
      setTodayHabits(forToday);
      setOtherHabits(others);
    } else {
      setTodayHabits([]);
      setOtherHabits([]);
    }
    
    // Update last opened date
    if (updateLastOpenedDate) {
      updateLastOpenedDate(new Date().toISOString());
    }
  }, [habits, updateLastOpenedDate]);

  // Animation for header using Reanimated
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  
  // Create animated styles using Reanimated 2 API
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [200, 120],
      Extrapolate.CLAMP
    );
    
    return {
      height,
    };
  });
  
  const headerContentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 60, 90],
      [1, 0.3, 0],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });
  
  const headerTitleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 60, 90],
      [0, 0.7, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  const handleToggleHabit = (habit, date = today) => {
    // Check if habit is valid
    if (!habit || !habit.id) {
      console.error('Invalid habit object in handleToggleHabit:', habit);
      return;
    }
    
    // Check if it's a past or future date
    if (date !== today) {
      const message = getMotivationalMessage(date);
      Alert.alert(
        message.title,
        message.message,
        [{ text: 'Got it', style: 'default' }],
        { cancelable: true }
      );
      return;
    }
    
    // Only allow marking habits as complete for today
    const isCompleted = isHabitCompletedOnDate(habit, today);
    if (isCompleted) {
      unmarkHabitCompleted(habit.id, today);
    } else {
      markHabitCompleted(habit.id, today);
    }
  };

  const renderHabitItem = (habit) => {
    if (!habit || !habit.id) {
      console.error('Invalid habit object in renderHabitItem:', habit);
      return null;
    }
    
    return (
      <Animated.View key={habit.id}>
        <HabitCard
          habit={habit}
          date={today}
          onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
          onToggleCompletion={() => handleToggleHabit(habit)}
          onDelete={deleteHabit}
          showStreak={true}
          showDescription={true}
          style={styles.habitCardStyle}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Animated.View style={[styles.headerBackground, headerContentAnimatedStyle]} />
        
        <Animated.View style={[styles.headerContent, headerContentAnimatedStyle]}>
          <Text style={styles.greeting}>Hello, {user?.name || 'Friend'}!</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </Animated.View>
        
        <Animated.View style={[styles.headerTitle, headerTitleAnimatedStyle]}>
          <Text style={styles.headerTitleText}>Habitara</Text>
        </Animated.View>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Motivational Content */}
        <MotivationalContent />
        
        {/* Streak Highlights */}
        <StreakHighlights navigation={navigation} />
        
        {/* User Notes */}
      <UserNotes />
      
      {/* Mood Tracker */}
      <MoodTracker />
        
        {/* Today's Habits */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Habits</Text>
            <View style={styles.todayProgress}>
              <Text style={styles.progressText}>
                {todayHabits.filter(h => isHabitCompletedOnDate(h, today)).length}/{todayHabits.length}
              </Text>
            </View>
          </View>
          
          {todayHabits.length > 0 ? (
            todayHabits.map(habit => renderHabitItem(habit))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="event-note" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyStateText}>No habits scheduled for today</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('AddHabit')}
              >
                <Text style={styles.addButtonText}>Add a habit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Other Habits */}
        {otherHabits.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Other Habits</Text>
            </View>
            
            {otherHabits.map(habit => renderHabitItem(habit))}
          </View>
        )}

        {/* Quick Add Button (only show if there are some habits) */}
        {habits.length > 0 && (
          <TouchableOpacity 
            style={styles.quickAddButton}
            onPress={() => navigation.navigate('AddHabit')}
          >
            <Icon name="add" size={24} color={COLORS.background} />
            <Text style={styles.quickAddButtonText}>Add New Habit</Text>
          </TouchableOpacity>
        )}

        {/* Empty state for no habits at all */}
        {habits.length === 0 && (
          <View style={styles.fullEmptyState}>
            <Icon name="lightbulb" size={60} color={COLORS.primary} />
            <Text style={styles.fullEmptyStateTitle}>Start Your Journey</Text>
            <Text style={styles.fullEmptyStateText}>
              Create your first habit to begin building a better you.
            </Text>
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={() => navigation.navigate('AddHabit')}
            >
              <Text style={styles.getStartedButtonText}>Create First Habit</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Debug section removed for production */}

        {/* Extra space at bottom for tab bar */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Background gradient elements */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  habitCardStyle: {
    marginBottom: SIZES.spacingMedium,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.spacingLarge,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
  },
  headerContent: {
    marginBottom: SIZES.spacingLarge,
  },
  greeting: {
    ...FONTS.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.textPrimary,
  },
  date: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginTop: SIZES.spacingSmall,
  },
  headerTitle: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitleText: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
    marginTop: 120, // Initial header height minus some padding
  },
  scrollViewContent: {
    paddingHorizontal: SIZES.spacingLarge,
    paddingTop: SIZES.spacingLarge,
  },
  section: {
    marginBottom: SIZES.spacingXLarge,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacingMedium,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
  },
  todayProgress: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.borderRadiusLarge,
    paddingHorizontal: SIZES.spacingMedium,
    paddingVertical: SIZES.spacingSmall,
  },
  progressText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  habitCard: {
    ...CARD_STYLES.container,
    marginBottom: SIZES.spacingMedium,
    overflow: 'hidden',
  },
  completedHabitCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  habitCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacingMedium,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  habitSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacingSmall,
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    ...FONTS.medium,
    fontSize: SIZES.xSmall,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  checkButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedButton: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  emptyCheck: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  emptyState: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius,
    padding: SIZES.spacingLarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginTop: SIZES.spacingMedium,
    marginBottom: SIZES.spacingLarge,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.borderRadiusLarge,
    paddingVertical: SIZES.spacingMedium,
    paddingHorizontal: SIZES.spacingLarge,
  },
  addButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
  },
  quickAddButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusLarge,
    paddingVertical: SIZES.spacingMedium,
    paddingHorizontal: SIZES.spacingLarge,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.spacingMedium,
    marginBottom: SIZES.spacingXLarge,
    alignSelf: 'center',
  },
  quickAddButtonText: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.background,
    marginLeft: SIZES.spacingSmall,
  },
  fullEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacingXLarge,
    marginTop: SIZES.spacingXXLarge,
  },
  fullEmptyStateTitle: {
    ...FONTS.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacingLarge,
    marginBottom: SIZES.spacingMedium,
    textAlign: 'center',
  },
  fullEmptyStateText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacingXLarge,
    textAlign: 'center',
    lineHeight: 22,
  },
  getStartedButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusLarge,
    paddingVertical: SIZES.spacingMedium,
    paddingHorizontal: SIZES.spacingLarge,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedButtonText: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.background,
    marginRight: SIZES.spacingSmall,
  },
  backgroundCircle1: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(138, 43, 226, 0.05)',
    top: -width,
    right: -width * 0.5,
    zIndex: -1,
  },
  backgroundCircle2: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width * 0.5,
    backgroundColor: 'rgba(0, 191, 255, 0.05)',
    bottom: -width * 0.3,
    left: -width * 0.3,
    zIndex: -1,
  },
});

export default HomeScreen;