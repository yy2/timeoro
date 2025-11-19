import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { ThemedText } from './themed-text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface CircularTimerRef {
  restart: () => void;
  start: () => void;
  pause: () => void;
}

interface CircularTimerProps {
  size: number;
  strokeWidth: number;
  duration: number;
  onComplete: () => void;
}

export const CircularTimer = forwardRef<CircularTimerRef, CircularTimerProps>(
  ({ size, strokeWidth, duration, onComplete }, ref) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const INITIAL_DURATION = duration;
    
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(INITIAL_DURATION);
    const [endTime, setEndTime] = useState<number | null>(null); // When timer should finish

    const progress = useSharedValue(1);

    const animatedProps = useAnimatedProps(() => ({
      strokeDashoffset: circumference * (1 - progress.value),
    }));

    // Handle app state changes (background/foreground)
    useEffect(() => {
      const subscription = AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'active' && isRunning && endTime) {
          // App came back to foreground - recalculate time left
          const now = Date.now();
          const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
          setTimeLeft(remaining);
          
          if (remaining <= 0) {
            setIsRunning(false);
            setEndTime(null);
            onComplete();
          }
        }
      });

      return () => {
        subscription.remove();
      };
    }, [isRunning, endTime, onComplete]);

    // Main timer effect
    useEffect(() => {
      let interval = null;
      
      if (isRunning && timeLeft > 0) {
        // Calculate current progress based on time left
        const currentProgress = timeLeft / INITIAL_DURATION;
        progress.value = currentProgress;
        
        // Animate from current to 0 over remaining time
        progress.value = withTiming(0, {
          duration: timeLeft * 1000,
          easing: Easing.linear,
        });
        
        interval = setInterval(() => {
          const now = Date.now();
          
          if (endTime) {
            const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
            setTimeLeft(remaining);
            
            if (remaining <= 0) {
              clearInterval(interval);
              setIsRunning(false);
              setEndTime(null);
              onComplete();
              progress.value = 0;
            }
          }
        }, 100); // Check more frequently for accuracy
        
      } else if (!isRunning && timeLeft > 0) {
        // When paused, snap progress to match current time
        const currentProgress = timeLeft / INITIAL_DURATION;
        progress.value = currentProgress;
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isRunning, timeLeft, INITIAL_DURATION, onComplete, endTime]);

    useImperativeHandle(ref, () => ({
      start: () => {
        if (timeLeft > 0 && !isRunning) {
          const now = Date.now();
          setEndTime(now + (timeLeft * 1000));
          setIsRunning(true);
        }
      },
      pause: () => {
        setIsRunning(false);
        setEndTime(null);
      },
      restart: () => {
        const now = Date.now();
        setTimeLeft(INITIAL_DURATION);
        setEndTime(now + (INITIAL_DURATION * 1000));
        setIsRunning(true);
        progress.value = 1.0;
      },
    }));

    return (
      <View style={styles.container}>
        <View
          style={{
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
          }}
        >
          <Svg width={size} height={size} style={{ position: 'absolute' }}>
            <Circle
              stroke="#e6e7e8"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <AnimatedCircle
              stroke="#3498db"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              animatedProps={animatedProps}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <ThemedText
            style={{
              fontSize: size / 4,
              lineHeight: (size / 4) * 1.3,
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {timeLeft}
          </ThemedText>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
