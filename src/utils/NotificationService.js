import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In a real app, you would use a library like react-native-push-notification
// or expo-notifications to handle actual push notifications
// This is a simplified mock implementation for demonstration purposes

const NOTIFICATION_CHANNEL_ID = 'habitara-reminders';
const LAST_NOTIFICATION_KEY = 'habitara-last-notification';

export const initializeNotifications = async () => {
  // In a real app, this would request notification permissions
  // and set up notification channels (for Android)
  
  // Mock implementation
  if (Platform.OS === 'android') {
    // Would create notification channel here
  }
  
  return true; // Return success
};

export const scheduleHabitReminder = async (user) => {
  // Check if notifications are enabled in user settings
  if (!user?.settings?.notifications) {
    return false;
  }
  
  // Get reminder time from user settings or use default (8:00 PM)
  const reminderTime = user?.settings?.reminderTime || '20:00';
  const [hours, minutes] = reminderTime.split(':').map(Number);
  
  // In a real app, this would schedule a daily notification
  
  // Mock implementation
  return true; // Return success
};

export const cancelAllNotifications = () => {
  // In a real app, this would cancel all scheduled notifications
  
  // Mock implementation
  return true;
};

export const checkAppOpenStatus = async (lastOpenedDate) => {
  // Check if the app hasn't been opened today and was last opened on a different day
  if (!lastOpenedDate) return false;
  
  const today = new Date();
  const lastOpened = new Date(lastOpenedDate);
  
  // Check if the last opened date is from a different day
  const isLastOpenedYesterday = 
    today.getDate() !== lastOpened.getDate() ||
    today.getMonth() !== lastOpened.getMonth() ||
    today.getFullYear() !== lastOpened.getFullYear();
  
  return isLastOpenedYesterday;
};

export const sendLocalNotification = async (title, message) => {
  // In a real app, this would send an actual local notification
  
  // Store the last notification time
  await AsyncStorage.setItem(LAST_NOTIFICATION_KEY, new Date().toISOString());
  
  // Mock implementation
  return true;
};

export const checkAndSendReminderNotification = async (user, userNotes, lastOpenedDate) => {
  if (!user || !user.settings || !user.settings.notifications) {
    return false;
  }

  const now = new Date();
  const lastOpened = lastOpenedDate ? new Date(lastOpenedDate) : null;
  
  // Check if the app hasn't been opened today
  if (!lastOpened || !isSameDay(now, lastOpened)) {
    const reminderTime = user.settings.reminderTime || '20:00';
    const [hours, minutes] = reminderTime.split(':').map(Number);
    
    // Check if current time is past the reminder time
    if (now.getHours() >= hours && now.getMinutes() >= minutes) {
      let message = `Hey ${user.name}, don't forget to check in with your habits today!`;
      
      // Include a recent note if available
      if (userNotes && userNotes.length > 0 && userNotes[0].type === 'text') {
        message = `Remember: "${userNotes[0].content.substring(0, 50)}${userNotes[0].content.length > 50 ? '...' : ''}" - Don't forget to check in with your habits today!`;
      }
      
      await sendLocalNotification('Habitara Reminder', message);
      return true;
    }
  }
  
  return false;
};