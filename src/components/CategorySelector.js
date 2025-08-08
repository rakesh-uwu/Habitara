import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const categories = [
  { id: 'health', name: 'Health', icon: 'favorite', color: COLORS.health },
  { id: 'fitness', name: 'Fitness', icon: 'fitness-center', color: COLORS.fitness },
  { id: 'productivity', name: 'Productivity', icon: 'work', color: COLORS.productivity },
  { id: 'education', name: 'Education', icon: 'school', color: COLORS.education },
  { id: 'finance', name: 'Finance', icon: 'account-balance', color: COLORS.finance },
  { id: 'social', name: 'Social', icon: 'people', color: COLORS.social },
  { id: 'creativity', name: 'Creativity', icon: 'brush', color: COLORS.creativity },
  { id: 'mindfulness', name: 'Mindfulness', icon: 'self-improvement', color: COLORS.mindfulness },
  { id: 'other', name: 'Other', icon: 'more-horiz', color: COLORS.other },
];

const CategorySelector = ({ selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          
          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}
              onPress={() => onSelectCategory(category.id)}
              activeOpacity={0.7}
            >
              <View 
                style={[styles.iconContainer, { backgroundColor: isSelected ? category.color : 'rgba(255, 255, 255, 0.1)' }]}
              >
                <Icon 
                  name={category.icon} 
                  size={24} 
                  color={isSelected ? '#FFF' : category.color} 
                />
              </View>
              <Text 
                style={[styles.categoryName, isSelected && styles.selectedCategoryName]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  categoriesContainer: {
    paddingRight: SIZES.spacingLarge,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: SIZES.spacingMedium,
    opacity: 0.7,
  },
  selectedCategoryItem: {
    opacity: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacingSmall,
  },
  categoryName: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  selectedCategoryName: {
    color: COLORS.textPrimary,
  },
});

export default CategorySelector;