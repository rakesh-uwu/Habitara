import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, CARD_STYLES } from '../utils/theme';

const UserNotes = () => {
  const { userNotes, addUserNote, deleteUserNote } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isVoiceNote, setIsVoiceNote] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // idle, recording, recorded
  const [recordTime, setRecordTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  
  // Timer ref for simulating recording
  const recordingTimerRef = useRef(null);
  const recordingStartTimeRef = useRef(0);
  
  // Animation value for the card
  const fadeAnim = new Animated.Value(1);
  
  useEffect(() => {
    // Pulse animation for the notes
    const pulseAnimation = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]);
    
    // Start the animation and loop it
    Animated.loop(pulseAnimation).start();
    
    return () => {
      fadeAnim.stopAnimation();
      // Clear any timers when component unmounts
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);
  
  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAddNote = () => {
    if (isVoiceNote) {
      // Add voice note
      if (recordingStatus !== 'recorded') {
        Alert.alert('Error', 'Please record a voice note first');
        return;
      }
      
      const newNote = {
        id: Date.now().toString(),
        content: `Voice Note (${duration})`,
        type: 'voice',
        createdAt: new Date().toISOString(),
        duration: duration
      };
      
      addUserNote(newNote);
      setModalVisible(false);
      setNoteText('');
      setIsVoiceNote(false);
      setRecordingStatus('idle');
      setRecordTime('00:00');
      setDuration('00:00');
    } else {
      // Add text note
      if (noteText.trim() === '') {
        Alert.alert('Error', 'Please enter a note');
        return;
      }
      
      const newNote = {
        id: Date.now().toString(),
        content: noteText,
        type: 'text',
        createdAt: new Date().toISOString(),
        duration: null
      };
      
      addUserNote(newNote);
      setModalVisible(false);
      setNoteText('');
    }
  };
  
  const handleDeleteNote = (noteId) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteUserNote(noteId)
        }
      ]
    );
  };
  
  const handleVoiceRecording = () => {
    setIsVoiceNote(true);
    
    if (recordingStatus === 'idle') {
      // Start simulated recording
      setRecordingStatus('recording');
      recordingStartTimeRef.current = Date.now();
      
      // Start a timer to update the recording time
      recordingTimerRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
        setRecordTime(formatTime(elapsedSeconds));
      }, 1000);
    } else if (recordingStatus === 'recording') {
      // Stop recording
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      setRecordingStatus('recorded');
      setDuration(recordTime);
    } else if (recordingStatus === 'recorded') {
      // Simulate playing the recording
      Alert.alert('Playing Recording', `Playing voice note (${duration})`);
    }
  };
  
  const renderNoteItem = ({ item }) => (
    <Animated.View 
      style={[styles.noteItem, { opacity: fadeAnim }]}
    >
      <View style={styles.noteContent}>
        {item.type === 'voice' ? (
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="mic" size={20} color={COLORS.primary} />
              <Text style={styles.voiceNoteText}>{item.content}</Text>
            </View>
            {item.type === 'voice' && (
              <TouchableOpacity 
                style={[styles.playButton, {paddingVertical: 4, paddingHorizontal: 8}]}
                onPress={() => {
                  // Simulate playing the recording
                  Alert.alert('Playing Recording', `Playing voice note (${item.duration || '00:00'})`);
                }}
              >
                <Icon name="play-arrow" size={16} color={COLORS.white} />
                <Text style={{...styles.playButtonText, fontSize: SIZES.small}}>Play</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.noteText}>{item.content}</Text>
        )}
        <Text style={styles.noteDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteNote(item.id)}
      >
        <Icon name="close" size={16} color={COLORS.error} />
      </TouchableOpacity>
    </Animated.View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>My Notes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {userNotes && userNotes.length > 0 ? (
        <FlatList
          data={userNotes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.notesList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notes yet. Add your first note!</Text>
        </View>
      )}
      
      {/* Add Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isVoiceNote ? 'Record Voice Note' : 'Add Note'}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            {!isVoiceNote ? (
              <TextInput
                style={styles.noteInput}
                placeholder="Enter your note here..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                value={noteText}
                onChangeText={setNoteText}
              />
            ) : (
              <View style={styles.recordingContainer}>
                <View style={[
                  styles.recordingIndicator,
                  recordingStatus === 'recording' && styles.recordingActive
                ]} />
                <Text style={styles.recordingText}>
                  {recordingStatus === 'idle' && 'Press the microphone to start recording'}
                  {recordingStatus === 'recording' && `Recording... ${recordTime}`}
                  {recordingStatus === 'recorded' && `Recording complete! (${duration})`}
                </Text>
                
                {recordingStatus === 'recorded' && (
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={handleVoiceRecording}
                  >
                    <Icon name="play-arrow" size={24} color={COLORS.white} />
                    <Text style={styles.playButtonText}>Play</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  setIsVoiceNote(!isVoiceNote);
                  if (isVoiceNote) {
                    setRecordingStatus('idle');
                  }
                }}
              >
                <Icon 
                  name={isVoiceNote ? 'text-fields' : 'mic'} 
                  size={24} 
                  color={COLORS.primary} 
                />
                <Text style={styles.actionText}>
                  {isVoiceNote ? 'Switch to Text' : 'Switch to Voice'}
                </Text>
              </TouchableOpacity>
              
              {isVoiceNote && (
                <TouchableOpacity 
                  style={[styles.recordButton, 
                    recordingStatus === 'recording' && styles.stopButton
                  ]}
                  onPress={handleVoiceRecording}
                >
                  <Icon 
                    name={recordingStatus === 'recording' ? 'stop' : 'mic'} 
                    size={24} 
                    color={COLORS.white} 
                  />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.saveButton, 
                  (noteText.trim() === '' && !isVoiceNote) || 
                  (isVoiceNote && recordingStatus === 'idle') ? 
                    styles.disabledButton : {}
                ]}
                onPress={handleAddNote}
                disabled={(noteText.trim() === '' && !isVoiceNote) || 
                  (isVoiceNote && recordingStatus === 'idle')}
              >
                <Text style={styles.saveButtonText}>Save Note</Text>
              </TouchableOpacity>
            </View>
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
  notesList: {
    paddingVertical: SIZES.spacingSmall,
  },
  noteItem: {
    ...CARD_STYLES.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: SIZES.spacingMedium,
    width: 250,
  },
  noteContent: {
    flex: 1,
  },
  noteText: {
    ...FONTS.body3,
    color: COLORS.text,
    marginBottom: SIZES.spacingSmall,
  },
  noteDate: {
    ...FONTS.caption,
    color: COLORS.textMuted,
  },
  deleteButton: {
    padding: SIZES.spacingSmall,
  },
  emptyContainer: {
    ...CARD_STYLES.card,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.spacingLarge,
  },
  emptyText: {
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
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: SIZES.spacingSmall,
  },
  noteText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacingSmall,
  },
  voiceNoteText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginLeft: SIZES.spacingSmall,
  },
  noteInput: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.spacingMedium,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  recordingContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.spacingMedium,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.textMuted,
    marginBottom: SIZES.spacingMedium,
  },
  recordingActive: {
    backgroundColor: COLORS.error,
  },
  recordingText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.spacingMedium,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginLeft: SIZES.spacingSmall,
  },
  recordButton: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.spacingSmall,
    paddingHorizontal: SIZES.spacingMedium,
    borderRadius: SIZES.borderRadius,
    marginTop: SIZES.spacingMedium,
  },
  playButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    marginLeft: SIZES.spacingSmall,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.spacingSmall,
    paddingHorizontal: SIZES.spacingMedium,
    borderRadius: SIZES.borderRadius,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
  },
  saveButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
});

export default UserNotes;