import React from 'react';
import { View, StyleSheet, Dimensions, Button } from 'react-native';
import { Text } from 'react-native-paper';
import MapView, { Polyline, Marker } from 'react-native-maps';

const ExerciseDetail = ({ route, navigation }) => {
  const { record } = route.params;

  // 计算路线的边界范围
  const getRegionForRoute = (coordinates) => {
    let minLat = coordinates[0].latitude;
    let maxLat = coordinates[0].latitude;
    let minLng = coordinates[0].longitude;
    let maxLng = coordinates[0].longitude;

    coordinates.forEach(coord => {
      minLat = Math.min(minLat, coord.latitude);
      maxLat = Math.max(maxLat, coord.latitude);
      minLng = Math.min(minLng, coord.longitude);
      maxLng = Math.max(maxLng, coord.longitude);
    });

    const padding = 1.5; // 添加10%的边距
    const latDelta = (maxLat - minLat) * padding;
    const lngDelta = (maxLng - minLng) * padding;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.002), // 设置最小缩放级别
      longitudeDelta: Math.max(lngDelta, 0.002),
    };
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.fullScreenMap}
        initialRegion={getRegionForRoute(record.route)}
      >
        <Polyline
          coordinates={record.route}
          strokeWidth={5}
          strokeColor="blue"
        />
        <Marker coordinate={record.route[0]} title="Start" />
        <Marker coordinate={record.route[record.route.length - 1]} title="End" />
      </MapView>

      <View style={styles.backButtonContainer}>
        <Button 
          title="Back"
          onPress={() => navigation.goBack()}
          color="#000000"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} variant="titleLarge">Exercise Details</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsCard}>
            <Text variant="labelMedium">Date</Text>
            <Text style={styles.boldText} variant="bodyLarge">{new Date(record.date).toLocaleString()}</Text>
          </View>
          <View style={styles.statsCard}>
            <Text variant="labelMedium">Distance</Text>
            <Text style={styles.boldText} variant="bodyLarge">{record.distance.toFixed(2)} km</Text>
          </View>
          <View style={styles.statsCard}>
            <Text variant="labelMedium">Duration</Text>
            <Text style={styles.boldText} variant="bodyLarge">{Math.floor(record.duration / 60)} min {record.duration % 60} sec</Text>
          </View>
          <View style={styles.statsCard}>
            <Text variant="labelMedium">Average Pace</Text>
            <Text style={styles.boldText} variant="bodyLarge">{((record.duration / 60) / record.distance).toFixed(2)} min/km</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenMap: {
    ...StyleSheet.absoluteFillObject,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 45,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statsCard: {
    width: '48%',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default ExerciseDetail;
