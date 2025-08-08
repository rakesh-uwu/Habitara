import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import { generateId, getDayNames, getMonthDays, getDefaultHabitIcon } from '../utils/habitUtils';

const CATEGORIES = [
  { id: 'fitness', name: 'Fitness', icon: 'fitness-center', color: COLORS.fitness },
  { id: 'health', name: 'Health', icon: 'favorite', color: COLORS.health },
  { id: 'productivity', name: 'Productivity', icon: 'work', color: COLORS.productivity },
  { id: 'mindfulness', name: 'Mindfulness', icon: 'self-improvement', color: COLORS.mindfulness },
  { id: 'learning', name: 'Learning', icon: 'school', color: COLORS.learning },
  { id: 'social', name: 'Social', icon: 'people', color: COLORS.social },
  { id: 'nutrition', name: 'Nutrition', icon: 'restaurant', color: COLORS.nutrition },
  { id: 'creativity', name: 'Creativity', icon: 'palette', color: COLORS.creativity },
  { id: 'sleep', name: 'Sleep', icon: 'bedtime', color: COLORS.sleep },
  { id: 'hygiene', name: 'Hygiene', icon: 'wash', color: COLORS.hygiene },
  { id: 'finance', name: 'Finance', icon: 'account-balance-wallet', color: COLORS.finance },
  { id: 'reading', name: 'Reading', icon: 'menu-book', color: COLORS.reading },
];

const FREQUENCIES = [
  { id: 'daily', name: 'Daily' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'custom', name: 'Custom' },
];

const AddHabitScreen = ({ navigation }) => {
  const { addHabit } = useContext(AppContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('fitness');
  const [frequency, setFrequency] = useState('daily');
  const [customDays, setCustomDays] = useState([]);
  const [errors, setErrors] = useState({});
  
  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  
  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 500 });
    slideAnim.value = withTiming(0, { duration: 500 });
  }, []);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Habit name is required';
    }
    
    if ((frequency === 'weekly' || frequency === 'monthly' || frequency === 'custom') && 
        (!customDays || customDays.length === 0)) {
      newErrors.customDays = 'Please select at least one day';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!validateForm()) return;
    
    const newHabit = {
      id: generateId(),
      name,
      description,
      category,
      frequency,
      customDays: frequency !== 'daily' ? customDays : [],
      icon: getDefaultHabitIcon(category),
      createdAt: new Date().toISOString(),
      completedDates: [],
      streak: 0,
    };
    
    addHabit(newHabit);
    navigation.goBack();
  };
  
  const toggleDaySelection = (dayId) => {
    if (customDays.includes(dayId)) {
      setCustomDays(customDays.filter(id => id !== dayId));
    } else {
      setCustomDays([...customDays, dayId]);
    }
  };
  
  const renderDaySelector = () => {
    if (frequency === 'daily') return null;
    
    const days = frequency === 'monthly' ? getMonthDays() : getDayNames();
    
    return (
      <View style={styles.selectorContainer}>
        <Text style={styles.sectionTitle}>
          {frequency === 'monthly' ? 'Select Days of Month' : 'Select Days of Week'}
        </Text>
        {errors.customDays && <Text style={styles.errorText}>{errors.customDays}</Text>}
        
        <View style={styles.daysContainer}>
          {days.map(day => (
            <TouchableOpacity
              key={day.id}
              style={[
                styles.dayButton,
                customDays.includes(day.id) && styles.selectedDayButton
              ]}
              onPress={() => toggleDaySelection(day.id)}
            >
              <Text 
                style={[
                  styles.dayButtonText,
                  customDays.includes(day.id) && styles.selectedDayButtonText
                ]}
              >
                {day.short || day.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    };
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.header,
          animatedStyle
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Habit</Text>
        <View style={styles.backButton} />
      </Animated.View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[useAnimatedStyle(() => ({
            opacity: fadeAnim.value,
            transform: [{ translateY: slideAnim.value }]
          }))]}
        >
          {/* Habit Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Habit Name</Text>
            <TextInput
              style={styles.input}
              placeholder="What habit do you want to build?"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>
          
          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add some details about this habit"
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>
          
          {/* Category Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoriesContainer}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    category === cat.id && styles.selectedCategoryButton,
                    { borderColor: cat.color }
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Icon 
                    name={cat.icon} 
                    size={24} 
                    color={category === cat.id ? cat.color : COLORS.textSecondary} 
                  />
                  <Text 
                    style={[
                      styles.categoryText,
                      category === cat.id && { color: cat.color }
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Frequency Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              {FREQUENCIES.map(freq => (
                <TouchableOpacity
                  key={freq.id}
                  style={[
                    styles.frequencyButton,
                    frequency === freq.id && styles.selectedFrequencyButton
                  ]}
                  onPress={() => {
                    setFrequency(freq.id);
                    if (freq.id === 'daily') {
                      setCustomDays([]);
                    }
                  }}
                >
                  <Text 
                    style={[
                      styles.frequencyText,
                      frequency === freq.id && styles.selectedFrequencyText
                    ]}
                  >
                    {freq.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Day Selector (for weekly, monthly, custom) */}
          {renderDaySelector()}
          
          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Create Habit</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.spacingLarge,
    paddingTop: SIZES.spacingXLarge,
    paddingBottom: SIZES.spacingMedium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    paddingBottom: 100, // Extra space for bottom tab bar
  },
  inputContainer: {
    marginBottom: SIZES.spacingLarge,
  },
  label: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacingSmall,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.borderRadius,
    padding: SIZES.spacingMedium,
    color: COLORS.textPrimary,
    fontSize: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.danger,
    marginTop: SIZES.spacingSmall,
  },
  sectionContainer: {
    marginBottom: SIZES.spacingLarge,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacingMedium,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.borderRadius,
    padding: SIZES.spacingMedium,
    marginBottom: SIZES.spacingMedium,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCategoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginLeft: SIZES.spacingSmall,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.borderRadius,
    paddingVertical: SIZES.spacingMedium,
    marginHorizontal: 4,
  },
  selectedFrequencyButton: {
    backgroundColor: COLORS.primary,
  },
  frequencyText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  selectedFrequencyText: {
    color: COLORS.background,
  },
  selectorContainer: {
    marginBottom: SIZES.spacingLarge,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.borderRadius,
    paddingVertical: SIZES.spacingMedium,
    paddingHorizontal: SIZES.spacingSmall,
    margin: 4,
    minWidth: 40,
  },
  selectedDayButton: {
    backgroundColor: COLORS.primary,
  },
  dayButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  selectedDayButtonText: {
    color: COLORS.background,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusLarge,
    paddingVertical: SIZES.spacingMedium,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.spacingLarge,
    marginBottom: SIZES.spacingXXLarge,
  },
  saveButtonText: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.background,
  },
});

export default AddHabitScreen;