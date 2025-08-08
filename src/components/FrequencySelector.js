import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const FrequencySelector = ({ frequency, onSelectFrequency, selectedDays, onSelectDays }) => {
  const [showDaySelector, setShowDaySelector] = useState(frequency !== 'daily');
  
  const handleFrequencyChange = (newFrequency) => {
    onSelectFrequency(newFrequency);
    setShowDaySelector(newFrequency !== 'daily');
  };
  
  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      onSelectDays(selectedDays.filter(d => d !== day));
    } else {
      onSelectDays([...selectedDays, day]);
    }
  };
  
  const renderFrequencyOption = (value, label, icon) => {
    const isSelected = frequency === value;
    
    return (
      <TouchableOpacity
        style={[styles.frequencyOption, isSelected && styles.selectedFrequencyOption]}
        onPress={() => handleFrequencyChange(value)}
        activeOpacity={0.7}
      >
        <Icon 
          name={icon} 
          size={20} 
          color={isSelected ? COLORS.primary : COLORS.textSecondary} 
        />
        <Text style={[styles.frequencyLabel, isSelected && styles.selectedFrequencyLabel]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderDaySelector = () => {
    const days = [
      { value: 'monday', label: 'M' },
      { value: 'tuesday', label: 'T' },
      { value: 'wednesday', label: 'W' },
      { value: 'thursday', label: 'T' },
      { value: 'friday', label: 'F' },
      { value: 'saturday', label: 'S' },
      { value: 'sunday', label: 'S' },
    ];
    
    return (
      <View style={styles.daySelector}>
        <Text style={styles.daySelectorLabel}>
          {frequency === 'weekly' ? 'Select days of the week:' : 
           frequency === 'monthly' ? 'Select days of the month:' : 
           'Select custom days:'}
        </Text>
        
        <View style={styles.daysContainer}>
          {days.map((day, index) => {
            const isSelected = selectedDays.includes(day.value);
            
            return (
              <TouchableOpacity
                key={day.value}
                style={[styles.dayOption, isSelected && styles.selectedDayOption]}
                onPress={() => toggleDay(day.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayLabel, isSelected && styles.selectedDayLabel]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Frequency</Text>
      
      <View style={styles.frequencyOptions}>
        {renderFrequencyOption('daily', 'Daily', 'today')}
        {renderFrequencyOption('weekly', 'Weekly', 'view-week')}
        {renderFrequencyOption('monthly', 'Monthly', 'calendar-month')}
        {renderFrequencyOption('custom', 'Custom', 'tune')}
      </View>
      
      {showDaySelector && renderDaySelector()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacingLarge,
  },
  label: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacingMedium,
  },
  frequencyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacingMedium,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.spacingSmall,
    paddingHorizontal: SIZES.spacingMedium,
    borderRadius: SIZES.borderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    flex: 1,
    marginHorizontal: 4,
  },
  selectedFrequencyOption: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
  },
  frequencyLabel: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginLeft: SIZES.spacingSmall,
  },
  selectedFrequencyLabel: {
    color: COLORS.primary,
  },
  daySelector: {
    marginTop: SIZES.spacingMedium,
  },
  daySelectorLabel: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacingMedium,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedDayOption: {
    backgroundColor: COLORS.primary,
  },
  dayLabel: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  selectedDayLabel: {
    color: COLORS.background,
  },
});

export default FrequencySelector;