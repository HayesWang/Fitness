import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const AwardScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Awards</Text>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/Awards.png')}
          style={styles.longImage}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginTop: 22,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  imageContainer: {
    alignItems: 'center',
  },
  longImage: {
    width: 390,
    height: 950,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 17,
    zIndex: 1,
  },
});

export default AwardScreen;
