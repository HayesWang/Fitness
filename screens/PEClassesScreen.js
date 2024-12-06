import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Rubik_600SemiBold_Italic } from '@expo-google-fonts/rubik';
import { useNavigation } from '@react-navigation/native';

const Calendar = ({ month, year, classSchedule }) => {
  const [fontsLoaded] = useFonts({
    'Rubik_600SemiBold_Italic': Rubik_600SemiBold_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  // 获取当前日期
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // 获取指定月份的第一天和最后一天
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // 从传入的classSchedule中只获取日期列表
  const classDateList = classSchedule.map(schedule => schedule.date);
  
  const weeks = [];
  let currentWeek = [];
  
  // 填充月初的空白日期
  const firstDayOfWeek = firstDay.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: null });
  }
  
  // 创建日历网格
  for (let i = 1; i <= daysInMonth; i++) {
    currentWeek.push({
      date: i,
      isClass: classDateList.includes(i),
      isToday: i === currentDate && 
               month === currentMonth && 
               year === currentYear,
      isTodayClass: i === currentDate && 
                    month === currentMonth && 
                    year === currentYear && 
                    classDateList.includes(i),
    });
    
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  }
  
  // 填充月末的空白日期
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: null });
    }
    weeks.push([...currentWeek]);
  }

  // 获取月份名称
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[month];

  return (
    <View>
      <View style={styles.calendarContainer}>
        <Text style={styles.monthText}>{`${monthName} ${year}`}</Text>
        <View style={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>
        <View style={styles.calendar}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((day, dayIndex) => (
                <View 
                  key={`${weekIndex}-${dayIndex}`} 
                  style={[
                    styles.dateCircle,
                    !day.date && styles.emptyDate,
                    day.isClass && !day.isTodayClass && styles.classDate,
                    day.isToday && !day.isTodayClass && styles.todayDate,
                    day.isTodayClass && styles.todayClassDate,
                  ]}
                >
                  <Text style={[
                    styles.dateText,
                    day.isToday && styles.todayDateText,
                    day.isClass && styles.classDateText,
                    day.isTodayClass && styles.todayClassDateText,
                  ]}>
                    {day.date}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const PEClassesScreen = () => {
  const scrollViewRef = React.useRef(null);
  const navigation = useNavigation();
  
  // 获取当前日期
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  
  // 修改后的课程安排
  const classSchedule = [
    // 9月课程
    {month: 8, date: 5},
    {month: 8, date: 12},
    {month: 8, date: 19},
    {month: 8, date: 26},
    // 10月课程
    {month: 9, date: 3},
    {month: 9, date: 10},
    {month: 9, date: 17},
    {month: 9, date: 24},
    // 11月课程
    {month: 10, date: 7},
    {month: 10, date: 13},
    {month: 10, date: 22},
    {month: 10, date: 25},
    {month: 10, date: 29},
    // 12月课
    {month: 11, date: 6},
    {month: 11, date: 11},
    {month: 11, date: 17},
    {month: 11, date: 27},
    // 1月课程
    {month: 0, date: 2},
    {month: 0, date: 9},
    {month: 0, date: 16},
    {month: 0, date: 23},
  ];
  
  // 判断今天是否有体育课
  const hasTodayClass = classSchedule.some(
    schedule => schedule.month === currentMonth && schedule.date === currentDate
  );

  // 生成要显示的月份列表 (比如显示前后2个月)
  const months = [-2, -1, 0, 1, 2].map(offset => {
    const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return {
      month: date.getMonth(),
      year: date.getFullYear()
    };
  });

  // 获取屏幕宽度
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth * 0.83; // 与cardContainer的width保持一致

  // 修改滚动到当前月份的逻辑
  React.useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: cardWidth * 2, // 使用cardWidth而不是screenWidth
        animated: false
      });
    }, 100);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>✕</Text>
      </TouchableOpacity>
      <View style={styles.cardContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>PE{'\n'}Classes</Text>
          <Image source={require('../assets/course.png')} style={styles.logo} />
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.content}
          snapToInterval={cardWidth}
          decelerationRate="fast"
        >
          {months.map((monthData, index) => (
            <View 
              key={index} 
              style={[
                styles.monthContainer,
                {width: cardWidth}
              ]}
            >
              <Calendar 
                month={monthData.month}
                year={monthData.year}
                classSchedule={classSchedule.filter(
                  schedule => schedule.month === monthData.month
                )}
              />
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity 
          style={[
            styles.signInButton,
            !hasTodayClass && styles.noClassButton
          ]}
          disabled={!hasTodayClass}
          onPress={() => navigation.navigate('CheckIn')}
        >
          <Text style={styles.signInText}>
            {hasTodayClass ? 'Sign in for Today\'s Lesson' : 'No Classes Today'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
    width: '87%',
    maxHeight: '88%',
    marginTop: 60,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
  },
  monthContainer: {
    paddingHorizontal: 10,
    // 移除width设置，因为我们现在在组件中动态设置
  },
  signInButton: {
    backgroundColor: '#FF6666',
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  noClassButton: {
    backgroundColor: '#999999',
  },
  logo: {
    width: 120,
    height: 120,
    position: 'absolute',
    right: -30,
    top: -20,
    zIndex: 0,
  },
  signInText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  calendarContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 5,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  calendar: {
    gap: 4,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  dateCircle: {
    width: 37,
    height: 37,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  classDate: {
    backgroundColor: '#E6E6FF',
    borderColor: '#6666FF',
  },
  todayDate: {
    backgroundColor: '#FFE6E6',
    borderColor: '#FF6666',
  },
  todayClassDate: {
    backgroundColor: '#E6FFE6',
    borderColor: '#66FF66',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  classDateText: {
    color: '#6666FF',
  },
  todayDateText: {
    color: '#FF6666',
    fontWeight: 'bold',
  },
  todayClassDateText: {
    color: '#66FF66',
    fontWeight: 'bold',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  weekDayText: {
    fontSize: 12,
    color: '#666',
    width: 40,
    textAlign: 'center',
  },
  emptyDate: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  infoText: {
    color: '#000',
    fontFamily: 'Rubik_600SemiBold_Italic',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 35,
    zIndex: 1,
  },
  logo: {
    width: 189,
    height: 189,
    position: 'absolute',
    right: -30,
    top: -70,
    zIndex: 0,
  },
  backButton: {
    position: 'absolute',
    top: 100,
    left: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#999999',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backButtonText: {
    fontSize: 25,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default PEClassesScreen; 