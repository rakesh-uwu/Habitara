import React from 'react';
import Svg, {
  Circle,
  Path,
  Line,
} from 'react-native-svg';

const Logo = ({ width = 200, height = 200 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      {/* Background Circle */}
      <Circle cx="100" cy="100" r="90" fill="rgba(138, 43, 226, 0.2)" />
      
      {/* Outer Ring */}
      <Circle cx="100" cy="100" r="85" fill="none" stroke="#8A2BE2" strokeWidth="6" />
      
      {/* Inner Circle */}
      <Circle cx="100" cy="100" r="70" fill="rgba(138, 43, 226, 0.1)" stroke="#8A2BE2" strokeWidth="3" />
      
      {/* Checkmark */}
      <Path d="M80 100 L95 115 L130 80" fill="none" stroke="#8A2BE2" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Small Circles representing habits */}
      <Circle cx="65" cy="65" r="10" fill="#FF5722" />
      <Circle cx="135" cy="65" r="10" fill="#4CAF50" />
      <Circle cx="65" cy="135" r="10" fill="#2196F3" />
      <Circle cx="135" cy="135" r="10" fill="#9C27B0" />
      
      {/* Connecting Lines */}
      <Line x1="70" y1="70" x2="95" y2="95" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
      <Line x1="130" y1="70" x2="105" y2="95" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
      <Line x1="70" y1="130" x2="95" y2="105" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
      <Line x1="130" y1="130" x2="105" y2="105" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
    </Svg>
  );
};

export default Logo;