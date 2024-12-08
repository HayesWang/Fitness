import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

const YogaWorkoutScreen = () => {
  const [currentPage, setCurrentPage] = useState('SignUp');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({
    latitude: 34.2333,  // XJTU 默认位置
    longitude: 108.9333
  });
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
    })();
  }, []);

  const handleSignUp = async () => {
    setIsLoading(true);
    
    // 等待2秒
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentPage('Success');
    
    // 再等待2秒后返回
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {currentPage === 'SignUp' && (
        <WorkoutCard
          buttonText="Sign Up"
          buttonColor="#F87373"
          onPress={handleSignUp}
          location={location}
          isLoading={isLoading}
        />
      )}
      {currentPage === 'Success' && (
        <WorkoutCard
          buttonText="Success"
          buttonColor="#4CAF50"
          disabled={true}
          location={location}
        />
      )}
    </View>
  );
};

const WorkoutCard = ({ buttonText, buttonColor, onPress, disabled, location, isLoading }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      {/* 顶部关闭按钮和提示 */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
        <View style={styles.topLabel}>
          <Text style={styles.topLabelText}>Sign in for Today's Lesson</Text>
        </View>
      </View>

      {/* 主体内容 */}
      <View style={styles.content}>
        <Image
          source={require('../assets/yoga.gif')}
          style={styles.image}
        />
        <Text style={styles.title}>Yoga Workout</Text>
        <Text style={styles.subTitle}>Building 3</Text>
        <Text style={styles.subTitle}>6th Floor</Text>
        
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              ...location,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          />
        </View>
      </View>

      {/* 底部按钮容器 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.bottomButton,
            { backgroundColor: buttonColor },
            disabled && styles.disabledButton,
          ]}
          onPress={onPress}
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>{buttonText}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 25,
  },
  card: {
    height: 730,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 80,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
  position: 'absolute', // 设置为绝对定位
  top: -30, // 距离父容器顶部 10 像素
  left: -30, // 距离父容器左边 10 像素
  backgroundColor: '#545454',
  borderRadius: 20,
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1, // 提高层级，确保按钮在其他元素上方
},
  closeText: {
    fontSize: 30,
    color: '#F0F0F0',
  },
  topLabel: {
    position: 'absolute',
    top: -35,
    left: '50%',
    transform: [{ translateX: -111 }],
    alignItems: 'center',
    justifyContent: 'center',
    width: 222,
    height: 43,
    flexShrink: 0,
    borderRadius: 30,
    borderWidth: 0,
    borderColor: '#000',
    backgroundColor: '#F87373',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
  topLabelText: {
    backgroundColor: '#F66B61',
    color: '#FFFFFF',
    borderRadius: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1, // 添加 flex: 1 使内容区域可以伸展
  },
  image: {
    width: 254,
    height: 254,
    marginTop: -50,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#000',
    marginTop: -50,
  },
  subTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#5F4F4F',
  },
  mapContainer: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
    width: '80%',
    height: 200,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto', // 使按钮容器自动推到底部
    paddingBottom: 40, // 底部留出一些空间
  },
  bottomButton: {
    width: 150,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F87373',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default YogaWorkoutScreen;