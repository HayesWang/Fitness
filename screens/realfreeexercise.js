import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const FreeExercise = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null); // 当前用户位置
  const [routeCoordinates, setRouteCoordinates] = useState([]); // 路径坐标数组
  const [distance, setDistance] = useState(0); // 跑步总距离
  const mapRef = useRef(null); // 地图引用

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

      // 获取当前位置并启动监听
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      setRouteCoordinates([location.coords]); // 将当前位置设置为起点

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // 每秒更新一次
          distanceInterval: 1, // 每移动 1 米更新一次
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;

          // 更新路径坐标
          setRouteCoordinates((prev) => [...prev, newLocation.coords]);

          // 计算跑步距离
          if (routeCoordinates.length > 0) {
            const lastPoint = routeCoordinates[routeCoordinates.length - 1];
            const newDistance =
              getDistanceFromLatLonInMeters(
                lastPoint.latitude,
                lastPoint.longitude,
                latitude,
                longitude
              ) / 1000; // 转换为公里
            setDistance((prevDistance) => prevDistance + newDistance);
          }

          // 移动地图视图到当前位置
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 500); // 动画持续时间为0.5秒
          }

          setCurrentLocation(newLocation.coords);
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) locationSubscription.remove(); // 停止监听
    };
  }, [routeCoordinates]);

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

  return (
    <View style={styles.container}>
      {/* 返回按钮 */}
      <View style={styles.closeButton}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
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
      <Card style={styles.statusCard}>
        <Card.Content>
          <Text variant="titleLarge">跑步距离</Text>
          <Text variant="displaySmall">{distance.toFixed(2)} 公里</Text>
        </Card.Content>
      </Card>
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
});

export default FreeExercise;