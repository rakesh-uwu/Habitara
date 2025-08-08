import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, CARD_STYLES } from '../utils/theme';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { userData, saveUserData, habits, clearAllData } = useContext(AppContext);
  
  const [name, setName] = useState(userData?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(userData?.profilePicture || null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(userData?.settings?.notifications || false);
  const [reminderTime, setReminderTime] = useState(userData?.settings?.reminderTime || '20:00');
  const [showCompletedHabits, setShowCompletedHabits] = useState(userData?.settings?.showCompletedHabits !== false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const handleSaveProfile = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    
    const updatedUserData = {
      ...userData,
      name,
      profilePicture,
      settings: {
        ...userData?.settings,
        notifications: notificationsEnabled,
        reminderTime,
        showCompletedHabits,
      }
    };
    
    saveUserData(updatedUserData);
    setIsEditing(false);
  };
  
  // Cat-themed avatar options
  const catAvatars = [
    { id: 'ginger', name: 'Ginger Cat', color: COLORS.primary },
    { id: 'black', name: 'Black Cat', color: '#333333' },
    { id: 'siamese', name: 'Siamese Cat', color: '#E8D4C0' },
    { id: 'tabby', name: 'Tabby Cat', color: '#B38B6D' },
    { id: 'calico', name: 'Calico Cat', color: '#F5CBA7' },
    { id: 'white', name: 'White Cat', color: '#F5F5F5' },
    { id: 'persian', name: 'Persian Cat', color: '#D3D3D3' },
    { id: 'bengal', name: 'Bengal Cat', color: '#CD853F' },
    { id: 'ragdoll', name: 'Ragdoll Cat', color: '#F0F8FF' },
    { id: 'sphynx', name: 'Sphynx Cat', color: '#FFE4C4' },
  ];

  const handleUpdateProfilePicture = () => {
    // Navigate to a modal screen for avatar selection
    setIsEditing(true);
    
    // Create a modal view for avatar selection
    const avatarSelectionView = (
      <View style={styles.avatarSelectionContainer}>
        <Text style={styles.avatarSelectionTitle}>Choose Your Cat Avatar</Text>
        <View style={styles.avatarGrid}>
          {catAvatars.map(avatar => (
            <TouchableOpacity
              key={avatar.id}
              style={[styles.avatarOption, { backgroundColor: avatar.color }]}
              onPress={() => {
                setProfilePicture(avatar.id);
                setIsEditing(false);
              }}
            >
              <Text style={styles.avatarName}>{avatar.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity 
          style={styles.removeAvatarButton}
          onPress={() => {
            setProfilePicture(null);
            setIsEditing(false);
          }}
        >
          <Text style={styles.removeAvatarText}>Remove Avatar</Text>
        </TouchableOpacity>
      </View>
    );
    
    // Show the avatar selection in an alert
    Alert.alert(
      "Choose Your Cat Avatar",
      "Select your favorite cat style",
      [
        { text: "Cancel", style: "cancel", onPress: () => setIsEditing(false) },
        ...catAvatars.map(avatar => ({
          text: avatar.name,
          onPress: () => {
            setProfilePicture(avatar.id);
            setIsEditing(false);
          }
        })),
        { 
          text: "Remove Avatar", 
          onPress: () => {
            setProfilePicture(null);
            setIsEditing(false);
          }
        }
      ]
    );
  };
  
  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all your data? This will delete all habits and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All Data', 
          style: 'destructive',
          onPress: () => {
            clearAllData();
            Alert.alert('Success', 'All data has been cleared');
          }
        },
      ]
    );
  };

  const handleReminderTimeChange = (time) => {
    setReminderTime(time);
    setShowTimePicker(false);
  };

  const renderSettingItem = (icon, title, description, component) => {
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingIconContainer}>
          <Icon name={icon} size={24} color={COLORS.primary} />
        </View>
        
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
        
        <View style={styles.settingControl}>
          {component}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
            <Icon name="edit" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
            <Icon name="check" size={24} color={COLORS.success} />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handleUpdateProfilePicture}
          >
            {profilePicture ? (
              // Check if it's one of our cat avatars
              catAvatars.find(avatar => avatar.id === profilePicture) ? (
                <View style={[styles.avatarImage, {backgroundColor: catAvatars.find(avatar => avatar.id === profilePicture).color, justifyContent: 'center', alignItems: 'center'}]}>
                  <Icon name="pets" size={32} color={COLORS.white} />
                </View>
              ) : profilePicture === 'placeholder' ? (
                <View style={[styles.avatarImage, {backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center'}]}>
                  <Text style={{color: COLORS.white, fontSize: 24, fontWeight: 'bold'}}>
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
              ) : (
                <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
              )
            ) : (
              <View style={[styles.avatarImage, {backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center'}]}>
                <Icon name="pets" size={32} color={COLORS.white} />
              </View>
            )}
            <View style={styles.editAvatarButton}>
              <Icon name="edit" size={16} color={COLORS.background} />
            </View>
          </TouchableOpacity>
          
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor={COLORS.textMuted}
            />
          ) : (
            <Text style={styles.userName}>{name || 'User'}</Text>
          )}
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{habits.length}</Text>
              <Text style={styles.statLabel}>Habits</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {habits.reduce((total, habit) => total + (habit.completedDates?.length || 0), 0)}
              </Text>
              <Text style={styles.statLabel}>Completions</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.max(...habits.map(habit => {
                  const streakInfo = { currentStreak: 0, longestStreak: 0 };
                  return streakInfo.longestStreak;
                }), 0)}
              </Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>
        </View>
        
        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsContainer}>
            {renderSettingItem(
              'notifications',
              'Notifications',
              'Receive daily reminders for your habits',
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            )}
            
            {notificationsEnabled && renderSettingItem(
              'access-time',
              'Reminder Time',
              'Set when you want to receive reminders',
              <TouchableOpacity 
                style={styles.timeSelector}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.timeText}>{reminderTime}</Text>
              </TouchableOpacity>
            )}
            
            {showTimePicker && (
              <View style={styles.timePickerContainer}>
                <View style={styles.timePickerHeader}>
                  <Text style={styles.timePickerTitle}>Set Reminder Time</Text>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Icon name="close" size={24} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.timeOptions}>
                  {['08:00', '12:00', '15:00', '18:00', '20:00', '22:00'].map(time => (
                    <TouchableOpacity 
                      key={time}
                      style={[styles.timeOption, reminderTime === time && styles.selectedTimeOption]}
                      onPress={() => handleReminderTimeChange(time)}
                    >
                      <Text style={[styles.timeOptionText, reminderTime === time && styles.selectedTimeOptionText]}>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            {renderSettingItem(
              'visibility',
              'Show Completed Habits',
              'Display completed habits on the home screen',
              <Switch
                value={showCompletedHabits}
                onValueChange={setShowCompletedHabits}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            )}
          </View>
        </View>
        
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingsContainer}>
            {renderSettingItem(
              'info',
              'App Version',
              'Habitara v1.0.0',
              null
            )}
            
            {renderSettingItem(
              'help',
              'Help & Support',
              'Contact us at ktechnologyts@gmail.com',
              <TouchableOpacity onPress={() => {
                // Open email client with mailto link
                Alert.alert('Contact Support', 'Send an email to ktechnologyts@gmail.com for support.');
              }}>
                <Icon name="chevron-right" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
            
            {renderSettingItem(
              'privacy-tip',
              'Privacy Policy',
              'View our privacy policy',
              <TouchableOpacity onPress={() => {
                // Show privacy policy
                Alert.alert('Privacy Policy', 'Habitara respects your privacy. We do not collect or share your personal data with third parties.');
              }}>
                <Icon name="chevron-right" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={handleClearAllData}>
            <Icon name="delete-forever" size={20} color={COLORS.error} />
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
        
        {/* Extra space at bottom for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Background gradient elements */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarSelectionContainer: {
    padding: SIZES.spacingMedium,
  },
  avatarSelectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacingMedium,
    textAlign: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacingLarge,
  },
  timePickerContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.spacingMedium,
    marginTop: SIZES.spacingMedium,
    marginBottom: SIZES.spacingMedium,
    ...CARD_STYLES.shadow,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacingMedium,
  },
  timePickerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeOption: {
    width: '30%',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.spacingMedium,
    marginBottom: SIZES.spacingMedium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedTimeOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeOptionText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  selectedTimeOptionText: {
    color: COLORS.white,
  },
  timeSelector: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadiusSmall,
    paddingHorizontal: SIZES.spacingMedium,
    paddingVertical: SIZES.spacingSmall,
  },
  timeText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  avatarOption: {
    width: width / 3 - SIZES.spacingLarge,
    height: width / 3 - SIZES.spacingLarge,
    borderRadius: (width / 3 - SIZES.spacingLarge) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacingMedium,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  avatarName: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SIZES.spacingSmall,
    paddingVertical: 2,
    borderRadius: SIZES.borderRadiusSmall,
  },
  removeAvatarButton: {
    backgroundColor: COLORS.danger,
    padding: SIZES.spacingMedium,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
  },
  removeAvatarText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SIZES.spacingXLarge,
    paddingBottom: SIZES.spacingMedium,
    paddingHorizontal: SIZES.spacingLarge,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: SIZES.spacingLarge,
    paddingTop: SIZES.spacingLarge,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: SIZES.spacingXLarge,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacingMedium,
    position: 'relative',
  },
  avatarText: {
    ...FONTS.h1,
    color: COLORS.background,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  userName: {
    ...FONTS.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacingLarge,
  },
  nameInput: {
    ...FONTS.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacingLarge,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingBottom: SIZES.spacingSmall,
    minWidth: 150,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius,
    paddingVertical: SIZES.spacingMedium,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.border,
  },
  section: {
    marginBottom: SIZES.spacingXLarge,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacingMedium,
  },
  settingsContainer: {
    ...CARD_STYLES.container,
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacingMedium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacingMedium,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  settingControl: {
    marginLeft: SIZES.spacingMedium,
  },
  timeSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SIZES.spacingMedium,
    paddingVertical: SIZES.spacingSmall,
    borderRadius: SIZES.borderRadius,
  },
  timeText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    paddingVertical: SIZES.spacingMedium,
    borderRadius: SIZES.borderRadius,
  },
  dangerButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.error,
    marginLeft: SIZES.spacingSmall,
  },
  backgroundCircle1: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(138, 43, 226, 0.05)',
    top: -width,
    right: -width * 0.5,
    zIndex: -1,
  },
  backgroundCircle2: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width * 0.5,
    backgroundColor: 'rgba(0, 191, 255, 0.05)',
    bottom: -width * 0.3,
    left: -width * 0.3,
    zIndex: -1,
  },
});

export default ProfileScreen;