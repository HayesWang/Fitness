import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, Animated, PanResponder } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FreeExercise = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null); // Current user location
  const [routeCoordinates, setRouteCoordinates] = useState([]); // Path coordinate array
  const [distance, setDistance] = useState(0); // Total running distance
  const mapRef = useRef(null); // Map reference
  const [lastValidLocation, setLastValidLocation] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const cardHeight = useRef(new Animated.Value(120)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = 120 - gestureState.dy;
        if (newHeight >= 120 && newHeight <= 250) {
          cardHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Determine whether to expand or collapse based on the swipe direction
        const shouldExpand = gestureState.dy < 0;
        Animated.spring(cardHeight, {
          toValue: shouldExpand ? 250 : 120,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);

  // Add timer logic
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  // Listen for location changes
  useEffect(() => {
    let locationSubscription;

    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限被拒绝', '无法访问位置信息');
        return;
      }

      // 获取初始位置并设置
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      
      // 修改：仅在开始运动时初始化路径
      if (isRunning && routeCoordinates.length === 0) {
        setRouteCoordinates([location.coords]);
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          const currentTime = new Date().getTime();

          setCurrentLocation(newLocation.coords);
          //console.log('当前位置:', { latitude, longitude });

          if (isRunning) {
            setRouteCoordinates(prev => {
              const newCoords = [...prev, newLocation.coords];
              //console.log('轨迹坐标数组:', newCoords);
              
              // 如果有两个或更多点，计算最新两点之间的距离
              if (newCoords.length >= 2) {
                const lastPoint = newCoords[newCoords.length - 2];
                const newPoint = newCoords[newCoords.length - 1];
                
                const segmentDistance = getDistanceFromLatLonInMeters(
                  lastPoint.latitude,
                  lastPoint.longitude,
                  newPoint.latitude,
                  newPoint.longitude
                ) / 1000; // 转换为公里
                
                //console.log('本段距离(km):', segmentDistance);
                
                // 只有当距离大于0.001公里（1米）且小于0.5公里（500米）时才累加
                // 这可以过滤掉GPS抖动和异常值
                if (segmentDistance > 0.001 && segmentDistance < 0.5) {
                  setDistance(prevDistance => {
                    const newTotalDistance = prevDistance + segmentDistance;
                    //console.log('总距离(km):', newTotalDistance);
                    return newTotalDistance;
                  });
                }
              }
              
              return newCoords;
            });

            setLastValidLocation(newLocation.coords);
            setLastUpdateTime(currentTime);
          }

          // 地图视图更新
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.005, // 修改：缩小视图范围以更好地显示轨迹
              longitudeDelta: 0.005,
            }, 500);
          }
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, [isRunning]); // 修改：仅依赖 isRunning

  // New: Verify whether the location update is valid
  const isValidLocationUpdate = (newCoords, currentTime) => {
    if (!lastValidLocation || !lastUpdateTime) {
      return true;
    }

    // Calculate the distance between the last valid location and the new location (meters)
    const distance = getDistanceFromLatLonInMeters(
      lastValidLocation.latitude,
      lastValidLocation.longitude,
      newCoords.latitude,
      newCoords.longitude
    );

    // Calculate the time difference (seconds)
    const timeDiff = (currentTime - lastUpdateTime) / 1000;

    // Calculate the speed (meters/second)
    const speed = distance / timeDiff;

    // Filter conditions:
    // 1. The distance must be greater than 2 meters (to filter out minor jitter)
    // 2. The speed must be less than 8.33 meters/second (approximately 30 km/h)
    // 3. The speed must be greater than 0.5 meters/second (approximately 1.8 km/h)
    return distance > 2 && speed < 8.33 && speed > 0.5;
  };

  // Calculate the distance between two points (unit: meters)
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius (meters)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Return distance (meters)
  };

  // Modify the processing function of the start/pause button
  const handleRunningState = () => {
    if (!isRunning) {
      // 只有在第一次开始运动时才重置数据
      if (routeCoordinates.length === 0) {
        // 首次开始运动
        setRouteCoordinates([]);
        setDistance(0);
        setLastValidLocation(null);
        setLastUpdateTime(null);
        setStartTime(new Date());
        setDuration(0);
      }
      // 否则继续使用现有的数据
    }
    setIsRunning(!isRunning);
    
    // 自动折叠状态栏
    Animated.spring(cardHeight, {
      toValue: 120,
      useNativeDriver: false,
    }).start();
  };

  // Save exercise record
  const saveExerciseRecord = async () => {
    try {
      const newRecord = {
        id: Date.now().toString(),
        date: startTime.toISOString(),
        distance,
        duration,
        route: routeCoordinates,
      };

      // Get existing records
      const existingRecords = await AsyncStorage.getItem('exerciseRecords');
      const records = existingRecords ? JSON.parse(existingRecords) : [];

      // Add new record
      records.unshift(newRecord);

      // Save updated records
      await AsyncStorage.setItem('exerciseRecords', JSON.stringify(records));

      // Navigate to the exercise history page
      navigation.navigate('ExerciseHistory');
    } catch (error) {
      console.error('Failed to save exercise record:', error);
      Alert.alert('Error', 'Failed to save exercise record');
    }
  };

  // Modify the processing function of ending exercise
  const handleEndExercise = () => {
    Alert.alert(
      'End Exercise',
      'Are you sure you want to end this exercise?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Save and End',
          onPress: async () => {
            setIsRunning(false);
            await saveExerciseRecord();
          }
        }
      ]
    );
  };

  // Add the processing function for returning
  const handleGoBack = () => {
    if (isRunning) {
      Alert.alert(
        'End Exercise',
        'Exercise is in progress, are you sure you want to end?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Confirm',
            onPress: () => {
              setIsRunning(false);
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Modify the click processing of the return button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleGoBack}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Map */}
      <MapView
        ref={mapRef} // Bind map reference
        style={styles.map}
        initialRegion={{
          latitude: currentLocation ? currentLocation.latitude : 0,
          longitude: currentLocation ? currentLocation.longitude : 0,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {routeCoordinates.length >= 2 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={3}
            strokeColor="#007AFF"
            lineDashPattern={[0]} // 添加：确保线条为实线
          />
        )}
      </MapView>

      {/* Status card */}
      <Animated.View
        style={[
          styles.statusCard,
          {
            height: cardHeight,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragIndicator} />
        <Card.Content>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Distance</Text>
              <Text style={styles.statValue}>{distance.toFixed(2)} km</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Time</Text>
              <Text style={styles.statValue}>
                {`${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`}
              </Text>
            </View>
          </View>
          
          <Animated.View
            style={{
              opacity: cardHeight.interpolate({
                inputRange: [120, 250],
                outputRange: [0, 1],
              }),
            }}
          >
            <TouchableOpacity
              style={styles.runButton}
              onPress={handleRunningState}
            >
              <Text style={styles.runButtonText}>
                {isRunning ? 'Pause Exercise' : (routeCoordinates.length > 0 ? 'Resume Exercise' : 'Start Exercise')}
              </Text>
            </TouchableOpacity>

            {/* Add end exercise button, only visible when paused */}
            {!isRunning && routeCoordinates.length > 0 && (
              <TouchableOpacity
                style={[styles.runButton, styles.endButton]}
                onPress={handleEndExercise}
              >
                <Text style={styles.runButtonText}>End Exercise</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </Card.Content>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  statusCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#DDDDDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  runButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  runButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  endButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statTitle: {
    marginTop: 10,
    fontSize: 18,
    color: 'gray',
    fontWeight: '600',
    alignSelf: 'left',
  },
  statValue: {
    fontSize: 37,
    color: '#black',
    fontWeight: 'bold',
    alignSelf: 'left',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#DDDDDD',
    marginHorizontal: 10,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
});

export default FreeExercise;