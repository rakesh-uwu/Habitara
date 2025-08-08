import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, CARD_STYLES } from '../utils/theme';
import { calculateCompletionRate, calculateStreak } from '../utils/habitUtils';

const { width } = Dimensions.get('window');

const StatsScreen = ({ navigation }) => {
  const { habits, userData } = useContext(AppContext);
  const [totalHabits, setTotalHabits] = useState(0);
  const [activeHabits, setActiveHabits] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [overallCompletionRate, setOverallCompletionRate] = useState(0);
  const [topHabits, setTopHabits] = useState([]);
  const [streakHabits, setStreakHabits] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    if (habits && habits.length > 0) {
      calculateStats();
    }
  }, [habits]);

  const calculateStats = () => {
    // Basic stats
    setTotalHabits(habits.length);
    
    const today = new Date().toISOString().split('T')[0];
    const active = habits.filter(habit => !habit.archived);
    setActiveHabits(active.length);
    
    const completed = habits.filter(habit => 
      habit.completedDates && habit.completedDates.includes(today)
    );
    setCompletedToday(completed.length);
    
    // Overall completion rate
    let totalRate = 0;
    habits.forEach(habit => {
      totalRate += calculateCompletionRate(habit);
    });
    setOverallCompletionRate(habits.length > 0 ? totalRate / habits.length : 0);
    
    // Top habits by completion rate
    const sortedByCompletion = [...habits].sort((a, b) => {
      return calculateCompletionRate(b) - calculateCompletionRate(a);
    });
    setTopHabits(sortedByCompletion.slice(0, 3));
    
    // Top habits by streak
    const withStreakInfo = habits.map(habit => {
      const streakInfo = calculateStreak(habit);
      return {
        ...habit,
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
      };
    });
    
    const sortedByStreak = [...withStreakInfo].sort((a, b) => {
      return b.currentStreak - a.currentStreak;
    });
    setStreakHabits(sortedByStreak.slice(0, 3));
    
    // Category stats
    const categories = {};
    habits.forEach(habit => {
      const category = habit.category || 'other';
      if (!categories[category]) {
        categories[category] = {
          name: category,
          count: 0,
          completionRate: 0,
          color: COLORS[category] || COLORS.primary,
        };
      }
      categories[category].count += 1;
      categories[category].completionRate += calculateCompletionRate(habit);
    });
    
    const categoryArray = Object.values(categories).map(cat => {
      return {
        ...cat,
        completionRate: cat.count > 0 ? cat.completionRate / cat.count : 0,
      };
    });
    
    setCategoryStats(categoryArray);
  };

  const renderProgressBar = (value, width = '100%') => {
    return (
      <View style={[styles.progressBarContainer, { width }]}>
        <View style={[styles.progressBar, { width: `${Math.round(value * 100)}%` }]} />
      </View>
    );
  };

  const renderHabitItem = (habit, index, showStreak = false) => {
    const completionRate = calculateCompletionRate(habit);
    const streakInfo = showStreak ? habit : calculateStreak(habit);
    
    return (
      <TouchableOpacity 
        key={habit.id}
        style={[styles.habitItem, { marginBottom: index < 2 ? SIZES.spacingMedium : 0 }]}
        onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
        activeOpacity={0.8}
      >
        <View style={[styles.habitIconContainer, { backgroundColor: COLORS[habit.category] || COLORS.primary }]}>
          <Icon name={habit.icon || 'star'} size={20} color="#FFF" />
        </View>
        
        <View style={styles.habitInfo}>
          <Text style={styles.habitName}>{habit.name}</Text>
          
          {showStreak ? (
            <View style={styles.streakContainer}>
              <Icon name="local-fire-department" size={16} color={COLORS.accent} />
              <Text style={styles.streakText}>{streakInfo.currentStreak} day streak</Text>
            </View>
          ) : (
            <View style={styles.rateContainer}>
              <Text style={styles.rateText}>{`${Math.round(completionRate * 100)}%`}</Text>
              {renderProgressBar(completionRate, '80%')}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = (category, index) => {
    return (
      <View key={category.name} style={[styles.categoryItem, { marginBottom: index < categoryStats.length - 1 ? SIZES.spacingMedium : 0 }]}>
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
          <Text style={styles.categoryName}>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</Text>
          <Text style={styles.categoryCount}>{category.count} habits</Text>
        </View>
        
        <View style={styles.categoryStats}>
          <Text style={styles.categoryRate}>{`${Math.round(category.completionRate * 100)}%`}</Text>
          {renderProgressBar(category.completionRate)}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Stats */}
        <View style={styles.userStatsContainer}>
          <Text style={styles.welcomeText}>Hello, {userData?.name || 'User'}!</Text>
          <Text style={styles.statsSubtitle}>Here's your habit progress</Text>
        </View>
        
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalHabits}</Text>
            <Text style={styles.summaryLabel}>Total Habits</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{completedToday}</Text>
            <Text style={styles.summaryLabel}>Completed Today</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{`${Math.round(overallCompletionRate * 100)}%`}</Text>
            <Text style={styles.summaryLabel}>Completion Rate</Text>
          </View>
        </View>
        
        {/* Top Habits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Habits</Text>
          <View style={styles.sectionContent}>
            {topHabits.length > 0 ? (
              topHabits.map((habit, index) => renderHabitItem(habit, index))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="trending-up" size={30} color={COLORS.textMuted} />
                <Text style={styles.emptyStateText}>Complete habits to see your top performers</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Streak Habits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Longest Streaks</Text>
          <View style={styles.sectionContent}>
            {streakHabits.length > 0 ? (
              streakHabits.map((habit, index) => renderHabitItem(habit, index, true))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="local-fire-department" size={30} color={COLORS.textMuted} />
                <Text style={styles.emptyStateText}>Build streaks by completing habits consistently</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Category Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.sectionContent}>
            {categoryStats.length > 0 ? (
              categoryStats.map((category, index) => renderCategoryItem(category, index))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="category" size={30} color={COLORS.textMuted} />
                <Text style={styles.emptyStateText}>Add habits with categories to see stats</Text>
              </View>
            )}
          </View>
        </View>
        
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
  userStatsContainer: {
    marginBottom: SIZES.spacingLarge,
  },
  welcomeText: {
    ...FONTS.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacingSmall,
  },
  statsSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacingXLarge,
  },
  summaryCard: {
    ...CARD_STYLES.container,
    width: '30%',
    alignItems: 'center',
    paddingVertical: SIZES.spacingMedium,
  },
  summaryValue: {
    ...FONTS.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginBottom: SIZES.spacingSmall,
  },
  summaryLabel: {
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
  sectionContent: {
    ...CARD_STYLES.container,
    padding: SIZES.spacingMedium,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacingMedium,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateText: {
    ...FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.primary,
    width: 40,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.accent,
    marginLeft: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  categoryItem: {
    marginBottom: SIZES.spacingMedium,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacingSmall,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SIZES.spacingSmall,
  },
  categoryName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  categoryCount: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryRate: {
    ...FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.primary,
    width: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.spacingLarge,
  },
  emptyStateText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: SIZES.spacingMedium,
    textAlign: 'center',
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

export default StatsScreen;