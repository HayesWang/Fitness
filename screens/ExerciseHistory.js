import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExerciseHistory = ({ navigation }) => {
  const [exerciseRecords, setExerciseRecords] = useState([]);

  useEffect(() => {
    loadExerciseRecords();
  }, []);

  const loadExerciseRecords = async () => {
    try {
      const records = await AsyncStorage.getItem('exerciseRecords');
      if (records) {
        setExerciseRecords(JSON.parse(records));
      }
    } catch (error) {
      console.error('加载运动记录失败:', error);
    }
  };

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ExerciseDetail', { record: item })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text variant="bodyLarge">距离: {item.distance.toFixed(2)} 公里</Text>
          <Text variant="bodyMedium">
            时长: {Math.floor(item.duration / 60)}分{item.duration % 60}秒
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={exerciseRecords}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
});

export default ExerciseHistory;
