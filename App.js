import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 主页面组件
function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部用户信息 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            style={styles.avatar}
            source={require('./assets/avatar.png')} 
          />
          <Text style={styles.username}>王小明同学</Text>
        </View>
        <TouchableOpacity>
          <Image style={styles.notification} source={require('./assets/bell.png')} />
        </TouchableOpacity>
      </View>

      {/* 学习进度卡片 */}
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>本学期进度</Text>
        {/* 进度条组件 */}
      </View>

      {/* 快捷功能按钮 */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text>自由练习</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text>上课签到</Text>
        </TouchableOpacity>
      </View>

      {/* 功能卡片区域 */}
      <View style={styles.functionCards}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>开始锻炼</Text>
          <TouchableOpacity style={styles.startButton}>
            <Text>开始</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>体育课程</Text>
          <TouchableOpacity style={styles.scheduleButton}>
            <Text>安排</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 创建底部导航
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="主页" component={HomeScreen} />
        <Tab.Screen name="发现" component={DiscoveryScreen} />
        <Tab.Screen name="我的" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ... 其他样式定义
});
