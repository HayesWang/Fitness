import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/assets';

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>我的</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ExerciseHistory')}
      >
        <Text style={styles.buttonText}>运动历史</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  title: {
    fontSize: SIZES.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    padding: SIZES.padding.large,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding.medium,
    borderRadius: 8,
    marginHorizontal: SIZES.padding.large,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSize.medium,
    fontWeight: '600',
  },
});
