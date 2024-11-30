import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import polyline from 'polyline'; // 用于解析Google Directions API的折线数据

const FreeExercise = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null); // 当前用户位置
  const [initialPoint, setInitialPoint] = useState(null); // 初始起点
  const [finalPoint, setFinalPoint] = useState(null); // 最终终点
  const [fullRouteCoordinates, setFullRouteCoordinates] = useState([]); // 完整路径
  const mapRef = useRef(null); // 地图引用
  const [repeatCount, setRepeatCount] = useState(0); // 路径移动重复计数
  const [isFinalRoute, setIsFinalRoute] = useState(false); // 是否显示最终路径

  useEffect(() => {
    const fetchRoute = async () => {
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

      if (repeatCount === 0) {
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
        {/* 最终路径或完整路径绘制 */}
        {fullRouteCoordinates.length > 1 && isFinalRoute && (
          <Polyline
            coordinates={fullRouteCoordinates}
            strokeWidth={5}
            strokeColor="blue" // 最终路径为蓝色
          />
        )}

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
