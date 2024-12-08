# Campus Fitness App

[![GitHub stars](https://img.shields.io/github/stars/HayesWang/Fitness)](https://github.com/HayesWang/Fitness/stargazers)

A modern fitness tracking application built with React Native and Expo, designed specifically for college students. The app provides comprehensive fitness tracking features, PE course management, and a social community platform.

## Getting Started

### Prerequisites

   ```bash
   node -v  # Ensure Node.js is installed
   npm install -g expo-cli
   ```

### Download the project

```bash
git clone https://github.com/HayesWang/Fitness.git
```

### Environment

Make sure you have node, npm, expo-cli installed.

### Dependencies

Fonts
```bash
npm install @expo-google-fonts/rubik @expo-google-fonts/rubik-mono-one
```
Other Dependencies
```bash
npm install @react-native-async-storage/async-storage @react-navigation/bottom-tabs @react-navigation/native @react-navigation/native-stack expo-location react-native-maps polyline
```

### API Key

You need to get a Google Maps API key to use the map features.(We have a default free tier for testing)

You need to get a OPENAI API key to use the chatbot and suggestion features.(We have a default free tier for testing)

### Run the app

```bash
npx expo start
```
   
## App Preview

<div align="center" style="font-size: 0;">
  <img src="docs/images/home.png" alt="Home Screen" width="250" style="display: inline-block;"/>
  <img src="docs/images/profile.png" alt="Profile Screen" width="250" style="display: inline-block;"/>
</div>

## Features

### 🏃‍♂️ Exercise Tracking

- **Free Exercise Mode**

  - Real-time GPS tracking with accurate distance measurement
  - Comprehensive metrics (duration, pace, calories)
  - Pause/resume functionality
  - Exercise history storage

- **Campus Routes**
  - Pre-defined campus running routes
  - Turn-by-turn navigation
  - Progress tracking and achievements

### 📚 PE Course Management

- **Course Schedule**
  - Semester-based PE course calendar
  - Interactive monthly view
  - Class reminders and notifications
- **Smart Check-in**
  - GPS-based attendance system
  - Classroom information and directions

### 👥 Social Features

- **Fitness Community**
  - Share workout achievements
  - Interactive social feed
  - Follow system and activity tracking
- **Course Forum**
  - Class discussions and announcements
  - Tips and experience sharing

### 👤 User Profile

- **Activity History**
  - Comprehensive exercise logs
  - Route replay
  - Data export options

## Technology Stack

### Core

- React Native (0.76.2)
- Expo (52.0.7)
- React (18.3.1)

### Navigation & UI

- React Navigation v7
- React Native Paper
- React Native Linear Gradient
- Expo Font with Rubik fonts

### Maps & Location

- React Native Maps
- Expo Location
- React Native Geolocation Service

### Data Visualization

- React Native Chart Kit
- React Native SVG
- @wuba/react-native-echarts

### Storage

- @react-native-async-storage/async-storage

## Project Structure

```
fitness/
├── assets/          # Images, fonts, and static resources
├── components/      # Reusable UI components
├── constants/       # App configuration and constants
├── navigation/      # Navigation configuration
├── screens/         # Main application screens
├── App.js          # Application root component
└── index.js        # Entry point
```

## Configuration Requirements

1. **Location Services**

   - Enable device location permissions
   - Configure location accuracy settings

2. **Maps Integration**
   - Set up Google Maps API key in app.json
   - Configure necessary map permissions

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
