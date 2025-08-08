import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, CARD_STYLES } from '../utils/theme';
import { 
  isHabitCompletedOnDate, 
  shouldCompleteOnDate, 
  getHeatmapData, 
  formatFrequency,
  calculateStreak,
  calculateCompletionRate,
  isPastDate,
  isFutureDate,
  getMotivationalMessage
} from '../utils/habitUtils';
import HabitCalendarView from '../components/HabitCalendarView';

const { width } = Dimensions.get('window');

const HabitDetailScreen = ({ route, navigation }) => {
  const { habitId } = route.params;
  const { habits, markHabitCompleted, markHabitUncompleted, deleteHabit } = useContext(AppContext);
  const [habit, setHabit] = useState(null);
  const [completionRate, setCompletionRate] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [recentDates, setRecentDates] = useState([]);

  useEffect(() => {
    const foundHabit = habits.find(h => h.id === habitId);
    if (foundHabit) {
      setHabit(foundHabit);
      
      // Calculate stats
      setCompletionRate(calculateCompletionRate(foundHabit));
      const streakInfo = calculateStreak(foundHabit);
      setCurrentStreak(streakInfo.currentStreak);
      setLongestStreak(streakInfo.longestStreak);
      
      // Get recent dates (last 14 days)
      const today = new Date();
      const dates = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
      setRecentDates(dates);
    }
  }, [habitId, habits]);

  const handleToggleCompletion = (date) => {
    if (!habit) return;
    
    // Check if it's a past or future date
    if (isPastDate(date) || isFutureDate(date)) {
      const message = getMotivationalMessage(date);
      Alert.alert(
        message.title,
        message.message,
        [{ text: 'Got it', style: 'default' }],
        { cancelable: true }
      );
      return;
    }
    
    const isCompleted = isHabitCompletedOnDate(habit, date);
    if (isCompleted) {
      markHabitUncompleted(habit.id, date);
    } else {
      markHabitCompleted(habit.id, date);
    }
  };

  const handleDeleteHabit = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteHabit(habit.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleEditHabit = () => {
    navigation.navigate('AddHabit', { habitToEdit: habit });
  };

  if (!habit) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Habit Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Habit not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Habit Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Habit Header */}
        <View style={styles.habitHeader}>
          <View style={[styles.habitIconContainer, { backgroundColor: COLORS[habit.category] || COLORS.primary }]}>
            <Icon name={habit.icon || 'star'} size={36} color="#FFF" />
          </View>
          <Text style={styles.habitName}>{habit.name}</Text>
          <Text style={styles.habitDescription}>{habit.description || 'No description'}</Text>
          <Text style={styles.habitFrequency}>{formatFrequency(habit)}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{`${Math.round(completionRate * 100)}%`}</Text>
            <Text style={styles.statLabel}>Completion Rate</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.recentDaysContainer}>
            {recentDates.map(date => {
              const isCompleted = isHabitCompletedOnDate(habit, date);
              const shouldComplete = shouldCompleteOnDate(habit, date);
              const isToday = date === new Date().toISOString().split('T')[0];
              const dateObj = new Date(date);
              
              return (
                <TouchableOpacity 
                  key={date}
                  style={[styles.dayItem, isToday && styles.todayItem]}
                  onPress={() => handleToggleCompletion(date)}
                  disabled={!shouldComplete}
                >
                  <Text style={[styles.dayDate, !shouldComplete && styles.disabledText]}>
                    {dateObj.getDate()}
                  </Text>
                  <Text style={[styles.dayName, !shouldComplete && styles.disabledText]}>
                    {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  <View style={[styles.dayStatus, {
                    backgroundColor: isCompleted 
                      ? 'rgba(76, 175, 80, 0.2)' 
                      : shouldComplete 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'transparent'
                  }]}>
                    {isCompleted ? (
                      <Icon name="check-circle" size={24} color={COLORS.success} />
                    ) : shouldComplete ? (
                      <Icon name="radio-button-unchecked" size={24} color={COLORS.textMuted} />
                    ) : (
                      <Icon name="remove-circle-outline" size={24} color={COLORS.textMuted} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Monthly Calendar View */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly View</Text>
          <HabitCalendarView 
            habit={habit} 
            onDatePress={handleToggleCompletion} 
          />
        </View>

        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteHabit}>
          <Icon name="delete" size={20} color={COLORS.error} />
          <Text style={styles.deleteButtonText}>Delete Habit</Text>
        </TouchableOpacity>

        {/* Extra space at bottom */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Background gradient elements */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  markEditButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: 12,
  },
  markEditButtonText: {
    ...FONTS.medium,
    color: COLORS.background,
    fontSize: SIZES.medium,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SIZES.spacingXLarge,
    paddingBottom: SIZES.spacingMedium,
    paddingHorizontal: SIZES.spacingLarge,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: SIZES.spacingLarge,
    paddingTop: SIZES.spacingLarge,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
  },
  habitHeader: {
    alignItems: 'center',
    marginBottom: SIZES.spacingXLarge,
  },
  habitIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacingMedium,
  },
  habitName: {
    ...FONTS.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacingSmall,
    textAlign: 'center',
  },
  habitDescription: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacingMedium,
    textAlign: 'center',
  },
  habitFrequency: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SIZES.spacingMedium,
    paddingVertical: SIZES.spacingSmall,
    borderRadius: SIZES.borderRadiusLarge,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacingXLarge,
  },
  statCard: {
    ...CARD_STYLES.container,
    width: '30%',
    alignItems: 'center',
    paddingVertical: SIZES.spacingMedium,
  },
  statValue: {
    ...FONTS.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginBottom: SIZES.spacingSmall,
  },
  statLabel: {
    ...FONTS.medium,
    fontSize: SIZES.xSmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: SIZES.spacingXLarge,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacingMedium,
  },
  recentDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayItem: {
    width: '13%',
    aspectRatio: 0.8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacingMedium,
    padding: SIZES.spacingSmall,
  },
  todayItem: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  dayDate: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  dayName: {
    ...FONTS.regular,
    fontSize: SIZES.xSmall,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacingSmall,
  },
  dayStatus: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledText: {
    color: COLORS.textMuted,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    paddingVertical: SIZES.spacingMedium,
    borderRadius: SIZES.borderRadius,
    marginTop: SIZES.spacingLarge,
  },
  deleteButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.error,
    marginLeft: SIZES.spacingSmall,
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

export default HabitDetailScreen;