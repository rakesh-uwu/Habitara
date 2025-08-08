import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, CARD_STYLES } from '../utils/theme';
import { isHabitCompletedOnDate, shouldCompleteOnDate, getHeatmapData } from '../utils/habitUtils';

const { width } = Dimensions.get('window');

const CalendarScreen = ({ navigation }) => {
  const { habits } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState({});
  const [habitsForSelectedDate, setHabitsForSelectedDate] = useState([]);
  const [heatmapData, setHeatmapData] = useState({});

  // Prepare calendar marked dates
  useEffect(() => {
    if (habits && habits.length > 0) {
      prepareMarkedDates();
      updateHabitsForSelectedDate();
      setHeatmapData(getHeatmapData(habits));
    }
  }, [habits, selectedDate]);

  const prepareMarkedDates = () => {
    const marked = {};
    
    // Mark today's date
    const today = new Date().toISOString().split('T')[0];
    marked[today] = {
      selected: today === selectedDate,
      selectedColor: COLORS.primary,
      marked: true,
      dotColor: COLORS.secondary,
    };
    
    // Mark selected date
    if (selectedDate !== today) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: COLORS.primary,
      };
    }
    
    // Mark dates with completed habits
    habits.forEach(habit => {
      if (habit.completedDates && habit.completedDates.length > 0) {
        habit.completedDates.forEach(date => {
          if (marked[date]) {
            // If date is already marked, just update the dots
            marked[date] = {
              ...marked[date],
              marked: true,
              dots: marked[date].dots ? [...marked[date].dots, { color: COLORS.success }] : [{ color: COLORS.success }],
            };
          } else {
            // Otherwise create a new marked date
            marked[date] = {
              marked: true,
              dots: [{ color: COLORS.success }],
              selected: date === selectedDate,
              selectedColor: date === selectedDate ? COLORS.primary : undefined,
            };
          }
        });
      }
    });
    
    setMarkedDates(marked);
  };

  const updateHabitsForSelectedDate = () => {
    if (!selectedDate) return;
    
    const habitsForDate = habits.filter(habit => 
      shouldCompleteOnDate(habit, selectedDate)
    );
    
    setHabitsForSelectedDate(habitsForDate);
  };

  const onDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const renderHabitItem = (habit) => {
    const isCompleted = isHabitCompletedOnDate(habit, selectedDate);
    
    return (
      <TouchableOpacity 
        key={habit.id}
        style={[styles.habitCard, isCompleted && styles.completedHabitCard]}
        onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
        activeOpacity={0.8}
      >
        <View style={[styles.habitIconContainer, { backgroundColor: COLORS[habit.category] || COLORS.primary }]}>
          <Icon name={habit.icon || 'star'} size={24} color="#FFF" />
        </View>
        
        <View style={styles.habitInfo}>
          <Text style={styles.habitTitle}>{habit.name}</Text>
          <Text style={styles.habitSubtitle}>{habit.description || 'No description'}</Text>
        </View>
        
        <View style={[styles.statusIndicator, isCompleted ? styles.completedIndicator : styles.pendingIndicator]}>
          <Text style={[styles.statusText, isCompleted ? styles.completedText : styles.pendingText]}>
            {isCompleted ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeatmap = () => {
    // Get the last 12 weeks (84 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 83); // 84 days including today
    
    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }
    
    // Group dates by week
    const weeks = [];
    let currentWeek = [];
    
    dates.forEach((date, index) => {
      currentWeek.push(date);
      if (currentWeek.length === 7 || index === dates.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return (
      <View style={styles.heatmapContainer}>
        <Text style={styles.sectionTitle}>Activity Heatmap</Text>
        <Text style={styles.heatmapSubtitle}>Last 12 weeks of habit activity</Text>
        
        <View style={styles.heatmap}>
          {weeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={styles.heatmapWeek}>
              {week.map(date => {
                const count = heatmapData[date] || 0;
                let bgColor = COLORS.heatmapEmpty;
                
                if (count > 0) {
                  if (count === 1) bgColor = COLORS.heatmapLevel1;
                  else if (count === 2) bgColor = COLORS.heatmapLevel2;
                  else if (count === 3) bgColor = COLORS.heatmapLevel3;
                  else bgColor = COLORS.heatmapLevel4;
                }
                
                return (
                  <TouchableOpacity 
                    key={date} 
                    style={[styles.heatmapDay, { backgroundColor: bgColor }]}
                    onPress={() => setSelectedDate(date)}
                  />
                );
              })}
            </View>
          ))}
        </View>
        
        <View style={styles.heatmapLegend}>
          <Text style={styles.legendText}>Less</Text>
          <View style={[styles.legendItem, { backgroundColor: COLORS.heatmapEmpty }]} />
          <View style={[styles.legendItem, { backgroundColor: COLORS.heatmapLevel1 }]} />
          <View style={[styles.legendItem, { backgroundColor: COLORS.heatmapLevel2 }]} />
          <View style={[styles.legendItem, { backgroundColor: COLORS.heatmapLevel3 }]} />
          <View style={[styles.legendItem, { backgroundColor: COLORS.heatmapLevel4 }]} />
          <Text style={styles.legendText}>More</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={onDateSelect}
            markedDates={markedDates}
            markingType={'multi-dot'}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'rgba(30, 30, 30, 0.8)',
              textSectionTitleColor: COLORS.textSecondary,
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: COLORS.background,
              todayTextColor: COLORS.primary,
              dayTextColor: COLORS.textPrimary,
              textDisabledColor: COLORS.textMuted,
              dotColor: COLORS.success,
              selectedDotColor: COLORS.background,
              arrowColor: COLORS.primary,
              monthTextColor: COLORS.textPrimary,
              textMonthFontFamily: 'System',
              textMonthFontWeight: 'bold',
              textDayFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
            }}
          />
        </View>
        
        {/* Selected Date Habits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Habits for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
          
          {habitsForSelectedDate.length > 0 ? (
            habitsForSelectedDate.map(habit => renderHabitItem(habit))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="event-busy" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyStateText}>No habits scheduled for this date</Text>
            </View>
          )}
        </View>
        
        {/* Heatmap */}
        {renderHeatmap()}
        
        {/* Extra space at bottom for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
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
  header: {
    paddingTop: SIZES.spacingXLarge,
    paddingBottom: SIZES.spacingMedium,
    paddingHorizontal: SIZES.spacingLarge,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
  calendarContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: SIZES.borderRadiusLarge,
    overflow: 'hidden',
    marginBottom: SIZES.spacingLarge,
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
  habitCard: {
    ...CARD_STYLES.container,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacingMedium,
  },
  completedHabitCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  habitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  statusIndicator: {
    paddingHorizontal: SIZES.spacingMedium,
    paddingVertical: SIZES.spacingSmall,
    borderRadius: SIZES.borderRadiusLarge,
  },
  completedIndicator: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  pendingIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusText: {
    ...FONTS.medium,
    fontSize: SIZES.xSmall,
  },
  completedText: {
    color: COLORS.success,
  },
  pendingText: {
    color: COLORS.textSecondary,
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
    textAlign: 'center',
  },
  heatmapContainer: {
    marginBottom: SIZES.spacingXLarge,
  },
  heatmapSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacingMedium,
  },
  heatmap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  heatmapWeek: {
    width: '8%',
  },
  heatmapDay: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 2,
    marginVertical: 2,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.spacingMedium,
  },
  legendItem: {
    width: 15,
    height: 15,
    borderRadius: 2,
    marginHorizontal: 3,
  },
  legendText: {
    ...FONTS.regular,
    fontSize: SIZES.xSmall,
    color: COLORS.textSecondary,
    marginHorizontal: SIZES.spacingSmall,
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

export default CalendarScreen;