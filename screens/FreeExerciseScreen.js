import React, { useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Rubik_400Regular, Rubik_800ExtraBold_Italic, Rubik_500Medium_Italic } from '@expo-google-fonts/rubik';
import * as SplashScreen from 'expo-splash-screen';
import { COLORS, IMAGES } from '../constants/assets';

const { route, free } = IMAGES.gifs;

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
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Your</Text>
            <Text style={styles.headerTitle}>Semester Progress</Text>
          </View>
          <Text style={styles.progressNumber}>25</Text>
        </View>
      </View>
      <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.newExerciseTitle}>New</Text>
            <Text style={styles.newExerciseTitle}>Exercise</Text>
          </View>
          <Image 
            source={IMAGES.functionCards.exercise}
            style={styles.exerciseImage}
          />
        </View>
        <TouchableOpacity style={styles.routeCard}>
          <Text style={styles.cardTitle}>Preset Route</Text>
          <Text style={styles.cardSubtitle}>Follow certain route at 2km</Text>
          <Image source={route} style={styles.cardGif} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.freeCard}>
          <Text style={styles.cardTitle}>Free Exercise</Text>
          <Text style={styles.cardSubtitle}>Exercise freely at 3km</Text>
          <Image source={free} style={styles.cardGif} />
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
    height: 170,
    width: 393,
    flexShrink: 0,
    padding: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    marginTop: -60,
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
    overflow: 'visible',
  },
  closeButton: {
    position: 'absolute',
    top: 170,
    left: 10,
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1000,
  },
  closeButtonText: {
    fontSize: 25,
    color: 'white',
    fontFamily: 'Rubik_400Regular',
  },
  headerContent: {
    marginTop: 50,
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  newExerciseTitle: {
    fontFamily: 'Rubik_800ExtraBold_Italic',
    fontSize: 32,
  },
  exerciseImage: {
    width: 205,
    height: 205,
    resizeMode: 'contain',
    position: 'absolute',
    right: -20,
    top: -70,
  },
  routeCard: {
    width: 280,
    height: 169,
    flexShrink: 0,
    backgroundColor: '#F6E5E5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    marginTop: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'visible',
    position: 'relative',
  },
  freeCard: {
    width: 280,
    height: 169,
    flexShrink: 0,
    backgroundColor: '#F8D9C7',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'visible',
    position: 'relative',
  },
  cardTitle: {
    fontSize: 24,
    marginTop: 70,
    marginBottom: 8,
    fontFamily: 'Rubik_500Medium_Italic',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Rubik_400Regular',
  },
  cardGif: {
    width: 128,
    height: 128,
    position: 'absolute',
    right: -20,
    top: -20,
    zIndex: 1,
  },
});
  