import { ThemedView } from '@/components/themed-view';
import { CircularTimer, CircularTimerRef } from '@/components/circular-timer';
import { Alert, StyleSheet, Pressable, View, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRef, useState } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomeScreen() {
  const timerRef = useRef(null);
  const INITIAL_DURATION = 60; // 60 seconds
  const [timerStatus, setTimerStatus] = useState('Ready');
  const [showModal, setShowModal] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Helper to handle the onComplete prop from the child
  const handleComplete = () => {
    setTimerStatus('Finished! Press Restart.');
    setShowModal(true);
    setIsRunning(false);
  };


  // Helper function to toggle start/pause and update local state
  const handleToggle = () => {
    if (!timerRef.current) return;

    if (isRunning) {
      timerRef.current.pause();
      setIsRunning(false);
      setTimerStatus('Paused');
    } else {
      timerRef.current.start();
      setIsRunning(true);
      setTimerStatus('Running...');
    }
  };

  // Function to handle the restart request
  const handleRestart = () => {
    if (timerRef.current) {
      // 3. This is the crucial line: calling the exposed method via the ref
      timerRef.current.restart(); 
      setIsRunning(true);
      setTimerStatus('Restarted!');
      setShowModal(false);
    }
  };
  const handlePress = () => {
    if (!isRunning) {
      // First time starting
      //setHasStarted(true);
      setIsRunning(true);
    } else {
      // Toggle between running and paused
      setIsRunning(!isRunning);
    }
  };

  const getButtonText = () => {
    if (!isRunning) {
      return 'Start';
    }
    return isRunning ? 'Pause' : 'Resume';
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.homeContainer}>
        <CircularTimer
          ref={timerRef}
          size={250}
          strokeWidth={15}
          duration={INITIAL_DURATION}
          onComplete={handleComplete}
        />
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.button, styles.startButton,
            isRunning && styles.pauseButton
          ]}
          onPress={handleToggle}
        >
          <Text style={styles.buttonText}>{getButtonText()}</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button
          ]}
          onPress={handleRestart}
        >
          <Text style={styles.buttonText}>Restart</Text>
        </Pressable>
      </View>
      </View>
      <View style={styles.bottomLeftButtonContainer}>
        <Pressable onPress={}>
          <FontAwesome name="plus-circle" size={30} color="blue" />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeContainer: {
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  startButton: {
    backgroundColor: '#52db57ff',
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  pauseButton: {
    backgroundColor: '#ff9800',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomLeftButtonContainer: {
    position: 'absolute',
    bottom: 5,
    right: 10,

  },
});

