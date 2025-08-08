import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Line,
} from 'react-native-svg';

const AppIcon = ({ size = 192, style }) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 192 192">
        {/* Background */}
        <Rect width="192" height="192" rx="40" fill="#121212" />
        
        {/* Outer Ring */}
        <Circle cx="96" cy="96" r="70" fill="none" stroke="#8A2BE2" strokeWidth="6" />
        
        {/* Inner Circle */}
        <Circle cx="96" cy="96" r="55" fill="rgba(138, 43, 226, 0.2)" stroke="#8A2BE2" strokeWidth="3" />
        
        {/* Checkmark */}
        <Path d="M76 96 L91 111 L126 76" fill="none" stroke="#8A2BE2" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Small Circles representing habits */}
        <Circle cx="65" cy="65" r="10" fill="#FF5722" />
        <Circle cx="127" cy="65" r="10" fill="#4CAF50" />
        <Circle cx="65" cy="127" r="10" fill="#2196F3" />
        <Circle cx="127" cy="127" r="10" fill="#9C27B0" />
        
        {/* Connecting Lines */}
        <Line x1="70" y1="70" x2="91" y2="91" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
        <Line x1="122" y1="70" x2="101" y2="91" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
        <Line x1="70" y1="122" x2="91" y2="101" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
        <Line x1="122" y1="122" x2="101" y2="101" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppIcon;