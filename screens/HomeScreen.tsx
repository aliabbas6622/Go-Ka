import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#f0e6ff', '#e6d9ff', '#d9c3ff']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Sparkle elements */}
          <View style={[styles.sparkle, { top: '10%', right: '15%' }]} />
          <View style={[styles.sparkle, { bottom: '30%', left: '10%' }]} />
          
          {/* AI Bot Avatar */}
          <View style={styles.botAvatarContainer}>
            <LinearGradient
              colors={['#9370DB', '#8A2BE2']}
              style={styles.botAvatarOuter}
            >
              <LinearGradient
                colors={['#9370DB', '#8A2BE2']}
                style={styles.botAvatarInner}
              >
                <View style={styles.botEyesContainer}>
                  <View style={styles.botEye} />
                  <View style={styles.botEye} />
                </View>
              </LinearGradient>
            </LinearGradient>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeText}>
              Welc<Text style={styles.highlightedText}>o</Text>me
            </Text>
            <Text style={styles.futureText}>to the future!</Text>
            <Text style={styles.descriptionText}>
              An intelligent platform built to unlock new potential
              —seamlessly, powerfully, and human-first.
            </Text>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sparkle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    opacity: 0.8,
  },
  botAvatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  botAvatarOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  botAvatarInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  botEyesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  botEye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 5,
  },
  welcomeTextContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#666',
    marginBottom: 5,
  },
  highlightedText: {
    color: '#8A2BE2',
    fontWeight: '500',
  },
  futureText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 22,
  },
  getStartedButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8A2BE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: 'white',
    fontSize: 14,
  },
});