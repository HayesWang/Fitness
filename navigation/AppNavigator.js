import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import { IMAGES, COLORS } from '../constants/assets';

// 导入屏幕组件
import HomeScreen from '../screens/HomeScreen';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FreeExerciseScreen from '../screens/FreeExerciseScreen';
import PEClassesScreen from '../screens/PEClassesScreen';
import FreeExercise from '../screens/FreeExercise';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// CustomTabButton 组件
const CustomTabButton = ({ focused, onPress, icon, label, page, pageValue }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabButtonContainer}
    >
      <View style={[
        styles.tabButton,
        page === pageValue && styles.tabButtonActive
      ]}>
        <Image 
          source={icon} 
          style={styles.tabIcon}
        />
        {page === pageValue && <Text style={styles.tabLabel}>{label}</Text>}
      </View>
    </TouchableOpacity>
  );
};

// Tab导航器
function TabNavigator() {
  const [page, setPage] = React.useState(1);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarButton: (props) => {
          const { focused, onPress } = props;
          let icon;
          let label;
          let pageValue;

          if (route.name === 'Home') {
            icon = IMAGES.tabIcons.home.active;
            label = 'Home';
            pageValue = 1;
          } else if (route.name === 'Discover') {
            icon = IMAGES.tabIcons.discovery.active;
            label = 'Discover';
            pageValue = 2;
          } else if (route.name === 'Profile') {
            icon = IMAGES.tabIcons.profile.active;
            label = 'Profile';
            pageValue = 3;
          }

          return (
            <CustomTabButton 
              focused={focused}
              onPress={() => {
                setPage(pageValue);
                onPress();
              }}
              icon={icon}
              label={label}
              page={page}
              pageValue={pageValue}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoveryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 主导航器
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            };
          },
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="FreeExercise" component={FreeExerciseScreen} />
        <Stack.Screen name="PEClasses" component={PEClassesScreen} />
        <Stack.Screen name="Free" component={FreeExercise} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    alignSelf: 'center',
    height: 80,
    width: '100%',
    backgroundColor: '#ffffff',
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tabButtonContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#9E9E9E',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 16,
    gap: 8,
    height: 32,
    marginVertical: 4,
  },
  tabButtonActive: {
    backgroundColor: '#4744F2',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 16,
    gap: 8,
    height: 32,
    marginVertical: 4,
  },
  tabIcon: {
    width: 20,
    height: 20,
  },
  tabLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
 