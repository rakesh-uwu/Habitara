import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS, SIZES, CARD_STYLES } from '../utils/theme';

const HabitCalendarView = ({ habit, onDatePress }) => {
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate calendar days for the current month
  useEffect(() => {
    generateCalendarDays(currentMonth);
  }, [currentMonth, habit]);
  
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Generate array of days
    const days = [];
    
    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: '', empty: true });
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dateString = dayDate.toISOString().split('T')[0];
      
      // Check if habit was completed on this date
      const isCompleted = habit.completedDates && habit.completedDates.includes(dateString);
      
      // Check if this is today
      const today = new Date();
      const isToday = today.getDate() === i && 
                     today.getMonth() === month && 
                     today.getFullYear() === year;
      
      days.push({
        day: i,
        date: dateString,
        completed: isCompleted,
        today: isToday,
        empty: false,
      });
    }
    
    setCalendarDays(days);
  };
  
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text style={styles.navButton}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {getMonthName(currentMonth)} {currentMonth.getFullYear()}
        </Text>
        
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.navButton}>→</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekdaysContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <Text key={index} style={styles.weekdayLabel}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.daysContainer}>
        {calendarDays.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayItem, 
              item.empty ? styles.emptyDay : null,
              item.today ? styles.todayItem : null,
              item.completed ? styles.completedDay : null
            ]}
            onPress={() => item.empty ? null : onDatePress(item.date)}
            disabled={item.empty}
          >
            <Text style={[
              styles.dayText,
              item.today ? styles.todayText : null,
              item.completed ? styles.completedText : null
            ]}>
              {item.day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.completedLegend]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.todayLegend]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CARD_STYLES.card,
    padding: SIZES.spacingMedium,
    marginVertical: SIZES.spacingMedium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacingMedium,
  },
  monthTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  navButton: {
    ...FONTS.h3,
    color: COLORS.primary,
    paddingHorizontal: SIZES.spacingMedium,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZES.spacingSmall,
  },
  weekdayLabel: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    width: 30,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayItem: {
    width: '14.28%', // 7 days per row
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dayText: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  todayItem: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderRadius: 20,
  },
  todayText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  completedDay: {
    backgroundColor: 'rgba(0, 191, 255, 0.2)',
    borderRadius: 20,
  },
  completedText: {
    color: COLORS.success,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.spacingMedium,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.spacingMedium,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SIZES.spacingSmall,
  },
  completedLegend: {
    backgroundColor: 'rgba(0, 191, 255, 0.2)',
  },
  todayLegend: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
  },
  legendText: {
    ...FONTS.caption,
    color: COLORS.textMuted,
  },
});

export default HabitCalendarView;