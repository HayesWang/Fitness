import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import MapView, { Polyline, Marker } from 'react-native-maps';

const ExerciseDetail = ({ route }) => {
  const { record } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: record.route[0].latitude,
          longitude: record.route[0].longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Polyline
          coordinates={record.route}
          strokeWidth={5}
          strokeColor="blue"
        />
        <Marker coordinate={record.route[0]} title="起点" />
        <Marker coordinate={record.route[record.route.length - 1]} title="终点" />
      </MapView>

      <View style={styles.infoContainer}>
        <Text variant="titleLarge">运动详情</Text>
        <Text variant="bodyLarge">
          日期: {new Date(record.date).toLocaleString()}
        </Text>
        <Text variant="bodyLarge">
          距离: {record.distance.toFixed(2)} 公里
        </Text>
        <Text variant="bodyLarge">
          时长: {Math.floor(record.duration / 60)}分{record.duration % 60}秒
        </Text>
        <Text variant="bodyLarge">
          平均配速: {((record.duration / 60) / record.distance).toFixed(2)} 分钟/公里
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'white',
    flex: 1,
  },
});

export default ExerciseDetail;
