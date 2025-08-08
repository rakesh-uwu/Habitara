// Utility functions for habit management

// Generate a unique ID for new habits
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Check if a habit should be completed today based on its frequency
export const shouldCompleteToday = (habit) => {
  // Check if habit is valid
  if (!habit || !habit.frequency) {
    console.error('Invalid habit object in shouldCompleteToday:', habit);
    return false;
  }
  
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
  const dayOfMonth = today.getDate();
  
  switch (habit.frequency) {
    case 'daily':
      return true;
      
    case 'weekly':
      // If customDays is set, check if today is one of those days
      if (habit.customDays && habit.customDays.length > 0) {
        return habit.customDays.includes(dayOfWeek);
      }
      // Default to Monday if no custom days set
      return dayOfWeek === 1;
      
    case 'monthly':
      // If customDays is set, check if today's date is one of those days
      if (habit.customDays && habit.customDays.length > 0) {
        return habit.customDays.includes(dayOfMonth);
      }
      // Default to 1st of month if no custom days set
      return dayOfMonth === 1;
      
    case 'custom':
      if (habit.customDays && habit.customDays.length > 0) {
        return habit.customDays.includes(dayOfWeek);
      }
      return false;
      
    default:
      return false;
  }
};

// Check if a habit was completed on a specific date
export const isHabitCompletedOnDate = (habit, date) => {
  // Check if habit is valid
  if (!habit || !habit.id) {
    console.error('Invalid habit object in isHabitCompletedOnDate:', habit);
    return false;
  }
  
  if (!habit.completedDates || !Array.isArray(habit.completedDates) || habit.completedDates.length === 0) {
    return false;
  }
  
  return habit.completedDates.includes(date);
};

// Check if a date is today
export const isToday = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// Check if a date is in the past
export const isPastDate = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0); // Set to beginning of day
  return date < today;
};

// Check if a date is in the future
export const isFutureDate = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0); // Set to beginning of day
  return date > today;
};

// Get completion status for a date range
export const getCompletionStatusForDateRange = (habit, startDate, endDate) => {
  // Check if habit is valid
  if (!habit || !habit.id) {
    console.error('Invalid habit object in getCompletionStatusForDateRange:', habit);
    return {};
  }
  
  // Check if dates are valid
  if (!startDate || !endDate) {
    console.error('Invalid date range in getCompletionStatusForDateRange:', { startDate, endDate });
    return {};
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error('Invalid date format in getCompletionStatusForDateRange:', { startDate, endDate });
    return {};
  }
  
  const dateMap = {};
  
  // Initialize all dates in range as not completed
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dateMap[dateStr] = {
      completed: false,
      shouldComplete: shouldCompleteOnDate(habit, dateStr)
    };
  }
  
  // Mark completed dates
  if (habit.completedDates && habit.completedDates.length > 0) {
    habit.completedDates.forEach(date => {
      if (dateMap[date]) {
        dateMap[date].completed = true;
      }
    });
  }
  
  return dateMap;
};

// Check if a habit should be completed on a specific date
export const shouldCompleteOnDate = (habit, dateStr) => {
  // Check if habit is valid
  if (!habit || !habit.frequency) {
    console.error('Invalid habit object in shouldCompleteOnDate:', habit);
    return false;
  }
  
  // Check if dateStr is valid
  if (!dateStr) {
    console.error('Invalid date in shouldCompleteOnDate:', dateStr);
    return false;
  }
  
  const date = new Date(dateStr);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.error('Invalid date format in shouldCompleteOnDate:', dateStr);
    return false;
  }
  
  // Only allow marking habits for today
  if (isPastDate(dateStr) || isFutureDate(dateStr)) {
    return false;
  }
  
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  const dayOfMonth = date.getDate();
  
  switch (habit.frequency) {
    case 'daily':
      return true;
      
    case 'weekly':
      if (habit.customDays && habit.customDays.length > 0) {
        return habit.customDays.includes(dayOfWeek);
      }
      return dayOfWeek === 1; // Default to Monday
      
    case 'monthly':
      if (habit.customDays && habit.customDays.length > 0) {
        return habit.customDays.includes(dayOfMonth);
      }
      return dayOfMonth === 1; // Default to 1st of month
      
    case 'custom':
      if (habit.customDays && habit.customDays.length > 0) {
        return habit.customDays.includes(dayOfWeek);
      }
      return false;
      
    default:
      return false;
  }
};

