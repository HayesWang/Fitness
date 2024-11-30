import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function ProfileScreen() {
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    useShadowColorFromDataset: false,
  };

  const data = {
    labels: ['8', '9', '10', '11', '12', '1', '2'],
    datasets: [
      {
        data: [6, 9, 7, 12, 8, 5],
        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // optional
        strokeWidth: 2,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* User Avatar */}
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.imageText}>Avatar</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Student: Xiaoming Wang</Text>
            <Text style={styles.profileDept}>School of Design and Innovation</Text>
          </View>
        </View>

        {/* Line Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>2023-2024 Academic Year, Semester 1</Text>
          <LineChart
            data={data}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>21</Text>
            <Text style={styles.statLabel}>Valid Workouts This Semester</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Average Workouts Per Month</Text>
          </View>
        </View>

        {/* Running Records */}
        <View style={styles.recordsSection}>
          <View style={styles.record}>
            <Text style={styles.recordDate}>2023.11.09</Text>
            <Text style={styles.recordDistance}>2.04 km</Text>
            <Text style={styles.recordTime}>00:11:23</Text>
            <Text style={[styles.recordStatus, styles.statusValid]}>Valid</Text>
          </View>
          <View style={styles.record}>
            <Text style={styles.recordDate}>2023.11.09</Text>
            <Text style={styles.recordDistance}>2.04 km</Text>
            <Text style={styles.recordTime}>00:11:23</Text>
            <Text style={[styles.recordStatus, styles.statusInvalid]}>Invalid</Text>
          </View>
          <View style={styles.record}>
            <Text style={styles.recordDate}>2023.11.09</Text>
            <Text style={styles.recordDistance}>2.04 km</Text>
            <Text style={styles.recordTime}>00:11:23</Text>
            <Text style={[styles.recordStatus, styles.statusPending]}>Pending</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#888',
    fontSize: 14,
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileDept: {
    fontSize: 14,
    color: '#666',
  },
  chartSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 10,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  recordsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  record: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  recordDate: {
    fontSize: 14,
    color: '#333',
  },
  recordDistance: {
    fontSize: 14,
    color: '#333',
  },
  recordTime: {
    fontSize: 14,
    color: '#333',
  },
  recordStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusValid: {
    color: 'green',
  },
  statusInvalid: {
    color: 'red',
  },
  statusPending: {
    color: 'orange',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#333',
  },
});