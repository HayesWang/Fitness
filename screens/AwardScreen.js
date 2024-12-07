import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const AwardScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>奖项页面</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  awardContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  awardImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default AwardScreen;
