import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, SIZES } from '../constants/assets';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Tab 导航器
const Tab = createBottomTabNavigator();

// Community 页面
function CommunityScreen() {
  const [posts, setPosts] = useState([
    { id: 'I_llix', title: 'Get Ready to Sweat!', description: 'Right gear = better workouts! These shoes are super comfy and perfect for any workout. What’s your go-to gear for exercise?', avatar: require('../assets/community/Avatar1.jpg'), postImage: require('../assets/community/postImage1.jpg'), likes: 120, comments: 50, shares: 30, followed: false },
    { id: 'CHI', title: 'I ❤️ Cycling 🚴‍♂️ Let’s Hit the Road!', description: 'Cycling is a great way to stay fit and enjoy the outdoors. Been biking to work lately, and it feels awesome! Where do you usually ride?', avatar: require('../assets/community/Avatar2.jpg'), postImage: require('../assets/community/postImage2.jpg'), likes: 200, comments: 80, shares: 60, followed: false },
    { id: '3', title: 'When Life Hits You with the Reverse Card! 🔄', description: 'Thought you had everything figured out? Life’s got other plans. Uno Reverse, baby! 😂 Anyone else getting hit with surprises lately?', avatar: require('../assets/community/Avatar3.jpg'), postImage: require('../assets/community/postImage3.jpg'), likes: 150, comments: 70, shares: 40, followed: false },
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
        <Image source={item.postImage } style={styles.postImage} />
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
 // 用来展示大卡片的数据（这里只是示例，你可以根据实际情况填充内容）
  const bigCards = [
    { id: '1', title: '大卡片1',image: require('../assets/community/bigCard1.jpg') },
    { id: '2', title: '大卡片2',image: require('../assets/community/bigCard2.jpg') },
    { id: '3', title: '大卡片3',image: require('../assets/community/bigCard3.jpg') },
  ];

  // 用来展示小卡片的数据
  const smallCards = [
    { id: '1', title: '20 min full body hit for beginners', image: require('../assets/community/smallCard1.jpg') },
    { id: '2', title: 'lecture2', image: require('../assets/community/smallCard2.jpg') },
    { id: '3', title: 'lecture3', image: require('../assets/community/smallCard3.jpg') },
    { id: '4', title: 'lecture4', image: require('../assets/community/smallCard4.jpg') },
    { id: '5', title: 'lecture5', image: require('../assets/community/smallCard5.jpg') },
    { id: '6', title: 'lecture6', image: require('../assets/community/smallCard6.jpg') },
  ];

  // 大卡片索引
  const [activeBigCardIndex, setActiveBigCardIndex] = useState(0);
  const flatListRef = useRef(null);


  // 自动滚动大卡片
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBigCardIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % bigCards.length;
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        }
        return nextIndex;
      });
    }, 3000); // 每3秒滚动一次

    return () => clearInterval(interval); // 清除定时器
  }, []);

  // 渲染大卡片
  const renderBigCard = ({ item }) => (
    <View style={styles.bigCardContainer}>
      <Image source={item.image} style={styles.bigCardImage} />
    </View>
  );

  // 渲染小卡片
  const renderSmallCard = ({ item }) => (
    <View style={styles.smallCardContainer}>
      <Image source={item.image} style={styles.smallCardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* 横向滚动的大卡片部分 */}
      <FlatList
        data={bigCards}
        renderItem={renderBigCard}
        keyExtractor={(item) => item.id}
        horizontal={true}  // 启用横向滚动
        showsHorizontalScrollIndicator={false}  // 隐藏横向滚动条
        contentContainerStyle={styles.bigCardList}
        ref={flatListRef}
        initialScrollIndex={activeBigCardIndex}  // 设置初始显示的卡片
        scrollEnabled={true} // 允许滚动
        
      />

      {/* 小卡片部分 */}
      <FlatList
        data={smallCards}
        renderItem={renderSmallCard}
        keyExtractor={(item) => item.id}
        numColumns={2}  // 设置每行两个小卡片
        contentContainerStyle={styles.smallCardsWrapper}
      />
    </SafeAreaView>
  );
}


