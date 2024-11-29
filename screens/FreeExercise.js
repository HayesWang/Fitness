import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const PresetRoute = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <View style={styles.closeButton}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.closeButtonTouchable}
        >
          <Text style={styles.closeButtonText}>返回</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 31.2304, // 默认位置（可以根据需要修改）
          longitude: 121.4737,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      
      <Card style={styles.statusCard}>
        <Card.Content>
          <Text variant="titleLarge">跑步距离</Text>
          <Text variant="displaySmall">0.00 公里</Text>
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

export default PresetRoute;
