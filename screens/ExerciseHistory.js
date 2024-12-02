import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExerciseHistory = ({ navigation }) => {
  const [groupedRecords, setGroupedRecords] = useState({});

  useEffect(() => {
    loadExerciseRecords();
  }, []);

  const loadExerciseRecords = async () => {
    try {
      const records = await AsyncStorage.getItem('exerciseRecords');
      if (records) {
        const parsedRecords = JSON.parse(records);
        const grouped = groupRecordsByMonth(parsedRecords);
        setGroupedRecords(grouped);
      }
    } catch (error) {
      console.error('加载运动记录失败:', error);
    }
  };

  const groupRecordsByMonth = (records) => {
    const sortedRecords = [...records].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    
    return sortedRecords.reduce((groups, record) => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(record);
      return groups;
    }, {});
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('exerciseRecords');
      setGroupedRecords({});
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
        <Card.Content style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Image 
              source={require('../assets/Running.png')} 
              style={styles.icon}
            />
          </View>
          <View style={styles.textContainer}>
            <Text variant="bodySmall" style={styles.exerciseType}>Running</Text>
            <Text variant="titleLarge" style={styles.distance}>
              距离: {item.distance.toFixed(2)} 公里
            </Text>
            <Text variant="bodySmall" style={styles.date}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderMonthSection = ([month, records]) => (
    <View key={month} style={styles.monthSection}>
      <Text style={styles.monthTitle}>{month}</Text>
      {records.map(record => (
        <TouchableOpacity 
          key={record.id}
          onPress={() => navigation.navigate('ExerciseDetail', { record })}
        >
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Image 
                  source={require('../assets/Running.png')} 
                  style={styles.icon}
                />
              </View>
              <View style={styles.textContainer}>
                <Text variant="bodySmall" style={styles.exerciseType}>Running</Text>
                <View style={styles.distanceDateContainer}>
                  <Text variant="titleLarge" style={styles.distance}>
                    {record.distance.toFixed(2)} km
                  </Text>
                  <Text variant="bodySmall" style={styles.date}>
                    {new Date(record.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('MainTabs')}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{'< '}Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise History</Text>
      </View>
      <TouchableOpacity 
        onLongPress={handleLongPress}
        delayLongPress={1000}
        style={styles.container}
        activeOpacity={1}
      >
        <ScrollView contentContainerStyle={styles.listContainer}>
          {Object.entries(groupedRecords)
            .sort((a, b) => {
              const [yearA, monthA] = a[0].match(/(\d+)年(\d+)月/).slice(1).map(Number);
              const [yearB, monthB] = b[0].match(/(\d+)年(\d+)月/).slice(1).map(Number);
              if (yearA !== yearB) {
                return yearB - yearA;
              }
              return monthB - monthA;
            })
            .map(renderMonthSection)}
        </ScrollView>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    alignItems:'center',
    padding: 16,
  },
  card: {
    backgroundColor:'white',
    width:'350',
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    width:'auto',
    height:150,
    flexDirection: 'column',
    padding: 16,
    backgroundColor: 'white',
    elevation: 4,
  },
  backButton: {
    marginTop:50,
    marginRight: 16,
  },
  backButtonText: {
    color: '#4B6BF5',
    fontWeight:'500',
    fontSize: 17,
  },
  headerTitle: {
    marginTop:'15',
    color: 'black',
    fontSize: 35,
    fontWeight: 'bold',
  },
  monthSection: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  exerciseType: {
    fontSize: 16,
    color: 'black',
  },
  distanceDateContainer: {
    height:40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distance: {
    fontSize: 29,
    fontWeight: '700',
    color: '#4B6BF5',
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
});

export default ExerciseHistory;
