import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, CARD_STYLES } from '../utils/theme';

const MOODS = [
  { id: 'great', icon: 'sentiment-very-satisfied', label: 'Great', color: '#4CAF50' },
  { id: 'good', icon: 'sentiment-satisfied', label: 'Good', color: '#8BC34A' },
  { id: 'okay', icon: 'sentiment-neutral', label: 'Okay', color: '#FFC107' },
  { id: 'bad', icon: 'sentiment-dissatisfied', label: 'Bad', color: '#FF9800' },
  { id: 'awful', icon: 'sentiment-very-dissatisfied', label: 'Awful', color: '#F44336' },
];

const MoodTracker = () => {
  const { userData, saveUserData } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [todaysMood, setTodaysMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  
  // Animation value for the card
  const scaleAnim = new Animated.Value(1);
  
  useEffect(() => {
    // Load mood data from user settings
    if (userData && userData.moodHistory) {
      setMoodHistory(userData.moodHistory);
      
      // Check if there's a mood entry for today
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = userData.moodHistory.find(entry => entry.date === today);
      if (todayEntry) {
        setTodaysMood(todayEntry.mood);
      }
    }
  }, [userData]);
  
  const handleOpenModal = () => {
    setModalVisible(true);
  };
  
  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
    
    // Animate the selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const handleSaveMood = () => {
    if (!selectedMood) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Create new mood entry
    const newMoodEntry = {
      date: today,
      mood: selectedMood,
      timestamp: new Date().toISOString(),
    };
    
    // Update mood history
    let updatedHistory = [...moodHistory];
    
    // Remove today's entry if it exists
    updatedHistory = updatedHistory.filter(entry => entry.date !== today);
    
    // Add new entry
    updatedHistory.unshift(newMoodEntry);
    
    // Keep only the last 30 days
    updatedHistory = updatedHistory.slice(0, 30);
    
    // Update state
    setMoodHistory(updatedHistory);
    setTodaysMood(selectedMood);
    
    // Save to user data
    const updatedUserData = {
      ...userData,
      moodHistory: updatedHistory,
    };
    
    saveUserData(updatedUserData);
    setModalVisible(false);
    setSelectedMood(null);
  };
  
  const getMoodIcon = (moodId) => {
    const mood = MOODS.find(m => m.id === moodId);
    return mood ? mood.icon : 'sentiment-neutral';
  };
  
  const getMoodColor = (moodId) => {
    const mood = MOODS.find(m => m.id === moodId);
    return mood ? mood.color : COLORS.textMuted;
  };
  
  const getMoodLabel = (moodId) => {
    const mood = MOODS.find(m => m.id === moodId);
    return mood ? mood.label : 'Unknown';
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Today's Mood</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleOpenModal}
        >
          {todaysMood ? (
            <Icon name="edit" size={24} color={COLORS.primary} />
          ) : (
            <Icon name="add" size={24} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
      
      {todaysMood ? (
        <View style={styles.moodDisplay}>
          <Icon 
            name={getMoodIcon(todaysMood)} 
            size={48} 
            color={getMoodColor(todaysMood)} 
          />
          <Text style={styles.moodLabel}>{getMoodLabel(todaysMood)}</Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.emptyContainer}
          onPress={handleOpenModal}
        >
          <Text style={styles.emptyText}>How are you feeling today?</Text>
          <Text style={styles.tapText}>Tap to record your mood</Text>
        </TouchableOpacity>
      )}
      
      {/* Mood Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>How are you feeling today?</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.moodOptions}>
              {MOODS.map((mood) => (
                <TouchableOpacity 
                  key={mood.id}
                  style={[
                    styles.moodOption,
                    selectedMood === mood.id && styles.selectedMoodOption
                  ]}
                  onPress={() => handleSelectMood(mood.id)}
                >
                  <Animated.View
                    style={[
                      selectedMood === mood.id && { transform: [{ scale: scaleAnim }] }
                    ]}
                  >
                    <Icon name={mood.icon} size={40} color={mood.color} />
                  </Animated.View>
                  <Text style={styles.moodOptionLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={[
                styles.saveButton,
                !selectedMood && styles.disabledButton
              ]}
              onPress={handleSaveMood}
              disabled={!selectedMood}
            >
              <Text style={styles.saveButtonText}>Save Mood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.spacingMedium,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacingSmall,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  addButton: {
    padding: SIZES.spacingSmall,
  },
  moodDisplay: {
    ...CARD_STYLES.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacingLarge,
  },
  moodLabel: {
    ...FONTS.h3,
    color: COLORS.text,
    marginLeft: SIZES.spacingMedium,
  },
  emptyContainer: {
    ...CARD_STYLES.card,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.spacingLarge,
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.spacingSmall,
  },
  tapText: {
    ...FONTS.body3,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.borderRadiusLarge,
    borderTopRightRadius: SIZES.borderRadiusLarge,
    padding: SIZES.spacingLarge,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacingMedium,
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  closeButton: {
    padding: SIZES.spacingSmall,
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginVertical: SIZES.spacingLarge,
  },
  moodOption: {
    alignItems: 'center',
    width: '18%',
    marginBottom: SIZES.spacingMedium,
  },
  selectedMoodOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.borderRadius,
    padding: SIZES.spacingSmall,
  },
  moodOptionLabel: {
    ...FONTS.caption,
    color: COLORS.text,
    marginTop: SIZES.spacingSmall,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.spacingMedium,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    marginTop: SIZES.spacingMedium,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
  },
  saveButtonText: {
    ...FONTS.body2,
    color: COLORS.white,
  },
});

export default MoodTracker;