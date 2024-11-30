import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, Animated, PanResponder } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FreeExercise = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null); // 当前用户位置
  const [routeCoordinates, setRouteCoordinates] = useState([]); // 路径坐标数组
  const [distance, setDistance] = useState(0); // 跑步总距离
  const mapRef = useRef(null); // 地图引用
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
        // 根据滑动方向决定展开或收起
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

  // 添加计时器逻辑
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

  // 监听位置变化
  useEffect(() => {
    let locationSubscription;

    const startTracking = async () => {
      // 请求位置权限
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限被拒绝', '无法访问位置数据');
        return;
      }

      // 获取当前位置
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      
      // 只有在开始运动时才初始化路径
      if (isRunning) {
        setRouteCoordinates([location.coords]);
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          const currentTime = new Date().getTime();

          // 更新当前位置
          setCurrentLocation(newLocation.coords);

          // 只在运动状态下记录轨迹和计算距离
          if (isRunning && isValidLocationUpdate(newLocation.coords, currentTime)) {
            setRouteCoordinates(prev => [...prev, newLocation.coords]);
            
            if (lastValidLocation) {
              const newDistance = getDistanceFromLatLonInMeters(
                lastValidLocation.latitude,
                lastValidLocation.longitude,
                latitude,
                longitude
              ) / 1000;
              setDistance(prevDistance => prevDistance + newDistance);
            }

            setLastValidLocation(newLocation.coords);
            setLastUpdateTime(currentTime);
          }

          // 地图视图更新
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 500);
          }
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, [lastValidLocation, lastUpdateTime, isRunning]); // 添加 isRunning 作为依赖

  // 新增：验证位置更新是否有效
  const isValidLocationUpdate = (newCoords, currentTime) => {
    if (!lastValidLocation || !lastUpdateTime) {
      return true;
    }

    // 计算与上一个有效位置的距离（米）
    const distance = getDistanceFromLatLonInMeters(
      lastValidLocation.latitude,
      lastValidLocation.longitude,
      newCoords.latitude,
      newCoords.longitude
    );

    // 计算时间差（秒）
    const timeDiff = (currentTime - lastUpdateTime) / 1000;

    // 计算速度（米/秒）
    const speed = distance / timeDiff;

    // 过滤条件：
    // 1. 距离必须大于 2 米（过滤掉微小抖动）
    // 2. 速度必须小于 8.33 米/秒（约 30 公里/小时）
    // 3. 速度必须大于 0.5 米/秒（约 1.8 公里/小时）
    return distance > 2 && speed < 8.33 && speed > 0.5;
  };

  // 计算两点之间的距离（单位：米）
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // 地球半径（米）
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 返回距离（米）
  };

  // 修改开始/暂停按钮的处理函数
  const handleRunningState = () => {
    if (!isRunning) {
      // 开始运动时重置数据
      setRouteCoordinates([]);
      setDistance(0);
      setLastValidLocation(null);
      setLastUpdateTime(null);
      setStartTime(new Date());
      setDuration(0);
      // 开始运动时自动收起状态栏
      Animated.spring(cardHeight, {
        toValue: 120,
        useNativeDriver: false,
      }).start();
    }
    setIsRunning(!isRunning);
  };

  // 保存运动记录
  const saveExerciseRecord = async () => {
    try {
      const newRecord = {
        id: Date.now().toString(),
        date: startTime.toISOString(),
        distance,
        duration,
        route: routeCoordinates,
      };

      // 获取现有记录
      const existingRecords = await AsyncStorage.getItem('exerciseRecords');
      const records = existingRecords ? JSON.parse(existingRecords) : [];

      // 添加新记录
      records.unshift(newRecord);

      // 保存更新后的记录
      await AsyncStorage.setItem('exerciseRecords', JSON.stringify(records));

      // 导航到运动历史页面
      navigation.navigate('ExerciseHistory');
    } catch (error) {
      console.error('保存运动记录失败:', error);
      Alert.alert('错误', '保存运动记录失败');
    }
  };

  // 修改结束运动的处理函数
  const handleEndExercise = () => {
    Alert.alert(
      '结束运动',
      '确定要结束本次运动吗？',
      [
        {
          text: '取消',
          style: 'cancel'
        },
        {
          text: '保存并结束',
          onPress: async () => {
            setIsRunning(false);
            await saveExerciseRecord();
          }
        }
      ]
    );
  };

  // 添加处理返回的函数
  const handleGoBack = () => {
    if (isRunning) {
      Alert.alert(
        '结束运动',
        '运动正在进行中，确定要结束吗？',
        [
          {
            text: '取消',
            style: 'cancel'
          },
          {
            text: '确定',
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
      {/* 修改返回按钮的点击处理 */}
      <View style={styles.closeButton}>
        <TouchableOpacity 
          onPress={handleGoBack}
          style={styles.closeButtonTouchable}
        >
          <Text style={styles.closeButtonText}>返回</Text>
        </TouchableOpacity>
      </View>

      {/* 地图 */}
      <MapView
        ref={mapRef} // 绑定地图引用
        style={styles.map}
        initialRegion={{
          latitude: currentLocation ? currentLocation.latitude : 0,
          longitude: currentLocation ? currentLocation.longitude : 0,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* 路径绘制 */}
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}

        {/* 当前地点标记 */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="当前位置"
          />
        )}
      </MapView>

      {/* 状态卡片 */}
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
          <Text variant="titleLarge">跑步距离</Text>
          <Text variant="displaySmall">{distance.toFixed(2)} 公里</Text>
          
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
                {isRunning ? '暂停运动' : '开始运动'}
              </Text>
            </TouchableOpacity>

            {/* 添加结束运动按钮，仅在暂停状态显示 */}
            {!isRunning && routeCoordinates.length > 0 && (
              <TouchableOpacity
                style={[styles.runButton, styles.endButton]}
                onPress={handleEndExercise}
              >
                <Text style={styles.runButtonText}>结束运动</Text>
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
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 45,
    zIndex: 1,
  },
  closeButtonTouchable: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
  },
  endButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
  },
});

export default FreeExercise;