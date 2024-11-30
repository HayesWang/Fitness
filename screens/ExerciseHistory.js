import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
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

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('exerciseRecords');
      setExerciseRecords([]);
    } catch (error) {
      console.error('清空历史记录失败:', error);
    }
  };

  const handleLongPress = () => {
    Alert.alert(
      '清空历史记录',
      '确定要清空所有运动记录吗？此操作不可撤销。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: clearHistory,
          style: 'destructive',
        },
      ]
    );
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
    <TouchableOpacity 
      onLongPress={handleLongPress}
      delayLongPress={1000}
      style={styles.container}
      activeOpacity={1}
    >
      <FlatList
        data={exerciseRecords}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </TouchableOpacity>
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
