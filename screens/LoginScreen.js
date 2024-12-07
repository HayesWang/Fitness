import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const setLoginStatus = async (isLoggedIn) => {
    try {
      await AsyncStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    } catch (error) {
      console.error('存储登录状态失败:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to{"\n"}XJTU</Text>
      <Image
        source={require("../assets/XJTU2.png")}
        style={styles.image}
      />
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>Welcome to XJTU</Text>
      <LoginModal visible={isModalVisible} onClose={closeModal} setLoginStatus={setLoginStatus} />
    </View>
  );
};

const LoginModal = ({ visible, onClose, setLoginStatus }) => {
  const [idText, setIdText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [phoneNumberText, setPhoneNumberText] = useState('');
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const navigation = useNavigation();

  const handleLoginPress = async () => {
    alert("Login pressed");
    await setLoginStatus(true);
    onClose();
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  const handlePhoneNumberPress = () => {
    setIsPhoneNumber(!isPhoneNumber);
    setIdText('');
    setPasswordText('');
    setPhoneNumberText('');
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <View style={styles.closeIcon}>
              <View style={styles.line1} />
              <View style={styles.line2} />
              <View style={styles.closeButtonArea} />
            </View>
          </TouchableOpacity>
          <Text style={styles.loginText}>Login</Text>
          <TextInput
            style={styles.inputBox}
            value={isPhoneNumber ? phoneNumberText : idText}
            onChangeText={isPhoneNumber ? setPhoneNumberText : setIdText}
            placeholder={isPhoneNumber ? "Phone number" : "ID"}
            placeholderTextColor="#717171"
          />
          <TextInput
            style={styles.inputBox}
            value={passwordText}
            onChangeText={setPasswordText}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#717171"
          />
          <TouchableOpacity style={styles.buttonIn} onPress={handleLoginPress}>
            <Text style={styles.buttonTextIn}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.phoneNumberText} onPress={handlePhoneNumberPress}>
            {isPhoneNumber ? 'use student ID' : 'use phone number'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4744F1',
  },
  header: {
    marginTop:60,
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight:70
  },
  image: {
    width: 330, 
    height: 330, 
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:60
  },
  buttonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4744F1',
  },
  footer: {
    fontSize: 20,
    color: 'white',
    marginTop: 100,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 332,
    height: 304,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 17,
    right: 17,
    width: 45,
    height: 45,
    backgroundColor: '#D9D9D9',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  line1: {
    width: 18.5,
    height: 2,
    backgroundColor: '#B6B6B6',
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  line2: {
    width: 18.5,
    height: 2,
    backgroundColor: '#B6B6B6',
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
  },
  loginText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#717171',
    marginBottom: 20,
  },
  inputBox: {
    width: 270,
    height: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 15,
  },
  buttonIn: {
    backgroundColor: '#4744F1',
    borderRadius: 15,
    width:160,
    height:60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    marginTop:0
  },
  buttonTextIn: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  phoneNumberText: {
    fontSize: 16,
    color: '#717171',
    marginTop: 8,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
