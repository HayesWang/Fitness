import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import polyline from 'polyline'; // 用于解析Google Directions API的折线数据

const FreeExercise = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null); // 当前用户位置
  const [fullRouteCoordinates, setFullRouteCoordinates] = useState([]); // 记录完整路径的坐标数组
  const mapRef = useRef(null); // 地图引用
  const [repeatCount, setRepeatCount] = useState(0); // 路径移动重复计数

  useEffect(() => {
    const fetchRoute = async () => {
      // 如果已经完成 10 次路径生成，停止
      if (repeatCount >= 10) {
        Alert.alert('完成', '已完成 10 次路径生成');
        return;
      }

      if (repeatCount === 0) {
        // 初始获取位置
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('权限被拒绝', '无法访问位置数据');
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);

        const directions = await getRouteAlongRoads(location.coords);
        if (directions) {
          setFullRouteCoordinates(directions.coordinates); // 初始化完整路径
          setRepeatCount(repeatCount + 1); // 启动下一段路径
        }
      } else {
        // 使用上次终点作为下一次路径的起点
        const lastEndpoint = fullRouteCoordinates[fullRouteCoordinates.length - 1];
        const directions = await getRouteAlongRoads(lastEndpoint);
        if (directions) {
          setFullRouteCoordinates((prev) => [...prev, ...directions.coordinates]); // 更新完整路径
          setRepeatCount(repeatCount + 1); // 启动下一段路径
        }
      }
    };

    fetchRoute();
  }, [repeatCount]); // 监听 repeatCount，触发路径重新获取

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

      if (data.routes.length > 0) {
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
      console.error(error);
      return null;
    }
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
        {/* 完整路径绘制 */}
        {fullRouteCoordinates.length > 1 && (
          <Polyline
            coordinates={fullRouteCoordinates}
            strokeWidth={5}
            strokeColor="green" // 完整路径颜色
          />
        )}

        {/* 起点标记 */}
        {fullRouteCoordinates.length > 0 && (
          <Marker
            coordinate={fullRouteCoordinates[0]}
            title="起点"
            pinColor="green"
          />
        )}

        {/* 终点标记 */}
        {fullRouteCoordinates.length > 0 && (
          <Marker
            coordinate={fullRouteCoordinates[fullRouteCoordinates.length - 1]}
            title="终点"
            pinColor="red"
          />
        )}
      </MapView>
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
});

export default FreeExercise;