import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const YogaWorkoutApp = () => {
  const [currentPage, setCurrentPage] = useState('SignUp'); // 当前页面状态

  const handleSignUp = () => setCurrentPage('Login');
  const handleLogin = () => setCurrentPage('Success');

  return (
    <View style={styles.container}>
      {currentPage === 'SignUp' && (
        <WorkoutCard
          buttonText="Sign Up"
          buttonColor="#7E57C2"
          onPress={handleSignUp}
        />
      )}
      {currentPage === 'Login' && (
        <WorkoutCard
          buttonText=" "
          buttonColor="#7E57C2"
          toggle={true}
          onPress={handleLogin}
        />
      )}
      {currentPage === 'Success' && (
        <WorkoutCard
          buttonText="Success"
          buttonColor="#4CAF50"
          disabled={true}
        />
      )}
    </View>
  );
};

const WorkoutCard = ({ buttonText, buttonColor, onPress, toggle, disabled }) => (
  <View style={styles.card}>
    <TouchableOpacity style={styles.closeButton}>
      <Text style={styles.closeText}>×</Text>
    </TouchableOpacity>
    <Text style={styles.header}>Yoga Workout</Text>
    <Text style={styles.location}>Building 3{"\n"}6th Floor</Text>
    <Image
      style={styles.mapImage}
      source={{ uri: 'https://via.placeholder.com/300x150.png?text=Map+Placeholder' }} // 替换成你的地图图片
    />
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: buttonColor },
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {toggle ? <View style={styles.toggle} /> : <Text style={styles.buttonText}>{buttonText}</Text>}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    textAlign: 'center',
    color: '#757575',
    marginBottom: 20,
  },
  mapImage: {
    width: 300,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default YogaWorkoutApp;