// Get motivational message for past or future date attempts
export const getMotivationalMessage = (date) => {
  if (isPastDate(date)) {
    return {
      title: "Can't Change the Past",
      message: "You can't go back in time, but you can use this moment to build better habits for your future self. Focus on today!",
      icon: "history"
    };
  } else if (isFutureDate(date)) {
    return {
      title: "Future Not Yet Written",
      message: "The future is shaped by what you do today. Focus on your present habits, and tomorrow will take care of itself!",
      icon: "update"
    };
  }
  return null;
};

// Calculate completion rate for a habit
export const calculateCompletionRate = (habit) => {
  // Check if habit is valid
  if (!habit || !habit.id) {
    console.error('Invalid habit object in calculateCompletionRate:', habit);
    return 0;
  }
  
  if (!habit.completedDates || !Array.isArray(habit.completedDates) || habit.completedDates.length === 0) {
    return 0;
  }
  
  // Get the last 30 days
  const today = new Date();
  const last30Days = [];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    last30Days.push(date.toISOString().split('T')[0]);
  }
  
  // Count how many days the habit should have been completed
  let shouldCompleteDays = 0;
  last30Days.forEach(date => {
    if (shouldCompleteOnDate(habit, date)) {
      shouldCompleteDays++;
    }
  });
  
  if (shouldCompleteDays === 0) return 0;
  
  // Count how many days it was actually completed
  const completedDays = habit.completedDates.filter(date => 
    last30Days.includes(date)
  ).length;
  
  return Math.min(completedDays / shouldCompleteDays, 1);
};

// Get heatmap data for calendar view
export const getHeatmapData = (habits) => {
  // Check if habits is valid
  if (!habits || !Array.isArray(habits)) {
    console.error('Invalid habits array in getHeatmapData:', habits);
    return {};
  }
  
  const heatmapData = {};
  
  // Get date range (last 6 months)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  // Initialize all dates with 0 completions
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    heatmapData[dateStr] = 0;
  }
  
  // Count completions for each date
  habits.forEach(habit => {
    // Skip invalid habits
    if (!habit || !habit.id) return;
    
    if (habit.completedDates && Array.isArray(habit.completedDates) && habit.completedDates.length > 0) {
      habit.completedDates.forEach(date => {
        if (heatmapData[date] !== undefined) {
          heatmapData[date] += 1;
        }
      });
    }
  });
  
  return heatmapData;
};

// Format frequency for display
export const formatFrequency = (habit) => {
  // Check if habit is valid
  if (!habit || !habit.id) {
    console.error('Invalid habit object in formatFrequency:', habit);
    return 'Unknown';
  }
  
  if (!habit.frequency) {
    console.error('Missing frequency in formatFrequency:', habit);
    return 'Unknown';
  }
  
  switch (habit.frequency) {
    case 'daily':
      return 'Daily';
      
    case 'weekly':
      if (habit.customDays && habit.customDays.length > 0) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return habit.customDays.map(day => days[day]).join(', ');
      }
      return 'Weekly';
      
    case 'monthly':
      if (habit.customDays && habit.customDays.length > 0) {
        return `Monthly (${habit.customDays.join(', ')})`;
      }
      return 'Monthly';
      
    case 'custom':
      if (habit.customDays && habit.customDays.length > 0) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return habit.customDays.map(day => days[day]).join(', ');
      }
      return 'Custom';
      
    default:
      return 'Custom';
  }
};

