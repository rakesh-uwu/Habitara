import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Swipeable } from 'react-native-gesture-handler';
import { COLORS, FONTS, SIZES, CARD_STYLES } from '../utils/theme';
import { isHabitCompletedOnDate, isPastDate, isFutureDate, getMotivationalMessage } from '../utils/habitUtils';

const HabitCard = ({
  habit,
  date = new Date().toISOString().split('T')[0],
  onPress,
  onToggleCompletion,
  onDelete,
  showStreak = false,
  showDescription = true,
  style,
}) => {
  // Check if habit is valid
  if (!habit || !habit.id) {
    console.error('Invalid habit object in HabitCard:', habit);
    return null;
  }
  
  const isCompleted = isHabitCompletedOnDate(habit, date);
  
  const handleToggleCompletion = (e) => {
    e.stopPropagation();
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Only allow toggling completion for today's date
    if (date !== today) {
      // Show motivational message for past or future dates
      const message = getMotivationalMessage(date);
      Alert.alert(
        message.title,
        message.message,
        [{ text: 'Got it', style: 'default' }],
        { cancelable: true }
      );
      return;
    }
    
    if (onToggleCompletion) {
      onToggleCompletion(habit.id, date);
    }
  };
  
  // Render right actions (delete button)
  const renderRightActions = () => {
    if (!onDelete) return null;
    
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
          Alert.alert(
            'Delete Habit',
            `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Delete', 
                style: 'destructive',
                onPress: () => onDelete(habit.id)
              },
            ]
          );
        }}
      >
        <Icon name="delete" size={24} color="#FFF" />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={[styles.container, isCompleted && styles.completedContainer, style]}
        onPress={() => onPress && onPress(habit)}
        activeOpacity={0.8}
      >
      <View style={[styles.iconContainer, { backgroundColor: COLORS[habit.category] || COLORS.primary }]}>
        <Icon name={habit.icon || 'star'} size={24} color="#FFF" />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{habit.name}</Text>
        
        {showDescription && habit.description && (
          <Text style={styles.description} numberOfLines={1}>
            {habit.description}
          </Text>
        )}
        
        {showStreak && (habit.streak > 0 || habit.currentStreak > 0) && (
          <View style={styles.streakContainer}>
            <Icon name="local-fire-department" size={14} color={COLORS.accent} />
            <Text style={styles.streakText}>
              {habit.streak || habit.currentStreak || 0} day{((habit.streak || habit.currentStreak) !== 1) ? 's' : ''} streak
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.checkContainer, isCompleted && styles.checkedContainer]}
        onPress={handleToggleCompletion}
      >
        {isCompleted ? (
          <Icon name="check-circle" size={28} color={COLORS.success} />
        ) : (
          <Icon name="radio-button-unchecked" size={28} color={COLORS.textMuted} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  deleteAction: {
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  container: {
    ...CARD_STYLES.container,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacingMedium,
    borderLeftWidth: 0,
  },
  completedContainer: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacingMedium,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  description: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  streakText: {
    ...FONTS.medium,
    fontSize: SIZES.xSmall,
    color: COLORS.accent,
    marginLeft: 4,
  },
  checkContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  checkedContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
});

export default HabitCard;