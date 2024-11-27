import React, { useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Rubik_400Regular, Rubik_800ExtraBold_Italic, Rubik_500Medium_Italic } from '@expo-google-fonts/rubik';
import * as SplashScreen from 'expo-splash-screen';
import { COLORS } from '../constants/assets';

export default function FreeExerciseScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    'Rubik_400Regular': Rubik_400Regular,
    'Rubik_800ExtraBold_Italic': Rubik_800ExtraBold_Italic,
    'Rubik_500Medium_Italic': Rubik_500Medium_Italic,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.progressSection}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Your</Text>
            <Text style={styles.headerTitle}>Semester Progress</Text>
          </View>
          <Text style={styles.progressNumber}>25</Text>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        <Text style={styles.newExerciseTitle}>New Exercise</Text>
        <TouchableOpacity style={styles.routeCard}>
          <Text style={styles.cardTitle}>Preset Route</Text>
          <Text style={styles.cardSubtitle}>Follow certain route at 2km</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.freeCard}>
          <Text style={styles.cardTitle}>Free Exercise</Text>
          <Text style={styles.cardSubtitle}>Exercise freely at 3km</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  progressSection: {
    height: 130,
    width: 393,
    flexShrink: 0,
    padding: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  cardsContainer: {
    marginTop: 20,
    width: 336,
    height: 640,
    flexShrink: 0,
    backgroundColor: '#FFF',
    borderRadius: 20,
    alignSelf: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1000,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Rubik_400Regular',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 28,
    color: 'white',
    lineHeight: 34,
    fontFamily: 'Rubik_800ExtraBold_Italic',
  },
  progressNumber: {
    fontSize: 48,
    color: 'white',
    fontFamily: 'Rubik_400Regular',
  },
  newExerciseTitle: {
    fontFamily: 'Rubik_800ExtraBold_Italic',
    fontSize: 32,
    marginBottom: 20,
  },
  routeCard: {
    backgroundColor: '#FFF1F1',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  freeCard: {
    backgroundColor: '#F1F8FF',
    borderRadius: 15,
    padding: 20,
  },
  cardTitle: {
    fontSize: 24,
    marginBottom: 8,
    fontFamily: 'Rubik_500Medium_Italic',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Rubik_400Regular',
  },
});
  