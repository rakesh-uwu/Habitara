// Theme configuration for Habitara app
// Cat-themed dark translucent theme

export const COLORS = {
  // Base colors - Enhanced cat-themed dark mode
  background: 'rgba(25, 25, 35, 0.95)', // Dark blue-gray background (cat night vision)
  card: 'rgba(40, 40, 50, 0.85)', // Lighter card background with transparency
  cardBackground: 'rgba(45, 45, 55, 0.9)', // Card background for modals and overlays
  cardActive: 'rgba(50, 50, 60, 0.9)', // Active card state with more transparency
  cardHighlight: 'rgba(60, 60, 70, 0.95)', // Highlighted card for important items
  
  // Text colors - Enhanced for better readability
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  textHighlight: '#FFD166', // Highlighted text (cat eye yellow)
  
  // Accent colors - Expanded cat-themed palette
  primary: '#FF9D6B', // Ginger cat orange
  secondary: '#8ECAE6', // Cat eye blue
  success: '#95D5B2', // Soft mint green
  warning: '#FFD166', // Cat eye yellow
  danger: '#EF476F', // Bright pink
  accent: '#FB8500', // Vibrant orange
  
  // Cat-themed colors
  gingerCat: '#FF9D6B', // Ginger/orange cat
  blackCat: '#333333', // Black cat
  siameseCat: '#E8D4C0', // Siamese cat point color
  tabbyCat: '#B38B6D', // Tabby cat brown
  calicoCat: '#F5CBA7', // Calico patches
  whiteCat: '#F5F5F5', // White cat
  greyCat: '#A9A9A9', // Grey cat
  brownCat: '#8B4513', // Brown cat
  creamCat: '#FFFDD0', // Cream colored cat
  blueCat: '#B0C4DE', // Russian blue cat
  
  // UI Element colors - Enhanced for better visibility
  border: 'rgba(255, 255, 255, 0.15)',
  divider: 'rgba(255, 255, 255, 0.08)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Icon colors
  iconPrimary: '#FFFFFF',
  iconSecondary: 'rgba(255, 255, 255, 0.7)',
  iconAccent: '#FFD166', // Cat eye yellow for important icons
  
  // Category colors (for habit types) - Enhanced with cat theme
  fitness: '#FF7043', // Energetic cat orange
  health: '#66BB6A', // Catnip green
  productivity: '#42A5F5', // Cat eye blue
  mindfulness: '#AB47BC', // Relaxed cat purple
  learning: '#FFA726', // Curious cat orange
  social: '#EC407A', // Playful cat pink
  nutrition: '#9CCC65', // Fresh cat food green
  creativity: '#7E57C2', // Imaginative cat purple
  sleep: '#5C6BC0', // Sleepy cat blue
  hygiene: '#26C6DA', // Clean cat cyan
  finance: '#26A69A', // Resourceful cat teal
  reading: '#8D6E63', // Cozy cat brown
  
  // Heatmap colors (for calendar view) - Cat paw prints intensity
  heatmapEmpty: 'rgba(255, 255, 255, 0.05)',
  heatmapLevel1: 'rgba(255, 157, 107, 0.3)', // Light orange
  heatmapLevel2: 'rgba(255, 157, 107, 0.5)', // Medium orange
  heatmapLevel3: 'rgba(255, 157, 107, 0.7)', // Strong orange
  heatmapLevel4: 'rgba(255, 157, 107, 0.9)', // Very strong orange
  
  // Additional UI colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300',
  },
  semiBold: {
    fontFamily: 'System',
    fontWeight: '600',
  },
};

export const SIZES = {
  // Font sizes
  xSmall: 10,
  small: 12,
  medium: 14,
  large: 16,
  xLarge: 18,
  xxLarge: 20,
  xxxLarge: 24,
  title: 32,
  
  // Spacing
  spacing: 8,
  spacingSmall: 4,
  spacingMedium: 12,
  spacingLarge: 16,
  spacingXLarge: 24,
  spacingXXLarge: 32,
  
  // Border radius - More rounded for cat-like softness
  borderRadiusSmall: 6,
  borderRadius: 10,
  borderRadiusLarge: 14,
  borderRadiusXLarge: 18,
  borderRadiusXXLarge: 28,
  
  // Icon sizes
  iconSmall: 16,
  icon: 24,
  iconLarge: 32,
};

// Cat-themed card styles - merged with common styles below


export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  catShadow: {
    shadowColor: '#FF9D6B', // Ginger cat orange shadow
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
};

// Cat-themed card styles for the app
export const CARD_STYLES = {
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.spacingLarge,
    marginVertical: SIZES.spacing,
    marginBottom: 12,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  activeContainer: {
    backgroundColor: COLORS.cardActive,
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.spacingLarge,
    marginVertical: SIZES.spacing,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.primary, // Cat-themed primary color
    overflow: 'hidden',
  },
  catCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.spacingMedium,
    marginBottom: SIZES.spacingMedium,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  catCardHighlight: {
    backgroundColor: COLORS.cardHighlight,
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.spacingMedium,
    marginBottom: SIZES.spacingMedium,
    ...SHADOWS.large,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
};

// Animation configurations
export const ANIMATIONS = {
  // Spring animation for buttons
  buttonPress: {
    tension: 40,
    friction: 7,
    useNativeDriver: true,
  },
  // Timing animation for transitions
  transition: {
    duration: 300,
    useNativeDriver: true,
  },
  // Spring animation for card appearance
  cardAppear: {
    tension: 50,
    friction: 10,
    useNativeDriver: true,
  },
  // Cat-themed animations
  catBounce: {
    tension: 60,
    friction: 5,
    useNativeDriver: true,
  },
  catStretch: {
    tension: 30,
    friction: 8,
    useNativeDriver: true,
  },
  catPounce: {
    tension: 80,
    friction: 6,
    useNativeDriver: true,
  },
  catPurr: {
    duration: 1000,
    easing: 'linear',
    useNativeDriver: true,
  },
  catWiggle: {
    duration: 400,
    easing: 'ease-in-out',
    useNativeDriver: true,
  },
};

export default {
  COLORS,
  FONTS,
  SIZES,
  SHADOWS,
  CARD_STYLES,
  ANIMATIONS,
};