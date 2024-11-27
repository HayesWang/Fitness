import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Modal, Animated, ScrollView, Dimensions } from 'react-native';
import { IMAGES, COLORS, SIZES } from '../constants/assets';
import { useFonts, Rubik_400Regular, Rubik_800ExtraBold_Italic, Rubik_500Medium_Italic, Rubik_600SemiBold_Italic } from '@expo-google-fonts/rubik';
import { RubikMonoOne_400Regular } from '@expo-google-fonts/rubik-mono-one';
import * as SplashScreen from 'expo-splash-screen';

// Progress Bar Component
const ProgressBar = ({ progress, total, color }) => {
  const percentage = (progress / total) * 100;
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.progressText}>{progress}/{total}</Text>
    </View>
  );
};

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    'Rubik_400Regular': Rubik_400Regular,
    'Rubik_800ExtraBold_Italic': Rubik_800ExtraBold_Italic,
    'RubikMonoOne_400Regular': RubikMonoOne_400Regular,
    'Rubik_500Medium_Italic': Rubik_500Medium_Italic,
    'Rubik_600SemiBold_Italic': Rubik_600SemiBold_Italic
  });

  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-400)).current;

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const showModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 12,
      bounciness: 8,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: -400,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const cardsData = [
    // 第一页
    [
      {
        row1: [
          {
            title: 'New\nExercise',
            buttonType: 'start',
            image: IMAGES.functionCards.exercise
          }
        ],
        row2: [
          {
            title: 'PE\nCourses',
            buttonType: 'schedule',
            image: IMAGES.functionCards.course
          }
        ]
      }
    ],
    // 第二页
    [
      {
        row1: [
          {
            title: 'Card\nThree',
            buttonType: 'start',
            image: IMAGES.functionCards.cardThree
          }
        ],
        row2: [
          {
            title: 'Card\nFour',
            buttonType: 'start',
            image: IMAGES.functionCards.cardFour
          }
        ]
      }
    ]
  ];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={IMAGES.avatar} 
            style={styles.avatar}
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.usertype}>Student</Text>
            <Text style={styles.username}>Wang Xiaoming</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Image 
            source={IMAGES.notification} 
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Study Progress Card */}
      


      <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>This Semester{"\n"}Progress</Text>
            <Text style={styles.bigNumber}>25</Text>
          </View>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={showModal}
          >
            <Text style={styles.exploreButtonText}>Explore</Text>
          </TouchableOpacity>
      </View>

      {/* Quick Action Buttons */}
      <Text style={styles.quickActionsTitle}>Quick Actions</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickActionsContainer}
        contentContainerStyle={styles.quickActions}
      >
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Free Practice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Class Check-in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Advice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Schedule</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Function Cards */}
      <Text style={styles.functionsTitle}>Functions</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.functionCards}
        contentContainerStyle={styles.functionCardsContainer}
        pagingEnabled={true}
        snapToInterval={Dimensions.get('window').width - 40}
        decelerationRate="fast"
      >
        {cardsData.map((page, pageIndex) => (
          <View 
            key={pageIndex} 
            style={[
              styles.page,
              pageIndex === 0 ? { marginRight: 5 } : { marginLeft: 5 }
            ]}
          >
            <View style={styles.functionCardsRow}>
              {page[0].row1.map((card, index) => (
                <TouchableOpacity key={index} style={styles.functionCard}>
                  <View style={styles.cardContent}>
                    <View>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                      <TouchableOpacity style={card.buttonType === 'schedule' ? styles.scheduleButton : styles.startButton}>
                        <Text style={styles.buttonText}>
                          {card.buttonType === 'schedule' ? 'Schedule' : 'Start'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Image 
                      source={card.image}
                      style={styles.cardImage}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.functionCardsRow}>
              {page[0].row2.map((card, index) => (
                <TouchableOpacity key={index} style={styles.functionCard}>
                  <View style={styles.cardContent}>
                    <View>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                      <TouchableOpacity style={card.buttonType === 'schedule' ? styles.scheduleButton : styles.startButton}>
                        <Text style={styles.buttonText}>
                          {card.buttonType === 'schedule' ? 'Schedule' : 'Start'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Image 
                      source={card.image}
                      style={styles.cardImage}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalView,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.modalTitle}>Your semester{'\n'}progress</Text>
            
            <View style={styles.progressSection}>
              <Text style={[styles.categoryText, { color: '#FFFF00' }]}>Category A</Text>
              <ProgressBar progress={10} total={20} color="#FFFF00" />
            </View>

            <View style={styles.progressSection}>
              <Text style={[styles.categoryText, { color: '#FFA07A' }]}>Category B</Text>
              <ProgressBar progress={5} total={20} color="#FFA07A" />
            </View>

            <View style={styles.progressSection}>
              <Text style={[styles.categoryText, { color: '#90EE90' }]}>General</Text>
              <ProgressBar progress={15} total={40} color="#90EE90" />
            </View>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={hideModal}
            >
              <Text>✕</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding.large,
    zIndex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4B6BF5',
  },
  userTextContainer: {
    marginLeft: SIZES.padding.small,
    justifyContent: 'center',
  },
  usertype: {
    fontSize: SIZES.fontSize.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    fontFamily: 'Rubik_400Regular',
  },
  username: {
    fontSize: SIZES.fontSize.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    fontFamily: 'Rubik_500Medium_Italic',
    marginTop: 1,
  },
  notificationButton: {
    padding: SIZES.padding.small,
  },
  notificationIcon: {
    width: 24,
    height: 24,
  },
  progressCard: {
    margin: SIZES.padding.medium,
    padding: SIZES.padding.large,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
    fontFamily: 'Rubik_800ExtraBold_Italic',
  },
  bigNumber: {
    fontSize: 36,
    fontWeight: '400',
    color: '#4B6BF5',
    fontFamily: 'RubikMonoOne_400Regular',
    lineHeight: 36,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4B6BF5',
    borderRadius: 4,
  },
  progressNumbers: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  progressNumber: {
    fontSize: 14,
    color: '#4B6BF5',
    fontFamily: 'Rubik_400Regular',
  },
  progressTotal: {
    fontSize: 14,
    color: '#999999',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#EEEEEE',
  },
  sectionTitle: {
    position: 'absolute',
    top: 401,
    left: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // 快捷操作容器样式
  quickActionsContainer: {
    position: 'absolute',
    top: 361,
    left: 0,
    right: 0,
    height: 41,
    zIndex: 2,
  },
  quickActionsTitle: {
    position: 'absolute',
    top: 331,
    left: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // 快捷操作按钮组样式
  quickActions: {
    paddingHorizontal: 20, // 水平内边距
    gap: 12, // 按钮之间的间距
    flexDirection: 'row', // 水平排列
    alignItems: 'center', // 垂直居中对齐
  },
  actionButton: {
    width: 143,
    height: 41,
    flexShrink: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: 'rgba(217, 217, 217, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  functionCards: {
    position: 'absolute',
    top: 450,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  functionCardsContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  page: {
    width: Dimensions.get('window').width - 40,
  },
  functionCardsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
    zIndex: 12,
  },
  functionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    overflow: 'visible',
    width: 332,
    zIndex: 13,
  },
  functionsTitle: {
    position: 'absolute',
    top: 410,
    left: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 3,
  },
  cardTitle: {
    color: '#000000',
    fontFamily: 'Rubik_600SemiBold_Italic',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 35,
    marginBottom: 8,
    zIndex: 1,
  },
  startButton: {
    width: 99,
    height: 29,
    flexShrink: 0,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#FDFDFD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleButton: {
    width: 99,
    height: 29,
    flexShrink: 0,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#FDFDFD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#4B6BF5',
    fontSize: 14,
    fontFamily: 'Rubik_500Medium_Italic',
  },
  cardImage: {
    width: 190,
    height: 190,
    position: 'absolute',
    right: -30,
    top: -60,
    zIndex: 15,
  },
  exploreButton: {
    width: 99,
    height: 29,
    flexShrink: 0,
    borderRadius: 90,
    backgroundColor: '#FDFDFD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000'
  },
  exploreButtonText: {
    color: '#4B49F1',
    fontSize: 16,
    fontFamily: 'Rubik_500Medium_Italic',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: 332,
    height: 304,
    backgroundColor: '#4B6BF5',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  progressSection: {
    marginBottom: 14,
  },
  categoryText: {
    fontSize: 18,
    marginBottom: 3,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    color: 'white',
    fontSize: 16,
    minWidth: 50,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 10,
  },
});