export default function DiscoveryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* 搜索栏部分 */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Image 
            source={require('../assets/community/search-icon.png')}  // 修改为你的图标路径
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索"
            value={searchQuery}
            onChangeText={setSearchQuery}  // 实时更新搜索框内容
          />
        </View>

        {/* 添加右侧圆形按钮 */}
        <TouchableOpacity style={styles.circleButton} onPress={() => alert('按钮被点击')}>
          <Image 
            source={require('../assets/community/plus-icon.png')} // 修改为你想用的图标路径
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Tab导航部分 */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            position: 'absolute',
            top: 0,
            width: '100%',
            backgroundColor: '#fff',
            height: 70,
            justifyContent: 'center',
            paddingBottom: 10,
            borderTopWidth: 1,
            borderTopColor: '#ddd',
          },
          tabBarLabelStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
          },
          tabBarActiveTintColor: '#000',
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: focused ? 'blue' : '#999',
                  fontWeight: 'bold',
                }}>
                </Text>
                {focused && (
                  <View style={{
                    width: 80,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'blue',
                    marginTop: 60,
                    zIndex: 1,
                  }} />
                )}
              </View>
            );
          },
          tabBarIndicatorStyle: {
            backgroundColor: 'blue',
            height: 300,
            width: 300,
            borderRadius: 2,
          },
          headerStyle: {
            height: 70,
          },
        })}
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
    justifyContent: 'flex-start',
    height: '90%',
  },
  searchWrapper: {
    flexDirection: 'row',  // 让搜索框和按钮在同一行
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',  // 图标和输入框水平排列
    alignItems: 'center',  // 垂直居中
    backgroundColor: '#E6E8E9',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 35,  // 将搜索框的高度从 40 调整为 35
    flex: 1,  // 让搜索框占据剩余空间
  },

  searchIcon: {
    width: 24,  // 图标的宽度
    height: 24, // 图标的高度
    marginRight: 10,  // 图标和输入框之间的间距
  },
  
  searchInput: {
    height: '100%',  // 让输入框占满容器的高度
    fontSize: 16,
    color: '#333',
    paddingLeft: 10,  // 给输入框留出空间给图标
    flex: 1,  // 输入框占据剩余空间
  
  
  },
  // 圆形按钮样式
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,  // 圆形按钮
    backgroundColor: '#007AFF',  // 确保按钮有颜色
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,  // 按钮和搜索框之间的间距
  },
  
  // 按钮内图标样式
  buttonIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',  // 设置图标颜色为白色
  },
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  postContainer: {
    width: 390,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 2,//这个是帖子和帖子之间的距离
    borderRadius: 8,
    //borderWidth: 1,
    //borderColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 22.5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 20,
  },
  postID: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  followButton: {
    marginLeft: 'auto',
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
    backgroundColor: '#ddd',
    borderColor: '#ddd',
  },
  followedText: {
    color: '#666',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  postDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    marginTop: 5,
    //marginLeft: 5,


  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 10,
    gap: 15,
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
  pageContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',  // 背景颜色可以根据需要调整
    paddingHorizontal: 15,
    paddingTop: 20,
  },

  bigCardList: {
    marginTop: 10,
    marginBottom: 80,//这边为了它可以完整显示，不知道为什么

  },

  bigCardContainer: {
    width: 370,
    height: 200,


    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,  // 左右间距
    marginBottom: 10,  // 底部间隔
  },
  bigCardImage: {
    width: 370,
    height: 200,
    resizeMode: 'cover',
  },
  cardTitle: {
    fontSize: 14,//这边是小卡片字体大小
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'left',
    color: '#333',
  },
  smallCardContainer: {
    flex: 1,
    marginBottom: 10,
    //marginRight: 16,
    marginLeft: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 170,  // 小卡片高度
    width: 177,

  },
  smallCardImage: {
    width: 177,
    height: 103,
    resizeMode: 'cover',
  },
  smallCardsWrapper: {
    marginTop: 10,
    //marginBottom: 50,

  },
});
