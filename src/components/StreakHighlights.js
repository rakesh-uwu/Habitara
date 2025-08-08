import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, CARD_STYLES } from '../utils/theme';
import { calculateStreak, getDefaultHabitIcon } from '../utils/habitUtils';

const StreakHighlights = ({ navigation }) => {
  const { habits } = useContext(AppContext);
  const [streakHabits, setStreakHabits] = useState([]);

  useEffect(() => {
    if (habits && habits.length > 0) {
      // Calculate streaks for all habits
      const habitsWithStreaks = habits.map(habit => {
        const { currentStreak, longestStreak } = calculateStreak(habit);
        return {
          ...habit,
          currentStreak,
          longestStreak
        };
      });

      // Sort by current streak (descending)
      const sortedHabits = [...habitsWithStreaks].sort((a, b) => 
        b.currentStreak - a.currentStreak
      );

      // Take top 5 habits with streaks > 0
      const topStreaks = sortedHabits
        .filter(habit => habit.currentStreak > 0)
        .slice(0, 5);

      setStreakHabits(topStreaks);
    }
  }, [habits]);

  const renderStreakItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.streakItem}
      onPress={() => navigation.navigate('HabitDetail', { habit: item })}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color || COLORS.primary }]}>
        <Icon name={item.icon || getDefaultHabitIcon()} size={20} color={COLORS.white} />
      </View>
      <View style={styles.streakInfo}>
        <Text style={styles.habitName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.streakRow}>
          <Icon name="local-fire-department" size={16} color={COLORS.accent} />
          <Text style={styles.streakText}>{item.currentStreak} day streak</Text>
        </View>
      </View>
      <View style={styles.bestContainer}>
        <Text style={styles.bestLabel}>Best</Text>
        <Text style={styles.bestStreak}>{item.longestStreak}</Text>
      </View>
    </TouchableOpacity>
  );

  if (streakHabits.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Streak Highlights</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Stats')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={streakHabits}
        renderItem={renderStreakItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacingLarge,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing,
    marginBottom: SIZES.spacingSmall,
  },
  title: {
    ...FONTS.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  viewAll: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: SIZES.spacing,
    paddingBottom: SIZES.spacingSmall,
  },
  streakItem: {
    ...CARD_STYLES.container,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacingMedium,
    marginRight: SIZES.spacingMedium,
    width: 200,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacingSmall,
  },
  streakInfo: {
    flex: 1,
  },
  habitName: {
    ...FONTS.semiBold,
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.accent,
    marginLeft: 4,
  },
  bestContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.spacingSmall,
  },
  bestLabel: {
    ...FONTS.regular,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  bestStreak: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
});

export default StreakHighlights;