// Get day names for frequency selection
export const getDayNames = () => {
  return [
    { id: 0, name: 'Sunday', short: 'Sun' },
    { id: 1, name: 'Monday', short: 'Mon' },
    { id: 2, name: 'Tuesday', short: 'Tue' },
    { id: 3, name: 'Wednesday', short: 'Wed' },
    { id: 4, name: 'Thursday', short: 'Thu' },
    { id: 5, name: 'Friday', short: 'Fri' },
    { id: 6, name: 'Saturday', short: 'Sat' },
  ];
};

// Get month days for frequency selection
export const getMonthDays = () => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push({ id: i, name: i.toString() });
  }
  return days;
};

// Get default habit icon based on category
export const getDefaultHabitIcon = (category) => {
  switch (category) {
    case 'fitness':
      return 'fitness-center';
    case 'health':
      return 'favorite';
    case 'productivity':
      return 'work';
    case 'mindfulness':
      return 'self-improvement';
    case 'learning':
      return 'school';
    case 'social':
      return 'people';
    case 'nutrition':
      return 'restaurant';
    case 'creativity':
      return 'palette';
    case 'sleep':
      return 'bedtime';
    case 'hygiene':
      return 'wash';
    case 'finance':
      return 'account-balance-wallet';
    case 'reading':
      return 'menu-book';
    default:
      return 'pets'; // Cat-themed default icon
  }
};

// Calculate current and longest streak for a habit
export const calculateStreak = (habit) => {
  // Check if habit is valid
  if (!habit || !habit.id) {
    console.error('Invalid habit object in calculateStreak:', habit);
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  if (!habit.completedDates || !Array.isArray(habit.completedDates) || habit.completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  // Sort dates in ascending order
  const sortedDates = [...habit.completedDates].sort();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Get today and yesterday in YYYY-MM-DD format
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  // Check if the habit should be completed today
  const shouldCompleteToday = shouldCompleteOnDate(habit, todayStr);
  
  // Calculate longest streak from historical data
  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    
    if (i > 0) {
      const prevDate = new Date(sortedDates[i-1]);
      const diffTime = Math.abs(currentDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Check if dates are consecutive or if the habit wasn't supposed to be completed on missing days
      if (diffDays === 1 || isValidGap(habit, prevDate, currentDate)) {
        tempStreak++;
      } else {
        // Reset streak counter if gap is invalid
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    
    // Update longest streak if current temp streak is longer
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }
  
  // Calculate current streak (backwards from today/yesterday)
  const lastCompletedDate = new Date(sortedDates[sortedDates.length - 1]);
  const lastCompletedStr = lastCompletedDate.toISOString().split('T')[0];
  
  // Current streak is only valid if the last completion was today or yesterday (if habit should be done today)
  if (lastCompletedStr === todayStr || 
      (lastCompletedStr === yesterdayStr && shouldCompleteToday && !habit.completedDates.includes(todayStr))) {
    // Count backwards from the last completed date
    currentStreak = 1;
    let checkDate = new Date(lastCompletedDate);
    
    while (true) {
      // Move to the previous day
      checkDate.setDate(checkDate.getDate() - 1);
      const checkDateStr = checkDate.toISOString().split('T')[0];
      
      // If the habit should be completed on this day, check if it was completed
      if (shouldCompleteOnDate(habit, checkDateStr)) {
        if (habit.completedDates.includes(checkDateStr)) {
          currentStreak++;
        } else {
          // Break the streak if a required day was missed
          break;
        }
      }
      
      // Avoid infinite loops by limiting how far back we check (30 days max)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (checkDate < thirtyDaysAgo) {
        break;
      }
    }
  } else {
    currentStreak = 0;
  }
  
  return { currentStreak, longestStreak };
};

// Helper function to check if a gap between dates is valid based on habit frequency
const isValidGap = (habit, date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Check each date in between
  for (let d = new Date(d1); d < d2; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    // If the habit should have been completed on this date but wasn't, the gap is invalid
    if (shouldCompleteOnDate(habit, dateStr) && !habit.completedDates.includes(dateStr)) {
      return false;
    }
  }
  
  return true;
};