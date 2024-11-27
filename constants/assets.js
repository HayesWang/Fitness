// 临时使用一些在线占位图片，实际开发时请替换为本地资源
export const IMAGES = {
  // 头像和用户相关
  avatar: require('../assets/avatar.png'),  // 请确保有这个默认头像图片
  notification: require('../assets/bell.png'),  // 请确保有这个通知图标
  
  // 底部导航图标 - 暂时使用相同的图标
  tabIcons: {
    home: {
      active: require('../assets/home.png'),
      inactive: require('../assets/home.png'),
    },
    discovery: {
      active: require('../assets/discovery.png'),
      inactive: require('../assets/discovery.png'),
    },
    profile: {
      active: require('../assets/profile.png'),
      inactive: require('../assets/profile.png'),
    },
  },

  // 功能卡片图标
  functionCards: {
    exercise: require('../assets/exercise.png'),
    course: require('../assets/course.png'),
  },

  gifs: {
    route: require('../assets/route.gif'),
    free: require('../assets/free.gif'),
  },
};

// 颜色主题
export const COLORS = {
  primary: '#4B6BF5',    // 蓝色主题色
  secondary: '#F5F5F5',  // 浅灰色背景
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#999999',
  },
  border: '#EEEEEE',
  white: '#FFFFFF',
};

// 尺寸规范
export const SIZES = {
  padding: {
    small: 8,
    medium: 16,
    large: 24,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
  },
  fontSize: {
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
  },
}; 