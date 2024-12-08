import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    name: "Peter Hanson",
    id: "2222222222",
    typeA: 21,
    typeB: 4,
  });

  const [menuItems] = useState([
    { title: "My Courses", icon: require("../assets/check mark.png"), navigateTo: "Courses" },
    { title: "My Grades", icon: require("../assets/medal.png"), navigateTo: "Grades" },
    { title: "My Races", icon: require("../assets/trophy.png"), navigateTo: "Races" },
    //{ title: "Set Up", icon: require("../assets/setting.png"), navigateTo: "Settings" },

  ]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={require('../assets/avatar.png')}
 // Replace with your avatar image path
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userId}>ID: {userData.id}</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.icon}>⚙️</Text>
        </TouchableOpacity>
      </View>
 
      {/* Statistics Section */}
      <View style={styles.statistics}>
        <View style={styles.statBox}>
          <Text style={styles.bigText}>21</Text>
          <View style={styles.leftBottom}>
            <Text style={styles.mediumText}>A</Text>
            <Text style={styles.smallText}>TYPE</Text>
          </View>
          <Text style={styles.centerBigText}>04</Text>
          <View style={styles.rightBottom}>
            <Text style={styles.mediumText}>B</Text>
            <Text style={styles.smallText}>TYPE</Text>
          </View>
        </View>
      </View>

      {/* Exercise History Button */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate("ExerciseHistory")}
      >
        <Text style={styles.historyButtonText}>EXERCISE HISTORY</Text>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionText}>Daily{'\n'} Outfit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionText}>PE{'\n'}Classes</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.navigateTo)}
          >
            <Image 
              source={item.icon} 
              style={item.title === "My Courses" ? styles.myCoursesIcon : styles.menuItemIcon} 
            />
            <Text style={styles.menuItemText}>{item.title}</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "transparent",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userId: {
    fontSize: 14,
    color: "#666",
  },
  settingsIcon: {
    padding: 8,
  },
  icon: {
    fontSize: 20,
    color: "#333",
  },
  statistics: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#",
    marginVertical: 12,
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  statBox: {
    width: '95%', // 宽度
    height: 110, // 高度
    borderRadius: 15, // 圆角
    backgroundColor: '#4944F1', // 背景颜色
    padding: 20, // 内边距
    flexDirection: 'row',
    justifyContent: 'center', // 垂直居中
    alignItems: 'center', // 水平居中
    shadowColor: 'rgba(0, 0, 0, 0.25)', // 阴影颜色
    shadowOffset: { width: 0, height: 4 }, // 阴影偏移
    shadowOpacity: 0.25, // 阴影透明度
    shadowRadius: 4, // 阴影模糊半径
    elevation: 4, // Android 阴影
  },
  bigText: {
    position: 'absolute',
    top: 19,
    left: 20,
    fontSize: 55,
    fontStyle: 'italic', // 数字 "21"
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  leftBottom: {
    position: 'absolute',
    bottom: 20,
    left: 80,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  centerBigText: {
    position: 'absolute',
    top: 19, // 与中间位置保持一致
    left: '71%',
    transform: [{ translateX: -25 }], // 居中调整
    fontSize: 55, // 数字 "04"
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mediumText: {
    fontSize: 30, // 字母 "A" 和 "B"
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  smallText: {
    fontSize: 12, // "TYPE"
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontStyle: 'italic',
    marginLeft: 5, // 与字母 "A" 和 "B" 的间距
  },
  rightBottom: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  historyButton: {
    backgroundColor: "#4944F1",
    marginHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  historyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
    width: 260, // px
    height: 40, // px
    flexShrink: 0,
    
    //fontFamily: 'Rubik', // 字体
    
    fontStyle: 'italic', // 正常字体样式
    fontWeight:800,
    lineHeight: 40, // px，对应设计中的行高
    textAlign: 'left', // 可选，根据布局需要调整对齐方式
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 26,
    marginVertical: 12,
  },
  actionCard: {
    width: 130, // px
    height: 88, // px
    flexShrink: 0,
    borderRadius: 15, // 圆角半径，与 SVG 的 `rx` 保持一致
    backgroundColor: '#D9D9D9', // 背景颜色
    shadowColor: '#000', // 投影颜色
    shadowOffset: {
      width: 0,
      height: 4, // 投影的垂直偏移，与 `dy` 对应
    },
    shadowOpacity: 0.25, // 投影不透明度
    shadowRadius: 2, // 高斯模糊半径，与 `stdDeviation` 对应
    elevation: 4, // Android 投影
  },
  
  actionText: {
    width: 169, // px
    height: 79, // px
    flexShrink: 0,
    color: '#727272',
    ///fontFamily: 'Rubik',
    fontSize: 16, // px
    fontStyle: 'italic',
    fontWeight: '800',
    lineHeight: 29, // px
    textAlign: 'left', // 可选
    marginLeft: 20,
    marginTop: 10,
  },
  menu: {
    marginTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  menuItemIcon: {
    width: 30,
    height: 30,
    marginRight: 16,
  },
  menuItemText: {
    width: 223, // px
    height: 30, // px
    flexShrink: 0,
    color: '#818181', // 文本颜色
    //fontFamily: 'Rubik', // 字体
    fontSize: 16, // px
    fontStyle: 'normal', // 正常字体样式
    fontWeight: '700', // 字重
    lineHeight: 19, // px，对应设计中的行高
    textAlign: 'left', // 可选，根据布局需要调整对齐方式
    paddingTop: 5,
  },
  menuArrow: {
    fontSize: 20,
    color: "#727272",
  },
  myCoursesIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
    marginLeft: 8,
  },
});