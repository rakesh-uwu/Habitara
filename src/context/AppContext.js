import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  initializeNotifications, 
  scheduleHabitReminder,
  cancelAllNotifications,
  checkAndSendReminderNotification
} from '../utils/NotificationService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [userNotes, setUserNotes] = useState([]);
  const [lastOpenedDate, setLastOpenedDate] = useState(null);

  // Check if it's the first launch
  useEffect(() => {
    checkFirstLaunch();
    loadUserData();
    loadHabits();
    loadUserNotes();
    loadLastOpenedDate();
    
    // Initialize notifications
    initializeNotifications().then(() => {
      if (user) {
        scheduleHabitReminder(user);
      }
    });
  }, []);
  
  // Ensure user has moodHistory array
  useEffect(() => {
    if (user && !user.moodHistory) {
      const updatedUser = {
        ...user,
        moodHistory: []
      };
      saveUserData(updatedUser);
    }
  }, [user]);

  const checkFirstLaunch = async () => {
    try {
      const value = await AsyncStorage.getItem('alreadyLaunched');
      if (value === null) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      // Silent error handling for production
      setIsFirstLaunch(false);
    }
  };

  const completeFirstLaunch = async () => {
    try {
      await AsyncStorage.setItem('alreadyLaunched', 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      // Silent error handling for production
    }
  };

  const saveUserData = async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      
      // Update notification settings if user data changes
      scheduleHabitReminder(userData);
    } catch (error) {
      // Silent error handling for production
    }
  };
  
  const loadLastOpenedDate = async () => {
    try {
      const dateData = await AsyncStorage.getItem('lastOpenedDate');
      if (dateData) {
        setLastOpenedDate(dateData);
      }
    } catch (error) {
      console.error('Error loading last opened date:', error);
    }
  };
  
  const updateLastOpenedDate = async (date) => {
    try {
      const dateString = date || new Date().toISOString();
      await AsyncStorage.setItem('lastOpenedDate', dateString);
      setLastOpenedDate(dateString);
      
      // Check if we need to send a reminder notification
      if (user && userNotes) {
        await checkAndSendReminderNotification(user, userNotes, lastOpenedDate);
      }
    } catch (error) {
      // Silent error handling for production
    }
  };
  
  const saveUserNotes = async (notes) => {
    try {
      await AsyncStorage.setItem('userNotes', JSON.stringify(notes));
      setUserNotes(notes);
    } catch (error) {
      // Silent error handling for production
    }
  };
  
  const loadUserNotes = async () => {
    try {
      const notesData = await AsyncStorage.getItem('userNotes');
      if (notesData !== null) {
        setUserNotes(JSON.parse(notesData));
      }
    } catch (error) {
      // Silent error handling for production
    }
  };
  
  const addUserNote = async (note) => {
    // If note already has an id, use it, otherwise generate a new one
    const newNote = {
      id: note.id || Date.now().toString(),
      content: note.content,
      type: note.type, // 'text' or 'voice'
      createdAt: note.createdAt || new Date().toISOString(),
      audioUri: note.audioUri || null,
    };
    const updatedNotes = [newNote, ...userNotes].slice(0, 10); // Keep only the 10 most recent notes
    await saveUserNotes(updatedNotes);
    return newNote;
  };
  
  const deleteUserNote = async (noteId) => {
    const updatedNotes = userNotes.filter(note => note.id !== noteId);
    await saveUserNotes(updatedNotes);
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData !== null) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      // Silent error handling for production
    }
  };

  const saveHabits = async (updatedHabits) => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      setHabits(updatedHabits);
    } catch (error) {
      // Silent error handling for production
    }
  };

  const loadHabits = async () => {
    try {
      const habitsData = await AsyncStorage.getItem('habits');
      if (habitsData !== null) {
        setHabits(JSON.parse(habitsData));
      }
    } catch (error) {
      // Silent error handling for production
    }
  };

  const addHabit = (newHabit) => {
    const updatedHabits = [...habits, newHabit];
    saveHabits(updatedHabits);
  };

  const updateHabit = (habitId, updatedData) => {
    const updatedHabits = habits.map(habit => 
      habit.id === habitId ? { ...habit, ...updatedData } : habit
    );
    saveHabits(updatedHabits);
  };

  const deleteHabit = (habitId) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    saveHabits(updatedHabits);
  };

  const markHabitCompleted = (habitId, date) => {
    // Check if habitId is valid
    if (!habitId) {
      return;
    }
    
    const formattedDate = date || new Date().toISOString().split('T')[0];
    
    // Check if the habit exists
    const habitExists = habits.some(habit => habit && habit.id === habitId);
    if (!habitExists) {
      return;
    }
    
    const updatedHabits = habits.map(habit => {
      if (habit && habit.id === habitId) {
        const completedDates = habit.completedDates || [];
        // Check if already completed for this date
        if (!completedDates.includes(formattedDate)) {
          return {
            ...habit,
            completedDates: [...completedDates, formattedDate],
            streak: calculateStreak([...completedDates, formattedDate], habit.frequency)
          };
        }
        return habit;
      }
      return habit;
    });
    
    saveHabits(updatedHabits);
  };

  const unmarkHabitCompleted = (habitId, date) => {
    // Check if habitId is valid
    if (!habitId) {
      return;
    }
    
    const formattedDate = date || new Date().toISOString().split('T')[0];
    
    // Check if the habit exists
    const habitExists = habits.some(habit => habit && habit.id === habitId);
    if (!habitExists) {
      return;
    }
    
    const updatedHabits = habits.map(habit => {
      if (habit && habit.id === habitId) {
        const completedDates = habit.completedDates || [];
        const updatedDates = completedDates.filter(d => d !== formattedDate);
        return {
          ...habit,
          completedDates: updatedDates,
          streak: calculateStreak(updatedDates, habit.frequency)
        };
      }
      return habit;
    });
    
    saveHabits(updatedHabits);
  };

  // Calculate streak based on completed dates and frequency
  const calculateStreak = (completedDates, frequency) => {
    // Check if inputs are valid
    if (!completedDates || !Array.isArray(completedDates) || completedDates.length === 0) return 0;
    if (!frequency) {
      return 0;
    }
    
    // Sort dates in ascending order
    const sortedDates = [...completedDates].sort();
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    let streak = 0;
    let currentDate = new Date(today);
    
    // For daily habits
    if (frequency === 'daily') {
      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (sortedDates.includes(dateStr)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    // For weekly habits
    else if (frequency === 'weekly') {
      // Implementation for weekly streaks
      // This is simplified - a more robust implementation would check for each week
      const weeks = {};
      sortedDates.forEach(date => {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const weekNumber = getWeekNumber(dateObj);
        const key = `${year}-${weekNumber}`;
        weeks[key] = true;
      });
      
      let currentWeek = getWeekNumber(new Date(today));
      let currentYear = new Date(today).getFullYear();
      
      while (weeks[`${currentYear}-${currentWeek}`]) {
        streak++;
        currentWeek--;
        if (currentWeek < 1) {
          currentWeek = 52; // Approximate, not accounting for 53-week years
          currentYear--;
        }
      }
    }
    // For monthly habits
    else if (frequency === 'monthly') {
      // Implementation for monthly streaks
      const months = {};
      sortedDates.forEach(date => {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const key = `${year}-${month}`;
        months[key] = true;
      });
      
      let currentMonth = new Date(today).getMonth();
      let currentYear = new Date(today).getFullYear();
      
      while (months[`${currentYear}-${currentMonth}`]) {
        streak++;
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
      }
    }
    // For custom days, we'll just count consecutive completions
    else {
      streak = sortedDates.length;
    }
    
    return streak;
  };

  // Helper function to get week number
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        habits,
        isFirstLaunch,
        userNotes,
        lastOpenedDate,
        saveUserData,
        loadUserData,
        loadHabits,
        completeFirstLaunch,
        addHabit,
        updateHabit,
        deleteHabit,
        markHabitCompleted,
        unmarkHabitCompleted,
        addUserNote,
        deleteUserNote,
        updateLastOpenedDate,
        cancelAllNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};