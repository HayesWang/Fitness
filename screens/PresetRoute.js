import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, Text, Animated, PanResponder } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import polyline from 'polyline'; // 用于解析Google Directions API的折线数据
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FreeExercise = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null); // 当前用户位置
  const [initialPoint, setInitialPoint] = useState(null); // 初始起点
  const [finalPoint, setFinalPoint] = useState(null); // 最终终点
  const [fullRouteCoordinates, setFullRouteCoordinates] = useState([]); // 完整路径
  const mapRef = useRef(null); // 地图引用
  const [repeatCount, setRepeatCount] = useState(0); // 路径移动重复计数
  const [isFinalRoute, setIsFinalRoute] = useState(false); // 是否显示最终路径
  const [isUserInteracting, setIsUserInteracting] = useState(false); // 添加用户交互状态
  const [isRunning, setIsRunning] = useState(false); // 添加运动状态
  const [distance, setDistance] = useState(0); // 添加距离计算
  const [passedPoints, setPassedPoints] = useState(0); // 添加已通过标记点计数
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);

  // 添加状态栏高度动画值
  const cardHeight = useRef(new Animated.Value(120)).current;
  
  // 添加拖拽手势处理
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
        const shouldExpand = gestureState.dy < 0;
        Animated.spring(cardHeight, {
          toValue: shouldExpand ? 250 : 120,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // 修改处理开始/暂停运动的函数
  const handleRunningState = () => {
    if (!isRunning) {
      // 如果是第一次开始运动
      if (!startTime) {
        setStartTime(new Date());
        setRepeatCount(1);
      }
      // 开始运动时放大地图视图
      if (mapRef.current && currentLocation) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
      }
      // 自动折叠状态栏
      Animated.spring(cardHeight, {
        toValue: 120,
        useNativeDriver: false,
      }).start();
      
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  // 修改路径计算逻辑
  useEffect(() => {
    const fetchRoute = async () => {
      if (!isRunning) return; // 只在运动开始后计算路径

      // 如果完成 10 次路径生成，重新计算最终路径
      if (repeatCount >= 15) {
        if (initialPoint && finalPoint) {
          const finalRoute = await calculateFinalRoute(initialPoint, finalPoint);
          if (finalRoute) {
            setFullRouteCoordinates(finalRoute.coordinates);
            setIsFinalRoute(true); // 显示最终路径
          } else {
            Alert.alert('路径计算失败', '无法生成最终路径');
          }
        }
        return;
      }

      if (repeatCount === 1) {
        // 初始获取位置
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('权限被拒绝', '无法访问位置数据');
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
        setInitialPoint(location.coords); // 记录初始起点

        const directions = await getRouteAlongRoads(location.coords);
        if (directions) {
          setFullRouteCoordinates(directions.coordinates); // 初始化完整路径
          setRepeatCount(repeatCount + 1); // 启动下一段路径
        } else {
          Alert.alert('路径生成失败', '无法找到有效路径');
        }
      } else {
        // 使用上次终点作为下一次路径的起点
        const lastEndpoint = fullRouteCoordinates[fullRouteCoordinates.length - 1];
        const directions = await getRouteAlongRoads(lastEndpoint);
        if (directions) {
          setFullRouteCoordinates((prev) => [...prev, ...directions.coordinates]); // 更新完整路径
          setFinalPoint(lastEndpoint); // 更新最终终点
          setRepeatCount(repeatCount + 1); // 启动下一段路径
        } else {
          Alert.alert('路径生成失败', '无法找到有效路径');
        }
      }
    };

    if (isRunning) {
      fetchRoute();
    }
  }, [repeatCount, isRunning]);

  // 添加距离计算逻辑
  useEffect(() => {
    if (!isRunning || !currentLocation || fullRouteCoordinates.length === 0) return;

    // 计算用户与路径点的距离，更新通过的标记点数量
    const checkPassedPoints = () => {
      let passed = 0;
      fullRouteCoordinates.forEach((point, index) => {
        const distance = getDistanceFromLatLonInMeters(
          currentLocation.latitude,
          currentLocation.longitude,
          point.latitude,
          point.longitude
        );
        if (distance < 10) { // 当距离小于 10 米时认为通过该点
          passed = index + 1;
        }
      });
      setPassedPoints(passed);
    };

    const interval = setInterval(checkPassedPoints, 1000);
    return () => clearInterval(interval);
  }, [currentLocation, fullRouteCoordinates, isRunning]);

  // 修改自动居中定时器中的缩放级别
  useEffect(() => {
    if (mapRef.current && currentLocation && !isUserInteracting) {
      const centerInterval = setInterval(() => {
        mapRef.current.animateToRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: isRunning ? 0.005 : 0.02, // 根据运动状态调整缩放级别
          longitudeDelta: isRunning ? 0.005 : 0.02,
        }, 1000);
      }, 3000);

      return () => clearInterval(centerInterval);
    }
  }, [currentLocation, isUserInteracting, isRunning]); // 添加 isRunning 依赖

  // 调用 Google Directions API 获取沿道路的路径
  const getRouteAlongRoads = async (start) => {
    const apiKey = 'AIzaSyAKzq5Mda21VqFSbfOpDMkHqhsCgG_RCoo'; // 替换为你的 Google API 密钥

    // 随机生成方向（角度）和距离
    const angle = Math.random() * 180; // 随机生成 0 到 180 度方向
    const distance = 0.0015; // 固定偏移距离（可调整）

    // 转换角度为弧度
    const radians = (angle * Math.PI) / 180;

    // 计算随机终点的经纬度
    const destinationLatitude = start.latitude + Math.cos(radians) * distance;
    const destinationLongitude = start.longitude + Math.sin(radians) * distance;
    const destination = `${destinationLatitude},${destinationLongitude}`;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${destination}&mode=walking&key=${apiKey}`
      );
      const data = await response.json();

      console.log('Google Directions API response:', data); // 打印响应数据

      if (data.routes && data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const coordinates = polyline.decode(points).map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));
        return { coordinates };
      } else {
        Alert.alert('无可用路线', '请检查起点和终点是否有效');
        return null;
      }
    } catch (error) {
      Alert.alert('错误', '获取路径数据失败，请稍后重试');
      console.error('Error fetching route:', error);
      return null;
    }
  };

  // 计算从起点到终点的最终完整路径
  const calculateFinalRoute = async (start, end) => {
    const apiKey = 'AIzaSyAKzq5Mda21VqFSbfOpDMkHqhsCgG_RCoo'; // 替换为你的 Google API 密钥
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}&mode=walking&key=${apiKey}`
      );
      const data = await response.json();

      console.log('Final route API response:', data); // 打印最终路径响应

      if (data.routes && data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const coordinates = polyline.decode(points).map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));
        return { coordinates };
      } else {
        Alert.alert('无法生成最终路径', '请检查起点和终点是否有效');
        return null;
      }
    } catch (error) {
      Alert.alert('错误', '获取最终路径失败，请稍后重试');
      console.error('Error fetching final route:', error);
      return null;
    }
  };

  // 添加初始位置获取
  useEffect(() => {
    const getInitialLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限被拒绝', '无法访问位置数据');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      
      // 当获取到位置后，居中地图
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }, 1000);
      }
    };

    getInitialLocation();
  }, []); // 仅在组件挂载时执行一次

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

  const saveExerciseRecord = async () => {
    try {
      const newRecord = {
        id: Date.now().toString(),
        date: startTime.toISOString(),
        distance,
        duration,
        route: fullRouteCoordinates,
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

  return (
    <View style={styles.container}>
      {/* 返回按钮 */}
      <View style={styles.closeButton}>
        <TouchableOpacity 
          onPress={() => {
            if (isRunning || startTime) {  // 如果正在运动或已开始运动
              Alert.alert(
                '确认返回',
                '运动正在进行中，确定要退出吗？',
                [
                  {
                    text: '取消',
                    style: 'cancel'
                  },
                  {
                    text: '确定',
                    onPress: () => navigation.goBack(),
                    style: 'destructive'
                  }
                ]
              );
            } else {
              navigation.goBack();
            }
          }}
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
        onPanDrag={() => setIsUserInteracting(true)}
        onRegionChangeComplete={() => {
          // 用户停止移动地图 3 秒后恢复自动居中
          setTimeout(() => {
            setIsUserInteracting(false);
          }, 3000);
        }}
      >
        {/* 最终路径或完整路径绘制 */}
        {fullRouteCoordinates.length > 1 && isFinalRoute && (
          <Polyline
            coordinates={fullRouteCoordinates}
            strokeWidth={5}
            strokeColor="blue" // 最终路径为蓝色
          />
        )}

        {/* 途径点标记 */}
        {fullRouteCoordinates.map((point, index) => {
          // 跳过起点和终点
          if (index === 0 || index === fullRouteCoordinates.length - 1) return null;
          // 每隔一定数量的点绘制一个标记
          if (index % 2 === 0) {
            return (
              <Marker
                key={index}
                coordinate={point}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: 'red',
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: 'white'
                }} />
              </Marker>
            );
          }
          return null;
        })}

        {/* 起点标记 */}
        {initialPoint && (
          <Marker
            coordinate={initialPoint}
            title="起点"
            pinColor="green"
          />
        )}

        {/* 终点标记 */}
        {finalPoint && (
          <Marker
            coordinate={finalPoint}
            title="终点"
            pinColor="red"
          />
        )}
      </MapView>

      {/* 添加状态栏 */}
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
          <Text style={styles.titleText}>运动数据</Text>
          <View style={styles.dataContainer}>
            <View style={styles.dataRow}>
              <View>
                <Text style={styles.distanceText}>{distance.toFixed(2)} km</Text>
                <Text style={styles.pointsText}>已通过 {passedPoints} 个标记点</Text>
              </View>
              <View style={styles.durationContainer}>
                <Text style={styles.durationText}>
                  {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                </Text>
                <Text style={styles.durationLabel}>用时</Text>
              </View>
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
                {isRunning ? '暂停运动' : (startTime ? '继续运动' : '开始运动')}
              </Text>
            </TouchableOpacity>

            {/* 结束运动按钮 - 修改显示条件 */}
            {!isRunning && startTime && (  // 只要运动已开始且当前已暂停就显示结束按钮
              <TouchableOpacity
                style={[styles.runButton, styles.endButton]}
                onPress={() => {
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
                }}
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
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: '#f44336',
    marginTop: 8,
  },
  runButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  dataContainer: {
    marginVertical: 4,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    alignItems: 'center',
  },
  durationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  durationLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  distanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 18,
    color: '#666',
  },
});

// 添加距离计算辅助函数
const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 地球半径（千米）
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // 距离（千米）
  return d * 1000; // 转换为米
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export default FreeExercise;
