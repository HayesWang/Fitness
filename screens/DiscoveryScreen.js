import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/assets';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Tab 导航器
const Tab = createBottomTabNavigator();

// Community 页面
function CommunityScreen() {
  const [posts, setPosts] = useState([
    { id: '咕咕', title: 'Fitness tips', description: '这是第一个帖子内容。', avatar: require('../assets/community/Avatar1.jpg'), postImage: 'https://example.com/community-post-image1.jpg', likes: 120, comments: 50, shares: 30, followed: false },
    { id: 'CHI', title: 'I ❤ running', description: '这是第二个帖子内容。', avatar: require('../assets/community/Avatar2.jpg'), postImage: 'https://example.com/community-post-image2.jpg', likes: 200, comments: 80, shares: 60, followed: false },
    { id: '3', title: 'Healthy Eating', description: '这是第三个帖子内容。', avatar: require('../assets/community/Avatar3.jpg'), postImage: 'https://example.com/community-post-image3.jpg', likes: 150, comments: 70, shares: 40, followed: false },
  ]);

  const toggleFollow = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, followed: !post.followed } : post
    ));
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Image source={item.avatar} style={styles.avatar} />
        <Text style={styles.postID}>{item.id}</Text>
        <TouchableOpacity
          style={[styles.followButton, item.followed && styles.followedButton]} // 根据当前帖子状态切换按钮样式
          onPress={() => toggleFollow(item.id)}  // 切换当前帖子的 Follow 状态
        >
          <Text style={[styles.followButtonText, item.followed && styles.followedText]}>
            {item.followed ? 'Following' : '+ Follow'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDescription}>{item.description}</Text>

      <View style={styles.imageContainer}>
        <Image source={{ uri: item.postImage }} style={styles.postImage} />
      </View>

      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <Image source={require('../assets/community/like-icon.png')} style={styles.icon} />
          <Text style={styles.iconText}>{item.likes}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Image source={require('../assets/community/comment-icon.png')} style={styles.icon} />
          <Text style={styles.iconText}>{item.comments}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Image source={require('../assets/community/share-icon.png')} style={styles.icon} />
          <Text style={styles.iconText}>{item.shares}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.pageContainer}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

// 下面是Courses页面（您可以根据需求自定义）
function CoursesScreen() {
  return (
    <SafeAreaView style={styles.pageContainer}>
      <Text style={styles.text}>这是Courses页面的内容。</Text>
    </SafeAreaView>
  );
}

export default function DiscoveryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>发现</Text>

      {/* Tab导航部分 */}
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            position: 'absolute',  // 设置 Tab 位置为绝对定位
            top: 0, // 使 Tab 导航条位于屏幕顶部
            width: '100%', // 宽度为屏幕宽度
            backgroundColor: '#fff', // 设置 Tab 背景色
            height: 60, // 设置 Tab 高度，使其更窄
            justifyContent: 'center', // 内容居中
            paddingBottom: 10, // 调整 Tab 底部与标签的距离
            borderTopWidth: 1, // 添加边框，以区分 Tab 区域
            borderTopColor: '#ddd', // 边框颜色
            
          },
          tabBarLabelStyle: {
            fontSize: 16, // 设置标签文字大小
            fontWeight: 'bold', // 加粗字体
            color: COLORS.text.primary, // 设置标签文字颜色
            marginBottom: 5, // 标签文字下移一些
          },
          tabBarActiveTintColor: 'blue',  // 选中时的字体颜色
          tabBarInactiveTintColor: '#999',  // 未选中时的字体颜色
          tabBarIcon: () => null, // 不显示图标 为了隐藏三角形的指示器
          tabBarIndicatorStyle: {
            display: 'none', // 隐藏指示器（三角形）
          },
          //headerShown: false, // 这一行隐藏顶部的标题文字
        }}
      >
        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="Courses" component={CoursesScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    justifyContent: 'flex-start', // 确保顶部有空间
  },
  title: {
    fontSize: SIZES.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    padding: SIZES.padding.large,
  },
  tabWrapper: {
    position: 'absolute',  // 确保 Tab 导航部分位置固定
    bottom: 0,  // 定位到屏幕底部
    left: '5%',  // 居中调整 Tab 导航栏
    right: '5%',
  },
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },

  postContainer: {
    width: 390, // 不知道为什么100%有问题，这里卡片宽度直接设置为390
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd', // 添加边框
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  postID: {
    fontSize: 14,
    color: '#666',
  },
  followButton: {
    marginLeft: 'auto', // 将按钮推到右侧
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
  },
  followButtonText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  followedButton: {
    backgroundColor: '#ddd',  // 按钮背景变灰
    borderColor: '#ddd',  // 边框变灰
  },
  followedText: {
    color: '#666',  // 字体变灰
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  postDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd', // 背景色灰色，位置留给图片
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // 将图标集中到右侧
    alignItems: 'flex-end', // 将图标垂直对齐到底部
    marginTop: 10,
    gap: 15,  // 添加图标之间的间距
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  iconText: {
    fontSize: 14,
    color: '#666',
  },
});