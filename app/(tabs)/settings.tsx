import { Image } from 'expo-image';
import { Platform, StyleSheet, Text } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { globalStyles } from '@/constants/styles';
import { Link } from 'expo-router';

export default function SettingsScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(237, 255, 243, 0.47)' }}>
      <Text style={globalStyles.text}>Settings</Text>
    </ThemedView>
  );
}
