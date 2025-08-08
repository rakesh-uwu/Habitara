import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import AppIcon from '../components/AppIcon';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Start animations
    logoOpacity.value = withTiming(1, { duration: 1000 });
    logoScale.value = withTiming(1, { duration: 1000 });
    
    // Delay text animation
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 800 });
    }, 500);
    
    // Navigate to main screen after splash
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });
  
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <AppIcon size={width * 0.4} />
      </Animated.View>
      
      <Animated.Text style={[styles.title, textAnimatedStyle]}>
        Habitara
      </Animated.Text>
      
      <Animated.Text style={[styles.tagline, textAnimatedStyle]}>
        Build better habits, build a better life
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: width * 0.4,
    height: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacingXLarge,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.title * 1.5,
    color: COLORS.primary,
    marginBottom: SIZES.spacing,
  },
  tagline: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
  },
});

export default SplashScreen;