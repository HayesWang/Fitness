import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../constants/assets';
import { LineChart, BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const screenWidth = Dimensions.get('window').width;
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    counts: [],
    distances: []
  });

  useEffect(() => {
    loadExerciseData();
  }, []);

  const loadExerciseData = async () => {
    try {
      const records = await AsyncStorage.getItem('exerciseRecords');
      if (records) {
        const exerciseRecords = JSON.parse(records);
        const monthlyStats = calculateMonthlyStats(exerciseRecords);
        
        setMonthlyData({
          labels: monthlyStats.map(item => `${item.month}月`),
          counts: monthlyStats.map(item => item.count),
          distances: monthlyStats.map(item => item.distance)
        });
      }
    } catch (error) {
      console.error('加载运动记录失败:', error);
    }
  };

  const calculateMonthlyStats = (records) => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        month: month.getMonth() + 1,
        year: month.getFullYear(),
        count: 0,
        distance: 0
      });
    }

    records.forEach(record => {
      const recordDate = new Date(record.date);
      const monthStats = months.find(m => 
        m.month === (recordDate.getMonth() + 1) && 
        m.year === recordDate.getFullYear()
      );
      if (monthStats) {
        monthStats.count += 1;
        monthStats.distance += record.distance;
      }
    });

    return months.map(m => ({
      month: m.month,
      count: m.count,
      distance: Math.round(m.distance * 10) / 10
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          style={styles.avatar}
          source={require('../assets/avatar.png')}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Username</Text>
          <Text style={styles.userStats}>Total Exercise Time: 120h</Text>
        </View>
      </View>

      {/* Statistics Charts */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Exercise Statistics</Text>
        {monthlyData.labels.length > 0 ? (
          <>
            <ScrollView 
              horizontal 
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.chartScroll}
              snapToInterval={screenWidth}
              decelerationRate="fast"
            >
              {/* Exercise Count Chart */}
              <View style={[styles.chartWrapper, { width: screenWidth }]}>
                <BarChart
                  data={{
                    labels: monthlyData.labels.map(label => 
                      label.replace('月', '')  // Remove Chinese character
                    ),
                    datasets: [{
                      data: monthlyData.counts
                    }]
                  }}
                  width={screenWidth - 40}
                  height={200}
                  yAxisLabel=""
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(75, 107, 245, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    barPercentage: 0.7,
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  showValuesOnTopOfBars={true}
                />
                <Text style={styles.chartLegend}>Exercise Count (Times)</Text>
              </View>

              {/* Distance Chart */}
              <View style={[styles.chartWrapper, { width: screenWidth }]}>
                <LineChart
                  data={{
                    labels: monthlyData.labels.map(label => 
                      label.replace('月', '')  // Remove Chinese character
                    ),
                    datasets: [{
                      data: monthlyData.distances
                    }]
                  }}
                  width={screenWidth - 40}
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix="km"
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(255, 72, 66, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: "#fff"
                    }
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  bezier
                />
                <Text style={styles.chartLegend}>Exercise Distance (km)</Text>
              </View>
            </ScrollView>

            <View style={styles.paginationDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>No exercise data available</Text>
        )}
      </View>

      {/* Exercise History Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ExerciseHistory')}
      >
        <Text style={styles.buttonText}>Exercise History</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  profileSection: {
    flexDirection: 'row',
    padding: SIZES.padding.large,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: SIZES.padding.medium,
  },
  userName: {
    fontSize: SIZES.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  userStats: {
    fontSize: SIZES.fontSize.medium,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  chartContainer: {
    padding: SIZES.padding.medium,
    backgroundColor: COLORS.white,
    margin: SIZES.padding.medium,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: SIZES.fontSize.medium,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.padding.medium,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding.medium,
    borderRadius: 8,
    marginHorizontal: SIZES.padding.large,
    alignItems: 'center',
    marginTop: SIZES.padding.large,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSize.medium,
    fontWeight: '600',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
    color: COLORS.text.secondary,
  },
  chartLegend: {
    textAlign: 'center',
    color: COLORS.text.secondary,
    fontSize: SIZES.fontSize.small,
    marginTop: 4,
    marginBottom: 8,
  },
  chartScroll: {
    marginHorizontal: -16,
  },
  chartWrapper: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 16,
  },
});
