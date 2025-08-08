import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { COLORS, FONTS, SIZES, CARD_STYLES } from '../utils/theme';

const { width } = Dimensions.get('window');

// Motivational quotes database
const QUOTES = [
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    quote: "Habits are first cobwebs, then cables.",
    author: "Spanish Proverb"
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    quote: "Small habits make a big difference when done consistently over time.",
    author: "James Clear"
  },
  {
    quote: "You'll never change your life until you change something you do daily.",
    author: "John C. Maxwell"
  },
  {
    quote: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun"
  },
  {
    quote: "The chains of habit are too light to be felt until they are too heavy to be broken.",
    author: "Warren Buffett"
  },
  {
    quote: "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.",
    author: "Benjamin Franklin"
  },
];

// Success stories database
const SUCCESS_STORIES = [
  {
    name: "Elon Musk",
    habit: "Reading",
    story: "Reads books for hours daily. This habit helped him learn rocket science from scratch.",
    icon: "menu-book"
  },
  {
    name: "Oprah Winfrey",
    habit: "Gratitude Journaling",
    story: "Has maintained a gratitude journal for decades, writing down 5 things she's grateful for every day.",
    icon: "edit"
  },
  {
    name: "Bill Gates",
    habit: "Reading",
    story: "Reads 50 books per year, crediting this habit for much of his success and knowledge.",
    icon: "menu-book"
  },
  {
    name: "Serena Williams",
    habit: "Consistent Practice",
    story: "Practices tennis for 3-4 hours daily, even at the peak of her career.",
    icon: "sports-tennis"
  },
  {
    name: "Warren Buffett",
    habit: "Continuous Learning",
    story: "Spends 80% of his day reading and thinking, a habit he's maintained throughout his career.",
    icon: "psychology"
  },
  {
    name: "Arianna Huffington",
    habit: "Sleep Routine",
    story: "Prioritizes 8 hours of sleep nightly after learning its importance for productivity and health.",
    icon: "nightlight"
  },
];

const MotivationalContent = () => {
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [currentStory, setCurrentStory] = useState(SUCCESS_STORIES[0]);
  const quoteOpacity = useSharedValue(1);
  const storyOpacity = useSharedValue(1);
  
  // Initialize quotes and stories on component mount
  useEffect(() => {
    // Set initial quote and story
    try {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      setCurrentQuote(QUOTES[randomIndex]);
      
      const randomStoryIndex = Math.floor(Math.random() * SUCCESS_STORIES.length);
      setCurrentStory(SUCCESS_STORIES[randomStoryIndex]);
    } catch (error) {
      // Fallback to first items if there's an error
      console.error('Error initializing motivational content:', error);
      setCurrentQuote(QUOTES[0]);
      setCurrentStory(SUCCESS_STORIES[0]);
    }
  }, []);
  
  const changeQuote = () => {
    quoteOpacity.value = withTiming(0, { duration: 300 }, () => {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      setCurrentQuote(QUOTES[randomIndex]);
      quoteOpacity.value = withTiming(1, { duration: 300 });
    });
  };
  
  const changeStory = () => {
    storyOpacity.value = withTiming(0, { duration: 300 }, () => {
      const randomIndex = Math.floor(Math.random() * SUCCESS_STORIES.length);
      setCurrentStory(SUCCESS_STORIES[randomIndex]);
      storyOpacity.value = withTiming(1, { duration: 300 });
    });
  };
  
  const quoteAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: quoteOpacity.value,
    };
  });
  
  const storyAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: storyOpacity.value,
    };
  });
  
  return (
    <View style={styles.container}>
      {/* Motivational Quote */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daily Inspiration</Text>
        <TouchableOpacity onPress={changeQuote} style={styles.refreshButton}>
          <Icon name="refresh" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <Animated.View style={[styles.quoteCard, quoteAnimatedStyle]}>
        <Icon name="format-quote" size={24} color={COLORS.primary} style={styles.quoteIcon} />
        <Text style={styles.quoteText}>{currentQuote.quote}</Text>
        <Text style={styles.authorText}>— {currentQuote.author}</Text>
      </Animated.View>
      
      {/* Success Story */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Success Story</Text>
        <TouchableOpacity onPress={changeStory} style={styles.refreshButton}>
          <Icon name="refresh" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <Animated.View style={[styles.storyCard, storyAnimatedStyle]}>
        <View style={styles.storyHeader}>
          <View style={styles.storyIconContainer}>
            <Icon name={currentStory.icon} size={24} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.storyName}>{currentStory.name}</Text>
            <Text style={styles.storyHabit}>{currentStory.habit}</Text>
          </View>
        </View>
        <Text style={styles.storyText}>{currentStory.story}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacingLarge,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacingSmall,
    paddingHorizontal: SIZES.spacing,
  },
  sectionTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  refreshButton: {
    padding: 5,
  },
  quoteCard: {
    ...CARD_STYLES.container,
    padding: SIZES.spacingMedium,
    marginBottom: SIZES.spacingLarge,
    marginHorizontal: SIZES.spacing,
  },
  quoteIcon: {
    marginBottom: SIZES.spacingSmall,
  },
  quoteText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacingSmall,
    fontStyle: 'italic',
  },
  authorText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    alignSelf: 'flex-end',
  },
  storyCard: {
    ...CARD_STYLES.container,
    padding: SIZES.spacingMedium,
    marginHorizontal: SIZES.spacing,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacingSmall,
  },
  storyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacingSmall,
  },
  storyName: {
    ...FONTS.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  storyHabit: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  storyText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
});

export default MotivationalContent;