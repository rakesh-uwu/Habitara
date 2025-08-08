import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const CustomButton = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    let buttonStyle = [styles.button];
    
    // Button type
    if (type === 'primary') {
      buttonStyle.push(styles.primaryButton);
    } else if (type === 'secondary') {
      buttonStyle.push(styles.secondaryButton);
    } else if (type === 'outline') {
      buttonStyle.push(styles.outlineButton);
    } else if (type === 'ghost') {
      buttonStyle.push(styles.ghostButton);
    }
    
    // Button size
    if (size === 'small') {
      buttonStyle.push(styles.smallButton);
    } else if (size === 'large') {
      buttonStyle.push(styles.largeButton);
    }
    
    // Disabled state
    if (disabled) {
      buttonStyle.push(styles.disabledButton);
    }
    
    // Custom style
    if (style) {
      buttonStyle.push(style);
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleArray = [styles.buttonText];
    
    // Text color based on button type
    if (type === 'primary') {
      textStyleArray.push(styles.primaryButtonText);
    } else if (type === 'secondary') {
      textStyleArray.push(styles.secondaryButtonText);
    } else if (type === 'outline') {
      textStyleArray.push(styles.outlineButtonText);
    } else if (type === 'ghost') {
      textStyleArray.push(styles.ghostButtonText);
    }
    
    // Text size based on button size
    if (size === 'small') {
      textStyleArray.push(styles.smallButtonText);
    } else if (size === 'large') {
      textStyleArray.push(styles.largeButtonText);
    }
    
    // Disabled state
    if (disabled) {
      textStyleArray.push(styles.disabledButtonText);
    }
    
    // Custom text style
    if (textStyle) {
      textStyleArray.push(textStyle);
    }
    
    return textStyleArray;
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={type === 'primary' ? COLORS.background : COLORS.primary} 
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.borderRadiusLarge,
    paddingVertical: SIZES.spacingMedium,
    paddingHorizontal: SIZES.spacingLarge,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingVertical: SIZES.spacingSmall,
    paddingHorizontal: SIZES.spacingMedium,
  },
  largeButton: {
    paddingVertical: SIZES.spacingLarge,
    paddingHorizontal: SIZES.spacingXLarge,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.disabled,
  },
  buttonText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: COLORS.background,
  },
  secondaryButtonText: {
    color: COLORS.background,
  },
  outlineButtonText: {
    color: COLORS.primary,
  },
  ghostButtonText: {
    color: COLORS.primary,
  },
  smallButtonText: {
    fontSize: SIZES.small,
  },
  largeButtonText: {
    fontSize: SIZES.large,
  },
  disabledButtonText: {
    color: COLORS.textMuted,
  },
});

export default CustomButton;